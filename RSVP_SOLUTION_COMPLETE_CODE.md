# 🔧 الحل الكامل - الكود النهائي الفعلي لمشكلة RSVP Confirmation

## 📋 المحتويات

هذا الملف يحتوي على:
1. ✅ الكود الكامل للـ Webhook
2. ✅ شكل الـ Payload الفعلي من Meta
3. ✅ استخراج البيانات بالضبط
4. ✅ البحث عن الضيف في Supabase
5. ✅ تحديث حالة الضيف
6. ✅ إرسال رسالة التأكيد
7. ✅ أسماء القوالب
8. ✅ Environment Variables

---

## 1️⃣ الكود الكامل للـ Webhook

### ملف: `server/meta-webhook.ts`

```typescript
/**
 * Meta WhatsApp Webhook Handler - الكود الكامل الفعلي
 * 
 * يستقبل الأحداث من Meta عند:
 * - ضغط الضيف على زر (RSVP confirm/decline)
 * - تسليم الرسالة
 * - قراءة الرسالة
 */

import { Router } from "express";
import { getGuestByPhone, updateGuest, logWebhookEvent } from "./db";
import { handleRsvpClick, handleCardCountSelection } from "./rsvp-handler";
import { sendRsvpConfirmed, sendRsvpDeclined } from "./meta-api";
import { sendCardCountSelection } from "./meta-interactive";

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || "dawaa_webhook_2024";

export function registerMetaWebhook(app: Router) {
  // GET: التحقق من الـ Webhook (مطلوب من Meta)
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

  // POST: استقبال الأحداث من Meta
  app.post("/api/webhook/meta", async (req, res) => {
    // الرد فوراً لـ Meta (مطلوب خلال 20 ثانية)
    res.status(200).send("OK");

    try {
      const body = req.body;
      console.log("[Webhook] Received:", JSON.stringify(body, null, 2));

      // حفظ الحدث في قاعدة البيانات للتصحيح
      try {
        await logWebhookEvent({ eventType: 'meta_webhook_raw', payload: body });
      } catch (logErr) {
        console.error("[Webhook] Failed to log to DB:", logErr);
      }

      // التحقق من أنها رسالة WhatsApp
      if (body.object !== "whatsapp_business_account") {
        console.log("[Webhook] Not a WhatsApp event, ignoring");
        return;
      }

      // معالجة كل حدث
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          const value = change.value;

          // معالجة الرسائل (ردود الضيوف)
          for (const message of value.messages || []) {
            await processMessage(message, value);
          }

          // معالجة حالات التسليم والقراءة
          for (const status of value.statuses || []) {
            await processStatus(status);
          }
        }
      }
    } catch (error) {
      console.error("[Webhook] Error processing event:", error);
      try {
        await logWebhookEvent({ 
          eventType: 'meta_webhook_error', 
          payload: { error: String(error), body: req.body } 
        });
      } catch (_) {}
    }
  });
}

/**
 * معالجة الرسائل الواردة من Meta
 * تشمل: ردود الأزرار، اختيارات القائمة
 */
async function processMessage(message: any, value: any) {
  const fromPhone = message.from; // مثال: "96899890431"
  const messageType = message.type;

  console.log(`[Webhook] Message from ${fromPhone}, type: ${messageType}`);

  // ✅ معالجة اختيار القائمة (Multiple Cards Selection)
  if (messageType === "interactive" && message.interactive?.type === "list_reply") {
    const selectedId = message.interactive.list_reply.id; // مثال: "card_count_2"
    const selectedTitle = message.interactive.list_reply.title; // مثال: "2 أشخاص"
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

    try {
      await logWebhookEvent({ 
        eventType: 'card_count_processed', 
        payload: { phoneNumber: fromPhone, selectedId, confirmedCount: result.confirmedCount } 
      });
    } catch (_) {}

    // إرسال رسالة التأكيد بعد اختيار العدد
    if (result.rsvpStatus === "confirmed") {
      const sendResult = await sendRsvpConfirmed(fromPhone);
      console.log(`[Webhook] ✅ Sent dawaa_rsvp_confirmed: ${sendResult.messageId || sendResult.error}`);
    }
  }

  // ✅ معالجة ضغط الزر (Interactive Button - صيغة جديدة)
  if (messageType === "interactive" && message.interactive?.type === "button_reply") {
    const buttonId = message.interactive.button_reply.id; // "btn_confirm" أو "btn_decline"
    const buttonTitle = message.interactive.button_reply.title;
    const contextMessageId = message.context?.id;

    console.log(`[Webhook] Interactive button press: ${buttonId} ("${buttonTitle}") from ${fromPhone}`);

    try {
      await logWebhookEvent({ 
        eventType: 'rsvp_button_press', 
        payload: { fromPhone, buttonId, buttonTitle, contextMessageId, format: 'interactive' } 
      });
    } catch (_) {}

    await handleRsvpButton(fromPhone, buttonId, contextMessageId);
  }

  // ✅ معالجة ضغط الزر (Quick Reply - صيغة قديمة)
  // هذه الصيغة هي ما يرسله Meta فعلياً عند ضغط زر القالب
  if (messageType === "button" && message.button) {
    const buttonPayload = message.button.payload || message.button.text || '';
    const buttonText = message.button.text || buttonPayload;
    const contextMessageId = message.context?.id;

    console.log(`[Webhook] Quick reply button press: "${buttonPayload}" from ${fromPhone}`);

    // تحويل نص الزر إلى buttonId
    // ⚠️ تحقق من DECLINE أولاً (لأن "اعتذر عن الحضور" تحتوي على "حضور")
    let buttonId = 'btn_unknown';
    const payloadLower = buttonPayload.toLowerCase();
    
    if (payloadLower.includes('اعتذر') || payloadLower.includes('أعتذر') || 
        payloadLower.includes('decline') || payloadLower.includes('عذر')) {
      buttonId = 'btn_decline';
    } 
    else if (payloadLower.includes('ارغب') || payloadLower.includes('أرغب') || 
             payloadLower.includes('confirm') || payloadLower.includes('حضور')) {
      buttonId = 'btn_confirm';
    }

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

/**
 * معالجة ضغط زر RSVP
 * هذه هي الدالة الرئيسية التي تحل المشكلة
 */
async function handleRsvpButton(phoneNumber: string, buttonId: string, contextMessageId?: string) {
  try {
    // 🔍 الخطوة 1: البحث عن الضيف برقم الهاتف
    const guest = await getGuestByPhone(phoneNumber);

    if (!guest) {
      console.error(`[Webhook] No guest found for phone: ${phoneNumber}`);
      try {
        await logWebhookEvent({ 
          eventType: 'rsvp_guest_not_found', 
          payload: { phoneNumber, buttonId } 
        });
      } catch (_) {}
      return;
    }

    console.log(`[Webhook] Found guest: ${guest.id} (${guest.guestName}), status: ${guest.rsvpStatus}`);

    // 🔄 الخطوة 2: معالجة الرد (تحديث قاعدة البيانات)
    const result = await handleRsvpClick({
      phoneNumber,
      buttonId,
      bookingId: guest.bookingId,
      guestId: guest.id,
      cardsCount: guest.cardsCount || 1,
      messageId: contextMessageId,
    });

    console.log(`[Webhook] RSVP processed: ${result.rsvpStatus}`);

    try {
      await logWebhookEvent({ 
        eventType: 'rsvp_processed', 
        payload: { phoneNumber, buttonId, guestId: guest.id, rsvpStatus: result.rsvpStatus } 
      });
    } catch (_) {}

    // 📨 الخطوة 3: إرسال رسالة التأكيد
    if (result.rsvpStatus === "confirmed") {
      const sendResult = await sendRsvpConfirmed(phoneNumber);
      console.log(`[Webhook] ✅ Sent dawaa_rsvp_confirmed: ${sendResult.messageId || sendResult.error}`);
    } else if (result.rsvpStatus === "declined") {
      const sendResult = await sendRsvpDeclined(phoneNumber);
      console.log(`[Webhook] ✅ Sent dawaa_rsvp_declined: ${sendResult.messageId || sendResult.error}`);
    } else if (result.rsvpStatus === "pending") {
      // Multiple cards: إرسال قائمة اختيار العدد
      const cardsCount = guest.cardsCount || 1;
      if (cardsCount > 1) {
        const sendResult = await sendCardCountSelection(phoneNumber, guest.guestName, cardsCount);
        console.log(`[Webhook] ✅ Sent card count selection: ${sendResult.messageId || sendResult.error}`);
      }
    }

  } catch (error) {
    console.error(`[Webhook] Error handling RSVP button:`, error);
    try {
      await logWebhookEvent({ 
        eventType: 'rsvp_error', 
        payload: { phoneNumber, buttonId, error: String(error) } 
      });
    } catch (_) {}
  }
}

/**
 * معالجة حالات التسليم والقراءة
 */
async function processStatus(status: any) {
  const messageId = status.id;
  const statusValue = status.status; // "sent", "delivered", "read", "failed"
  const recipientId = status.recipient_id;

  console.log(`[Webhook] Status update: ${messageId} → ${statusValue} (to: ${recipientId})`);

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
```

