import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import AchievementCard from '../components/AchievementCard';
import { Send, Users, Award, FileText, Heart } from 'lucide-react';

export default function HomePage() {
  const achievements = [
    { icon: <Award className="w-8 h-8" />, number: '50+', label: 'مشروع صحي' },
    { icon: <Users className="w-8 h-8" />, number: '100K+', label: 'مستفيد' },
    { icon: <FileText className="w-8 h-8" />, number: '200+', label: 'قرار برلماني' },
    { icon: <Heart className="w-8 h-8" />, number: '30+', label: 'مبادرة صحية' }
  ];

  return (
    <Layout>
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block">
                <span className="px-4 py-2 bg-amber-500/20 border border-amber-500 rounded-full text-amber-300 text-sm">
                  خدمة الوطن والمواطن
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
                  د. حسين خضير
                </span>
              </h1>
              <p className="text-xl text-blue-200 leading-relaxed">
                عضو مجلس الشيوخ المصري ووكيل لجنة الصحة والسكان، نعمل معاً من أجل مستقبل صحي أفضل لجميع المواطنين
              </p>
              <div className="flex gap-4">
                <Link 
                  to="/contact"
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-full font-bold shadow-xl shadow-amber-500/50 transform hover:scale-105 transition-all flex items-center gap-2"
                >
                  تواصل معنا <Send className="w-5 h-5" />
                </Link>
                <Link 
                  to="/about"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-bold backdrop-blur-sm border border-white/20 transform hover:scale-105 transition-all"
                >
                  اعرف المزيد
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-amber-500/20 to-blue-500/20 rounded-3xl backdrop-blur-lg border border-white/10 shadow-2xl flex items-center justify-center">
                <Users className="w-48 h-48 text-amber-400/30" />
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            </div>
          </div>

          {/* Achievements */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {achievements.map((item, idx) => (
              <AchievementCard key={idx} {...item} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
