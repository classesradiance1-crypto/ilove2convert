-- ============================================================
-- ILove2Convert  –  TiDB Cloud (MySQL-compatible) Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS ilove2convert
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ilove2convert;

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  plan          ENUM('free','premium','business') NOT NULL DEFAULT 'free',
  is_verified   TINYINT(1)   NOT NULL DEFAULT 0,
  google_id     VARCHAR(255) NULL,
  avatar_url    VARCHAR(500) NULL,
  phone         VARCHAR(30)  NULL,
  country       VARCHAR(60)  NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Audit Log  (every auth event) ────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id         BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT       NULL,
  event      VARCHAR(50)  NOT NULL,
  email      VARCHAR(255) NULL,
  ip_address VARCHAR(64)  NULL,
  user_agent TEXT         NULL,
  meta       JSON         NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_user  (user_id),
  INDEX idx_audit_event (event),
  INDEX idx_audit_ts    (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Activity Logs (tool usage) ────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_logs (
  id          BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT       NULL,
  session_id  VARCHAR(64)  NULL,
  tool_slug   VARCHAR(100) NOT NULL,
  tool_name   VARCHAR(100) NOT NULL,
  file_name   VARCHAR(255) NULL,
  file_size   INT          NULL,
  status      ENUM('started','success','error') NOT NULL DEFAULT 'started',
  error_msg   TEXT         NULL,
  ip_address  VARCHAR(64)  NULL,
  user_agent  TEXT         NULL,
  duration_ms INT          NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_al_user    (user_id),
  INDEX idx_al_tool    (tool_slug),
  INDEX idx_al_session (session_id),
  INDEX idx_al_ts      (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Sessions (optional server-side sessions) ──────────────────
CREATE TABLE IF NOT EXISTS user_sessions (
  id         BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT       NOT NULL,
  token_hash VARCHAR(64)  NOT NULL,
  ip_address VARCHAR(64)  NULL,
  user_agent TEXT         NULL,
  expires_at DATETIME     NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_sessions_token (token_hash),
  INDEX idx_sessions_user (user_id),
  INDEX idx_sessions_exp  (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Password Reset Tokens ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS password_resets (
  id         BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT       NOT NULL,
  token_hash VARCHAR(64)  NOT NULL,
  expires_at DATETIME     NOT NULL,
  used       TINYINT(1)   NOT NULL DEFAULT 0,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_pr_token (token_hash),
  INDEX idx_pr_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