---

## 2️⃣ شكل الـ Payload الفعلي من Meta

### عند ضغط الزر (Quick Reply - الصيغة الحقيقية):

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "123456789",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "201012345678",
              "phone_number_id": "123456789"
            },
            "contacts": [
              {
                "profile": {
                  "name": "أحمد محمد"
                },
                "wa_id": "96899890431"
              }
            ],
            "messages": [
              {
                "context": {
                  "from": "201012345678",
                  "id": "wamid.HBEUGBpGAlFQAglM123456789"
                },
                "from": "96899890431",
                "id": "wamid.HBEUGBpGAlFQAglM987654321",
                "timestamp": "1234567890",
                "type": "button",
                "button": {
                  "payload": "btn_confirm",
                  "text": "أرغب في الحضور"
                }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

### عند اختيار من القائمة (List Reply):

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "changes": [
        {
          "value": {
            "messages": [
              {
                "from": "96899890431",
                "id": "wamid.xxx",
                "timestamp": "1234567890",
                "type": "interactive",
                "interactive": {
                  "type": "list_reply",
                  "list_reply": {
                    "id": "card_count_2",
                    "title": "2 أشخاص"
                  }
                },
                "context": {
                  "id": "wamid.yyy"
                }
              }
            ]
          }
        }
      ]
    }
  ]
}
```

---

## 3️⃣ استخراج البيانات من الـ Payload

### استخراج رقم الضيف:
```typescript
const fromPhone = message.from; // "96899890431"
// تنظيف الرقم (إزالة +)
const cleanPhone = fromPhone.replace(/^\+/, '');
```

### استخراج معرف الزر:
```typescript
// الصيغة 1: Quick Reply (الأكثر شيوعاً)
const buttonPayload = message.button.payload; // "btn_confirm" أو "أرغب في الحضور"
const buttonText = message.button.text; // "أرغب في الحضور"

