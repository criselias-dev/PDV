// SaleService.js
// Camada de lógica de negócio, agora persistente
import { SaleRepository } from '../infrastructure/repositories/SaleRepository.js';


export class SaleService {
  constructor() {
    this.repo = new SaleRepository();
  }

  async createSale() {
    return await this.repo.createSale();
  }

  async addProductToSale(sale, product, quantity) {
    await this.repo.addItem(sale.id, product, quantity);
    // Retorna a venda atualizada
    return await this.repo.getSale(sale.id);
  }

  async getSale(saleId) {
    return await this.repo.getSale(saleId);
  }
}
