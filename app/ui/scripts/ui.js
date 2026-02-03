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

      btnStart.disabled = false;
      btnFinish.disabled = true;
      productInput.disabled = true;
      productInput.value = '';

      console.log('Venda finalizada');
    } catch (err) {
      console.error('Erro finalizar venda:', err.message);
    }
  });

  console.log('UI pronto para interação');
});