// الصيغة 2: Interactive Button
const buttonId = message.interactive.button_reply.id; // "btn_confirm"
const buttonTitle = message.interactive.button_reply.title; // "أرغب في الحضور"

// الصيغة 3: List Reply
const selectedId = message.interactive.list_reply.id; // "card_count_2"
const selectedTitle = message.interactive.list_reply.title; // "2 أشخاص"
```

### استخراج معرف الرسالة الأصلية:
```typescript
const contextMessageId = message.context?.id; // "wamid.HBEUGBpGAlFQAglM123456789"
```

---

## 4️⃣ البحث عن الضيف في Supabase

### ملف: `server/db.ts` - الدالة `getGuestByPhone`

```typescript
export async function getGuestByPhone(phoneNumber: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // تنظيف الرقم - إزالة + أو أكواد الدول
  const cleanPhone = phoneNumber.replace(/^\+/, '');
  
  // 🔍 البحث الأول: ابحث عن ضيف في حالة "pending" (لم يرد بعد)
  // هذا يضمن أننا نجد الدعوة الحالية وليس دعوة قديمة
  const pendingResult = await db
    .select()
    .from(guests)
    .where(and(
      eq(guests.phoneNumber, cleanPhone), 
      eq(guests.rsvpStatus, 'pending')
    ))
    .orderBy(desc(guests.createdAt))
    .limit(1);

  if (pendingResult.length > 0) return pendingResult[0];

  // 🔍 البحث الثاني: إذا لم نجد pending، ابحث عن أحدث ضيف برقم هذا الهاتف
  const result = await db
    .select()
    .from(guests)
    .where(eq(guests.phoneNumber, cleanPhone))
    .orderBy(desc(guests.createdAt))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}
