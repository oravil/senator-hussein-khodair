import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'رقم الهاتف مطلوب'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    trim: true,
    lowercase: true
  },
  type: {
    type: String,
    enum: ['شكوى', 'استفسار', 'اقتراح', 'طلب مساعدة'],
    required: [true, 'نوع الطلب مطلوب']
  },
  message: {
    type: String,
    required: [true, 'الرسالة مطلوبة']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ type: 1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
