# إصلاح النشر على Vercel

تم تجهيز هذه النسخة لتفادي التوقف عند `Installing dependencies...`.

## ما تم تعديله

- حذف اعتماد `@supabase/supabase-js` من `package.json`.
- حذف `vercel` من `devDependencies` لأنه لا يحتاج أن يكون داخل المشروع.
- حذف `package-lock.json` القديم.
- تعديل اتصال Supabase ليعمل عبر REST API مباشرة باستخدام `fetch`، لذلك لا يحتاج Vercel إلى تنزيل حزم.
- فحص ملفات API بـ `node -c` وتمت بنجاح.

## بعد الرفع

افتحي:

```text
https://YOUR-PROJECT.vercel.app/api/health
```

إذا ظهرت:

```json
{"ok":true}
```

فالمشروع ارتفع والـ API يعمل.
