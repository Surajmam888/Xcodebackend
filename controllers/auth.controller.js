import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { sendVerificationEmail, sendResetEmail } from '../services/mail.service.js';
import { sendVerificationEmail } from '../services/mail.service.js';
import { generateTokens } from '../utils/token.util.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = jwt.sign({ id: user._id }, process.env.JWT_EMAIL_SECRET, { expiresIn: '15m' });
  await sendVerificationEmail(email, token);

  res.status(201).json({ message: 'Registered. Please verify your email.' });
};


export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
    await User.findByIdAndUpdate(decoded.id, { isVerified: true });
    res.status(200).json({ message: 'Email verified successfully' });
  } catch {
    res.status(400).json({ message: 'Invalid or expired verification link' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.isVerified) return res.status(401).json({ message: 'Invalid credentials or unverified email' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const { accessToken, refreshToken } = generateTokens(user);
  res.status(200).json({ accessToken, refreshToken, user });
};

export const refresh = (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};
