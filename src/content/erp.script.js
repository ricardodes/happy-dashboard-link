// Nobel ERP Script - Final Clean Version

// Set global functions
window.showView = function(viewId, target = null) {
  console.log('showView called:', viewId);
  
  // Hide all views
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('active');
    v.style.display = 'none';
  });

  // Show target view
  const targetView = document.getElementById('view-' + viewId);
  if (targetView) {
    targetView.classList.add('active');
    targetView.style.display = 'block';
  }

  // Update nav items
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (target) {
    target.classList.add('active');
  } else {
    const selector = `.sidebar-nav a.nav-item[onclick*="'${viewId}'"]`;
    const navItem = document.querySelector(selector);
    if (navItem) navItem.classList.add('active');
  }

  // Titles
  const titles = {
    'dashboard': 'Dashboard Executivo',
    'crm': 'CRM Comercial',
    'prospeccao': 'Mapa de Prospecção',
    'ia': 'Central de IA',
    'marketing': 'Gerador de Marketing',
    'financeiro': 'Gestão Financeira',
    'contabil': 'Escrituração Contábil',
    'fiscal': 'Obrigações Fiscais',
    'trabalhista': 'Folha e DP',
    'portal': 'Portal do Cliente',
    'informativos': 'Informativos',
    'documentos': 'Documentos',
    'equipe': 'Equipe Nobel',
    'agenda': 'Agenda Inteligente',
    'admin': 'Painel Admin Master'
  };
  const titleEl = document.getElementById('page-title');
  if (titleEl) titleEl.textContent = titles[viewId] || 'Plataforma Nobel';

  // Component initialization
  if (viewId === 'dashboard') {
    setTimeout(() => { if (typeof window.initCharts === 'function') window.initCharts(); }, 100);
  }
  if (viewId === 'fiscal') {
    setTimeout(() => { if (typeof window.initFiscalCalendar === 'function') window.initFiscalCalendar(); }, 100);
  }
  if (viewId === 'agenda') {
    setTimeout(() => { if (typeof window.initAgendaCalendar === 'function') window.initAgendaCalendar(); }, 100);
  }
  if (viewId === 'prospeccao') {
    setTimeout(() => { if (typeof window.filterProspeccao === 'function') window.filterProspeccao(); }, 100);
  }

  if (window.lucide) window.lucide.createIcons();
};

window.toggleSidebar = function() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('open');
};

window.toggleAppTheme = function() {
  const html = document.documentElement;
  const icon = document.getElementById('app-theme-icon');
  const current = html.getAttribute('data-theme');
  if (current === 'dark') {
    html.setAttribute('data-theme', 'light');
    if (icon) icon.setAttribute('data-lucide', 'moon');
  } else {
    html.setAttribute('data-theme', 'dark');
    if (icon) icon.setAttribute('data-lucide', 'sun');
  }
  if (window.lucide) window.lucide.createIcons();
  if (typeof window.initCharts === 'function') window.initCharts();
};

