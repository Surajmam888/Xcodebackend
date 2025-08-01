import express from 'express';
import { register, login, verifyEmail, refresh } from '../controllers/auth.controller.js';
import { check } from 'express-validator';
import { validate } from '../middleware/validate.middleware.js';

const router = express.Router();

router.post('/register', [
  check('name').notEmpty(),
  check('email').isEmail(),
  check('password').isLength({ min: 6 }),
], validate, register);

router.post('/login', [
  check('email').isEmail(),
  check('password').exists(),
], validate, login);

router.get('/verify-email', verifyEmail);
router.post('/refresh-token', refresh);

export default router;
