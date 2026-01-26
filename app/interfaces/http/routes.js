// routes.js
// ===============================
// Define todas as rotas HTTP da aplicação
// ===============================

import express from 'express';
import saleRouter from './SaleController.js';
import { ProductController } from './ProductController.js';
import { SaleService } from '../../application/SaleService.js';
import { ProductService } from '../../application/ProductService.js';

const router = express.Router();

// ===============================
// Controllers
// ===============================
const productController = new ProductController();
const saleService = new SaleService();  // necessário para a rota /sales
const productService = new ProductService(); // necessário para restock

// ===============================
// Rotas de Vendas
// ===============================
router.use('/sales', saleRouter);

// ===============================
// Rotas de Produtos (Estoque)
// ===============================
router.post('/products', (req, res) => productController.create(req, res));
router.get('/products', (req, res) => productController.list(req, res));
router.get('/products/:id', (req, res) => productController.get(req, res));

// ===============================
// Reabastece (restock) um produto existente
// Ex.: POST /api/products/:id/restock
// Body: { "quantity": 10 }
// ===============================
router.post('/products/:id/restock', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    const updatedProduct = await productService.restockProduct(id, Number(quantity));
    return res.status(200).json(updatedProduct);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;