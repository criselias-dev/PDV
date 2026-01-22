class Product {
  constructor({ id, name, price, barcode, active = true }) {
    if (!name) {
      throw new Error("Product name is required");
    }

    if (price == null || price < 0) {
      throw new Error("Product price must be zero or greater");
    }

    this.id = id;
    this.name = name;
    this.price = price;
    this.barcode = barcode;
    this.active = active;
  }

  deactivate() {
    this.active = false;
  }

  activate() {
    this.active = true;
  }

  changePrice(newPrice) {
    if (newPrice < 0) {
      throw new Error("New price must be zero or greater");
    }

    this.price = newPrice;
  }
}

module.exports = Product;
