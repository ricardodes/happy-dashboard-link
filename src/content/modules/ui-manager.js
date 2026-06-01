// Nobel ERP - UI Manager Module with Error Safety
window.showView = function(viewId, target = null) {
  try {
    if (event) event.preventDefault();
    
    const views = document.querySelectorAll('.view');
    if (views.length === 0) console.warn("Nenhuma view (.view) encontrada no DOM.");

    views.forEach(v => {
      v.classList.remove('active');
      v.style.display = 'none';
    });

    const targetView = document.getElementById('view-' + viewId);
    if (!targetView) {
      throw new Error(`View 'view-${viewId}' não existe no documento.`);
    }

    targetView.classList.add('active');
    targetView.style.display = 'block';

    // Update Nav
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    if (target) {
      target.classList.add('active');
    }

    const titleEl = document.getElementById('page-title');
    if (titleEl) {
      const titles = { 'dashboard': 'Dashboard', 'clientes': 'Clientes' }; // Fallback titles
      titleEl.textContent = titles[viewId] || 'Nobel ERP';
    }

    // Safely trigger initializers
    const safeInit = (fn) => {
      if (typeof fn === 'function') {
        try { fn(); } catch (e) { console.error(`Erro ao inicializar componente da view ${viewId}:`, e); }
      }
    };

    if (viewId === 'dashboard') setTimeout(() => safeInit(window.initCharts), 10);
    if (viewId === 'clientes') safeInit(window.renderClientes);

  } catch (error) {
    console.error("Erro ao trocar de aba:", error);
    alert("Ocorreu um erro ao carregar esta seção. Por favor, tente novamente.");
  }
};

window.safeToggle = function(btnSelector, contentPrefix, tab) {
  try {
    const container = document.querySelector(btnSelector);
    if (!container) return;
    
    container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    const activeBtn = Array.from(container.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes(tab));
    if (activeBtn) activeBtn.classList.add('active');

    const sections = document.querySelectorAll(`[id^="${contentPrefix}"]`);
    sections.forEach(s => {
      s.style.display = s.id.endsWith(tab) ? 'block' : 'none';
    });
  } catch (e) {
    console.error("Erro no toggle de sub-abas:", e);
  }
};
