import { turso, isTursoConfigured } from "@/lib/db";
import { seedDatabase } from "./seed";

export async function initDatabase() {
  if (!isTursoConfigured()) {
    console.warn("Turso DB not configured — using placeholder data only");
    return;
  }

  try {
    // Create tables
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        name TEXT NOT NULL,
        description TEXT DEFAULT '',
        duration_minutes INTEGER NOT NULL DEFAULT 60,
        price REAL NOT NULL DEFAULT 0,
        category TEXT NOT NULL DEFAULT 'General',
        active INTEGER NOT NULL DEFAULT 1,
        image_url TEXT DEFAULT '',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        client_id TEXT,
        client_name TEXT NOT NULL DEFAULT '',
        client_email TEXT NOT NULL DEFAULT '',
        client_phone TEXT DEFAULT '',
        special_requests TEXT DEFAULT '',
        service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
        appointment_date TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','no-show','cancelled')),
        total_price REAL NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    await turso.execute(`
      CREATE TABLE IF NOT EXISTS site_content (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        section_key TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL DEFAULT '{}',
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // Migration: add image_url column to services if it doesn't exist
    try {
      await turso.execute("ALTER TABLE services ADD COLUMN image_url TEXT DEFAULT ''");
    } catch {
      // Column already exists
    }

    // Seed data
    await seedDatabase();
  } catch (err) {
    console.error("DB init failed:", err);
  }
}
