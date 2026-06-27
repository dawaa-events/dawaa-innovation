import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  json,
  decimal,
  boolean,
  bigint,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Bookings table - stores event/booking information
 */
export const bookings = mysqlTable("bookings", {
  id: varchar("id", { length: 36 }).primaryKey().default("UUID()"),
  clientName: text("clientName").notNull(),
  clientPhone: varchar("clientPhone", { length: 20 }).notNull(),
  eventDate: timestamp("eventDate").notNull(),
  eventType: varchar("eventType", { length: 100 }),
  venueName: text("venueName"),
  locationLink: text("locationLink"),
  receptionTime: varchar("receptionTime", { length: 50 }),
  hostOne: text("hostOne"),
  hostTwo: text("hostTwo"),
  brideName: text("brideName"),
  groomName: text("groomName"),
  notes: text("notes"),
  invitationTemplateSettings: json("invitationTemplateSettings"),
  reminderSettings: json("reminderSettings"),
  entryCardSettings: json("entryCardSettings"),
  paymentDetails: json("paymentDetails"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

/**
 * Guests table - stores guest information per booking
 */
export const guests = mysqlTable("guests", {
  id: varchar("id", { length: 36 }).primaryKey().default("UUID()"),
  bookingId: varchar("bookingId", { length: 36 }).notNull(),
  guestName: text("guestName").notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  cardsCount: int("cardsCount").default(1).notNull(),
  sequenceNumber: int("sequenceNumber"),
  shortCode: varchar("shortCode", { length: 50 }).unique(),
  qrValue: varchar("qrValue", { length: 500 }).unique(),
  notes: text("notes"),
  rsvpStatus: mysqlEnum("rsvpStatus", [
    "pending",
    "confirmed",
    "declined",
    "sent",
    "delivered",
    "read",
    "failed",
    "checked-in",
  ])
    .default("pending")
    .notNull(),
  confirmedCount: int("confirmedCount").default(0),
  declinedCount: int("declinedCount").default(0),
  pendingCount: int("pendingCount").default(1),
  metaMessageId: varchar("metaMessageId", { length: 100 }),
  invitationSentAt: timestamp("invitationSentAt"),
  deliveredAt: timestamp("deliveredAt"),
  readAt: timestamp("readAt"),
  repliedAt: timestamp("repliedAt"),
  checkedInAt: timestamp("checkedInAt"),
  lastMessageAt: timestamp("lastMessageAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Guest = typeof guests.$inferSelect;
export type InsertGuest = typeof guests.$inferInsert;

/**
 * Guest cards table - stores individual entry cards per guest
 */
export const guestCards = mysqlTable("guest_cards", {
  id: varchar("id", { length: 36 }).primaryKey().default("UUID()"),
  guestId: varchar("guestId", { length: 36 }).notNull(),
  bookingId: varchar("bookingId", { length: 36 }).notNull(),
  cardQrValue: varchar("cardQrValue", { length: 500 }).unique().notNull(),
  cardShortCode: varchar("cardShortCode", { length: 50 }).unique().notNull(),
  isCheckedIn: boolean("isCheckedIn").default(false),
  checkedInAt: timestamp("checkedInAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GuestCard = typeof guestCards.$inferSelect;
export type InsertGuestCard = typeof guestCards.$inferInsert;

/**
 * Messages table - stores all incoming WhatsApp messages
 */
export const messages = mysqlTable("messages", {
  id: varchar("id", { length: 36 }).primaryKey().default("UUID()"),
  guestId: varchar("guestId", { length: 36 }),
  bookingId: varchar("bookingId", { length: 36 }),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  metaMessageId: varchar("metaMessageId", { length: 100 }).unique(),
  messageType: varchar("messageType", { length: 50 }).notNull(), // text, image, document, voice, audio, etc.
  messageContent: json("messageContent"),
  mediaUrl: text("mediaUrl"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  isAdminVisible: boolean("isAdminVisible").default(true),
  isClientVisible: boolean("isClientVisible").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Message status logs table - tracks delivery status of sent messages
 */
export const messageStatusLogs = mysqlTable("message_status_logs", {
  id: varchar("id", { length: 36 }).primaryKey().default("UUID()"),
  messageId: varchar("messageId", { length: 36 }),
  metaMessageId: varchar("metaMessageId", { length: 100 }).notNull(),
  status: mysqlEnum("status", ["sent", "delivered", "read", "failed"]).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  errorDetails: json("errorDetails"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MessageStatusLog = typeof messageStatusLogs.$inferSelect;
export type InsertMessageStatusLog = typeof messageStatusLogs.$inferInsert;

/**
 * Webhook logs table - stores all incoming webhook events from n8n/Meta
 */
export const webhookLogs = mysqlTable("webhook_logs", {
  id: varchar("id", { length: 36 }).primaryKey().default("UUID()"),
  eventType: varchar("eventType", { length: 100 }).notNull(),
  payload: json("payload").notNull(),
  receivedAt: timestamp("receivedAt").defaultNow().notNull(),
});

export type WebhookLog = typeof webhookLogs.$inferSelect;
export type InsertWebhookLog = typeof webhookLogs.$inferInsert;

/**
 * Error logs table - stores system errors for debugging
 */
export const errorLogs = mysqlTable("error_logs", {
  id: varchar("id", { length: 36 }).primaryKey().default("UUID()"),
  source: varchar("source", { length: 100 }),
  errorMessage: text("errorMessage").notNull(),
  stackTrace: text("stackTrace"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  context: json("context"),
});

export type ErrorLog = typeof errorLogs.$inferSelect;
export type InsertErrorLog = typeof errorLogs.$inferInsert;

/**
 * Templates table - stores WhatsApp template configurations
 */
export const templates = mysqlTable("templates", {
  id: varchar("id", { length: 36 }).primaryKey().default("UUID()"),
  templateName: varchar("templateName", { length: 100 }).unique().notNull(),
  language: varchar("language", { length: 10 }).default("en_US").notNull(),
  headerType: mysqlEnum("headerType", ["none", "image", "document"]),
  variables: json("variables"),
  buttonPayloadFormat: text("buttonPayloadFormat"),
  supportsImage: boolean("supportsImage").default(false),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = typeof templates.$inferInsert;

/**
 * Payments table - stores payment information for accounting
 */
export const payments = mysqlTable("payments", {
  id: varchar("id", { length: 36 }).primaryKey().default("UUID()"),
  bookingId: varchar("bookingId", { length: 36 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentType: varchar("paymentType", { length: 50 }),
  status: mysqlEnum("status", ["pending", "completed", "refunded"]),
  transactionId: varchar("transactionId", { length: 100 }),
  paymentDate: timestamp("paymentDate").defaultNow().notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Check-ins table - stores QR scanner check-in records
 */
export const checkins = mysqlTable("checkins", {
  id: varchar("id", { length: 36 }).primaryKey().default("UUID()"),
  guestId: varchar("guestId", { length: 36 }).notNull(),
  bookingId: varchar("bookingId", { length: 36 }).notNull(),
  guestCardId: varchar("guestCardId", { length: 36 }),
  checkedInAt: timestamp("checkedInAt").defaultNow().notNull(),
  scannerUserId: int("scannerUserId"),
  deviceInfo: text("deviceInfo"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Checkin = typeof checkins.$inferSelect;
export type InsertCheckin = typeof checkins.$inferInsert;

/**
 * Client portal accounts table - stores client login credentials
 */
export const clientPortalAccounts = mysqlTable("client_portal_accounts", {
  id: varchar("id", { length: 36 }).primaryKey().default("UUID()"),
  bookingId: varchar("bookingId", { length: 36 }).notNull(),
  username: varchar("username", { length: 100 }).unique().notNull(),
  passwordHash: text("passwordHash").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientPortalAccount = typeof clientPortalAccounts.$inferSelect;
export type InsertClientPortalAccount = typeof clientPortalAccounts.$inferInsert;

/**
 * Employee assignments table - tracks which employees are assigned to which bookings
 */
export const employeeAssignments = mysqlTable("employee_assignments", {
  id: varchar("id", { length: 36 }).primaryKey().default("UUID()"),
  employeeId: int("employeeId").notNull(),
  bookingId: varchar("bookingId", { length: 36 }).notNull(),
  assignedAt: timestamp("assignedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmployeeAssignment = typeof employeeAssignments.$inferSelect;
export type InsertEmployeeAssignment = typeof employeeAssignments.$inferInsert;

/**
 * AI message classifications table - stores AI classification results
 */
export const aiMessageClassifications = mysqlTable("ai_message_classifications", {
  id: varchar("id", { length: 36 }).primaryKey().default("UUID()"),
  messageId: varchar("messageId", { length: 36 }).notNull(),
  classification: varchar("classification", { length: 100 }).notNull(),
  confidence: decimal("confidence", { precision: 3, scale: 2 }),
  aiResponse: text("aiResponse"),
  processedAt: timestamp("processedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AiMessageClassification = typeof aiMessageClassifications.$inferSelect;
export type InsertAiMessageClassification = typeof aiMessageClassifications.$inferInsert;
