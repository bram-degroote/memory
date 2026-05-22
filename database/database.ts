// src/database/database.ts
import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'myapp.db';

let db: SQLite.SQLiteDatabase | null = null;

export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
    if (db) {
        return db;
    }

    db = await SQLite.openDatabaseAsync(DATABASE_NAME);
    return db;
};

export const closeDatabase = async (): Promise<void> => {
    if (db) {
        await db.closeAsync();
        db = null;
    }
};