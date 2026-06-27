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

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || process.env.VERIFY_TOKEN || "dawaa2026";

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
    // IMPORTANT FOR VERCEL / SERVERLESS:
    // Do NOT send the response before processing. Some serverless runtimes freeze
    // execution immediately after res.send(), which causes RSVP updates and
    // confirmation templates to never run. Process first, then return 200.
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
        if (!res.headersSent) {
          res.status(200).send("OK");
        }
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
      if (!res.headersSent) {
        res.status(200).send("OK");
      }
    } catch (error) {
      console.error("[Webhook] Error processing event:", error);
      // Log error to DB too
      try {
        await logWebhookEvent({ eventType: 'meta_webhook_error', payload: { error: String(error), body: req.body } });
      } catch (_) {}

      // Meta expects 200 for webhook receipt. Return 200 even when internal
      // processing fails so Meta does not repeatedly retry the same event; the
      // failure is visible in webhook_logs / Vercel logs.
      if (!res.headersSent) {
        res.status(200).send("OK");
      }
    }
  });
}

function mapRsvpButtonId(rawValue: string | undefined | null): "btn_confirm" | "btn_decline" | "btn_unknown" {
  const value = String(rawValue || "").trim().toLowerCase();

  // Decline must be checked first because Arabic decline text may contain
  // the word حضور as part of "أعتذر عن الحضور".
  if (
    value.includes("btn_decline") ||
    value.includes("decline") ||
    value.includes("أعتذر") ||
    value.includes("اعتذر") ||
    value.includes("معتذر") ||
    value.includes("عذر") ||
    value.includes("لا استطيع") ||
    value.includes("لا أستطيع")
  ) {
    return "btn_decline";
  }

  if (
    value.includes("btn_confirm") ||
    value.includes("confirm") ||
    value.includes("أرغب") ||
    value.includes("ارغب") ||
    value.includes("حاضر") ||
    value.includes("حضور")
  ) {
    return "btn_confirm";
  }

  return "btn_unknown";
}

async function processMessage(message: any, value: any) {
  const fromPhone = message.from || value?.contacts?.[0]?.wa_id; // e.g. "96899890431"
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
    const rawButtonId = message.interactive.button_reply.id;
    const buttonTitle = message.interactive.button_reply.title;
    const buttonId = mapRsvpButtonId(rawButtonId) !== "btn_unknown"
      ? mapRsvpButtonId(rawButtonId)
      : mapRsvpButtonId(buttonTitle);
    const contextMessageId = message.context?.id;

    console.log(`[Webhook] Interactive button press: ${rawButtonId} ("${buttonTitle}") from ${fromPhone} → ${buttonId}`);

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

    // Map button payload/text to a stable buttonId. Payload sometimes comes
    // as "btn_confirm" and sometimes as the Arabic button text itself.
    const buttonIdFromPayload = mapRsvpButtonId(buttonPayload);
    const buttonId = buttonIdFromPayload !== "btn_unknown"
      ? buttonIdFromPayload
      : mapRsvpButtonId(buttonText);

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
    if (!phoneNumber) {
      console.error(`[Webhook] Missing phone number for RSVP button: ${buttonId}`);
      return;
    }

    if (buttonId === "btn_unknown") {
      console.error(`[Webhook] Unknown RSVP button for phone ${phoneNumber}`);
      try {
        await logWebhookEvent({ eventType: 'rsvp_unknown_button', payload: { phoneNumber, buttonId, contextMessageId } });
      } catch (_) {}
      return;
    }

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
