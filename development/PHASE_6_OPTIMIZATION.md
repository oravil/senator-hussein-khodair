# 🚀 المرحلة السادسة: الاختبار والتحسين والإطلاق

<div align="center">

**الأسبوع 11-12**

![Status](https://img.shields.io/badge/Status-Not%20Started-lightgrey)
![Duration](https://img.shields.io/badge/Duration-2%20Weeks-blue)
![Priority](https://img.shields.io/badge/Priority-Critical-red)

</div>

---

## 🎯 أهداف المرحلة

1. ✅ اختبارات Unit & Integration
2. ✅ اختبارات E2E
3. ✅ تحسين الأداء
4. ✅ تحسين SEO
5. ✅ الأمان والحماية
6. ✅ النشر والإطلاق

---

## 📋 المهام التفصيلية

### الأسبوع الحادي عشر

#### 6.1 Testing Strategy

**هيكل الاختبارات:**
```
packages/api/src/
├── __tests__/
│   ├── unit/
│   │   ├── services/
│   │   │   ├── complaints.service.test.ts
│   │   │   ├── notifications.service.test.ts
│   │   │   └── auth.service.test.ts
│   │   └── utils/
│   │       └── helpers.test.ts
│   └── integration/
│       ├── complaints.test.ts
│       ├── auth.test.ts
│       └── notifications.test.ts

apps/web/
├── __tests__/
│   ├── components/
│   │   ├── Button.test.tsx
│   │   ├── Header.test.tsx
│   │   └── ComplaintForm.test.tsx
│   └── pages/
│       └── home.test.tsx

e2e/
├── tests/
│   ├── complaint-flow.spec.ts
│   ├── auth.spec.ts
│   └── admin.spec.ts
├── fixtures/
└── playwright.config.ts
```

**إعداد Jest:**
```typescript
// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
```

**Unit Tests - Complaints Service:**
```typescript
// __tests__/unit/services/complaints.service.test.ts
import { ComplaintsService } from '@/modules/complaints/complaints.service';
import { prisma } from '@senator/database';
import { ComplaintStatus, Priority } from '@prisma/client';

jest.mock('@senator/database', () => ({
  prisma: {
    complaint: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    statusHistory: {
      create: jest.fn(),
    },
  },
}));

describe('ComplaintsService', () => {
  let service: ComplaintsService;

  beforeEach(() => {
    service = new ComplaintsService();
    jest.clearAllMocks();
  });

  describe('createComplaint', () => {
    it('should create a complaint with tracking number', async () => {
      const mockComplaint = {
        id: '1',
        trackingNumber: 'SHK-2401-ABC123',
        title: 'Test Complaint',
        status: ComplaintStatus.PENDING,
      };

      (prisma.complaint.create as jest.Mock).mockResolvedValue(mockComplaint);
      (prisma.statusHistory.create as jest.Mock).mockResolvedValue({});

      const result = await service.createComplaint(
        {
          title: 'Test Complaint',
          description: 'Test description',
          category: 'HEALTH',
          governorate: 'Cairo',
        },
        'user-1'
      );

      expect(result).toEqual(mockComplaint);
      expect(prisma.complaint.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Test Complaint',
            userId: 'user-1',
            status: ComplaintStatus.PENDING,
          }),
        })
      );
    });

    it('should generate unique tracking number', async () => {
      // Test tracking number format
      const trackingRegex = /^SHK-\d{4}-[A-Z0-9]{6}$/;
      const trackingNumber = service['generateTrackingNumber']();
      
      expect(trackingNumber).toMatch(trackingRegex);
    });
  });

  describe('updateStatus', () => {
    it('should update complaint status and create history', async () => {
      const mockComplaint = {
        id: '1',
        status: ComplaintStatus.PENDING,
      };

      (prisma.complaint.findUnique as jest.Mock).mockResolvedValue(mockComplaint);
      (prisma.complaint.update as jest.Mock).mockResolvedValue({
        ...mockComplaint,
        status: ComplaintStatus.UNDER_REVIEW,
      });
      (prisma.statusHistory.create as jest.Mock).mockResolvedValue({});

      const result = await service.updateStatus(
        '1',
        ComplaintStatus.UNDER_REVIEW,
        'Moving to review',
        'admin-1'
      );

      expect(result.status).toBe(ComplaintStatus.UNDER_REVIEW);
      expect(prisma.statusHistory.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            fromStatus: ComplaintStatus.PENDING,
            toStatus: ComplaintStatus.UNDER_REVIEW,
          }),
        })
      );
    });

    it('should throw error if complaint not found', async () => {
      (prisma.complaint.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateStatus('invalid', ComplaintStatus.UNDER_REVIEW, '', 'admin')
      ).rejects.toThrow('الشكوى غير موجودة');
    });
  });
});
```

**Integration Tests:**
```typescript
// __tests__/integration/complaints.test.ts
import request from 'supertest';
import { app } from '@/app';
import { prisma } from '@senator/database';

describe('Complaints API', () => {
  let authToken: string;
  let testComplaintId: string;

  beforeAll(async () => {
    // Login and get token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ phone: '01012345678', password: 'testpass' });
    
    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.complaint.deleteMany({
      where: { userId: 'test-user-id' }
    });
  });

  describe('POST /api/complaints', () => {
    it('should create a new complaint', async () => {
      const response = await request(app)
        .post('/api/complaints')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Integration Test Complaint',
          description: 'This is a test complaint description that is long enough',
          category: 'HEALTH',
          governorate: 'القاهرة',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('trackingNumber');
      expect(response.body.trackingNumber).toMatch(/^SHK-/);
      
      testComplaintId = response.body.id;
    });

    it('should reject invalid data', async () => {
      const response = await request(app)
        .post('/api/complaints')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Short', // Too short
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject unauthenticated requests', async () => {
      const response = await request(app)
        .post('/api/complaints')
        .send({
          title: 'Test Complaint',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/complaints/track/:number', () => {
    it('should return complaint by tracking number', async () => {
      const complaint = await prisma.complaint.findUnique({
        where: { id: testComplaintId }
      });

      const response = await request(app)
        .get(`/api/complaints/track/${complaint!.trackingNumber}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testComplaintId);
    });

    it('should return 404 for invalid tracking number', async () => {
      const response = await request(app)
        .get('/api/complaints/track/SHK-0000-INVALID');

      expect(response.status).toBe(404);
    });
  });
});
```

**E2E Tests (Playwright):**
```typescript
// e2e/tests/complaint-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Complaint Submission Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete full complaint submission', async ({ page }) => {
    // Navigate to complaint form
    await page.click('text=تقديم شكوى');
    await expect(page).toHaveURL('/complaints/new');

    // Step 1: Personal Info
    await page.fill('[name="name"]', 'أحمد محمد');
    await page.fill('[name="phone"]', '01012345678');
    await page.fill('[name="email"]', 'ahmed@test.com');
    await page.click('text=التالي');

    // Step 2: Complaint Details
    await page.click('[data-category="HEALTH"]');
    await page.fill('[name="title"]', 'شكوى اختبارية للتجربة');
    await page.fill(
      '[name="description"]',
      'هذا وصف تجريبي للشكوى يحتوي على تفاصيل كافية لتوضيح المشكلة'
    );
    await page.click('text=التالي');

    // Step 3: Location
    await page.selectOption('[name="governorate"]', 'القاهرة');
    await page.fill('[name="city"]', 'مدينة نصر');
    await page.click('text=التالي');

    // Step 4: Attachments (skip)
    await page.click('text=التالي');

    // Step 5: Review & Submit
    await expect(page.locator('text=أحمد محمد')).toBeVisible();
    await expect(page.locator('text=شكوى اختبارية للتجربة')).toBeVisible();
    await page.click('text=إرسال الشكوى');

    // Success screen
    await expect(page.locator('text=تم إرسال شكواك بنجاح')).toBeVisible();
    await expect(page.locator('[data-tracking-number]')).toBeVisible();

    // Get tracking number
    const trackingNumber = await page
      .locator('[data-tracking-number]')
      .textContent();

    // Track the complaint
    await page.click('text=متابعة الشكوى');
    await page.fill('[placeholder*="رقم التتبع"]', trackingNumber!);
    await page.click('[type="submit"]');

    await expect(page.locator('text=قيد الانتظار')).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    await page.click('text=تقديم شكوى');

    // Try to proceed without filling required fields
    await page.click('text=التالي');

    await expect(page.locator('text=الاسم يجب أن يكون')).toBeVisible();
    await expect(page.locator('text=رقم هاتف غير صحيح')).toBeVisible();
  });
});

