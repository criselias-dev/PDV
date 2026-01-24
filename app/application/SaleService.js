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
      const product = await this.productRepo.getProductById(productId);

      if (!product) {
        throw new Error('Produto não encontrado');
      }

      // 🔒 baixa de estoque correta (com validação)
      await this.productRepo.decreaseStock(product.id, quantity);

      // 🧾 registra item da venda
      await this.saleRepo.addItem(
        saleId,
        product,
        quantity
      );

      await db.exec('COMMIT');

      return await this.saleRepo.getSale(saleId);
    } catch (err) {
      await db.exec('ROLLBACK');
      throw err;
    }
  }

  async getSale(saleId) {
    return await this.saleRepo.getSale(saleId);
  }

  // Lista todas as vendas
async listAllSales() {
  return await this.saleRepo.getAllSales();
}

}

