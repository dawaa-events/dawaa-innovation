/**
 * Meta WhatsApp Webhook Handler
 * 
 * Receives webhook events from Meta when:
 * - A guest presses a button (RSVP confirm/decline)
 * - A message is delivered/read
 * 
 * Meta webhook format for button clicks:
 * {
 *   object: "whatsapp_business_account",
 *   entry: [{
 *     changes: [{
 *       value: {
 *         messages: [{
 *           type: "interactive",
 *           interactive: {
 *             type: "button_reply",
 *             button_reply: { id: "btn_confirm", title: "أرغب في الحضور" }
 *           },
 *           from: "96899890431",
 *           context: { id: "wamid.xxx" }  // original message ID
 *         }]
 *       }
 *     }]
 *   }]
 * }
 */

import { Router } from "express";
import { getGuestByPhone, updateGuest, logWebhookEvent } from "./db";
import { handleRsvpClick, handleCardCountSelection } from "./rsvp-handler";
import { sendRsvpConfirmed, sendRsvpDeclined } from "./meta-api";
import { sendCardCountSelection } from "./meta-interactive";

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || "dawaa_webhook_2024";

export function registerMetaWebhook(app: Router) {
  // GET: Webhook verification (required by Meta)
  app.get("/api/webhook/meta", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    console.log(`[Webhook] Verification request: mode=${mode}, token=${token}`);

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("[Webhook] ✅ Verified successfully");
      res.status(200).send(challenge);
    } else {
      console.error("[Webhook] ❌ Verification failed");
      res.status(403).send("Forbidden");
    }
  });

  // POST: Receive webhook events from Meta
  app.post("/api/webhook/meta", async (req, res) => {
    // Always respond 200 immediately to Meta (within 20 seconds)
    res.status(200).send("OK");

    try {
      const body = req.body;
      console.log("[Webhook] Received:", JSON.stringify(body, null, 2));

      // Log every incoming webhook to DB for production debugging
      try {
        await logWebhookEvent({ eventType: 'meta_webhook_raw', payload: body });
      } catch (logErr) {
        console.error("[Webhook] Failed to log to DB:", logErr);
      }

      if (body.object !== "whatsapp_business_account") {
        console.log("[Webhook] Not a WhatsApp event, ignoring");
        return;
      }

      // Process each entry
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          const value = change.value;

          // Process messages
          for (const message of value.messages || []) {
            await processMessage(message, value);
          }

          // Process status updates (delivered, read, etc.)
          for (const status of value.statuses || []) {
            await processStatus(status);
          }
        }
      }
    } catch (error) {
      console.error("[Webhook] Error processing event:", error);
      // Log error to DB too
      try {
        await logWebhookEvent({ eventType: 'meta_webhook_error', payload: { error: String(error), body: req.body } });
      } catch (_) {}
    }
  });
}

async function processMessage(message: any, value: any) {
  const fromPhone = message.from; // e.g. "96899890431"
  const messageType = message.type;

  console.log(`[Webhook] Message from ${fromPhone}, type: ${messageType}`);

  // Handle interactive list reply (card count selection)
  if (messageType === "interactive" && message.interactive?.type === "list_reply") {
    const selectedId = message.interactive.list_reply.id; // e.g. "card_count_2"
    const selectedTitle = message.interactive.list_reply.title; // e.g. "2 أشخاص"
    const contextMessageId = message.context?.id;

    console.log(`[Webhook] List reply: ${selectedId} ("${selectedTitle}") from ${fromPhone}`);

    try {
      await logWebhookEvent({ 
        eventType: 'card_count_selected', 
        payload: { fromPhone, selectedId, selectedTitle, contextMessageId } 
      });
    } catch (_) {}

    const result = await handleCardCountSelection(fromPhone, selectedId, contextMessageId);

    console.log(`[Webhook] Card count processed: ${result.rsvpStatus}`);

    // Log success to DB
    try {
      await logWebhookEvent({ 
        eventType: 'card_count_processed', 
        payload: { phoneNumber: fromPhone, selectedId, confirmedCount: result.confirmedCount, declinedCount: result.declinedCount } 
      });
    } catch (_) {}

    // Send confirmation template after card selection
    if (result.rsvpStatus === "confirmed") {
      const sendResult = await sendRsvpConfirmed(fromPhone);
      console.log(`[Webhook] ✅ Sent dawaa_rsvp_confirmed: ${sendResult.messageId || sendResult.error}`);
    }
  }

  // Handle interactive button reply (newer Meta API format)
  if (messageType === "interactive" && message.interactive?.type === "button_reply") {
    const buttonId = message.interactive.button_reply.id; // "btn_confirm" or "btn_decline"
    const buttonTitle = message.interactive.button_reply.title;
    const contextMessageId = message.context?.id;

    console.log(`[Webhook] Interactive button press: ${buttonId} ("${buttonTitle}") from ${fromPhone}`);

    try {
      await logWebhookEvent({ 
        eventType: 'rsvp_button_press', 
        payload: { fromPhone, buttonId, buttonTitle, contextMessageId, format: 'interactive' } 
      });
    } catch (_) {}

    await handleRsvpButton(fromPhone, buttonId, contextMessageId);
  }

  // Handle quick reply button (older Meta API format - type: "button")
  // This is what Meta actually sends when a template quick reply button is pressed
  if (messageType === "button" && message.button) {
    const buttonPayload = message.button.payload || message.button.text || '';
    const buttonText = message.button.text || buttonPayload;
    const contextMessageId = message.context?.id;

    console.log(`[Webhook] Quick reply button press: "${buttonPayload}" from ${fromPhone}`);

    // Map button payload text to buttonId
    // IMPORTANT: Check for DECLINE keywords FIRST, because "اعتذر عن الحضور" contains "حضور"
    let buttonId = 'btn_unknown';
    const payloadLower = buttonPayload.toLowerCase();
    
    // Check for decline FIRST (before confirm)
    if (payloadLower.includes('اعتذر') || payloadLower.includes('أعتذر') || payloadLower.includes('decline') || payloadLower.includes('عذر')) {
      buttonId = 'btn_decline';
    } 
    // Then check for confirm
    else if (payloadLower.includes('ارغب') || payloadLower.includes('أرغب') || payloadLower.includes('confirm') || payloadLower.includes('حضور')) {
      buttonId = 'btn_confirm';
    }

    console.log(`[Webhook] Mapped to buttonId: ${buttonId}`);

    try {
      await logWebhookEvent({ 
        eventType: 'rsvp_button_press', 
        payload: { fromPhone, buttonId, buttonPayload, buttonText, contextMessageId, format: 'quick_reply' } 
      });
    } catch (_) {}

    await handleRsvpButton(fromPhone, buttonId, contextMessageId);
  }
}

