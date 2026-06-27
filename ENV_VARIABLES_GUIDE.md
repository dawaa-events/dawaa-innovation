# دليل متغيرات البيئة - دعوة

## 📋 جميع متغيرات البيئة المطلوبة

### قاعدة البيانات (Database)

| المتغير | الوصف | مثال | مطلوب |
|--------|-------|------|------|
| `DATABASE_URL` | رابط الاتصال بقاعدة البيانات | `mysql://user:pass@host:3306/dawaa` | ✅ نعم |
| `DRIZZLE_DATABASE_URL` | رابط Drizzle ORM | `mysql://user:pass@host:3306/dawaa` | ✅ نعم |
| `DB_HOST` | اسم المضيف | `localhost` أو `db.example.com` | ✅ نعم |
| `DB_PORT` | منفذ قاعدة البيانات | `3306` | ✅ نعم |
| `DB_USER` | اسم المستخدم | `root` | ✅ نعم |
| `DB_PASSWORD` | كلمة المرور | `your_password` | ✅ نعم |
| `DB_NAME` | اسم قاعدة البيانات | `dawaa_events` | ✅ نعم |

### Meta WhatsApp API

| المتغير | الوصف | كيفية الحصول عليه | مطلوب |
|--------|-------|------------------|------|
| `META_ACCESS_TOKEN` | توكن الوصول إلى Meta API | [Meta Developers](https://developers.facebook.com/) | ✅ نعم |
| `META_PHONE_NUMBER_ID` | معرف رقم الهاتف | Meta Business Account | ✅ نعم |

**خطوات الحصول على Meta Tokens:**
1. اذهب إلى https://developers.facebook.com/
2. أنشئ تطبيق جديد
3. أضف WhatsApp Business Platform
4. احصل على Access Token و Phone Number ID
5. ضع القيم في المتغيرات

### المصادقة (Authentication)

| المتغير | الوصف | مثال | مطلوب |
|--------|-------|------|------|
| `JWT_SECRET` | مفتاح التوقيع للـ JWT | `your_secret_key_12345` | ✅ نعم |
| `OAUTH_SERVER_URL` | رابط خادم OAuth | `https://oauth.example.com` | ⚠️ اختياري |

### N8N Webhook

| المتغير | الوصف | مثال | مطلوب |
|--------|-------|------|------|
| `N8N_WEBHOOK_URL` | رابط Webhook من N8N | `https://n8n.example.com/webhook/xxx` | ⚠️ اختياري |

### Forge API (مدمج)

| المتغير | الوصف | مطلوب |
|--------|-------|------|
| `BUILT_IN_FORGE_API_KEY` | مفتاح Forge API | ✅ نعم |
| `BUILT_IN_FORGE_API_URL` | رابط Forge API | ✅ نعم |
| `VITE_FRONTEND_FORGE_API_KEY` | مفتاح Forge للواجهة | ✅ نعم |
| `VITE_FRONTEND_FORGE_API_URL` | رابط Forge للواجهة | ✅ نعم |

### التطبيق (Application)

| المتغير | الوصف | مثال | مطلوب |
|--------|-------|------|------|
| `VITE_APP_TITLE` | اسم التطبيق | `دعوة - Dawaa` | ✅ نعم |
| `VITE_APP_LOGO` | رابط الشعار | `https://example.com/logo.png` | ✅ نعم |
| `VITE_APP_ID` | معرف التطبيق | `app_12345` | ✅ نعم |

### التحليلات (Analytics)

| المتغير | الوصف | مطلوب |
|--------|-------|------|
| `VITE_ANALYTICS_ENDPOINT` | نقطة نهاية التحليلات | ⚠️ اختياري |
| `VITE_ANALYTICS_WEBSITE_ID` | معرف الموقع | ⚠️ اختياري |

### بيانات المالك (Owner)

| المتغير | الوصف | مثال | مطلوب |
|--------|-------|------|------|
| `OWNER_NAME` | اسم المالك | `أحمد محمد` | ✅ نعم |
| `OWNER_OPEN_ID` | معرف OAuth للمالك | `user_12345` | ✅ نعم |

### بوابة OAuth

| المتغير | الوصف | مطلوب |
|--------|-------|------|
| `VITE_OAUTH_PORTAL_URL` | رابط بوابة OAuth | ⚠️ اختياري |

### الخادم (Server)

| المتغير | الوصف | مثال | مطلوب |
|--------|-------|------|------|
| `NODE_ENV` | بيئة التشغيل | `development` أو `production` | ✅ نعم |
| `PORT` | منفذ الخادم | `3000` | ✅ نعم |

### البريد الإلكتروني (Email) - اختياري

| المتغير | الوصف | مثال |
|--------|-------|------|
| `SMTP_HOST` | خادم SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | منفذ SMTP | `587` |
| `SMTP_USER` | اسم مستخدم SMTP | `your_email@gmail.com` |
| `SMTP_PASSWORD` | كلمة مرور SMTP | `your_app_password` |
| `SMTP_FROM` | عنوان البريد المرسل | `noreply@example.com` |

---

## 🔐 الخطوات الآمنة لإعداد المتغيرات

### الخطوة 1: إنشاء ملف `.env` محلي
```bash
cp .env.example .env
```

### الخطوة 2: ملء البيانات الحساسة
```env
# قاعدة البيانات
DATABASE_URL=mysql://user:password@host:3306/dawaa_events

# Meta WhatsApp
META_ACCESS_TOKEN=EAABsbCS1iHgBOZBLZAZA...
META_PHONE_NUMBER_ID=1234567890

# المصادقة
JWT_SECRET=your_secret_key_here
```

### الخطوة 3: عدم مشاركة الملف
```bash
# تأكد من أن .env في .gitignore
echo ".env" >> .gitignore
```

### الخطوة 4: النشر الآمن
```bash
# استخدم متغيرات البيئة من نظام التشغيل
export DATABASE_URL=mysql://...
export META_ACCESS_TOKEN=...
```

---

## 📝 ملف `.env.example` الآمن

```env
# دعوة - متغيرات البيئة
# Environment Variables for Dawaa Events Platform

# قاعدة البيانات
DATABASE_URL=mysql://user:password@host:port/database
DRIZZLE_DATABASE_URL=mysql://user:password@host:port/database

# Meta WhatsApp API
META_ACCESS_TOKEN=your_meta_access_token_here
META_PHONE_NUMBER_ID=your_phone_number_id_here

# المصادقة
JWT_SECRET=your_jwt_secret_key_here
OAUTH_SERVER_URL=your_oauth_server_url

# N8N
N8N_WEBHOOK_URL=your_n8n_webhook_url_here

# Forge API
BUILT_IN_FORGE_API_KEY=your_forge_api_key
BUILT_IN_FORGE_API_URL=your_forge_api_url
VITE_FRONTEND_FORGE_API_KEY=your_frontend_forge_api_key
VITE_FRONTEND_FORGE_API_URL=your_frontend_forge_api_url

# التطبيق
VITE_APP_TITLE=دعوة - Dawaa
VITE_APP_LOGO=your_logo_url
VITE_APP_ID=your_app_id

# التحليلات
VITE_ANALYTICS_ENDPOINT=your_analytics_endpoint
VITE_ANALYTICS_WEBSITE_ID=your_analytics_website_id

# بيانات المالك
OWNER_NAME=Owner Name
OWNER_OPEN_ID=owner_open_id

# OAuth Portal
VITE_OAUTH_PORTAL_URL=your_oauth_portal_url

# الخادم
NODE_ENV=development
PORT=3000

# قاعدة البيانات (تفاصيل)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=dawaa_events

# البريد (اختياري)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
```

---

## ⚠️ نصائح أمان مهمة

### ✅ افعل:
- ✅ استخدم متغيرات البيئة
- ✅ احفظ البيانات الحساسة في مكان آمن
- ✅ استخدم Password Manager
- ✅ غير التوكنات بانتظام
- ✅ لا تشارك `.env` مع أحد

### ❌ لا تفعل:
- ❌ لا تحفظ البيانات الحساسة في الكود
- ❌ لا تشارك التوكنات عبر البريد
- ❌ لا تضع `.env` في Git
- ❌ لا تستخدم نفس التوكن في بيئات مختلفة
- ❌ لا تترك البيانات الحساسة في السجلات

---

## 🔄 تحديث المتغيرات

### تحديث في الإنتاج
```bash
# استخدم Secrets Management
# مثال: AWS Secrets Manager, HashiCorp Vault, etc.
```

### تحديث في التطوير
```bash
# عدّل ملف .env محلياً
# ثم أعد تشغيل الخادم
pnpm dev
```

---

## 📞 الدعم

للأسئلة حول المتغيرات:
1. اقرأ هذا الملف بالكامل
2. تحقق من الأمثلة
3. تواصل مع فريق الدعم

---

**آخر تحديث:** 2026-06-27
**الإصدار:** 1.0.0
