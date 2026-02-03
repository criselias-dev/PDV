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

  async increaseStock(id, quantity) {
    return await this.repo.increaseStock(id, quantity);
  }
  // ===============================
  // Reabastece (aumenta) o estoque de um produto existente
  // ===============================
  async restockProduct(id, quantity) {
    const product = await this.repo.getProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    // ✅ Aqui passamos apenas a quantidade a adicionar
    const updatedProduct = await this.repo.increaseStock(id, quantity);

    // Retorna o produto atualizado
    return updatedProduct;
  }

}
