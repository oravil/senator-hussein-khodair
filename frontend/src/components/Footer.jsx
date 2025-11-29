import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Mail } from 'lucide-react';

export default function Footer() {
  const navItems = [
    { path: '/', label: 'الرئيسية' },
    { path: '/about', label: 'السيرة الذاتية' },
    { path: '/news', label: 'الأخبار' },
    { path: '/contact', label: 'التواصل' },
  ];

  return (
    <footer className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 border-t border-white/10 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-amber-400 mb-4">د. حسين خضير</h3>
            <p className="text-blue-200 leading-relaxed">
              نعمل معاً من أجل مستقبل صحي أفضل لجميع المواطنين
            </p>
          </div>
          
          <div>
            <h4 className="text-xl font-bold text-amber-400 mb-4">روابط سريعة</h4>
            <div className="space-y-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block text-blue-200 hover:text-amber-400 transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold text-amber-400 mb-4">تابعنا</h4>
            <p className="text-blue-200 mb-4">للمتابعة والتواصل عبر وسائل التواصل الاجتماعي</p>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber-500 transition cursor-pointer">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-amber-500 transition cursor-pointer">
                <Mail className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-blue-200">
            © 2025 د. حسين خضير - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}
