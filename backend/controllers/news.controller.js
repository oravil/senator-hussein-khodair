import News from '../models/News.model.js';

// Get all news
export const getAllNews = async (req, res) => {
  try {
    const { published } = req.query;
    const query = published !== undefined ? { published: published === 'true' } : {};
    
    const news = await News.find(query)
      .sort({ date: -1 })
      .select('-__v');
    
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

// Get single news by ID
export const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    
    if (!news) {
      return res.status(404).json({ error: { message: 'الخبر غير موجود' } });
    }
    
    // Increment views
    news.views += 1;
    await news.save();
    
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

// Create news (Admin only)
export const createNews = async (req, res) => {
  try {
    const { title, content, image, date, published } = req.body;
    
    const news = new News({
      title,
      content,
      image,
      date: date || Date.now(),
      published: published !== undefined ? published : true
    });
    
    await news.save();
    res.status(201).json(news);
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
};

// Update news (Admin only)
export const updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!news) {
      return res.status(404).json({ error: { message: 'الخبر غير موجود' } });
    }
    
    res.json(news);
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
};

// Delete news (Admin only)
export const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    
    if (!news) {
      return res.status(404).json({ error: { message: 'الخبر غير موجود' } });
    }
    
    res.json({ message: 'تم حذف الخبر بنجاح' });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};
