// SaleService.js
import { SaleRepository } from '../infrastructure/repositories/SaleRepository.js';
import { ProductRepository } from '../infrastructure/repositories/ProductRepository.js';

export class SaleService {
  constructor() {
    this.saleRepo = new SaleRepository();
    this.productRepo = new ProductRepository();
  }

  async createSale() {
    return await this.saleRepo.createSale();
  }

  async addProductToSale(saleId, productId, quantity) {
    const product = await this.productRepo.getProductById(productId);

    if (!product) {
      throw new Error('Produto não encontrado');
    }

    if (product.stock_quantity < quantity) {
      throw new Error('Estoque insuficiente');
    }

    // registra item da venda
    await this.saleRepo.addItem(
      saleId,
      product.id,
      product.name,
      product.price,
      quantity
    );

    // baixa estoque
    const newStock = product.stock_quantity - quantity;
    await this.productRepo.updateStock(product.id, newStock);

    return await this.saleRepo.getSale(saleId);
  }

  async getSale(saleId) {
    return await this.saleRepo.getSale(saleId);
  }
}
