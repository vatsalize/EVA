import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locate SQLite database file
function resolveDbPath() {
  if (!process.env.DB_PATH) {
    return path.resolve(__dirname, '../../../database/eva.db');
  }
  if (path.isAbsolute(process.env.DB_PATH)) {
    return process.env.DB_PATH;
  }
  // Check relative to cwd
  const cwdCandidate = path.resolve(process.cwd(), process.env.DB_PATH);
  if (fs.existsSync(cwdCandidate)) {
    return cwdCandidate;
  }
  // Check relative to project root (backend/src/config -> root is 3 levels up)
  const rootCandidate = path.resolve(__dirname, '../../../', process.env.DB_PATH);
  if (fs.existsSync(rootCandidate)) {
    return rootCandidate;
  }
  // Check relative to backend folder (2 levels up)
  const backendCandidate = path.resolve(__dirname, '../../', process.env.DB_PATH);
  if (fs.existsSync(backendCandidate)) {
    return backendCandidate;
  }
  // Default fallback to project root location
  return rootCandidate;
}

const dbPath = resolveDbPath();

if (!fs.existsSync(dbPath)) {
  console.warn(`[DB Warning] Database file not found at ${dbPath}. Ensure database is seeded.`);
}

console.log(`[Database] Connecting to SQLite at: ${dbPath}`);
const db = new DatabaseSync(dbPath);

// Enable foreign keys
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

/**
 * Universal Database Helper Wrapper
 * Provides safe query execution with parameter binding and transactions
 */
export const query = {
  /**
   * Run a query that returns multiple rows
   */
  all(sql, params = []) {
    const stmt = db.prepare(sql);
    return stmt.all(...params);
  },

  /**
   * Run a query that returns a single row or undefined
   */
  get(sql, params = []) {
    const stmt = db.prepare(sql);
    return stmt.get(...params);
  },

  /**
   * Execute an INSERT, UPDATE, or DELETE statement
   */
  run(sql, params = []) {
    const stmt = db.prepare(sql);
    return stmt.run(...params);
  },

  /**
   * Execute raw SQL statements (e.g. DDL or scripts)
   */
  exec(sql) {
    return db.exec(sql);
  },

  /**
   * Execute a series of operations in a transaction
   */
  transaction(fn) {
    db.exec('BEGIN TRANSACTION;');
    try {
      const result = fn();
      db.exec('COMMIT;');
      return result;
    } catch (err) {
      db.exec('ROLLBACK;');
      throw err;
    }
  }
};

export default db;
