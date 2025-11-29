# 🎛️ المرحلة الخامسة: لوحة التحكم الإدارية

<div align="center">

**الأسبوع 9-10**

![Status](https://img.shields.io/badge/Status-Not%20Started-lightgrey)
![Duration](https://img.shields.io/badge/Duration-2%20Weeks-blue)
![Priority](https://img.shields.io/badge/Priority-High-orange)

</div>

---

## 🎯 أهداف المرحلة

1. ✅ لوحة إحصائيات شاملة
2. ✅ إدارة الشكاوى والطلبات
3. ✅ إدارة المحتوى (الأخبار والمقالات)
4. ✅ إدارة المستخدمين
5. ✅ نظام الصلاحيات
6. ✅ تقارير وتحليلات

---

## 📋 المهام التفصيلية

### الأسبوع التاسع

#### 5.1 تصميم لوحة التحكم

**هيكل التطبيق:**
```
apps/admin/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # Dashboard
│   ├── (auth)/
│   │   └── login/
│   ├── complaints/
│   │   ├── page.tsx          # قائمة الشكاوى
│   │   └── [id]/
│   │       └── page.tsx      # تفاصيل الشكوى
│   ├── content/
│   │   ├── news/
│   │   ├── achievements/
│   │   └── pages/
│   ├── users/
│   ├── reports/
│   └── settings/
├── components/
│   ├── charts/
│   ├── tables/
│   └── ui/
└── lib/
```

**Dashboard Layout:**
```tsx
// apps/admin/app/layout.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Newspaper, 
  Users, 
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  LogOut
} from 'lucide-react';

const navigation = [
  { name: 'لوحة التحكم', href: '/', icon: LayoutDashboard },
  { name: 'الشكاوى', href: '/complaints', icon: MessageSquare, badge: true },
  { name: 'المحتوى', href: '/content', icon: Newspaper },
  { name: 'المستخدمين', href: '/users', icon: Users },
  { name: 'التقارير', href: '/reports', icon: BarChart3 },
  { name: 'الإعدادات', href: '/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Sidebar - Desktop */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="fixed right-0 top-0 h-full bg-white shadow-lg z-50 hidden lg:block"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <AnimatePresence mode="wait">
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-bold text-primary"
                >
                  لوحة التحكم
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <NavItem
                key={item.name}
                item={item}
                collapsed={!sidebarOpen}
              />
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t">
            <UserMenu collapsed={!sidebarOpen} />
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-72 bg-white shadow-lg z-50 lg:hidden"
            >
              {/* Mobile menu content */}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300',
          sidebarOpen ? 'lg:mr-[280px]' : 'lg:mr-[80px]'
        )}
      >
        {/* Top Bar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserDropdown />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ item, collapsed }: { item: any; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors',
        isActive
          ? 'bg-primary text-white'
          : 'text-gray-600 hover:bg-gray-100'
      )}
    >
      <item.icon className="w-5 h-5 flex-shrink-0" />
      <AnimatePresence mode="wait">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-medium"
          >
            {item.name}
          </motion.span>
        )}
      </AnimatePresence>
      {item.badge && !collapsed && (
        <span className="mr-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          12
        </span>
      )}
    </Link>
  );
}
```

#### 5.2 صفحة Dashboard الرئيسية

```tsx
// apps/admin/app/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Star,
} from 'lucide-react';

export default function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetch('/api/admin/stats').then((r) => r.json()),
  });

  const statsCards = [
    {
      title: 'إجمالي الشكاوى',
      value: stats?.totalComplaints || 0,
      change: '+12%',
      icon: MessageSquare,
      color: 'bg-blue-500',
    },
    {
      title: 'قيد المراجعة',
      value: stats?.pendingComplaints || 0,
      change: '-5%',
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'تم الحل',
      value: stats?.resolvedComplaints || 0,
      change: '+18%',
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'متوسط التقييم',
      value: stats?.averageRating?.toFixed(1) || '0.0',
      change: '+0.3',
      icon: Star,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <DateRangePicker />
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn('p-3 rounded-xl', stat.color)}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className={cn(
                'text-sm font-medium px-2 py-1 rounded-full',
                stat.change.startsWith('+')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              )}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-500 mt-1">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ComplaintsChart />
        <CategoryDistribution />
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentComplaints />
        </div>
        <div>
          <TopCategories />
        </div>
      </div>
    </div>
  );
}

// Chart Component
function ComplaintsChart() {
  const { data } = useQuery({
    queryKey: ['complaints-chart'],
    queryFn: () => fetch('/api/admin/charts/complaints').then((r) => r.json()),
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6">
        إحصائيات الشكاوى
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data?.chartData || []}>
          <defs>
            <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1a5f2a" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#1a5f2a" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#1a5f2a"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorComplaints)"
          />
          <Area
            type="monotone"
            dataKey="resolved"
            stroke="#22c55e"
            strokeWidth={2}
            fillOpacity={0}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full" />
          <span className="text-sm text-gray-600">إجمالي الشكاوى</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-sm text-gray-600">تم الحل</span>
        </div>
      </div>
    </div>
  );
}
```

### الأسبوع العاشر

#### 5.3 صفحة إدارة الشكاوى

```tsx
// apps/admin/app/complaints/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Eye,
  MessageCircle,
  MoreVertical,
} from 'lucide-react';

export default function ComplaintsPage() {
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
    search: '',
    dateFrom: '',
    dateTo: '',
  });
  const [page, setPage] = useState(1);
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['complaints', filters, page],
    queryFn: () =>
      fetch(`/api/admin/complaints?${new URLSearchParams({
        ...filters,
        page: page.toString(),
      })}`).then((r) => r.json()),
  });

  const queryClient = useQueryClient();

  const bulkUpdateMutation = useMutation({
    mutationFn: (data: { ids: string[]; status: string }) =>
      fetch('/api/admin/complaints/bulk-update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      setSelectedComplaints([]);
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">إدارة الشكاوى</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => exportToExcel()}>
            <Download className="w-4 h-4 ml-2" />
            تصدير Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="بحث برقم التتبع أو العنوان..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pr-10 pl-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <Select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={[
              { value: '', label: 'جميع الحالات' },
              { value: 'PENDING', label: 'قيد الانتظار' },
              { value: 'UNDER_REVIEW', label: 'قيد المراجعة' },
              { value: 'IN_PROGRESS', label: 'جاري العمل' },
              { value: 'RESOLVED', label: 'تم الحل' },
              { value: 'CLOSED', label: 'مغلقة' },
            ]}
          />

          <Select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            options={[
              { value: '', label: 'جميع التصنيفات' },
              { value: 'HEALTH', label: 'صحة' },
              { value: 'EDUCATION', label: 'تعليم' },
              { value: 'INFRASTRUCTURE', label: 'بنية تحتية' },
              // ...
            ]}
          />

          <Select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            options={[
              { value: '', label: 'جميع الأولويات' },
              { value: 'URGENT', label: 'عاجل' },
              { value: 'HIGH', label: 'عالي' },
              { value: 'NORMAL', label: 'عادي' },
              { value: 'LOW', label: 'منخفض' },
            ]}
          />
        </div>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedComplaints.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between"
          >
            <span className="text-primary font-medium">
              تم تحديد {selectedComplaints.length} شكوى
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  bulkUpdateMutation.mutate({
                    ids: selectedComplaints,
                    status: 'UNDER_REVIEW',
                  })
                }
              >
                نقل للمراجعة
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  bulkUpdateMutation.mutate({
                    ids: selectedComplaints,
                    status: 'CLOSED',
                  })
                }
              >
                إغلاق
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-right">
                <Checkbox
                  checked={selectedComplaints.length === data?.complaints?.length}
                  onChange={(e) =>
                    setSelectedComplaints(
                      e.target.checked
                        ? data?.complaints.map((c: any) => c.id)
                        : []
                    )
                  }
                />
              </th>
              <th className="p-4 text-right text-sm font-medium text-gray-600">
                رقم التتبع
              </th>
              <th className="p-4 text-right text-sm font-medium text-gray-600">
                العنوان
              </th>
              <th className="p-4 text-right text-sm font-medium text-gray-600">
                مقدم الشكوى
              </th>
              <th className="p-4 text-right text-sm font-medium text-gray-600">
                التصنيف
              </th>
              <th className="p-4 text-right text-sm font-medium text-gray-600">
                الحالة
              </th>
              <th className="p-4 text-right text-sm font-medium text-gray-600">
                الأولوية
              </th>
              <th className="p-4 text-right text-sm font-medium text-gray-600">
                التاريخ
              </th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {data?.complaints?.map((complaint: any, index: number) => (
              <motion.tr
                key={complaint.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4">
                  <Checkbox
                    checked={selectedComplaints.includes(complaint.id)}
                    onChange={(e) =>
                      setSelectedComplaints(
                        e.target.checked
                          ? [...selectedComplaints, complaint.id]
                          : selectedComplaints.filter((id) => id !== complaint.id)
                      )
                    }
                  />
                </td>
                <td className="p-4">
                  <span className="font-mono text-sm font-medium text-primary">
                    {complaint.trackingNumber}
                  </span>
                </td>
                <td className="p-4">
                  <p className="font-medium text-gray-900 line-clamp-1">
                    {complaint.title}
                  </p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                      {complaint.user?.name?.charAt(0)}
                    </div>
                    <span className="text-sm">{complaint.user?.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <CategoryBadge category={complaint.category} />
                </td>
                <td className="p-4">
                  <StatusBadge status={complaint.status} />
                </td>
                <td className="p-4">
                  <PriorityBadge priority={complaint.priority} />
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {formatDate(complaint.createdAt)}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <Link href={`/complaints/${complaint.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownTrigger>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownContent>
                        <DropdownItem>تحديث الحالة</DropdownItem>
                        <DropdownItem>إرسال إشعار</DropdownItem>
                        <DropdownItem className="text-red-500">حذف</DropdownItem>
                      </DropdownContent>
                    </DropdownMenu>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-500">
            عرض {data?.complaints?.length || 0} من {data?.total || 0} شكوى
          </p>
          <Pagination
            currentPage={page}
            totalPages={data?.totalPages || 1}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
```

#### 5.4 صفحة تفاصيل الشكوى

```tsx
// apps/admin/app/complaints/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';

export default function ComplaintDetailsPage({ params }: { params: { id: string } }) {
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [responseText, setResponseText] = useState('');

  const { data: complaint, isLoading } = useQuery({
    queryKey: ['complaint', params.id],
    queryFn: () =>
      fetch(`/api/admin/complaints/${params.id}`).then((r) => r.json()),
  });

  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: (data: { status: string; note: string }) =>
      fetch(`/api/admin/complaints/${params.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaint', params.id] });
      setNewStatus('');
      setStatusNote('');
    },
  });

  const addResponseMutation = useMutation({
    mutationFn: (message: string) =>
      fetch(`/api/admin/complaints/${params.id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, isOfficial: true }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaint', params.id] });
      setResponseText('');
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowRight className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              {complaint.trackingNumber}
            </h1>
            <StatusBadge status={complaint.status} />
          </div>
          <p className="text-gray-500 mt-1 mr-10">{complaint.title}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="w-4 h-4 ml-2" />
            طباعة
          </Button>
          <DropdownMenu>
            <DropdownTrigger>
              <Button variant="outline">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownTrigger>
            <DropdownContent>
              <DropdownItem>تحويل لموظف آخر</DropdownItem>
              <DropdownItem>إضافة للمتابعة</DropdownItem>
              <DropdownItem className="text-red-500">حذف الشكوى</DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              تفاصيل الشكوى
            </h2>
            
            <div className="prose prose-gray max-w-none">
              <p>{complaint.description}</p>
            </div>

            {/* Attachments */}
            {complaint.attachments?.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-gray-900 mb-3">المرفقات</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {complaint.attachments.map((attachment: any) => (
                    <AttachmentCard key={attachment.id} attachment={attachment} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              تاريخ الشكوى
            </h2>
            <ComplaintTimeline history={complaint.statusHistory} />
          </div>

          {/* Responses */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              الردود والتواصل
            </h2>
            
            <div className="space-y-4">
              {complaint.responses?.map((response: any) => (
                <ResponseCard key={response.id} response={response} />
              ))}
            </div>

            {/* Add Response Form */}
            <div className="mt-6 pt-6 border-t">
              <Textarea
                placeholder="اكتب ردك هنا..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end mt-3">
                <Button
                  onClick={() => addResponseMutation.mutate(responseText)}
                  isLoading={addResponseMutation.isPending}
                  disabled={!responseText.trim()}
                >
                  إرسال الرد
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">تحديث الحالة</h3>
            
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              options={[
                { value: '', label: 'اختر الحالة الجديدة' },
                { value: 'RECEIVED', label: 'تم الاستلام' },
                { value: 'UNDER_REVIEW', label: 'قيد المراجعة' },
                { value: 'IN_PROGRESS', label: 'جاري العمل' },
                { value: 'AWAITING_INFO', label: 'في انتظار معلومات' },
                { value: 'RESOLVED', label: 'تم الحل' },
                { value: 'CLOSED', label: 'مغلقة' },
                { value: 'REJECTED', label: 'مرفوضة' },
              ]}
            />
            
            <Textarea
              className="mt-3"
              placeholder="ملاحظة التحديث (اختياري)"
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              rows={3}
            />
            
            <Button
              className="w-full mt-3"
              onClick={() =>
                updateStatusMutation.mutate({ status: newStatus, note: statusNote })
              }
              isLoading={updateStatusMutation.isPending}
              disabled={!newStatus}
            >
              تحديث الحالة
            </Button>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">معلومات مقدم الشكوى</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {complaint.user?.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{complaint.user?.name}</p>
                  <p className="text-sm text-gray-500">{complaint.user?.phone}</p>
                </div>
              </div>

              {complaint.user?.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{complaint.user?.email}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{complaint.governorate} - {complaint.city}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Phone className="w-4 h-4 ml-1" />
                اتصال
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageCircle className="w-4 h-4 ml-1" />
                واتساب
              </Button>
            </div>
          </div>

          {/* Complaint Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">معلومات الشكوى</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">التصنيف</span>
                <CategoryBadge category={complaint.category} />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">الأولوية</span>
                <PriorityBadge priority={complaint.priority} />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">تاريخ التقديم</span>
                <span>{formatDate(complaint.createdAt)}</span>
              </div>
              {complaint.resolvedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">تاريخ الحل</span>
                  <span>{formatDate(complaint.resolvedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          {complaint.rating && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">تقييم المواطن</h3>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'w-6 h-6',
                      star <= complaint.rating.score
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200'
                    )}
                  />
                ))}
              </div>
              {complaint.rating.feedback && (
                <p className="text-sm text-gray-600 mt-2">
                  "{complaint.rating.feedback}"
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

#### 5.5 إدارة المحتوى (الأخبار)

```tsx
// apps/admin/app/content/news/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

export default function NewsManagementPage() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);

  const { data } = useQuery({
    queryKey: ['admin-news'],
    queryFn: () => fetch('/api/admin/news').then((r) => r.json()),
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/news/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      fetch(`/api/admin/news/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">إدارة الأخبار</h1>
        <Button onClick={() => setIsEditorOpen(true)}>
          <Plus className="w-4 h-4 ml-2" />
          خبر جديد
        </Button>
      </div>

      {/* News Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.news?.map((item: any, index: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Image */}
            <div className="relative h-48">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  item.published
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                )}>
                  {item.published ? 'منشور' : 'مسودة'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {item.excerpt}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {formatDate(item.createdAt)}
              </p>
            </div>

            {/* Actions */}
            <div className="p-4 pt-0 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => togglePublishMutation.mutate({
                  id: item.id,
                  published: !item.published,
                })}
              >
                {item.published ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingNews(item);
                  setIsEditorOpen(true);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500"
                onClick={() => {
                  if (confirm('هل أنت متأكد من الحذف؟')) {
                    deleteMutation.mutate(item.id);
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* News Editor Modal */}
      <NewsEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingNews(null);
        }}
        news={editingNews}
      />
    </div>
  );
}
```

---

## 📦 المخرجات المتوقعة

بنهاية المرحلة الخامسة:

```
✅ لوحة تحكم بإحصائيات شاملة
✅ Charts تفاعلية (Recharts)
✅ إدارة الشكاوى (قائمة + تفاصيل)
✅ تحديث حالات الشكاوى
✅ Bulk actions
✅ إدارة المحتوى (CRUD)
✅ نظام الصلاحيات
✅ تصدير البيانات (Excel)
```

---

## ✅ Checklist

### الأسبوع 9
- [ ] Dashboard layout
- [ ] Sidebar navigation
- [ ] Stats cards
- [ ] Charts components
- [ ] Recent activity widgets

### الأسبوع 10
- [ ] Complaints list page
- [ ] Complaint details page
- [ ] Status update flow
- [ ] Responses system
- [ ] Content management (News)
- [ ] Export functionality

---

**المرحلة السابقة**: [المرحلة الرابعة - نظام الإشعارات](./PHASE_4_NOTIFICATIONS.md)

**المرحلة التالية**: [المرحلة السادسة - الاختبار والإطلاق](./PHASE_6_OPTIMIZATION.md)