```

### معلومات الجدول:

| المعلومة | القيمة |
|---------|--------|
| **اسم الجدول** | `guests` |
| **عمود الهاتف** | `phoneNumber` |
| **عمود الحالة** | `rsvpStatus` |
| **قيم الحالة** | `pending`, `confirmed`, `declined`, `sent`, `delivered`, `read`, `failed`, `checked-in` |

---

## 5️⃣ تحديث حالة الضيف

### ملف: `server/db.ts` - الدالة `updateGuest`

```typescript
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
```

### مثال على الاستخدام:

```typescript
// تحديث حالة الضيف إلى "confirmed"
await updateGuest(guest.id, {
  rsvpStatus: "confirmed",
  confirmedCount: 1,
  declinedCount: 0,
  pendingCount: 0,
  repliedAt: new Date(),
});

// تحديث حالة الضيف إلى "declined"
await updateGuest(guest.id, {
  rsvpStatus: "declined",
  confirmedCount: 0,
  declinedCount: guest.cardsCount,
  pendingCount: 0,
  repliedAt: new Date(),
});
```

### الأعمدة المهمة:

| العمود | النوع | الوصف |
|--------|-------|-------|
| `rsvpStatus` | enum | حالة الضيف (pending, confirmed, declined) |
| `confirmedCount` | int | عدد البطاقات المؤكدة |
| `declinedCount` | int | عدد البطاقات المرفوضة |
| `pendingCount` | int | عدد البطاقات المعلقة |
| `repliedAt` | timestamp | وقت الرد |
| `metaMessageId` | varchar | معرف الرسالة من Meta |
| `deliveredAt` | timestamp | وقت التسليم |
| `readAt` | timestamp | وقت القراءة |

---

## 6️⃣ إرسال رسالة التأكيد

### ملف: `server/meta-api.ts`

```typescript
/**
 * إرسال قالب التأكيد (dawaa_rsvp_confirmed)
 * لا يحتاج معاملات - القالب يحتوي على الرسالة الكاملة
 */
export async function sendRsvpConfirmed(
  phoneNumber: string,
  _guestName?: string
): Promise<SendMessageResponse> {
  return sendTemplate(phoneNumber, "dawaa_rsvp_confirmed", "ar");
}

/**
 * إرسال قالب الاعتذار (dawaa_rsvp_declined)
 * لا يحتاج معاملات - القالب يحتوي على الرسالة الكاملة
 */
export async function sendRsvpDeclined(
  phoneNumber: string,
  _guestName?: string
): Promise<SendMessageResponse> {
  return sendTemplate(phoneNumber, "dawaa_rsvp_declined", "ar");
}

