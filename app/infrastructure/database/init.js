import fs from 'fs';
import path from 'path';
import { db } from './connection.js';

export async function initDatabase() {
  const schemaPath = path.resolve('app/infrastructure/database/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  // Executa apenas o schema principal
  await db.exec(schema);

  // ✅ NADA de ALTER TABLE aqui, a coluna já existe
  console.log('📦 Database initialized');
}
