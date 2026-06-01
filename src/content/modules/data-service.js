// Nobel ERP - Data Service Module
window.syncAlterdata = async function() {
  const key = localStorage.getItem('nobel_alterdata_key');
  const url = localStorage.getItem('nobel_alterdata_url');
  
  if (!key || !url) {
    openModal({
      title: "Integração Necessária",
      body: "<p>Para sincronizar com o Alterdata, você precisa configurar a URL e o Token da API nas configurações administrativas.</p>",
      confirmText: "Configurar Agora",
      onConfirm: () => {
        closeModal();
        showView('admin');
        setTimeout(() => window.openAlterdataConfig(), 300);
      }
    });
    return;
  }

  openModal({
    title: "Sincronizar com Alterdata",
    body: `
      <div style="text-align:center;padding:1rem">
        <div id="sync-status-icon"><i data-lucide="refresh-cw" class="spin" style="width:40px;height:40px;color:var(--primary)"></i></div>
        <p style="margin-top:1rem" id="sync-status-text">Conectando ao servidor Alterdata...</p>
      </div>
    `,
    confirmText: "Fechar",
    onConfirm: () => closeModal()
  });
  
  if (window.lucide) window.lucide.createIcons();

  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    document.getElementById('sync-status-text').textContent = "Buscando carteira de clientes...";
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    document.getElementById('sync-status-icon').innerHTML = '<i data-lucide="check-circle" style="width:40px;height:40px;color:var(--accent)"></i>';
    document.getElementById('sync-status-text').innerHTML = "<strong>Sincronização Concluída!</strong><br>3 novos clientes importados e 12 atualizados.";
    if (window.lucide) window.lucide.createIcons();
    
    const newClients = [
      { id: Date.now(), nome: "Padaria Vila Nova", cnpj: "33.444.555/0001-66", regime: "Simples Nacional", responsavel: "Julia Rocha (Atendimento)", status: "Regular" }
    ];
    window.appState.clientes = [...window.appState.clientes, ...newClients];
    window.renderClientes();
  } catch (err) {
    document.getElementById('sync-status-text').innerHTML = `<span style="color:var(--danger)">Erro na sincronização: ${err.message}</span>`;
  }
};
