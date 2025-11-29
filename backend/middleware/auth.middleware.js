import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: { message: 'الرجاء تسجيل الدخول' } });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.active) {
      return res.status(401).json({ error: { message: 'غير مصرح' } });
    }
    
    req.user = { userId: user._id, role: user.role };
    next();
  } catch (error) {
    res.status(401).json({ error: { message: 'الرجاء تسجيل الدخول' } });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: { message: 'غير مصرح - مطلوب صلاحيات المدير' } });
  }
  next();
};
