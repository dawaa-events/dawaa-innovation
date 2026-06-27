/**
 * Meta Cloud API helpers for sending WhatsApp messages
 * 
 * IMPORTANT: Uses graph.facebook.com (NOT graph.instagram.com)
 * 
 * Template parameter formats (discovered by testing):
 * - dawaa_wedding_invitation: 6 named body params (guest_name, host_one, host_two, bride_name, groom_name, cards_count)
 * - dawaa_rsvp_confirmed: 0 params (no components needed)
 * - dawaa_rsvp_declined: 0 params (no components needed)
 */

const META_API_VERSION = process.env.META_API_VERSION || "v25.0";
const PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID || process.env.PHONE_NUMBER_ID || "";
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || "";
const META_BASE_URL = "https://graph.facebook.com";

export interface SendMessageResponse {
  messageId: string;
  status: "sent" | "failed";
  error?: string;
}

/**
 * Low-level function to send any WhatsApp template message
 */
async function sendTemplate(
  phoneNumber: string,
  templateName: string,
  languageCode: string,
  components?: object[]
): Promise<SendMessageResponse> {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    throw new Error("Meta API credentials not configured");
  }

  const url = `${META_BASE_URL}/${META_API_VERSION}/${PHONE_NUMBER_ID}/messages`;

  const body: any = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumber,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
    },
  };

  // Only add components if provided and non-empty
  if (components && components.length > 0) {
    body.template.components = components;
  }

  console.log(`[Meta API] Sending "${templateName}" to ${phoneNumber}`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log(`[Meta API] Response ${response.status}: ${responseText}`);

    if (!response.ok) {
      return {
        messageId: "",
        status: "failed",
        error: `HTTP ${response.status}: ${responseText}`,
      };
    }

    const data = JSON.parse(responseText) as { messages: Array<{ id: string }> };
    const messageId = data.messages?.[0]?.id || "";

    console.log(`[Meta API] ✅ Message sent: ${messageId}`);
    return { messageId, status: "sent" };
  } catch (error) {
    console.error("[Meta API] Exception:", error);
    return {
      messageId: "",
      status: "failed",
      error: String(error),
    };
  }
}

/**
 * Send wedding invitation template (dawaa_wedding_invitation)
 * Uses 6 named body parameters:
 *   guest_name, host_one, host_two, bride_name, groom_name, cards_count
 */
export async function sendWeddingInvitation(params: {
  phoneNumber: string;
  guestName: string;
  hostOne: string;
  hostTwo: string;
  brideName: string;
  groomName: string;
  cardsCount: number;
  templateName?: string;
}): Promise<SendMessageResponse> {
  const templateName = params.templateName || "dawaa_wedding_invitation";

  return sendTemplate(params.phoneNumber, templateName, "ar", [
    {
      type: "body",
      parameters: [
        { type: "text", parameter_name: "guest_name", text: params.guestName || "-" },
        { type: "text", parameter_name: "host_one", text: params.hostOne || "-" },
        { type: "text", parameter_name: "host_two", text: params.hostTwo || "-" },
        { type: "text", parameter_name: "bride_name", text: params.brideName || "-" },
        { type: "text", parameter_name: "groom_name", text: params.groomName || "-" },
        { type: "text", parameter_name: "cards_count", text: String(params.cardsCount || 1) },
      ],
    },
  ]);
}

/**
 * Send RSVP confirmed template (dawaa_rsvp_confirmed)
 * No body parameters needed
 */
export async function sendRsvpConfirmed(
  phoneNumber: string,
  _guestName?: string
): Promise<SendMessageResponse> {
  return sendTemplate(phoneNumber, "dawaa_rsvp_confirmed", "ar");
}

/**
 * Send RSVP declined template (dawaa_rsvp_declined)
 * No body parameters needed
 */
export async function sendRsvpDeclined(
  phoneNumber: string,
  _guestName?: string
): Promise<SendMessageResponse> {
  return sendTemplate(phoneNumber, "dawaa_rsvp_declined", "ar");
}

/**
 * Send RSVP reminder template (dawaa_rsvp_reminder)
 */
export async function sendRsvpReminder(
  phoneNumber: string,
  guestName: string,
  eventDate: string
): Promise<SendMessageResponse> {
  return sendTemplate(phoneNumber, "dawaa_rsvp_reminder", "ar", [
    {
      type: "body",
      parameters: [
        { type: "text", parameter_name: "guest_name", text: guestName || "-" },
        { type: "text", parameter_name: "event_date", text: eventDate || "-" },
      ],
    },
  ]);
}

/**
 * Send entry card template (dawaa_entry_card)
 */
export async function sendEntryCard(
  phoneNumber: string,
  guestName: string,
  qrValue: string,
  eventDate: string
): Promise<SendMessageResponse> {
  return sendTemplate(phoneNumber, "dawaa_entry_card", "ar", [
    {
      type: "body",
      parameters: [
        { type: "text", parameter_name: "guest_name", text: guestName || "-" },
        { type: "text", parameter_name: "qr_code", text: qrValue || "-" },
        { type: "text", parameter_name: "event_date", text: eventDate || "-" },
      ],
    },
  ]);
}
