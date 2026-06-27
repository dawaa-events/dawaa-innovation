# دعوة - دليل المطور الشامل

## 📋 نظرة عامة

**دعوة** هي منصة SaaS عربية متكاملة لإدارة الدعوات والمناسبات عبر WhatsApp. تجمع بين تصميم فاخر (Lavender + Purple) وتقنية قوية لإرسال الدعوات وتتبع الردود.

---

## 🏗️ البنية المعمارية

### المكونات الرئيسية

```
┌─────────────────────────────────────────────────────────┐
│                   صفحة الهبوط (Landing Page)            │
│              - نموذج التجربة المجانية                    │
│              - عرض الميزات والأسعار                     │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                   لوحة الإدارة (Dashboard)              │
│         - إدارة المناسبات والضيوف                       │
│         - إرسال الدعوات والتتبع                         │
│         - الإحصائيات والتقارير                          │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│                   Meta WhatsApp API                      │
│         - إرسال الرسائل والقوالب                        │
│         - استقبال الردود والأحداث                       │
│         - تتبع حالة الرسائل                             │
└─────────────────────────────────────────────────────────┘
```

### الملفات الرئيسية

#### Frontend (React + TypeScript)
```
client/src/
├── pages/
│   ├── LandingPageHTML.tsx          # صفحة الهبوط الجديدة
│   ├── DashboardPageNew.tsx         # لوحة الإدارة الجديدة
│   ├── BookingsPage.tsx             # إدارة المناسبات
│   ├── GuestsPage.tsx               # إدارة الضيوف
│   └── SendInvitationsPage.tsx      # إرسال الدعوات
├── components/
│   ├── DashboardLayout.tsx          # التخطيط الرئيسي
│   └── [UI Components]              # مكونات الواجهة
└── lib/
    └── trpc.ts                      # عميل tRPC
```

#### Backend (Node.js + Express + tRPC)
```
server/
├── routers.ts                       # تعريفات tRPC الرئيسية
├── routers-reminders.ts             # إجراءات التذكيرات
├── db.ts                            # استعلامات قاعدة البيانات
├── meta-api.ts                      # تكامل Meta WhatsApp API
├── rsvp-handler.ts                  # معالجة الردود
├── reminders.ts                     # منطق التذكيرات
└── _core/
    ├── index.ts                     # إعداد Express
    └── scheduled-handlers.ts        # المهام المجدولة
```

#### Database (MySQL + Drizzle ORM)
```
drizzle/
└── schema.ts                        # تعريفات الجداول
```

---

## 🔄 منطق الإرسال الكامل

### 1. إنشاء مناسبة تجريبية (Demo Booking)

**المسار:** صفحة الهبوط → نموذج التجربة → API

```typescript
// 1. المستخدم يملأ النموذج
const formData = {
  name: "أحمد محمد",
  phone: "96891234567",
  location: "فندق العمارة",
  groom: "محمد علي",
  bride: "فاطمة أحمد"
};

// 2. إرسال إلى API
await trpc.demo.createDemoBooking.mutate(formData);

// 3. Backend: إنشاء حجز في قاعدة البيانات
const booking = await createBooking({
  clientName: formData.name,
  clientPhone: cleanPhoneNumber(formData.phone),
  eventDate: new Date(),
  eventType: 'demo',
  venueName: formData.location,
  brideName: formData.bride,
  groomName: formData.groom,
});

// 4. إرسال رسالة WhatsApp تلقائية
await sendWeddingInvitation({
  phoneNumber: cleanPhoneNumber(formData.phone),
  guestName: formData.name,
  hostOne: formData.groom,
  hostTwo: formData.bride,
  brideName: formData.bride,
  groomName: formData.groom,
  cardsCount: 1,
});
```

### 2. إرسال الدعوات من لوحة الإدارة

**المسار:** لوحة الإدارة → اختيار الضيوف → إرسال

```typescript
// 1. المستخدم يختار الضيوف من الجدول
const selectedGuests = [
  { id: "guest-1", name: "علي محمد", phone: "96891234567" },
  { id: "guest-2", name: "سارة أحمد", phone: "96891234568" }
];

// 2. إرسال الدعوات
for (const guest of selectedGuests) {
  await sendWeddingInvitation({
    phoneNumber: guest.phone,
    guestName: guest.name,
    hostOne: booking.hostOne,
    hostTwo: booking.hostTwo,
    brideName: booking.brideName,
    groomName: booking.groomName,
    cardsCount: guest.cardsCount,
  });
  
  // تحديث حالة الضيف
  await updateGuest(guest.id, {
    rsvpStatus: 'sent',
    invitationSentAt: new Date(),
  });
}
```

