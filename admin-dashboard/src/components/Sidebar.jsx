import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';
import { LayoutDashboard, Newspaper, MessageSquare, LogOut } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
    window.location.reload();
  };

  const menuItems = [
    { path: '/', icon: <LayoutDashboard className="w-5 h-5" />, label: 'الرئيسية' },
    { path: '/news', icon: <Newspaper className="w-5 h-5" />, label: 'الأخبار' },
    { path: '/contacts', icon: <MessageSquare className="w-5 h-5" />, label: 'الرسائل' },
  ];

  return (
    <div className="w-64 bg-slate-800 min-h-screen p-6 border-l border-slate-700">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-amber-400">لوحة التحكم</h2>
        <p className="text-sm text-slate-400">د. حسين خضير</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition text-slate-200 hover:text-amber-400"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition text-slate-200 hover:text-red-400 w-full mt-auto absolute bottom-6"
      >
        <LogOut className="w-5 h-5" />
        <span>تسجيل الخروج</span>
      </button>
    </div>
  );
}