// Charts
let chartReceita, chartSegmento;
window.initCharts = function() {
  const ctxReceita = document.getElementById('chart-receita');
  const ctxSegmento = document.getElementById('chart-segmento');
  if (!ctxReceita || !ctxSegmento) return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

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

// Calendar
window.initFiscalCalendar = function() {
  const cal = document.getElementById('fiscal-calendar');
  if (!cal) return;
  cal.innerHTML = '';
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  days.forEach(d => {
    const h = document.createElement('div');
    h.className = 'cal-header';
    h.textContent = d;
    cal.appendChild(h);
  });
  for (let i = 1; i <= 30; i++) {
    const day = document.createElement('div');
    day.className = 'cal-day';
    day.textContent = i;
    if (i === 8) day.classList.add('today');
    cal.appendChild(day);
  }
};

window.initAgendaCalendar = function() {
  const cal = document.getElementById('agenda-calendar');
  if (!cal) return;
  cal.innerHTML = '';
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  days.forEach(d => {
    const h = document.createElement('div');
    h.className = 'cal-header';
    h.textContent = d;
    cal.appendChild(h);
  });
  for (let i = 1; i <= 30; i++) {
    const day = document.createElement('div');
    day.className = 'cal-day';
    day.textContent = i;
    if (i === 8) day.classList.add('today');
    cal.appendChild(day);
  }
};

// IA Functions
window.sendChat = function() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;

  const container = document.getElementById('chat-messages');
  container.innerHTML += `
    <div class="chat-message user">
      <div class="chat-avatar user"><i data-lucide="user" style="width:18px"></i></div>
      <div class="chat-bubble">${msg}</div>
    </div>
  `;
  input.value = '';
  if (window.lucide) window.lucide.createIcons();
  container.scrollTop = container.scrollHeight;

  if (typeof window.generateBusinessInsights === 'function') {
    window.generateBusinessInsights({ snapshot: msg }).then(res => {
      container.innerHTML += `
        <div class="chat-message ai">
          <div class="chat-avatar ai"><i data-lucide="sparkles" style="width:18px"></i></div>
          <div class="chat-bubble">${res.content}</div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      container.scrollTop = container.scrollHeight;
    });
  }
};

// Marketing Generation
window.genMarketing = async function(type) {
  const preview = document.getElementById('marketing-preview');
  const content = document.getElementById('marketing-content');
  if (!preview || !content) return;
  preview.style.display = 'block';
  content.innerHTML = '<div style="display:flex;align-items:center;gap:1rem"><div class="spinner" style="width:24px;height:24px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin 1s linear infinite"></div><span>Gerando conteúdo premium com IA Nobel...</span></div>';

  const topics = {
    'post': 'Estratégias avançadas de redução de impostos para empresas de tecnologia e inovação',
    'story': 'Dica de ouro: Como o planejamento tributário preventivo pode salvar o caixa da sua empresa hoje',
    'reels': 'O segredo que as grandes empresas usam para pagar menos impostos legalmente',
    'banner': 'Contabilidade Nobel: Liderança, Confiança e Inteligência para impulsionar seu negócio',
    'artigo': 'Guia Definitivo: Navegando pela Reforma Tributária Brasileira e as Oportunidades para o Simples Nacional em 2024',
    'email': 'Relatório Exclusivo: Oportunidades de Otimização Fiscal identificadas para o seu Perfil'
  };

  const channels = {
    'post': 'instagram',
    'story': 'instagram',
    'reels': 'instagram',
    'banner': 'linkedin',
    'artigo': 'linkedin',
    'email': 'whatsapp'
  };

  try {
    if (typeof window.generateMarketingCopy !== 'function') throw new Error('IA de Marketing não carregada');
    
    const result = await window.generateMarketingCopy({
      topic: topics[type] || 'Contabilidade Estratégica',
      channel: channels[type] || 'instagram',
      tone: 'premium, sofisticado, persuasivo'
    });

    if (result) {
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(result.image_prompt)}?width=1080&height=1080&nologo=true&model=flux&seed=${Math.floor(Math.random()*1000)}`;
      
      let html = '';
      if (type === 'story' || type === 'reels') {
        html = `
          <div style="max-width:350px;margin:0 auto;background:linear-gradient(135deg,#0f5e3e,#00d084);border-radius:var(--radius);overflow:hidden;position:relative;aspect-ratio:9/16;color:white;box-shadow:var(--shadow-lg)">
            <img src="${imageUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:0.6">
            <div style="position:relative;z-index:1;padding:2rem;display:flex;flex-direction:column;height:100%;justify-content:center;text-align:center">
              <div style="font-weight:900;font-size:1.5rem;margin-bottom:1rem;text-shadow:0 2px 4px rgba(0,0,0,0.3)">${result.title}</div>
              <div style="font-size:1.1rem;line-height:1.4;margin-bottom:2rem">${result.content.substring(0, 150)}...</div>
              <div style="background:white;color:#0f5e3e;padding:0.75rem 1.5rem;border-radius:100px;font-weight:800;align-self:center;box-shadow:0 4px 12px rgba(0,0,0,0.2)">SAIBA MAIS</div>
            </div>
          </div>`;
      } else if (type === 'artigo') {
        html = `
          <div style="max-width:800px;margin:0 auto;background:var(--bg-elevated);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)">
            <img src="${imageUrl}" style="width:100%;height:350px;object-fit:cover">
            <div style="padding:2.5rem">
              <h2 style="color:var(--primary);margin-bottom:1.5rem;font-size:1.75rem">${result.title}</h2>
              <div style="line-height:1.8;color:var(--text);font-size:1.1rem">${result.content.replace(/\n/g, '<br>')}</div>
              <div style="margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--border);display:flex;gap:0.5rem;flex-wrap:wrap">
                ${result.hashtags.map(h => `<span style="color:var(--accent);font-weight:600">#${h}</span>`).join(' ')}
              </div>
            </div>
          </div>`;
      } else {
        html = `
          <div style="max-width:500px;margin:0 auto;background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)">
            <div style="padding:1rem;display:flex;align-items:center;gap:0.75rem">
              <div style="width:40px;height:40px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:900">N</div>
              <div>
                <div style="font-weight:700;font-size:0.9rem">Contabilidade Nobel</div>
                <div style="font-size:0.75rem;color:var(--text-muted)">Inteligência Contábil</div>
              </div>
            </div>
            <img src="${imageUrl}" style="width:100%;aspect-ratio:1;object-fit:cover">
            <div style="padding:1.5rem">
              <div style="font-weight:700;margin-bottom:0.75rem;font-size:1.1rem">${result.title}</div>
              <div style="line-height:1.6;color:var(--text);margin-bottom:1rem">${result.content.replace(/\n/g, '<br>')}</div>
              <div style="color:var(--accent);font-weight:600">
                ${result.hashtags.map(h => `#${h}`).join(' ')}
              </div>
            </div>
          </div>`;
      }
      content.innerHTML = html;
    }
  } catch (err) {
    content.innerHTML = `<div style="color:var(--danger)">Erro: ${err.message}</div>`;
  }
};

// Prospecção Data
const empresasProspeccao = [
  {"nome": "Clínica Médica Montes Claros", "cat": "Clínicas médicas", "cidade": "Montes Claros", "endereco": "Av. Deputado Esteves Rodrigues, 1000", "tel": "(38) 3221-1000", "score": 96, "regime": "Simples Nacional", "oportunidade": "alta"},
  {"nome": "Hospital do Norte de Minas", "cat": "Hospitais", "cidade": "Montes Claros", "endereco": "Rua Santa Maria, 500", "tel": "(38) 3222-2000", "score": 98, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "Agropecuária Janaúba", "cat": "Agronegócio", "cidade": "Janaúba", "endereco": "Av. do Comércio, 200", "tel": "(38) 3821-3000", "score": 92, "regime": "Simples Nacional", "oportunidade": "alta"},
  {"nome": "Frigorífico Januária", "cat": "Indústrias alimentícias", "cidade": "Januária", "endereco": "Rodovia BR-135, KM 10", "tel": "(38) 3621-4000", "score": 94, "regime": "Lucro Presumido", "oportunidade": "alta"},
  {"nome": "Comércio de Salinas", "cat": "Varejo", "cidade": "Salinas", "endereco": "Av. Principal, 300", "tel": "(38) 3841-5000", "score": 88, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Hotel Pirapora", "cat": "Turismo e Hotelaria", "cidade": "Pirapora", "endereco": "Rua da Orla, 100", "tel": "(38) 3741-6000", "score": 90, "regime": "Lucro Presumido", "oportunidade": "alta"},
  {"nome": "Laticínios Bocaiúva", "cat": "Indústrias alimentícias", "cidade": "Bocaiúva", "endereco": "Av. JK, 800", "tel": "(38) 3251-7000", "score": 89, "regime": "Lucro Presumido", "oportunidade": "alta"}
];

window.filterProspeccao = function() {
  const search = document.getElementById('prop-search')?.value?.toLowerCase() || '';
  const cidade = document.getElementById('prop-cidade')?.value || '';
  const filtradas = empresasProspeccao.filter(emp => 
    (!search || emp.nome.toLowerCase().includes(search)) && 
    (!cidade || emp.cidade === cidade)
  );
  window.renderEmpresas(filtradas);
};

window.renderEmpresas = function(lista) {
  const grid = document.getElementById('prospeccao-grid');
  if (!grid) return;
  grid.innerHTML = lista.map(emp => `
    <div class="empresa-card">
      <div style="font-weight:700">${emp.nome}</div>
      <div style="font-size:0.8rem;color:var(--text-muted)">${emp.cat} - ${emp.cidade}</div>
      <div style="margin-top:0.5rem;font-size:0.85rem">${emp.tel}</div>
      <div style="margin-top:0.5rem"><span class="badge badge-green">${emp.score} pts</span></div>
    </div>
  `).join('');
};

window.toggleFinanceiroTab = (btn) => {
  document.querySelectorAll('#fin-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
};
window.toggleContabilTab = (btn) => {
  document.querySelectorAll('#cont-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
};
window.toggleFiscalTab = (btn) => {
  document.querySelectorAll('#fisc-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
};
window.toggleTrabalhistaTab = (btn) => {
  document.querySelectorAll('#trab-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
};
window.toggleEquipeTab = (btn) => {
  document.querySelectorAll('#equipe-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
};

// Initialize
function initApp() {
  console.log('App initialization started');
  window.initCharts();
  window.initFiscalCalendar();
  window.initAgendaCalendar();
  if (window.lucide) window.lucide.createIcons();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