### 3. معالجة الردود (RSVP)

**المسار:** WhatsApp → Meta Webhook → Backend → قاعدة البيانات

```typescript
// 1. Meta يرسل webhook عند ضغط الزر
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "96891234567",
          "type": "interactive",
          "interactive": {
            "button_reply": {
              "id": "confirmed",
              "title": "نعم، سأحضر"
            }
          }
        }]
      }
    }]
  }]
}

// 2. Backend يستقبل الـ webhook
app.post('/webhook/meta', async (req, res) => {
  const message = req.body.entry[0].changes[0].value.messages[0];
  const phoneNumber = message.from;
  const response = message.interactive.button_reply.id;
  
  // 3. معالجة الرد
  const guest = await getGuestByPhone(phoneNumber);
  if (guest) {
    await handleRsvpClick(guest.id, response);
  }
});

// 4. تحديث حالة الضيف
async function handleRsvpClick(guestId: string, response: string) {
  const guest = await getGuestById(guestId);
  
  if (response === 'confirmed') {
    await updateGuest(guestId, {
      rsvpStatus: 'confirmed',
      confirmedCount: (guest.confirmedCount || 0) + 1,
      repliedAt: new Date(),
    });
    
    // إرسال رسالة تأكيد
    await sendRsvpConfirmed(guest.phoneNumber);
  } else if (response === 'declined') {
    await updateGuest(guestId, {
      rsvpStatus: 'declined',
      declinedCount: (guest.declinedCount || 0) + 1,
      repliedAt: new Date(),
    });
    
    // إرسال رسالة رفض
    await sendRsvpDeclined(guest.phoneNumber);
  }
}
```

### 4. تتبع حالة الرسائل

```typescript
// Meta يرسل تحديثات الحالة
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "statuses": [{
          "id": "wamid.xxx",
          "status": "delivered",
          "timestamp": "1234567890",
          "recipient_id": "96891234567"
        }]
      }
    }]
  }]
}

// Backend يحفظ الحالة
await createMessageStatus({
  metaMessageId: "wamid.xxx",
  status: "delivered",
});
```

---

## 🔌 تكامل Meta WhatsApp API

### الإعداد المطلوب

```env
# .env
META_ACCESS_TOKEN=your_access_token
META_PHONE_NUMBER_ID=your_phone_number_id
```

### القوالب المستخدمة

| اسم القالب | الاستخدام | المعاملات |
|-----------|----------|---------|
| `dawaa_wedding_invitation` | إرسال الدعوة | guest_name, host_one, host_two, bride_name, groom_name, cards_count |
| `dawaa_rsvp_confirmed` | تأكيد الحضور | - |
| `dawaa_rsvp_declined` | رفض الحضور | - |
| `dawaa_rsvp_reminder` | تذكير بالرد | - |
| `dawaa_entry_card` | بطاقة الدخول | - |

### مثال: إرسال دعوة

```typescript
import { sendWeddingInvitation } from './meta-api';

const response = await sendWeddingInvitation({
  phoneNumber: '96891234567',
  guestName: 'علي محمد',
  hostOne: 'محمد علي',
  hostTwo: 'فاطمة أحمد',
  brideName: 'فاطمة أحمد',
  groomName: 'محمد علي',
  cardsCount: 2,
});

console.log(response);
// { messageId: 'wamid.xxx', status: 'sent' }
```

---

## 📊 قاعدة البيانات

### الجداول الرئيسية

