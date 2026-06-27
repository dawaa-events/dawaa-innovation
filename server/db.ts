import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import {
  bookings,
  guests,
  messageStatusLogs,
  users,
} from "../drizzle/schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dbInstance: any = null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  try {
    // Parse DATABASE_URL if available, otherwise use individual env vars
    const databaseUrl = process.env.DATABASE_URL || process.env.DRIZZLE_DATABASE_URL;
    
    let pool;
    if (databaseUrl) {
      // Parse MySQL connection string
      // Format: mysql://user:password@host:port/database
      const url = new URL(databaseUrl);
      const host = url.hostname;
      const user = url.username;
      const password = url.password;
      const database = url.pathname.slice(1); // Remove leading /
      
      console.log(`[DB] Connecting to ${host}/${database}`);
      
      pool = mysql.createPool({
        host,
        user,
        password,
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ssl: url.searchParams.get('ssl') ? { rejectUnauthorized: false } : undefined,
      });
    } else {
      // Fallback to individual env vars
      pool = mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "dawaa_events",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }

    dbInstance = drizzle(pool, { schema, mode: "default" });
    console.log(`[DB] Connected successfully`);
    return dbInstance;
  } catch (error) {
    console.error("Failed to connect to database:", error);
    throw error;
  }
}

// ============= BOOKINGS QUERIES =============

export async function createBooking(data: {
  clientName: string;
  clientPhone: string;
  eventDate: Date;
  eventType?: string;
  venueName?: string;
  locationLink?: string;
  receptionTime?: string;
  hostOne?: string;
  hostTwo?: string;
  brideName?: string;
  groomName?: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { v4: uuidv4 } = await import("uuid");
  const bookingId = uuidv4();

  await db.insert(bookings).values({
    id: bookingId,
    clientName: data.clientName,
    clientPhone: data.clientPhone,
    eventDate: data.eventDate,
    eventType: data.eventType || 'wedding',
    venueName: data.venueName,
    locationLink: data.locationLink,
    receptionTime: data.receptionTime,
    hostOne: data.hostOne,
    hostTwo: data.hostTwo,
    brideName: data.brideName,
    groomName: data.groomName,
    notes: data.notes,
  } as any);

  const result = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);

  return result[0];
}

export async function getBookingById(bookingId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function listBookings() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.select().from(bookings).orderBy(bookings.createdAt);
}

export async function updateBooking(
  bookingId: string,
  data: Partial<typeof bookings.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(bookings)
    .set({ ...data, updatedAt: new Date() } as any)
    .where(eq(bookings.id, bookingId));
}

// ============= GUESTS QUERIES =============

