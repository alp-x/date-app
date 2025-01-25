import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL bağlantı havuzu
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dating_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Kullanıcı Kayıt
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, age, gender } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result]: any = await pool.execute(
      'INSERT INTO users (email, password, name, age, gender) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, age, gender]
    );

    res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu' });
  } catch (error) {
    res.status(500).json({ error: 'Kayıt sırasında bir hata oluştu' });
  }
});

// Kullanıcı Girişi
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users]: any = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Geçersiz şifre' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Giriş sırasında bir hata oluştu' });
  }
});

// Kullanıcı Listesi (Eşleşme için)
app.get('/api/users', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { gender, minAge, maxAge } = req.query;

    let query = 'SELECT id, name, age, gender, photo, interests FROM users WHERE id != ?';
    const params: any[] = [userId];

    if (gender) {
      query += ' AND gender = ?';
      params.push(gender);
    }

    if (minAge) {
      query += ' AND age >= ?';
      params.push(minAge);
    }

    if (maxAge) {
      query += ' AND age <= ?';
      params.push(maxAge);
    }

    const [users] = await pool.execute(query, params);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Kullanıcılar getirilirken bir hata oluştu' });
  }
});

// Eşleşme İşlemi
app.post('/api/matches', authenticateToken, async (req: any, res) => {
  try {
    const { targetUserId, action } = req.body;
    const userId = req.user.id;

    await pool.execute(
      'INSERT INTO likes (user_id, target_user_id, action) VALUES (?, ?, ?)',
      [userId, targetUserId, action]
    );

    // Karşılıklı beğeni kontrolü
    if (action === 'like') {
      const [matches]: any = await pool.execute(
        'SELECT * FROM likes WHERE user_id = ? AND target_user_id = ? AND action = "like"',
        [targetUserId, userId]
      );

      if (matches.length > 0) {
        await pool.execute(
          'INSERT INTO matches (user1_id, user2_id) VALUES (?, ?)',
          [userId, targetUserId]
        );
        return res.json({ match: true });
      }
    }

    res.json({ match: false });
  } catch (error) {
    res.status(500).json({ error: 'Eşleşme sırasında bir hata oluştu' });
  }
});

// Mesajlaşma
app.post('/api/messages', authenticateToken, async (req: any, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    // Eşleşme kontrolü
    const [matches]: any = await pool.execute(
      'SELECT * FROM matches WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)',
      [senderId, receiverId, receiverId, senderId]
    );

    if (matches.length === 0) {
      return res.status(403).json({ error: 'Eşleşme olmadan mesaj gönderilemez' });
    }

    await pool.execute(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
      [senderId, receiverId, content]
    );

    res.status(201).json({ message: 'Mesaj gönderildi' });
  } catch (error) {
    res.status(500).json({ error: 'Mesaj gönderilirken bir hata oluştu' });
  }
});

// Premium İşlemleri
app.post('/api/premium', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { months } = req.body;

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + months);

    await pool.execute(
      'INSERT INTO premium_subscriptions (user_id, end_date) VALUES (?, ?) ON DUPLICATE KEY UPDATE end_date = ?',
      [userId, endDate, endDate]
    );

    res.json({ message: 'Premium üyelik başarıyla aktifleştirildi' });
  } catch (error) {
    res.status(500).json({ error: 'Premium işlemi sırasında bir hata oluştu' });
  }
});

// Admin İstatistikleri
app.get('/api/admin/stats', authenticateToken, async (req: any, res) => {
  try {
    // Admin kontrolü
    const [users]: any = await pool.execute(
      'SELECT is_admin FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!users[0]?.is_admin) {
      return res.status(403).json({ error: 'Yetkisiz erişim' });
    }

    const [totalUsers]: any = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [premiumUsers]: any = await pool.execute('SELECT COUNT(*) as count FROM premium_subscriptions WHERE end_date > NOW()');
    const [dailyMatches]: any = await pool.execute('SELECT COUNT(*) as count FROM matches WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)');
    const [revenue]: any = await pool.execute('SELECT SUM(amount) as total FROM payments WHERE created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)');

    res.json({
      totalUsers: totalUsers[0].count,
      premiumUsers: premiumUsers[0].count,
      dailyMatches: dailyMatches[0].count,
      revenue: revenue[0].total || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'İstatistikler getirilirken bir hata oluştu' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 