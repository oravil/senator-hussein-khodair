# Deployment Guide

دليل شامل لنشر المشروع على بيئات مختلفة.

## 📋 جدول المحتويات

- [المتطلبات](#المتطلبات)
- [بيئة الإنتاج](#بيئة-الإنتاج)
- [Heroku](#deploy-to-heroku)
- [Vercel](#deploy-to-vercel)
- [DigitalOcean](#deploy-to-digitalocean)
- [VPS Server](#deploy-to-vps)

---

## المتطلبات

قبل البدء، تأكد من:

- [x] حساب على منصة الاستضافة
- [x] MongoDB Atlas (أو قاعدة بيانات خارجية)
- [x] Git مثبت على جهازك
- [x] Node.js >= 18

---

## بيئة الإنتاج

### 1. إعداد MongoDB Atlas

```bash
# 1. سجل في MongoDB Atlas: https://www.mongodb.com/cloud/atlas
# 2. أنشئ Cluster جديد
# 3. أنشئ Database User
# 4. احصل على Connection String
# مثال: mongodb+srv://username:password@cluster.mongodb.net/senator-db
```

### 2. Environment Variables

تأكد من إعداد المتغيرات التالية:

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secure-random-secret-key-min-32-chars
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
ADMIN_URL=https://your-admin-domain.com
```

**Frontend (.env)**
```env
VITE_API_URL=https://your-backend-api.com/api
```

**Admin Dashboard (.env)**
```env
VITE_API_URL=https://your-backend-api.com/api
```

---

## Deploy to Heroku

### Backend

```bash
# 1. تسجيل الدخول إلى Heroku
heroku login

# 2. إنشاء تطبيق جديد
cd backend
heroku create senator-backend

# 3. إضافة MongoDB
heroku addons:create mongolab

# 4. تعيين المتغيرات
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
heroku config:set ADMIN_URL=https://your-admin.vercel.app

# 5. Deploy
git push heroku main

# 6. إنشاء admin user
heroku run npm run create-admin
```

### Frontend & Admin (Vercel/Netlify)

```bash
# استخدم Vercel أو Netlify لـ Frontend و Admin Dashboard
# سيتم الشرح في القسم التالي
```

---

## Deploy to Vercel

### Frontend

```bash
# 1. تثبيت Vercel CLI
npm i -g vercel

# 2. الدخول إلى مجلد Frontend
cd frontend

# 3. Deploy
vercel

# 4. في الإعدادات على موقع Vercel:
# - Root Directory: frontend
# - Build Command: npm run build
# - Output Directory: dist
# - Environment Variables: VITE_API_URL=https://your-backend.herokuapp.com/api
```

### Admin Dashboard

```bash
# نفس الخطوات
cd admin-dashboard
vercel

# Environment Variable:
# VITE_API_URL=https://your-backend.herokuapp.com/api
```

---

## Deploy to DigitalOcean

### App Platform

1. **أنشئ App جديد**
   - اذهب إلى DigitalOcean App Platform
   - اختر GitHub repository

2. **Backend Component**
   ```yaml
   name: backend
   type: service
   source_dir: backend
   build_command: npm install
   run_command: npm start
   envs:
     - key: NODE_ENV
       value: production
     - key: MONGODB_URI
       value: ${db.DATABASE_URL}
     - key: JWT_SECRET
       value: your-secret-key
   ```

3. **Frontend Component**
   ```yaml
   name: frontend
   type: static-site
   source_dir: frontend
   build_command: npm run build
   output_dir: dist
   ```

4. **Database**
   - أضف MongoDB Managed Database
   - أو استخدم MongoDB Atlas

---

## Deploy to VPS

### Prerequisites

```bash
# Server مع Ubuntu 20.04+
# Node.js, nginx, MongoDB
```

### 1. تثبيت المتطلبات

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# تثبيت nginx
sudo apt install -y nginx

# تثبيت PM2
sudo npm install -g pm2
```

### 2. رفع المشروع

```bash
# Clone المشروع
cd /var/www
sudo git clone https://github.com/oravil/senator-hussein-khodair.git
cd senator-hussein-khodair

# تثبيت المكتبات
cd backend && npm install
cd ../frontend && npm install && npm run build
cd ../admin-dashboard && npm install && npm run build
```

### 3. إعداد Backend مع PM2

```bash
cd /var/www/senator-hussein-khodair/backend

# إنشاء .env
sudo nano .env
# (أضف المتغيرات)

# تشغيل مع PM2
pm2 start server.js --name senator-backend
pm2 save
pm2 startup
```

### 4. إعداد Nginx

```bash
# Frontend
sudo nano /etc/nginx/sites-available/senator-frontend

# أضف:
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/senator-hussein-khodair/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# فعّل الموقع
sudo ln -s /etc/nginx/sites-available/senator-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL مع Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Post-Deployment Checklist

- [ ] تم اختبار جميع الـ endpoints
- [ ] تم التحقق من الاتصال بقاعدة البيانات
- [ ] تم إنشاء مستخدم admin
- [ ] SSL Certificate مثبت
- [ ] Environment variables صحيحة
- [ ] CORS settings صحيحة
- [ ] تم اختبار Frontend و Admin Dashboard
- [ ] تم إعداد Backup لقاعدة البيانات
- [ ] تم إعداد Monitoring (اختياري)
- [ ] تم تفعيل Firewall

---

## Troubleshooting

### مشكلة: لا يعمل Backend

```bash
# تحقق من logs
pm2 logs senator-backend

# تحقق من MongoDB
sudo systemctl status mongod

# تحقق من environment variables
pm2 env 0
```

### مشكلة: Frontend لا يتصل بـ API

```bash
# تحقق من VITE_API_URL في .env
# تحقق من CORS في backend
# تحقق من console في المتصفح
```

### مشكلة: 502 Bad Gateway

```bash
# تحقق من nginx logs
sudo tail -f /var/log/nginx/error.log

# تحقق من Backend
pm2 status
```

---

## Performance Tips

1. **Enable Gzip** في nginx
2. **استخدم CDN** للملفات الثابتة
3. **Database Indexing** للحقول المستخدمة كثيراً
4. **Caching** للبيانات الثابتة
5. **Image Optimization** قبل الرفع

---

## Monitoring (اختياري)

```bash
# PM2 Plus
pm2 plus

# أو استخدم:
# - New Relic
# - Datadog
# - Prometheus + Grafana
```

---

## Backup Strategy

### MongoDB Backup

```bash
# Manual backup
mongodump --uri="mongodb://localhost:27017/senator-db" --out=/backup/$(date +%Y%m%d)

# Automated backup (cron)
0 2 * * * mongodump --uri="mongodb://localhost:27017/senator-db" --out=/backup/$(date +\%Y\%m\%d)
```

---

## Support

للمساعدة في Deploy:
- افتح Issue على GitHub
- أو تواصل مع الدعم الفني

---

**Good Luck! 🚀**
