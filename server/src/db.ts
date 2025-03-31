// -----------------------------------------------------------------------------
// TypeScript Declaration
// -----------------------------------------------------------------------------

// Detta gör så TypeScript förstår hur vi använder sqlite-paketet
// Vi berättar för TypeScript att när vi använder 'sqlite', så finns det ett objekt
// som heter OpenParams – med två properties: filename och driver

declare module 'sqlite' {
  interface OpenParams {
   filename: string; // 🔸 Filnamn där databasen ska sparas (t.ex. './freaky-fashion.db')
   driver: any;      // 🔸 Vilken motor som ska användas för att kommunicera med databasen (oftast sqlite3)
 }
}

// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------

// Importerar sqlite3 – det är själva motorn som läser och skriver till .db-filer
import sqlite3 from 'sqlite3';

// Importerar 'open' från sqlite – en hjälpfunktion som förenklar att öppna och använda databasen
import { open } from 'sqlite';

// -----------------------------------------------------------------------------
// Database Initialization Function (initDB)
// -----------------------------------------------------------------------------

/**
* 📦 initDB() – Startar databasen och ser till att den är redo att användas
* 
* - Skapar (eller öppnar) en databasfil med namnet 'freaky-fashion.db'.
* - Ser till att tabellen 'products' finns med rätt struktur (schema).
*/

export async function initDB() {
 // 🔑 Steg 1: Öppna anslutning till databasen
 // Om filen inte finns, skapas den automatiskt
 const db = await open({
   filename: './freaky-fashion.db',       // 🗂️ Plats och namn för databasen
   driver: sqlite3.Database               // 🚗 Motor som kör databasen (sqlite3)
 });

 // 🔨 Steg 2: Skapa tabellen 'products' om den inte redan finns
 // Tabellen är som ett Excel-ark där varje rad är en produkt och varje kolumn är en egenskap

 await db.exec(`
   CREATE TABLE IF NOT EXISTS products (
     id INTEGER PRIMARY KEY AUTOINCREMENT,  -- 🔢 Unikt ID som räknas upp automatiskt
     name TEXT NOT NULL,                    -- 🏷️ Namn på produkten (måste fyllas i)
     description TEXT,                      -- 📝 Beskrivning (frivillig)
     price INTEGER NOT NULL,                -- 💰 Pris i t.ex. ören (måste finnas)
     sku TEXT,                              -- 🧾 Artikelnummer (frivilligt)
     imageUrl TEXT,                         -- 🖼️ Länk till bild (frivillig)
     publishDate TEXT,                      -- 📅 Publiceringsdatum (frivilligt)
     slug TEXT NOT NULL UNIQUE              -- 🌐 Unik "webb-vänlig" identifierare (måste finnas)
   )
 `);

 // ✅ Steg 3: Returnerar databasanslutningen så att andra delar av appen kan använda den
 return db;
}
