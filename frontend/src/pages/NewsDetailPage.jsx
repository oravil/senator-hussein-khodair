import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsAPI } from '../services/api';
import { Calendar, ArrowRight } from 'lucide-react';

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      const response = await newsAPI.getById(id);
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="pt-32 pb-20 px-6 text-center text-blue-200">جاري التحميل...</div>
    );
  }

  if (!news) {
    return (
        <div className="pt-32 pb-20 px-6 text-center text-blue-200">الخبر غير موجود</div>
    );
  }

  return (
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <button
            onClick={() => navigate('/news')}
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-8"
          >
            <ArrowRight className="w-5 h-5" /> العودة إلى الأخبار
          </button>

          <div className="bg-white/5 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/10">
            {news.image && (
              <img src={news.image} alt={news.title} className="w-full h-96 object-cover" />
            )}
            
            <div className="p-8">
              <div className="flex items-center gap-2 text-amber-400 mb-4">
                <Calendar className="w-5 h-5" />
                <span>{new Date(news.date).toLocaleDateString('ar-EG')}</span>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-6">{news.title}</h1>
              
              <div className="text-blue-100 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: news.content || news.description }} />
            </div>
          </div>
        </div>
      </section>
  );
}
