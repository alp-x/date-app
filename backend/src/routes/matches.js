import express from 'express';
import { Op } from 'sequelize';
import Match from '../models/Match.js';
import User from '../models/User.js';

const router = express.Router();

// Eşleşme durumunu kontrol et
router.get('/status/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const match = await Match.findOne({
      where: {
        [Op.or]: [
          { userId1: currentUserId, userId2: userId },
          { userId1: userId, userId2: currentUserId }
        ]
      }
    });

    if (!match) {
      return res.json({ status: null });
    }

    res.json({ status: match.status });
  } catch (error) {
    next(error);
  }
});

// Eşleşme oluştur veya güncelle
router.post('/:action', async (req, res, next) => {
  try {
    const { action } = req.params;
    const { targetUserId } = req.body;
    const userId = req.user.id;

    if (!['like', 'pass'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    // Mevcut eşleşmeyi kontrol et
    let match = await Match.findOne({
      where: {
        [Op.or]: [
          { userId1: userId, userId2: targetUserId },
          { userId1: targetUserId, userId2: userId }
        ]
      }
    });

    if (match) {
      // Eşleşme zaten varsa güncelle
      await match.update({
        status: action === 'like' ? 'matched' : 'rejected',
        matchedAt: action === 'like' ? new Date() : null
      });
    } else {
      // Yeni eşleşme oluştur
      match = await Match.create({
        userId1: userId,
        userId2: targetUserId,
        status: action === 'like' ? 'pending' : 'rejected',
        matchedAt: null
      });

      // Karşı tarafın da like'ı var mı kontrol et
      if (action === 'like') {
        const otherMatch = await Match.findOne({
          where: {
            userId1: targetUserId,
            userId2: userId,
            status: 'pending'
          }
        });

        if (otherMatch) {
          // Karşılıklı like varsa eşleşme oldu
          await Promise.all([
            match.update({ status: 'matched', matchedAt: new Date() }),
            otherMatch.update({ status: 'matched', matchedAt: new Date() })
          ]);
        }
      }
    }

    res.json({ status: match.status });
  } catch (error) {
    next(error);
  }
});

// Eşleşmeleri listele
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user.id;

    const matches = await Match.findAll({
      where: {
        [Op.or]: [
          { userId1: userId },
          { userId2: userId }
        ],
        status: 'matched'
      },
      include: [
        {
          model: User,
          as: 'User1',
          attributes: ['id', 'name', 'profileImage', 'lastActive']
        },
        {
          model: User,
          as: 'User2',
          attributes: ['id', 'name', 'profileImage', 'lastActive']
        }
      ]
    });

    // Eşleşmeleri düzenle
    const formattedMatches = matches.map(match => {
      const otherUser = match.userId1 === userId ? match.User2 : match.User1;
      return {
        matchId: match.id,
        matchedAt: match.matchedAt,
        user: otherUser
      };
    });

    res.json(formattedMatches);
  } catch (error) {
    next(error);
  }
});

// Eşleşmeyi sil (unmatch)
router.delete('/:matchId', async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.id;

    const match = await Match.findOne({
      where: {
        id: matchId,
        [Op.or]: [
          { userId1: userId },
          { userId2: userId }
        ]
      }
    });

    if (!match) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Match not found'
      });
    }

    await match.destroy();
    res.json({ message: 'Match removed successfully' });
  } catch (error) {
    next(error);
  }
});

export default router; 