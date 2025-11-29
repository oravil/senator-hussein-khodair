# 🔷 المرحلة الأولى: الأساسيات والبنية التحتية

<div align="center">

**الأسبوع 1-2**

![Status](https://img.shields.io/badge/Status-Not%20Started-lightgrey)
![Duration](https://img.shields.io/badge/Duration-2%20Weeks-blue)
![Priority](https://img.shields.io/badge/Priority-Critical-red)

</div>

---

## 🎯 أهداف المرحلة

1. ✅ إعداد بيئة التطوير
2. ✅ إعداد Monorepo مع Turborepo
3. ✅ إعداد قاعدة البيانات (PostgreSQL + Prisma)
4. ✅ تصميم Database Schema
5. ✅ إعداد نظام المصادقة
6. ✅ إعداد CI/CD Pipeline

---

## 📋 المهام التفصيلية

### الأسبوع الأول

#### 1.1 إعداد Monorepo
```bash
# إنشاء المشروع مع Turborepo
npx create-turbo@latest senator-khodair

# الهيكل المطلوب
senator-khodair/
├── apps/
│   ├── web/           # Next.js - الموقع الرئيسي
│   └── admin/         # Next.js - لوحة التحكم
├── packages/
│   ├── database/      # Prisma
│   ├── api/           # Express Backend
│   ├── ui/            # Shared UI Components
│   └── shared/        # Shared utilities
├── turbo.json
└── package.json
```

- [ ] إنشاء Turborepo جديد
- [ ] إعداد TypeScript configuration
- [ ] إعداد ESLint & Prettier
- [ ] إعداد Husky للـ pre-commit hooks

#### 1.2 إعداد قاعدة البيانات
- [ ] إنشاء PostgreSQL database (Supabase/Neon)
- [ ] إعداد Prisma في `packages/database`
- [ ] إنشاء Schema الكامل
- [ ] تنفيذ أول Migration
- [ ] إنشاء Seed data

#### 1.3 إعداد Backend API
```
packages/api/
├── src/
│   ├── index.ts
│   ├── app.ts
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimiter.ts
│   └── modules/
│       └── auth/
│           ├── auth.controller.ts
│           ├── auth.service.ts
│           ├── auth.routes.ts
│           └── auth.validation.ts
└── package.json
```

- [ ] إعداد Express.js مع TypeScript
- [ ] إعداد Middleware أساسي
- [ ] إعداد Error Handling
- [ ] إعداد Logger (Winston)

### الأسبوع الثاني

#### 1.4 نظام المصادقة
- [ ] تسجيل مستخدم جديد (برقم الهاتف)
- [ ] تسجيل الدخول
- [ ] التحقق برمز OTP
- [ ] JWT Token management
- [ ] Refresh Token mechanism
- [ ] حماية الـ Routes

**Auth Endpoints:**
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-otp
POST /api/auth/refresh-token
POST /api/auth/logout
GET  /api/auth/me
```

#### 1.5 إعداد Frontend Apps
```
apps/web/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
├── lib/
├── next.config.js
├── tailwind.config.js
└── package.json
```

- [ ] إعداد Next.js 14 مع App Router
- [ ] إعداد Tailwind CSS
- [ ] إعداد Shadcn/ui
- [ ] إعداد Framer Motion
- [ ] إعداد Arabic/RTL support

#### 1.6 إعداد CI/CD
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
```

- [ ] إعداد GitHub Actions
- [ ] إعداد Vercel للـ Frontend
- [ ] إعداد Railway/Render للـ Backend
- [ ] إعداد Environment Variables

---

## 📦 المخرجات المتوقعة

بنهاية المرحلة الأولى:

```
✅ Monorepo يعمل بشكل كامل
✅ قاعدة بيانات PostgreSQL جاهزة
✅ Schema كامل مع Relations
✅ Backend API أساسي
✅ نظام مصادقة يعمل
✅ CI/CD Pipeline
✅ Frontend Apps جاهزة للتطوير
```

---

## 🔧 الأوامر الأساسية

```bash
# تشغيل كل شيء
npm run dev

# تشغيل app محدد
npm run dev --filter=web
npm run dev --filter=admin
npm run dev --filter=api

# قاعدة البيانات
npm run db:migrate
npm run db:seed
npm run db:studio

# Build
npm run build

# Tests
npm run test
npm run lint
```

---

## 📝 ملاحظات

### Dependencies المطلوبة

**Backend:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "@prisma/client": "^5.x",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "zod": "^3.22.0",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.0.0",
    "winston": "^3.11.0",
    "ioredis": "^5.3.0"
  }
}
```

**Frontend:**
```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "@tanstack/react-query": "^5.x",
    "zustand": "^4.x",
    "framer-motion": "^10.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "@hookform/resolvers": "^3.x",
    "axios": "^1.x"
  }
}
```

---

## ✅ Checklist

### الأسبوع 1
- [ ] Turborepo initialized
- [ ] TypeScript configured
- [ ] ESLint + Prettier configured
- [ ] PostgreSQL database created
- [ ] Prisma schema created
- [ ] First migration done
- [ ] Express API setup

### الأسبوع 2
- [ ] Auth system complete
- [ ] JWT + Refresh tokens
- [ ] Next.js apps setup
- [ ] Tailwind + Shadcn setup
- [ ] RTL support
- [ ] CI/CD pipeline
- [ ] Deployment ready

---

## 🔗 الموارد

- [Turborepo Docs](https://turbo.build/repo/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

**المرحلة التالية**: [المرحلة الثانية - الواجهة الأمامية](./PHASE_2.md)
