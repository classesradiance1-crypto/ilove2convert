import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (pool) return pool;

  // Load TiDB CA certificate
  const caPath = process.env.TIDB_CA_PATH
    ? path.resolve(process.cwd(), process.env.TIDB_CA_PATH)
    : path.resolve(process.cwd(), "certs/ca.pem");

  const ca = fs.existsSync(caPath) ? fs.readFileSync(caPath) : undefined;

  pool = mysql.createPool({
    host:     process.env.TIDB_HOST     || "gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com",
    port:     Number(process.env.TIDB_PORT || 4000),
    user:     process.env.TIDB_USER     || "NPZan9v1x78oLU8.root",
    password: process.env.TIDB_PASSWORD || "POL6Tg2P24q4FeU6",
    database: process.env.TIDB_DATABASE || "ilove2convert",
    ssl: ca ? { ca } : { rejectUnauthorized: true },
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
    connectTimeout:     15000,
    timezone:           "Z",
  });

  return pool;
}

// SELECT — returns typed rows array
export async function query<T = Record<string, unknown>>(
  sql: string,
  params?: (string | number | boolean | null)[]
): Promise<T[]> {
  const db = getPool();
  const [rows] = await db.execute<mysql.RowDataPacket[]>(sql, params ?? []);
  return rows as T[];
}

// INSERT / UPDATE / DELETE — returns insertId and affectedRows
export async function execute(
  sql: string,
  params?: (string | number | boolean | null)[]
): Promise<{ insertId: number; rowCount: number }> {
  const db = getPool();
  const [result] = await db.execute<mysql.ResultSetHeader>(sql, params ?? []);
  return {
    insertId: result.insertId ?? 0,
    rowCount: result.affectedRows ?? 0,
  };
}

// Test the connection
export async function testConnection(): Promise<boolean> {
  try {
    await query("SELECT 1 AS ok");
    return true;
  } catch (e) {
    console.error("TiDB connection test failed:", e);
    return false;
  }
}
