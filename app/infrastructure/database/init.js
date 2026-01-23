import fs from 'fs';
import path from 'path';
import { db } from './connection.js';

export async function initDatabase() {
  const schemaPath = path.resolve(
    'app/infrastructure/database/schema.sql'
  );

  const schema = fs.readFileSync(schemaPath, 'utf8');

  await db.exec(schema);

  console.log('📦 Database initialized');
}