test.describe('Admin Complaints Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/admin/login');
    await page.fill('[name="email"]', 'admin@senator.gov.eg');
    await page.fill('[name="password"]', 'admin123');
    await page.click('text=تسجيل الدخول');
    await expect(page).toHaveURL('/admin');
  });

  test('should update complaint status', async ({ page }) => {
    await page.click('text=الشكاوى');
    
    // Click on first complaint
    await page.click('tr >> nth=1 >> text=عرض');

    // Update status
    await page.selectOption('[name="status"]', 'UNDER_REVIEW');
    await page.fill('[name="note"]', 'جاري مراجعة الشكوى');
    await page.click('text=تحديث الحالة');

    await expect(page.locator('text=تم تحديث الحالة')).toBeVisible();
  });
});
```

#### 6.2 Performance Optimization

**Next.js Optimizations:**
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    domains: ['images.senator-khodair.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,

  // Static optimization
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Headers
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },

  // Rewrites for API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

**Code Splitting & Lazy Loading:**
```tsx
// Lazy load heavy components
import dynamic from 'next/dynamic';

// Charts (heavy)
const ComplaintsChart = dynamic(
  () => import('@/components/charts/ComplaintsChart'),
  { loading: () => <ChartSkeleton />, ssr: false }
);

// Rich Text Editor
const RichTextEditor = dynamic(
  () => import('@/components/RichTextEditor'),
  { loading: () => <EditorSkeleton />, ssr: false }
);

