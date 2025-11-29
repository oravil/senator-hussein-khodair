# الأسئلة الشائعة (FAQ)

## 📋 عام

### ما هو هذا المشروع؟
موقع ويب متكامل للسيناتور د. حسين خضير يتضمن واجهة أمامية للزوار، لوحة تحكم للإدارة، و API backend.

### ما هي التقنيات المستخدمة؟
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Admin**: React + Vite + Tailwind CSS

### هل المشروع مفتوح المصدر؟
نعم، المشروع متاح تحت ترخيص MIT.

---

## 🔧 التثبيت والإعداد

### لماذا لا يعمل `npm install`؟
تأكد من:
- تثبيت Node.js >= 18
- الاتصال بالإنترنت
- حذف `node_modules` و `package-lock.json` ثم إعادة المحاولة

### كيف أنشئ مستخدم admin؟
```bash
cd backend
npm run create-admin
```

### ما هو JWT_SECRET ولماذا مهم؟
هو مفتاح سري لتشفير tokens. يجب أن يكون:
- عشوائي تماماً
- 32 حرف على الأقل
- مختلف في كل بيئة (development, production)

---

## 🐛 المشاكل الشائعة

### Backend لا يعمل

#### المشكلة: `MongooseError: Connection failed`
**الحل:**
```bash
# 1. تأكد من تشغيل MongoDB
sudo systemctl start mongod  # Linux
# أو
mongod  # Windows

# 2. تحقق من MONGODB_URI في .env
MONGODB_URI=mongodb://localhost:27017/senator-db
```

#### المشكلة: `Error: JWT_SECRET is not defined`
**الحل:**
```bash
# أضف JWT_SECRET في backend/.env
JWT_SECRET=your-secret-key-min-32-characters-random
```

#### المشكلة: `Port 5000 is already in use`
**الحل:**
```bash
# غير PORT في backend/.env
PORT=5001

# أو أوقف العملية على Port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux
lsof -ti:5000 | xargs kill -9
```

### Frontend/Admin لا يعمل

#### المشكلة: `Network Error` عند الاتصال بـ API
**الحل:**
1. تأكد من تشغيل Backend
2. تحقق من `VITE_API_URL` في `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. تأكد من عدم وجود مشاكل CORS

#### المشكلة: `Failed to compile` في Vite
**الحل:**
```bash
# 1. احذف node_modules
rm -rf node_modules

# 2. احذف cache
rm -rf .vite

# 3. أعد التثبيت
npm install
```

### Database

#### المشكلة: لا أستطيع الاتصال بـ MongoDB Atlas
**الحل:**
1. تأكد من إضافة IP Address في Whitelist
2. تحقق من صحة username و password
3. تأكد من تشفير special characters في connection string:
   ```
   # إذا كان password: p@ss
   # استخدم: p%40ss
   ```

#### المشكلة: كيف أحذف جميع البيانات؟
**الحل:**
```bash
# في MongoDB shell
use senator-db
db.dropDatabase()

# أو من Terminal
mongosh senator-db --eval "db.dropDatabase()"
```

---

## 🔐 الأمان

### هل آمن تخزين JWT في localStorage؟
للمشاريع الصغيرة والمتوسطة، نعم. لكن للمشاريع الحساسة، استخدم:
- httpOnly cookies
- sessionStorage (أقل أماناً من cookies)

### كيف أغير كلمة مرور admin؟
```bash
# استخدم createAdmin script مرة أخرى
cd backend
node scripts/createAdmin.js
```

### كيف أحمي API من الهجمات؟
المشروع يستخدم:
- ✅ Helmet (security headers)
- ✅ Rate limiting
- ✅ CORS
- ✅ Input validation
- ✅ bcrypt للكلمات

---

## 📱 التطوير

### كيف أضيف صفحة جديدة؟

**1. Frontend:**
```jsx
// في src/pages/NewPage.jsx
export default function NewPage() {
  return <div>New Page</div>;
}

// في App.jsx
import NewPage from './pages/NewPage';

<Route path="/new-page" element={<NewPage />} />
```

**2. Backend:**
```javascript
// في routes/new.routes.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'New route' });
});

module.exports = router;

// في server.js
const newRoutes = require('./routes/new.routes');
app.use('/api/new', newRoutes);
```

### كيف أضيف API endpoint جديد؟

```javascript
// 1. في models/Model.js
const mongoose = require('mongoose');
const schema = new mongoose.Schema({ /* ... */ });
module.exports = mongoose.model('Model', schema);

// 2. في controllers/controller.js
exports.getData = async (req, res) => {
  try {
    const data = await Model.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. في routes/routes.js
router.get('/', controller.getData);

// 4. في server.js
app.use('/api/model', routes);
```

### كيف أغير التصميم؟

المشروع يستخدم **Tailwind CSS**:
```jsx
// مثال
<div className="bg-blue-500 text-white p-4 rounded-lg">
  محتوى
</div>
```

للألوان الخاصة، عدّل `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
      }
    }
  }
}
```

---

## 🚀 Production

### كيف أجهز المشروع للإنتاج؟

**1. Frontend & Admin:**
```bash
npm run build
# ستنشأ مجلد dist/
```

**2. Backend:**
```bash
# غير NODE_ENV في .env
NODE_ENV=production

# شغّل
npm start
```

**3. Environment Variables:**
- غير جميع الـ secrets
- استخدم MongoDB Atlas بدلاً من local
- حدّث FRONTEND_URL و ADMIN_URL

### أين أستضيف المشروع؟

**مجاني:**
- Frontend/Admin: Vercel, Netlify
- Backend: Heroku (free tier), Railway
- Database: MongoDB Atlas (free tier)

**مدفوع:**
- VPS: DigitalOcean, Linode, AWS EC2
- PaaS: Heroku, Railway, Render

راجع [DEPLOYMENT.md](./DEPLOYMENT.md) للتفاصيل.

---

## 📊 Performance

### الموقع بطيء، كيف أحسّن الأداء؟

**Frontend:**
- استخدم React.lazy() للـ code splitting
- Optimize images (WebP, compression)
- استخدم CDN

**Backend:**
- أضف Database indexes
- استخدم caching (Redis)
- Enable gzip compression

**Database:**
```javascript
// أضف indexes
schema.index({ field: 1 });

// استخدم select لتحديد الحقول فقط
Model.find().select('title content');

// استخدم pagination
Model.find().limit(10).skip(page * 10);
```

---

## 🧪 Testing

### كيف أختبر المشروع؟

**Manual Testing:**
- اختبر جميع الصفحات
- اختبر CRUD operations
- اختبر authentication
- اختبر على متصفحات مختلفة

**Automated Testing:**
```bash
# يمكنك إضافة Jest و React Testing Library
npm install --save-dev jest @testing-library/react
```

---

## 💡 نصائح

### Best Practices

1. **Git Commits:**
   - استخدم conventional commits
   - اكتب رسائل واضحة
   - اعمل commit بانتظام

2. **Code:**
   - اتبع naming conventions
   - اكتب تعليقات للكود المعقد
   - استخدم ESLint و Prettier

3. **Security:**
   - لا تضع secrets في Git
   - استخدم environment variables
   - حدّث المكتبات بانتظام

---

## ❓ أسئلة أخرى؟

- افتح [Issue](https://github.com/oravil/senator-hussein-khodair/issues) على GitHub
- راجع [الوثائق](./README.md)
- اقرأ [دليل التثبيت](./INSTALLATION_GUIDE.md)

---

**تم آخر تحديث:** نوفمبر 2025
