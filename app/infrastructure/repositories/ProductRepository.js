// ProductRepository.js
import { db } from '../database/connection.js';
import { v4 as uuidv4 } from 'uuid';

export class ProductRepository {
  // Cria um novo produto
  async createProduct(name, price, stock_quantity) {
    const id = uuidv4();
    await db.run(
      'INSERT INTO products (id, name, price, stock_quantity) VALUES (?, ?, ?, ?)',
      [id, name, price, stock_quantity]
    );
    return { id, name, price, stock_quantity };
  }

  // Lista todos os produtos
  async getAllProducts() {
    return await db.all('SELECT * FROM products');
  }

  // Consulta produto por ID
  async getProductById(id) {
    return await db.get('SELECT * FROM products WHERE id = ?', [id]);
  }

  // Atualiza estoque de um produto
  async updateStock(id, newQuantity) {
    await db.run('UPDATE products SET stock_quantity = ? WHERE id = ?', [newQuantity, id]);
  }

  // 🔥 MÉTODO CRÍTICO PARA VENDAS
  // Diminui estoque com validação (nunca negativo)
  async decreaseStock(id, quantity) {
    const product = await this.getProductById(id);

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock_quantity < quantity) {
      throw new Error('Insufficient stock');
    }

    await db.run(
      'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
      [quantity, id]
    );
  }
}
