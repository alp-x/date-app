CREATE DATABASE IF NOT EXISTS dating_app;
USE dating_app;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(191) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INT NOT NULL,
  gender ENUM('Erkek', 'Kadın') NOT NULL,
  photo VARCHAR(255),
  bio TEXT,
  interests JSON,
  looking_for JSON,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_admin BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  last_active TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_location (latitude, longitude),
  INDEX idx_gender (gender),
  INDEX idx_age (age)
);

CREATE TABLE premium_subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_user (user_id),
  INDEX idx_end_date (end_date)
);

CREATE TABLE likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  target_user_id INT NOT NULL,
  action ENUM('like', 'dislike') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (target_user_id) REFERENCES users(id),
  UNIQUE KEY unique_like (user_id, target_user_id),
  INDEX idx_action (action)
);

CREATE TABLE matches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user1_id INT NOT NULL,
  user2_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user1_id) REFERENCES users(id),
  FOREIGN KEY (user2_id) REFERENCES users(id),
  UNIQUE KEY unique_match (user1_id, user2_id),
  INDEX idx_users (user1_id, user2_id)
);

CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id),
  INDEX idx_conversation (sender_id, receiver_id),
  INDEX idx_is_read (is_read)
);

CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_type ENUM('premium', 'boost') NOT NULL,
  status ENUM('pending', 'completed', 'failed') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_type (payment_type)
);

CREATE TABLE swipe_limits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  daily_swipes INT DEFAULT 20,
  last_reset TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_user_limit (user_id),
  INDEX idx_last_reset (last_reset)
);

-- Trigger to update user's premium status when subscription changes
DELIMITER //
CREATE TRIGGER update_user_premium_status
AFTER INSERT ON premium_subscriptions
FOR EACH ROW
BEGIN
  UPDATE users 
  SET is_premium = (NEW.end_date > NOW())
  WHERE id = NEW.user_id;
END//
DELIMITER ;

-- Trigger to update user's last_active timestamp
DELIMITER //
CREATE TRIGGER update_user_last_active
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
  SET NEW.last_active = NOW();
END//
DELIMITER ; 