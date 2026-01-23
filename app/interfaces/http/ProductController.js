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
}
