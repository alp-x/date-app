import express from 'express';
import Payment from '../models/Payment.js';
import User from '../models/User.js';

const router = express.Router();

// Premium üyelik satın al
router.post('/premium', async (req, res, next) => {
  try {
    const { paymentMethod } = req.body;
    const userId = req.user.id;

    // Kullanıcı kontrolü
    const user = await User.findByPk(userId);
    if (user.isPremium) {
      return res.status(400).json({
        error: 'Already Premium',
        message: 'You are already a premium member'
      });
    }

    // Ödeme işlemi (Development ortamında mock)
    const amount = 99.99; // TRY
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    const payment = await Payment.create({
      userId,
      amount,
      paymentMethod,
      status: 'completed', // Development ortamında direkt başarılı
      transactionId: `mock_${Date.now()}`,
      subscriptionEndDate
    });

    // Kullanıcıyı premium yap
    await user.update({
      isPremium: true
    });

    res.status(201).json({
      message: 'Premium subscription activated successfully',
      payment,
      subscriptionEndDate
    });
  } catch (error) {
    next(error);
  }
});

// Ödeme geçmişini getir
router.get('/history', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const payments = await Payment.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    res.json(payments);
  } catch (error) {
    next(error);
  }
});

// Premium üyeliği iptal et
router.post('/cancel-premium', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user.isPremium) {
      return res.status(400).json({
        error: 'Not Premium',
        message: 'You are not a premium member'
      });
    }

    // Premium üyeliği iptal et (bir sonraki ödeme döneminde)
    const lastPayment = await Payment.findOne({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    // Üyelik bitiş tarihini güncelle
    await user.update({
      isPremium: false
    });

    res.json({
      message: 'Premium subscription cancelled successfully',
      activeUntil: lastPayment.subscriptionEndDate
    });
  } catch (error) {
    next(error);
  }
});

// Mock ödeme işlemi (Development)
const processMockPayment = async (paymentMethod) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `mock_${Date.now()}`
      });
    }, 1000);
  });
};

export default router; 