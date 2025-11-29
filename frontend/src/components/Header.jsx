import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'الرئيسية' },
    { path: '/about', label: 'السيرة الذاتية' },
    { path: '/news', label: 'الأخبار' },
    { path: '/contact', label: 'التواصل' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 backdrop-blur-lg shadow-2xl' : 'bg-gradient-to-r from-blue-900/80 via-slate-900/70 to-blue-900/80'}`}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full flex items-center justify-center shadow-xl p-1">
              <img 
                src="./images/senate-logo.jpg"
                alt="شعار مجلس الشيوخ المصري" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">د. حسين خضير</h1>
              <p className="text-sm text-amber-200">عضو مجلس الشيوخ - وكيل لجنة الصحة</p>
            </div>
          </Link>
          
          <div className="hidden md:flex gap-8">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/50' 
                    : 'hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden z-50 p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="القائمة"
          >
            {isMenuOpen ? <X className="w-7 h-7 text-white" /> : <Menu className="w-7 h-7 text-white" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 bg-slate-800/95 rounded-lg p-4">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-right px-4 py-3 rounded-lg hover:bg-amber-500 transition"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
