import express from 'express';
import { upload } from '../middleware/upload.js';
import User from '../models/User.js';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';
import Match from '../models/Match.js';
import sequelize from '../database/connection.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Profil bilgilerini getir
router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Profil bilgilerini güncelle
router.put('/profile', upload.single('profileImage'), async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      // Eski profil fotoğrafını sil
      const user = await User.findByPk(req.user.id);
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, '../../uploads', user.profileImage);
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (err) {
          console.error('Eski profil fotoğrafı silinirken hata:', err);
        }
      }
      
      // Yeni profil fotoğrafının yolunu kaydet
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    // JSON alanlarını parse et
    if (typeof updateData.interests === 'string') {
      updateData.interests = JSON.parse(updateData.interests);
    }

    if (typeof updateData.settings === 'string') {
      updateData.settings = JSON.parse(updateData.settings);
    }

    const user = await User.findByPk(req.user.id);
    await user.update(updateData);

    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.json(userWithoutPassword);
  } catch (error) {
    // Hata durumunda yüklenen dosyayı sil
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads', req.file.filename);
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Hata durumunda dosya silinirken hata:', err);
      }
    }
    next(error);
  }
});

// Galeri fotoğrafı ekle
router.post('/profile/photos', upload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Fotoğraf y��klenmedi' });
    }

    const user = await User.findByPk(req.user.id);
    const photos = user.photos || [];
    const newPhotoPath = `/uploads/${req.file.filename}`;
    
    await user.update({
      photos: [...photos, newPhotoPath]
    });

    res.json({ photo: newPhotoPath });
  } catch (error) {
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads', req.file.filename);
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Hata durumunda dosya silinirken hata:', err);
      }
    }
    next(error);
  }
});

// Galeri fotoğrafı sil
router.delete('/profile/photos/:index', async (req, res, next) => {
  try {
    const photoIndex = parseInt(req.params.index);
    const user = await User.findByPk(req.user.id);
    const photos = user.photos || [];

    if (photoIndex < 0 || photoIndex >= photos.length) {
      return res.status(400).json({ message: 'Geçersiz fotoğraf indeksi' });
    }

    const photoPath = photos[photoIndex];
    const fullPath = path.join(__dirname, '../../uploads', path.basename(photoPath));

    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (err) {
      console.error('Fotoğraf silinirken hata:', err);
    }

    photos.splice(photoIndex, 1);
    await user.update({ photos });

    res.json({ message: 'Fotoğraf başarıyla silindi' });
  } catch (error) {
    next(error);
  }
});

// Galeriden profil fotoğrafı seç
router.put('/profile/set-profile-photo/:index', async (req, res, next) => {
  try {
    const photoIndex = parseInt(req.params.index);
    const user = await User.findByPk(req.user.id);
    const photos = user.photos || [];

    if (photoIndex < 0 || photoIndex >= photos.length) {
      return res.status(400).json({ message: 'Geçersiz fotoğraf indeksi' });
    }

    const selectedPhoto = photos[photoIndex];
    await user.update({ profileImage: selectedPhoto });

    res.json({ profileImage: selectedPhoto });
  } catch (error) {
    next(error);
  }
});

// Potansiyel eşleşmeleri getir
router.get('/potential-matches', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    // Daha önce etkileşimde bulunulan kullanıcıları bul
    const interactions = await Match.findAll({
      where: {
        [Op.or]: [
          { userId1: user.id },
          { userId2: user.id }
        ]
      }
    });

    // Etkileşimde bulunulan kullanıcı ID'lerini topla
    const interactedUserIds = interactions.reduce((acc, match) => {
      if (match.userId1 === user.id) {
        acc.push(match.userId2);
      } else {
        acc.push(match.userId1);
      }
      return acc;
    }, []);

    // Cinsiyet tercihi kontrolü
    let genderCondition;
    if (user.interestedIn === 'both') {
      genderCondition = { [Op.in]: ['male', 'female'] };
    } else if (user.interestedIn) {
      genderCondition = user.interestedIn;
    } else {
      genderCondition = { [Op.ne]: user.gender }; // Varsayılan olarak karşı cinsiyet
    }

    // Kendisi ve daha önce etkileşimde bulunulan kullanıcılar hariç
    const potentialMatches = await User.findAll({
      where: {
        id: { 
          [Op.and]: [
            { [Op.ne]: user.id },
            { [Op.notIn]: interactedUserIds.length ? interactedUserIds : [0] }
          ]
        },
        gender: genderCondition
      },
      attributes: {
        exclude: ['password']
      },
      order: sequelize.random(),
      limit: 20
    });

    res.json(potentialMatches);
  } catch (error) {
    next(error);
  }
});

// Kullanıcı ayarlarını güncelle
router.put('/settings', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    await user.update({
      settings: {
        ...user.settings,
        ...req.body
      }
    });

    res.json(user.settings);
  } catch (error) {
    next(error);
  }
});

// Kullanıcı detaylarını getir
router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router; 