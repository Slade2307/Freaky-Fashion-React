// So TypeScript knows how to cooperate with sqlite

declare module 'sqlite' {
   interface OpenParams {
    filename: string; // Where to save the database file (e.g. './freaky-fashion.db')
    driver: any;      // What kind of database we use (usually sqlite3.Database)
  }


}

// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------


// It's the part that knows how to read/write to a .db file on your computer
import sqlite3 from 'sqlite3';


// The 'Open' function helps you talk to the database in an easier way
// You don’t need to use complicated functions or steps — it's simpler and cleaner
import { open } from 'sqlite';


// -----------------------------------------------------------------------------
// Database Initialization Function
// -----------------------------------------------------------------------------

/**
 * Initializes the SQLite database. (Start and prepare the database so it’s ready to be used.)

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
