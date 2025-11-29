import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';

export default function NewsCard({ news }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/10 hover:bg-white/10 transition-all group hover:scale-105">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={news.image} 
          alt={news.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-amber-400 mb-3">
          <Calendar className="w-5 h-5" />
          <span className="text-sm">{new Date(news.date).toLocaleDateString('ar-EG')}</span>
        </div>
        <h3 className="text-xl font-bold mb-4 text-white group-hover:text-amber-400 transition">
          {news.title}
        </h3>
        <Link 
          to={`/news/${news._id || news.id}`}
          className="flex items-center gap-2 text-amber-400 hover:gap-4 transition-all"
        >
          اقرأ المزيد <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
