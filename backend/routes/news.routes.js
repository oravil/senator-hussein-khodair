import express from 'express';
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} from '../controllers/news.controller.js';
import { auth, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllNews);
router.get('/:id', getNewsById);

// Protected routes (Admin only)
router.post('/', auth, adminOnly, createNews);
router.put('/:id', auth, adminOnly, updateNews);
router.delete('/:id', auth, adminOnly, deleteNews);

export default router;
