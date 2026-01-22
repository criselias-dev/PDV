export default class Product {
  constructor({ id, name, price, barcode, active = true }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.barcode = barcode;
    this.active = active;
  }
}
