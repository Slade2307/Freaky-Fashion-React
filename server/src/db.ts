// -----------------------------------------------------------------------------
// Inline module declaration for 'sqlite'
// -----------------------------------------------------------------------------
// Since the 'sqlite' package might not come with built-in TypeScript types,
// we declare the expected structure manually so TypeScript knows how to handle it.

declare module 'sqlite' {
  interface OpenParams {
    filename: string; // Path to the database file
    driver: any;      // The database engine to use (e.g., sqlite3.Database)
  }

  // This function opens or creates a SQLite database connection
  export function open(config: OpenParams): Promise<any>;
}

// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------

// Import the low-level SQLite3 database driver
import sqlite3 from 'sqlite3';

// Import the high-level 'open' function from the 'sqlite' wrapper,
// which provides a cleaner, Promise-based interface
import { open } from 'sqlite';

// -----------------------------------------------------------------------------
// Database Initialization Function
// -----------------------------------------------------------------------------

/**
 * Initializes the SQLite database.
 * - Connects to (or creates) the 'freaky-fashion.db' file.
 * - Ensures the 'products' table exists with the correct schema.
 */
export async function initDB() {
  // Open a connection to the database
  // If the file doesn't exist, SQLite will create it
  const db = await open({
    filename: './freaky-fashion.db',       // Path to the local DB file
    driver: sqlite3.Database               // Use the sqlite3 driver
  });

  // Create the 'products' table if it doesn't already exist
  // This table stores all product-related data for the app
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Auto-incrementing unique ID
      name TEXT NOT NULL,                    -- Product name (required)
      description TEXT,                      -- Optional description
      price INTEGER NOT NULL,                -- Price (in smallest currency unit)
      sku TEXT,                              -- Optional stock keeping unit
      imageUrl TEXT,                         -- Main product image (URL or local path)
      publishDate TEXT,                      -- Optional publish date
      slug TEXT NOT NULL UNIQUE              -- Unique identifier used in URLs
    )
  `);

  // Return the database instance for use in other parts of the app
  return db;
}
