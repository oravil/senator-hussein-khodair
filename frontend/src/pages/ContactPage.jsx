import React, { useState } from 'react';
import Layout from '../components/Layout';
import { contactAPI } from '../services/api';
import { Send, Phone, Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    type: 'شكوى', 
    message: '' 
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await contactAPI.submit(formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', phone: '', email: '', type: 'شكوى', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              تواصل معنا
            </h2>
            <p className="text-xl text-blue-200">نحن هنا لخدمتكم والاستماع إلى مقترحاتكم وشكاواكم</p>
            <div className="w-32 h-1 bg-gradient-to-r from-amber-500 to-blue-500 mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <h3 className="text-3xl font-bold mb-6 text-amber-400">إرسال شكوى أو طلب</h3>
              
              {submitted ? (
                <div className="bg-emerald-500/20 border border-emerald-500 rounded-2xl p-8 text-center">
                  <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-emerald-400 mb-2">تم الإرسال بنجاح!</h4>
                  <p className="text-blue-200">سيتم التواصل معكم في أقرب وقت ممكن</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-blue-200 mb-2 font-bold">الاسم الكامل</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-amber-500 transition text-white placeholder-blue-300"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-blue-200 mb-2 font-bold">رقم الهاتف</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-amber-500 transition text-white placeholder-blue-300"
                        placeholder="01xxxxxxxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-blue-200 mb-2 font-bold">البريد الإلكتروني</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-amber-500 transition text-white placeholder-blue-300"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-blue-200 mb-2 font-bold">نوع الطلب</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-amber-500 transition text-white"
                    >
                      <option value="شكوى" className="bg-slate-800">شكوى</option>
                      <option value="استفسار" className="bg-slate-800">استفسار</option>
                      <option value="اقتراح" className="bg-slate-800">اقتراح</option>
                      <option value="طلب مساعدة" className="bg-slate-800">طلب مساعدة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-blue-200 mb-2 font-bold">التفاصيل</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows="5"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-amber-500 transition text-white placeholder-blue-300 resize-none"
                      placeholder="اكتب تفاصيل طلبك هنا..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl font-bold shadow-xl shadow-amber-500/50 transform hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'جاري الإرسال...' : 'إرسال الطلب'} <Send className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-amber-400 mb-2">الهاتف</h4>
                    <p className="text-blue-100 text-lg">+20 123 456 7890</p>
                    <p className="text-blue-200 text-sm">متاح من 9 صباحاً حتى 5 مساءً</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-amber-400 mb-2">البريد الإلكتروني</h4>
                    <p className="text-blue-100 text-lg">info@hkhodair.gov.eg</p>
                    <p className="text-blue-200 text-sm">نرد خلال 24 ساعة</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-amber-400 mb-2">المكتب</h4>
                    <p className="text-blue-100 text-lg">مجلس الشيوخ المصري</p>
                    <p className="text-blue-200">القاهرة، جمهورية مصر العربية</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500/20 to-blue-500/20 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                <h4 className="text-2xl font-bold text-amber-400 mb-4">ساعات العمل</h4>
                <div className="space-y-3 text-blue-100">
                  <div className="flex justify-between">
                    <span>الأحد - الخميس</span>
                    <span className="font-bold">9:00 ص - 5:00 م</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الجمعة - السبت</span>
                    <span className="font-bold text-red-400">إجازة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
