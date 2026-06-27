# إصلاح تحقق Meta Webhook

تم ضبط المشروع بحيث يقبل Verify Token التالي مباشرة:

```text
dawaa2026
```

رابط Webhook في Meta:

```text
https://dawaa-innovation.vercel.app/api/webhook/meta
```

اختبار يدوي بعد النشر:

```text
https://dawaa-innovation.vercel.app/api/webhook/meta?hub.mode=subscribe&hub.verify_token=dawaa2026&hub.challenge=test123
```

إذا ظهر `test123` فهذا يعني أن Meta Verify سيعمل.

ملاحظة: إذا تم تغيير الدومين في Vercel، غيّري الرابط إلى الدومين الجديد بنفس المسار `/api/webhook/meta`.
