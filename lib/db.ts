import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

let pool: mysql.Pool | null = null;

function getSslCa(): Buffer | undefined {
  // 1. Base64 env var (Vercel / production)
  if (process.env.DB_SSL_CA_CONTENT) {
    return Buffer.from(process.env.DB_SSL_CA_CONTENT, "base64");
  }

  // 2. Explicit path from env
  if (process.env.DB_SSL_CA && fs.existsSync(process.env.DB_SSL_CA)) {
    return fs.readFileSync(process.env.DB_SSL_CA);
  }

  // 3. ca.pem inside the project root (ilove2convert/ca.pem)
  const localPath = path.join(process.cwd(), "ca.pem");
  if (fs.existsSync(localPath)) {
    return fs.readFileSync(localPath);
  }

  // 4. One level up (legacy location)
  const parentPath = path.join(process.cwd(), "..", "ca.pem");
  if (fs.existsSync(parentPath)) {
    return fs.readFileSync(parentPath);
  }

  return undefined;
}

export function getPool(): mysql.Pool {
  if (pool) return pool;

  const ca = getSslCa();

  pool = mysql.createPool({
    host: process.env.DB_HOST || "kirodb-exespay-2e5e.e.aivencloud.com",
    port: parseInt(process.env.DB_PORT || "14952"),
    user: process.env.DB_USER || "avnadmin",
    password: process.env.DB_PASSWORD || "AVNS_bU4TB96Va_bf6cmGmvw",
    database: process.env.DB_NAME || "defaultdb",
    ssl: ca
      ? { ca, rejectUnauthorized: true }
      : { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
  });

  return pool;
}

// SELECT queries — returns rows array
export async function query<T = unknown[]>(
  sql: string,
  params?: (string | number | null | boolean)[]
): Promise<T> {
  const db = getPool();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows] = await db.execute(sql, params as any);
  return rows as T;
}

// INSERT / UPDATE / DELETE — returns ResultSetHeader with insertId
export async function execute(
  sql: string,
  params?: (string | number | null | boolean)[]
): Promise<mysql.ResultSetHeader> {
  const db = getPool();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result] = await db.execute(sql, params as any);
  return result as mysql.ResultSetHeader;
}