#### جدول `bookings`
```sql
CREATE TABLE bookings (
  id VARCHAR(36) PRIMARY KEY,
  clientName TEXT NOT NULL,
  clientPhone VARCHAR(20) NOT NULL,
  eventDate TIMESTAMP NOT NULL,
  eventType VARCHAR(100),
  venueName TEXT,
  brideName TEXT,
  groomName TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### جدول `guests`
```sql
CREATE TABLE guests (
  id VARCHAR(36) PRIMARY KEY,
  bookingId VARCHAR(36) NOT NULL,
  guestName TEXT NOT NULL,
  phoneNumber VARCHAR(20) NOT NULL,
  cardsCount INT DEFAULT 1,
  rsvpStatus ENUM('pending', 'confirmed', 'declined', 'sent', 'delivered', 'read', 'failed', 'checked-in') DEFAULT 'pending',
  confirmedCount INT DEFAULT 0,
  declinedCount INT DEFAULT 0,
  metaMessageId VARCHAR(100),
  invitationSentAt TIMESTAMP,
  repliedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bookingId) REFERENCES bookings(id)
);
```

#### جدول `messages`
```sql
CREATE TABLE messages (
  id VARCHAR(36) PRIMARY KEY,
  guestId VARCHAR(36),
  bookingId VARCHAR(36),
  phoneNumber VARCHAR(20) NOT NULL,
  metaMessageId VARCHAR(100) UNIQUE,
  messageType VARCHAR(50) NOT NULL,
  messageContent JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🛠️ خطوات الربط للمطور

### Phase 1: فهم البنية (30 دقيقة)
1. اقرأ هذا الملف بالكامل
2. افهم مسار البيانات من الواجهة إلى قاعدة البيانات
3. افهم كيفية تكامل Meta API

### Phase 2: إعداد البيئة (15 دقيقة)
```bash
# 1. استنساخ المشروع
git clone <repo-url>
cd dawaa_events

# 2. تثبيت الاعتماديات
pnpm install

# 3. إعداد متغيرات البيئة
cp .env.example .env
# أضف: META_ACCESS_TOKEN, META_PHONE_NUMBER_ID, DATABASE_URL

# 4. تشغيل الخادم
pnpm dev
```

### Phase 3: ربط التصميم الجديد (1-2 ساعة)

#### الخطوة 1: استبدال صفحة الهبوط
```typescript
// client/src/pages/LandingPageHTML.tsx
import { trpc } from '../lib/trpc';

export default function LandingPageHTML() {
  const handleDemoSubmit = async (formData) => {
    try {
      const result = await trpc.demo.createDemoBooking.mutate(formData);
      // نجح! سيتم إرسال WhatsApp تلقائياً
    } catch (error) {
      console.error('خطأ:', error);
    }
  };
  
  // استخدم handleDemoSubmit في نموذج HTML الخاص بك
}
```

#### الخطوة 2: ربط لوحة الإدارة
```typescript
// client/src/pages/DashboardPageNew.tsx
import { trpc } from '../lib/trpc';

export default function DashboardPageNew() {
  // استخدم tRPC للحصول على البيانات
  const bookings = trpc.bookings.list.useQuery();
  const guests = trpc.guests.list.useQuery();
  
  // عرض الإحصائيات
  return (
    <div>
      <StatCard label="إجمالي الضيوف" value={guests.data?.length} />
      {/* ... */}
    </div>
  );
}
```

#### الخطوة 3: ربط إرسال الدعوات
```typescript
// client/src/pages/SendInvitationsPage.tsx
const handleSendInvitations = async (selectedGuests) => {
  try {
    // استدعاء API الإرسال
    const result = await trpc.invitations.send.mutate({
      bookingId,
      guestIds: selectedGuests.map(g => g.id),
    });
    
    // تحديث الواجهة
    toast.success('تم إرسال الدعوات بنجاح');
  } catch (error) {
    toast.error('فشل الإرسال');
  }
};
```

### Phase 4: الاختبار (30 دقيقة)

```bash
# 1. اختبر صفحة الهبوط
# - اذهب إلى http://localhost:3000
# - ملأ نموذج التجربة
# - تحقق من استقبال رسالة WhatsApp

# 2. اختبر لوحة الإدارة
# - سجل دخول
# - أنشئ مناسبة جديدة
# - أضف ضيوف
# - أرسل دعوات
# - تحقق من الإحصائيات

# 3. اختبر معالجة الردود
# - رد على الرسالة من WhatsApp
# - تحقق من تحديث حالة الضيف
```

---

## 📝 ملاحظات مهمة

### تنسيق رقم الهاتف
- جميع أرقام الهاتف يجب أن تكون بصيغة: `968XXXXXXXX` (بدون +)
- الدالة `cleanPhoneNumber()` تتولى التنظيف التلقائي

### معالجة الأخطاء
```typescript
try {
  await sendWeddingInvitation({...});
} catch (error) {
  console.error('خطأ في الإرسال:', error);
  // سجل الخطأ في قاعدة البيانات
  await logError({
    source: 'sendWeddingInvitation',
    errorMessage: error.message,
  });
}
```

### الأداء
- استخدم `Promise.all()` لإرسال رسائل متعددة بالتوازي
- لا تنسى تحديد حد أقصى للطلبات (Rate Limiting)

---

## 🚀 النشر

```bash
# 1. حفظ checkpoint
pnpm run checkpoint

# 2. النشر
pnpm run deploy

# 3. التحقق من الإنتاج
# - اختبر صفحة الهبوط
# - اختبر إرسال الدعوات
# - راقب السجلات
```

---

## 📞 الدعم

للأسئلة أو المشاكل:
1. تحقق من السجلات: `.manus-logs/devserver.log`
2. تحقق من أخطاء قاعدة البيانات
3. تحقق من استجابة Meta API

---

**آخر تحديث:** 2026-06-27
**الإصدار:** 1.0.0
