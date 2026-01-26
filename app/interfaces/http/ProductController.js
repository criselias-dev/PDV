import { ProductService } from '../../application/ProductService.js';

const productService = new ProductService();

export class ProductController {
  async create(req, res) {
    const { name, price, stock_quantity } = req.body;
    const product = await productService.addProduct(name, price, stock_quantity);
    return res.status(201).json(product);
  }

  async list(req, res) {
    const products = await productService.listProducts();
    return res.status(200).json(products);
  }

  async get(req, res) {
    const { id } = req.params;
    const product = await productService.getProduct(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json(product);
  }
    // ===============================
  // Reabastece um produto existente
  // ===============================
  async restock(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than zero' });
      }

      const updatedProduct = await productService.restockProduct(id, quantity);
      return res.status(200).json(updatedProduct);

    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}