async function handleRsvpButton(phoneNumber: string, buttonId: string, contextMessageId?: string) {
  try {
    // Find the guest by phone number
    const guest = await getGuestByPhone(phoneNumber);

    if (!guest) {
      console.error(`[Webhook] No guest found for phone: ${phoneNumber}`);
      // Log to DB
      try {
        await logWebhookEvent({ 
          eventType: 'rsvp_guest_not_found', 
          payload: { phoneNumber, buttonId } 
        });
      } catch (_) {}
      return;
    }

    console.log(`[Webhook] Found guest: ${guest.id} (${guest.guestName}), status: ${guest.rsvpStatus}`);

    // Process the RSVP
    const result = await handleRsvpClick({
      phoneNumber,
      buttonId,
      bookingId: guest.bookingId,
      guestId: guest.id,
      cardsCount: guest.cardsCount || 1,
      messageId: contextMessageId,
    });

    console.log(`[Webhook] RSVP processed: ${result.rsvpStatus}`);

    // Log success to DB
    try {
      await logWebhookEvent({ 
        eventType: 'rsvp_processed', 
        payload: { phoneNumber, buttonId, guestId: guest.id, rsvpStatus: result.rsvpStatus } 
      });
    } catch (_) {}

    // Send confirmation template directly via Meta API
    if (result.rsvpStatus === "confirmed") {
      const sendResult = await sendRsvpConfirmed(phoneNumber);
      console.log(`[Webhook] ✅ Sent dawaa_rsvp_confirmed: ${sendResult.messageId || sendResult.error}`);
    } else if (result.rsvpStatus === "declined") {
      const sendResult = await sendRsvpDeclined(phoneNumber);
      console.log(`[Webhook] ✅ Sent dawaa_rsvp_declined: ${sendResult.messageId || sendResult.error}`);
    } else if (result.rsvpStatus === "pending") {
      // Multiple cards: send interactive list for card count selection
      const cardsCount = guest.cardsCount || 1;
      if (cardsCount > 1) {
        const sendResult = await sendCardCountSelection(phoneNumber, guest.guestName, cardsCount);
        console.log(`[Webhook] ✅ Sent card count selection: ${sendResult.messageId || sendResult.error}`);
      }
    }

  } catch (error) {
    console.error(`[Webhook] Error handling RSVP button:`, error);
    // Log error to DB
    try {
      await logWebhookEvent({ 
        eventType: 'rsvp_error', 
        payload: { phoneNumber, buttonId, error: String(error) } 
      });
    } catch (_) {}
  }
}

async function processStatus(status: any) {
  const messageId = status.id;
  const statusValue = status.status; // "sent", "delivered", "read", "failed"
  const recipientId = status.recipient_id;

  console.log(`[Webhook] Status update: ${messageId} → ${statusValue} (to: ${recipientId})`);

  // Update guest delivery/read status
  try {
    const guest = await getGuestByPhone(recipientId);
    if (guest && guest.metaMessageId === messageId) {
      const updates: any = {};
      if (statusValue === "delivered") updates.deliveredAt = new Date();
      if (statusValue === "read") updates.readAt = new Date();

      if (Object.keys(updates).length > 0) {
        await updateGuest(guest.id, updates);
        console.log(`[Webhook] Updated guest ${guest.id} status: ${statusValue}`);
      }
    }
  } catch (error) {
    console.error("[Webhook] Error updating delivery status:", error);
  }
}
