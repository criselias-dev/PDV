// routes.js
// ===============================
// Define todas as rotas HTTP da aplicação
// ===============================

import express from 'express';
import saleRouter from './SaleController.js';
import { ProductController } from './ProductController.js';
import { SaleService } from '../../application/SaleService.js';

const router = express.Router();

// ===============================
// Controllers
// ===============================
const productController = new ProductController();
const saleService = new SaleService();  // necessário para a rota /sales

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



export default router;