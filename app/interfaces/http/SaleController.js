// SaleController.js
// Camada de interface HTTP, lida com requisições

import { SaleService } from '../../application/SaleService.js';

const saleService = new SaleService();

export class SaleController {
  async createSale(req, res) {
    const sale = await saleService.createSale();
    return res.status(201).json(sale);
  }

  async addItem(req, res) {
    const { sale, product, quantity } = req.body;
    const updatedSale = await saleService.addProductToSale(
      sale,
      product,
      quantity
    );
    return res.status(200).json(updatedSale);
  }

  async getSale(req, res) {
    const { id } = req.params;
    const sale = await saleService.getSale(id);
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    return res.status(200).json(sale);
  }
}
