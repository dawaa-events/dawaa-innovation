# 📋 تعليمات للمطور - دعوة Events Platform

## 🎯 الهدف الرئيسي

ربط **نظام الإرسال عبر WhatsApp** بموقعك الحالي **بدون استخدام N8N**.

---

## 📦 الملفات المرفقة

لقد تم إرسال لك ملف مضغوط يحتوي على:

### ✅ ملفات الكود (3 ملفات)
1. **`meta-api.ts`** - دوال إرسال الرسائل عبر Meta API
2. **`rsvp-handler.ts`** - معالجة ردود الضيوف (RSVP)
3. **`meta-webhook.ts`** - استقبال الأحداث من Meta

### ✅ ملفات التوثيق (4 ملفات)
1. **`DEVELOPER_GUIDE.md`** - دليل شامل
2. **`IMPLEMENTATION_CHECKLIST.md`** - قائمة المهام
3. **`QUICK_START.md`** - البدء السريع
4. **`ENV_VARIABLES_GUIDE.md`** - شرح المتغيرات

---

## 🚀 الخطوات الأساسية

### المرحلة 1: الفهم (30 دقيقة)
```
1. اقرأ QUICK_START.md (5 دقائق)
   ↓
2. اقرأ DEVELOPER_GUIDE.md (20 دقيقة)
   ↓
3. اقرأ ENV_VARIABLES_GUIDE.md (5 دقائق)
```

### المرحلة 2: الإعداد (15 دقيقة)
```
1. احصل على Meta API credentials
   - Access Token
   - Phone Number ID
   - Webhook Verify Token
   
2. أضف المتغيرات إلى .env
   - META_ACCESS_TOKEN
   - META_PHONE_NUMBER_ID
   - META_WEBHOOK_VERIFY_TOKEN
```

### المرحلة 3: التطبيق (2-3 ساعات)
```
1. نسخ الملفات إلى مشروعك
2. تعديل قاعدة البيانات (إضافة أعمدة جديدة)
3. إنشاء API endpoints
4. ربط الـ Frontend
5. اختبار الإرسال والردود
```

---

## 📁 كيفية النسخ

### الخطوة 1: استخراج الملفات
```bash
unzip meta-api-complete.zip
cd meta-api-files
```

### الخطوة 2: نسخ ملفات الكود
```bash
# انسخ الملفات إلى مشروعك
cp meta-api.ts /your-project/server/
cp rsvp-handler.ts /your-project/server/
cp meta-webhook.ts /your-project/server/
```

### الخطوة 3: نسخ ملفات التوثيق
```bash
cp *.md /your-project/docs/
```

---

## 🔧 التعديلات المطلوبة

### 1. قاعدة البيانات
أضف هذه الأعمدة إلى جدول `guests`:
```sql
ALTER TABLE guests ADD COLUMN rsvp_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE guests ADD COLUMN confirmed_count INT DEFAULT 0;
ALTER TABLE guests ADD COLUMN declined_count INT DEFAULT 0;
ALTER TABLE guests ADD COLUMN pending_count INT DEFAULT 0;
ALTER TABLE guests ADD COLUMN replied_at TIMESTAMP NULL;
ALTER TABLE guests ADD COLUMN delivered_at TIMESTAMP NULL;
ALTER TABLE guests ADD COLUMN read_at TIMESTAMP NULL;
ALTER TABLE guests ADD COLUMN meta_message_id VARCHAR(255) NULL;
```

### 2. الـ Backend
أضف هذا إلى `server/index.ts`:
```typescript
import { registerMetaWebhook } from './meta-webhook';

// بعد إنشاء app
registerMetaWebhook(app);
```

### 3. API Routes
أضف هذا إلى `server/routers.ts`:
```typescript
import { sendWeddingInvitation } from './meta-api';

export const booking = router({
  sendInvitations: publicProcedure
    .input(z.object({ 
      bookingId: z.string(),
      guests: z.array(z.object({
        id: z.string(),
        phone: z.string(),
        name: z.string(),
      }))
    }))
    .mutation(async ({ input }) => {
      const results = [];
      for (const guest of input.guests) {
        const result = await sendWeddingInvitation({
          phoneNumber: guest.phone,
          guestName: guest.name,
          hostOne: "المضيف الأول",
          hostTwo: "المضيف الثاني",
          brideName: "اسم العروس",
          groomName: "اسم العريس",
          cardsCount: 1,
        });
        results.push(result);
      }
      return results;
    }),
});
```

### 4. الـ Frontend
أضف زر الإرسال:
```typescript
import { trpc } from '@/lib/trpc';

export function SendInvitationsPage() {
  const sendMutation = trpc.booking.sendInvitations.useMutation();
  
  const handleSend = async () => {
    await sendMutation.mutateAsync({
      bookingId: "xxx",
      guests: [
        { id: "1", phone: "966912345678", name: "أحمد" }
      ]
    });
  };
  
  return (
    <button onClick={handleSend} disabled={sendMutation.isPending}>
      {sendMutation.isPending ? "جاري الإرسال..." : "إرسال الدعوات"}
    </button>
  );
}
```

---

## 🧪 الاختبار

### اختبار 1: الإرسال
```bash
# 1. اضغط على زر "إرسال الدعوات"
# 2. تحقق من استقبال الرسالة على WhatsApp
# 3. تحقق من قاعدة البيانات (meta_message_id يجب أن يكون موجود)
```

