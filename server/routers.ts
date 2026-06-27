import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  createGuest,
  getGuestsByBooking,
  getGuestById,
  getGuestByPhone,
  updateGuest,
  deleteGuest,
  deleteGuestsByIds,
  getPendingGuests,
  getBookingStats,
  createMessageStatusLog,
  logWebhookEvent,
  getTemplateByName,
} from "./db";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";
import { handleRsvpClick, sendConfirmationTemplate } from "./rsvp-handler";
import { sendWeddingInvitation } from "./meta-api";
import { sendCardCountSelection } from "./meta-interactive";
import { remindersRouter } from "./routers-reminders";

// Utility: Clean phone numbers according to Oman 968 rules
function cleanPhoneNumber(phone: string): string {
  // Remove spaces, plus signs, and leading zeros
  let cleaned = phone.replace(/\s+/g, "").replace(/^\+/, "").replace(/^00/, "");

  // If 8 digits, add Oman country code 968
  if (cleaned.length === 8 && !cleaned.startsWith("968")) {
    cleaned = "968" + cleaned;
  }

  // Validate: should start with 968 or be a valid international number
  if (!cleaned.startsWith("968") && cleaned.length < 10) {
    throw new Error(`Invalid phone number: ${phone}`);
  }

  return cleaned;
}

// Utility: Generate QR value (can be enhanced later)
function generateQrValue(guestId: string, bookingId: string, cardIndex: number): string {
  return `${bookingId}:${guestId}:${cardIndex}:${uuidv4()}`;
}

