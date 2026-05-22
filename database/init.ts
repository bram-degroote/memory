// src/database/init.ts
import { getDatabase } from './database';
import { createAllTables } from './schema';

export async function initializeDatabase(): Promise<void> {
    const db = await getDatabase();
    try {
        await db.execAsync('PRAGMA foreign_keys = ON;');
        await createAllTables(db);
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
        throw error;
    }
}

