# 🔷 المرحلة الثانية: الواجهة الأمامية والتصميم

<div align="center">

**الأسبوع 3-4**

![Status](https://img.shields.io/badge/Status-Not%20Started-lightgrey)
![Duration](https://img.shields.io/badge/Duration-2%20Weeks-blue)
![Priority](https://img.shields.io/badge/Priority-High-orange)

</div>

---

## 🎯 أهداف المرحلة

1. ✅ تصميم UI/UX احترافي
2. ✅ تنفيذ الصفحات الرئيسية
3. ✅ إضافة الحركات والتفاعلات (Animations)
4. ✅ تنفيذ مكونات UI الأساسية
5. ✅ Responsive Design كامل

---

## 🎨 دليل التصميم (Design System)

### الألوان
```css
:root {
  /* الألوان الأساسية */
  --primary: #1e3a5f;        /* أزرق داكن - رسمي */
  --primary-light: #2c5282;
  --primary-dark: #1a365d;
  
  /* الألوان الثانوية */
  --secondary: #c9a227;      /* ذهبي - فخامة */
  --secondary-light: #d4af37;
  --secondary-dark: #b8941f;
  
  /* ألوان الحالات */
  --success: #38a169;        /* أخضر */
  --success-light: #48bb78;
  --warning: #dd6b20;        /* برتقالي */
  --warning-light: #ed8936;
  --danger: #e53e3e;         /* أحمر */
  --danger-light: #fc8181;
  --info: #3182ce;           /* أزرق */
  --info-light: #63b3ed;
  
  /* الخلفيات */
  --bg-primary: #ffffff;
  --bg-secondary: #f7fafc;
  --bg-tertiary: #edf2f7;
  --bg-dark: #1a202c;
  
  /* النصوص */
  --text-primary: #2d3748;
  --text-secondary: #718096;
  --text-muted: #a0aec0;
  --text-inverse: #ffffff;
  
  /* الحدود */
  --border-light: #e2e8f0;
  --border-medium: #cbd5e0;
}
```

### الخطوط
```css
/* خط Cairo للعربية */
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');

:root {
  --font-primary: 'Cairo', sans-serif;
  
  /* أحجام الخطوط */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
}
```

### المسافات
```css
:root {
  --spacing-1: 0.25rem;   /* 4px */
  --spacing-2: 0.5rem;    /* 8px */
  --spacing-3: 0.75rem;   /* 12px */
  --spacing-4: 1rem;      /* 16px */
  --spacing-5: 1.25rem;   /* 20px */
  --spacing-6: 1.5rem;    /* 24px */
  --spacing-8: 2rem;      /* 32px */
  --spacing-10: 2.5rem;   /* 40px */
  --spacing-12: 3rem;     /* 48px */
  --spacing-16: 4rem;     /* 64px */
  --spacing-20: 5rem;     /* 80px */
}
```

---

## 📋 المهام التفصيلية

### الأسبوع الثالث

#### 2.1 مكونات UI الأساسية

**إنشاء المكونات:**
```
components/ui/
├── Button.tsx           # أزرار متعددة الأنماط
├── Input.tsx            # حقول إدخال
├── Textarea.tsx         # مناطق النص
├── Select.tsx           # قوائم منسدلة
├── Checkbox.tsx         # خانات اختيار
├── Radio.tsx            # أزرار راديو
├── Switch.tsx           # مفاتيح تبديل
├── Modal.tsx            # نوافذ منبثقة
├── Drawer.tsx           # أدراج جانبية
├── Card.tsx             # بطاقات
├── Badge.tsx            # شارات الحالة
├── Avatar.tsx           # صور المستخدمين
├── Skeleton.tsx         # Loading states
├── Spinner.tsx          # دوائر تحميل
├── Toast.tsx            # إشعارات
├── Tooltip.tsx          # تلميحات
├── Tabs.tsx             # تبويبات
├── Accordion.tsx        # أكورديون
├── Progress.tsx         # شريط التقدم
├── Timeline.tsx         # خط زمني
├── FileUpload.tsx       # رفع ملفات
├── RatingStars.tsx      # تقييم نجوم
├── Pagination.tsx       # ترقيم الصفحات
└── Table.tsx            # جداول
```

**مثال Button Component:**
```tsx
// components/ui/Button.tsx
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-secondary text-white hover:bg-secondary-dark',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost: 'text-primary hover:bg-primary/10',
  danger: 'bg-danger text-white hover:bg-red-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
        'transition-colors duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {rightIcon && !isLoading && rightIcon}
    </motion.button>
  );
}
```

#### 2.2 مكونات Layout

```
components/layout/
├── Header.tsx           # الهيدر مع Navigation
├── Footer.tsx           # الفوتر
├── Sidebar.tsx          # القائمة الجانبية
├── Navigation.tsx       # قائمة التنقل
├── MobileMenu.tsx       # قائمة الموبايل
├── Breadcrumb.tsx       # مسار التنقل
└── Container.tsx        # حاوية المحتوى
```

**مثال Header with Animations:**
```tsx
// components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navItems = [
  { href: '/', label: 'الرئيسية' },
  { href: '/about', label: 'النبذة' },
  { href: '/news', label: 'الأخبار' },
  { href: '/events', label: 'الفعاليات' },
  { href: '/complaints/new', label: 'تقديم شكوى', highlight: true },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <img src="/logo.png" alt="Logo" className="h-12" />
              <div className="hidden md:block">
                <h1 className="font-bold text-primary">د. حسين خضير</h1>
                <p className="text-xs text-gray-500">عضو مجلس الشيوخ</p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.span
                  whileHover={{ y: -2 }}
                  className={cn(
                    'font-medium transition-colors',
                    item.highlight 
                      ? 'bg-secondary text-white px-4 py-2 rounded-lg'
                      : 'text-gray-700 hover:text-primary'
                  )}
                >
                  {item.label}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4"
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={item.href}
                    className="block py-3 border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
```

### الأسبوع الرابع

#### 2.3 الصفحة الرئيسية

**أقسام الصفحة الرئيسية:**
```
sections/
├── HeroSection.tsx          # البانر الرئيسي
├── QuickComplaint.tsx       # نموذج شكوى سريع
├── StatsCounter.tsx         # إحصائيات متحركة
├── AboutPreview.tsx         # نبذة مختصرة
├── LatestNews.tsx           # آخر الأخبار
├── UpcomingEvents.tsx       # الفعاليات القادمة
├── Testimonials.tsx         # آراء المواطنين
├── ContactCTA.tsx           # دعوة للتواصل
└── PartnersSection.tsx      # الشركاء
```

**مثال HeroSection:**
```tsx
// components/sections/HeroSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, FileText, Search } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-bl from-primary via-primary-dark to-primary" />
      
      {/* Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'url(/patterns/geometric.svg)' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm mb-6"
            >
              عضو مجلس الشيوخ المصري
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              د. حسين خضير
              <span className="block text-secondary mt-2">في خدمة المواطنين</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-white/80 mb-8 leading-relaxed"
            >
              وكيل لجنة الصحة بمجلس الشيوخ ورئيس شركة نابكو للأدوية.
              نعمل معاً من أجل صحة أفضل وحياة كريمة لكل مواطن.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/complaints/new">
                <Button size="lg" variant="secondary">
                  <FileText className="w-5 h-5" />
                  تقديم شكوى
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>

              <Link href="/complaints/track">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                  <Search className="w-5 h-5" />
                  متابعة شكوى
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-secondary/20 rounded-full blur-3xl transform -translate-x-10" />
              <img 
                src="/images/dr-hussein.png" 
                alt="د. حسين خضير"
                className="relative z-10 w-full max-w-lg mx-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
```

**مثال StatsCounter:**
```tsx
// components/sections/StatsCounter.tsx
'use client';

import { useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { FileCheck, Users, Clock, Star } from 'lucide-react';

const stats = [
  { icon: FileCheck, value: 1250, label: 'شكوى تم حلها', suffix: '+' },
  { icon: Users, value: 5000, label: 'مواطن خدمناه', suffix: '+' },
  { icon: Clock, value: 48, label: 'ساعة متوسط الرد', suffix: '' },
  { icon: Star, value: 98, label: 'نسبة الرضا', suffix: '%' },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const animation = animate(count, value, {
        duration: 2,
        ease: 'easeOut',
      });
      return animation.stop;
    }
  }, [isInView, value, count]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-bold text-primary">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function StatsCounter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            إنجازاتنا بالأرقام
          </h2>
          <p className="text-gray-600">
            نعمل بجد لخدمة المواطنين وحل مشاكلهم
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

#### 2.4 الصفحات الأخرى

- [ ] صفحة النبذة (About)
- [ ] صفحة الأخبار (News List)
- [ ] صفحة تفاصيل خبر (News Detail)
- [ ] صفحة الفعاليات (Events)
- [ ] صفحة معرض الصور (Gallery)
- [ ] صفحة التواصل (Contact)

---

## 🎬 مكونات الحركات (Animations)

```
components/animations/
├── PageTransition.tsx       # انتقالات الصفحات
├── ScrollReveal.tsx         # ظهور عند التمرير
├── FadeIn.tsx               # تلاشي للداخل
├── SlideIn.tsx              # انزلاق
├── ScaleIn.tsx              # تكبير
├── StaggerChildren.tsx      # تتابع العناصر
├── ParallaxSection.tsx      # تأثير Parallax
├── FloatingElement.tsx      # عناصر عائمة
└── TypeWriter.tsx           # كتابة تدريجية
```

**مثال PageTransition:**
```tsx
// components/animations/PageTransition.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

**مثال ScrollReveal:**
```tsx
// components/animations/ScrollReveal.tsx
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

const directionVariants = {
  up: { y: 50 },
  down: { y: -50 },
  left: { x: 50 },
  right: { x: -50 },
};

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directionVariants[direction],
      }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

---

## 📦 المخرجات المتوقعة

بنهاية المرحلة الثانية:

```
✅ Design System كامل
✅ جميع مكونات UI جاهزة
✅ الصفحة الرئيسية مع جميع الأقسام
✅ صفحات المحتوى (النبذة، الأخبار، الفعاليات)
✅ Animations وتفاعلات سلسة
✅ Responsive Design لجميع الشاشات
✅ RTL Support كامل
```

---

## ✅ Checklist

### الأسبوع 3
- [ ] Design System documented
- [ ] All UI components created
- [ ] Layout components (Header, Footer)
- [ ] Animation components
- [ ] Dark mode support (optional)

### الأسبوع 4
- [ ] Homepage complete
- [ ] About page
- [ ] News pages
- [ ] Events page
- [ ] Gallery page
- [ ] Contact page
- [ ] All pages responsive
- [ ] All animations working

---

**المرحلة السابقة**: [المرحلة الأولى - الأساسيات](./PHASE_1_INFRASTRUCTURE.md)

**المرحلة التالية**: [المرحلة الثالثة - نظام الشكاوى](./PHASE_3_COMPLAINTS.md)
