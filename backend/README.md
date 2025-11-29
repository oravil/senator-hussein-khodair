# Backend API - موقع د. حسين خضير

API خلفي باستخدام Express.js + MongoDB

## 🚀 التثبيت والتشغيل

```bash
# تثبيت المكتبات
npm install

# نسخ ملف البيئة
cp .env.example .env

# تشغيل الخادم
npm run dev
```

## 📁 هيكل المشروع

```
├── config/             # ملفات التكوين
│   └── database.js
├── models/             # نماذج قاعدة البيانات
│   ├── News.model.js
│   ├── Contact.model.js
│   └── User.model.js
├── controllers/        # معالجات الطلبات
│   ├── news.controller.js
│   ├── contact.controller.js
│   ├── auth.controller.js
│   └── stats.controller.js
├── routes/             # المسارات
│   ├── news.routes.js
│   ├── contact.routes.js
│   ├── auth.routes.js
│   └── stats.routes.js
├── middleware/         # الوسائط
│   └── auth.middleware.js
└── server.js           # ملف البداية
```

## 🔧 المتغيرات البيئية

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/senator-db
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

## 📡 المسارات (Endpoints)

### الأخبار
- `GET /api/news` - الحصول على جميع الأخبار
- `GET /api/news/:id` - الحصول على خبر محدد
- `POST /api/news` - إنشاء خبر جديد (مدير فقط)
- `PUT /api/news/:id` - تحديث خبر (مدير فقط)
- `DELETE /api/news/:id` - حذف خبر (مدير فقط)

### الرسائل
- `POST /api/contact` - إرسال رسالة
- `GET /api/contact` - الحصول على جميع الرسائل (محمي)
- `GET /api/contact/:id` - الحصول على رسالة محددة (محمي)
- `PATCH /api/contact/:id/status` - تحديث حالة رسالة (محمي)
- `DELETE /api/contact/:id` - حذف رسالة (محمي)

### المصادقة
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - الحصول على المستخدم الحالي (محمي)
- `POST /api/auth/users` - إنشاء مستخدم (مدير فقط)

### الإحصائيات
- `GET /api/stats` - الحصول على الإحصائيات (محمي)

## 📦 المكتبات المستخدمة

- Express.js
- Mongoose (MongoDB ODM)
- bcryptjs (تشفير كلمات المرور)
- jsonwebtoken (المصادقة)
- cors
- helmet (الأمان)
- express-rate-limit (تحديد الطلبات)
