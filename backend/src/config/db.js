import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locate SQLite database file
const dbPath = process.env.DB_PATH 
  ? path.resolve(process.env.DB_PATH)
  : path.resolve(__dirname, '../../../database/eva.db');

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
