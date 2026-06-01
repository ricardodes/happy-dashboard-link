// Nobel ERP - UI Manager Module
window.showView = function(viewId, target = null) {
  if (event) event.preventDefault();
  
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('active');
    v.style.display = 'none';
  });

  const targetView = document.getElementById('view-' + viewId);
  if (targetView) {
    targetView.classList.add('active');
    targetView.style.display = 'block';
  }

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (target) {
    target.classList.add('active');
  } else {
    const selector = `.sidebar-nav a.nav-item[onclick*="'${viewId}'"]`;
    const navItem = document.querySelector(selector);
    if (navItem) navItem.classList.add('active');
  }

  const titles = {
    'dashboard': 'Painel de Controle Nobel',
    'clientes': 'Gestão de Clientes (Alterdata)',
    'crm': 'Pipeline de Vendas',
    'prospeccao': 'Mapa de Inteligência',
    'marketing': 'Gerador de Marketing',
    'financeiro': 'Financeiro Interno',
    'contabil': 'Setor Contábil',
    'fiscal': 'Setor Fiscal',
    'trabalhista': 'Setor de RH/DP',
    'informativos': 'Central de Informativos',
    'equipe': 'Gestão de Equipe',
    'agenda': 'Agenda Nobel & Fiscal',
    'admin': 'Painel Administrativo'
  };
  const titleEl = document.getElementById('page-title');
  if (titleEl) titleEl.textContent = titles[viewId] || 'Plataforma Nobel';

  // Initializers
  if (viewId === 'dashboard') setTimeout(window.initCharts, 100);
  if (viewId === 'fiscal' || viewId === 'agenda') {
    setTimeout(() => {
      window.initFiscalCalendar();
      window.initAgendaCalendar();
      if (viewId === 'fiscal') window.renderFiscal();
    }, 100);
  }
  if (viewId === 'clientes') window.renderClientes();
  if (viewId === 'crm') window.renderLeads();
  if (viewId === 'financeiro') window.renderFinanceiro();
  if (viewId === 'contabil') window.renderContabil();
  if (viewId === 'admin') window.renderAdminUsers();
  if (viewId === 'trabalhista' || viewId === 'equipe') window.renderEquipe();
  if (viewId === 'prospeccao') setTimeout(() => { if (typeof window.filterProspeccao === 'function') window.filterProspeccao(); }, 100);

  if (window.lucide) window.lucide.createIcons();
};

window.toggleFinanceiroTab = (btn, tab) => {
  document.querySelectorAll('#fin-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const sections = ['pagar', 'receber', 'fluxo', 'dre'];
  sections.forEach(s => {
    const el = document.getElementById('fin-content-' + s);
    if (el) el.style.display = (s === tab) ? 'block' : 'none';
  });
};

window.toggleContabilTab = (btn, tab) => {
  document.querySelectorAll('#cont-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const sections = ['balancete', 'dre', 'diario', 'razao'];
  sections.forEach(s => {
    const el = document.getElementById('cont-content-' + s);
    if (el) el.style.display = (s === tab) ? 'block' : 'none';
  });
};

window.toggleFiscalTab = (btn, tab) => {
  document.querySelectorAll('#fisc-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const sections = ['calendario', 'nfe', 'sped', 'certidoes'];
  sections.forEach(s => {
    const el = document.getElementById('fisc-content-' + s);
    if (el) el.style.display = (s === tab) ? 'block' : 'none';
  });
};

window.toggleTrabalhistaTab = (btn, tab) => {
  document.querySelectorAll('#trab-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const sections = ['folha', 'funcionarios', 'esocial', 'ferias'];
  sections.forEach(s => {
    const el = document.getElementById('trab-content-' + s);
    if (el) el.style.display = (s === tab) ? 'block' : 'none';
  });
};
