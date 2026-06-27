import { getDb } from "./db";
import { eq, and } from "drizzle-orm";
import { guests, bookings } from "../drizzle/schema";
import { sendRsvpReminder, sendEntryCard } from "./meta-api";

/**
 * Send RSVP reminders to guests who haven't responded yet
 */
export async function sendRsvpReminders(bookingId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get booking details
  const booking = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);

  if (!booking || booking.length === 0) {
    throw new Error(`Booking not found: ${bookingId}`);
  }

  const bookingData = booking[0];
  const eventDate = bookingData.eventDate 
    ? new Date(bookingData.eventDate).toLocaleDateString('ar-SA')
    : 'TBD';

  // Get pending guests
  const pendingGuests = await db
    .select()
    .from(guests)
    .where(
      and(
        eq(guests.bookingId, bookingId),
        eq(guests.rsvpStatus, "pending")
      )
    );

  console.log(`[Reminders] Found ${pendingGuests.length} pending guests for booking ${bookingId}`);

  // Send reminder to each pending guest
  const results = [];
  for (const guest of pendingGuests) {
    try {
      const result = await sendRsvpReminder(
        guest.phoneNumber,
        guest.guestName,
        eventDate
      );

      if (result.status === "sent") {
        console.log(`[Reminders] Reminder sent to ${guest.guestName}: ${result.messageId}`);
      } else {
        console.error(`[Reminders] Failed to send reminder to ${guest.guestName}: ${result.error}`);
      }
      
      results.push({
        guestId: guest.id,
        guestName: guest.guestName,
        phoneNumber: guest.phoneNumber,
        messageId: result.messageId,
        status: result.status,
        error: result.error,
      });
    } catch (error) {
      console.error(`[Reminders] Exception sending reminder to ${guest.guestName}:`, error);
      results.push({
        guestId: guest.id,
        guestName: guest.guestName,
        phoneNumber: guest.phoneNumber,
        messageId: "",
        status: "failed",
        error: String(error),
      });
    }
  }

  return {
    bookingId,
    totalPending: pendingGuests.length,
    remindersSent: results.filter(r => r.status === "sent").length,
    remindersFailed: results.filter(r => r.status === "failed").length,
    results,
  };
}

/**
 * Send entry cards to confirmed guests
 */
export async function sendEntryCards(bookingId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get booking details
  const booking = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);

  if (!booking || booking.length === 0) {
    throw new Error(`Booking not found: ${bookingId}`);
  }

  const bookingData = booking[0];
  const eventDate = bookingData.eventDate 
    ? new Date(bookingData.eventDate).toLocaleDateString('ar-SA')
    : 'TBD';

  // Get confirmed guests
  const confirmedGuests = await db
    .select()
    .from(guests)
    .where(
      and(
        eq(guests.bookingId, bookingId),
        eq(guests.rsvpStatus, "confirmed")
      )
    );

  console.log(`[EntryCards] Found ${confirmedGuests.length} confirmed guests for booking ${bookingId}`);

  const results = [];
  for (const guest of confirmedGuests) {
    try {
      const qrValue = guest.qrValue || `${bookingId}:${guest.id}`;
      
      const result = await sendEntryCard(
        guest.phoneNumber,
        guest.guestName,
        qrValue,
        eventDate
      );

      if (result.status === "sent") {
        console.log(`[EntryCards] Entry card sent to ${guest.guestName}: ${result.messageId}`);
      } else {
        console.error(`[EntryCards] Failed to send entry card to ${guest.guestName}: ${result.error}`);
      }
      
      results.push({
        guestId: guest.id,
        guestName: guest.guestName,
        phoneNumber: guest.phoneNumber,
        qrValue,
        messageId: result.messageId,
        status: result.status,
        error: result.error,
      });
    } catch (error) {
      console.error(`[EntryCards] Exception sending entry card to ${guest.guestName}:`, error);
      results.push({
        guestId: guest.id,
        guestName: guest.guestName,
        phoneNumber: guest.phoneNumber,
        qrValue: guest.qrValue || "",
        messageId: "",
        status: "failed",
        error: String(error),
      });
    }
  }

  return {
    bookingId,
    totalConfirmed: confirmedGuests.length,
    cardsSent: results.filter(r => r.status === "sent").length,
    cardsFailed: results.filter(r => r.status === "failed").length,
    results,
  };
}
