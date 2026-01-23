// SaleRepository.js
// Camada de persistência: lida diretamente com o banco SQLite

import { db } from '../infrastructure/database/connection.js';
import { v4 as uuidv4 } from 'uuid';

export class SaleRepository {
  // Cria uma nova venda vazia e retorna o objeto
  async createSale() {
    const id = uuidv4();
    await db.run(
      'INSERT INTO sales (id) VALUES (?)',
      [id]
    );
    return { id, items: [] };
  }

  // Adiciona um item a uma venda existente
  async addItem(saleId, product, quantity) {
    await db.run(
      'INSERT INTO sale_items (sale_id, product_name, price, quantity) VALUES (?, ?, ?, ?)',
      [saleId, product.name, product.price, quantity]
    );
  }

  // Recupera uma venda completa com itens
  async getSale(saleId) {
    const sale = await db.get(
      'SELECT * FROM sales WHERE id = ?',
      [saleId]
    );

    if (!sale) return null;

    const items = await db.all(
      'SELECT product_name, price, quantity FROM sale_items WHERE sale_id = ?',
      [saleId]
    );

    return { ...sale, items };
  }
}
