# Frontend - موقع د. حسين خضير

الواجهة الأمامية للموقع باستخدام React + Vite + Tailwind CSS

## 🚀 التثبيت والتشغيل

```bash
# تثبيت المكتبات
npm install

# تشغيل الخادم المحلي
npm run dev

# بناء المشروع للإنتاج
npm run build
```

## 📁 هيكل المشروع

```
src/
├── components/         # المكونات القابلة لإعادة الاستخدام
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Layout.jsx
│   ├── AchievementCard.jsx
│   └── NewsCard.jsx
├── pages/              # الصفحات الرئيسية
│   ├── HomePage.jsx
│   ├── AboutPage.jsx
│   ├── NewsPage.jsx
│   ├── NewsDetailPage.jsx
│   └── ContactPage.jsx
├── services/           # خدمات API
│   └── api.js
├── App.jsx
└── main.jsx
```

## 🔧 التكوين

انسخ ملف `.env.example` إلى `.env` وقم بتعديل المتغيرات:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📦 المكتبات المستخدمة

- React 18
- React Router DOM
- Axios
- Lucide React (الأيقونات)
- Tailwind CSS
