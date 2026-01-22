class Sale {
  constructor() {
    this.items = [];
    this.total = 0;
    this.createdAt = new Date();
  }

  addItem(product, quantity = 1) {
    if (!product) {
      throw new Error("Product is required");
    }

    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    if (!product.active) {
      throw new Error("Cannot sell inactive product");
    }

    const itemTotal = product.price * quantity;

    this.items.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      total: itemTotal
    });

    this._recalculateTotal();
  }

  _recalculateTotal() {
    this.total = this.items.reduce(
      (sum, item) => sum + item.total,
      0
    );
  }
}

module.exports = Sale;
