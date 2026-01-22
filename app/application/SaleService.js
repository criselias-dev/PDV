const Sale = require("../domain/Sale");
const Product = require("../domain/Product");

class SaleService {
  createSale() {
    return new Sale();
  }

  addProductToSale(sale, productData, quantity) {
    const product = new Product(
      productData.id,
      productData.name,
      productData.price,
      productData.active
    );

    sale.addItem(product, quantity);

    return sale;
  }
}

module.exports = SaleService;
