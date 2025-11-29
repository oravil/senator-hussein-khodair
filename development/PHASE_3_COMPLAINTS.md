# 🔷 المرحلة الثالثة: نظام الشكاوى والطلبات

<div align="center">

**الأسبوع 5-6**

![Status](https://img.shields.io/badge/Status-Not%20Started-lightgrey)
![Duration](https://img.shields.io/badge/Duration-2%20Weeks-blue)
![Priority](https://img.shields.io/badge/Priority-Critical-red)

</div>

---

## 🎯 أهداف المرحلة

1. ✅ نموذج تقديم شكوى كامل (Multi-step)
2. ✅ نظام التتبع برقم فريد
3. ✅ صفحة تفاصيل الشكوى
4. ✅ نظام الردود والتواصل
5. ✅ رفع المرفقات
6. ✅ نظام التقييم

---

## 📋 المهام التفصيلية

### الأسبوع الخامس

#### 3.1 Backend - Complaints Module

**هيكل الـ Module:**
```
packages/api/src/modules/complaints/
├── complaints.controller.ts
├── complaints.service.ts
├── complaints.routes.ts
├── complaints.validation.ts
├── complaints.types.ts
└── complaints.utils.ts
```

**API Endpoints:**
```http
# الشكاوى
POST   /api/complaints              # تقديم شكوى جديدة
GET    /api/complaints              # قائمة الشكاوى (Admin)
GET    /api/complaints/:id          # تفاصيل شكوى
GET    /api/complaints/track/:number # تتبع شكوى بالرقم
PATCH  /api/complaints/:id/status   # تحديث حالة الشكوى (Admin)

# الردود
POST   /api/complaints/:id/responses  # إضافة رد
GET    /api/complaints/:id/responses  # جلب الردود

# المرفقات
POST   /api/complaints/:id/attachments  # رفع مرفق
DELETE /api/attachments/:id             # حذف مرفق

# التقييم
POST   /api/complaints/:id/rating     # إضافة تقييم
```

**Service Implementation:**
```typescript
// complaints.service.ts
import { prisma } from '@senator/database';
import { nanoid } from 'nanoid';
import { ComplaintStatus, Priority } from '@prisma/client';

export class ComplaintsService {
  // توليد رقم تتبع فريد
  private generateTrackingNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = nanoid(6).toUpperCase();
    return `SHK-${year}${month}-${random}`;
  }

  // تقديم شكوى جديدة
  async createComplaint(data: CreateComplaintDto, userId: string) {
    const trackingNumber = this.generateTrackingNumber();
    
    const complaint = await prisma.complaint.create({
      data: {
        trackingNumber,
        userId,
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority || Priority.NORMAL,
        governorate: data.governorate,
        city: data.city,
        address: data.address,
        status: ComplaintStatus.PENDING,
      },
      include: {
        user: {
          select: { name: true, phone: true, email: true }
        }
      }
    });

    // إنشاء أول سجل في تاريخ الحالات
    await prisma.statusHistory.create({
      data: {
        complaintId: complaint.id,
        fromStatus: ComplaintStatus.PENDING,
        toStatus: ComplaintStatus.PENDING,
        note: 'تم تقديم الشكوى',
        changedBy: 'SYSTEM',
      }
    });

    // إرسال إشعار (سيتم في المرحلة الرابعة)
    // await this.notificationService.sendComplaintReceived(complaint);

    return complaint;
  }

  // تتبع شكوى بالرقم
  async trackComplaint(trackingNumber: string) {
    const complaint = await prisma.complaint.findUnique({
      where: { trackingNumber },
      include: {
        statusHistory: {
          orderBy: { createdAt: 'desc' }
        },
        responses: {
          orderBy: { createdAt: 'desc' },
          include: {
            attachments: true
          }
        },
        attachments: true,
        rating: true,
      }
    });

    if (!complaint) {
      throw new NotFoundError('الشكوى غير موجودة');
    }

    return complaint;
  }

  // تحديث حالة الشكوى
  async updateStatus(
    complaintId: string, 
    newStatus: ComplaintStatus, 
    note: string,
    adminId: string
  ) {
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId }
    });

    if (!complaint) {
      throw new NotFoundError('الشكوى غير موجودة');
    }

    const oldStatus = complaint.status;

    // تحديث الشكوى
    const updatedComplaint = await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        status: newStatus,
        resolvedAt: newStatus === ComplaintStatus.RESOLVED ? new Date() : null,
      }
    });

    // إضافة سجل في التاريخ
    await prisma.statusHistory.create({
      data: {
        complaintId,
        fromStatus: oldStatus,
        toStatus: newStatus,
        note,
        changedBy: adminId,
      }
    });

    // إرسال إشعار بالتحديث
    // await this.notificationService.sendStatusUpdate(updatedComplaint);

    return updatedComplaint;
  }

  // إضافة رد
  async addResponse(
    complaintId: string,
    message: string,
    isOfficial: boolean,
    responderId: string
  ) {
    const response = await prisma.response.create({
      data: {
        complaintId,
        message,
        isOfficial,
        responderId,
      },
      include: {
        attachments: true
      }
    });

    // إرسال إشعار بالرد
    // await this.notificationService.sendNewResponse(response);

    return response;
  }

  // إضافة تقييم
  async addRating(
    complaintId: string,
    userId: string,
    score: number,
    feedback?: string
  ) {
    // التحقق من أن الشكوى محلولة
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId }
    });

    if (!complaint || complaint.status !== ComplaintStatus.RESOLVED) {
      throw new BadRequestError('لا يمكن تقييم شكوى غير محلولة');
    }

    // التحقق من عدم وجود تقييم سابق
    const existingRating = await prisma.rating.findUnique({
      where: { complaintId }
    });

    if (existingRating) {
      throw new BadRequestError('تم تقييم هذه الشكوى مسبقاً');
    }

    const rating = await prisma.rating.create({
      data: {
        complaintId,
        userId,
        score,
        feedback,
      }
    });

    return rating;
  }
}
```

#### 3.2 Frontend - نموذج تقديم الشكوى

**Multi-step Form Component:**
```tsx
// app/complaints/new/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// خطوات النموذج
const steps = [
  { id: 'personal', title: 'البيانات الشخصية', icon: User },
  { id: 'complaint', title: 'تفاصيل الشكوى', icon: FileText },
  { id: 'location', title: 'الموقع', icon: MapPin },
  { id: 'attachments', title: 'المرفقات', icon: Paperclip },
  { id: 'review', title: 'المراجعة', icon: CheckCircle },
];

// Validation Schema
const complaintSchema = z.object({
  // البيانات الشخصية
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, 'رقم هاتف غير صحيح'),
  email: z.string().email('بريد إلكتروني غير صحيح').optional().or(z.literal('')),
  nationalId: z.string().length(14, 'الرقم القومي يجب أن يكون 14 رقم').optional(),
  
  // تفاصيل الشكوى
  category: z.enum(['HEALTH', 'EDUCATION', 'INFRASTRUCTURE', 'UTILITIES', 'SOCIAL', 'EMPLOYMENT', 'HOUSING', 'OTHER']),
  title: z.string().min(10, 'العنوان يجب أن يكون 10 أحرف على الأقل'),
  description: z.string().min(50, 'الوصف يجب أن يكون 50 حرف على الأقل'),
  priority: z.enum(['URGENT', 'HIGH', 'NORMAL', 'LOW']).default('NORMAL'),
  
  // الموقع
  governorate: z.string().min(1, 'اختر المحافظة'),
  city: z.string().optional(),
  address: z.string().optional(),
});

type ComplaintFormData = z.infer<typeof complaintSchema>;

export default function NewComplaintPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    trackingNumber?: string;
  } | null>(null);

  const form = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    mode: 'onChange',
  });

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: ComplaintFormData) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      
      files.forEach((file) => {
        formData.append('attachments', file);
      });

      const response = await fetch('/api/complaints', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      setSubmitResult({
        success: true,
        trackingNumber: result.trackingNumber,
      });
    } catch (error) {
      setSubmitResult({ success: false });
    } finally {
      setIsSubmitting(false);
    }
  };

  // إذا تم الإرسال بنجاح
  if (submitResult?.success) {
    return <SuccessScreen trackingNumber={submitResult.trackingNumber!} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress Steps */}
        <StepsProgress steps={steps} currentStep={currentStep} />

        {/* Form */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 mt-8"
          layout
        >
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && <PersonalInfoStep form={form} />}
                {currentStep === 1 && <ComplaintDetailsStep form={form} />}
                {currentStep === 2 && <LocationStep form={form} />}
                {currentStep === 3 && <AttachmentsStep files={files} setFiles={setFiles} />}
                {currentStep === 4 && <ReviewStep form={form} files={files} />}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                السابق
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={nextStep}>
                  التالي
                </Button>
              ) : (
                <Button type="submit" isLoading={isSubmitting}>
                  إرسال الشكوى
                </Button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

// Step Components
function PersonalInfoStep({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">البيانات الشخصية</h2>
      <p className="text-gray-600">أدخل بياناتك الشخصية للتواصل معك</p>

      <div className="grid md:grid-cols-2 gap-6">
        <Input
          label="الاسم الكامل"
          placeholder="أدخل اسمك الكامل"
          error={form.formState.errors.name?.message}
          {...form.register('name')}
        />
        
        <Input
          label="رقم الهاتف"
          placeholder="01xxxxxxxxx"
          error={form.formState.errors.phone?.message}
          {...form.register('phone')}
        />
        
        <Input
          label="البريد الإلكتروني (اختياري)"
          type="email"
          placeholder="example@email.com"
          error={form.formState.errors.email?.message}
          {...form.register('email')}
        />
        
        <Input
          label="الرقم القومي (اختياري)"
          placeholder="xxxxxxxxxxxxxx"
          maxLength={14}
          error={form.formState.errors.nationalId?.message}
          {...form.register('nationalId')}
        />
      </div>
    </div>
  );
}

function ComplaintDetailsStep({ form }: { form: any }) {
  const categories = [
    { value: 'HEALTH', label: 'صحة', icon: Heart },
    { value: 'EDUCATION', label: 'تعليم', icon: GraduationCap },
    { value: 'INFRASTRUCTURE', label: 'بنية تحتية', icon: Building },
    { value: 'UTILITIES', label: 'مرافق', icon: Lightbulb },
    { value: 'SOCIAL', label: 'شؤون اجتماعية', icon: Users },
    { value: 'EMPLOYMENT', label: 'توظيف', icon: Briefcase },
    { value: 'HOUSING', label: 'إسكان', icon: Home },
    { value: 'OTHER', label: 'أخرى', icon: MoreHorizontal },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">تفاصيل الشكوى</h2>
      <p className="text-gray-600">اشرح مشكلتك بالتفصيل</p>

      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          تصنيف الشكوى
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <label
              key={cat.value}
              className={cn(
                'flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all',
                form.watch('category') === cat.value
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <input
                type="radio"
                value={cat.value}
                {...form.register('category')}
                className="sr-only"
              />
              <cat.icon className={cn(
                'w-8 h-8 mb-2',
                form.watch('category') === cat.value ? 'text-primary' : 'text-gray-400'
              )} />
              <span className="text-sm font-medium">{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Priority */}
      <Select
        label="الأولوية"
        options={[
          { value: 'URGENT', label: '🔴 عاجل جداً' },
          { value: 'HIGH', label: '🟠 عالي' },
          { value: 'NORMAL', label: '🟢 عادي' },
          { value: 'LOW', label: '⚪ منخفض' },
        ]}
        {...form.register('priority')}
      />

      {/* Title */}
      <Input
        label="عنوان الشكوى"
        placeholder="اكتب عنوان موجز للشكوى"
        error={form.formState.errors.title?.message}
        {...form.register('title')}
      />

      {/* Description */}
      <Textarea
        label="تفاصيل الشكوى"
        placeholder="اشرح مشكلتك بالتفصيل..."
        rows={6}
        error={form.formState.errors.description?.message}
        {...form.register('description')}
      />
    </div>
  );
}

// ... المزيد من Step Components
```

### الأسبوع السادس

#### 3.3 صفحة متابعة الشكوى

```tsx
// app/complaints/track/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText } from 'lucide-react';

export default function TrackComplaintPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/complaints/track/${trackingNumber}`);
      if (!response.ok) throw new Error('الشكوى غير موجودة');
      
      const data = await response.json();
      setComplaint(data);
    } catch (err) {
      setError('لم يتم العثور على شكوى بهذا الرقم');
      setComplaint(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            متابعة شكوى
          </h1>
          <p className="text-gray-600 mb-8">
            أدخل رقم التتبع الخاص بشكواك لمعرفة حالتها
          </p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                placeholder="SHK-XXXX-XXXXXX"
                className="w-full px-6 py-4 pr-12 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !trackingNumber}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-lg hover:bg-primary-dark disabled:opacity-50"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            {error && (
              <p className="text-red-500 mt-3">{error}</p>
            )}
          </form>
        </motion.div>

        {/* Complaint Details */}
        {complaint && (
          <ComplaintDetails complaint={complaint} />
        )}
      </div>
    </div>
  );
}

function ComplaintDetails({ complaint }: { complaint: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 space-y-6"
    >
      {/* Status Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">رقم التتبع</p>
            <p className="text-xl font-bold text-primary">{complaint.trackingNumber}</p>
          </div>
          <StatusBadge status={complaint.status} />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {complaint.title}
        </h2>
        <p className="text-gray-600">{complaint.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div>
            <p className="text-sm text-gray-500">التصنيف</p>
            <p className="font-medium">{getCategoryLabel(complaint.category)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">الأولوية</p>
            <PriorityBadge priority={complaint.priority} />
          </div>
          <div>
            <p className="text-sm text-gray-500">تاريخ التقديم</p>
            <p className="font-medium">{formatDate(complaint.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">المحافظة</p>
            <p className="font-medium">{complaint.governorate}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          تاريخ الشكوى
        </h3>
        <ComplaintTimeline history={complaint.statusHistory} />
      </div>

      {/* Responses */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          الردود والتحديثات
        </h3>
        <ResponsesList responses={complaint.responses} />
        
        {/* Add Response Form (if complaint is not closed) */}
        {!['CLOSED', 'REJECTED'].includes(complaint.status) && (
          <AddResponseForm complaintId={complaint.id} />
        )}
      </div>

      {/* Rating (if resolved and not rated) */}
      {complaint.status === 'RESOLVED' && !complaint.rating && (
        <RatingForm complaintId={complaint.id} />
      )}
    </motion.div>
  );
}

function ComplaintTimeline({ history }: { history: any[] }) {
  const statusConfig = {
    PENDING: { color: 'bg-gray-400', label: 'قيد الانتظار' },
    RECEIVED: { color: 'bg-blue-500', label: 'تم الاستلام' },
    UNDER_REVIEW: { color: 'bg-yellow-500', label: 'قيد المراجعة' },
    IN_PROGRESS: { color: 'bg-orange-500', label: 'جاري العمل' },
    AWAITING_INFO: { color: 'bg-purple-500', label: 'في انتظار معلومات' },
    RESOLVED: { color: 'bg-green-500', label: 'تم الحل' },
    CLOSED: { color: 'bg-gray-600', label: 'مغلقة' },
    REJECTED: { color: 'bg-red-500', label: 'مرفوضة' },
  };

  return (
    <div className="relative">
      {history.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex gap-4 pb-6 last:pb-0"
        >
          {/* Timeline Line */}
          <div className="relative flex flex-col items-center">
            <div className={cn(
              'w-4 h-4 rounded-full',
              statusConfig[item.toStatus].color
            )} />
            {index !== history.length - 1 && (
              <div className="w-0.5 h-full bg-gray-200 absolute top-4" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-900">
                {statusConfig[item.toStatus].label}
              </p>
              <time className="text-sm text-gray-500">
                {formatDate(item.createdAt)}
              </time>
            </div>
            {item.note && (
              <p className="text-gray-600 mt-1">{item.note}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
```

#### 3.4 نظام التقييم

```tsx
// components/RatingForm.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export function RatingForm({ complaintId }: { complaintId: string }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      await fetch(`/api/complaints/${complaintId}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: rating, feedback }),
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">شكراً لتقييمك!</h3>
        <p className="text-gray-600 mt-2">
          تقييمك يساعدنا في تحسين خدماتنا
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        قيّم تجربتك
      </h3>
      <p className="text-gray-600 mb-6">
        كيف كانت تجربتك مع خدمتنا؟ رأيك يهمنا!
      </p>

      {/* Stars */}
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star
              className={cn(
                'w-10 h-10 transition-colors',
                (hoveredRating || rating) >= star
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              )}
            />
          </motion.button>
        ))}
      </div>

      {/* Rating Label */}
      {rating > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-lg font-medium mb-6"
        >
          {getRatingLabel(rating)}
        </motion.p>
      )}

      {/* Feedback */}
      <Textarea
        placeholder="شاركنا رأيك وملاحظاتك (اختياري)"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        rows={3}
      />

      <Button
        onClick={handleSubmit}
        disabled={rating === 0 || isSubmitting}
        isLoading={isSubmitting}
        className="w-full mt-4"
      >
        إرسال التقييم
      </Button>
    </motion.div>
  );
}

function getRatingLabel(rating: number): string {
  const labels = {
    1: '😞 سيء جداً',
    2: '😕 سيء',
    3: '😐 مقبول',
    4: '😊 جيد',
    5: '😍 ممتاز',
  };
  return labels[rating] || '';
}
```

---

## 📦 المخرجات المتوقعة

بنهاية المرحلة الثالثة:

```
✅ نموذج تقديم شكوى كامل (5 خطوات)
✅ نظام رقم التتبع الفريد
✅ صفحة متابعة الشكوى
✅ Timeline لحالات الشكوى
✅ نظام الردود والتواصل
✅ رفع المرفقات
✅ نظام التقييم (5 نجوم)
✅ Backend API كامل للشكاوى
```

---

## ✅ Checklist

### الأسبوع 5
- [ ] Complaints API complete
- [ ] Multi-step form
- [ ] Form validation
- [ ] File upload
- [ ] Tracking number generation

### الأسبوع 6
- [ ] Track complaint page
- [ ] Complaint details view
- [ ] Timeline component
- [ ] Responses system
- [ ] Rating system
- [ ] Success screens

---

**المرحلة السابقة**: [المرحلة الثانية - الواجهة الأمامية](./PHASE_2_FRONTEND.md)

**المرحلة التالية**: [المرحلة الرابعة - نظام الإشعارات](./PHASE_4_NOTIFICATIONS.md)
