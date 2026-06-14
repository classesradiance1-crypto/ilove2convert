import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const caPath = path.join(__dirname, "..", "certs", "ca.pem");

const conn = await mysql.createConnection({
  host: "ws-1-ap-northeast-1.pooler.supabase.com",
  port: 5432,
  user: "postgres.kpaabcnavapvqzflqjtm",
  password: "2w?E5?M8qmfya#d",
  database: "postgres",
  ssl: { ca: fs.readFileSync(caPath), rejectUnauthorized: true },
});
#DATABASE_URL=postgresql://postgres.kpaabcnavapvqzflqjtm:[YOUR-PASSWORD]@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres
await conn.execute(`
  CREATE TABLE IF NOT EXISTS i2c_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    plan ENUM('free','premium','business') DEFAULT 'free',
    is_verified TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
  )
`);
console.log("i2c_users table ready");

await conn.execute(`
  CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    session_id VARCHAR(64) NULL,
    tool_slug VARCHAR(100) NOT NULL,
    tool_name VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NULL,
    file_size INT NULL,
    status ENUM('started','success','error') DEFAULT 'started',
    error_msg TEXT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    duration_ms INT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_tool (tool_slug)
  )
`);
console.log("activity_logs table ready");

await conn.execute(`
  CREATE TABLE IF NOT EXISTS auth_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    event ENUM('signup','login','logout','login_failed','password_reset') NOT NULL,
    email VARCHAR(255) NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_event (event)
  )
`);
console.log("auth_logs table ready");

await conn.end();
console.log("All tables ready!");