// Map component
const LocationMap = dynamic(
  () => import('@/components/LocationMap'),
  { loading: () => <MapSkeleton />, ssr: false }
);

// Image gallery with lightbox
const ImageGallery = dynamic(
  () => import('@/components/ImageGallery'),
  { loading: () => <GallerySkeleton /> }
);
```

**React Query Optimization:**
```typescript
// lib/react-query.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Prefetch on hover
export function usePrefetchComplaint(id: string) {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['complaint', id],
      queryFn: () => fetchComplaint(id),
      staleTime: 1000 * 60 * 5,
    });
  };

  return prefetch;
}
```

**Database Query Optimization:**
```typescript
// Optimized Prisma queries
export async function getComplaintsWithPagination(params: {
  page: number;
  limit: number;
  status?: string;
  category?: string;
}) {
  const { page, limit, status, category } = params;
  const skip = (page - 1) * limit;

  // Use transaction for consistent counts
  const [complaints, total] = await prisma.$transaction([
    prisma.complaint.findMany({
      where: {
        ...(status && { status: status as ComplaintStatus }),
        ...(category && { category }),
      },
      select: {
        id: true,
        trackingNumber: true,
        title: true,
        status: true,
        priority: true,
        category: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            phone: true,
          },
        },
        _count: {
          select: {
            responses: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.complaint.count({
      where: {
        ...(status && { status: status as ComplaintStatus }),
        ...(category && { category }),
      },
    }),
  ]);

  return {
    complaints,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}
```

### الأسبوع الثاني عشر

#### 6.3 SEO Optimization

**Metadata Configuration:**
```typescript
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://senator-khodair.com'),
  title: {
    default: 'النائب د. حسين خضير - عضو مجلس الشيوخ المصري',
    template: '%s | النائب د. حسين خضير',
  },
  description:
    'الموقع الرسمي للنائب د. حسين خضير - رئيس مجلس إدارة شركة نابكو للأدوية ونائب رئيس لجنة الصحة بمجلس الشيوخ. تقديم الشكاوى والمقترحات.',
  keywords: [
    'حسين خضير',
    'مجلس الشيوخ',
    'نابكو',
    'أدوية',
    'شكاوى',
    'خدمات المواطنين',
  ],
  authors: [{ name: 'Dr. Hussein Khodair Office' }],
  creator: 'Senator Khodair Office',
  publisher: 'Senator Khodair Office',
  
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    url: 'https://senator-khodair.com',
    siteName: 'النائب د. حسين خضير',
    title: 'النائب د. حسين خضير - عضو مجلس الشيوخ المصري',
    description:
      'الموقع الرسمي للنائب د. حسين خضير. تقديم الشكاوى والمقترحات ومتابعتها.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'النائب د. حسين خضير',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'النائب د. حسين خضير',
    description: 'الموقع الرسمي للنائب د. حسين خضير',
    images: ['/twitter-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: 'google-verification-code',
  },

  alternates: {
    canonical: 'https://senator-khodair.com',
    languages: {
      'ar-EG': 'https://senator-khodair.com',
    },
  },
};
```

**Structured Data:**
```tsx
// components/StructuredData.tsx
export function WebsiteStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'النائب د. حسين خضير',
          url: 'https://senator-khodair.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://senator-khodair.com/search?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        }),
      }}
    />
  );
}

