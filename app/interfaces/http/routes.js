// routes.js
// ===============================
// Define todas as rotas HTTP da aplicação
// ===============================

import express from 'express';
import { SaleController } from './SaleController.js';
import { ProductController } from './ProductController.js';
import { SaleService } from '../../application/SaleService.js';

const router = express.Router();

// ===============================
// Controllers
// ===============================
const saleController = new SaleController();
const productController = new ProductController();
const saleService = new SaleService();  // necessário para a rota /sales

// ===============================
// Rotas de Vendas
// ===============================
router.post('/sales', (req, res) => saleController.createSale(req, res));
router.post('/sales/items', (req, res) => saleController.addItem(req, res));
router.get('/sales/:id', (req, res) => saleController.getSale(req, res));


// Lista todas as vendas
router.get('/sales', async (req, res) => {
  const sales = await saleService.listAllSales();
  res.status(200).json(sales);
});

// ===============================
// Rotas de Produtos (Estoque)
// ===============================
router.post('/products', (req, res) => productController.create(req, res));
router.get('/products', (req, res) => productController.list(req, res));
router.get('/products/:id', (req, res) => productController.get(req, res));

export default router;
