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
        .filter(item => item.status === 'ACTIVE') // só considera itens ativos
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2)
    );
  }
  // ===============================
  // Cria nova venda
  // ===============================
  async createSale() {
    return await this.saleRepo.createSale();
  }
  // ===============================
  // Adiciona produto à venda
  // ===============================
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

      const item = sale.items.find(i => String(i.product_id) === String(productId) && i.status === 'ACTIVE');
      if (!item) throw new Error('Item not found or already cancelled');

      // Marca o item como cancelado
      await db.run(
        'UPDATE sale_items SET status = ? WHERE sale_id = ? AND product_id = ?',
        ['CANCELLED', saleId, productId]
      );
      // 🔄 devolve a quantidade cancelada ao estoque
      await this.productRepo.increaseStock(productId, item.quantity);
      const updatedProduct = await this.productRepo.getProductById(productId); // agora pega o estoque atualizado

      // Recalcula o total da venda sem afetar o estoque
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

  async getSale(saleId) {
    const sale = await this.saleRepo.getSale(saleId);

    if (!sale) {
      throw new Error('Sale not found');
    }

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

      if (!sale) {
        throw new Error('Sale not found');
      }

      if (sale.status !== 'OPEN') {
        throw new Error('Sale is already closed');
      }

      // 🔒 cálculo final e definitivo do total (blindagem)
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

  // Lista todas as vendas
  async listAllSales() {
    const sales = await this.saleRepo.getAllSales();

    for (const sale of sales) {
      if (sale.status !== 'CLOSED') {
        sale.total = this.calculateTotal(sale.items);
      }
    }

    return sales;
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


      // ✅ só recalcula se a venda ainda estiver aberta
      if (sale.status !== 'CLOSED') {
        sale.total = this.calculateTotal(items);
      }
    }

    return sales;
  }

}



