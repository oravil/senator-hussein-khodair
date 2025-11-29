import React from 'react';
import Layout from '../components/Layout';
import { Star, Award, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <Layout>
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
              السيرة الذاتية
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-amber-500 to-blue-500 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-amber-400 mb-4">المنصب الحالي</h3>
                  <p className="text-blue-100 leading-relaxed text-lg">
                    عضو مجلس الشيوخ المصري ووكيل لجنة الصحة والسكان، حيث يساهم في صياغة السياسات الصحية وتطوير القطاع الصحي في مصر
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-amber-400 mb-4">المؤهلات العلمية</h3>
                  <ul className="text-blue-100 leading-relaxed text-lg space-y-2">
                    <li>• دكتوراه في الطب والصحة العامة</li>
                    <li>• خبرة تزيد عن 25 عاماً في القطاع الصحي</li>
                    <li>• عضوية في العديد من الجمعيات الطبية الدولية</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-amber-400 mb-4">الإنجازات والمبادرات</h3>
                  <ul className="text-blue-100 leading-relaxed text-lg space-y-2">
                    <li>• إطلاق أكثر من 30 مبادرة صحية مجتمعية</li>
                    <li>• المساهمة في تطوير 50+ مشروع صحي على مستوى الجمهورية</li>
                    <li>• خدمة أكثر من 100,000 مواطن من خلال المبادرات المختلفة</li>
                    <li>• المشاركة في إصدار أكثر من 200 قرار برلماني لتحسين الخدمات الصحية</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
