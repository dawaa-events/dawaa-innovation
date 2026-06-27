import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { sendRsvpReminders, sendEntryCards } from "./reminders";
import { TRPCError } from "@trpc/server";

export const remindersRouter = router({
  /**
   * Send RSVP reminders for a booking
   */
  sendReminders: publicProcedure
    .input(
      z.object({
        bookingId: z.string().min(1),
      })
    )
    .mutation(async ({ input }: any) => {
      try {
        const result = await sendRsvpReminders(input.bookingId);
        return result;
      } catch (error: any) {
        console.error("Error sending reminders:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to send reminders",
        });
      }
    }),

  /**
   * Send entry cards for a booking
   */
  sendEntryCards: publicProcedure
    .input(
      z.object({
        bookingId: z.string().min(1),
      })
    )
    .mutation(async ({ input }: any) => {
      try {
        const result = await sendEntryCards(input.bookingId);
        return result;
      } catch (error: any) {
        console.error("Error sending entry cards:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to send entry cards",
        });
      }
    }),
});
