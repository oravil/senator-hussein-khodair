import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { contactAPI } from '../services/api';
import { MessageSquare, Phone, Mail, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, [filter]);

  const fetchContacts = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await contactAPI.getAll(params);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status, notes = '') => {
    try {
      await contactAPI.updateStatus(id, { status, notes });
      fetchContacts();
      setSelectedContact(null);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('حدث خطأ أثناء التحديث');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    
    try {
      await contactAPI.delete(id);
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const statusOptions = [
    { value: 'all', label: 'الكل', color: 'bg-slate-500' },
    { value: 'pending', label: 'جديد', color: 'bg-amber-500' },
    { value: 'in-progress', label: 'قيد المعالجة', color: 'bg-blue-500' },
    { value: 'resolved', label: 'تم الحل', color: 'bg-emerald-500' },
    { value: 'closed', label: 'مغلق', color: 'bg-slate-600' },
  ];

  const getStatusLabel = (status) => {
    return statusOptions.find(s => s.value === status)?.label || status;
  };

  const getStatusColor = (status) => {
    return statusOptions.find(s => s.value === status)?.color || 'bg-slate-500';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-amber-400 mb-2">إدارة الرسائل</h1>
          <p className="text-slate-400">متابعة ومعالجة رسائل المواطنين</p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2">
          {statusOptions.map((status) => (
            <button
              key={status.value}
              onClick={() => setFilter(status.value)}
              className={`px-6 py-3 rounded-lg transition whitespace-nowrap ${
                filter === status.value
                  ? `${status.color} text-white`
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* Contacts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-slate-400">جاري التحميل...</div>
          ) : contacts.length === 0 ? (
            <div className="text-center text-slate-400">لا توجد رسائل</div>
          ) : (
            contacts.map((contact) => (
              <div key={contact._id} className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-amber-500/50 transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{contact.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {contact.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm ${getStatusColor(contact.status)} text-white`}>
                      {getStatusLabel(contact.status)}
                    </span>
                    <span className={`px-4 py-2 rounded-full text-sm ${
                      contact.type === 'شكوى' ? 'bg-red-500/20 text-red-400' :
                      contact.type === 'استفسار' ? 'bg-blue-500/20 text-blue-400' :
                      contact.type === 'اقتراح' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {contact.type}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 mb-4 bg-slate-900/50 p-4 rounded-lg">{contact.message}</p>

                {contact.notes && (
                  <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="text-sm text-blue-400 font-bold mb-1">ملاحظات:</div>
                    <div className="text-slate-300">{contact.notes}</div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-4 h-4" />
                    {new Date(contact.createdAt).toLocaleString('ar-EG')}
                  </div>

                  <div className="flex gap-2">
                    {contact.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(contact._id, 'in-progress')}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition text-blue-400"
                      >
                        قيد المعالجة
                      </button>
                    )}
                    {contact.status === 'in-progress' && (
                      <button
                        onClick={() => {
                          const notes = prompt('أضف ملاحظات (اختياري):');
                          handleStatusUpdate(contact._id, 'resolved', notes || '');
                        }}
                        className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg transition text-emerald-400"
                      >
                        تم الحل
                      </button>
                    )}
                    {contact.status !== 'closed' && (
                      <button
                        onClick={() => handleStatusUpdate(contact._id, 'closed')}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition text-white"
                      >
                        إغلاق
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition text-red-400"
                    >
                      حذف
                    </button>
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
