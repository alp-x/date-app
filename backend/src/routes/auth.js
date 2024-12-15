import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Token doğrulama
router.get('/verify', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Çıkış yap
router.post('/logout', authenticate, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Kayıt ol
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, age, gender } = req.body;

    const user = await User.create({
      email,
      password,
      name,
      age,
      gender
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Şifreyi response'dan çıkar
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    next(error);
  }
});

// Giriş yap
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    const isValidPassword = await user.checkPassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Şifreyi response'dan çıkar
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    next(error);
  }
});

// Şifremi unuttum
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'No user found with this email'
      });
    }

    // Burada şifre sıfırlama e-postası gönderme işlemi yapılacak
    // Şimdilik mock bir yanıt dönelim
    res.json({
      message: 'Password reset instructions sent to your email'
    });
  } catch (error) {
    next(error);
  }
});

export default router; 