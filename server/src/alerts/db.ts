import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const initDB = async () => {
  const database = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
  await database.exec(`
    CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userEmail TEXT NOT NULL,
        ticker TEXT NOT NULL,
        triggerPrice REAL NOT NULL,
        triggerState TEXT CHECK(triggerState IN ('above', 'below')),
        isActive BOOLEAN NOT NULL DEFAULT 1
    )
  `);
  return database;
};
