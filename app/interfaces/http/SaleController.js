const SaleService = require("../../application/SaleService");

const saleService = new SaleService();

class SaleController {
  createSale(req, res) {
    const sale = saleService.createSale();

    return res.status(201).json({
      id: sale.id,
      items: sale.items,
      total: sale.getTotal()
    });
  }

  addItem(req, res) {
    const { sale, product, quantity } = req.body;

    const updatedSale = saleService.addProductToSale(
      sale,
      product,
      quantity
    );

    return res.status(200).json({
      items: updatedSale.items,
      total: updatedSale.getTotal()
    });
  }
}

module.exports = new SaleController();
