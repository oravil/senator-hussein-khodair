import { motion } from 'framer-motion';
import ScrollReveal from '../ui/ScrollReveal';
import AnimatedCounter from '../ui/AnimatedCounter';

const stats = [
  { 
    number: 15, 
    suffix: '+', 
    label: 'سنة خبرة', 
    icon: '📅',
    description: 'في مجال الصحة والأدوية'
  },
  { 
    number: 50, 
    suffix: '+', 
    label: 'مشروع قانون', 
    icon: '📜',
    description: 'تم المشاركة في إعداده'
  },
  { 
    number: 1000, 
    suffix: '+', 
    label: 'مواطن', 
    icon: '👥',
    description: 'تم خدمتهم ومساعدتهم'
  },
  { 
    number: 100, 
    suffix: '+', 
    label: 'فعالية', 
    icon: '🎯',
    description: 'مؤتمرات وندوات'
  },
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      
      <div className="container mx-auto px-4 relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-secondary-600 font-medium mb-2 block">إنجازاتنا</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              أرقام تتحدث عن نفسها
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نفتخر بما حققناه من إنجازات في خدمة المواطن المصري وتطوير المنظومة الصحية
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center group"
              >
                <motion.span 
                  className="text-4xl block mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {stat.icon}
                </motion.span>
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {stat.label}
                </h3>
                <p className="text-sm text-gray-500">
                  {stat.description}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
