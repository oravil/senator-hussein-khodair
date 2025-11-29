# 📱 المرحلة الرابعة: نظام الإشعارات المتكامل

<div align="center">

**الأسبوع 7-8**

![Status](https://img.shields.io/badge/Status-Not%20Started-lightgrey)
![Duration](https://img.shields.io/badge/Duration-2%20Weeks-blue)
![Priority](https://img.shields.io/badge/Priority-High-orange)

</div>

---

## 🎯 أهداف المرحلة

1. ✅ إشعارات WhatsApp (Twilio/API)
2. ✅ إشعارات SMS
3. ✅ إشعارات البريد الإلكتروني
4. ✅ إشعارات Push (FCM)
5. ✅ نظام قوائم الانتظار (BullMQ)
6. ✅ تفضيلات الإشعارات للمستخدم

---

## 📋 المهام التفصيلية

### الأسبوع السابع

#### 4.1 البنية التحتية للإشعارات

**هيكل Module:**
```
packages/api/src/modules/notifications/
├── notifications.controller.ts
├── notifications.service.ts
├── notifications.routes.ts
├── notifications.types.ts
├── providers/
│   ├── whatsapp.provider.ts
│   ├── sms.provider.ts
│   ├── email.provider.ts
│   └── push.provider.ts
├── templates/
│   ├── whatsapp/
│   │   ├── complaint-received.ts
│   │   ├── status-update.ts
│   │   └── new-response.ts
│   ├── email/
│   │   ├── complaint-received.html
│   │   ├── status-update.html
│   │   └── new-response.html
│   └── sms/
│       └── templates.ts
└── queues/
    ├── notification.queue.ts
    └── notification.worker.ts
```

**نظام Queue مع BullMQ:**
```typescript
// queues/notification.queue.ts
import { Queue, Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';

const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

// تعريف Queue
export const notificationQueue = new Queue('notifications', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  },
});

// أنواع الإشعارات
export type NotificationType = 
  | 'COMPLAINT_RECEIVED'
  | 'STATUS_UPDATE'
  | 'NEW_RESPONSE'
  | 'COMPLAINT_RESOLVED'
  | 'REMINDER';

export interface NotificationJob {
  type: NotificationType;
  userId: string;
  complaintId?: string;
  data: Record<string, any>;
  channels: ('whatsapp' | 'sms' | 'email' | 'push')[];
}

// إضافة إشعار للـ Queue
export async function queueNotification(notification: NotificationJob) {
  return notificationQueue.add(
    notification.type,
    notification,
    {
      priority: getPriority(notification.type),
    }
  );
}

function getPriority(type: NotificationType): number {
  const priorities = {
    COMPLAINT_RECEIVED: 1,
    STATUS_UPDATE: 2,
    NEW_RESPONSE: 3,
    COMPLAINT_RESOLVED: 2,
    REMINDER: 4,
  };
  return priorities[type] || 3;
}
```

**Worker لمعالجة الإشعارات:**
```typescript
// queues/notification.worker.ts
import { Worker, Job } from 'bullmq';
import { WhatsAppProvider } from '../providers/whatsapp.provider';
import { SMSProvider } from '../providers/sms.provider';
import { EmailProvider } from '../providers/email.provider';
import { PushProvider } from '../providers/push.provider';
import { prisma } from '@senator/database';
import { NotificationJob } from './notification.queue';

const whatsapp = new WhatsAppProvider();
const sms = new SMSProvider();
const email = new EmailProvider();
const push = new PushProvider();

export const notificationWorker = new Worker(
  'notifications',
  async (job: Job<NotificationJob>) => {
    const { type, userId, data, channels } = job.data;

    // جلب بيانات المستخدم وتفضيلاته
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { notificationPreferences: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const results = [];

    // إرسال عبر كل قناة مفعلة
    for (const channel of channels) {
      // التحقق من تفضيلات المستخدم
      if (!user.notificationPreferences?.[channel]) {
        continue;
      }

      try {
        switch (channel) {
          case 'whatsapp':
            if (user.phone) {
              const result = await whatsapp.send(user.phone, type, data);
              results.push({ channel, success: true, messageId: result.messageId });
            }
            break;

          case 'sms':
            if (user.phone) {
              const result = await sms.send(user.phone, type, data);
              results.push({ channel, success: true, messageId: result.messageId });
            }
            break;

          case 'email':
            if (user.email) {
              const result = await email.send(user.email, type, data);
              results.push({ channel, success: true, messageId: result.messageId });
            }
            break;

          case 'push':
            if (user.fcmToken) {
              const result = await push.send(user.fcmToken, type, data);
              results.push({ channel, success: true, messageId: result.messageId });
            }
            break;
        }
      } catch (error) {
        results.push({ channel, success: false, error: error.message });
      }
    }

    // تسجيل الإشعار في قاعدة البيانات
    await prisma.notification.create({
      data: {
        userId,
        type,
        data,
        channels,
        results,
        sentAt: new Date(),
      }
    });

    return results;
  },
  {
    connection: new Redis(process.env.REDIS_URL!),
    concurrency: 10,
  }
);

// التعامل مع الأخطاء
notificationWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

notificationWorker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});
```

#### 4.2 WhatsApp Provider

```typescript
// providers/whatsapp.provider.ts
import twilio from 'twilio';
import { NotificationType } from '../queues/notification.queue';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const WHATSAPP_FROM = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;

export class WhatsAppProvider {
  async send(phone: string, type: NotificationType, data: any) {
    const message = this.getTemplate(type, data);
    const to = `whatsapp:+2${phone}`; // مصر

    const result = await client.messages.create({
      from: WHATSAPP_FROM,
      to,
      body: message,
    });

    return { messageId: result.sid, status: result.status };
  }

  private getTemplate(type: NotificationType, data: any): string {
    const templates = {
      COMPLAINT_RECEIVED: `
🎫 *تم استلام شكواك*

مرحباً ${data.userName}،

تم استلام شكواك بنجاح وجاري مراجعتها.

📋 *رقم التتبع:* ${data.trackingNumber}
📝 *العنوان:* ${data.title}
📅 *التاريخ:* ${data.date}

يمكنك متابعة شكواك من خلال:
${data.trackingUrl}

مكتب النائب د. حسين خضير
`,
      STATUS_UPDATE: `
🔄 *تحديث حالة الشكوى*

مرحباً ${data.userName}،

تم تحديث حالة شكواك:

📋 *رقم التتبع:* ${data.trackingNumber}
📌 *الحالة الجديدة:* ${data.newStatus}
${data.note ? `📝 *ملاحظة:* ${data.note}` : ''}

تابع التفاصيل:
${data.trackingUrl}
`,
      NEW_RESPONSE: `
💬 *رد جديد على شكواك*

مرحباً ${data.userName}،

تم إضافة رد جديد على شكواك رقم ${data.trackingNumber}.

📩 *الرد:*
${data.responsePreview}

اقرأ الرد كاملاً:
${data.trackingUrl}
`,
      COMPLAINT_RESOLVED: `
✅ *تم حل شكواك*

مرحباً ${data.userName}،

نسعد بإبلاغك أنه تم حل شكواك بنجاح!

📋 *رقم التتبع:* ${data.trackingNumber}
📝 *العنوان:* ${data.title}

⭐ نرجو تقييم خدمتنا:
${data.ratingUrl}

شكراً لثقتكم في مكتب النائب د. حسين خضير
`,
    };

    return templates[type] || '';
  }

  // إرسال رسالة Template معتمدة من WhatsApp Business
  async sendTemplate(phone: string, templateName: string, variables: string[]) {
    const result = await client.messages.create({
      from: WHATSAPP_FROM,
      to: `whatsapp:+2${phone}`,
      contentSid: process.env[`WHATSAPP_TEMPLATE_${templateName.toUpperCase()}`],
      contentVariables: JSON.stringify(
        variables.reduce((acc, v, i) => ({ ...acc, [i + 1]: v }), {})
      ),
    });

    return { messageId: result.sid, status: result.status };
  }
}
```

#### 4.3 Email Provider

```typescript
// providers/email.provider.ts
import { Resend } from 'resend';
import { NotificationType } from '../queues/notification.queue';

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailProvider {
  private FROM_EMAIL = 'noreply@senator-khodair.com';
  private FROM_NAME = 'مكتب النائب د. حسين خضير';

  async send(email: string, type: NotificationType, data: any) {
    const { subject, html } = this.getTemplate(type, data);

    const result = await resend.emails.send({
      from: `${this.FROM_NAME} <${this.FROM_EMAIL}>`,
      to: email,
      subject,
      html,
    });

    return { messageId: result.id };
  }

  private getTemplate(type: NotificationType, data: any) {
    const templates = {
      COMPLAINT_RECEIVED: {
        subject: `تم استلام شكواك - رقم التتبع: ${data.trackingNumber}`,
        html: this.complaintReceivedTemplate(data),
      },
      STATUS_UPDATE: {
        subject: `تحديث حالة الشكوى ${data.trackingNumber}`,
        html: this.statusUpdateTemplate(data),
      },
      NEW_RESPONSE: {
        subject: `رد جديد على شكواك ${data.trackingNumber}`,
        html: this.newResponseTemplate(data),
      },
      COMPLAINT_RESOLVED: {
        subject: `تم حل شكواك ${data.trackingNumber} ✅`,
        html: this.complaintResolvedTemplate(data),
      },
    };

    return templates[type];
  }

  private complaintReceivedTemplate(data: any): string {
    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Arial, sans-serif;
      line-height: 1.8;
      color: #333;
      margin: 0;
      padding: 0;
      background: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #1a5f2a 0%, #2d8f4a 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px;
    }
    .tracking-box {
      background: #f0f9f4;
      border: 2px dashed #1a5f2a;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }
    .tracking-number {
      font-size: 24px;
      font-weight: bold;
      color: #1a5f2a;
      font-family: monospace;
    }
    .btn {
      display: inline-block;
      background: #1a5f2a;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      background: #f5f5f5;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎫 تم استلام شكواك</h1>
    </div>
    <div class="content">
      <p>مرحباً <strong>${data.userName}</strong>،</p>
      <p>تم استلام شكواك بنجاح وجاري مراجعتها من قبل الفريق المختص.</p>
      
      <div class="tracking-box">
        <p style="margin: 0 0 10px;">رقم التتبع الخاص بك:</p>
        <div class="tracking-number">${data.trackingNumber}</div>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>العنوان:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.title}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>التصنيف:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.category}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>التاريخ:</strong></td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.date}</td>
        </tr>
      </table>

      <div style="text-align: center;">
        <a href="${data.trackingUrl}" class="btn">متابعة الشكوى</a>
      </div>
    </div>
    <div class="footer">
      <p>مكتب النائب د. حسين خضير - مجلس الشيوخ المصري</p>
      <p>هذا البريد آلي، يرجى عدم الرد عليه</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  // ... باقي Templates
}
```

### الأسبوع الثامن

#### 4.4 SMS Provider

```typescript
// providers/sms.provider.ts
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export class SMSProvider {
  async send(phone: string, type: NotificationType, data: any) {
    const message = this.getTemplate(type, data);
    const to = `+2${phone}`; // مصر

    const result = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
      body: message,
    });

    return { messageId: result.sid, status: result.status };
  }

  private getTemplate(type: NotificationType, data: any): string {
    // رسائل SMS قصيرة
    const templates = {
      COMPLAINT_RECEIVED: `تم استلام شكواك رقم ${data.trackingNumber}. تابعها: ${data.shortUrl}`,
      STATUS_UPDATE: `شكواك ${data.trackingNumber}: ${data.newStatus}. ${data.shortUrl}`,
      NEW_RESPONSE: `رد جديد على شكواك ${data.trackingNumber}. ${data.shortUrl}`,
      COMPLAINT_RESOLVED: `تم حل شكواك ${data.trackingNumber}! قيّمنا: ${data.shortUrl}`,
    };

    return templates[type] || '';
  }
}
```

#### 4.5 Push Notifications (Firebase)

```typescript
// providers/push.provider.ts
import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export class PushProvider {
  async send(token: string, type: NotificationType, data: any) {
    const { title, body } = this.getTemplate(type, data);

    const message = {
      token,
      notification: { title, body },
      data: {
        type,
        complaintId: data.complaintId || '',
        trackingNumber: data.trackingNumber || '',
        clickAction: data.trackingUrl || '',
      },
      android: {
        priority: 'high' as const,
        notification: {
          icon: 'ic_notification',
          color: '#1a5f2a',
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const result = await admin.messaging().send(message);
    return { messageId: result };
  }

  // إرسال لمجموعة من المستخدمين
  async sendToMultiple(tokens: string[], type: NotificationType, data: any) {
    const { title, body } = this.getTemplate(type, data);

    const message = {
      tokens,
      notification: { title, body },
      data: {
        type,
        complaintId: data.complaintId || '',
      },
    };

    const result = await admin.messaging().sendMulticast(message);
    return {
      successCount: result.successCount,
      failureCount: result.failureCount,
    };
  }

  private getTemplate(type: NotificationType, data: any) {
    const templates = {
      COMPLAINT_RECEIVED: {
        title: '🎫 تم استلام شكواك',
        body: `رقم التتبع: ${data.trackingNumber}`,
      },
      STATUS_UPDATE: {
        title: '🔄 تحديث حالة الشكوى',
        body: `الحالة الجديدة: ${data.newStatus}`,
      },
      NEW_RESPONSE: {
        title: '💬 رد جديد',
        body: `رد جديد على شكواك ${data.trackingNumber}`,
      },
      COMPLAINT_RESOLVED: {
        title: '✅ تم حل شكواك!',
        body: 'شكواك تم حلها بنجاح. قيّم تجربتك',
      },
    };

    return templates[type];
  }
}
```

#### 4.6 Notification Service Integration

```typescript
// notifications.service.ts
import { queueNotification } from './queues/notification.queue';
import { prisma } from '@senator/database';

export class NotificationsService {
  // إرسال إشعار استلام شكوى
  async sendComplaintReceived(complaint: any) {
    await queueNotification({
      type: 'COMPLAINT_RECEIVED',
      userId: complaint.userId,
      complaintId: complaint.id,
      data: {
        userName: complaint.user.name,
        trackingNumber: complaint.trackingNumber,
        title: complaint.title,
        category: complaint.category,
        date: new Date().toLocaleDateString('ar-EG'),
        trackingUrl: `${process.env.FRONTEND_URL}/complaints/track?number=${complaint.trackingNumber}`,
        shortUrl: await this.shortenUrl(`${process.env.FRONTEND_URL}/t/${complaint.trackingNumber}`),
      },
      channels: ['whatsapp', 'sms', 'email', 'push'],
    });
  }

  // إرسال إشعار تحديث الحالة
  async sendStatusUpdate(complaint: any, newStatus: string, note?: string) {
    const statusLabels = {
      RECEIVED: 'تم الاستلام',
      UNDER_REVIEW: 'قيد المراجعة',
      IN_PROGRESS: 'جاري العمل',
      AWAITING_INFO: 'في انتظار معلومات',
      RESOLVED: 'تم الحل',
      CLOSED: 'مغلقة',
      REJECTED: 'مرفوضة',
    };

    await queueNotification({
      type: 'STATUS_UPDATE',
      userId: complaint.userId,
      complaintId: complaint.id,
      data: {
        userName: complaint.user.name,
        trackingNumber: complaint.trackingNumber,
        newStatus: statusLabels[newStatus],
        note,
        trackingUrl: `${process.env.FRONTEND_URL}/complaints/track?number=${complaint.trackingNumber}`,
        shortUrl: await this.shortenUrl(`${process.env.FRONTEND_URL}/t/${complaint.trackingNumber}`),
      },
      channels: ['whatsapp', 'sms', 'email', 'push'],
    });
  }

  // إرسال إشعار رد جديد
  async sendNewResponse(response: any) {
    const complaint = await prisma.complaint.findUnique({
      where: { id: response.complaintId },
      include: { user: true },
    });

    await queueNotification({
      type: 'NEW_RESPONSE',
      userId: complaint!.userId,
      complaintId: complaint!.id,
      data: {
        userName: complaint!.user.name,
        trackingNumber: complaint!.trackingNumber,
        responsePreview: response.message.slice(0, 100) + '...',
        trackingUrl: `${process.env.FRONTEND_URL}/complaints/track?number=${complaint!.trackingNumber}`,
        shortUrl: await this.shortenUrl(`${process.env.FRONTEND_URL}/t/${complaint!.trackingNumber}`),
      },
      channels: ['whatsapp', 'email', 'push'],
    });
  }

  // اختصار الروابط
  private async shortenUrl(url: string): Promise<string> {
    // يمكن استخدام خدمة مثل bit.ly أو إنشاء نظام خاص
    return url;
  }
}
```

#### 4.7 صفحة تفضيلات الإشعارات

```tsx
// app/settings/notifications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, MessageCircle, Mail, Smartphone, Check } from 'lucide-react';

interface NotificationPreferences {
  whatsapp: boolean;
  sms: boolean;
  email: boolean;
  push: boolean;
  complaintUpdates: boolean;
  newResponses: boolean;
  news: boolean;
  marketing: boolean;
}

export default function NotificationSettingsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    whatsapp: true,
    sms: true,
    email: true,
    push: true,
    complaintUpdates: true,
    newResponses: true,
    news: true,
    marketing: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const channels = [
    {
      id: 'whatsapp',
      label: 'واتساب',
      description: 'إشعارات عبر رسائل WhatsApp',
      icon: MessageCircle,
    },
    {
      id: 'sms',
      label: 'رسائل SMS',
      description: 'إشعارات عبر الرسائل النصية',
      icon: Smartphone,
    },
    {
      id: 'email',
      label: 'البريد الإلكتروني',
      description: 'إشعارات عبر البريد الإلكتروني',
      icon: Mail,
    },
    {
      id: 'push',
      label: 'إشعارات المتصفح',
      description: 'إشعارات فورية في المتصفح',
      icon: Bell,
    },
  ];

  const notificationTypes = [
    {
      id: 'complaintUpdates',
      label: 'تحديثات الشكاوى',
      description: 'عند تغيير حالة شكواك',
    },
    {
      id: 'newResponses',
      label: 'الردود الجديدة',
      description: 'عند وجود رد جديد على شكواك',
    },
    {
      id: 'news',
      label: 'الأخبار والمقالات',
      description: 'آخر أخبار النائب وإنجازاته',
    },
    {
      id: 'marketing',
      label: 'الفعاليات والأنشطة',
      description: 'دعوات الفعاليات والأنشطة المجتمعية',
    },
  ];

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      await fetch('/api/user/notification-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            إعدادات الإشعارات
          </h1>
          <p className="text-gray-600 mb-8">
            اختر كيف تريد أن نتواصل معك
          </p>

          {/* قنوات الإشعارات */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              قنوات الإشعارات
            </h2>
            
            <div className="space-y-4">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <channel.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{channel.label}</p>
                      <p className="text-sm text-gray-500">{channel.description}</p>
                    </div>
                  </div>
                  
                  <ToggleSwitch
                    checked={preferences[channel.id as keyof NotificationPreferences]}
                    onChange={() => handleToggle(channel.id as keyof NotificationPreferences)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* أنواع الإشعارات */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              أنواع الإشعارات
            </h2>
            
            <div className="space-y-4">
              {notificationTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{type.label}</p>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                  
                  <ToggleSwitch
                    checked={preferences[type.id as keyof NotificationPreferences]}
                    onChange={() => handleToggle(type.id as keyof NotificationPreferences)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* زر الحفظ */}
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            className="w-full"
          >
            {saved ? (
              <>
                <Check className="w-5 h-5 ml-2" />
                تم الحفظ!
              </>
            ) : (
              'حفظ التفضيلات'
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Toggle Switch Component
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'relative w-14 h-8 rounded-full transition-colors',
        checked ? 'bg-primary' : 'bg-gray-200'
      )}
    >
      <motion.div
        layout
        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow"
        style={{ left: checked ? 'calc(100% - 28px)' : '4px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
```

---

## 📦 المخرجات المتوقعة

بنهاية المرحلة الرابعة:

```
✅ نظام Queue للإشعارات (BullMQ + Redis)
✅ WhatsApp Integration (Twilio)
✅ SMS Integration
✅ Email Templates (Resend)
✅ Push Notifications (Firebase)
✅ صفحة تفضيلات الإشعارات
✅ تسجيل الإشعارات في قاعدة البيانات
```

---

## 📊 Environment Variables

```env
# Twilio (WhatsApp & SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=+1xxxxxxxxxx

# Resend (Email)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Firebase (Push)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Redis
REDIS_URL=redis://localhost:6379
```

---

## ✅ Checklist

### الأسبوع 7
- [ ] BullMQ Queue setup
- [ ] WhatsApp Provider
- [ ] SMS Provider
- [ ] Email Provider with templates
- [ ] Notification Worker

### الأسبوع 8
- [ ] Push Notifications (Firebase)
- [ ] Notification Service integration
- [ ] User preferences page
- [ ] Notification logging
- [ ] Testing all channels

---

**المرحلة السابقة**: [المرحلة الثالثة - نظام الشكاوى](./PHASE_3_COMPLAINTS.md)

**المرحلة التالية**: [المرحلة الخامسة - لوحة التحكم](./PHASE_5_ADMIN.md)
