// Define showView globally explicitly
window.showView = function(viewId, target = null) {
  console.log('showView called with:', viewId);
  // Esconder todas as views
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('active');
    v.style.display = 'none';
  });

  // Mostrar a view solicitada
  const targetView = document.getElementById('view-' + viewId);
  if (targetView) {
    targetView.classList.add('active');
    targetView.style.display = 'block';
    console.log('Target view set to display:block', targetView.id);
  } else {
    console.warn('Target view not found:', 'view-' + viewId);
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

  // Inicializar componentes específicos
  if (viewId === 'dashboard') {
    setTimeout(() => {
      if (typeof window.initCharts === 'function') window.initCharts();
    }, 100);
  }
  if (viewId === 'fiscal') {
    setTimeout(() => {
      if (typeof window.initFiscalCalendar === 'function') window.initFiscalCalendar();
    }, 100);
  }
  if (viewId === 'agenda') {
    setTimeout(() => {
      if (typeof window.initAgendaCalendar === 'function') window.initAgendaCalendar();
    }, 100);
  }
  if (viewId === 'prospeccao') {
    setTimeout(() => {
      if (typeof window.filterProspeccao === 'function') window.filterProspeccao();
    }, 100);
  }

  if (window.lucide) window.lucide.createIcons();
}

// Toggle sidebar mobile
window.toggleSidebar = function() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('open');
}

// Toggle tema
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
}

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
}

// Fiscal Calendar
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

  const urgentDays = [10, 15, 20, 25, 30];
  const warningDays = [5, 12, 18, 22, 28];
  const doneDays = [1, 3, 7, 8, 14];

  for (let i = 1; i <= 30; i++) {
    const day = document.createElement('div');
    day.className = 'cal-day';
    day.textContent = i;
    if (i === 8) day.classList.add('today');
    if (urgentDays.includes(i)) { day.classList.add('has-event', 'danger'); day.style.borderColor = 'var(--danger)'; }
    if (warningDays.includes(i)) { day.classList.add('has-event'); day.style.borderColor = 'var(--warning)'; }
    if (doneDays.includes(i)) { day.classList.add('has-event'); day.style.borderColor = 'var(--accent)'; }
    cal.appendChild(day);
  }
}

// Agenda Calendar
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
  const eventDays = [8, 10, 12, 15, 18, 20, 22, 25];
  for (let i = 1; i <= 30; i++) {
    const day = document.createElement('div');
    day.className = 'cal-day';
    day.textContent = i;
    if (i === 8) day.classList.add('today');
    if (eventDays.includes(i)) day.classList.add('has-event');
    cal.appendChild(day);
  }
}

