import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import NewsCard from '../components/NewsCard';
import { newsAPI } from '../services/api';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await newsAPI.getAll();
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
      // Fallback to demo data
      setNews([
        { id: 1, title: 'افتتاح مستشفى جديد في محافظة القاهرة', date: '2025-11-20', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800' },
        { id: 2, title: 'مؤتمر تطوير القطاع الصحي 2025', date: '2025-11-15', image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800' },
        { id: 3, title: 'زيارة تفقدية لمراكز الرعاية الصحية', date: '2025-11-10', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              آخر الأخبار والفعاليات
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-amber-500 to-blue-500 mx-auto rounded-full"></div>
          </div>

          {loading ? (
            <div className="text-center text-blue-200">جاري التحميل...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {news.map(item => (
                <NewsCard key={item._id || item.id} news={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
