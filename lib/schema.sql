-- ============================================================
-- ILove2Convert Database Schema
-- Run this once in your Aiven MySQL database
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  plan          ENUM('free', 'premium', 'business') DEFAULT 'free',
  is_verified   TINYINT(1) DEFAULT 0,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- Sessions table (for tracking active sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token_hash),
  INDEX idx_user (user_id)
);

-- Activity logs table (every tool usage)
CREATE TABLE IF NOT EXISTS activity_logs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NULL,                          -- NULL = anonymous user
  session_id  VARCHAR(64) NULL,                  -- anonymous session id
  tool_slug   VARCHAR(100) NOT NULL,
  tool_name   VARCHAR(100) NOT NULL,
  file_name   VARCHAR(255),
  file_size   INT,                               -- bytes
  status      ENUM('started', 'success', 'error') DEFAULT 'started',
  error_msg   TEXT NULL,
  ip_address  VARCHAR(45),
  user_agent  TEXT,
  duration_ms INT NULL,                          -- processing time
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_tool (tool_slug),
  INDEX idx_created (created_at)
);

-- Auth logs (login/logout/signup events)
CREATE TABLE IF NOT EXISTS auth_logs (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NULL,
  event      ENUM('signup', 'login', 'logout', 'login_failed', 'password_reset') NOT NULL,
  email      VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_event (event)
);
saas