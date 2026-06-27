# إصلاح RSVP Confirmation المطبق

تم تطبيق الإصلاح بدون تعديل واجهة الموقع أو صفحات التصميم.

## الملفات المعدلة

1. `server/meta-webhook.ts`
   - لم يعد يرسل `res.status(200).send("OK")` قبل معالجة الرد.
   - هذا مهم جدًا على Vercel/serverless لأن التنفيذ قد يتوقف بعد إرسال الرد، فتفشل عملية تحديث الحالة وإرسال رسالة التأكيد.
   - دعم قراءة أزرار Meta بصيغ:
     - `message.type === "button"`
     - `message.type === "interactive"` مع `button_reply`
     - `message.type === "interactive"` مع `list_reply`
   - دعم تحويل نصوص الأزرار العربية إلى:
     - `btn_confirm`
     - `btn_decline`
   - إضافة logging أوضح عند:
     - استقبال Webhook
     - ضغط زر RSVP
     - عدم العثور على الضيف
     - تحديث الرد
     - إرسال رسالة التأكيد

2. `server/db.ts`
   - تحسين البحث عن الضيف بالهاتف.
   - يدعم الآن صيغ مختلفة للرقم:
     - `968XXXXXXXX`
     - `+968XXXXXXXX`
     - رقم عمان المحلي 8 أرقام
     - أرقام فيها مسافات أو رموز
   - يفضل الضيف الذي حالته `pending` أولًا، ثم يرجع لأحدث ضيف بنفس الرقم.

3. `server/meta-api.ts`
   - دعم متغيرات البيئة البديلة:
     - `META_PHONE_NUMBER_ID`
     - `PHONE_NUMBER_ID`
   - دعم `META_API_VERSION` من البيئة مع fallback إلى `v25.0`.

## المطلوب بعد الرفع

1. ارفعي النسخة.
2. أضيفي المتغيرات في بيئة النشر.
3. اعملي Redeploy.
4. أرسلي دعوة اختبار.
5. اضغطي زر "أرغب في الحضور".
6. راقبي الـ Logs وابحثي عن:
   - `[Webhook] Received`
   - `[Webhook] Quick reply button press`
   - `[DB] Found pending guest`
   - `[RSVP] Guest updated successfully`
   - `[Webhook] ✅ Sent dawaa_rsvp_confirmed`

