import SaleService from "../../application/SaleService.js";

const saleService = new SaleService();

export default class SaleController {
  createSale(req, res) {
    const sale = saleService.createSale();

    return res.status(201).json({
      items: sale.items,
      total: sale.total
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
      total: updatedSale.total
    });
  }
}
