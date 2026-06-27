/**
 * RSVP Handler - Processes WhatsApp button clicks and updates guest status
 * Handles: Confirm, Decline, Multiple cards selection
 */

import { getGuestById, getGuestByPhone, updateGuest } from "./db";
import { sendRsvpConfirmed, sendRsvpDeclined } from "./meta-api";

export interface RsvpPayload {
  phoneNumber: string;
  buttonId: string; // "btn_confirm" or "btn_decline"
  bookingId: string;
  guestId: string;
  cardsCount: number;
  messageId?: string;
}

export interface RsvpResult {
  success: boolean;
  rsvpStatus: "pending" | "confirmed" | "declined";
  confirmedCount: number;
  declinedCount: number;
  pendingCount: number;
  message?: string;
}

/**
 * Handle RSVP button click
 */
export async function handleRsvpClick(payload: RsvpPayload): Promise<RsvpResult> {
  try {
    // Get guest from database
    const guest = await getGuestById(payload.guestId);
    if (!guest) {
      throw new Error(`Guest not found: ${payload.guestId}`);
    }

    // Validate button ID
    const isConfirm = payload.buttonId === "btn_confirm";
    const isDecline = payload.buttonId === "btn_decline";

    if (!isConfirm && !isDecline) {
      throw new Error(`Invalid button ID: ${payload.buttonId}`);
    }

    console.log(`[RSVP] Processing ${isConfirm ? "CONFIRM" : "DECLINE"} for guest ${payload.guestId}`);

    // Determine new status
    let confirmedCount = 0;
    let declinedCount = 0;
    let pendingCount = 0;
    let rsvpStatus: "pending" | "confirmed" | "declined" = "pending";

    if (isConfirm) {
      // CONFIRM button clicked
      if (payload.cardsCount === 1) {
        // Single card: auto-confirm
        confirmedCount = 1;
        declinedCount = 0;
        pendingCount = 0;
        rsvpStatus = "confirmed";
        console.log(`[RSVP] Single card confirmed`);
      } else {
        // Multiple cards: send interactive list for selection
        // For now, mark as pending until user selects count
        rsvpStatus = "pending" as const;
        console.log(`[RSVP] Multiple cards - awaiting selection`);
      }
    } else if (isDecline) {
      // DECLINE button clicked
      confirmedCount = 0;
      declinedCount = payload.cardsCount;
      pendingCount = 0;
      rsvpStatus = "declined";
      console.log(`[RSVP] All ${payload.cardsCount} cards declined`);
    }

    // Update guest in database
    console.log(`[RSVP] Updating guest: status=${rsvpStatus}, confirmed=${confirmedCount}, declined=${declinedCount}, pending=${pendingCount}`);

    await updateGuest(payload.guestId, {
      rsvpStatus,
      confirmedCount,
      declinedCount,
      pendingCount,
      repliedAt: new Date(),
    });

    console.log(`[RSVP] Guest updated successfully`);

    return {
      success: true,
      rsvpStatus,
      confirmedCount,
      declinedCount,
      pendingCount,
    };
  } catch (error: any) {
    console.error(`[RSVP] Error handling RSVP:`, error);
    throw error;
  }
}

/**
 * Send confirmation template after RSVP - calls Meta API directly
 */
export async function sendConfirmationTemplate(
  phoneNumber: string,
  templateName: string,
  guestId: string,
  _bookingId: string
): Promise<void> {
  try {
    console.log(`[RSVP] Sending confirmation template directly via Meta API: ${templateName}`);

    let result;
    if (templateName === "dawaa_rsvp_confirmed") {
      result = await sendRsvpConfirmed(phoneNumber);
    } else {
      result = await sendRsvpDeclined(phoneNumber);
    }

    if (result.status === "failed") {
      console.error(`[RSVP] Meta API error: ${result.error}`);
      throw new Error(`Meta API failed: ${result.error}`);
    }

    // Update guest with the confirmation message ID
    if (result.messageId && guestId) {
      await updateGuest(guestId, { metaMessageId: result.messageId });
    }

    console.log(`[RSVP] ✅ Confirmation template sent: ${result.messageId}`);
  } catch (error: any) {
    console.error(`[RSVP] Error sending confirmation template:`, error);
    throw error;
  }
}

/**
 * Handle interactive list selection for multiple cards
 * Called when guest selects a number from the card count list
 */
export async function handleCardCountSelection(
  phoneNumber: string,
  selectedId: string,
  _contextMessageId?: string
): Promise<RsvpResult> {
  try {
    // Extract count from selectedId (e.g. "card_count_2" -> 2)
    const countMatch = selectedId.match(/card_count_(\d+)/);
    if (!countMatch) {
      throw new Error(`Invalid card count selection ID: ${selectedId}`);
    }

    const selectedCount = parseInt(countMatch[1], 10);

    // Get guest by phone number
    const guest = await getGuestByPhone(phoneNumber);
    if (!guest) {
      throw new Error(`Guest not found for phone: ${phoneNumber}`);
    }

    const totalCards = guest.cardsCount || 1;
    const confirmedCount = selectedCount;
    const declinedCount = totalCards - selectedCount;
    const pendingCount = 0;
    const rsvpStatus: "confirmed" = "confirmed";

    console.log(`[RSVP] Card count selected: ${selectedCount}/${totalCards} confirmed`);

    await updateGuest(guest.id, {
      rsvpStatus,
      confirmedCount,
      declinedCount,
      pendingCount,
      repliedAt: new Date(),
    });

    return {
      success: true,
      rsvpStatus,
      confirmedCount,
      declinedCount,
      pendingCount,
    };
  } catch (error: any) {
    console.error(`[RSVP] Error handling card count selection:`, error);
    throw error;
  }
}

/**
 * Handle interactive list selection for multiple cards (legacy)
 */
export async function handleCardSelection(
  guestId: string,
  selectedCount: number,
  totalCards: number
): Promise<RsvpResult> {
  try {
    const guest = await getGuestById(guestId);
    if (!guest) {
      throw new Error(`Guest not found: ${guestId}`);
    }

    const confirmedCount = selectedCount;
    const declinedCount = totalCards - selectedCount;
    const pendingCount = 0;
    const rsvpStatus: "confirmed" = "confirmed";

    console.log(`[RSVP] Card selection: ${selectedCount}/${totalCards} confirmed`);

    await updateGuest(guestId, {
      rsvpStatus,
      confirmedCount,
      declinedCount,
      pendingCount,
      repliedAt: new Date(),
    });

    return {
      success: true,
      rsvpStatus,
      confirmedCount,
      declinedCount,
      pendingCount,
    };
  } catch (error: any) {
    console.error(`[RSVP] Error handling card selection:`, error);
    throw error;
  }
}
