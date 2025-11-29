# 📋 خطة تطوير موقع د. حسين خضير

<div align="center">

## رئيس شركة نابكو للأدوية | عضو مجلس الشيوخ | وكيل لجنة الصحة

**موقع شخصي احترافي لتلقي شكاوى وطلبات المواطنين**

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Phase](https://img.shields.io/badge/Current%20Phase-Planning-blue)

</div>

---

## 📌 معلومات المشروع

### عن صاحب الموقع
| المنصب | التفاصيل |
|--------|----------|
| 🏢 **منصب تجاري** | رئيس شركة نابكو للأدوية |
| 🏛️ **منصب برلماني** | عضو مجلس الشيوخ المصري |
| 🏥 **منصب سابق** | الرئيس السابق للجنة الصحة بمجلس الشيوخ |
| 👨‍⚕️ **منصب حالي** | وكيل لجنة الصحة الحالي |

### أهداف المشروع
1. ✅ تلقي شكاوى المواطنين بشكل سريع واحترافي
2. ✅ متابعة حالة الشكاوى مع إشعارات متعددة القنوات
3. ✅ عرض الفعاليات والأخبار الخاصة بالنائب
4. ✅ تقديم مقترحات من المواطنين
5. ✅ نظام تقييم وتعليقات تفاعلي
6. ✅ تصميم حديث وجذاب مع حركات وتفاعلات

---

## 🎯 المتطلبات الوظيفية الكاملة

### 1. نظام الشكاوى والطلبات
```
┌─────────────────────────────────────────────────────────────┐
│                    رحلة الشكوى                              │
├─────────────────────────────────────────────────────────────┤
│  تقديم  →  استلام  →  مراجعة  →  معالجة  →  رد  →  تقييم   │
│    ↓         ↓          ↓          ↓        ↓        ↓      │
│ إشعار    إشعار      إشعار      إشعار    إشعار    شكر      │
└─────────────────────────────────────────────────────────────┘
```

**الميزات:**
- تقديم شكوى بنموذج سهل وسريع (Multi-step)
- رقم تتبع فريد لكل شكوى
- متابعة حالة الشكوى بالرقم
- إرفاق ملفات ومستندات
- تصنيف الشكاوى (صحة، تعليم، خدمات، إلخ)
- أولوية الشكاوى (عاجل، عادي)
- الرد على الشكوى والتواصل
- تقييم الخدمة بعد الحل

### 2. نظام الإشعارات المتعدد
```
┌──────────────────────────────────────────┐
│           قنوات الإشعارات                │
├──────────────────────────────────────────┤
│  📱 WhatsApp    │  رسائل فورية          │
│  📧 Email       │  تفاصيل كاملة         │
│  💬 SMS         │  رسائل قصيرة          │
│  🔔 Push        │  إشعارات الموقع       │
└──────────────────────────────────────────┘
```

**أنواع الإشعارات:**
- إشعار باستلام الشكوى + رقم التتبع + رابط المتابعة
- إشعار بتحديث حالة الشكوى
- إشعار بالرد على الشكوى
- إشعار بإغلاق الشكوى
- تذكير بتقييم الخدمة

### 3. نظام المقترحات
- نموذج تقديم مقترح
- تصويت على المقترحات
- عرض أفضل المقترحات
- حالة المقترح (قيد الدراسة، مقبول، مرفوض)

### 4. نظام التقييم والتعليقات
- تقييم 5 نجوم للخدمات
- تعليقات على المنشورات
- إعجاب ومشاركة
- إحصائيات رضا المواطنين

### 5. إدارة المحتوى
- تعديل النبذة الشخصية
- إدارة الفعاليات والمؤتمرات
- إدارة الأخبار والبيانات
- معرض الصور والفيديوهات
- جدول المواعيد والزيارات

### 6. التصميم التفاعلي
- حركات سلسة عند تحرك الصفحات
- تأثيرات عند الضغط على الأزرار
- إخفاء وظهور المحتوى بشكل متحرك
- Loading states جذابة
- Scroll animations

---

## 🛠️ التقنيات المستخدمة

### Frontend (الواجهة الأمامية)
| التقنية | الغرض |
|---------|-------|
| **Next.js 14** | Framework - SSR + SEO |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | التصميم السريع |
| **Framer Motion** | الحركات والتفاعلات |
| **Shadcn/ui** | مكونات UI احترافية |
| **React Hook Form** | إدارة النماذج |
| **Zod** | Validation |
| **TanStack Query** | إدارة البيانات |
| **Zustand** | State Management |
| **Lucide React** | الأيقونات |
| **Recharts** | الرسوم البيانية |

### Backend (الخادم)
| التقنية | الغرض |
|---------|-------|
| **Node.js 20 LTS** | Runtime |
| **Express.js** | Framework |
| **PostgreSQL** | قاعدة البيانات |
| **Prisma** | ORM |
| **Redis** | Cache & Sessions |
| **BullMQ** | Background Jobs |
| **JWT** | المصادقة |
| **Multer** | رفع الملفات |

### خدمات الإشعارات
| الخدمة | المزود |
|--------|--------|
| **WhatsApp** | Twilio / Meta Business API |
| **SMS** | Twilio / Vonage |
| **Email** | SendGrid / Resend |
| **Push** | Firebase Cloud Messaging |

### DevOps والاستضافة
| الخدمة | المزود |
|--------|--------|
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Railway / Render |
| **Database** | Supabase / Neon |
| **File Storage** | AWS S3 / Cloudinary |
| **CDN** | Cloudflare |
| **Monitoring** | Sentry |
| **CI/CD** | GitHub Actions |

---

## 📐 هيكل المشروع الجديد

```
senator-khodair/
│
├── 📁 apps/
│   │
│   ├── 📁 web/                          # الموقع الرئيسي (Next.js)
│   │   ├── 📁 app/
│   │   │   ├── 📁 (public)/             # صفحات عامة
│   │   │   │   ├── page.tsx             # الرئيسية
│   │   │   │   ├── 📁 about/            # النبذة
│   │   │   │   ├── 📁 news/             # الأخبار
│   │   │   │   ├── 📁 events/           # الفعاليات
│   │   │   │   ├── 📁 gallery/          # معرض الصور
│   │   │   │   └── 📁 contact/          # التواصل
│   │   │   │
│   │   │   ├── 📁 complaints/           # نظام الشكاوى
│   │   │   │   ├── 📁 new/              # تقديم شكوى جديدة
│   │   │   │   ├── 📁 track/            # متابعة شكوى
│   │   │   │   └── 📁 [id]/             # تفاصيل شكوى
│   │   │   │
│   │   │   ├── 📁 suggestions/          # المقترحات
│   │   │   │   ├── 📁 new/              # تقديم مقترح
│   │   │   │   └── 📁 browse/           # استعراض المقترحات
│   │   │   │
│   │   │   └── 📁 api/                  # API Routes
│   │   │
│   │   ├── 📁 components/
│   │   │   ├── 📁 ui/                   # مكونات أساسية
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Timeline.tsx
│   │   │   │   ├── FileUpload.tsx
│   │   │   │   ├── RatingStars.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── 📁 forms/                # نماذج
│   │   │   │   ├── ComplaintForm.tsx
│   │   │   │   ├── SuggestionForm.tsx
│   │   │   │   ├── ContactForm.tsx
│   │   │   │   └── TrackingForm.tsx
│   │   │   │
│   │   │   ├── 📁 layout/               # التخطيط
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Navigation.tsx
│   │   │   │
│   │   │   ├── 📁 sections/             # أقسام الصفحات
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── QuickComplaint.tsx
│   │   │   │   ├── StatsCounter.tsx
│   │   │   │   ├── LatestNews.tsx
│   │   │   │   ├── UpcomingEvents.tsx
│   │   │   │   └── Testimonials.tsx
│   │   │   │
│   │   │   └── 📁 animations/           # مكونات متحركة
│   │   │       ├── PageTransition.tsx
│   │   │       ├── ScrollReveal.tsx
│   │   │       ├── CounterAnimation.tsx
│   │   │       └── LoadingSpinner.tsx
│   │   │
│   │   ├── 📁 lib/                      # مكتبات وأدوات
│   │   ├── 📁 hooks/                    # Custom Hooks
│   │   ├── 📁 services/                 # API Services
│   │   ├── 📁 stores/                   # State Management
│   │   └── 📁 types/                    # TypeScript Types
│   │
│   └── 📁 admin/                        # لوحة التحكم (Next.js)
│       ├── 📁 app/
│       │   ├── 📁 dashboard/            # الرئيسية
│       │   ├── 📁 complaints/           # إدارة الشكاوى
│       │   ├── 📁 suggestions/          # إدارة المقترحات
│       │   ├── 📁 content/              # إدارة المحتوى
│       │   │   ├── 📁 news/
│       │   │   ├── 📁 events/
│       │   │   ├── 📁 gallery/
│       │   │   └── 📁 about/
│       │   ├── 📁 users/                # إدارة المستخدمين
│       │   ├── 📁 reports/              # التقارير
│       │   └── 📁 settings/             # الإعدادات
│       └── ...
│
├── 📁 packages/
│   │
│   ├── 📁 database/                     # Prisma Schema
│   │   ├── 📁 prisma/
│   │   │   ├── schema.prisma
│   │   │   └── 📁 migrations/
│   │   └── package.json
│   │
│   ├── 📁 api/                          # Backend API
│   │   ├── 📁 src/
│   │   │   ├── 📁 modules/
│   │   │   │   ├── 📁 auth/
│   │   │   │   ├── 📁 complaints/
│   │   │   │   ├── 📁 suggestions/
│   │   │   │   ├── 📁 content/
│   │   │   │   ├── 📁 notifications/
│   │   │   │   └── 📁 users/
│   │   │   │
│   │   │   ├── 📁 services/
│   │   │   │   ├── whatsapp.service.ts
│   │   │   │   ├── email.service.ts
│   │   │   │   ├── sms.service.ts
│   │   │   │   └── push.service.ts
│   │   │   │
│   │   │   ├── 📁 jobs/                 # Background Jobs
│   │   │   │   ├── notification.job.ts
│   │   │   │   └── cleanup.job.ts
│   │   │   │
│   │   │   └── 📁 utils/
│   │   └── package.json
│   │
│   ├── 📁 shared/                       # كود مشترك
│   │   ├── 📁 types/
│   │   ├── 📁 utils/
│   │   └── 📁 constants/
│   │
│   └── 📁 ui/                           # مكونات UI مشتركة
│
├── 📁 development/                      # ملفات التطوير
│   ├── PROJECT_PLAN.md                  # هذا الملف
│   ├── PHASE_1.md
│   ├── PHASE_2.md
│   └── ...
│
├── 📁 docs/                             # التوثيق
├── 📄 docker-compose.yml
├── 📄 turbo.json                        # Turborepo config
└── 📄 package.json
```

---

## 🗃️ Database Schema

```prisma
// schema.prisma

// ==================== المستخدمين ====================
model User {
  id            String    @id @default(cuid())
  name          String
  email         String?   @unique
  phone         String    @unique
  nationalId    String?   @unique
  role          Role      @default(CITIZEN)
  avatar        String?
  
  // العلاقات
  complaints    Complaint[]
  suggestions   Suggestion[]
  ratings       Rating[]
  comments      Comment[]
  votes         Vote[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  CITIZEN       // مواطن
  ADMIN         // مدير
  MODERATOR     // مشرف
  SUPER_ADMIN   // مدير عام
}

// ==================== الشكاوى ====================
model Complaint {
  id              String    @id @default(cuid())
  trackingNumber  String    @unique  // رقم التتبع الفريد
  
  // مقدم الشكوى
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  
  // تفاصيل الشكوى
  title           String
  description     String    @db.Text
  category        ComplaintCategory
  priority        Priority  @default(NORMAL)
  
  // الموقع
  governorate     String
  city            String?
  address         String?
  
  // الحالة
  status          ComplaintStatus @default(PENDING)
  
  // العلاقات
  attachments     Attachment[]
  statusHistory   StatusHistory[]
  responses       Response[]
  rating          Rating?
  
  // التواريخ
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  resolvedAt      DateTime?
}

enum ComplaintCategory {
  HEALTH          // صحة
  EDUCATION       // تعليم
  INFRASTRUCTURE  // بنية تحتية
  UTILITIES       // مرافق
  SOCIAL          // شؤون اجتماعية
  EMPLOYMENT      // توظيف
  HOUSING         // إسكان
  OTHER           // أخرى
}

enum Priority {
  URGENT          // عاجل
  HIGH            // عالي
  NORMAL          // عادي
  LOW             // منخفض
}

enum ComplaintStatus {
  PENDING         // قيد الانتظار
  RECEIVED        // تم الاستلام
  UNDER_REVIEW    // قيد المراجعة
  IN_PROGRESS     // جاري العمل عليها
  AWAITING_INFO   // في انتظار معلومات
  RESOLVED        // تم الحل
  CLOSED          // مغلقة
  REJECTED        // مرفوضة
}

// تاريخ حالات الشكوى
model StatusHistory {
  id            String    @id @default(cuid())
  complaintId   String
  complaint     Complaint @relation(fields: [complaintId], references: [id])
  fromStatus    ComplaintStatus
  toStatus      ComplaintStatus
  note          String?
  changedBy     String
  createdAt     DateTime  @default(now())
}

// الردود على الشكاوى
model Response {
  id            String    @id @default(cuid())
  complaintId   String
  complaint     Complaint @relation(fields: [complaintId], references: [id])
  message       String    @db.Text
  isOfficial    Boolean   @default(false)
  responderId   String
  attachments   Attachment[]
  createdAt     DateTime  @default(now())
}

// ==================== المقترحات ====================
model Suggestion {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  title         String
  description   String    @db.Text
  category      String
  status        SuggestionStatus @default(PENDING)
  
  // العلاقات
  votes         Vote[]
  voteCount     Int       @default(0)
  comments      Comment[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum SuggestionStatus {
  PENDING         // قيد الانتظار
  UNDER_REVIEW    // قيد الدراسة
  ACCEPTED        // مقبول
  IMPLEMENTED     // تم التنفيذ
  REJECTED        // مرفوض
}

// التصويت على المقترحات
model Vote {
  id            String    @id @default(cuid())
  suggestionId  String
  suggestion    Suggestion @relation(fields: [suggestionId], references: [id])
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  type          VoteType
  createdAt     DateTime  @default(now())
  
  @@unique([suggestionId, userId])
}

enum VoteType {
  UP
  DOWN
}

// ==================== التقييمات ====================
model Rating {
  id            String    @id @default(cuid())
  complaintId   String    @unique
  complaint     Complaint @relation(fields: [complaintId], references: [id])
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  score         Int       // 1-5
  feedback      String?
  createdAt     DateTime  @default(now())
}

// ==================== الإشعارات ====================
model Notification {
  id            String    @id @default(cuid())
  userId        String
  type          NotificationType
  title         String
  message       String
  data          Json?
  channels      NotificationChannel[]
  status        NotificationStatus @default(PENDING)
  sentAt        DateTime?
  readAt        DateTime?
  createdAt     DateTime  @default(now())
}

enum NotificationType {
  COMPLAINT_RECEIVED
  COMPLAINT_UPDATED
  COMPLAINT_RESOLVED
  RESPONSE_ADDED
  RATING_REQUEST
  SUGGESTION_VOTED
  GENERAL
}

enum NotificationChannel {
  EMAIL
  SMS
  WHATSAPP
  PUSH
}

enum NotificationStatus {
  PENDING
  SENT
  FAILED
  READ
}

// ==================== المحتوى ====================
model News {
  id            String    @id @default(cuid())
  title         String
  slug          String    @unique
  excerpt       String
  content       String    @db.Text
  image         String?
  category      String
  tags          String[]
  published     Boolean   @default(false)
  publishedAt   DateTime?
  views         Int       @default(0)
  comments      Comment[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Event {
  id            String    @id @default(cuid())
  title         String
  description   String    @db.Text
  location      String
  date          DateTime
  endDate       DateTime?
  image         String?
  isPublished   Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model GalleryItem {
  id            String    @id @default(cuid())
  title         String?
  description   String?
  url           String
  type          MediaType @default(IMAGE)
  category      String?
  isPublished   Boolean   @default(true)
  createdAt     DateTime  @default(now())
}

enum MediaType {
  IMAGE
  VIDEO
}

// التعليقات
model Comment {
  id            String    @id @default(cuid())
  content       String
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  
  // يمكن أن يكون على خبر أو مقترح
  newsId        String?
  news          News?     @relation(fields: [newsId], references: [id])
  suggestionId  String?
  suggestion    Suggestion? @relation(fields: [suggestionId], references: [id])
  
  // الردود المتداخلة
  parentId      String?
  parent        Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies       Comment[] @relation("CommentReplies")
  
  likes         Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// المرفقات
model Attachment {
  id            String    @id @default(cuid())
  filename      String
  originalName  String
  url           String
  type          String
  size          Int
  
  complaintId   String?
  complaint     Complaint? @relation(fields: [complaintId], references: [id])
  responseId    String?
  response      Response? @relation(fields: [responseId], references: [id])
  
  createdAt     DateTime  @default(now())
}

// محتوى النبذة
model AboutContent {
  id            String    @id @default(cuid())
  section       String    @unique
  title         String
  content       String    @db.Text
  image         String?
  order         Int       @default(0)
  updatedAt     DateTime  @updatedAt
}

// إعدادات الموقع
model SiteSettings {
  id            String    @id @default(cuid())
  key           String    @unique
  value         Json
  updatedAt     DateTime  @updatedAt
}
```

---

**تم إنشاء الملف**: نوفمبر 2025
