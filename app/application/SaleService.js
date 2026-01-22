import Sale from "../domain/Sale.js";
import Product from "../domain/Product.js";

export default class SaleService {
  createSale() {
    return new Sale();
  }

  addProductToSale(sale, productData, quantity) {
    const product = new Product({
      id: productData.id,
      name: productData.name,
      price: productData.price,
      barcode: productData.barcode,
      active: productData.active
    });

    sale.addItem(product, quantity);

    return sale;
  }
}
