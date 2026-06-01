// Nobel ERP - Main Entry Point with Global Error Interception
window.addEventListener('error', function(event) {
  console.error('Erro Global capturado:', event.error);
  // Aqui poderíamos enviar para um serviço de logs
});

window.addEventListener('unhandledrejection', function(event) {
  console.error('Promessa rejeitada sem tratamento:', event.reason);
});

// Render Functions with defensive programming
window.renderClientes = function(filter = "") {
  try {
    const container = document.getElementById('clientes-table-body');
    if (!container) return;

    if (!window.appState || !Array.isArray(window.appState.clientes)) {
      container.innerHTML = '<tr><td colspan="6" class="text-center">Erro nos dados: Clientes indisponíveis.</td></tr>';
      return;
    }

    const data = window.appState.clientes.filter(c => 
      (c.nome || '').toLowerCase().includes(filter.toLowerCase()) || 
      (c.cnpj || '').includes(filter)
    );

    if (data.length === 0) {
      container.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum cliente encontrado.</td></tr>';
      return;
    }

    container.innerHTML = data.map(c => `
      <tr class="hover-scale">
        <td style="font-weight:600">${c.nome || 'N/A'}</td>
        <td>${c.cnpj || '---'}</td>
        <td><span class="badge">${c.regime || '---'}</span></td>
        <td>${c.responsavel || '---'}</td>
        <td><span class="status ${c.status === 'Regular' ? 'status-success' : 'status-warning'}">${c.status || 'Pendente'}</span></td>
        <td><button class="header-btn" onclick="openClientDetails(${c.id})">Ver</button></td>
      </tr>
    `).join('');
    
    if (window.lucide) window.lucide.createIcons();
  } catch (e) {
    console.error("Erro ao renderizar clientes:", e);
  }
};

function initApp() {
  try {
    console.log('Nobel ERP - Inicialização Segura');
    window.showView('dashboard');
    window.renderClientes();
  } catch (e) {
    console.error("Erro crítico na inicialização do App:", e);
  }
}

window.addEventListener('DOMContentLoaded', initApp);
