import express from 'express';
import {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact
} from '../controllers/contact.controller.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route
router.post('/', submitContact);

// Protected routes (Admin/Moderator)
router.get('/', auth, getAllContacts);
router.get('/:id', auth, getContactById);
router.patch('/:id/status', auth, updateContactStatus);
router.delete('/:id', auth, deleteContact);

export default router;
