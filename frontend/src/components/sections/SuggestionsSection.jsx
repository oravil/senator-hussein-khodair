import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../ui/ScrollReveal';
import Button from '../ui/Button';

const SuggestionsSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: '',
    suggestion: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { value: 'health', label: '🏥 الصحة والدواء' },
    { value: 'services', label: '🏛️ الخدمات الحكومية' },
    { value: 'education', label: '📚 التعليم' },
    { value: 'infrastructure', label: '🏗️ البنية التحتية' },
    { value: 'other', label: '💡 أخرى' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', category: '', suggestion: '' });
    }, 5000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-slate-900 to-blue-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <ScrollReveal direction="right">
            <div className="text-right">
              <span className="inline-block bg-secondary-500/20 text-secondary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                صوتك مسموع
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                شاركنا مقترحاتك
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                نؤمن بأن أفضل الأفكار تأتي من المواطنين أنفسهم. 
                شاركنا مقترحاتك وأفكارك لتطوير الخدمات الصحية 
                وتحسين حياة المواطن المصري.
              </p>
              
              <div className="space-y-4">
                {[
                  'يتم مراجعة جميع المقترحات بعناية',
                  'نرد على المقترحات المميزة',
                  'نسعى لتحويل الأفكار إلى واقع',
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <span className="w-6 h-6 rounded-full bg-secondary-500/20 flex items-center justify-center text-secondary-400">
                      ✓
                    </span>
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal direction="left">
            <motion.div
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <span className="text-4xl">✓</span>
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      شكراً لك!
                    </h3>
                    <p className="text-gray-300">
                      تم استلام مقترحك بنجاح وسيتم مراجعته
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div>
                      <input
                        type="text"
                        placeholder="الاسم الكريم"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-secondary-500 transition-colors"
                      />
                    </div>

                    <div>
                      <input
                        type="tel"
                        placeholder="رقم الهاتف"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-secondary-500 transition-colors"
                        dir="ltr"
                      />
                    </div>

                    <div>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        required
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="text-gray-900">اختر التصنيف</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value} className="text-gray-900">
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <textarea
                        placeholder="اكتب مقترحك هنا..."
                        value={formData.suggestion}
                        onChange={(e) => setFormData({...formData, suggestion: e.target.value})}
                        required
                        rows={4}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-secondary-500 transition-colors resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="secondary"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          ⏳
                        </motion.span>
                      ) : (
                        'إرسال المقترح'
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default SuggestionsSection;