### اختبار 2: الردود
```bash
# 1. اضغط على زر الحضور أو الاعتذار في الرسالة
# 2. تحقق من تحديث حالة الضيف في قاعدة البيانات
# 3. تحقق من استقبال رسالة التأكيد
```

### اختبار 3: الـ Webhook
```bash
# تحقق من السجلات:
tail -f .manus-logs/devserver.log | grep Webhook
```

---

## 🔐 المتغيرات المطلوبة

```env
# Meta API (مطلوب)
META_ACCESS_TOKEN=EAABsbCS1iHgBOZBLZAZA...
META_PHONE_NUMBER_ID=1234567890
META_WEBHOOK_VERIFY_TOKEN=dawaa_webhook_2024

# قاعدة البيانات (موجود بالفعل)
DATABASE_URL=mysql://user:pass@host/db

# التطبيق (موجود بالفعل)
NODE_ENV=development
PORT=3000
```

---

## 📊 البنية الكاملة

```
المستخدم
  ↓
Frontend (زر الإرسال)
  ↓
API (trpc.booking.sendInvitations)
  ↓
meta-api.ts (sendWeddingInvitation)
  ↓
Meta Graph API
  ↓
WhatsApp
  ↓
جهاز الضيف
  ↓
الضيف يضغط على زر الحضور
  ↓
Meta Webhook
  ↓
meta-webhook.ts (POST /api/webhook/meta)
  ↓
rsvp-handler.ts (handleRsvpClick)
  ↓
قاعدة البيانات (تحديث الحالة)
  ↓
meta-api.ts (sendRsvpConfirmed)
  ↓
رسالة تأكيد للضيف
```

---

## ⚠️ النقاط المهمة

### ✅ افعل:
- ✅ اقرأ التوثيق بالكامل أولاً
- ✅ اختبر الإرسال قبل النشر
- ✅ احفظ المتغيرات في مكان آمن
- ✅ استخدم Webhook Verify Token
- ✅ تحقق من السجلات عند حدوث مشكلة

### ❌ لا تفعل:
- ❌ لا تنسخ الملفات بدون فهمها
- ❌ لا تستخدم نفس الـ Access Token في بيئات مختلفة
- ❌ لا تضع المتغيرات الحساسة في الكود
- ❌ لا تغير أسماء الدوال بدون تحديث الاستدعاءات
- ❌ لا تنسى تسجيل الـ Webhook في Meta

---

## 🐛 استكشاف الأخطاء الشائعة

| المشكلة | الحل |
|--------|------|
| لا تصل الرسائل | تحقق من `META_ACCESS_TOKEN` و `META_PHONE_NUMBER_ID` |
| الردود لا تُحدَّث | تحقق من Webhook URL وVerify Token في Meta |
| خطأ في قاعدة البيانات | تأكد من إضافة الأعمدة الجديدة |
| الـ Webhook لا يعمل | تحقق من أن الـ URL عام وليس localhost |
| رسائل الخطأ غير واضحة | اقرأ السجلات في `.manus-logs/devserver.log` |

---

## 📞 الدعم

إذا واجهت مشكلة:

1. **اقرأ السجلات:**
   ```bash
   tail -f .manus-logs/devserver.log
   ```

2. **تحقق من الـ Webhook:**
   ```bash
   curl -X GET "http://localhost:3000/api/webhook/meta?hub.mode=subscribe&hub.verify_token=dawaa_webhook_2024&hub.challenge=test"
   ```

3. **اختبر الإرسال يدوياً:**
   ```bash
   curl -X POST http://localhost:3000/api/trpc/booking.sendInvitations \
     -H "Content-Type: application/json" \
     -d '{"bookingId":"xxx","guests":[...]}'
   ```

---

## ✅ قائمة التحقق النهائية

قبل النشر:
- [ ] تم قراءة التوثيق بالكامل
- [ ] تم إضافة المتغيرات في `.env`
- [ ] تم نسخ ملفات الكود
- [ ] تم تعديل قاعدة البيانات
- [ ] تم إضافة API routes
- [ ] تم ربط الـ Frontend
- [ ] تم تسجيل الـ Webhook في Meta
- [ ] تم اختبار الإرسال
- [ ] تم اختبار الردود
- [ ] تم التحقق من السجلات

---

## 📚 الملفات الإضافية

- **DEVELOPER_GUIDE.md** - شرح تفصيلي لكل ملف
- **IMPLEMENTATION_CHECKLIST.md** - خطوات التطبيق خطوة بخطوة
- **QUICK_START.md** - البدء السريع
- **ENV_VARIABLES_GUIDE.md** - شرح جميع المتغيرات

---

## 🎯 الخطوات التالية

بعد إكمال التطبيق:

1. **اختبار شامل** - اختبر جميع السيناريوهات
2. **تحسين الأداء** - أضف caching إذا لزم الأمر
3. **المراقبة** - راقب السجلات والأخطاء
4. **التوسع** - أضف ميزات جديدة (SMS, Email, إلخ)

---

## 📞 تواصل

إذا كان لديك أسئلة:
- اقرأ التوثيق أولاً
- تحقق من السجلات
- اختبر يدوياً
- اطلب المساعدة

---

**آخر تحديث:** 2026-06-27
**الإصدار:** 1.0.0
**الحالة:** جاهز للتطبيق ✅
