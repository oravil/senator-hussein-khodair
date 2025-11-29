import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setToken } from '../utils/auth';
import { Lock, User, LogIn } from 'lucide-react';

export default function LoginPage({ setIsAuthenticated }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(credentials);
      setToken(response.data.token);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">لوحة التحكم</h1>
            <p className="text-blue-200">د. حسين خضير</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-blue-200 mb-2 font-bold">اسم المستخدم</label>
              <div className="relative">
                <User className="absolute right-3 top-3.5 w-5 h-5 text-blue-300" />
                <input
                  type="text"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full pr-12 pl-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-amber-500 transition text-white placeholder-blue-300"
                  placeholder="أدخل اسم المستخدم"
                />
              </div>
            </div>

            <div>
              <label className="block text-blue-200 mb-2 font-bold">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-3.5 w-5 h-5 text-blue-300" />
                <input
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full pr-12 pl-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-amber-500 transition text-white placeholder-blue-300"
                  placeholder="أدخل كلمة المرور"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl font-bold shadow-xl shadow-amber-500/50 transform hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-white"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'} <LogIn className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
