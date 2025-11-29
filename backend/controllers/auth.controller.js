import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: { message: 'اسم المستخدم أو كلمة المرور غير صحيحة' } });
    }
    
    // Check if user is active
    if (!user.active) {
      return res.status(401).json({ error: { message: 'هذا الحساب غير مفعل' } });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: { message: 'اسم المستخدم أو كلمة المرور غير صحيحة' } });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -__v');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: { message: error.message } });
  }
};

// Create user (Admin only)
export const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    const user = new User({
      username,
      email,
      password,
      role: role || 'moderator'
    });
    
    await user.save();
    
    res.status(201).json({
      message: 'تم إنشاء المستخدم بنجاح',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
};
