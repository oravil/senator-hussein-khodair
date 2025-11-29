import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'العنوان مطلوب'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'المحتوى مطلوب']
  },
  image: {
    type: String,
    required: [true, 'الصورة مطلوبة']
  },
  date: {
    type: Date,
    default: Date.now
  },
  published: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
newsSchema.index({ date: -1 });
newsSchema.index({ published: 1 });

const News = mongoose.model('News', newsSchema);

export default News;
