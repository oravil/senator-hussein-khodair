import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { newsAPI } from '../services/api';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    date: new Date().toISOString().split('T')[0],
    published: true
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await newsAPI.getAll();
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNews) {
        await newsAPI.update(editingNews._id, formData);
      } else {
        await newsAPI.create(formData);
      }
      fetchNews();
      resetForm();
    } catch (error) {
      console.error('Error saving news:', error);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const handleEdit = (item) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      content: item.content,
      image: item.image,
      date: new Date(item.date).toISOString().split('T')[0],
      published: item.published
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;
    
    try {
      await newsAPI.delete(id);
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      image: '',
      date: new Date().toISOString().split('T')[0],
      published: true
    });
    setEditingNews(null);
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-amber-400 mb-2">إدارة الأخبار</h1>
            <p className="text-slate-400">إضافة وتعديل الأخبار والفعاليات</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            خبر جديد
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6">
              {editingNews ? 'تعديل الخبر' : 'خبر جديد'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">العنوان</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-amber-500 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">المحتوى</label>
                <textarea
                  required
                  rows="5"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-amber-500 text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">رابط الصورة</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-amber-500 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-2">التاريخ</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-amber-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-2">الحالة</label>
                  <select
                    value={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.value === 'true' })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-amber-500 text-white"
                  >
                    <option value="true">منشور</option>
                    <option value="false">مسودة</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-lg transition"
                >
                  {editingNews ? 'تحديث' : 'نشر'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* News List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-slate-400">جاري التحميل...</div>
          ) : news.length === 0 ? (
            <div className="text-center text-slate-400">لا توجد أخبار</div>
          ) : (
            news.map((item) => (
              <div key={item._id} className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-amber-500/50 transition">
                <div className="flex items-start gap-6">
                  <img src={item.image} alt={item.title} className="w-32 h-32 object-cover rounded-lg" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition"
                        >
                          <Edit2 className="w-5 h-5 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-400 mb-3 line-clamp-2">{item.content}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>{new Date(item.date).toLocaleDateString('ar-EG')}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {item.views}
                      </span>
                      <span className={`px-3 py-1 rounded-full ${item.published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600 text-slate-400'}`}>
                        {item.published ? 'منشور' : 'مسودة'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
