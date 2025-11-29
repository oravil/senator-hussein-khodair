import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ScrollReveal from '../ui/ScrollReveal';
import Card from '../ui/Card';
import Button from '../ui/Button';

const sampleNews = [
  {
    id: 1,
    title: 'مشاركة الدكتور حسين خضير في مؤتمر الصحة العربي',
    excerpt: 'شارك الدكتور حسين خضير في فعاليات مؤتمر الصحة العربي السنوي لمناقشة تطوير المنظومة الصحية...',
    date: '2024-01-15',
    category: 'مؤتمرات',
    image: null,
  },
  {
    id: 2,
    title: 'اجتماع لجنة الصحة بمجلس الشيوخ لمناقشة قانون التأمين الصحي',
    excerpt: 'عقدت لجنة الصحة بمجلس الشيوخ اجتماعها الدوري لمناقشة تعديلات قانون التأمين الصحي الشامل...',
    date: '2024-01-10',
    category: 'أخبار',
    image: null,
  },
  {
    id: 3,
    title: 'زيارة ميدانية لمستشفى الصدر بالعباسية',
    excerpt: 'قام الدكتور حسين خضير بزيارة ميدانية لمستشفى الصدر بالعباسية للاطلاع على مستوى الخدمات...',
    date: '2024-01-05',
    category: 'زيارات',
    image: null,
  },
];

const NewsSection = () => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-secondary-600 font-medium mb-2 block">آخر المستجدات</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              الأخبار والفعاليات
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              تابع آخر أخبار وفعاليات الدكتور حسين خضير ونشاطاته في مجلس الشيوخ
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleNews.map((news, index) => (
            <ScrollReveal key={news.id} delay={index * 0.1}>
              <Card className="h-full flex flex-col">
                {/* Image placeholder */}
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <span className="text-primary-400 text-4xl">📰</span>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-primary-100 text-primary-700 text-xs font-medium px-3 py-1 rounded-full">
                      {news.category}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {formatDate(news.date)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {news.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {news.excerpt}
                  </p>
                  
                  <Link 
                    to={`/news/${news.id}`}
                    className="text-primary-600 font-medium text-sm hover:text-primary-700 transition-colors inline-flex items-center gap-1 group"
                  >
                    اقرأ المزيد
                    <motion.span
                      className="inline-block"
                      whileHover={{ x: -5 }}
                    >
                      ←
                    </motion.span>
                  </Link>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center mt-12">
            <Link to="/news">
              <Button variant="outline">
                عرض جميع الأخبار
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default NewsSection;
