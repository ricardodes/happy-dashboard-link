// Nobel ERP - Main Entry Point
// This file coordinates the modules and handles initialization

// Import (Logic handled by script tags in HTML for compatibility)
// State is in modules/state.js
// UI is in modules/ui-manager.js
// AI is in modules/ai-engine.js
// Data is in modules/data-service.js

// Global Charts and Calendars
let chartReceita, chartSegmento;

window.initCharts = function() {
  const ctxReceita = document.getElementById('chart-receita');
  const ctxSegmento = document.getElementById('chart-segmento');
  if (!ctxReceita || !ctxSegmento) return;

  const textColor = '#64748b';
  const gridColor = 'rgba(0,0,0,0.05)';

  if (chartReceita) chartReceita.destroy();
  if (chartSegmento) chartSegmento.destroy();

  chartReceita = new Chart(ctxReceita, {
    type: 'line',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [{
        label: 'Receita 2024',
        data: [320, 345, 380, 410, 487, 520],
        borderColor: '#00d084',
        backgroundColor: 'rgba(0,208,132,0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#00d084',
        pointBorderColor: '#0f5e3e',
        pointBorderWidth: 2,
        pointRadius: 5
      }, {
        label: 'Receita 2023',
        data: [280, 295, 310, 330, 350, 380],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.05)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderDash: [5, 5]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: textColor } } },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor } },
        y: { grid: { color: gridColor }, ticks: { color: textColor }, beginAtZero: true }
      },
      layout: { padding: 10 }
    }
  });

  chartSegmento = new Chart(ctxSegmento, {
    type: 'doughnut',
    data: {
      labels: ['Saúde', 'Tecnologia', 'Comércio', 'Construção', 'Serviços', 'Outros'],
      datasets: [{
        data: [28, 22, 18, 12, 15, 5],
        backgroundColor: ['#00d084', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#64748b'],
        borderWidth: 0,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: { 
        legend: { position: 'right', labels: { color: textColor, padding: 15, font: { size: 12 } } } 
      },
      layout: { padding: 10 }
    }
  });
};

// Render Functions
window.renderFiscal = function() {
  const nfeBody = document.getElementById('fiscal-nfe-table-body');
  if (nfeBody) {
    nfeBody.innerHTML = window.appState.fiscal.nfe.map(item => `
      <tr class="hover-scale">
        <td style="font-weight:600">${item.emissor}</td>
        <td>R$ ${item.valor}</td>
        <td>${item.data}</td>
        <td><span class="status ${item.status === 'Validada' ? 'status-success' : 'status-warning'}"><span class="status-dot"></span> ${item.status}</span></td>
      </tr>
    `).join('');
  }
  
  const spedBody = document.getElementById('fiscal-sped-table-body');
  if (spedBody) {
    spedBody.innerHTML = window.appState.fiscal.sped.map(item => `
      <tr class="hover-scale">
        <td style="font-weight:600">${item.cliente}</td>
        <td>${item.tipo}</td>
        <td>${item.periodo}</td>
        <td><span class="status ${item.status === 'Enviado' ? 'status-success' : 'status-warning'}"><span class="status-dot"></span> ${item.status}</span></td>
        <td><button class="header-btn" onclick="handleAction('Ver Protocolo')"><i data-lucide="file-text" style="width:14px"></i></button></td>
      </tr>
    `).join('');
  }
  if (window.lucide) window.lucide.createIcons();
};

window.renderClientes = function(filter = "") {
  const container = document.getElementById('clientes-table-body');
  if (!container) return;

  const data = window.appState.clientes.filter(c => 
    c.nome.toLowerCase().includes(filter.toLowerCase()) || 
    c.cnpj.includes(filter)
  );

  container.innerHTML = data.map(c => `
    <tr class="hover-scale">
      <td style="font-weight:600">${c.nome}</td>
      <td>${c.cnpj}</td>
      <td><span class="badge ${c.regime.includes('Simples') ? 'badge-green' : 'badge-blue'}">${c.regime}</span></td>
      <td>${c.responsavel}</td>
      <td><span class="status ${c.status === 'Regular' ? 'status-success' : 'status-warning'}"><span class="status-dot"></span> ${c.status}</span></td>
      <td>
        <div style="display:flex;gap:0.5rem">
          <button class="header-btn" onclick="openClientDetails(${c.id})"><i data-lucide="eye" style="width:16px"></i></button>
          <button class="btn-delete" onclick="deleteCliente(${c.id})"><i data-lucide="trash-2" style="width:16px"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
  if (window.lucide) window.lucide.createIcons();
};

window.renderEquipe = function() {
  const body = document.getElementById('equipe-trabalhista-table-body');
  if (!body) return;
  
  body.innerHTML = window.appState.equipe.map(m => `
    <tr class="hover-scale">
      <td style="font-weight:600">${m.nome}</td>
      <td>${m.cargo}</td>
      <td><span class="badge badge-blue">${m.depto}</span></td>
      <td>${m.admissao}</td>
      <td><span class="status ${m.status === 'Ativo' ? 'status-success' : 'status-warning'}"><span class="status-dot"></span> ${m.status}</span></td>
      <td><button class="btn-delete" onclick="deleteEquipeMember(${m.id})"><i data-lucide="trash-2" style="width:16px"></i></button></td>
    </tr>
  `).join('') || '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted)">Nenhum colaborador encontrado.</td></tr>';
  
  if (window.lucide) window.lucide.createIcons();
};

// Global Initializers
function initApp() {
  console.log('Nobel ERP - Optimized Entry Point');
  
  // Show dashboard
  window.showView('dashboard');

  // Initial Renders
  window.renderClientes();
  window.renderEquipe();
  window.renderFiscal();
}

window.addEventListener('DOMContentLoaded', initApp);
