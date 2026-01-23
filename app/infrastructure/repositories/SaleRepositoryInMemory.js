import { v4 as uuidv4 } from 'uuid';

export default class SaleRepositoryInMemory {
  constructor() {
    this.sales = new Map();
  }

  create() {
    const sale = {
      id: uuidv4(),
      items: [],
      total: 0
    };

    this.sales.set(sale.id, sale);
    return sale;
  }

  findById(id) {
    return this.sales.get(id) || null;
  }

  save(sale) {
    this.sales.set(sale.id, sale);
    return sale;
  }
}
