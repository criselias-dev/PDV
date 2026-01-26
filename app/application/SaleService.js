// SaleService.js
import { SaleRepository } from '../infrastructure/repositories/SaleRepository.js';
import { ProductRepository } from '../infrastructure/repositories/ProductRepository.js';
import { db } from '../infrastructure/database/connection.js';

export class SaleService {
  constructor() {
    this.saleRepo = new SaleRepository();
    this.productRepo = new ProductRepository();
  }

  async createSale() {
    return await this.saleRepo.createSale();
  }

  async addProductToSale(saleId, productId, quantity) {
    await db.exec('BEGIN TRANSACTION');

   try {
    // ✅ verifica se a venda existe e está aberta
    const sale = await this.saleRepo.getSale(saleId);
    if (!sale) {
      throw new Error('Sale not found');
    }
    if (sale.status !== 'OPEN') {
      throw new Error('Cannot add items to a closed sale');
    }

    const product = await this.productRepo.getProductById(productId);

    if (!product) {
      throw new Error('Produto não encontrado');
    }

      // 🔒 baixa de estoque correta (com validação)
      await this.productRepo.decreaseStock(product.id, quantity);

      // 🧾 registra item da venda
      await this.saleRepo.addItem(saleId, product, quantity);


      await db.exec('COMMIT');

      return await this.saleRepo.getSale(saleId);
    } catch (err) {
      await db.exec('ROLLBACK');
      throw err;
    }
  }

  async getSale(saleId) {
    const sale = await this.saleRepo.getSale(saleId);

    let total = 0;

    for (const item of sale.items) {
      total += item.price * item.quantity;
    }

    sale.total = Number(total.toFixed(2));

    return sale;
  }

  async closeSale(saleId) {
  await db.exec('BEGIN TRANSACTION');

  try {
    const sale = await this.saleRepo.getSale(saleId);

    if (!sale) {
      throw new Error('Sale not found');
    }

    if (sale.status !== 'OPEN') {
      throw new Error('Sale is already closed');
    }

    await db.run(
      'UPDATE sales SET status = ? WHERE id = ?',
      ['CLOSED', saleId]
    );

    await db.exec('COMMIT');

    sale.status = 'CLOSED';
    return sale;
  } catch (err) {
    await db.exec('ROLLBACK');
    throw err;
  }
}

  

  // Lista todas as vendas
  async listAllSales() {
    return await this.saleRepo.getAllSales();
  }
  /**
   * Lista vendas realizadas dentro de um período
   * @param {string} start - Data inicial no formato 'YYYY-MM-DD'
   * @param {string} end - Data final no formato 'YYYY-MM-DD'
   * @returns {Promise<Array>} - Lista de vendas com itens
   */
  async listSalesByPeriod(start, end) {
    if (!start || !end) {
      throw new Error('Start and end dates must be provided');
    }

    const startDate = `${start} 00:00:00`;
    const endDate = `${end} 23:59:59`;

    // Busca todas as vendas no período
    const sales = await db.all(
      'SELECT * FROM sales WHERE created_at BETWEEN ? AND ? ORDER BY created_at ASC',
      [startDate, endDate]
    );

    // Adiciona os itens de cada venda
    for (const sale of sales) {
      const items = await db.all(
        'SELECT product_id,product_name, price, quantity FROM sale_items WHERE sale_id = ?',
        [sale.id]
      );
      sale.items = items;
    }

    return sales;
  }
}