// Chat IA
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

  setTimeout(() => {
    const respostas = [
      'Analisando os dados da empresa... O planejamento tributário indicado é a transição para Lucro Presumido, com economia estimada de R$ 12.400/mês.',
      'Com base na DRE do último trimestre, identifiquei oportunidades de redução de 15% na carga de PIS/COFINS. Posso gerar um relatório detalhado.',
      'A proposta para TechSolutions Brasil está pronta. Inclui serviços de contabilidade, fiscal e BPO financeiro por R$ 4.200/mês. Deseja revisar?',
      'O SPED Fiscal do cliente #482 foi validado com sucesso. Nenhuma inconsistência encontrada. Posso prosseguir com o envio?'
    ];
    const resp = respostas[Math.floor(Math.random() * respostas.length)];
    container.innerHTML += `
      <div class="chat-message ai">
        <div class="chat-avatar ai"><i data-lucide="sparkles" style="width:18px"></i></div>
        <div class="chat-bubble">${resp}</div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    container.scrollTop = container.scrollHeight;
  }, 1500);
}

// DADOS DE PROSPECÇÃO
const empresasProspeccao = [
  {"nome": "Clínica Médica Montes Claros", "cat": "Clínicas médicas", "cidade": "Montes Claros", "endereco": "Av. Deputado Esteves Rodrigues, 1000", "site": "www.clinicamoc.com.br", "tel": "(38) 3221-1000", "avaliacoes": 156, "nota": 4.8, "funcionarios": 25, "score": 96, "regime": "Simples Nacional", "oportunidade": "alta"},
  {"nome": "Hospital do Norte de Minas", "cat": "Hospitais", "cidade": "Montes Claros", "endereco": "Rua Santa Maria, 500", "site": "www.hospitalnorte.com.br", "tel": "(38) 3222-2000", "avaliacoes": 420, "nota": 4.9, "funcionarios": 180, "score": 98, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "Agropecuária Janaúba", "cat": "Agronegócio", "cidade": "Janaúba", "endereco": "Av. do Comércio, 200", "site": "www.agrojanauba.com.br", "tel": "(38) 3821-3000", "avaliacoes": 85, "nota": 4.7, "funcionarios": 12, "score": 92, "regime": "Simples Nacional", "oportunidade": "alta"},
  {"nome": "Frigorífico Januária", "cat": "Indústrias alimentícias", "cidade": "Januária", "endereco": "Rodovia BR-135, KM 10", "site": "www.frigorificojanuaria.com.br", "tel": "(38) 3621-4000", "avaliacoes": 110, "nota": 4.6, "funcionarios": 45, "score": 94, "regime": "Lucro Presumido", "oportunidade": "alta"},
  {"nome": "Comércio de Salinas", "cat": "Varejo", "cidade": "Salinas", "endereco": "Av. Principal, 300", "site": "www.comerciosalinas.com.br", "tel": "(38) 3841-5000", "avaliacoes": 92, "nota": 4.5, "funcionarios": 18, "score": 88, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Hotel Pirapora", "cat": "Turismo e Hotelaria", "cidade": "Pirapora", "endereco": "Rua da Orla, 100", "site": "www.hotelpirapora.com.br", "tel": "(38) 3741-6000", "avaliacoes": 134, "nota": 4.7, "funcionarios": 22, "score": 90, "regime": "Lucro Presumido", "oportunidade": "alta"},
  {"nome": "Laticínios Bocaiúva", "cat": "Indústrias alimentícias", "cidade": "Bocaiúva", "endereco": "Av. JK, 800", "site": "www.laticiniosbocaiuva.com.br", "tel": "(38) 3251-7000", "avaliacoes": 76, "nota": 4.4, "funcionarios": 30, "score": 89, "regime": "Lucro Presumido", "oportunidade": "alta"},
  {"nome": "Mineração Porteirinha", "cat": "Mineração", "cidade": "Porteirinha", "endereco": "Serra do Espinhaço, S/N", "site": "www.mineracaoporteirinha.com.br", "tel": "(38) 3831-8000", "avaliacoes": 45, "nota": 4.2, "funcionarios": 65, "score": 93, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "Transportadora Francisco Sá", "cat": "Logística", "cidade": "Francisco Sá", "endereco": "Rodovia BR-251, KM 50", "site": "www.transfranciscosa.com.br", "tel": "(38) 3231-9000", "avaliacoes": 58, "nota": 4.3, "funcionarios": 28, "score": 87, "regime": "Lucro Presumido", "oportunidade": "media"},
  {"nome": "Cooperativa Jaíba", "cat": "Cooperativas", "cidade": "Jaíba", "endereco": "Projeto Jaíba, Gleba C", "site": "www.coopjaiba.com.br", "tel": "(38) 3833-1000", "avaliacoes": 200, "nota": 4.8, "funcionarios": 120, "score": 95, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "Laboratório Análises Precisas", "cat": "Laboratórios", "cidade": "Porto Alegre", "endereco": "Av. Ipiranga, 1500", "site": "www.analiseprecisa.com.br", "tel": "(51) 8901-2345", "avaliacoes": 78, "nota": 4.6, "funcionarios": 31, "score": 85, "regime": "Lucro Presumido", "oportunidade": "alta"},
  {"nome": "Pizzaria Napoli", "cat": "Pizzarias", "cidade": "São Paulo", "endereco": "Rua dos Italianos, 100", "site": "www.pizzarianapoli.com.br", "tel": "(11) 9012-3456", "avaliacoes": 234, "nota": 4.8, "funcionarios": 14, "score": 79, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Incorporadora Vista Mar", "cat": "Incorporadoras", "cidade": "Salvador", "endereco": "Av. Oceânica, 500", "site": "www.vistamar.com.br", "tel": "(71) 9012-3456", "avaliacoes": 34, "nota": 4.2, "funcionarios": 28, "score": 74, "regime": "Lucro Presumido", "oportunidade": "media"},
  {"nome": "Clínica Veterinária PetVida", "cat": "Clínicas veterinárias", "cidade": "Curitiba", "endereco": "Rua dos Animais, 300", "site": "www.petvida.com.br", "tel": "(41) 9012-3456", "avaliacoes": 112, "nota": 4.9, "funcionarios": 8, "score": 80, "regime": "Simples Nacional", "oportunidade": "alta"},
  {"nome": "Distribuidora Alimentos Geral", "cat": "Distribuidoras de alimentos", "cidade": "Belo Horizonte", "endereco": "Av. Antônio Carlos, 2500", "site": "www.alimentosgeral.com.br", "tel": "(31) 9012-3456", "avaliacoes": 45, "nota": 4.3, "funcionarios": 52, "score": 83, "regime": "Lucro Presumido", "oportunidade": "alta"},
  {"nome": "Startup FinTech Nova", "cat": "Startups", "cidade": "São Paulo", "endereco": "Av. Brigadeiro Faria Lima, 4000", "site": "www.fintechnova.com.br", "tel": "(11) 0123-4567", "avaliacoes": 23, "nota": 4.5, "funcionarios": 15, "score": 78, "regime": "Lucro Real", "oportunidade": "media"},
  {"nome": "Marcenaria Artesanal", "cat": "Marcenarias", "cidade": "Florianópolis", "endereco": "Rua das Oficinas, 80", "site": "www.marcenariaartesanal.com.br", "tel": "(48) 0123-4567", "avaliacoes": 34, "nota": 4.6, "funcionarios": 5, "score": 55, "regime": "MEI", "oportunidade": "baixa"},
  {"nome": "Escola de Idiomas Global", "cat": "Escolas de idiomas", "cidade": "Rio de Janeiro", "endereco": "Av. Nossa Senhora, 600", "site": "www.idiomaglobal.com.br", "tel": "(21) 0123-4567", "avaliacoes": 67, "nota": 4.4, "funcionarios": 18, "score": 70, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Lava-rápido Express", "cat": "Lava-rápidos", "cidade": "São Paulo", "endereco": "Av. Interlagos, 2000", "site": "www.lavarapidoexpress.com.br", "tel": "(11) 1234-5678", "avaliacoes": 89, "nota": 4.3, "funcionarios": 6, "score": 53, "regime": "MEI", "oportunidade": "baixa"},
  {"nome": "Empresa de RH Talentos", "cat": "Empresas de RH", "cidade": "Curitiba", "endereco": "Rua Dr. Pedrosa, 400", "site": "www.rhtalentos.com.br", "tel": "(41) 1234-5678", "avaliacoes": 34, "nota": 4.5, "funcionarios": 12, "score": 68, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Indústria Têxtil ModaBrasil", "cat": "Indústrias têxteis", "cidade": "São Paulo", "endereco": "Av. do Estado, 5000", "site": "www.modabrasil.com.br", "tel": "(11) 2345-6789", "avaliacoes": 56, "nota": 4.2, "funcionarios": 78, "score": 86, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "Supermercado Família", "cat": "Supermercados", "cidade": "Belo Horizonte", "endereco": "Av. Amazonas, 3000", "site": "www.superfamilia.com.br", "tel": "(31) 2345-6789", "avaliacoes": 234, "nota": 4.5, "funcionarios": 45, "score": 84, "regime": "Lucro Presumido", "oportunidade": "alta"},
  {"nome": "Ótica Visão Clara", "cat": "Óticas", "cidade": "Porto Alegre", "endereco": "Rua dos Óculos, 100", "site": "www.visionclara.com.br", "tel": "(51) 2345-6789", "avaliacoes": 45, "nota": 4.6, "funcionarios": 4, "score": 60, "regime": "MEI", "oportunidade": "media"},
  {"nome": "Despachante Documentos Fácil", "cat": "Despachantes", "cidade": "São Paulo", "endereco": "Rua 25 de Março, 200", "site": "www.documentosfacil.com.br", "tel": "(11) 3456-7890", "avaliacoes": 67, "nota": 4.3, "funcionarios": 3, "score": 44, "regime": "MEI", "oportunidade": "baixa"},
  {"nome": "Studio Pilates Corpo & Mente", "cat": "Studios de pilates", "cidade": "Rio de Janeiro", "endereco": "Av. das Américas, 1500", "site": "www.corpomente.com.br", "tel": "(21) 3456-7890", "avaliacoes": 123, "nota": 4.8, "funcionarios": 9, "score": 82, "regime": "Simples Nacional", "oportunidade": "alta"},
  {"nome": "Empresa de Limpeza Brilho", "cat": "Empresas de limpeza", "cidade": "São Paulo", "endereco": "Av. Paulista, 2000", "site": "www.brilholimpeza.com.br", "tel": "(11) 4567-8901", "avaliacoes": 34, "nota": 4.4, "funcionarios": 67, "score": 77, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Loja de Móveis Conforto", "cat": "Lojas de móveis", "cidade": "Curitiba", "endereco": "Rua 24 Horas, 500", "site": "www.confortomoveis.com.br", "tel": "(41) 4567-8901", "avaliacoes": 78, "nota": 4.5, "funcionarios": 8, "score": 66, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Empresa de Segurança Guardião", "cat": "Empresas de segurança", "cidade": "Belo Horizonte", "endereco": "Av. Contorno, 3000", "site": "www.guardiaoseg.com.br", "tel": "(31) 4567-8901", "avaliacoes": 23, "nota": 4.2, "funcionarios": 89, "score": 81, "regime": "Lucro Presumido", "oportunidade": "alta"},
  {"nome": "Auto Elétrica Voltagem", "cat": "Auto elétricas", "cidade": "São Paulo", "endereco": "Av. do Estado, 4000", "site": "www.voltagemauto.com.br", "tel": "(11) 5678-9012", "avaliacoes": 34, "nota": 4.3, "funcionarios": 4, "score": 49, "regime": "MEI", "oportunidade": "baixa"},
  {"nome": "Faculdade Saber", "cat": "Faculdades", "cidade": "Rio de Janeiro", "endereco": "Av. Maracanã, 1000", "site": "www.faculdadesaber.com.br", "tel": "(21) 5678-9012", "avaliacoes": 156, "nota": 4.6, "funcionarios": 234, "score": 95, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "Marketplace ProdutosBR", "cat": "Marketplaces", "cidade": "São Paulo", "endereco": "Av. Faria Lima, 5000", "site": "www.produtosbr.com.br", "tel": "(11) 6789-0123", "avaliacoes": 89, "nota": 4.4, "funcionarios": 45, "score": 87, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "Creche Mundo Infantil", "cat": "Creches", "cidade": "Curitiba", "endereco": "Rua das Crianças, 300", "site": "www.mundoinfantil.com.br", "tel": "(41) 6789-0123", "avaliacoes": 67, "nota": 4.7, "funcionarios": 23, "score": 79, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Empresa de Eventos FestaTop", "cat": "Empresas de eventos", "cidade": "Belo Horizonte", "endereco": "Av. Raja Gabaglia, 800", "site": "www.festatop.com.br", "tel": "(31) 6789-0123", "avaliacoes": 45, "nota": 4.5, "funcionarios": 12, "score": 73, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Hamburgueria Smash Burger", "cat": "Hamburguerias", "cidade": "São Paulo", "endereco": "Rua da Consolação, 1000", "site": "www.smashburger.com.br", "tel": "(11) 7890-1234", "avaliacoes": 345, "nota": 4.9, "funcionarios": 16, "score": 88, "regime": "Simples Nacional", "oportunidade": "alta"},
  {"nome": "Metalúrgica Ferro Forte", "cat": "Metalúrgicas", "cidade": "Porto Alegre", "endereco": "Av. Sertório, 2000", "site": "www.ferroforte.com.br", "tel": "(51) 7890-1234", "avaliacoes": 23, "nota": 4.2, "funcionarios": 67, "score": 82, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "Consultoria Empresarial Nexus", "cat": "Consultorias empresariais", "cidade": "São Paulo", "endereco": "Av. Brigadeiro, 3000", "site": "www.nexusconsult.com.br", "tel": "(11) 8901-2345", "avaliacoes": 34, "nota": 4.6, "funcionarios": 14, "score": 75, "regime": "Lucro Real", "oportunidade": "media"},
  {"nome": "Papelaria Papel & Cia", "cat": "Papelarias", "cidade": "Rio de Janeiro", "endereco": "Rua do Ouvidor, 100", "site": "www.papelecia.com.br", "tel": "(21) 8901-2345", "avaliacoes": 56, "nota": 4.4, "funcionarios": 3, "score": 42, "regime": "MEI", "oportunidade": "baixa"},
  {"nome": "Clínica de Fisioterapia Movimento", "cat": "Clínicas de fisioterapia", "cidade": "Curitiba", "endereco": "Rua XV de Novembro, 800", "site": "www.movimentofisio.com.br", "tel": "(41) 8901-2345", "avaliacoes": 89, "nota": 4.8, "funcionarios": 10, "score": 83, "regime": "Simples Nacional", "oportunidade": "alta"},
  {"nome": "Revenda de Veículos AutoPremium", "cat": "Revendas de veículos", "cidade": "Belo Horizonte", "endereco": "Av. Cristiano Machado, 5000", "site": "www.autopremium.com.br", "tel": "(31) 8901-2345", "avaliacoes": 67, "nota": 4.3, "funcionarios": 18, "score": 76, "regime": "Lucro Presumido", "oportunidade": "media"},
  {"nome": "Açougue Casa da Carne", "cat": "Açougues", "cidade": "São Paulo", "endereco": "Rua 25 de Março, 500", "site": "www.casadacarne.com.br", "tel": "(11) 9012-3456", "avaliacoes": 78, "nota": 4.5, "funcionarios": 7, "score": 64, "regime": "MEI", "oportunidade": "media"},
  {"nome": "Empresa de Automação SmartHome", "cat": "Empresas de automação", "cidade": "Florianópolis", "endereco": "Av. Beira Mar, 1000", "site": "www.smarthome.com.br", "tel": "(48) 9012-3456", "avaliacoes": 34, "nota": 4.6, "funcionarios": 11, "score": 74, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Indústria Plástica PoliPlus", "cat": "Indústrias plásticas", "cidade": "São Paulo", "endereco": "Av. do Estado, 6000", "site": "www.poliplus.com.br", "tel": "(11) 0123-4567", "avaliacoes": 23, "nota": 4.2, "funcionarios": 56, "score": 80, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "Centro de Diagnóstico Imagem", "cat": "Centros de diagnóstico", "cidade": "Rio de Janeiro", "endereco": "Av. Brasil, 3000", "site": "www.imagemdiagnostico.com.br", "tel": "(21) 0123-4567", "avaliacoes": 112, "nota": 4.7, "funcionarios": 34, "score": 89, "regime": "Lucro Presumido", "oportunidade": "alta"},
  {"nome": "Loja de Calçados Passo Firme", "cat": "Lojas de calçados", "cidade": "Curitiba", "endereco": "Rua das Flores, 800", "site": "www.passofirme.com.br", "tel": "(41) 0123-4567", "avaliacoes": 45, "nota": 4.3, "funcionarios": 5, "score": 54, "regime": "MEI", "oportunidade": "baixa"},
  {"nome": "Funilaria Carro Novo", "cat": "Funilarias", "cidade": "Belo Horizonte", "endereco": "Av. Pedro II, 2000", "site": "www.carronovo.com.br", "tel": "(31) 0123-4567", "avaliacoes": 34, "nota": 4.1, "funcionarios": 6, "score": 47, "regime": "MEI", "oportunidade": "baixa"},
  {"nome": "Curso Profissionalizante ProFissional", "cat": "Cursos profissionalizantes", "cidade": "São Paulo", "endereco": "Av. Paulista, 3000", "site": "www.profissional.com.br", "tel": "(11) 1234-5678", "avaliacoes": 67, "nota": 4.5, "funcionarios": 15, "score": 72, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Escritório de Engenharia Estrutura", "cat": "Escritórios de engenharia", "cidade": "Porto Alegre", "endereco": "Av. Ipiranga, 3000", "site": "www.estruturaeng.com.br", "tel": "(51) 1234-5678", "avaliacoes": 23, "nota": 4.4, "funcionarios": 12, "score": 70, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Serralheria Ferro & Arte", "cat": "Serralherias", "cidade": "São Paulo", "endereco": "Av. do Estado, 7000", "site": "www.ferroarte.com.br", "tel": "(11) 2345-6789", "avaliacoes": 34, "nota": 4.3, "funcionarios": 4, "score": 46, "regime": "MEI", "oportunidade": "baixa"},
  {"nome": "Loja de Brinquedos Mundo Mágico", "cat": "Lojas de brinquedos", "cidade": "Rio de Janeiro", "endereco": "Av. Rio Branco, 500", "site": "www.mundomagico.com.br", "tel": "(21) 2345-6789", "avaliacoes": 56, "nota": 4.5, "funcionarios": 4, "score": 51, "regime": "MEI", "oportunidade": "baixa"},
  {"nome": "Corretor de Imóveis ImóveisBR", "cat": "Corretores de imóveis", "cidade": "Curitiba", "endereco": "Rua XV de Novembro, 1200", "site": "www.imoveisbr.com.br", "tel": "(41) 2345-6789", "avaliacoes": 78, "nota": 4.4, "funcionarios": 8, "score": 63, "regime": "MEI", "oportunidade": "media"},
  {"nome": "Locadora de Veículos Rápida", "cat": "Locadoras de veículos", "cidade": "Belo Horizonte", "endereco": "Av. Amazonas, 4000", "site": "www.rapidaveiculos.com.br", "tel": "(31) 2345-6789", "avaliacoes": 45, "nota": 4.2, "funcionarios": 14, "score": 71, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Indústria Química QuimBrasil", "cat": "Indústrias químicas", "cidade": "São Paulo", "endereco": "Av. do Estado, 8000", "site": "www.quimbrasil.com.br", "tel": "(11) 3456-7890", "avaliacoes": 23, "nota": 4.1, "funcionarios": 89, "score": 87, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "Cafeteria Café Gourmet", "cat": "Cafeterias", "cidade": "Rio de Janeiro", "endereco": "Rua do Ouvidor, 200", "site": "www.cafegourmet.com.br", "tel": "(21) 3456-7890", "avaliacoes": 134, "nota": 4.8, "funcionarios": 9, "score": 81, "regime": "Simples Nacional", "oportunidade": "alta"},
  {"nome": "Escola Técnica TechEdu", "cat": "Escolas técnicas", "cidade": "Curitiba", "endereco": "Rua Dr. Pedrosa, 800", "site": "www.techedu.com.br", "tel": "(41) 3456-7890", "avaliacoes": 45, "nota": 4.5, "funcionarios": 28, "score": 78, "regime": "Lucro Presumido", "oportunidade": "media"},
  {"nome": "Joalheria Ouro Brilhante", "cat": "Joalherias", "cidade": "Belo Horizonte", "endereco": "Av. Afonso Pena, 1000", "site": "www.ourobrilhante.com.br", "tel": "(31) 3456-7890", "avaliacoes": 34, "nota": 4.6, "funcionarios": 3, "score": 50, "regime": "MEI", "oportunidade": "baixa"},
  {"nome": "Empresa de Terceirização Outsourcing", "cat": "Empresas de terceirização", "cidade": "São Paulo", "endereco": "Av. Paulista, 4000", "site": "www.outsourcing.com.br", "tel": "(11) 4567-8901", "avaliacoes": 23, "nota": 4.3, "funcionarios": 234, "score": 91, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "Vidraçaria Cristal", "cat": "Vidraçarias", "cidade": "Rio de Janeiro", "endereco": "Av. Brasil, 4000", "site": "www.cristalvidros.com.br", "tel": "(21) 4567-8901", "avaliacoes": 34, "nota": 4.4, "funcionarios": 7, "score": 61, "regime": "MEI", "oportunidade": "media"},
  {"nome": "Empresa de Internet NetRápida", "cat": "Provedores de internet", "cidade": "Curitiba", "endereco": "Av. das Torres, 1000", "site": "www.netrapida.com.br", "tel": "(41) 4567-8901", "avaliacoes": 67, "nota": 4.2, "funcionarios": 34, "score": 79, "regime": "Lucro Presumido", "oportunidade": "media"},
  {"nome": "Marmoraria Mármore & Cia", "cat": "Marmorarias", "cidade": "Belo Horizonte", "endereco": "Av. Contorno, 4000", "site": "www.marmorecia.com.br", "tel": "(31) 4567-8901", "avaliacoes": 23, "nota": 4.5, "funcionarios": 8, "score": 62, "regime": "MEI", "oportunidade": "media"},
  {"nome": "Loja de Roupas Estilo Fashion", "cat": "Lojas de roupas", "cidade": "São Paulo", "endereco": "Rua Oscar Freire, 1000", "site": "www.estilofashion.com.br", "tel": "(11) 5678-9012", "avaliacoes": 89, "nota": 4.4, "funcionarios": 6, "score": 59, "regime": "MEI", "oportunidade": "media"},
  {"nome": "Agência de Turismo ViajeBem", "cat": "Agências de turismo", "cidade": "Rio de Janeiro", "endereco": "Av. Atlântica, 1000", "site": "www.viajebem.com.br", "tel": "(21) 5678-9012", "avaliacoes": 45, "nota": 4.3, "funcionarios": 7, "score": 57, "regime": "MEI", "oportunidade": "baixa"},
  {"nome": "Loja de Utilidades Casa Prática", "cat": "Lojas de utilidades domésticas", "cidade": "Curitiba", "endereco": "Rua 24 Horas, 1000", "site": "www.casapratica.com.br", "tel": "(41) 5678-9012", "avaliacoes": 56, "nota": 4.4, "funcionarios": 4, "score": 50, "regime": "MEI", "oportunidade": "baixa"},
  {"nome": "Empresa de Pintura Colorida", "cat": "Empresas de pintura", "cidade": "Belo Horizonte", "endereco": "Av. Pedro II, 3000", "site": "www.coloridapintura.com.br", "tel": "(31) 5678-9012", "avaliacoes": 34, "nota": 4.3, "funcionarios": 5, "score": 45, "regime": "MEI", "oportunidade": "baixa"},
  {"nome": "Loja de Colchões Sono Bem", "cat": "Lojas de colchões", "cidade": "São Paulo", "endereco": "Av. do Estado, 9000", "site": "www.sonobem.com.br", "tel": "(11) 6789-0123", "avaliacoes": 67, "nota": 4.5, "funcionarios": 6, "score": 58, "regime": "MEI", "oportunidade": "media"},
  {"nome": "Escritório de Arquitetura ArquiNova", "cat": "Escritórios de arquitetura", "cidade": "Rio de Janeiro", "endereco": "Av. Rio Branco, 800", "site": "www.arquinova.com.br", "tel": "(21) 6789-0123", "avaliacoes": 34, "nota": 4.6, "funcionarios": 11, "score": 75, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Empresa de Reformas Reforma Fácil", "cat": "Empresas de reformas", "cidade": "Curitiba", "endereco": "Rua das Flores, 1500", "site": "www.reformafacil.com.br", "tel": "(41) 6789-0123", "avaliacoes": 45, "nota": 4.4, "funcionarios": 8, "score": 62, "regime": "MEI", "oportunidade": "media"},
  {"nome": "Curso Online EducaDigital", "cat": "Cursos online", "cidade": "Belo Horizonte", "endereco": "Av. Amazonas, 5000", "site": "www.educadigital.com.br", "tel": "(31) 6789-0123", "avaliacoes": 234, "nota": 4.7, "funcionarios": 19, "score": 84, "regime": "Simples Nacional", "oportunidade": "alta"},
  {"nome": "Reforço Escolar Aprenda Mais", "cat": "Reforço escolar", "cidade": "São Paulo", "endereco": "Av. Paulista, 5000", "site": "www.aprendamais.com.br", "tel": "(11) 7890-1234", "avaliacoes": 56, "nota": 4.5, "funcionarios": 8, "score": 65, "regime": "MEI", "oportunidade": "media"},
  {"nome": "Escola de Música Som & Arte", "cat": "Escolas de música", "cidade": "Rio de Janeiro", "endereco": "Rua do Ouvidor, 300", "site": "www.somarte.com.br", "tel": "(21) 7890-1234", "avaliacoes": 34, "nota": 4.6, "funcionarios": 5, "score": 56, "regime": "MEI", "oportunidade": "baixa"},
  {"nome": "Desenvolvedor de Apps AppMaster", "cat": "Desenvolvedores de aplicativos", "cidade": "Curitiba", "endereco": "Av. das Torres, 2000", "site": "www.appmaster.com.br", "tel": "(41) 7890-1234", "avaliacoes": 23, "nota": 4.5, "funcionarios": 12, "score": 73, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Consultoria Tecnológica TechAdvise", "cat": "Consultorias tecnológicas", "cidade": "Belo Horizonte", "endereco": "Av. Contorno, 5000", "site": "www.techadvise.com.br", "tel": "(31) 7890-1234", "avaliacoes": 34, "nota": 4.4, "funcionarios": 9, "score": 69, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Empresa de Recrutamento TalentFinder", "cat": "Empresas de recrutamento", "cidade": "São Paulo", "endereco": "Av. Faria Lima, 6000", "site": "www.talentfinder.com.br", "tel": "(11) 8901-2345", "avaliacoes": 45, "nota": 4.3, "funcionarios": 15, "score": 72, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Treinamentos Corporativos CorpTrain", "cat": "Treinamentos corporativos", "cidade": "Rio de Janeiro", "endereco": "Av. Brasil, 5000", "site": "www.corptrain.com.br", "tel": "(21) 8901-2345", "avaliacoes": 23, "nota": 4.5, "funcionarios": 11, "score": 71, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Indústria Farmacêutica FarmaPlus", "cat": "Indústrias farmacêuticas", "cidade": "Curitiba", "endereco": "Rua Dr. Pedrosa, 1200", "site": "www.farmaplus.com.br", "tel": "(41) 8901-2345", "avaliacoes": 12, "nota": 4.2, "funcionarios": 156, "score": 94, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "Fábrica de Embalagens PackPlus", "cat": "Fábricas de embalagens", "cidade": "Belo Horizonte", "endereco": "Av. Amazonas, 6000", "site": "www.packplus.com.br", "tel": "(31) 8901-2345", "avaliacoes": 23, "nota": 4.3, "funcionarios": 67, "score": 83, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "Clínica de Emagrecimento SlimFit", "cat": "Clínicas de emagrecimento", "cidade": "São Paulo", "endereco": "Av. Paulista, 6000", "site": "www.slimfit.com.br", "tel": "(11) 9012-3456", "avaliacoes": 89, "nota": 4.7, "funcionarios": 14, "score": 85, "regime": "Simples Nacional", "oportunidade": "alta"},
  {"nome": "Impressão 3D FuturePrint", "cat": "Impressão 3D", "cidade": "Rio de Janeiro", "endereco": "Av. Rio Branco, 1000", "site": "www.futureprint.com.br", "tel": "(21) 9012-3456", "avaliacoes": 23, "nota": 4.4, "funcionarios": 7, "score": 66, "regime": "MEI", "oportunidade": "media"},
  {"nome": "Centro Logístico LogiCenter", "cat": "Centros logísticos", "cidade": "Curitiba", "endereco": "Av. das Torres, 3000", "site": "www.logcenter.com.br", "tel": "(41) 9012-3456", "avaliacoes": 12, "nota": 4.2, "funcionarios": 89, "score": 86, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "Influenciador Digital ContentPro", "cat": "Influenciadores e produtores de conteúdo", "cidade": "Belo Horizonte", "endereco": "Av. Contorno, 6000", "site": "www.contentpro.com.br", "tel": "(31) 9012-3456", "avaliacoes": 456, "nota": 4.8, "funcionarios": 5, "score": 67, "regime": "MEI", "oportunidade": "media"},
  {"nome": "Hortifruti Fresco & Natural", "cat": "Hortifrutis", "cidade": "São Paulo", "endereco": "Rua 25 de Março, 1000", "site": "www.fresconatural.com.br", "tel": "(11) 0123-4567", "avaliacoes": 78, "nota": 4.5, "funcionarios": 9, "score": 68, "regime": "MEI", "oportunidade": "media"},
  {"nome": "Lanchonete Sabor Rápido", "cat": "Lanchonetes", "cidade": "Rio de Janeiro", "endereco": "Av. Atlântica, 1500", "site": "www.saborrapido.com.br", "tel": "(21) 0123-4567", "avaliacoes": 134, "nota": 4.6, "funcionarios": 8, "score": 72, "regime": "MEI", "oportunidade": "media"},
  {"nome": "Centro Automotivo AutoCenter", "cat": "Centros automotivos", "cidade": "Curitiba", "endereco": "Av. das Torres, 1500", "site": "www.autocenter.com.br", "tel": "(41) 0123-4567", "avaliacoes": 56, "nota": 4.3, "funcionarios": 12, "score": 73, "regime": "Simples Nacional", "oportunidade": "media"},
  {"nome": "Fábrica de Móveis MóveisBR", "cat": "Fábricas de móveis", "cidade": "Belo Horizonte", "endereco": "Av. Amazonas, 7000", "site": "www.moveisbr.com.br", "tel": "(31) 0123-4567", "avaliacoes": 34, "nota": 4.4, "funcionarios": 45, "score": 81, "regime": "Lucro Presumido", "oportunidade": "alta"},
];

// ÍCONES POR CATEGORIA
const iconesCat = {
  "Clínicas médicas": "heart-pulse", "Hospitais": "heart-pulse", "Consultórios odontológicos": "smile",
  "Clínicas veterinárias": "dog", "Clínicas de estética": "sparkles", "Home Care": "home",
  "Farmácias": "pill", "Laboratórios": "flask", "Clínicas de fisioterapia": "activity",
  "Centros de diagnóstico": "scan", "Restaurantes": "utensils", "Hamburguerias": "beef",
  "Pizzarias": "pizza", "Padarias": "cake", "Cafeterias": "coffee", "Supermercados": "shopping-cart",
  "Açougues": "beef", "Distribuidoras de alimentos": "truck", "Construtoras": "building-2",
  "Incorporadoras": "building", "Imobiliárias": "home", "Escritórios de engenharia": "hard-hat",
  "Escritórios de arquitetura": "pen-tool", "Marmorarias": "hammer", "Vidraçarias": "square",
  "Serralherias": "wrench", "Oficinas mecânicas": "car", "Auto elétricas": "zap",
  "Lava-rápidos": "droplets", "Revendas de veículos": "car", "Transportadoras": "truck",
  "Despachantes": "file-text", "Escolas particulares": "graduation-cap", "Creches": "baby",
  "Cursos profissionalizantes": "book-open", "Escolas de idiomas": "languages", "Faculdades": "university",
  "Escolas técnicas": "wrench", "Cursos online": "laptop", "Treinamentos corporativos": "users",
  "Reforço escolar": "book-open", "Escolas de música": "music", "Empresas de software": "code",
  "Agências digitais": "monitor", "Empresas de marketing": "megaphone", "Provedores de internet": "wifi",
  "Desenvolvedores de aplicativos": "smartphone", "E-commerce": "shopping-bag", "Startups": "rocket",
  "Empresas de automação": "cpu", "Consultorias tecnológicas": "brain-circuit", "Escritórios de advocacia": "scale",
  "Consultorias empresariais": "briefcase", "Corretoras de seguros": "shield", "Corretores de imóveis": "key",
  "Empresas de RH": "users", "Empresas de recrutamento": "search", "Empresas de limpeza": "sparkles",
  "Empresas de segurança": "shield-check", "Empresas de terceirização": "repeat", "Agências de turismo": "plane",
  "Metalúrgicas": "factory", "Indústrias alimentícias": "factory", "Indústrias têxteis": "shirt",
  "Indústrias plásticas": "box", "Indústrias químicas": "flask", "Gráficas": "printer",
  "Marcenarias": "hammer", "Fábricas de móveis": "sofa", "Fábricas de embalagens": "package",
  "Indústrias farmacêuticas": "pill", "Franquias": "store", "Academias": "dumbbell",
  "Studios de pilates": "activity", "Empresas de energia solar": "sun", "Impressão 3D": "box",
  "Marketplaces": "shopping-bag", "Centros logísticos": "truck", "Influenciadores e produtores de conteúdo": "video",
  "Lojas de roupas": "shirt", "Lojas de calçados": "footprints", "Joalherias": "gem",
  "Óticas": "eye", "Papelarias": "pen-tool", "Lojas de brinquedos": "gamepad-2",
  "Lojas de utilidades domésticas": "home", "Lojas de informática": "laptop", "Lojas de móveis": "sofa",
  "Lojas de colchões": "bed", "Funilarias": "car", "Locadoras de veículos": "car",
  "Hortifrutis": "apple", "Lanchonetes": "sandwich", "Centros automotivos": "car",
  "Clínicas de psicologia": "brain", "Clínicas de emagrecimento": "scale", "Empresas de pintura": "paintbrush",
  "Empresas de reformas": "hammer", "Empresas de eventos": "party-popper"
};

function getIcon(cat) {
  return iconesCat[cat] || "building-2";
}

window.renderEmpresas = function(lista) {
  const grid = document.getElementById('prospeccao-grid');
  if (!grid) return;
  grid.innerHTML = '';

  lista.forEach(emp => {
    const scoreClass = emp.score >= 80 ? 'score-high' : emp.score >= 50 ? 'score-med' : 'score-low';
    const scoreEmoji = emp.score >= 80 ? '🔥' : emp.score >= 50 ? '⭐' : '⚪';
    const badgeClass = emp.oportunidade === 'alta' ? 'badge-green' : emp.oportunidade === 'media' ? 'badge-orange' : 'badge-red';
    const badgeText = emp.oportunidade === 'alta' ? 'Alta Oportunidade' : emp.oportunidade === 'media' ? 'Média Oportunidade' : 'Baixa Oportunidade';
    const icon = getIcon(emp.cat);

    const card = document.createElement('div');
    card.className = 'empresa-card';
    card.innerHTML = `
      <span class="empresa-score ${scoreClass}">${scoreEmoji} ${emp.score}</span>
      <div class="empresa-header">
        <div class="empresa-icon"><i data-lucide="${icon}" style="width:24px"></i></div>
        <div>
          <div class="empresa-name">${emp.nome}</div>
          <div class="empresa-cat">${emp.cat}</div>
        </div>
      </div>
      <div class="empresa-dados">
        <div><i data-lucide="map-pin"></i> ${emp.endereco} - ${emp.cidade}</div>
        <div><i data-lucide="globe"></i> ${emp.site}</div>
        <div><i data-lucide="phone"></i> ${emp.tel}</div>
        <div><i data-lucide="star"></i> ${emp.nota} (${emp.avaliacoes} avaliações)</div>
        <div><i data-lucide="users"></i> ${emp.funcionarios} funcionários</div>
      </div>
      <div style="margin-top:1rem;display:flex;gap:0.5rem;flex-wrap:wrap">
        <span class="badge ${badgeClass}">${badgeText}</span>
        <span class="badge badge-blue">${emp.regime}</span>
      </div>
      <div style="margin-top:1rem;display:flex;gap:0.5rem">
        <button onclick="openWhatsApp('${emp.tel}', '${emp.nome}', '${emp.cat}')" style="flex:1;padding:0.5rem;background:linear-gradient(135deg,#25d366,#128c7e);color:white;border:none;border-radius:100px;font-size:0.8rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.35rem">
          <i data-lucide="message-circle" style="width:14px"></i> WhatsApp
        </button>
        <button onclick="searchGoogleMaps('${emp.nome} ${emp.cidade}')" style="padding:0.5rem;background:var(--bg-hover);border:1px solid var(--border);border-radius:100px;color:var(--text);font-size:0.8rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.35rem">
          <i data-lucide="map-pin" style="width:14px"></i>
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  if (window.lucide) window.lucide.createIcons();
}

window.filterProspeccao = function() {
  const search = document.getElementById('prop-search')?.value?.toLowerCase() || '';
  const cidade = document.getElementById('prop-cidade')?.value || '';
  const cat = document.getElementById('prop-cat')?.value || '';

  let filtradas = empresasProspeccao.filter(emp => {
    const matchSearch = !search || emp.nome.toLowerCase().includes(search) || emp.cat.toLowerCase().includes(search);
    const matchCidade = !cidade || emp.cidade === cidade;
    const matchCat = !cat || emp.cat === cat;
    return matchSearch && matchCidade && matchCat;
  });

  // Ordenar por score
  filtradas.sort((a, b) => b.score - a.score);
  window.renderEmpresas(filtradas);
}

window.searchGoogleMaps = function(query) {
  const frame = document.getElementById('google-map-frame');
  if (frame) {
    const encoded = encodeURIComponent(query);
    frame.src = `https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3657.197!2d-46.648!3d-23.5505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1s${encoded}!5e0!3m2!1spt-BR!2sbr!4v1700000000000`;
  }
}

window.openWhatsApp = function(numero, empresa, segmento) {
  const msg = `Olá! Sou da Contabilidade Nobel. Identificamos que a ${empresa} (${segmento}) tem grande potencial de otimização tributária. Gostaria de agendar um diagnóstico gratuito?`;
  const clean = numero.replace(/\D/g, '').replace(/^0/, '');
  const full = clean.startsWith('55') ? clean : '55' + clean;
  window.open(`https://wa.me/${full}?text=${encodeURIComponent(msg)}`, '_blank');
}

// WHATSAPP AI PANEL
let waTone = 'profissional';

window.openWhatsAppAI = function() {
  const panel = document.getElementById('whatsapp-ai-panel');
  if (panel) {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    if (window.lucide) window.lucide.createIcons();
  }
}

window.setTone = function(btn, tone) {
  waTone = tone;
  document.querySelectorAll('.wa-tone').forEach(b => {
    b.style.background = 'var(--bg)';
    b.style.color = 'var(--text)';
  });
  btn.style.background = 'var(--primary)';
  btn.style.color = 'white';
}

window.generateWhatsAppMessage = function() {
  const segmento = document.getElementById('wa-segmento').value;
  const empresa = document.getElementById('wa-empresa').value || 'Empresa';
  const numero = document.getElementById('wa-numero').value;
  const preview = document.getElementById('wa-preview');
  const actions = document.getElementById('wa-actions');

  const templates = {
    'profissional': `Olá! Tudo bem? Sou consultor da Contabilidade Nobel.

Identificamos que a ${empresa} (${segmento}) opera em um segmento com grande potencial de otimização fiscal.

Nossa equipe especializada já ajudou mais de 500 empresas a reduzirem sua carga tributária de forma legal e segura.

Gostaria de agendar um diagnóstico gratuito de 30 minutos? Sem compromisso.

Aguardo seu retorno!`,

    'amigavel': `Oi! Tudo bem? 😊

Sou da Contabilidade Nobel e vi que a ${empresa} está crescendo muito! Parabéns!

Só queria te contar que muitas empresas do setor de ${segmento} acabam pagando mais impostos do que deveriam...

A gente pode fazer uma análise gratuita pra ver se isso tá acontecendo com vocês também. Topa?

Me avisa que eu agendo! 👍`,

    'direto': `Olá, sou da Contabilidade Nobel.

Oferecemos redução de até 30% na carga tributária para empresas de ${segmento}.

Diagnóstico gratuito em 24h.

Interessado?`
  };

  const msg = templates[waTone] || templates['profissional'];
  preview.textContent = msg;
  preview.style.display = 'block';
  actions.style.display = 'flex';

  if (numero) {
    const clean = numero.replace(/\D/g, '').replace(/^0/, '');
    const full = clean.startsWith('55') ? clean : '55' + clean;
    document.getElementById('wa-link').href = `https://wa.me/${full}?text=${encodeURIComponent(msg)}`;
  }

  if (window.lucide) window.lucide.createIcons();
}

window.copyMessage = function() {
  const text = document.getElementById('wa-preview').textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert('Mensagem copiada para a área de transferência!');
  });
}

