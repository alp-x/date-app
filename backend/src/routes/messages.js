import express from 'express';
import { Op } from 'sequelize';
import Message from '../models/Message.js';
import Match from '../models/Match.js';
import User from '../models/User.js';

const router = express.Router();

// Sohbet listesini getir
router.get('/chats', async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Eşleşmeleri bul
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

    // Her eşleşme için son mesajı bul
    const chats = await Promise.all(matches.map(async match => {
      const lastMessage = await Message.findOne({
        where: { matchId: match.id },
        order: [['createdAt', 'DESC']]
      });

      const otherUser = match.userId1 === userId ? match.User2 : match.User1;

      return {
        matchId: match.id,
        user: otherUser,
        lastMessage: lastMessage || null,
        matchedAt: match.matchedAt
      };
    }));

    // Son mesaja göre sırala
    chats.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(a.matchedAt);
      const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(b.matchedAt);
      return timeB - timeA;
    });

    res.json(chats);
  } catch (error) {
    next(error);
  }
});

// Bir sohbetin mesajlarını getir
router.get('/:matchId', async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.id;

    // Eşleşme kontrolü
    const match = await Match.findOne({
      where: {
        id: matchId,
        [Op.or]: [
          { userId1: userId },
          { userId2: userId }
        ],
        status: 'matched'
      }
    });

    if (!match) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Chat not found'
      });
    }

    // Mesajları getir
    const messages = await Message.findAll({
      where: { matchId },
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: User,
          as: 'Sender',
          attributes: ['id', 'name', 'profileImage']
        }
      ]
    });

    // Okunmamış mesajları okundu olarak işaretle
    await Message.update(
      {
        read: true,
        readAt: new Date()
      },
      {
        where: {
          matchId,
          senderId: { [Op.ne]: userId },
          read: false
        }
      }
    );

    res.json(messages);
  } catch (error) {
    next(error);
  }
});

// Mesaj gönder
router.post('/:matchId', async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Eşleşme kontrolü
    const match = await Match.findOne({
      where: {
        id: matchId,
        [Op.or]: [
          { userId1: userId },
          { userId2: userId }
        ],
        status: 'matched'
      }
    });

    if (!match) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Chat not found'
      });
    }

    // Mesaj oluştur
    const message = await Message.create({
      matchId,
      senderId: userId,
      content
    });

    // Socket.io ile karşı tarafa bildirim gönderilecek
    const recipientId = match.userId1 === userId ? match.userId2 : match.userId1;
    // Bu kısım socket.io ile entegre edilecek

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
});

export default router; 