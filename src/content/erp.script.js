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

      const isVertical = type === 'story' || type === 'reels';
      const width = isVertical ? 720 : 1080;
      const height = isVertical ? 1280 : 1080;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(result.image_prompt)}?width=${width}&height=${height}&nologo=true&model=flux&seed=${Math.floor(Math.random()*1000)}`;
      
      const fallbackImg = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1080&auto=format&fit=crop";
      
      let html = '';
      if (type === 'story') {
        html = `
          <div style="max-width:350px;margin:0 auto;background:#000;border-radius:24px;overflow:hidden;position:relative;aspect-ratio:9/16;color:white;box-shadow:var(--shadow-lg);border:8px solid #1a1a1a">
            <img src="${imageUrl}" onerror="this.src='${fallbackImg}'" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:0.8">
            <div style="position:absolute;top:0;left:0;right:0;height:100px;background:linear-gradient(to bottom, rgba(0,0,0,0.6), transparent);padding:1.5rem;display:flex;align-items:center;gap:0.75rem;z-index:2">
              <div style="width:32px;height:32px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:0.7rem;border:2px solid white">N</div>
              <div style="font-weight:700;font-size:0.85rem;text-shadow:0 1px 2px rgba(0,0,0,0.5)">Contabilidade Nobel</div>
            </div>
            <div style="position:relative;z-index:1;padding:2rem;display:flex;flex-direction:column;height:100%;justify-content:flex-end;padding-bottom:5rem">
              <div style="font-weight:900;font-size:1.8rem;margin-bottom:1rem;line-height:1.1;text-shadow:0 2px 10px rgba(0,0,0,0.8)">${result.title}</div>
              <div style="font-size:1rem;line-height:1.4;margin-bottom:2rem;background:rgba(0,0,0,0.4);padding:1rem;border-radius:12px;backdrop-filter:blur(4px)">${result.content}</div>
              <div style="background:white;color:black;padding:0.8rem;border-radius:100px;font-weight:800;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.3);letter-spacing:1px;font-size:0.8rem">${result.cta || 'SAIBA MAIS'}</div>
            </div>
          </div>`;
      } else if (type === 'reels') {
        html = `
          <div style="max-width:350px;margin:0 auto;background:#000;border-radius:24px;overflow:hidden;position:relative;aspect-ratio:9/16;color:white;box-shadow:var(--shadow-lg);border:8px solid #1a1a1a">
            <img src="${imageUrl}" onerror="this.src='${fallbackImg}'" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:0.7">
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2;opacity:0.6">
              <div style="width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,0.2);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center">
                <div style="width: 0; height: 0; border-top: 10px solid transparent; border-bottom: 10px solid transparent; border-left: 15px solid white; margin-left: 5px"></div>
              </div>
            </div>
            <div style="position:relative;z-index:1;padding:1.5rem;display:flex;flex-direction:column;height:100%;justify-content:flex-end;background:linear-gradient(to top, rgba(0,0,0,0.9), transparent 40%)">
              <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem">
                <div style="width:32px;height:32px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:0.7rem;border:1px solid white">N</div>
                <div style="font-weight:700;font-size:0.9rem">Contabilidade Nobel • Seguir</div>
              </div>
              <div style="font-weight:700;font-size:1.1rem;margin-bottom:0.5rem">${result.title}</div>
              <div style="font-size:0.9rem;line-height:1.4;margin-bottom:1rem;color:rgba(255,255,255,0.9)">${result.content}</div>
              <div style="display:flex;gap:0.5rem;overflow:hidden;white-space:nowrap">
                 ${result.hashtags.map(h => `<span style="font-size:0.75rem;opacity:0.8">#${h}</span>`).join(' ')}
              </div>
            </div>
          </div>`;
      } else if (type === 'artigo') {
        html = `
          <div style="max-width:850px;margin:0 auto;background:var(--bg-elevated);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-lg);border:1px solid var(--border)">
            <div style="position:relative">
              <img src="${imageUrl}" onerror="this.src='${fallbackImg}'" style="width:100%;height:450px;object-fit:cover">
              <div style="position:absolute;bottom:0;left:0;right:0;padding:3rem;background:linear-gradient(to top, var(--bg-elevated), transparent)">
                <div style="display:flex;gap:1rem;margin-bottom:1rem">
                  <span style="background:var(--accent);color:white;padding:0.25rem 0.75rem;border-radius:100px;font-size:0.75rem;font-weight:700;text-transform:uppercase">Insights Nobel</span>
                  <span style="color:rgba(255,255,255,0.8);font-size:0.8rem">Leitura de 5 min</span>
                </div>
                <h1 style="color:var(--text);margin:0;font-size:2.5rem;font-weight:800;line-height:1.2">${result.title}</h1>
              </div>
            </div>
            <div style="padding:4rem;max-width:700px;margin:0 auto">
              <div style="line-height:2;color:var(--text);font-size:1.2rem;letter-spacing:-0.01em">
                ${result.content.split('\n').map(p => p.trim() ? `<p style="margin-bottom:2rem">${p}</p>` : '').join('')}
              </div>
              <div style="margin-top:4rem;padding-top:2rem;border-top:2px solid var(--border);display:flex;flex-direction:column;gap:2rem">
                <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
                  ${result.hashtags.map(h => `<span style="background:var(--bg-hover);color:var(--accent);padding:0.5rem 1rem;border-radius:8px;font-weight:600;font-size:0.9rem">#${h}</span>`).join('')}
                </div>
                <div style="background:var(--primary);color:white;padding:2.5rem;border-radius:var(--radius);text-align:center">
                  <h3 style="margin-bottom:1rem;font-size:1.5rem">${result.cta || 'Transforme sua Gestão'}</h3>
                  <p style="opacity:0.9;margin-bottom:2rem">Agende uma consultoria estratégica com o time da Nobel.</p>
                  <button style="background:white;color:var(--primary);border:none;padding:1rem 2rem;border-radius:100px;font-weight:800;cursor:pointer">Falar com Especialista</button>
                </div>
              </div>
            </div>
          </div>`;
      } else {
        html = `
          <div style="max-width:550px;margin:0 auto;background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-lg)">
            <div style="padding:1.25rem;display:flex;align-items:center;gap:1rem">
              <div style="width:45px;height:45px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1.1rem">N</div>
              <div>
                <div style="font-weight:800;font-size:1rem">Contabilidade Nobel</div>
                <div style="font-size:0.8rem;color:var(--text-muted)">Estratégia & Inteligência Fiscal</div>
              </div>
            </div>
            <img src="${imageUrl}" onerror="this.src='${fallbackImg}'" style="width:100%;aspect-ratio:1;object-fit:cover">
            <div style="padding:2rem">
              <div style="font-weight:800;margin-bottom:1rem;font-size:1.4rem;color:var(--primary)">${result.title}</div>
              <div style="line-height:1.7;color:var(--text);margin-bottom:1.5rem;font-size:1.05rem">${result.content.replace(/\n/g, '<br>')}</div>
              <div style="color:var(--accent);font-weight:700;margin-bottom:1.5rem;display:flex;gap:0.5rem;flex-wrap:wrap">
                ${result.hashtags.map(h => `#${h}`).join(' ')}
              </div>
              <div style="border-top:1px solid var(--border);padding-top:1.5rem">
                <div style="font-weight:700;color:var(--primary);font-size:0.9rem;letter-spacing:1px">${result.cta || 'SAIBA MAIS'}</div>
              </div>
            </div>
          </div>`;
      }
      content.innerHTML = html;
    }
  } catch (err) {
    content.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--danger)"><i data-lucide="alert-circle" style="width:48px;height:48px;margin-bottom:1rem"></i><br>Erro ao gerar conteúdo: ${err.message}</div>`;
    if (window.lucide) window.lucide.createIcons();
  }
};
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