export async function createGuest(data: {
  bookingId: string;
  guestName: string;
  phoneNumber: string;
  cardsCount?: number;
  shortCode?: string;
  qrValue?: string;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { v4: uuidv4 } = await import("uuid");
  const guestId = uuidv4();

  console.log(`[DB] Creating guest with ID: ${guestId}`);
  await db.insert(guests).values({
    id: guestId,
    bookingId: data.bookingId,
    guestName: data.guestName,
    phoneNumber: data.phoneNumber,
    cardsCount: data.cardsCount || 1,
    shortCode: data.shortCode,
    qrValue: data.qrValue,
    notes: data.notes,
    pendingCount: 1,
    rsvpStatus: "pending",
  } as any);
  console.log(`[DB] Guest inserted, now verifying...`);

  const result = await db
    .select()
    .from(guests)
    .where(eq(guests.id, guestId))
    .limit(1);

  console.log(`[DB] Verification result:`, result);
  return result[0];
}

export async function getGuestById(guestId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  console.log(`[DB] Querying guest by ID: ${guestId}`);
  const result = await db
    .select()
    .from(guests)
    .where(eq(guests.id, guestId))
    .limit(1);

  console.log(`[DB] Query result:`, result);
  return result.length > 0 ? result[0] : null;
}

export async function getGuestsByBooking(bookingId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(guests)
    .where(eq(guests.bookingId, bookingId))
    .orderBy(guests.sequenceNumber);
}

export async function getGuestByPhone(phoneNumber: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Meta sends phone numbers without +. Existing guest records may be stored as:
  // 968XXXXXXXX, +968XXXXXXXX, 00XXXXXXXX, or local 8-digit Oman numbers.
  const digits = String(phoneNumber || "").replace(/\D/g, "");
  const withoutPlus = String(phoneNumber || "").replace(/^\+/, "").trim();
  const localOman = digits.startsWith("968") && digits.length > 8 ? digits.slice(3) : digits;

  const variants = Array.from(new Set([
    withoutPlus,
    digits,
    `+${digits}`,
    localOman,
    `968${localOman}`,
    `+968${localOman}`,
  ].filter(Boolean)));

  console.log(`[DB] Looking up guest by phone. input=${phoneNumber}, variants=${variants.join(",")}`);

  // 1) Prefer pending guest, because that is the current invitation waiting for RSVP.
  for (const candidate of variants) {
    const pendingResult = await db
      .select()
      .from(guests)
      .where(and(eq(guests.phoneNumber, candidate), eq(guests.rsvpStatus, 'pending')))
      .orderBy(desc(guests.createdAt))
      .limit(1);

    if (pendingResult.length > 0) {
      console.log(`[DB] Found pending guest by exact phone match: ${candidate}`);
      return pendingResult[0];
    }
  }

  // 2) Fall back to any most recent exact phone variant.
  for (const candidate of variants) {
    const result = await db
      .select()
      .from(guests)
      .where(eq(guests.phoneNumber, candidate))
      .orderBy(desc(guests.createdAt))
      .limit(1);

    if (result.length > 0) {
      console.log(`[DB] Found guest by exact phone match: ${candidate}`);
      return result[0];
    }
  }

  // 3) Last fallback: compare by last 8 digits for Oman-local stored numbers.
  // This keeps the site unchanged and fixes old imported guest lists.
  if (localOman.length >= 8) {
    const suffix = localOman.slice(-8);

    const pendingSuffix = await db
      .select()
      .from(guests)
      .where(and(sql`REGEXP_REPLACE(${guests.phoneNumber}, '[^0-9]', '') LIKE ${'%' + suffix}`, eq(guests.rsvpStatus, 'pending')))
      .orderBy(desc(guests.createdAt))
      .limit(1);

    if (pendingSuffix.length > 0) {
      console.log(`[DB] Found pending guest by phone suffix: ${suffix}`);
      return pendingSuffix[0];
    }

    const suffixResult = await db
      .select()
      .from(guests)
      .where(sql`REGEXP_REPLACE(${guests.phoneNumber}, '[^0-9]', '') LIKE ${'%' + suffix}`)
      .orderBy(desc(guests.createdAt))
      .limit(1);

    if (suffixResult.length > 0) {
      console.log(`[DB] Found guest by phone suffix: ${suffix}`);
      return suffixResult[0];
    }
  }

  console.error(`[DB] No guest found for phone: ${phoneNumber}`);
  return null;
}

export async function updateGuest(
  guestId: string,
  data: Partial<typeof guests.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(guests)
    .set({ ...data, updatedAt: new Date() } as any)
    .where(eq(guests.id, guestId));
}

export async function deleteGuest(guestId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(guests).where(eq(guests.id, guestId));
}

export async function bulkDeleteGuests(guestIds: string[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (guestIds.length === 0) return;

  for (const guestId of guestIds) {
    await db.delete(guests).where(eq(guests.id, guestId));
  }
}

// ============= MESSAGE STATUS QUERIES =============

export async function createMessageStatus(data: {
  metaMessageId: string;
  status: string;
  statusDetails?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { v4: uuidv4 } = await import("uuid");
  const statusId = uuidv4();

  await db.insert(messageStatusLogs).values({
    id: statusId,
    metaMessageId: data.metaMessageId,
    status: data.status as any,
    errorDetails: data.statusDetails ? { details: data.statusDetails } : undefined,
  } as any);

  const result = await db
    .select()
    .from(messageStatusLogs)
    .where(eq(messageStatusLogs.id, statusId))
    .limit(1);

  return result[0];
}

export async function getMessageStatusByMetaId(metaMessageId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .select()
    .from(messageStatusLogs)
    .where(eq(messageStatusLogs.metaMessageId, metaMessageId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateMessageStatus(
  statusId: string,
  data: Partial<typeof messageStatusLogs.$inferInsert>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(messageStatusLogs)
    .set({ ...data, timestamp: new Date() } as any)
    .where(eq(messageStatusLogs.id, statusId));
}

// ============= ADDITIONAL QUERIES =============

export async function deleteGuestsByIds(guestIds: string[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  if (guestIds.length === 0) return;

  for (const guestId of guestIds) {
    await db.delete(guests).where(eq(guests.id, guestId));
  }
}

export async function getPendingGuests(bookingId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(guests)
    .where(and(eq(guests.bookingId, bookingId), eq(guests.rsvpStatus, "pending")));
}

export async function getBookingStats(bookingId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const allGuests = await db
    .select()
    .from(guests)
    .where(eq(guests.bookingId, bookingId));

  const confirmed = allGuests.filter((g: any) => g.rsvpStatus === "confirmed").length;
  const declined = allGuests.filter((g: any) => g.rsvpStatus === "declined").length;
  const pending = allGuests.filter((g: any) => g.rsvpStatus === "pending").length;
  const sent = allGuests.filter((g: any) => g.rsvpStatus === "sent").length;
  const delivered = allGuests.filter((g: any) => g.rsvpStatus === "delivered").length;
  const read = allGuests.filter((g: any) => g.rsvpStatus === "read").length;
  const failed = allGuests.filter((g: any) => g.rsvpStatus === "failed").length;

  return {
    total: allGuests.length,
    confirmed,
    declined,
    pending,
    sent,
    delivered,
    read,
    failed,
  };
}

export async function logWebhookEvent(data: any) {
  console.log("[Webhook] Event logged:", data);
  try {
    const db = await getDb();
    if (!db) return;
    // Use raw SQL via Drizzle to insert into webhook_logs
    const id = randomUUID();
    const eventType = data.eventType || 'unknown';
    const payload = JSON.stringify(data.payload || data);
    await db.execute(sql`INSERT INTO webhook_logs (id, eventType, payload, receivedAt) VALUES (${id}, ${eventType}, ${payload}, NOW())`);
    console.log('[Webhook] ✅ Saved to webhook_logs:', id);
  } catch (err) {
    console.error('[Webhook] Failed to save to webhook_logs:', err);
  }
}

export async function getTemplateByName(templateName: string) {
  return {
    name: templateName,
    variables: [],
  };
}

export async function createMessageStatusLog(data: any) {
  console.log("[MessageStatus] Logged:", data);
}

export const getBookings = listBookings;

// User management
export async function upsertUser(data: {
  openId: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  lastSignedIn: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if user exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.openId, data.openId))
    .limit(1);

  if (existing.length > 0) {
    // Update existing user
    await db
      .update(users)
      .set({
        name: data.name,
        email: data.email,
        loginMethod: data.loginMethod,
        lastSignedIn: data.lastSignedIn,
      })
      .where(eq(users.openId, data.openId));
    return existing[0];
  } else {
    // Insert new user
    await db.insert(users).values({
      openId: data.openId,
      name: data.name,
      email: data.email,
      loginMethod: data.loginMethod,
      lastSignedIn: data.lastSignedIn,
    });
    const newUser = await db
      .select()
      .from(users)
      .where(eq(users.openId, data.openId))
      .limit(1);
    return newUser[0];
  }
}

// Get user by openId (used by SDK for session validation)
export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}
