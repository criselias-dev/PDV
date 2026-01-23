import SaleRepositoryInMemory from '../infrastructure/repositories/SaleRepositoryInMemory.js';

export default class SaleService {
  constructor() {
    this.saleRepository = new SaleRepositoryInMemory();
  }

  createSale() {
    return this.saleRepository.create();
  }

  addItem(saleId, product) {
    const sale = this.saleRepository.findById(saleId);
    if (!sale) throw new Error('Sale not found');

    sale.items.push(product);
    sale.total = sale.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return this.saleRepository.save(sale);
  }

  getSale(saleId) {
    const sale = this.saleRepository.findById(saleId);
    if (!sale) throw new Error('Sale not found');
    return sale;
  }
}
