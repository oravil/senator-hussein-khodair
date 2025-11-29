import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { statsAPI } from '../services/api';
import { Newspaper, MessageSquare, Eye, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statsAPI.get();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Layout><div className="text-center">جاري التحميل...</div></Layout>;
  }

  const statCards = [
    { icon: <Newspaper className="w-8 h-8" />, label: 'إجمالي الأخبار', value: stats?.news?.total || 0, color: 'bg-blue-500' },
    { icon: <MessageSquare className="w-8 h-8" />, label: 'الرسائل الجديدة', value: stats?.contacts?.pending || 0, color: 'bg-amber-500' },
    { icon: <Eye className="w-8 h-8" />, label: 'مشاهدات الأخبار', value: stats?.news?.views || 0, color: 'bg-emerald-500' },
    { icon: <TrendingUp className="w-8 h-8" />, label: 'الرسائل المعالجة', value: stats?.contacts?.resolved || 0, color: 'bg-purple-500' },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-amber-400 mb-2">الرئيسية</h1>
          <p className="text-slate-400">نظرة عامة على الإحصائيات</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => (
            <div key={idx} className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-amber-500/50 transition">
              <div className={`w-16 h-16 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                {card.icon}
              </div>
              <div className="text-3xl font-bold text-white mb-2">{card.value}</div>
              <div className="text-slate-400">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        {stats?.contacts?.byType && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-2xl font-bold text-amber-400 mb-6">توزيع الرسائل حسب النوع</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.contacts.byType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="_id" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  labelStyle={{ color: '#f59e0b' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Contacts */}
        {stats?.contacts?.recent && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-2xl font-bold text-amber-400 mb-6">أحدث الرسائل</h3>
            <div className="space-y-3">
              {stats.contacts.recent.map((contact) => (
                <div key={contact._id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <div className="font-bold text-white">{contact.name}</div>
                    <div className="text-sm text-slate-400">{contact.type}</div>
                  </div>
                  <div className="text-sm">
                    <span className={`px-3 py-1 rounded-full ${
                      contact.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                      contact.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {contact.status === 'pending' ? 'جديد' :
                       contact.status === 'in-progress' ? 'قيد المعالجة' : 'مكتمل'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
