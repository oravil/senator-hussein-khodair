import express from 'express';
import { login, getMe, createUser } from '../controllers/auth.controller.js';
import { auth, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', auth, getMe);
router.post('/users', auth, adminOnly, createUser);

export default router;
