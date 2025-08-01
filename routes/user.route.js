import express from 'express';
import {
  getProfile,
  updateProfile,
  getAllUsers,
  updateUserStatus, // new controller
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRole } from '../middleware/role.middleware.js';

const router = express.Router();

// Authenticated user routes
router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, updateProfile);

// Admin-only routes
router.get('/', authenticate, authorizeRole(['admin']), getAllUsers);
router.patch('/:id/status', authenticate, authorizeRole(['admin']), updateUserStatus); // moved here

export default router;
