import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import matchRoutes from './routes/matches.js';
import messageRoutes from './routes/messages.js';
import paymentRoutes from './routes/payments.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authenticate } from './middleware/auth.js';

// Database
import sequelize from './database/connection.js';

// Config
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5173'
      : 'https://yourproductionurl.com',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5173'
    : 'https://yourproductionurl.com',
  credentials: true
}));

app.use(express.json());

// Uploads klasörü için statik dosya servisi
const uploadsPath = path.join(__dirname, '../uploads');
// Uploads klasörünü oluştur
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('sendMessage', (data) => {
    const { recipientId, message } = data;
    io.to(recipientId).emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/matches', authenticate, matchRoutes);
app.use('/api/messages', authenticate, messageRoutes);
app.use('/api/payments', authenticate, paymentRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Uygulama başlatma
const startServer = async () => {
  try {
    // Veritabanı bağlantısını ve tabloları oluştur
    await sequelize.sync();

    // Sunucuyu başlat
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server ${PORT} portunda çalışıyor`);
      console.log(`🌍 Ortam: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Sunucu başlatılırken hata:', error);
    process.exit(1);
  }
};

startServer(); 