# ربط DAWAA Events مع Meta WhatsApp

تم تجهيز المشروع ليعمل بهذه المتغيرات في Vercel.

## أين تضعين البيانات؟

Vercel → Project → Settings → Environment Variables

انسخي القيم من الملف:

`.env.vercel.ready`

ثم اضغطي Redeploy للمشروع.

---

## Webhook URL في Meta

بعد رفع المشروع على Vercel، سجلي هذا الرابط في Meta:

```text
https://YOUR-VERCEL-DOMAIN.vercel.app/api/webhook/meta
```

استبدلي `YOUR-VERCEL-DOMAIN` برابط مشروعك الحقيقي.

## Verify Token

```text
dawaa2026
```

## Webhook fields المطلوبة

فعّلي هذه الاشتراكات في Meta WhatsApp Webhooks:

- messages
- message_template_status_update
- message_template_quality_update

---

## اختبار الربط

بعد وضع المتغيرات وإعادة النشر، افتحي:

```text
https://YOUR-VERCEL-DOMAIN.vercel.app/api/health
```

المفروض تظهر:

```json
{
  "ok": true,
  "metaConfigured": true,
  "supabaseConfigured": true
}
```

إذا `metaConfigured` أو `supabaseConfigured` رجعت `false`، يعني المتغيرات ما انضافت صح في Vercel أو لم يتم عمل Redeploy.

---

## ملاحظة مهمة

القيم الحساسة لا تُكتب داخل ملفات JavaScript. تم وضعها في ملف منفصل فقط لتسهيل النسخ إلى Vercel.
