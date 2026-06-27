/**
 * Meta Cloud API - Interactive Messages with List Buttons
 * For sending messages like card count selection with interactive list buttons
 */

const META_API_VERSION = "v25.0";
const PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID || "";
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || "";
const META_BASE_URL = "https://graph.facebook.com";

export interface SendMessageResponse {
  messageId: string;
  status: "sent" | "failed";
  error?: string;
}

/**
 * Send an interactive message with a list of buttons
 * Used for card count selection after RSVP confirmation
 */
export async function sendCardCountSelection(
  phoneNumber: string,
  guestName: string,
  totalCards: number
): Promise<SendMessageResponse> {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    throw new Error("Meta API credentials not configured");
  }

  const url = `${META_BASE_URL}/${META_API_VERSION}/${PHONE_NUMBER_ID}/messages`;

  // Generate list rows for card selection (1 to totalCards)
  const rows = Array.from({ length: totalCards }, (_, i) => {
    const count = i + 1;
    return {
      id: `card_count_${count}`,
      title: `${count} ${count === 1 ? "شخص" : "أشخاص"}`,
      description: `تأكيد حضور ${count} من أصل ${totalCards}`,
    };
  });

  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumber,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "تأكيد عدد الحضور",
      },
      body: {
        text: `مرحباً ${guestName}، لديكم ${totalCards} بطاقات دخول.\nيرجى اختيار عدد الأشخاص الذين سيحضرون المناسبة:`,
      },
      footer: {
        text: "اختر العدد المناسب",
      },
      action: {
        button: "اختيار العدد",
        sections: [
          {
            title: "عدد الحضور",
            rows: rows,
          },
        ],
      },
    },
  };

  console.log(`[Meta API] Sending card count selection to ${phoneNumber}`);

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

    console.log(`[Meta API] ✅ Card count selection sent: ${messageId}`);
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
 * Send a simple text message with interactive buttons
 * Can be used for custom interactive messages
 */
export async function sendInteractiveMessage(
  phoneNumber: string,
  headerText: string,
  bodyText: string,
  footerText: string,
  buttons: Array<{ id: string; title: string; description?: string }>
): Promise<SendMessageResponse> {
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    throw new Error("Meta API credentials not configured");
  }

  const url = `${META_BASE_URL}/${META_API_VERSION}/${PHONE_NUMBER_ID}/messages`;

  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumber,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: headerText,
      },
      body: {
        text: bodyText,
      },
      footer: {
        text: footerText,
      },
      action: {
        button: "اختيار",
        sections: [
          {
            rows: buttons,
          },
        ],
      },
    },
  };

  console.log(`[Meta API] Sending interactive message to ${phoneNumber}`);

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

    console.log(`[Meta API] ✅ Interactive message sent: ${messageId}`);
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