export function PersonStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'د. حسين خضير',
          jobTitle: 'عضو مجلس الشيوخ المصري',
          description: 'رئيس مجلس إدارة شركة نابكو للأدوية ونائب رئيس لجنة الصحة',
          image: 'https://senator-khodair.com/images/dr-khodair.jpg',
          sameAs: [
            'https://twitter.com/husseinkhodair',
            'https://facebook.com/dr.husseinkhodair',
            'https://linkedin.com/in/husseinkhodair',
          ],
          worksFor: {
            '@type': 'Organization',
            name: 'مجلس الشيوخ المصري',
          },
        }),
      }}
    />
  );
}
```

**Sitemap Generation:**
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { prisma } from '@senator/database';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://senator-khodair.com';

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/achievements',
    '/news',
    '/contact',
    '/complaints/new',
    '/complaints/track',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic news pages
  const news = await prisma.news.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const newsPages = news.map((item) => ({
    url: `${baseUrl}/news/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...newsPages];
}
```

#### 6.4 Security Hardening

**Security Headers:**
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  response.headers.set(
    'Content-Security-Policy',
    `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https: blob:;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://api.senator-khodair.com https://www.google-analytics.com;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s+/g, ' ').trim()
  );

  // Rate limiting headers
  const ip = request.ip ?? '127.0.0.1';
  response.headers.set('X-RateLimit-Limit', '100');

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

**Rate Limiting:**
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

// General API rate limit
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: '@senator/api',
});

// Complaint submission rate limit (stricter)
export const complaintRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
  prefix: '@senator/complaint',
});

// Auth rate limit (prevent brute force)
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
  prefix: '@senator/auth',
});

// Usage in API route
export async function rateLimitMiddleware(
  req: NextRequest,
  limiter: Ratelimit
) {
  const ip = req.ip ?? '127.0.0.1';
  const { success, limit, reset, remaining } = await limiter.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: reset },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return null;
}
```

**Input Sanitization:**
```typescript
// lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';
import { z } from 'zod';

// HTML sanitization
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });
}

// Phone number sanitization
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

