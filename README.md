# موقع د. حسين خضير - عضو مجلس الشيوخ

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D6.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![GitHub Stars](https://img.shields.io/github/stars/oravil/senator-hussein-khodair?style=social)
![GitHub Forks](https://img.shields.io/github/forks/oravil/senator-hussein-khodair?style=social)

مشروع متكامل واحترافي لموقع السيناتور د. حسين خضير - عضو مجلس الشيوخ المصري

[📖 الوثائق](./docs/INSTALLATION_GUIDE.md) • [🚀 البدء السريع](./docs/QUICK_START.md) • [❓ الأسئلة الشائعة](./docs/FAQ.md) • [🔒 الأمان](./docs/SECURITY.md)

</div>

---

## 📋 نظرة عامة

مشروع Full Stack متكامل يتضمن:

- 🌐 **واجهة أمامية** للزوار (React + Vite + Tailwind CSS)
- 🔧 **API خلفي** قوي (Express + MongoDB)
- 👨‍💼 **لوحة تحكم** شاملة للإدارة (React + Vite)

---

## 🏗️ هيكل المشروع

```
oravil/
│
├── frontend/                    # الواجهة الأمامية
│   ├── src/
│   │   ├── components/         # Header, Footer, Layout, etc.
│   │   ├── pages/              # HomePage, AboutPage, NewsPage, ContactPage
│   │   ├── services/           # API Services
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                     # API الخلفي
│   ├── config/                 # Database configuration
│   ├── models/                 # News, Contact, User models
│   ├── controllers/            # Business logic
│   ├── routes/                 # API routes
│   ├── middleware/             # Authentication, etc.
│   ├── scripts/                # Helper scripts (createAdmin)
│   └── server.js
│
├── admin-dashboard/             # لوحة التحكم
│   ├── src/
│   │   ├── components/         # Sidebar, Layout
│   │   ├── pages/              # Dashboard, News, Contacts
│   │   ├── services/           # API Services
│   │   └── utils/              # Auth utilities
│   ├── package.json
│   └── vite.config.js
│
├── docs/                        # المستندات والأدلة
├── package.json                 # Scripts للمشروع الكامل
└── README.md                    # هذا الملف
```

---

## ✨ المميزات

### الموقع الأمامي
- ✅ تصميم عصري ومتجاوب
- ✅ صفحة رئيسية مع الإنجازات
- ✅ السيرة الذاتية الكاملة
- ✅ عرض الأخبار والفعاليات
- ✅ نموذج تواصل تفاعلي
- ✅ دعم RTL (العربية)

### لوحة التحكم
- ✅ لوحة معلومات بالإحصائيات
- ✅ إدارة الأخبار (CRUD كامل)
- ✅ متابعة الرسائل وتحديث حالاتها
- ✅ رسوم بيانية تفاعلية
- ✅ نظام مصادقة آمن

### Backend API
- ✅ RESTful API
- ✅ مصادقة JWT
- ✅ Validation
- ✅ Error handling
- ✅ Rate limiting
- ✅ Security headers (Helmet)

---

## 🚀 البدء السريع

### المتطلبات
- **Node.js** >= 18.0.0
- **MongoDB** >= 6.0.0
- **npm** أو **yarn**

### التثبيت السريع

```powershell
# 1. تثبيت جميع المكتبات
npm run install:all

# 2. إعداد المشروع وإنشاء مستخدم المدير
npm run setup

# 3. نسخ ملفات البيئة (في كل مجلد)
cd backend; copy .env.example .env
cd ../frontend; copy .env.example .env
cd ../admin-dashboard; copy .env.example .env
```

### التشغيل

افتح **3 نوافذ PowerShell** منفصلة:

```powershell
# نافذة 1: Backend
npm run dev:backend

# نافذة 2: Frontend
npm run dev:frontend

# نافذة 3: Admin Dashboard
npm run dev:admin
```

### الروابط

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Dashboard**: http://localhost:3001

### بيانات الدخول الافتراضية

```
Username: admin
Password: admin123
```

⚠️ **مهم**: غير كلمة المرور بعد أول تسجيل دخول!

---

## 📚 الوثائق

للمزيد من التفاصيل، راجع:

- 📖 [دليل التثبيت المفصل](./docs/INSTALLATION_GUIDE.md)
- 📖 [دليل البدء السريع](./docs/QUICK_START.md)
- 📖 [الأسئلة الشائعة](./docs/FAQ.md)
- 📖 [دليل النشر](./docs/DEPLOYMENT.md)
- 📖 [سياسة الأمان](./docs/SECURITY.md)
- 📖 [دليل المساهمة](./docs/CONTRIBUTING.md)
- 📖 [خارطة الطريق](./docs/ROADMAP.md)
- 📖 [المساهمون](./docs/CONTRIBUTORS.md)
- 📖 [أفضل الممارسات](./docs/BEST_PRACTICES.md)
- 📖 [Frontend Documentation](./frontend/README.md)
- 📖 [Backend Documentation](./backend/README.md)
- 📖 [Admin Dashboard Documentation](./admin-dashboard/README.md)

---

## �️ التقنيات المستخدمة

### Frontend & Admin
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- Lucide React (Icons)
- Recharts (Charts)

### Backend
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- Helmet (Security)
- CORS
- Express Rate Limit

---

## 📡 API Endpoints

```http
# News
GET    /api/news
GET    /api/news/:id
POST   /api/news          (Protected)
PUT    /api/news/:id      (Protected)
DELETE /api/news/:id      (Protected)

# Contact
POST   /api/contact
GET    /api/contact       (Protected)
PATCH  /api/contact/:id   (Protected)
DELETE /api/contact/:id   (Protected)

# Auth
POST   /api/auth/login
GET    /api/auth/me       (Protected)

# Stats
GET    /api/stats         (Protected)
```

---

## � الأمان

- ✅ كلمات مرور مشفرة (bcrypt)
- ✅ JWT للمصادقة
- ✅ CORS محدد
- ✅ Rate limiting
- ✅ Helmet security headers
- ✅ Input validation

---

## 📦 البناء للإنتاج

```powershell
# بناء Frontend
npm run build:frontend

# بناء Admin Dashboard
npm run build:admin

# تشغيل Backend في الإنتاج
cd backend
npm start
```

---

## 🤝 المساهمة

هذا مشروع خاص. للمساهمة، يرجى التواصل مع فريق التطوير.

---

## 📝 الترخيص

© 2025 د. حسين خضير - جميع الحقوق محفوظة

---

## 📞 الدعم

للمساعدة أو الاستفسارات:
- 📧 Email: support@example.com
- 📱 Phone: +20 123 456 7890

---

<div align="center">

**مع تمنياتنا بالتوفيق! 🎉**

Made with ❤️ in Egypt

</div>
