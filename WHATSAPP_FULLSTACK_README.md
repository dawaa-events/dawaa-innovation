# DAWAA Events — WhatsApp Meta Full Stack Integration

هذه النسخة حوّلت الموقع من Frontend فقط إلى مشروع Vercel Full Stack خفيف، بحيث يعمل إرسال WhatsApp مباشرة عبر Meta Cloud API بدون n8n.

## ما تمت إضافته

- `/api/send-invitations` لإرسال الدعوات من صفحة الإدارة.
- `/api/webhook/meta` لاستقبال ردود WhatsApp من Meta.
- تحديث حالات الضيوف في Supabase: مرسل، تم التسليم، تمت القراءة، حاضر، معتذر، فشل.
- معالجة RSVP:
  - زر **أرغب في الحضور**.
  - زر **أعتذر عن الحضور**.
  - إذا عدد البطاقات أكثر من 1، يرسل النظام قائمة لاختيار عدد الحضور.
- تسجيل الرسائل والأحداث في جداول:
  - `messages`
  - `guest_timeline_events`
  - `webhook_events`
- دعم تلقائي لنوع متغيرات قالب Meta:
  - named variables مثل `guest_name`
  - numbered variables مثل `{{1}}`
  - الوضع الافتراضي `auto` يجرب named ثم numbered إذا رفضت Meta الصيغة.

## متغيرات Vercel المطلوبة

أضيفي هذه القيم في Vercel → Project Settings → Environment Variables:

```env
META_ACCESS_TOKEN=ضع_توكن_Meta_هنا
META_PHONE_NUMBER_ID=ضع_Phone_Number_ID_هنا
META_WEBHOOK_VERIFY_TOKEN=dawaa_webhook_2024
META_API_VERSION=v25.0
META_INVITATION_TEMPLATE=dawaa_wedding_invitation
META_TEMPLATE_LANGUAGE=ar
META_TEMPLATE_PARAMETER_MODE=auto

SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ضع_Service_Role_Key_هنا
```

اختياريًا، لحماية زر الإرسال:

```env
DAWAA_SEND_API_TOKEN=اكتبي_رمز_سري_طويل
```

إذا فعلتي هذا المتغير، افتحي الموقع في المتصفح مرة واحدة وشغلي من Console:

```js
localStorage.setItem('dawaa_send_token', 'نفس_الرمز_السري')
```

## رابط Webhook في Meta

بعد النشر على Vercel، سجلي هذا الرابط في Meta Developers:

```text
https://YOUR-DOMAIN.vercel.app/api/webhook/meta
```

Verify Token:

```text
dawaa_webhook_2024
```

أو نفس القيمة التي تضعينها في `META_WEBHOOK_VERIFY_TOKEN`.

## قاعدة البيانات

شغلي ملف `supabase.sql` داخل Supabase SQL Editor. الملف يحتوي على إضافات WhatsApp المطلوبة:

- `guests.meta_message_id`
- `webhook_events`
- فهارس البحث بالرسالة والرقم
- جداول الرسائل والتايملاين

## طريقة الاختبار

1. افتحي الموقع وسجلي دخول الإدارة.
2. ادخلي صفحة **الإرسال**.
3. اختاري المناسبة.
4. أضيفي أو ارفعي الضيوف.
5. اضغطي **تنفيذ الإرسال**.
6. تأكدي أن الرسالة وصلت في WhatsApp.
7. اضغطي زر الحضور أو الاعتذار.
8. تأكدي أن حالة الضيف تغيرت في صفحة الضيوف/التقارير.

## ملاحظات مهمة

- لا تضعي `META_ACCESS_TOKEN` داخل `app.js` أو أي ملف Frontend.
- `SUPABASE_SERVICE_ROLE_KEY` يجب أن يبقى في Vercel فقط.
- إذا قالب `dawaa_wedding_invitation` عندك يستخدم `{{1}} {{2}} ...` فالوضع `auto` سيتعامل معه تلقائيًا.
- إذا تستخدمين قالب named variables، الوضع `auto` يعمل أيضًا.
- لا تحتاجين n8n في هذه النسخة.