// Complaint validation schema with sanitization
export const complaintSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(100)
    .transform((v) => v.trim()),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/)
    .transform(sanitizePhone),
  email: z.string().email().optional().or(z.literal('')),
  title: z
    .string()
    .min(10)
    .max(200)
    .transform((v) => v.trim()),
  description: z
    .string()
    .min(50)
    .max(5000)
    .transform((v) => sanitizeHtml(v.trim())),
  category: z.enum([
    'HEALTH',
    'EDUCATION',
    'INFRASTRUCTURE',
    'UTILITIES',
    'SOCIAL',
    'EMPLOYMENT',
    'HOUSING',
    'OTHER',
  ]),
  governorate: z.string().min(1).max(50),
  city: z.string().max(100).optional(),
});
```

#### 6.5 Deployment Configuration

**Vercel Configuration:**
```json
// vercel.json
{
  "buildCommand": "pnpm turbo run build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["fra1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url",
    "NEXT_PUBLIC_WS_URL": "@ws_url"
  },
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 3 * * *"
    },
    {
      "path": "/api/cron/notifications",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

**Docker Configuration:**
```dockerfile
# Dockerfile
FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/database/package.json ./packages/database/
COPY packages/api/package.json ./packages/api/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/database/node_modules ./packages/database/node_modules
COPY . .
RUN pnpm turbo run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
COPY --from=builder /app/packages/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER expressjs
EXPOSE 3001
CMD ["node", "dist/server.js"]
```

**GitHub Actions for Deployment:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm e2e

  deploy-api:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        uses: railwayapp/deploy-action@v1
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}
          service: api

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Vercel CLI
        run: npm install -g vercel
      - name: Deploy to Vercel
        run: |
          vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
          vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
          vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 📦 المخرجات المتوقعة

بنهاية المرحلة السادسة:

```
✅ Unit Tests (Coverage > 70%)
✅ Integration Tests
✅ E2E Tests (Playwright)
✅ Performance Score > 90 (Lighthouse)
✅ SEO Score > 95
✅ Security Headers (A+ rating)
✅ Rate Limiting
✅ Production Deployment
✅ CI/CD Pipeline
✅ Monitoring & Logging
```

---

## 📊 Launch Checklist

### قبل الإطلاق
- [ ] جميع الاختبارات تمر بنجاح
- [ ] Performance audit (Lighthouse > 90)
- [ ] Security audit completed
- [ ] SSL certificate configured
- [ ] Domain DNS configured
- [ ] Error monitoring setup (Sentry)
- [ ] Analytics configured
- [ ] Backup strategy in place
- [ ] Documentation complete

### يوم الإطلاق
- [ ] Final deployment to production
- [ ] Smoke tests on production
- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Team standby for issues

### بعد الإطلاق
- [ ] Monitor user feedback
- [ ] Check analytics data
- [ ] Performance monitoring
- [ ] Regular security updates
- [ ] Feature requests collection

---

## ✅ Checklist

### الأسبوع 11
- [ ] Jest setup
- [ ] Unit tests for services
- [ ] Integration tests
- [ ] E2E tests setup (Playwright)
- [ ] CI test pipeline

### الأسبوع 12
- [ ] Performance optimization
- [ ] SEO implementation
- [ ] Security hardening
- [ ] Docker configuration
- [ ] Production deployment
- [ ] Monitoring setup
- [ ] Launch! 🚀

---

**المرحلة السابقة**: [المرحلة الخامسة - لوحة التحكم](./PHASE_5_ADMIN.md)

---

## 🎉 نهاية خطة التطوير

بإتمام هذه المراحل الستة، سيكون لدينا:
- موقع احترافي كامل للنائب د. حسين خضير
- نظام شكاوى متكامل
- نظام إشعارات متعدد القنوات
- لوحة تحكم إدارية شاملة
- أداء ممتاز وأمان عالي

**إجمالي مدة التطوير: 12 أسبوع (3 أشهر)**
