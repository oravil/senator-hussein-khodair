# 🚀 دليل البدء السريع (5 دقائق)

## ✅ المتطلبات الأساسية

تأكد من تثبيت:
- [x] **Node.js** >= 18.0.0
- [x] **MongoDB** >= 6.0.0
- [x] **Git** (اختياري)

---

## 📥 خطوة 1: تثبيت MongoDB

### Windows
```powershell
# تحميل من الموقع الرسمي
https://www.mongodb.com/try/download/community

# بعد التثبيت، شغل MongoDB
mongod
```

---

## 📦 خطوة 2: تثبيت المشروع

```powershell
# افتح PowerShell في مجلد المشروع
cd e:\projects\oravil

# تثبيت جميع المكتبات دفعة واحدة
npm run install:all
```

⏱️ **سيستغرق حوالي 2-3 دقائق**

---

## ⚙️ خطوة 3: الإعداد

```powershell
# نسخ ملفات البيئة
cd backend
copy .env.example .env

cd ..\frontend
copy .env.example .env

cd ..\admin-dashboard
copy .env.example .env

cd ..

# إنشاء مستخدم المدير
cd backend
node scripts/createAdmin.js
```

✅ **ستحصل على معلومات تسجيل الدخول:**
- Username: `admin`
- Password: `admin123`

---

## 🎮 خطوة 4: التشغيل

افتح **3 نوافذ PowerShell** منفصلة:

### نافذة 1 - Backend
```powershell
cd e:\projects\oravil\backend
npm run dev
```
✅ يعمل على: http://localhost:5000

### نافذة 2 - Frontend
```powershell
cd e:\projects\oravil\frontend
npm run dev
```
✅ يعمل على: http://localhost:3000

### نافذة 3 - Admin Dashboard
```powershell
cd e:\projects\oravil\admin-dashboard
npm run dev
```
✅ يعمل على: http://localhost:3001

---

## 🎉 الآن جاهز!

### 🌐 الموقع الأمامي
افتح المتصفح: **http://localhost:3000**

### 👨‍💼 لوحة التحكم
افتح المتصفح: **http://localhost:3001**

**تسجيل الدخول:**
- Username: `admin`
- Password: `admin123`

---

## 📝 الخطوات التالية

1. ✅ غير كلمة مرور المدير من لوحة التحكم
2. ✅ أضف أول خبر
3. ✅ جرب إرسال رسالة من الموقع
4. ✅ راجع الإحصائيات في لوحة التحكم

---

## ❓ مشاكل شائعة

### MongoDB لا يعمل؟
```powershell
# تحقق من تشغيل MongoDB
mongod --version

# إذا لم يعمل، أعد تشغيله
mongod
```

### Port مشغول؟
```powershell
# غير Port في ملف .env:
# backend/.env
PORT=5001

# frontend/vite.config.js
# admin-dashboard/vite.config.js
```

### خطأ في التثبيت؟
```powershell
# امسح node_modules وأعد التثبيت
rm -r node_modules
npm install
```

---

## 📚 مزيد من المعلومات

- 📖 [README.md](./README.md) - نظرة شاملة
- 📖 [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md) - دليل مفصل
- 📖 [CHANGELOG.md](./CHANGELOG.md) - سجل التغييرات

---

## 💡 نصيحة

احفظ نوافذ PowerShell الثلاثة مفتوحة أثناء التطوير!

---

<div align="center">

**استمتع بالعمل! 🎊**

حققت بنجاح في 5 دقائق! ⚡

</div>