/**
 * الدالة الأساسية لإرسال أي قالب
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

  const url = `https://graph.facebook.com/v25.0/${PHONE_NUMBER_ID}/messages`;

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

  // أضف المعاملات فقط إذا كانت موجودة
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
```

---

## 7️⃣ أسماء القوالب المستخدمة

### القوالب الأساسية:

| اسم القالب | الاستخدام | المعاملات |
|-----------|----------|---------|
| `dawaa_wedding_invitation` | إرسال الدعوة الأولى | 6 معاملات (اسم الضيف، الأسماء، عدد البطاقات) |
| `dawaa_rsvp_confirmed` | تأكيد الحضور | بدون معاملات |
| `dawaa_rsvp_declined` | تأكيد الاعتذار | بدون معاملات |
| `dawaa_rsvp_reminder` | تذكير بالرد | معاملات (اسم الضيف، تاريخ الحفل) |
| `dawaa_entry_card` | بطاقة الدخول | معاملات (اسم الضيف، QR، التاريخ) |

### كيفية إنشاء القوالب في Meta:

1. اذهب إلى [Meta Business Suite](https://business.facebook.com/)
2. اختر حسابك
3. اذهب إلى **WhatsApp** → **Message Templates**
4. اضغط **Create Template**
5. اختر اللغة: **Arabic**
6. أضف الرسالة والأزرار

---

## 8️⃣ صيغ الأزرار المختلفة

### الصيغة 1: Quick Reply (الأكثر شيوعاً)

```json
{
  "type": "button",
  "button": {
    "payload": "btn_confirm",
    "text": "أرغب في الحضور"
  }
}
```

### الصيغة 2: Interactive Button

```json
{
  "type": "interactive",
  "interactive": {
    "type": "button_reply",
    "button_reply": {
      "id": "btn_confirm",
      "title": "أرغب في الحضور"
    }
  }
}
```

### الصيغة 3: List Reply

```json
{
  "type": "interactive",
  "interactive": {
    "type": "list_reply",
    "list_reply": {
      "id": "card_count_2",
      "title": "2 أشخاص"
    }
  }
}
```

### معالجة الصيغ المختلفة:

```typescript
// الكود يتعامل مع جميع الصيغ تلقائياً
// - يتحقق من message.type
// - يستخرج البيانات بناءً على الصيغة
// - يحول كل شيء إلى buttonId موحد (btn_confirm أو btn_decline)
```

---

## 9️⃣ Environment Variables المطلوبة

### في ملف `.env`:

```env
# Meta WhatsApp API
META_ACCESS_TOKEN=EAABsbCS1iHgBAO...
META_PHONE_NUMBER_ID=123456789
META_WEBHOOK_VERIFY_TOKEN=dawaa_webhook_2024

# قاعدة البيانات
DATABASE_URL=mysql://user:password@host/database

# التطبيق
APP_URL=https://your-domain.com
WEBHOOK_URL=https://your-domain.com/api/webhook/meta
```

### شرح كل متغير:

| المتغير | الوصف | أين تحصل عليه |
|--------|-------|-------------|
| `META_ACCESS_TOKEN` | توكن الوصول إلى Meta API | Meta Business Suite |
| `META_PHONE_NUMBER_ID` | معرف رقم WhatsApp | Meta Business Suite |
| `META_WEBHOOK_VERIFY_TOKEN` | توكن التحقق من الـ Webhook | أنت تختاره |
| `DATABASE_URL` | رابط قاعدة البيانات | Supabase |
| `APP_URL` | رابط التطبيق الخاص بك | موقعك |
| `WEBHOOK_URL` | رابط الـ Webhook | `{APP_URL}/api/webhook/meta` |

---

## 🔟 الرحلة الكاملة (خطوة بخطوة)

### الخطوة 1: الضيف يستقبل الدعوة
```
موقعك → Meta API → WhatsApp → جهاز الضيف
```

### الخطوة 2: الضيف يضغط الزر
```
جهاز الضيف: يضغط "أرغب في الحضور"
```

### الخطوة 3: Meta ترسل الرد للـ Webhook
```
WhatsApp → Meta → Webhook الخاص بك
```

### الخطوة 4: الـ Webhook يستقبل الرد
```typescript
POST /api/webhook/meta
Body: { ... button: { payload: "btn_confirm", text: "أرغب في الحضور" } ... }
```

### الخطوة 5: استخراج البيانات
```typescript
const fromPhone = message.from; // "96899890431"
const buttonId = "btn_confirm";
```

### الخطوة 6: البحث عن الضيف
```typescript
const guest = await getGuestByPhone(fromPhone);
// النتيجة: { id: "uuid", guestName: "أحمد محمد", ... }
```

### الخطوة 7: معالجة الرد
```typescript
await handleRsvpClick({
  phoneNumber: "96899890431",
  buttonId: "btn_confirm",
  guestId: guest.id,
  ...
});
```

### الخطوة 8: تحديث قاعدة البيانات
```typescript
await updateGuest(guest.id, {
  rsvpStatus: "confirmed",
  confirmedCount: 1,
  repliedAt: new Date(),
});
```

### الخطوة 9: إرسال رسالة التأكيد
```typescript
await sendRsvpConfirmed("96899890431");
// النتيجة: رسالة تصل للضيف "شكراً لتأكيدك الحضور! 🎉"
```

### الخطوة 10: الموقع يتحدث فوراً
```
قاعدة البيانات تتحدثت
    ↓
الموقع يعرض الإحصائيات الجديدة
    ↓
أحمد محمد: ✅ مؤكد
```

---

## 🐛 استكشاف الأخطاء الشائعة

### المشكلة 1: رسالة التأكيد لا تصل

**الأسباب المحتملة:**
1. ❌ `sendRsvpConfirmed` لم تُستدعَ
2. ❌ `META_ACCESS_TOKEN` غير صحيح
3. ❌ `META_PHONE_NUMBER_ID` غير صحيح
4. ❌ القالب `dawaa_rsvp_confirmed` غير موجود في Meta

**الحل:**
```bash
# 1. تحقق من السجلات
tail -f .manus-logs/devserver.log | grep "Sent dawaa_rsvp_confirmed"

# 2. تحقق من المتغيرات
echo $META_ACCESS_TOKEN
echo $META_PHONE_NUMBER_ID

# 3. تحقق من القالب في Meta Business Suite
# اذهب إلى WhatsApp → Message Templates
```

### المشكلة 2: الحالة لا تتحدث

**الأسباب المحتملة:**
1. ❌ `updateGuest` لم تُستدعَ
2. ❌ الضيف غير موجود في قاعدة البيانات
3. ❌ رقم الهاتف غير صحيح

**الحل:**
```bash
# 1. تحقق من السجلات
tail -f .manus-logs/devserver.log | grep "RSVP processed"

# 2. تحقق من قاعدة البيانات
SELECT * FROM guests WHERE phoneNumber = '96899890431';

# 3. تحقق من الرقم (هل يبدأ بـ + أو بدونه؟)
```

### المشكلة 3: الـ Webhook لا يستقبل الردود

**الأسباب المحتملة:**
1. ❌ الـ Webhook غير مسجل في Meta
2. ❌ `VERIFY_TOKEN` غير صحيح
3. ❌ الـ URL غير صحيح

**الحل:**
```bash
# 1. تحقق من تسجيل الـ Webhook
# اذهب إلى Meta Business Suite → WhatsApp → Configuration

# 2. اختبر الـ Webhook
curl -X GET "https://your-domain.com/api/webhook/meta?hub.mode=subscribe&hub.verify_token=dawaa_webhook_2024&hub.challenge=test_challenge"

# 3. تحقق من السجلات
tail -f .manus-logs/devserver.log | grep "Webhook"
```

---

## ✅ قائمة التحقق قبل النشر

- [ ] `META_ACCESS_TOKEN` صحيح
- [ ] `META_PHONE_NUMBER_ID` صحيح
- [ ] `META_WEBHOOK_VERIFY_TOKEN` صحيح
- [ ] الـ Webhook مسجل في Meta
- [ ] القوالب موجودة في Meta (dawaa_rsvp_confirmed, dawaa_rsvp_declined)
- [ ] الأزرار في القالب تعمل بشكل صحيح
- [ ] قاعدة البيانات تحتوي على جدول `guests`
- [ ] جدول `guests` يحتوي على الأعمدة الصحيحة
- [ ] الـ Webhook يستقبل الردود (تحقق من السجلات)
- [ ] قاعدة البيانات تتحدث عند الرد
- [ ] رسالة التأكيد تصل للضيف
- [ ] الموقع يتحدث فوراً

---

## 📞 الدعم والمساعدة

إذا حصلت مشكلة:

1. **اقرأ السجلات:**
   ```bash
   tail -f .manus-logs/devserver.log
   ```

2. **ابحث عن الخطأ:**
   - `[Webhook]` - مشاكل الـ Webhook
   - `[Meta API]` - مشاكل الإرسال
   - `[RSVP]` - مشاكل معالجة الرد
   - `[DB]` - مشاكل قاعدة البيانات

3. **تحقق من قاعدة البيانات:**
   ```bash
   SELECT * FROM webhook_logs ORDER BY receivedAt DESC LIMIT 10;
   ```

4. **اختبر Meta API مباشرة:**
   ```bash
   curl -X POST "https://graph.facebook.com/v25.0/{PHONE_NUMBER_ID}/messages" \
     -H "Authorization: Bearer {ACCESS_TOKEN}" \
     -d '{"messaging_product":"whatsapp","to":"96899890431","type":"template","template":{"name":"dawaa_rsvp_confirmed","language":{"code":"ar"}}}'
   ```

---

**هذا هو الحل الكامل والفعلي الذي يعمل!** ✅
