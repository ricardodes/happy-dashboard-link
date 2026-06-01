// Nobel ERP - Main Entry Point
// This file coordinates the modules and handles initialization

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

window.renderAdminUsers = function() {
  const body = document.getElementById('admin-users-table-body');
  if (!body) return;
  body.innerHTML = window.appState.users.map(u => `
    <tr class="hover-scale">
      <td><div style="display:flex;align-items:center;gap:0.5rem"><div class="user-avatar" style="width:30px;height:30px;font-size:0.75rem;background:${u.color}">${u.initial}</div>${u.nome}</div></td>
      <td>${u.email}</td>
      <td><span class="badge badge-blue">${u.perfil}</span></td>
      <td><span class="status status-success"><span class="status-dot"></span> ${u.status}</span></td>
      <td><button class="header-btn" onclick="handleAction('Editar Usuário')"><i data-lucide="edit-3" style="width:14px"></i></button></td>
    </tr>
  `).join('');
  if (window.lucide) window.lucide.createIcons();
};

window.filterClientes = function(val) {
  window.renderClientes(val);
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

// Re-inject missing functions from original script if needed
window.openClientDetails = function(id) {
  const c = window.appState.clientes.find(c => c.id === id);
  if (!c) return;
  openModal({
    title: `Dossiê Estratégico: ${c.nome}`,
    body: `
      <div style="display:flex;flex-direction:column;gap:1.5rem">
        <div style="background:linear-gradient(135deg, rgba(0,208,132,0.1), rgba(59,130,246,0.1));padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border-strong);display:flex;align-items:center;gap:1rem">
          <div style="width:48px;height:48px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center"><i data-lucide="brain-circuit"></i></div>
          <div style="flex:1">
            <div style="font-weight:700;font-size:0.95rem">Análise Nobel IA</div>
            <div style="font-size:0.8rem;color:var(--text-secondary)">Cliente do setor ${c.regime.includes('Real') ? 'Industrial/Grande Porte' : 'Serviços/Comércio'} com status ${c.status}.</div>
          </div>
        </div>
        <div class="view-toggle" style="justify-content:flex-start;margin-bottom:0">
          <button class="active" onclick="toggleClientModalTab(this, 'info')">Informações Cadastrais</button>
          <button class="tab-ia-btn" onclick="toggleClientModalTab(this, 'ia-profile')">IA: 4 Pilares de Análise</button>
        </div>
        <div id="client-modal-info">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="form-group"><label>Razão Social</label><div style="font-weight:600;padding:0.75rem;background:var(--bg-hover);border-radius:8px">${c.nome}</div></div>
            <div class="form-group"><label>CNPJ</label><div style="font-weight:600;padding:0.75rem;background:var(--bg-hover);border-radius:8px">${c.cnpj}</div></div>
            <div class="form-group"><label>Regime Tributário</label><div style="padding:0.75rem;background:var(--bg-hover);border-radius:8px">${c.regime}</div></div>
            <div class="form-group"><label>Responsável Nobel</label><div style="padding:0.75rem;background:var(--bg-hover);border-radius:8px">${c.responsavel}</div></div>
          </div>
        </div>
        <div id="client-modal-ia-profile" style="display:none">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem">
            <div class="card glass-morphism" style="padding:1rem; border:1px solid rgba(0,208,132,0.1)">
              <div style="font-weight:700; font-size:0.85rem; color:var(--primary); margin-bottom:0.5rem">1. Tendências & Crescimento</div>
              <div id="ai-pillar-1" style="font-size:0.8rem; color:var(--text-secondary)">Aguardando análise...</div>
            </div>
            <div class="card glass-morphism" style="padding:1rem; border:1px solid rgba(239,68,68,0.1)">
              <div style="font-weight:700; font-size:0.85rem; color:var(--danger); margin-bottom:0.5rem">2. Risco de Churn</div>
              <div id="ai-pillar-2" style="font-size:0.8rem; color:var(--text-secondary)">Aguardando análise...</div>
            </div>
          </div>
          <button class="nav-cta" id="btn-generate-ai-insight" style="width:100%;margin-top:1rem;gap:0.5rem;background:linear-gradient(135deg, var(--primary), var(--accent))" onclick="generateClientProfileAI(${c.id})">
            <i data-lucide="brain-circuit" style="width:16px"></i> Executar Diagnóstico 4 Pilares
          </button>
        </div>
      </div>
    `,
    confirmText: "Fechar Dossiê",
    onConfirm: () => closeModal()
  });
};

window.toggleClientModalTab = (btn, tab) => {
  const modal = btn.closest('.modal-content');
  modal.querySelectorAll('.view-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  modal.querySelector('#client-modal-info').style.display = tab === 'info' ? 'block' : 'none';
  modal.querySelector('#client-modal-ia-profile').style.display = tab === 'ia-profile' ? 'block' : 'none';
};

window.handleAction = (action) => {
  openModal({
    title: "Ação: " + action,
    body: `<p>A funcionalidade <strong>${action}</strong> está sendo processada.</p>`,
    confirmText: "Entendido",
    onConfirm: () => closeModal()
  });
};

// Common UI Helper for Modals (to ensure basic functionality exists)
if (typeof window.openModal !== 'function') {
  window.openModal = function(opts) {
    const overlay = document.getElementById('modal-overlay');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const confirmBtn = document.getElementById('modal-confirm-btn');
    
    if (title) title.textContent = opts.title;
    if (body) body.innerHTML = opts.body;
    if (confirmBtn) {
      confirmBtn.textContent = opts.confirmText || 'Confirmar';
      confirmBtn.onclick = opts.onConfirm || (() => window.closeModal());
    }
    if (overlay) overlay.style.display = 'flex';
  };
  
  window.closeModal = function() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.style.display = 'none';
  };
}
