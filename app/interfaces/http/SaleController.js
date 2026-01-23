import SaleService from '../../application/SaleService.js';

const saleService = new SaleService();

class SaleController {
  create(req, res) {
    const sale = saleService.createSale();
    return res.status(201).json(sale);
  }

  addItem(req, res) {
    const { id } = req.params;
    const product = req.body;

    try {
      const sale = saleService.addItem(id, product);
      return res.status(200).json(sale);
    } catch (err) {
      return res.status(404).json({ error: err.message });
    }
  }

  get(req, res) {
    const { id } = req.params;

    try {
      const sale = saleService.getSale(id);
      return res.status(200).json(sale);
    } catch (err) {
      return res.status(404).json({ error: err.message });
    }
  }
}

export default new SaleController();
