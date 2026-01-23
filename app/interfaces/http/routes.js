import express from 'express';
import SaleController from './SaleController.js';

const router = express.Router();

router.post('/sales', (req, res) => SaleController.create(req, res));
router.post('/sales/:id/items', (req, res) => SaleController.addItem(req, res));
router.get('/sales/:id', (req, res) => SaleController.get(req, res));

export default router;
