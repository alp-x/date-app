USE dating_app;

-- Admin kullanıcı
INSERT INTO users (email, password, name, age, gender, is_admin, interests, looking_for, latitude, longitude) VALUES
('admin@dating.com', '$2b$10$XKrOh5vWqM3Yw8xM1v9kZeYg5HwF7Jk4k5F5F5F5F5F5F5F5F5', 'Admin', 30, 'Erkek', TRUE, '["Yönetim", "Teknoloji"]', '["Uzun Süreli İlişki"]', 41.0082, 28.9784);

-- Normal kullanıcılar
INSERT INTO users (email, password, name, age, gender, photo, interests, looking_for, latitude, longitude) VALUES
('ayse@mail.com', '$2b$10$XKrOh5vWqM3Yw8xM1v9kZeYg5HwF7Jk4k5F5F5F5F5F5F5F5F5', 'Ayşe', 25, 'Kadın', '/images/users/ayse.jpg', '["Müzik", "Seyahat", "Spor"]', '["Uzun Süreli İlişki"]', 41.0082, 28.9784),
('mehmet@mail.com', '$2b$10$XKrOh5vWqM3Yw8xM1v9kZeYg5HwF7Jk4k5F5F5F5F5F5F5F5F5', 'Mehmet', 28, 'Erkek', '/images/users/mehmet.jpg', '["Spor", "Sinema", "Yemek"]', '["Kısa Süreli İlişki"]', 39.9334, 32.8597),
('zeynep@mail.com', '$2b$10$XKrOh5vWqM3Yw8xM1v9kZeYg5HwF7Jk4k5F5F5F5F5F5F5F5F5', 'Zeynep', 23, 'Kadın', '/images/users/zeynep.jpg', '["Dans", "Yoga", "Kitap"]', '["Yeni Arkadaşlar"]', 38.4192, 27.1287),
('can@mail.com', '$2b$10$XKrOh5vWqM3Yw8xM1v9kZeYg5HwF7Jk4k5F5F5F5F5F5F5F5F5', 'Can', 30, 'Erkek', '/images/users/can.jpg', '["Teknoloji", "Oyun", "Müzik"]', '["Henüz Karar Veremedim"]', 41.0082, 28.9784),
('elif@mail.com', '$2b$10$XKrOh5vWqM3Yw8xM1v9kZeYg5HwF7Jk4k5F5F5F5F5F5F5F5F5', 'Elif', 27, 'Kadın', '/images/users/elif.jpg', '["Sanat", "Fotoğrafçılık", "Seyahat"]', '["Uzun Süreli İlişki"]', 40.1885, 29.0610),
('ahmet@mail.com', '$2b$10$XKrOh5vWqM3Yw8xM1v9kZeYg5HwF7Jk4k5F5F5F5F5F5F5F5F5', 'Ahmet', 32, 'Erkek', '/images/users/ahmet.jpg', '["Doğa", "Kamp", "Spor"]', '["Kısa Süreli İlişki"]', 36.8969, 30.7133),
('selin@mail.com', '$2b$10$XKrOh5vWqM3Yw8xM1v9kZeYg5HwF7Jk4k5F5F5F5F5F5F5F5F5', 'Selin', 24, 'Kadın', '/images/users/selin.jpg', '["Müzik", "Dans", "Tiyatro"]', '["Yeni Arkadaşlar"]', 41.0082, 28.9784),
('burak@mail.com', '$2b$10$XKrOh5vWqM3Yw8xM1v9kZeYg5HwF7Jk4k5F5F5F5F5F5F5F5F5', 'Burak', 29, 'Erkek', '/images/users/burak.jpg', '["Fitness", "Beslenme", "Spor"]', '["Uzun Süreli İlişki"]', 38.4192, 27.1287),
('deniz@mail.com', '$2b$10$XKrOh5vWqM3Yw8xM1v9kZeYg5HwF7Jk4k5F5F5F5F5F5F5F5F5', 'Deniz', 26, 'Kadın', '/images/users/deniz.jpg', '["Yemek", "Seyahat", "Fotoğrafçılık"]', '["Henüz Karar Veremedim"]', 39.9334, 32.8597),
('mert@mail.com', '$2b$10$XKrOh5vWqM3Yw8xM1v9kZeYg5HwF7Jk4k5F5F5F5F5F5F5F5F5', 'Mert', 31, 'Erkek', '/images/users/mert.jpg', '["Teknoloji", "Bilim", "Kitap"]', '["Uzun Süreli İlişki"]', 41.0082, 28.9784);

-- Premium üyelikler
INSERT INTO premium_subscriptions (user_id, end_date) VALUES
(2, DATE_ADD(NOW(), INTERVAL 1 MONTH)),
(4, DATE_ADD(NOW(), INTERVAL 3 MONTH)),
(6, DATE_ADD(NOW(), INTERVAL 6 MONTH)),
(8, DATE_ADD(NOW(), INTERVAL 12 MONTH));

-- Örnek eşleşmeler
INSERT INTO likes (user_id, target_user_id, action) VALUES
(2, 3, 'like'),
(3, 2, 'like'),
(4, 5, 'like'),
(5, 4, 'like'),
(6, 7, 'like'),
(7, 6, 'like'),
(8, 9, 'like'),
(9, 8, 'like');

INSERT INTO matches (user1_id, user2_id) VALUES
(2, 3),
(4, 5),
(6, 7),
(8, 9);

-- Örnek mesajlar
INSERT INTO messages (sender_id, receiver_id, content, is_read) VALUES
(2, 3, 'Merhaba, profiliniz çok ilgi çekici!', TRUE),
(3, 2, 'Teşekkür ederim, sizinki de öyle!', FALSE),
(4, 5, 'Selam, nasılsınız?', TRUE),
(5, 4, 'İyiyim, siz nasılsınız?', FALSE),
(6, 7, 'Merhaba, tanışabilir miyiz?', TRUE),
(7, 6, 'Tabii ki, memnun oldum!', FALSE),
(8, 9, 'Selam, ortak ilgi alanlarımız var gibi görünüyor.', TRUE),
(9, 8, 'Evet, özellikle spor konusunda!', FALSE);

-- Örnek ödemeler
INSERT INTO payments (user_id, amount, payment_type, status) VALUES
(2, 99.99, 'premium', 'completed'),
(4, 249.99, 'premium', 'completed'),
(6, 499.99, 'premium', 'completed'),
(8, 999.99, 'premium', 'completed'),
(3, 29.99, 'boost', 'completed'),
(5, 29.99, 'boost', 'completed'),
(7, 29.99, 'boost', 'completed'),
(9, 29.99, 'boost', 'completed');

-- Kaydırma limitleri
INSERT INTO swipe_limits (user_id, daily_swipes, last_reset) VALUES
(2, 999999, NOW()),
(4, 999999, NOW()),
(6, 999999, NOW()),
(8, 999999, NOW()),
(3, 20, NOW()),
(5, 20, NOW()),
(7, 20, NOW()),
(9, 20, NOW()),
(10, 20, NOW()); 