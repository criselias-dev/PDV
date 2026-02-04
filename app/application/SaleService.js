// SaleService.js
import { SaleRepository } from '../infrastructure/repositories/SaleRepository.js';
import { ProductRepository } from '../infrastructure/repositories/ProductRepository.js';
import { db } from '../infrastructure/database/connection.js';

export class SaleService {
  constructor() {
    this.saleRepo = new SaleRepository();
    this.productRepo = new ProductRepository();
  }

  // ===============================
  // Calcula o total apenas de itens ativos
  // ===============================
  calculateTotal(items) {
    return Number(
      items
        .filter(item => item.status === 'ACTIVE')
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2)
    );
  }

  // ===============================
  // Cria nova venda
  // ===============================
  async createSale() {
    const sale = await this.saleRepo.createSale();
    return sale;
  }

  // ===============================
  // Adiciona produto à venda
  // ===============================
  async addProductToSale(saleId, productId, quantity) {
    await db.exec('BEGIN TRANSACTION');

    try {
      const sale = await this.saleRepo.getSale(saleId);
      if (!sale) throw new Error('Sale not found');
      if (sale.status !== 'OPEN') throw new Error('Cannot add items to a closed sale');

      const product = await this.productRepo.getProductById(productId);
      if (!product) throw new Error('Produto não encontrado');

      await this.productRepo.decreaseStock(product.id, quantity);
      await this.saleRepo.addItem(saleId, product, quantity);

      await db.exec('COMMIT');

      const updatedSale = await this.saleRepo.getSale(saleId);
      updatedSale.total = this.calculateTotal(updatedSale.items);
      return updatedSale;

    } catch (err) {
      await db.exec('ROLLBACK');
      throw err;
    }
  }

  // ===============================
  // Cancela um item da venda
  // ===============================
  async cancelItem(saleId, productId) {
    await db.exec('BEGIN TRANSACTION');

    try {
      const sale = await this.saleRepo.getSale(saleId);
      if (!sale) throw new Error('Sale not found');
      if (sale.status !== 'OPEN') throw new Error('Cannot cancel item from a closed sale');

      const item = await db.get(
        `SELECT id, product_id, quantity, status
         FROM sale_items
         WHERE sale_id = ? AND product_id = ? AND status = 'ACTIVE'
         ORDER BY id ASC
         LIMIT 1`,
        [saleId, productId]
      );

      if (!item) throw new Error('Item not found or already cancelled');

      await db.run(
        `UPDATE sale_items
         SET status = 'CANCELLED'
         WHERE id = ?`,
        [item.id]
      );

      await this.productRepo.increaseStock(productId, 1);

      const updatedItems = (await this.saleRepo.getSale(saleId)).items;
      const total = this.calculateTotal(updatedItems);

      await db.run(
        'UPDATE sales SET total = ? WHERE id = ?',
        [total, saleId]
      );

      await db.exec('COMMIT');

      const updatedSale = await this.saleRepo.getSale(saleId);
      updatedSale.total = total;
      return updatedSale;

    } catch (err) {
      await db.exec('ROLLBACK');
      throw err;
    }
  }

  // ===============================
  // Recupera venda
  // ===============================
  async getSale(saleId) {
    const sale = await this.saleRepo.getSale(saleId);
    if (!sale) throw new Error('Sale not found');

    sale.total = this.calculateTotal(sale.items);
    return sale;
  }

  // ===============================
  // Fecha a venda
  // ===============================
  async closeSale(saleId) {
    await db.exec('BEGIN TRANSACTION');

    try {
      const sale = await this.saleRepo.getSale(saleId);
      if (!sale) throw new Error('Sale not found');
      if (sale.status !== 'OPEN') throw new Error('Sale is already closed');

      const total = this.calculateTotal(sale.items);

      await db.run(
        'UPDATE sales SET status = ?, total = ? WHERE id = ?',
        ['CLOSED', total, saleId]
      );

      await db.exec('COMMIT');

      sale.status = 'CLOSED';
      sale.total = total;
      return sale;

    } catch (err) {
      await db.exec('ROLLBACK');
      throw err;
    }
  }

  // ===============================
  // Lista todas as vendas
  // ===============================
  async listAllSales() {
    const sales = await this.saleRepo.getAllSales();

    for (const sale of sales) {
      if (sale.status !== 'CLOSED') {
        sale.total = this.calculateTotal(sale.items);
      }
    }

    return sales;
  }

  // ===============================
  // Lista vendas por período
  // ===============================
  async listSalesByPeriod(start, end) {
    if (!start || !end) throw new Error('Start and end dates must be provided');

    const startDate = `${start} 00:00:00`;
    const endDate = `${end} 23:59:59`;

    const sales = await db.all(
      'SELECT * FROM sales WHERE created_at BETWEEN ? AND ? ORDER BY created_at ASC',
      [startDate, endDate]
    );

    for (const sale of sales) {
      const items = await db.all(
        'SELECT product_id, product_name, price, quantity, status FROM sale_items WHERE sale_id = ?',
        [sale.id]
      );

      sale.items = items;

      if (sale.status !== 'CLOSED') {
        sale.total = this.calculateTotal(items);
      }
    }

    return sales;
  }
}