// Utility: Generate short code
function generateShortCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============= BOOKINGS ROUTER =============
  bookings: router({
    create: protectedProcedure
      .input(
        z.object({
          clientName: z.string().min(1),
          clientPhone: z.string().min(1),
          eventDate: z.date(),
          eventType: z.string().optional(),
          venueName: z.string().optional(),
          locationLink: z.string().optional(),
          receptionTime: z.string().optional(),
          hostOne: z.string().optional(),
          hostTwo: z.string().optional(),
          brideName: z.string().optional(),
          groomName: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await createBooking(input);
          return { success: true };
        } catch (error) {
          console.error("Error creating booking:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create booking",
          });
        }
      }),

    list: publicProcedure.query(async () => {
      try {
        return await getBookings();
      } catch (error) {
        console.error("Error getting bookings:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get bookings",
        });
      }
    }),

    getById: publicProcedure
      .input(z.object({ bookingId: z.string() }))
      .query(async ({ input }) => {
        try {
          const booking = await getBookingById(input.bookingId);
          if (!booking) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Booking not found",
            });
          }
          return booking;
        } catch (error) {
          console.error("Error getting booking:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get booking",
          });
        }
      }),

    update: protectedProcedure
      .input(
        z.object({
          bookingId: z.string(),
          clientName: z.string().optional(),
          clientPhone: z.string().optional(),
          eventDate: z.date().optional(),
          eventType: z.string().optional(),
          venueName: z.string().optional(),
          locationLink: z.string().optional(),
          receptionTime: z.string().optional(),
          hostOne: z.string().optional(),
          hostTwo: z.string().optional(),
          brideName: z.string().optional(),
          groomName: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const { bookingId, ...updateData } = input;
          await updateBooking(bookingId, updateData);
          return { success: true };
        } catch (error) {
          console.error("Error updating booking:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update booking",
          });
        }
      }),

    delete: protectedProcedure
      .input(z.object({ bookingId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          // TODO: Implement delete logic
          return { success: true };
        } catch (error) {
          console.error("Error deleting booking:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete booking",
          });
        }
      }),

    getStats: protectedProcedure
      .input(z.object({ bookingId: z.string() }))
      .query(async ({ input }) => {
        try {
          return await getBookingStats(input.bookingId);
        } catch (error) {
          console.error("Error getting booking stats:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get booking stats",
          });
        }
      }),
  }),

  // ============= GUESTS ROUTER =============
  guests: router({
    create: publicProcedure
      .input(
        z.object({
          bookingId: z.string(),
          guestName: z.string().min(1),
          phoneNumber: z.string().min(1),
          cardsCount: z.number().default(1),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const cleanedPhone = cleanPhoneNumber(input.phoneNumber);
          const shortCode = generateShortCode();
          const qrValue = generateQrValue(uuidv4(), input.bookingId, 0);

          const createdGuest = await createGuest({
            bookingId: input.bookingId,
            guestName: input.guestName,
            phoneNumber: cleanedPhone,
            cardsCount: input.cardsCount,
            shortCode,
            qrValue,
            notes: input.notes,
          });

          return createdGuest;
        } catch (error: any) {
          console.error("Error creating guest:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "Failed to create guest",
          });
        }
      }),

    getByBooking: publicProcedure
      .input(z.object({ bookingId: z.string() }))
      .query(async ({ input }) => {
        try {
          return await getGuestsByBooking(input.bookingId);
        } catch (error) {
          console.error("Error getting guests:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get guests",
          });
        }
      }),

    getById: publicProcedure
      .input(z.object({ guestId: z.string() }))
      .query(async ({ input }) => {
        try {
          const guest = await getGuestById(input.guestId);
          if (!guest) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Guest not found",
            });
          }
          return guest;
        } catch (error) {
          console.error("Error getting guest:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get guest",
          });
        }
      }),

    update: publicProcedure
      .input(
        z.object({
          guestId: z.string(),
          guestName: z.string().optional(),
          phoneNumber: z.string().optional(),
          cardsCount: z.number().optional(),
          rsvpStatus: z.enum(["pending", "confirmed", "declined", "sent", "delivered", "read", "failed", "checked-in"]).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const { guestId, ...updateData } = input;
          await updateGuest(guestId, updateData);
          return { success: true };
        } catch (error: any) {
          console.error("Error updating guest:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "Failed to update guest",
          });
        }
      }),

    delete: protectedProcedure
      .input(z.object({ guestId: z.string() }))
      .mutation(async ({ input }) => {
        try {
          await deleteGuest(input.guestId);
          return { success: true };
        } catch (error: any) {
          console.error("Error deleting guest:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "Failed to delete guest",
          });
        }
      }),

    bulkDelete: protectedProcedure
      .input(z.object({ guestIds: z.array(z.string()) }))
      .mutation(async ({ input }) => {
        try {
          if (input.guestIds.length === 0) {
            throw new Error("No guests to delete");
          }
          await deleteGuestsByIds(input.guestIds);
          return { success: true, deletedCount: input.guestIds.length };
        } catch (error: any) {
          console.error("Error bulk deleting guests:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "Failed to bulk delete guests",
          });
        }
      }),

    getPending: protectedProcedure
      .input(z.object({ bookingId: z.string() }))
      .query(async ({ input }) => {
        try {
          return await getPendingGuests(input.bookingId);
        } catch (error) {
          console.error("Error getting pending guests:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get pending guests",
          });
        }
      }),

    getByPhone: publicProcedure
      .input(z.object({ phoneNumber: z.string() }))
      .query(async ({ input }) => {
        try {
          const guest = await getGuestByPhone(input.phoneNumber);
          if (!guest) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Guest not found",
            });
          }
          return guest;
        } catch (error) {
          console.error("Error getting guest by phone:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get guest",
          });
        }
      }),
  }),

  // ============= INVITATION SENDING ROUTER =============
  invitations: router({
    sendToGuests: protectedProcedure
      .input(
        z.object({
          bookingId: z.string(),
          guestIds: z.array(z.string()),
          templateName: z.string().default("dawaa_wedding_invitation"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const booking = await getBookingById(input.bookingId);
          if (!booking) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Booking not found",
            });
          }

          const template = await getTemplateByName(input.templateName);
          if (!template) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `Template ${input.templateName} not found`,
            });
          }

          // Get guest data
          const guestsToSend = await Promise.all(
            input.guestIds.map((id) => getGuestById(id))
          );

          const validGuests = guestsToSend.filter((g) => g !== null);
          if (validGuests.length === 0) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "No valid guests found",
            });
          }

          // Send directly via Meta API (bypassing n8n)
          let sentCount = 0;
          const errors: string[] = [];

          for (const guest of validGuests) {
            try {
              const result = await sendWeddingInvitation({
                phoneNumber: guest!.phoneNumber,
                guestName: guest!.guestName,
                hostOne: booking.hostOne || "",
                hostTwo: booking.hostTwo || "",
                brideName: booking.brideName || "",
                groomName: booking.groomName || "",
                cardsCount: guest!.cardsCount || 1,
              });

              if (result.status === "sent") {
                // Update guest record with message ID and sent timestamp
                await updateGuest(guest!.id, {
                  metaMessageId: result.messageId,
                  invitationSentAt: new Date(),
                });
                sentCount++;
                console.log(`[Invitations] ✅ Sent to ${guest!.guestName} (${guest!.phoneNumber}): ${result.messageId}`);

                // If guest has multiple cards, send card count selection immediately
                const cardsCount = guest!.cardsCount || 1;
                if (cardsCount > 1) {
                  try {
                    const cardSelectionResult = await sendCardCountSelection(
                      guest!.phoneNumber,
                      guest!.guestName,
                      cardsCount
                    );
                    if (cardSelectionResult.status === "sent") {
                      console.log(`[Invitations] ✅ Sent card count selection to ${guest!.guestName}: ${cardSelectionResult.messageId}`);
                    } else {
                      console.error(`[Invitations] ❌ Failed to send card count selection to ${guest!.guestName}: ${cardSelectionResult.error}`);
                    }
                  } catch (cardError: any) {
                    console.error(`[Invitations] Error sending card count selection to ${guest!.guestName}:`, cardError);
                  }
                }
              } else {
                errors.push(`${guest!.guestName}: ${result.error}`);
                console.error(`[Invitations] ❌ Failed for ${guest!.guestName}: ${result.error}`);
              }
            } catch (guestError: any) {
              errors.push(`${guest!.guestName}: ${guestError.message}`);
              console.error(`[Invitations] Error for ${guest!.guestName}:`, guestError);
            }
          }

          return { success: true, sentCount, errors };
        } catch (error: any) {
          console.error("Error sending invitations:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "Failed to send invitations",
          });
        }
      }),

    updateSendStatus: publicProcedure
      .input(
        z.object({
          guestId: z.string(),
          metaMessageId: z.string(),
          status: z.enum(["sent", "delivered", "read", "failed"]).default("sent"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await updateGuest(input.guestId, {
            metaMessageId: input.metaMessageId,
            rsvpStatus: input.status as any,
            invitationSentAt: input.status === "sent" ? new Date() : undefined,
            deliveredAt: input.status === "delivered" ? new Date() : undefined,
            readAt: input.status === "read" ? new Date() : undefined,
          });
          return { success: true };
        } catch (error: any) {
          console.error("Error updating send status:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "Failed to update send status",
          });
        }
      }),
  }),

  // ============= MESSAGE STATUS ROUTER =============
  messageStatus: router({
    log: protectedProcedure
      .input(
        z.object({
          metaMessageId: z.string(),
          status: z.enum(["sent", "delivered", "read", "failed"]),
          messageId: z.string().optional(),
          errorDetails: z.record(z.string(), z.any()).optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await createMessageStatusLog(input);
          return { success: true };
        } catch (error) {
          console.error("Error logging message status:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to log message status",
          });
        }
      }),
  }),

  // ============= WEBHOOK ROUTER =============
  webhooks: router({
    logEvent: publicProcedure
      .input(
        z.object({
          eventType: z.string(),
          payload: z.any(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await logWebhookEvent(input);
          return { success: true };
        } catch (error) {
          console.error("Error logging webhook:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to log webhook",
          });
        }
      }),

    handleRsvp: publicProcedure
      .input(
        z.object({
          phoneNumber: z.string(),
          buttonId: z.string(),
          bookingId: z.string(),
          guestId: z.string(),
          cardsCount: z.number().default(1),
          messageId: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await handleRsvpClick({
            phoneNumber: input.phoneNumber,
            buttonId: input.buttonId,
            bookingId: input.bookingId,
            guestId: input.guestId,
            cardsCount: input.cardsCount,
            messageId: input.messageId,
          });

          const templateName =
            result.rsvpStatus === "confirmed"
              ? "dawaa_rsvp_confirmed"
              : "dawaa_rsvp_declined";

          try {
            await sendConfirmationTemplate(
              input.phoneNumber,
              templateName,
              input.guestId,
              input.bookingId
            );
          } catch (error) {
            console.error("Error sending confirmation template:", error);
          }

          return result;
        } catch (error: any) {
          console.error("Error handling RSVP:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "Failed to handle RSVP",
          });
        }
      }),
    }),
  reminders: remindersRouter,
  demo: router({
    createDemoBooking: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          phone: z.string().min(8),
          location: z.string().min(1),
          groom: z.string().min(1),
          bride: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const cleanedPhone = cleanPhoneNumber(input.phone);
          const bookingId = uuidv4();
          
          const booking = await createBooking({
            clientName: input.name,
            clientPhone: cleanedPhone,
            eventDate: new Date(),
            eventType: 'demo',
            venueName: input.location,
            brideName: input.bride,
            groomName: input.groom,
            notes: 'تجربة مجانية من صفحة الهبوط',
          });

          try {
            await sendWeddingInvitation({
              phoneNumber: cleanedPhone,
              guestName: input.name,
              hostOne: input.groom,
              hostTwo: input.bride,
              brideName: input.bride,
              groomName: input.groom,
              cardsCount: 1,
            });
          } catch (whatsappError) {
            console.error('WhatsApp send error:', whatsappError);
          }

          return {
            success: true,
            bookingId,
            message: 'تم إنشاء المناسبة التجريبية بنجاح',
          };
        } catch (error: any) {
          console.error('Error creating demo booking:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.message || 'فشل في إنشاء المناسبة التجريبية',
          });
        }
      }),
  }),
});
export type AppRouter = typeof appRouter;
