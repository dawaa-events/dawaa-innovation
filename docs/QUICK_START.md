# دليل البدء السريع - دعوة

## 🚀 البدء في 5 دقائق

### الخطوة 1: الإعداد الأساسي (2 دقيقة)

```bash
# 1. استنساخ المشروع
git clone <repo-url>
cd dawaa_events

# 2. تثبيت الاعتماديات
pnpm install

# 3. إعداد متغيرات البيئة
cat > .env << EOF
DATABASE_URL=mysql://user:password@host/database
META_ACCESS_TOKEN=your_token
META_PHONE_NUMBER_ID=your_phone_id
EOF

# 4. تشغيل الخادم
pnpm dev
```

### الخطوة 2: فهم البنية (2 دقيقة)

```
صفحة الهبوط (Landing Page)
    ↓
نموذج التجربة (Demo Form)
    ↓
API: trpc.demo.createDemoBooking
    ↓
إنشاء حجز + إرسال WhatsApp
    ↓
لوحة الإدارة (Dashboard)
```

### الخطوة 3: اختبار سريع (1 دقيقة)

1. افتح `http://localhost:3000`
2. ملأ نموذج التجربة
3. تحقق من استقبال رسالة WhatsApp
4. ✅ نجح!

---

## 📁 الملفات المهمة

| الملف | الوصف | الأولوية |
|------|-------|---------|
| `DEVELOPER_GUIDE.md` | دليل شامل للمطورين | ⭐⭐⭐ |
| `IMPLEMENTATION_CHECKLIST.md` | قائمة مهام التطبيق | ⭐⭐⭐ |
| `server/routers.ts` | API الرئيسية | ⭐⭐⭐ |
| `server/meta-api.ts` | تكامل WhatsApp | ⭐⭐⭐ |
| `client/src/pages/LandingPageHTML.tsx` | صفحة الهبوط | ⭐⭐ |
| `client/src/pages/DashboardPageNew.tsx` | لوحة الإدارة | ⭐⭐ |

---

## 🔌 المتغيرات المطلوبة

```env
# قاعدة البيانات
DATABASE_URL=mysql://user:password@host:port/database

# Meta WhatsApp API
META_ACCESS_TOKEN=EAABsbCS1iHgBOZBLZAZAZA...
META_PHONE_NUMBER_ID=1234567890

# (اختياري)
JWT_SECRET=your_secret_key
```

---

## 🎯 الخطوات الرئيسية للتطبيق

### 1️⃣ استبدال التصميم
```typescript
// client/src/pages/LandingPageHTML.tsx
// استبدل HTML الحالي بالتصميم الجديد
// ربط النموذج بـ trpc.demo.createDemoBooking
```

### 2️⃣ اختبار الإرسال
```bash
# 1. ملأ نموذج التجربة
# 2. تحقق من رسالة WhatsApp
# 3. اختبر الرد
```

### 3️⃣ ربط لوحة الإدارة
```typescript
// client/src/pages/DashboardPageNew.tsx
// استبدل التصميم الحالي
// ربط الإحصائيات والرسوم البيانية
```

### 4️⃣ النشر
```bash
pnpm run deploy
```

---

## 🧪 اختبارات سريعة

### اختبار 1: إنشاء مناسبة
```bash
curl -X POST http://localhost:3000/api/trpc/demo.createDemoBooking \
  -H "Content-Type: application/json" \
  -d '{
    "name": "أحمد",
    "phone": "96891234567",
    "location": "الفندق",
    "groom": "محمد",
    "bride": "فاطمة"
  }'
```

### اختبار 2: الحصول على المناسبات
```bash
curl http://localhost:3000/api/trpc/bookings.list
```

### اختبار 3: الحصول على الضيوف
```bash
curl http://localhost:3000/api/trpc/guests.list?bookingId=xxx
```

---

## 🐛 استكشاف الأخطاء السريع

| المشكلة | الحل |
|--------|------|
| لا تصل الرسائل | تحقق من `META_ACCESS_TOKEN` و `META_PHONE_NUMBER_ID` |
| الردود لا تُحدَّث | تحقق من Webhook URL في Meta |
| خطأ في قاعدة البيانات | تحقق من `DATABASE_URL` |
| الواجهة بطيئة | تحقق من الاستعلامات في `.manus-logs/` |

---

## 📚 الموارد الإضافية

- **الدليل الشامل:** `DEVELOPER_GUIDE.md`
- **قائمة المهام:** `IMPLEMENTATION_CHECKLIST.md`
- **السجلات:** `.manus-logs/devserver.log`
- **قاعدة البيانات:** استخدم Drizzle Studio

---

## ✅ قائمة التحقق النهائية

قبل النشر:
- [ ] الإرسال يعمل
- [ ] الردود تُحدَّث
- [ ] الإحصائيات صحيحة
- [ ] لا توجد أخطاء في السجلات

---

**هل تحتاج مساعدة؟** اقرأ `DEVELOPER_GUIDE.md` للتفاصيل الكاملة.

**آخر تحديث:** 2026-06-27
