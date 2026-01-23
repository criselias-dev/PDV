import { ProductRepository } from '../infrastructure/repositories/ProductRepository.js';

export class ProductService {
  constructor() {
    this.repo = new ProductRepository();
  }

  async addProduct(name, price, stock_quantity) {
    return await this.repo.createProduct(name, price, stock_quantity);
  }

  async listProducts() {
    return await this.repo.getAllProducts();
  }

  async getProduct(id) {
    return await this.repo.getProductById(id);
  }

  async updateStock(id, quantity) {
    return await this.repo.updateStock(id, quantity);
  }
}
