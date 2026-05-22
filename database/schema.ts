import * as SQLite from "expo-sqlite";

export const SCHEMA = {
  users: `
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      time INTEGER NOT NULL,
      name STRING NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `,
}

export async function createAllTables(db: SQLite.SQLiteDatabase): Promise<void> {
  for (const [, schema] of Object.entries(SCHEMA)) {
    await db.execAsync(schema as string);
  }
}