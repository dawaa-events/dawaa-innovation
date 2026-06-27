# إصلاح فشل النشر في Vercel

سبب الفشل كان من `pnpm-lock.yaml` لأنه يشير إلى ملف Patch غير موجود:

`patches/wouter@3.7.1.patch`

تم إصلاح النسخة بهذه التغييرات فقط:

- حذف `pnpm-lock.yaml`
- حذف إعداد `packageManager` من `package.json`
- حذف `pnpm.patchedDependencies`
- حذف `pnpm` من devDependencies
- عدم تغيير واجهة الموقع
- عدم تغيير منطق RSVP الذي تم تطبيقه

بعد رفع هذه النسخة على Vercel، سيستخدم Vercel `npm install` بدل `pnpm install` ولن يبحث عن ملف الـ patch المفقود.
