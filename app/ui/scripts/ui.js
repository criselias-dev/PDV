window.addEventListener('load', () => {
  console.log('ui.js executando imediatamente');

  const btnStart = document.getElementById('btnStart');
  const btnFinish = document.getElementById('btnFinish');
  const productInput = document.getElementById('productInput');

  let currentSaleId = null;

  // estado inicial
  btnFinish.disabled = true;
  productInput.disabled = true;

  // =========================
  // INICIAR VENDA
  // =========================
  btnStart.addEventListener('click', async () => {
    console.log('Clicou em iniciar venda');

    try {
      const res = await fetch('http://127.0.0.1:3000/api/sales', { method: 'POST' });


      if (!res.ok) {
        throw new Error('Erro ao iniciar venda: ' + res.status);
      }

      const sale = await res.json();
      currentSaleId = sale.id;
      document.getElementById('saleId').textContent = currentSaleId;


      // ✅ Habilita botão finalizar e input, desabilita iniciar
      btnStart.disabled = true;
      btnFinish.disabled = false;
      productInput.disabled = false;
      productInput.focus();

      console.log('Venda iniciada:', currentSaleId);
    } catch (err) {
      console.error('Erro iniciar venda:', err.message);
    }
  });

  // =========================
  // FINALIZAR VENDA
  // =========================
  btnFinish.addEventListener('click', async () => {
    if (!currentSaleId) return;

    try {
      const res = await fetch(`http://127.0.0.1:3000/api/sales/${currentSaleId}/close`, { method: 'POST' });


      if (!res.ok) {
        throw new Error('Erro ao finalizar venda: ' + res.status);
      }

      currentSaleId = null;
      document.getElementById('saleId').textContent = '—';


      btnStart.disabled = false;
      btnFinish.disabled = true;
      productInput.disabled = true;
      productInput.value = '';

      console.log('Venda finalizada');
      // LIMPAR A TELA APÓS FINALIZAR
      document.getElementById('itemsList').innerHTML = '';
      document.getElementById('saleTotal').textContent = 'Total: R$ 0';

    } catch (err) {
      console.error('Erro finalizar venda:', err.message);
    }
  });
  // =========================
  // ADICIONAR ITEM À VENDA
  // =========================
  productInput.addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter') return;

    const productId = productInput.value.trim();
    if (!productId) return;

    if (!currentSaleId) {
      console.warn('Tentativa de adicionar item sem venda ativa');
      return;
    }

    try {
      const res = await fetch('http://127.0.0.1:3000/api/sales/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          saleId: currentSaleId,
          productId: productId,
          quantity: 1
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Erro ao adicionar item:', data.message);
        alert(data.message);
        // 👇 LIMPA O INPUT APÓS ERRO
        productInput.value = '';
        productInput.focus();
        return;
      }

      console.log('Item adicionado com sucesso:', data);

      // 👇 ATUALIZA A TELA DO PDV
      updateSaleUI(data);

      productInput.value = '';
      productInput.focus();


    } catch (err) {
      console.error('Erro inesperado ao adicionar item:', err.message);
    }
  });

  function updateSaleUI(sale) {
    const itemsList = document.getElementById('itemsList');
    const saleTotal = document.getElementById('saleTotal');

    itemsList.innerHTML = '';

    // AGRUPAR ITENS POR product_id
    const grouped = {};

    sale.items
    .filter(item => item.status === 'ACTIVE')
    .forEach(item => {
      if (!grouped[item.product_id]) {
        grouped[item.product_id] = {
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: 0,
          price: item.price
        };
      }

      grouped[item.product_id].quantity += item.quantity;
    });

    // RENDERIZAR ITENS AGRUPADOS
    Object.values(grouped).forEach(item => {
      const li = document.createElement('li');
      const subtotal = item.price * item.quantity;

      li.textContent = `${item.product_id} - ${item.product_name} - Qtd: ${item.quantity} - R$ ${subtotal} `;

      // BOTÃO CANCELAR 1 UNIDADE
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = '❌';
      cancelBtn.classList.add('cancel-btn');

      cancelBtn.onclick = async () => {
        console.log("Cancelando 1 unidade de", item.product_id);
        await fetch('http://127.0.0.1:3000/api/sales/items/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            saleId: currentSaleId,
            productId: item.product_id
          })
        });

        // Buscar venda atualizada
        const res = await fetch(`http://127.0.0.1:3000/api/sales/${currentSaleId}`);
        const updatedSale = await res.json();

        updateSaleUI(updatedSale);
      };

      li.appendChild(cancelBtn);
      itemsList.appendChild(li);
    });

    saleTotal.textContent = `Total: R$ ${sale.total}`;
  }

  console.log('UI pronto para interação');
});





