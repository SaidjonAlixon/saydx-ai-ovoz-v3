import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '@shared/schema';

// SQLite database faylini yaratamiz - Vercel uchun /tmp/ ishlatamiz
const dbPath = process.env.NODE_ENV === 'production' ? '/tmp/database.sqlite' : 'database.sqlite';
const sqlite = new Database(dbPath);

// Drizzle ORM'ni SQLite bilan ishlatamiz
export const db = drizzle(sqlite, { schema });

// Database'ni ishga tushirish funksiyasi
export function initializeDatabase() {
  try {
    // Jadvallarni yaratamiz
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        telegram TEXT,
        email TEXT,
        service_type TEXT NOT NULL,
        budget TEXT,
        timeline TEXT,
        description TEXT,
        file_url TEXT,
        source TEXT NOT NULL DEFAULT 'website',
        created_at INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'new'
      )
    `);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        short_description TEXT NOT NULL,
        full_description TEXT NOT NULL,
        category TEXT NOT NULL,
        base_price INTEGER NOT NULL,
        duration TEXT NOT NULL,
        rating TEXT DEFAULT '4.8',
        features TEXT NOT NULL,
        calculator_params TEXT,
        is_active TEXT NOT NULL DEFAULT 'true',
        created_at INTEGER NOT NULL
      )
    `);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        technologies TEXT NOT NULL,
        problem_statement TEXT,
        solution TEXT,
        results TEXT,
        images TEXT,
        duration TEXT,
        client_name TEXT,
        is_public TEXT NOT NULL DEFAULT 'true',
        created_at INTEGER NOT NULL
      )
    `);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT NOT NULL,
        author TEXT NOT NULL DEFAULT 'SAYD.X Team',
        read_time TEXT,
        views INTEGER DEFAULT 0,
        tags TEXT,
        image_url TEXT,
        is_published TEXT NOT NULL DEFAULT 'true',
        published_at INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);

    console.log('SQLite database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}

export { sqlite };
