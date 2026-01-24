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


// ===============================
// Rotas de Produtos (Estoque)
// ===============================
router.post('/products', (req, res) => productController.create(req, res));
router.get('/products', (req, res) => productController.list(req, res));
router.get('/products/:id', (req, res) => productController.get(req, res));

export default router;

// Lista todas as vendas, com filtro opcional por período
// Ex.: /api/sales?start=2026-01-24&end=2026-01-24
router.get('/sales', async (req, res) => {
  try {
    const { start, end } = req.query; // datas opcionais

    let sales;
    if (start && end) {
      // Se foram fornecidas datas, filtra por período
      sales = await saleService.listSalesByPeriod(start, end);
    } else {
      // Caso contrário, retorna todas as vendas
      sales = await saleService.listAllSales();
    }


    res.status(200).json(sales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

