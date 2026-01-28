// ui.js — camada de interface (estado e eventos)

document.addEventListener('DOMContentLoaded', () => {
  const productInput = document.getElementById('product-code');
  const saleItems = document.querySelector('.sale-items');
  const saleTotal = document.getElementById('sale-total');

  // foco automático no campo de código
  productInput.focus();

  productInput.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;

    const code = productInput.value.trim();
    if (!code) return;

    // remove mensagem "Nenhum item"
    const empty = saleItems.querySelector('.empty');
    if (empty) empty.remove();

    // cria linha do item
    const item = document.createElement('div');
    item.textContent = `Produto código: ${code}`;
    item.style.padding = '6px 0';
    item.style.fontSize = '0.9rem';

    saleItems.appendChild(item);

    productInput.value = '';
    productInput.focus();
  });
});