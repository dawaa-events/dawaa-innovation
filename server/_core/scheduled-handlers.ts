import { Router } from "express";
import { sdk } from "./sdk";
import { sendRsvpReminders, sendEntryCards } from "../reminders";

export const scheduledHandlers = Router();

/**
 * Handler for RSVP reminders scheduled task
 * POST /api/scheduled/rsvp-reminders
 */
scheduledHandlers.post("/api/scheduled/rsvp-reminders", async (req, res) => {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ error: "bookingId required" });
    }

    const result = await sendRsvpReminders(bookingId);
    res.json({ ok: true, ...result });
  } catch (error: any) {
    console.error("[ScheduledHandler] RSVP reminders error:", error);
    res.status(500).json({
      error: error.message || "Internal server error",
      stack: error.stack,
      context: { url: req.url, taskUid: req.body?.taskUid },
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Handler for entry cards scheduled task
 * POST /api/scheduled/entry-cards
 */
scheduledHandlers.post("/api/scheduled/entry-cards", async (req, res) => {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) {
      return res.status(403).json({ error: "cron-only" });
    }

    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ error: "bookingId required" });
    }

    const result = await sendEntryCards(bookingId);
    res.json({ ok: true, ...result });
  } catch (error: any) {
    console.error("[ScheduledHandler] Entry cards error:", error);
    res.status(500).json({
      error: error.message || "Internal server error",
      stack: error.stack,
      context: { url: req.url, taskUid: req.body?.taskUid },
      timestamp: new Date().toISOString(),
    });
  }
});
