// SaleRepository.js
// ==================================================
// Camada de persistência da Venda
// Responsabilidades:
// - Criar vendas
// - Persistir itens da venda
// - Recuperar venda com seus itens
// NÃO contém regra de negócio (isso fica no Service)
// ==================================================

import { db } from '../database/connection.js';
import { v4 as uuidv4 } from 'uuid';

export class SaleRepository {

  // --------------------------------------------------
  // Cria uma nova venda vazia
  // A venda nasce SEM itens e SEM total calculado
  // --------------------------------------------------
  async createSale() {
    const id = uuidv4();

    await db.run(
      'INSERT INTO sales (id) VALUES (?)',
      [id]
    );

    return { id, items: [] };
  }

  // Adiciona um item a uma venda existente (agora com product_id)
  async addItem(saleId, product, quantity) {
    await db.run(
  `INSERT INTO sale_items 
   (sale_id, product_id, product_name, price, quantity, status) 
   VALUES (?, ?, ?, ?, ?, 'ACTIVE')`,
  [saleId, product.id, product.name, product.price, quantity]
);

  }


  // --------------------------------------------------
  // Recupera uma venda com seus itens
  // --------------------------------------------------
  async getSale(saleId) {
    const sale = await db.get(
      'SELECT * FROM sales WHERE id = ?',
      [saleId]
    );

    if (!sale) return null;

    const items = await db.all(
  'SELECT product_id, product_name, price, quantity, status FROM sale_items WHERE sale_id = ? ORDER BY id ASC',
  [saleId]
);


    return {
      ...sale,
      items
    };
  }

  // Retorna todas as vendas com seus itens
  async getAllSales() {
    const sales = await db.all('SELECT * FROM sales');

    const result = [];

    for (const sale of sales) {
      const items = await db.all(
  'SELECT product_id, product_name, price, quantity, status FROM sale_items WHERE sale_id = ? ORDER BY id ASC',
  [sale.id]
);

      result.push({ ...sale, items });
    }

    return result;
  }

  // Retorna todas as vendas, opcionalmente filtrando por período
  async listSales(startDate, endDate) {
    let query = 'SELECT * FROM sales';
    const params = [];

    if (startDate && endDate) {
      query += ' WHERE date(created_at) BETWEEN date(?) AND date(?)';
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ' WHERE date(created_at) >= date(?)';
      params.push(startDate);
    } else if (endDate) {
      query += ' WHERE date(created_at) <= date(?)';
      params.push(endDate);
    }

    const sales = await db.all(query, params);

    // adiciona os itens a cada venda
    for (const sale of sales) {
     const items = await db.all(
  'SELECT product_id, product_name, price, quantity, status FROM sale_items WHERE sale_id = ? ORDER BY id ASC',
  [sale.id]
);

      sale.items = items;
    }

    return sales;
  }

}
