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
  // ===============================
  // Reabastece (aumenta) o estoque de um produto existente
  // ===============================
  async restockProduct(id, quantity) {
    const product = await this.repo.getProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    const newQuantity = product.stock_quantity + quantity;
    await this.repo.updateStock(id, newQuantity);

    // Retorna o produto atualizado
    return { ...product, stock_quantity: newQuantity };
  }

}
