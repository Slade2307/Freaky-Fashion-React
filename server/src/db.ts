// Inline module declaration for 'sqlite'
declare module 'sqlite' {
  interface OpenParams {
    filename: string;
    driver: any;
  }
  export function open(config: OpenParams): Promise<any>;
}

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

/**
 * Initializes the SQLite database.
 * Opens or creates 'freaky-fashion.db' and ensures the products table exists.
 */
export async function initDB() {
  // Open or create the database file at the specified path.
  // The path is relative to the working directory where the server is started.
  const db = await open({
    filename: './freaky-fashion.db',
    driver: sqlite3.Database
  });

  // Create the products table if it doesn't exist.
  // The table includes columns for all product fields including a unique slug.
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      sku TEXT,
      imageUrl TEXT,
      publishDate TEXT,
      slug TEXT NOT NULL UNIQUE
    )
  `);

  return db;
}
