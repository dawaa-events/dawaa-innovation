# خطوات النشر الآن

1. ارفعي المشروع إلى GitHub أو Vercel مباشرة.
2. افتحي Vercel Project Settings.
3. ادخلي Environment Variables.
4. انسخي كل القيم من `.env.vercel.ready`.
5. اضغطي Redeploy.
6. افتحي `/api/health` وتحققي من أن الربط ظهر true.
7. في Meta Developers ضعي Webhook URL:
   `https://YOUR-VERCEL-DOMAIN.vercel.app/api/webhook/meta`
8. Verify Token:
   `dawaa2026`
9. اختبري الإرسال من الموقع.
