// SaleController.js
// Blend: mantém a lógica testada + Express Router + erros refinados
import express from 'express';
import { SaleService } from '../../application/SaleService.js';

const router = express.Router();
const saleService = new SaleService();

// ===============================
// Cria uma nova venda
// ===============================
router.post('/', async (req, res) => {
  try {
    const sale = await saleService.createSale();
    return res.status(201).json(sale);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ===============================
// Adiciona um item à venda
// ===============================
router.post('/items', async (req, res) => {
  try {
    const { saleId, productId, quantity } = req.body;

    if (!saleId || !productId || !quantity) {
      return res.status(400).json({ message: 'saleId, productId e quantity são obrigatórios' });
    }

    const updatedSale = await saleService.addProductToSale(saleId, productId, quantity);
    return res.status(200).json(updatedSale);

  } catch (err) {
    // erros esperados (venda fechada, estoque insuficiente)
    if (err.message.includes('Cannot add items') || err.message.includes('Insufficient stock')) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
});

// ===============================
// Cancela um item da venda
// ===============================
router.post('/items/cancel', async (req, res) => {
  try {
    const { saleId, productId } = req.body;
    if (!saleId || !productId) return res.status(400).json({ message: 'saleId e productId são obrigatórios' });

    const updatedSale = await saleService.cancelItem(saleId, productId);
    return res.status(200).json(updatedSale);

  } catch (err) {
    if (err.message.includes('Cannot cancel item') || err.message.includes('Item not found')) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
});

// ===============================
// Retorna uma venda pelo ID
// ===============================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await saleService.getSale(id);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    return res.status(200).json(sale);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ===============================
// Fecha a venda
// ===============================
router.post('/:id/close', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Sale ID is required' });

    const closedSale = await saleService.closeSale(id);
    return res.status(200).json(closedSale);
  } catch (err) {
    if (err.message.includes('already closed')) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
});

// ===============================
// Lista todas as vendas
// ===============================
router.get('/', async (req, res) => {
  try {
    const sales = await saleService.listAllSales();
    return res.status(200).json(sales);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ===============================
// Lista vendas por período
// ===============================
router.get('/period/:start/:end', async (req, res) => {
  try {
    const { start, end } = req.params;
    const sales = await saleService.listSalesByPeriod(start, end);
    return res.status(200).json(sales);
  } catch (err) {
    if (err.message.includes('must be provided')) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: err.message });
  }
});

export default router;
