// SaleController.js
// Camada de interface HTTP, lida com requisições

import { SaleService } from '../../application/SaleService.js';

const saleService = new SaleService();

export class SaleController {
  // Cria uma nova venda
  async createSale(req, res) {
    try {
      const sale = await saleService.createSale();
      return res.status(201).json(sale);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Adiciona um item à venda
  async addItem(req, res) {
    try {
      // Garantir que estamos usando os nomes corretos de parâmetros
      const { saleId, productId, quantity } = req.body;

      if (!saleId || !productId || !quantity) {
        return res.status(400).json({ message: 'saleId, productId e quantity são obrigatórios' });
      }

      const updatedSale = await saleService.addProductToSale(
        saleId,
        productId,
        quantity
      );

      return res.status(200).json(updatedSale);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Retorna uma venda pelo ID
  async getSale(req, res) {
    try {
      const { id } = req.params;
      const sale = await saleService.getSale(id);
      if (!sale) return res.status(404).json({ message: 'Sale not found' });
      return res.status(200).json(sale);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}
