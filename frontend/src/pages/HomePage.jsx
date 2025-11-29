import HeroSection from '../components/sections/HeroSection';
import StatsSection from '../components/sections/StatsSection';
import NewsSection from '../components/sections/NewsSection';
import SuggestionsSection from '../components/sections/SuggestionsSection';
import ScrollReveal from '../components/ui/ScrollReveal';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* About Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="right">
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-amber-100 to-amber-50 rounded-3xl overflow-hidden shadow-2xl border-4 border-primary-200">
                  <img 
                    src="./images/dr-hussein-khodair-office.jpg"
                    alt="الدكتور حسين خضير في مجلس الشيوخ" 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-secondary-500 text-white px-4 py-2 rounded-xl shadow-lg"
                >
                  🏆 +15 سنة خبرة
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute -bottom-4 -left-4 bg-primary-600 text-white px-4 py-2 rounded-xl shadow-lg"
                >
                  ⚕️ رئيس نابكو للأدوية
                </motion.div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left">
              <div>
                <h3 className="text-sm font-semibold text-primary-600 mb-2">عن الدكتور حسين خضير</h3>
                <h2 className="text-4xl font-bold mb-6 text-gray-900">
                  رحلة من العطاء والخدمة العامة
                </h2>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  بخبرة تمتد لأكثر من 15 عاماً في المجال الصحي والتشريعي، أعمل على تطوير السياسات الصحية 
                  وتحسين جودة الخدمات الطبية المقدمة للمواطنين.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      ✓
                    </div>
                    عضو مجلس الشيوخ المصري
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      ✓
                    </div>
                    وكيل لجنة الصحة والسكان
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      ✓
                    </div>
                    رئيس مجلس إدارة شركة نابكو للأدوية
                  </li>
                </ul>
                <Link to="/about">
                  <Button variant="outline" size="lg">
                    اقرأ المزيد عن رحلتي
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* News Section */}
      <NewsSection />

      {/* Suggestions Section */}
      <SuggestionsSection />

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">معاً نبني مستقبلاً صحياً أفضل</h2>
              <p className="text-xl mb-8 text-primary-100">
                صوتك يهمنا. شاركنا أفكارك واقتراحاتك لتطوير الخدمات الصحية في مصر
              </p>
              <Link to="/contact">
                <Button variant="secondary" size="lg">
                  شارك برأيك الآن
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
