export default class Sale {
  constructor() {
    this.items = [];
    this.total = 0;
  }

  addItem(product, quantity) {
    const item = {
      product,
      quantity,
      subtotal: product.price * quantity
    };

    this.items.push(item);
    this.total += item.subtotal;
  }
}
