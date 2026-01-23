import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const dbPath = path.resolve('app/infrastructure/database/pdv.sqlite');

export const db = await open({
  filename: dbPath,
  driver: sqlite3.Database
});