// ===== CONTROLE DE ABAS (view-toggle) =====
window.toggleFinanceiroTab = function(btn, tab) {
  document.querySelectorAll('#fin-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

window.toggleContabilTab = function(btn, tab) {
  document.querySelectorAll('#cont-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

window.toggleFiscalTab = function(btn, tab) {
  document.querySelectorAll('#fisc-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

window.toggleTrabalhistaTab = function(btn, tab) {
  document.querySelectorAll('#trab-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

window.toggleEquipeTab = function(btn, tab) {
  document.querySelectorAll('#equipe-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

window.toggleConfigIA = function() {
  const config = document.getElementById('ia-config');
  if (config) config.style.display = config.style.display === 'none' ? 'block' : 'none';
}

window.quickAction = function(type) {
  const chatInput = document.getElementById('chat-input');
  const prompts = {
    'analisar': 'Analise a saúde fiscal da empresa TechSolutions Brasil e sugira otimizações tributárias.',
    'proposta': 'Crie uma proposta comercial para uma clínica médica com 15 funcionários, faturamento de R$ 350K/mês.',
    'relatorio': 'Gere um relatório DRE comparativo do último trimestre para o cliente Hospital Santa Maria.',
    'campanha': 'Crie uma campanha de e-mail marketing sobre o novo prazo do Simples Nacional para junho/2024.'
  };
  if (chatInput) {
    chatInput.value = prompts[type];
    window.sendChat();
  }
}

window.genMarketing = async function(type) {
  const preview = document.getElementById('marketing-preview');
  const content = document.getElementById('marketing-content');
  if (!preview || !content) return;
  preview.style.display = 'block';
  content.innerHTML = '<div style="display:flex;align-items:center;gap:1rem"><div class="spinner" style="width:24px;height:24px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin 1s linear infinite"></div><span>Gerando conteúdo premium com IA Nobel...</span></div>';

  try {
    // Definir tópicos baseados no tipo
    const topics = {
      'post': 'Redução de impostos para empresas de tecnologia',
      'story': 'Dica rápida: Planejamento tributário inteligente',
      'reels': 'Por que sua empresa paga mais impostos do que deveria?',
      'banner': 'Contabilidade Nobel: Inteligência para seu crescimento',
      'artigo': 'Os impactos da Reforma Tributária no Simples Nacional em 2024',
      'email': 'Seu diagnóstico tributário gratuito está pronto'
    };

    const channels = {
      'post': 'instagram',
      'story': 'instagram',
      'reels': 'instagram',
      'banner': 'linkedin',
      'artigo': 'linkedin',
      'email': 'whatsapp'
    };

    // Chamar a função de servidor do Lovable AI Gateway
    const { generateMarketingCopy } = await import('@/lib/erp-ai.functions');
    const result = await generateMarketingCopy({
      topic: topics[type] || 'Contabilidade e Inteligência Artificial',
      channel: channels[type] || 'instagram',
      tone: 'premium, profissional, moderno e direto'
    });

    if (result) {
      let html = '';
      const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(result.image_prompt)}?width=800&height=800&seed=${Math.floor(Math.random()*1000)}`;
      
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
            <img src="${imageUrl}" style="width:100%;height:300px;object-fit:cover">
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
    } else {
      content.innerHTML = 'Erro ao gerar conteúdo. Tente novamente.';
    }
  } catch (err) {
    console.error('Marketing IA Error:', err);
    content.innerHTML = `<div style="text-align:center;color:var(--danger)">
      <i data-lucide="alert-circle" style="width:48px;height:48px;margin-bottom:1rem"></i>
      <div>Erro na IA: ${err.message}</div>
      <button onclick="window.genMarketing('${type}')" style="margin-top:1rem;padding:0.5rem 1rem;background:var(--primary);color:white;border:none;border-radius:100px;cursor:pointer">Tentar Novamente</button>
    </div>`;
    if (window.lucide) window.lucide.createIcons();
  }
}

// CSS spinner
const style = document.createElement('style');
style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(style);

// Inicializar
function initApp() {
  console.log('initApp executing...');
  if (typeof window.initCharts === 'function') window.initCharts();
  if (typeof window.initFiscalCalendar === 'function') window.initFiscalCalendar();
  if (typeof window.initAgendaCalendar === 'function') window.initAgendaCalendar();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
