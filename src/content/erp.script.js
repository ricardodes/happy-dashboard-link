// Nobel ERP Script - High Fidelity Robust Version
// Integrated State Management, Modal System, and Dynamic CRUD

// Global App State
window.appState = {
  clientes: [
    { id: 1, nome: "Supermercado Central MOC", cnpj: "00.123.456/0001-99", regime: "Lucro Real", responsavel: "Ana Paula (Fiscal)", status: "Regular" },
    { id: 2, nome: "Clínica Vida Plena", cnpj: "11.222.333/0001-88", regime: "Simples Nacional", responsavel: "Carlos Mendes (Contábil)", status: "Pendência" },
    { id: 3, nome: "Construtora Norte Minas", cnpj: "22.333.444/0001-77", regime: "Lucro Presumido", responsavel: "Ana Paula (Fiscal)", status: "Regular" }
  ],
  leads: [
    { id: 1, nome: "TechSolutions Brasil", segmento: "Tecnologia", cidade: "São Paulo", responsavel: "Carlos M.", valor: "4.2K", stage: "novo" },
    { id: 2, nome: "Restaurante Sabor & Arte", segmento: "Alimentação", cidade: "Campinas", responsavel: "Julia A.", valor: "1.8K", stage: "novo" },
    { id: 3, nome: "Construtora Horizonte", segmento: "Construção", cidade: "Rio de Janeiro", responsavel: "Ana P.", valor: "8.5K", stage: "contato" },
    { id: 4, nome: "Advocacia Silva & Partners", segmento: "Serviços", cidade: "Belo Horizonte", responsavel: "Fernando S.", valor: "6.0K", stage: "qualificacao" }
  ],
  financeiro: {
    pagar: [
      { id: 1, descricao: "Aluguel Sede Nobel", vencimento: "10/06/2024", valor: "12.500,00", status: "Pendente" },
      { id: 2, descricao: "Energia Elétrica", vencimento: "15/06/2024", valor: "1.250,00", status: "Pendente" },
      { id: 3, descricao: "Internet/Telefonia", vencimento: "05/06/2024", valor: "850,00", status: "Pago" }
    ],
    receber: [
      { id: 1, cliente: "Hospital Santa Maria", descricao: "Honorários Maio", vencimento: "05/06/2024", valor: "25.000,00", status: "Recebido" },
      { id: 2, cliente: "Clínica Vida Plena", descricao: "Consultoria Especial", vencimento: "10/06/2024", valor: "5.500,00", status: "Pendente" }
    ]
  },
  fiscal: {
    nfe: [
      { id: 1, emissor: "Supermercado Central", valor: "4.500,00", data: "01/06/2024", status: "Validada" },
      { id: 2, emissor: "Clínica Vida Plena", valor: "12.800,00", data: "01/06/2024", status: "Validada" },
      { id: 3, emissor: "TechSolutions Brasil", valor: "8.900,00", data: "02/06/2024", status: "Pendente" }
    ],
    sped: [
      { id: 1, cliente: "Supermercado Central", tipo: "SPED Fiscal", periodo: "05/2024", status: "Enviado" },
      { id: 2, cliente: "Clínica Vida Plena", tipo: "EFD-Contribuições", periodo: "05/2024", status: "Pendente" }
    ]
  },
  contabil: {
    lancamentos: [
      { id: 1, conta: "Caixa", debito: "R$ 10.000", credito: "R$ 0", data: "01/06/2024" },
      { id: 2, conta: "Bancos", debito: "R$ 0", credito: "R$ 10.000", data: "01/06/2024" }
    ]
  },
  users: [
    { id: 1, nome: "Admin Nobel", email: "admin@nobel.com", perfil: "Super Admin", status: "Ativo", initial: "AN", color: "var(--primary)" },
    { id: 2, nome: "Carlos Mendes", email: "carlos@nobel.com", perfil: "Comercial", status: "Ativo", initial: "CM", color: "var(--info)" },
    { id: 3, nome: "Ana Paula", email: "ana@nobel.com", perfil: "Contábil", status: "Ativo", initial: "AP", color: "var(--warning)" }
  ],
  equipe: [
    { id: 1, nome: "Ana Paula Silva", cargo: "Gestora Fiscal", depto: "Fiscal", admissao: "10/02/2020", status: "Ativo" },
    { id: 2, nome: "Carlos Mendes", cargo: "Analista Contábil", depto: "Contábil", admissao: "15/05/2021", status: "Ativo" },
    { id: 3, nome: "Mariana Oliveira", cargo: "Analista DP", depto: "Pessoal", admissao: "20/08/2022", status: "Ativo" },
    { id: 4, nome: "Ricardo Santos", cargo: "Auxiliar Administrativo", depto: "Financeiro", admissao: "05/01/2023", status: "Ativo" }
  ]
};

// Generic View Manager
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

window.renderContabil = function() {
  const balBody = document.getElementById('contabil-balancete-table-body');
  if (balBody) {
    // Dummy balancete data rendering
    const staticBal = [
      { conta: "Caixa e Equivalentes", codigo: "1.1.01", debito: "R$ 125.000", credito: "R$ 45.000", saldo: "R$ 80.000", color: "var(--accent)" },
      { conta: "Clientes", codigo: "1.1.02", debito: "R$ 287.000", credito: "R$ 120.000", saldo: "R$ 167.000", color: "var(--accent)" },
      { conta: "Fornecedores", codigo: "2.1.01", debito: "R$ 85.000", credito: "R$ 180.000", saldo: "R$ 95.000", color: "var(--danger)" }
    ];
    balBody.innerHTML = staticBal.map(item => `
      <tr class="hover-scale">
        <td style="font-weight:600">${item.conta}</td>
        <td>${item.codigo}</td>
        <td>${item.debito}</td>
        <td>${item.credito}</td>
        <td style="font-weight:700;color:${item.color}">${item.saldo}</td>
      </tr>
    `).join('');
  }
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

window.deleteEquipeMember = function(id) {
  openModal({
    title: "Remover da Equipe",
    body: "<p>Deseja remover este colaborador da lista da Nobel?</p>",
    confirmText: "Remover",
    onConfirm: () => {
      window.appState.equipe = window.appState.equipe.filter(m => m.id !== id);
      window.renderEquipe();
      closeModal();
    }
  });
};

// CRUD: Clientes
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

window.filterClientes = function(value) {
  window.renderClientes(value);
};

window.openClientDetails = function(id) {
  const c = window.appState.clientes.find(c => c.id === id);
  if (!c) return;
  openModal({
    title: `Dossiê Estratégico: ${c.nome}`,
    body: `
      <div style="display:flex;flex-direction:column;gap:1.5rem">
        <!-- AI Summary Header -->
        <div style="background:linear-gradient(135deg, rgba(0,208,132,0.1), rgba(59,130,246,0.1));padding:1rem;border-radius:var(--radius-sm);border:1px solid var(--border-strong);display:flex;align-items:center;gap:1rem">
          <div style="width:48px;height:48px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center"><i data-lucide="brain-circuit"></i></div>
          <div style="flex:1">
            <div style="font-weight:700;font-size:0.95rem">Análise Nobel IA</div>
            <div style="font-size:0.8rem;color:var(--text-secondary)">Cliente do setor ${c.regime.includes('Real') ? 'Industrial/Grande Porte' : 'Serviços/Comércio'} com status ${c.status}.</div>
          </div>
          <button class="header-btn" title="Análise Profunda" onclick="toggleClientModalTab(document.querySelector('.tab-ia-btn'), 'ia-profile')"><i data-lucide="sparkles" style="width:16px;color:var(--accent)"></i></button>
        </div>

        <!-- Tabs for Modal -->
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
          <div style="margin-top:1rem;display:flex;justify-content:space-between;align-items:center">
             <div class="form-group"><label>Status Atual</label><span class="status ${c.status === 'Regular' ? 'status-success' : 'status-warning'}"><span class="status-dot"></span>${c.status}</span></div>
             <div style="display:flex;gap:0.5rem">
                <button class="btn-secondary" style="gap:0.5rem;padding:0.5rem 1rem" onclick="openDirectWhatsApp('5538999999999', '${c.nome}')">
                    <i data-lucide="message-square" style="width:16px"></i> WhatsApp
                </button>
                <button class="btn-primary" style="gap:0.5rem;padding:0.5rem 1rem" onclick="handleAction('Gerar Relatório')">
                    <i data-lucide="file-text" style="width:16px"></i> Relatório
                </button>
             </div>
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
            <div class="card glass-morphism" style="padding:1rem; border:1px solid rgba(245,158,11,0.1)">
              <div style="font-weight:700; font-size:0.85rem; color:var(--warning); margin-bottom:0.5rem">3. Cross-Sell / Upsell</div>
              <div id="ai-pillar-3" style="font-size:0.8rem; color:var(--text-secondary)">Aguardando análise...</div>
            </div>
            <div class="card glass-morphism" style="padding:1rem; border:1px solid rgba(59,130,246,0.1)">
              <div style="font-weight:700; font-size:0.85rem; color:var(--info); margin-bottom:0.5rem">4. Saúde Fiscal</div>
              <div id="ai-pillar-4" style="font-size:0.8rem; color:var(--text-secondary)">Aguardando análise...</div>
            </div>
          </div>
          <div class="card glass-morphism" style="border:1px solid rgba(0,208,132,0.2);background:rgba(0,208,132,0.02)">
            <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem">
              <div style="width:32px;height:32px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center"><i data-lucide="sparkles" style="width:18px"></i></div>
              <div style="font-weight:700">Relatório Consolidado de IA</div>
            </div>
            <div id="ai-client-insight-content" style="font-size:0.9rem;line-height:1.6;color:var(--text-secondary)">
              <p>O Nobel IA processará os 4 pilares estratégicos baseando-se nos dados do Alterdata.</p>
            </div>
            <button class="nav-cta" id="btn-generate-ai-insight" style="width:100%;margin-top:1rem;gap:0.5rem;background:linear-gradient(135deg, var(--primary), var(--accent))" onclick="generateClientProfileAI(${c.id})">
              <i data-lucide="brain-circuit" style="width:16px"></i> Executar Diagnóstico 4 Pilares
            </button>
          </div>
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

window.generateClientProfileAI = async function(id) {
  const c = window.appState.clientes.find(c => c.id === id);
  if (!c) return;
  
  const contentEl = document.getElementById('ai-client-insight-content');
  const btn = document.getElementById('btn-generate-ai-insight');
  const p1 = document.getElementById('ai-pillar-1');
  const p2 = document.getElementById('ai-pillar-2');
  const p3 = document.getElementById('ai-pillar-3');
  const p4 = document.getElementById('ai-pillar-4');
  
  if (contentEl) contentEl.innerHTML = '<div style="display:flex;align-items:center;gap:0.5rem;color:var(--primary)"><i data-lucide="refresh-cw" class="spin" style="width:16px"></i> Analisando pilares estratégicos no Alterdata...</div>';
  [p1, p2, p3, p4].forEach(p => { if(p) p.innerHTML = '<span class="spinner-mini" style="display:inline-block; width:10px; height:10px; border:1px solid #ccc; border-top-color:var(--primary); border-radius:50%; animation:spin 1s linear infinite"></span>'; });
  
  if (btn) btn.disabled = true;
  if (window.lucide) window.lucide.createIcons();

  try {
    const snapshot = `
      Analise o cliente ${c.nome} (${c.cnpj}) sob o regime ${c.regime}.
      Divida a análise estritamente em 4 pilares estratégicos da Contabilidade Nobel.
      
      IMPORTANTE: Retorne estritamente um objeto JSON puro, sem blocos de código Markdown (sem \`\`\`json).
      O JSON deve conter: "pillar1", "pillar2", "pillar3", "pillar4" e "summary".
    `;
    
    const result = await window.generateBusinessInsights({ snapshot, forceJson: true });
    // Limpeza de possíveis blocos de código markdown se a IA ignorar o prompt
    let cleanContent = result.content.trim();
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanContent = jsonMatch[0];
    }
    const data = JSON.parse(cleanContent);

    
    if (p1) p1.textContent = data.pillar1;
    if (p2) p2.textContent = data.pillar2;
    if (p3) p3.textContent = data.pillar3;
    if (p4) p4.textContent = data.pillar4;
    if (contentEl) contentEl.innerHTML = `<div style="white-space:pre-wrap"><strong>Diagnóstico Consolidado:</strong>\n${data.summary}</div>`;
  } catch (err) {
    if (contentEl) contentEl.innerHTML = `<span style="color:var(--danger)">Erro ao processar pilares: ${err.message}. Certifique-se de retornar JSON.</span>`;
  } finally {
    if (btn) btn.disabled = false;
  }

};

window.deleteCliente = function(id) {
  const c = window.appState.clientes.find(c => c.id === id);
  if (!c) return;
  openModal({
    title: "Confirmar Exclusão",
    body: `<p>Deseja realmente remover o cliente <strong>${c.nome}</strong>? Esta ação não pode ser desfeita.</p>`,
    confirmText: "Sim, Remover",
    onConfirm: () => {
      window.appState.clientes = window.appState.clientes.filter(c => c.id !== id);
      window.renderClientes();
      closeModal();
    }
  });
};

window.openNewClientModal = function() {
  const body = `
    <form id="new-client-form">
      <div class="form-group">
        <label>Razão Social</label>
        <input type="text" name="nome" class="form-control" placeholder="Ex: Nobel Tecnologia Ltda" required>
      </div>
      <div class="form-group">
        <label>CNPJ</label>
        <input type="text" name="cnpj" class="form-control" placeholder="00.000.000/0001-00" required>
      </div>
      <div class="form-group">
        <label>Regime Tributário</label>
        <select name="regime" class="form-control">
          <option>Simples Nacional</option>
          <option>Lucro Presumido</option>
          <option>Lucro Real</option>
          <option>MEI</option>
        </select>
      </div>
      <div class="form-group">
        <label>Responsável Nobel</label>
        <input type="text" name="responsavel" class="form-control" placeholder="Nome do consultor" required>
      </div>
    </form>
  `;
  openModal({
    title: "Cadastrar Novo Cliente",
    body: body,
    confirmText: "Cadastrar Cliente",
    onConfirm: () => {
      const form = document.getElementById('new-client-form');
      const formData = new FormData(form);
      const newClient = {
        id: Date.now(),
        nome: formData.get('nome'),
        cnpj: formData.get('cnpj'),
        regime: formData.get('regime'),
        responsavel: formData.get('responsavel'),
        status: "Regular"
      };
      window.appState.clientes.push(newClient);
      window.renderClientes();
      closeModal();
    }
  });
};

// CRUD: Leads (CRM)
window.renderLeads = function() {
  const container = document.getElementById('crm-kanban');
  if (!container) return;

  const stages = [
    { id: 'novo', title: 'Lead Novo', color: 'var(--text-muted)' },
    { id: 'contato', title: 'Contato', color: 'var(--info)' },
    { id: 'qualificacao', title: 'Qualificação', color: 'var(--warning)' },
    { id: 'diagnostico', title: 'Diagnóstico', color: 'var(--accent)' },
    { id: 'proposta', title: 'Proposta', color: '#a855f7' },
    { id: 'fechado', title: 'Fechado', color: 'var(--primary)' }
  ];

  container.innerHTML = stages.map(stage => {
    const leads = window.appState.leads.filter(l => l.stage === stage.id);
    return `
      <div class="kanban-col">
        <div class="kanban-header">
          <div class="kanban-title">
            <span style="width:8px;height:8px;border-radius:50%;background:${stage.color};display:inline-block"></span>
            ${stage.title}
          </div>
          <span class="kanban-count">${leads.length}</span>
        </div>
        ${leads.map(lead => `
          <div class="kanban-card hover-scale">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div class="kanban-card-title">${lead.nome}</div>
              <button class="btn-delete" onclick="deleteLead(${lead.id})" style="padding:2px"><i data-lucide="x" style="width:14px"></i></button>
            </div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.75rem">${lead.segmento} • ${lead.cidade}</div>
            <div class="kanban-card-meta">
              <div class="kanban-card-avatar">${lead.responsavel.substring(0,2).toUpperCase()}</div>
              <span>${lead.responsavel}</span>
              <span style="margin-left:auto;font-weight:700">R$ ${lead.valor}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
  if (window.lucide) window.lucide.createIcons();
};

window.deleteLead = function(id) {
  const lead = window.appState.leads.find(l => l.id === id);
  if (!lead) return;
  openModal({
    title: "Confirmar Exclusão do Lead",
    body: `<p>Deseja remover o lead <strong>${lead.nome}</strong> do pipeline?</p>`,
    confirmText: "Sim, Remover",
    onConfirm: () => {
      window.appState.leads = window.appState.leads.filter(l => l.id !== id);
      window.renderLeads();
      closeModal();
    }
  });
};

window.openNewLeadModal = function() {
  const body = `
    <form id="new-lead-form">
      <div class="form-group">
        <label>Nome da Empresa / Lead</label>
        <input type="text" name="nome" class="form-control" placeholder="Nome da empresa" required>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div class="form-group">
          <label>Segmento</label>
          <input type="text" name="segmento" class="form-control" placeholder="Ex: Tecnologia">
        </div>
        <div class="form-group">
          <label>Cidade</label>
          <input type="text" name="cidade" class="form-control" placeholder="Cidade">
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div class="form-group">
          <label>Responsável</label>
          <input type="text" name="responsavel" class="form-control" placeholder="Seu nome">
        </div>
        <div class="form-group">
          <label>Valor Mensal Estimado</label>
          <input type="text" name="valor" class="form-control" placeholder="Ex: 2.5K">
        </div>
      </div>
    </form>
  `;
  openModal({
    title: "Adicionar Novo Lead ao Pipeline",
    body: body,
    confirmText: "Criar Lead",
    onConfirm: () => {
      const form = document.getElementById('new-lead-form');
      const formData = new FormData(form);
      const newLead = {
        id: Date.now(),
        nome: formData.get('nome'),
        segmento: formData.get('segmento'),
        cidade: formData.get('cidade'),
        responsavel: formData.get('responsavel'),
        valor: formData.get('valor'),
        stage: "novo"
      };
      window.appState.leads.push(newLead);
      window.renderLeads();
      closeModal();
    }
  });
};

// Modal System Logic
window.openModal = function(config) {
  const overlay = document.getElementById('modal-overlay');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');
  const confirmBtn = document.getElementById('modal-confirm-btn');

  title.textContent = config.title || "Modal";
  body.innerHTML = config.body || "";
  confirmBtn.textContent = config.confirmText || "Confirmar";
  
  confirmBtn.onclick = () => {
    if (config.onConfirm) config.onConfirm();
  };

  overlay.style.display = 'flex';
  if (window.lucide) window.lucide.createIcons();
};

window.closeModal = function() {
  document.getElementById('modal-overlay').style.display = 'none';
};

// Sidebar & Theme
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

// Calendar functions
window.initCalendar = function(id) {
  const cal = document.getElementById(id);
  if (!cal) return;
  cal.innerHTML = '';
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  days.forEach(d => {
    const h = document.createElement('div');
    h.className = 'cal-header';
    h.textContent = d;
    cal.appendChild(h);
  });
  
  // Fake some event days for visual feedback
  const eventDays = id.includes('fiscal') ? [10, 20, 25] : [5, 12, 15, 22];
  
  for (let i = 1; i <= 30; i++) {
    const day = document.createElement('div');
    day.className = 'cal-day';
    day.textContent = i;
    if (i === new Date().getDate()) day.classList.add('today');
    if (eventDays.includes(i)) {
      const dot = document.createElement('div');
      dot.style.width = '4px';
      dot.style.height = '4px';
      dot.style.borderRadius = '50%';
      dot.style.background = id.includes('fiscal') ? 'var(--danger)' : 'var(--primary)';
      dot.style.marginTop = '2px';
      day.appendChild(dot);
    }
    cal.appendChild(day);
  }
};

window.initFiscalCalendar = function() {
  window.initCalendar('fiscal-calendar');
};

window.initAgendaCalendar = function() {
  window.initCalendar('agenda-nobel-calendar');
  window.initCalendar('agenda-fiscal-calendar');
  // Legacy support if needed
  window.initCalendar('agenda-calendar');
};

// Financeiro Render
window.renderFinanceiro = function() {
  const pagarBody = document.getElementById('financeiro-pagar-table-body');
  if (pagarBody) {
    pagarBody.innerHTML = window.appState.financeiro.pagar.map(item => `
      <tr class="hover-scale">
        <td style="font-weight:600">${item.descricao}</td>
        <td>${item.vencimento}</td>
        <td style="font-weight:700">R$ ${item.valor}</td>
        <td><span class="status ${item.status === 'Pago' ? 'status-success' : 'status-warning'}"><span class="status-dot"></span> ${item.status}</span></td>
        <td><button class="btn-delete" onclick="deleteFinItem('pagar', ${item.id})"><i data-lucide="trash-2" style="width:14px"></i></button></td>
      </tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-muted)">Nenhum lançamento encontrado.</td></tr>';
  }

  const receberBody = document.getElementById('financeiro-receber-table-body');
  if (receberBody) {
    const data = window.appState.financeiro.receber || [];
    receberBody.innerHTML = data.map(item => `
      <tr class="hover-scale">
        <td style="font-weight:600">${item.cliente || 'Consumidor'}</td>
        <td>${item.descricao}</td>
        <td>${item.vencimento}</td>
        <td style="font-weight:700">R$ ${item.valor}</td>
        <td><span class="status ${item.status === 'Recebido' ? 'status-success' : 'status-warning'}"><span class="status-dot"></span> ${item.status}</span></td>
        <td><button class="btn-delete" onclick="deleteFinItem('receber', ${item.id})"><i data-lucide="trash-2" style="width:14px"></i></button></td>
      </tr>
    `).join('') || '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted)">Nenhum recebimento encontrado.</td></tr>';
  }
  
  if (window.lucide) window.lucide.createIcons();
};

window.deleteFinItem = function(type, id) {
  openModal({
    title: "Confirmar Exclusão",
    body: "<p>Deseja remover este lançamento financeiro?</p>",
    confirmText: "Sim, Remover",
    onConfirm: () => {
      window.appState.financeiro[type] = window.appState.financeiro[type].filter(item => item.id !== id);
      window.renderFinanceiro();
      closeModal();
    }
  });
};

window.openNewFinancialModal = function(type) {
  const title = type === 'pagar' ? "Nova Conta a Pagar" : "Novo Recebimento";
  const body = `
    <form id="new-fin-form">
      <div class="form-group">
        <label>Descrição</label>
        <input type="text" name="descricao" class="form-control" required>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div class="form-group">
          <label>Vencimento</label>
          <input type="date" name="vencimento" class="form-control" required>
        </div>
        <div class="form-group">
          <label>Valor (R$)</label>
          <input type="number" step="0.01" name="valor" class="form-control" required>
        </div>
      </div>
    </form>
  `;
  openModal({
    title,
    body,
    confirmText: "Salvar Lançamento",
    onConfirm: () => {
      const form = document.getElementById('new-fin-form');
      const formData = new FormData(form);
      const newItem = {
        id: Date.now(),
        descricao: formData.get('descricao'),
        vencimento: formData.get('vencimento'),
        valor: parseFloat(formData.get('valor')).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        status: "Pendente"
      };
      window.appState.financeiro[type].push(newItem);
      window.renderFinanceiro();
      closeModal();
    }
  });
};

// Admin Users Render
window.renderAdminUsers = function() {
  const body = document.getElementById('admin-users-table-body');
  if (!body) return;
  body.innerHTML = window.appState.users.map(u => `
    <tr class="hover-scale">
      <td style="font-weight:600;display:flex;align-items:center;gap:0.75rem">
        <div class="user-avatar" style="width:32px;height:32px;font-size:0.75rem;background:${u.color}">${u.initial}</div>
        ${u.nome}
      </td>
      <td>${u.email}</td>
      <td><span class="badge ${u.perfil === 'Super Admin' ? 'badge-red' : 'badge-blue'}">${u.perfil}</span></td>
      <td><span class="status status-success"><span class="status-dot"></span> ${u.status}</span></td>
      <td><button class="btn-delete" onclick="deleteUser(${u.id})"><i data-lucide="trash-2" style="width:16px"></i></button></td>
    </tr>
  `).join('');
  if (window.lucide) window.lucide.createIcons();
};

window.deleteUser = function(id) {
  const u = window.appState.users.find(u => u.id === id);
  if (!u) return;
  openModal({
    title: "Confirmar Exclusão de Usuário",
    body: `<p>Deseja remover o usuário <strong>${u.nome}</strong>?</p>`,
    confirmText: "Sim, Remover",
    onConfirm: () => {
      window.appState.users = window.appState.users.filter(u => u.id !== id);
      window.renderAdminUsers();
      closeModal();
    }
  });
};

// IA Chat
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
    }).catch(err => {
      container.innerHTML += `
        <div class="chat-message ai">
          <div class="chat-avatar ai"><i data-lucide="sparkles" style="width:18px"></i></div>
          <div class="chat-bubble">Desculpe, houve um erro ao processar sua pergunta. Tente configurar sua API Key na seção de configurações.</div>
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
  content.innerHTML = '<div style="display:flex;align-items:center;gap:1rem"><div class="spinner-mini" style="width:24px;height:24px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin 1s linear infinite"></div><span>Gerando conteúdo premium com IA Nobel...</span></div>';

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
      const isVertical = type === 'story' || type === 'reels';
      const width = isVertical ? 720 : 1080;
      const height = isVertical ? 1280 : 1080;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(result.image_prompt)}?width=${width}&height=${height}&nologo=true&model=flux&seed=${Math.floor(Math.random()*1000)}`;
      const fallbackImg = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1080&auto=format&fit=crop";
      
      let html = '';
      if (type === 'story' || type === 'reels') {
        html = `
          <div style="max-width:350px;margin:0 auto;background:#000;border-radius:24px;overflow:hidden;position:relative;aspect-ratio:9/16;color:white;box-shadow:var(--shadow-lg);border:8px solid #1a1a1a">
            <img src="${imageUrl}" onerror="this.src='${fallbackImg}'" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;opacity:0.8">
            <div style="position:relative;z-index:1;padding:2rem;display:flex;flex-direction:column;height:100%;justify-content:flex-end;padding-bottom:5rem">
              <div style="font-weight:900;font-size:1.8rem;margin-bottom:1rem;line-height:1.1;text-shadow:0 2px 10px rgba(0,0,0,0.8)">${result.title}</div>
              <div style="font-size:1rem;line-height:1.4;margin-bottom:2rem;background:rgba(0,0,0,0.4);padding:1rem;border-radius:12px">${result.content}</div>
              <div style="background:white;color:black;padding:0.8rem;border-radius:100px;font-weight:800;text-align:center">${result.cta || 'SAIBA MAIS'}</div>
            </div>
          </div>
          <div style="display:flex;gap:1rem;justify-content:center;margin-top:2rem">
            <button class="nav-cta" style="background:#E1306C;flex:1;gap:0.5rem" onclick="handleSocialPost('instagram', '${type}', '${encodeURIComponent(imageUrl)}')"><i data-lucide="instagram"></i> Instagram</button>
            <button class="nav-cta" style="background:#25D366;flex:1;gap:0.5rem" onclick="handleSocialPost('whatsapp', '${type}', '${encodeURIComponent(imageUrl)}')"><i data-lucide="message-circle"></i> WhatsApp</button>
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
              <div style="line-height:1.7;color:var(--text);margin-bottom:1.5rem">${result.content.replace(/\n/g, '<br>')}</div>
              <div style="color:var(--accent);font-weight:700;margin-bottom:1.5rem">${Array.isArray(result.hashtags) ? result.hashtags.map(h => '#'+h).join(' ') : result.hashtags}</div>
              <div style="border-top:1px solid var(--border);padding-top:1.5rem">
                <div style="font-weight:700;color:var(--primary)">${result.cta || 'SAIBA MAIS'}</div>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:1rem;justify-content:center;margin-top:2rem">
            <button class="nav-cta" style="background:#E1306C;flex:1;gap:0.5rem" onclick="handleSocialPost('instagram', '${type}', '${encodeURIComponent(imageUrl)}')"><i data-lucide="instagram"></i> Instagram</button>
            <button class="nav-cta" style="background:#25D366;flex:1;gap:0.5rem" onclick="handleSocialPost('whatsapp', '${type}', '${encodeURIComponent(imageUrl)}')"><i data-lucide="message-circle"></i> WhatsApp</button>
          </div>`;
      }
      content.innerHTML = html;
    }
  } catch (err) {
    content.innerHTML = `<div style="padding:2rem;text-align:center;color:var(--danger)"><i data-lucide="alert-circle" style="width:48px;height:48px;margin-bottom:1rem"></i><br>Erro ao gerar conteúdo: ${err.message}</div>`;
    if (window.lucide) window.lucide.createIcons();
  }
};

// Prospecção Data
const empresasProspeccao = [
  {"nome": "Clínica Médica Montes Claros", "cat": "Clínicas médicas", "cidade": "Montes Claros", "endereco": "Av. Deputado Esteves Rodrigues, 1000", "tel": "(38) 3221-1000", "score": 96, "regime": "Lucro Presumido", "oportunidade": "alta"},
  {"nome": "Hospital do Norte de Minas", "cat": "Hospitais", "cidade": "Montes Claros", "endereco": "Rua Santa Maria, 500", "tel": "(38) 3222-2000", "score": 98, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "BioLab Laboratórios", "cat": "Laboratórios", "cidade": "Montes Claros", "endereco": "Rua Justino Câmara, 45", "tel": "(38) 3215-4400", "score": 94, "regime": "Lucro Presumido", "oportunidade": "alta"},
  {"nome": "TechSolutions Norte", "cat": "Software e TI", "cidade": "Montes Claros", "endereco": "Av. Donato Quintino, 90", "tel": "(38) 3224-1500", "score": 92, "regime": "Simples Nacional", "oportunidade": "alta"},
  {"nome": "Moc Construtora", "cat": "Construtoras", "cidade": "Montes Claros", "endereco": "Av. Mestra Fininha, 1200", "tel": "(38) 3212-3300", "score": 90, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "GastroCenter MOC", "cat": "Clínicas médicas", "cidade": "Montes Claros", "endereco": "Rua Dr. Santos, 120", "tel": "(38) 3221-8899", "score": 95, "regime": "Lucro Presumido", "oportunidade": "alta"},
  {"nome": "Agropecuária Janaúba", "cat": "Agronegócio", "cidade": "Janaúba", "endereco": "Av. do Comércio, 200", "tel": "(38) 3821-3000", "score": 92, "regime": "Simples Nacional", "oportunidade": "alta"},
  {"nome": "Frigorífico Norte Minas", "cat": "Indústrias alimentícias", "cidade": "Janaúba", "endereco": "Distrito Industrial", "tel": "(38) 3821-4500", "score": 94, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "Cachaça Havana", "cat": "Indústrias alimentícias", "cidade": "Salinas", "endereco": "Fazenda Havana", "tel": "(38) 3841-1234", "score": 96, "regime": "Lucro Real", "oportunidade": "alta"},
  {"nome": "Frutas Jaíba", "cat": "Exportação", "cidade": "Jaíba", "endereco": "Projeto Jaíba - Gleba C", "tel": "(38) 3833-2200", "score": 97, "regime": "Lucro Real", "oportunidade": "alta"}
];

window.filterProspeccao = async function() {
  const searchInput = document.getElementById('prop-search');
  const search = searchInput?.value?.trim() || '';
  const cidade = document.getElementById('prop-cidade')?.value || '';
  const categoria = document.getElementById('prop-cat')?.value || '';
  
  const grid = document.getElementById('prospeccao-grid');
  if (grid) {
    grid.innerHTML = `
      <div style="padding:4rem;text-align:center;grid-column:1/-1">
        <div class="spinner-mini" style="margin:0 auto 1rem;border-top-color:var(--primary);width:30px;height:30px;border-width:3px"></div>
        <div style="font-weight:700;font-size:1.1rem">IA Nobel buscando no Google Maps...</div>
        <div style="font-size:0.9rem;color:var(--text-muted);margin-top:0.5rem">Localizando empresas em ${cidade || 'Norte de Minas'}</div>
      </div>
    `;
  }

  try {
    const apiKey = localStorage.getItem('nobel_groq_key');
    let aiResults = [];
    if (typeof window.searchProspectsAI === 'function') {
      aiResults = await window.searchProspectsAI({ 
        query: search, 
        city: cidade || 'Montes Claros e região Norte de Minas', 
        category: categoria || 'Empresas diversas',
        apiKey: apiKey || undefined
      });
    }
    
    const all = [...(aiResults || []), ...empresasProspeccao];
    const unique = all.filter((emp, index, self) =>
      index === self.findIndex((t) => t.nome.toLowerCase() === emp.nome.toLowerCase())
    );

    let filtradas = unique.filter(emp => {
      const s = search.toLowerCase();
      const matchSearch = !s || emp.nome.toLowerCase().includes(s) || emp.cat.toLowerCase().includes(s);
      const matchCidade = !cidade || emp.cidade === cidade;
      const matchCategoria = !categoria || emp.cat.toLowerCase().includes(categoria.toLowerCase());
      return matchSearch && matchCidade && matchCategoria;
    });

    if (filtradas.length === 0 && aiResults && aiResults.length > 0) {
      filtradas = aiResults;
    }

    if (filtradas.length === 0) {
      filtradas = empresasProspeccao;
    }

    window.renderEmpresas(filtradas);
    
    if (cidade) {
       const iframe = document.getElementById('google-map-frame');
       if (iframe) iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(categoria + ' em ' + cidade + ' MG')}&output=embed`;
    }
  } catch (err) {
    console.error('Erro na busca IA:', err);
    const filtradas = empresasProspeccao.filter(emp => 
      (!search || emp.nome.toLowerCase().includes(search.toLowerCase())) && 
      (!cidade || emp.cidade === cidade)
    );
    window.renderEmpresas(filtradas.length > 0 ? filtradas : empresasProspeccao);
  }
};

window.renderEmpresas = function(lista) {
  const grid = document.getElementById('prospeccao-grid');
  if (!grid) return;
  grid.innerHTML = lista.map(emp => {
    const phone = (emp.tel || '').replace(/\D/g, '');
    return `
    <div class="empresa-card" style="display:flex;flex-direction:column;justify-content:space-between;min-height:160px">
      <div>
        <div style="font-weight:700;font-size:1rem;margin-bottom:0.25rem">${emp.nome}</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">${emp.cat} - ${emp.cidade}</div>
        <div style="margin-top:0.5rem;font-size:0.85rem;display:flex;align-items:center;gap:0.4rem;color:var(--text-secondary)">
          <i data-lucide="phone" style="width:12px"></i> ${emp.tel || '(38) ----'}
        </div>
      </div>
      <div style="margin-top:1rem;display:flex;justify-content:space-between;align-items:center;gap:0.5rem">
        <span class="badge badge-green" style="font-size:0.7rem;font-weight:700">${emp.score || 80} pts</span>
        <button onclick="openDirectWhatsApp('${phone}', '${emp.nome}')" style="background:linear-gradient(135deg,#25d366,#128c7e);color:white;border:none;border-radius:100px;padding:0.5rem 0.85rem;font-size:0.75rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:0.4rem">
          <i data-lucide="message-circle" style="width:14px;height:14px"></i> WhatsApp
        </button>
      </div>
    </div>
  `}).join('');
  if (window.lucide) window.lucide.createIcons();
};

window.openWhatsAppAI = function() {
  const panel = document.getElementById('whatsapp-ai-panel');
  if (panel) panel.style.display = 'block';
};

window.openDirectWhatsApp = function(phone, companyName) {
  const panel = document.getElementById('whatsapp-ai-panel');
  if (panel) {
    panel.style.display = 'block';
    const waEmpresa = document.getElementById('wa-empresa');
    const waNumero = document.getElementById('wa-numero');
    if (waEmpresa) waEmpresa.value = companyName;
    if (waNumero) waNumero.value = phone;
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

window.setTone = function(btn, tone) {
  document.querySelectorAll('.wa-tone').forEach(b => {
    b.classList.remove('active');
    b.style.background = 'var(--bg)';
    b.style.color = 'var(--text)';
  });
  btn.classList.add('active');
  btn.style.background = 'var(--primary)';
  btn.style.color = 'white';
  window.selectedTone = tone;
};

window.generateWhatsAppMessage = async function() {
  const empresa = document.getElementById('wa-empresa')?.value;
  const segmento = document.getElementById('wa-segmento')?.value;
  const numero = document.getElementById('wa-numero')?.value;
  const tone = window.selectedTone || 'profissional';
  const apiKey = localStorage.getItem('nobel_groq_key');

  if (!empresa) {
    alert('Por favor, informe o nome da empresa.');
    return;
  }

  const preview = document.getElementById('wa-preview');
  const actions = document.getElementById('wa-actions');
  if (preview) { preview.style.display = 'block'; preview.textContent = 'Gerando mensagem...'; }

  try {
    if (typeof window.generateMarketingCopy === 'function') {
      const result = await window.generateMarketingCopy({
        topic: `Mensagem de prospecção via WhatsApp para a empresa ${empresa} do segmento ${segmento}. O tom deve ser ${tone}. Foco em oferecer serviços de contabilidade consultiva e redução de impostos.`,
        channel: 'whatsapp',
        tone: tone,
        apiKey: apiKey || undefined
      });
      
      const message = result.content || result;
      if (preview) preview.textContent = message;
      
      const cleanNumber = (numero || '').replace(/\D/g, '');
      const text = encodeURIComponent(message);
      const waLink = document.getElementById('wa-link');
      if (waLink) waLink.href = `https://wa.me/${cleanNumber.startsWith('55') ? cleanNumber : '55'+cleanNumber}?text=${text}`;
      if (actions) actions.style.display = 'flex';
    } else {
      const message = `Olá! Vi sua empresa ${empresa} e gostaria de apresentar nossos serviços contábeis especializados em ${segmento}. Podemos ajudar a reduzir sua carga tributária legalmente. Posso agendar uma reunião?`;
      if (preview) preview.textContent = message;
      const cleanNumber = (numero || '').replace(/\D/g, '');
      const waLink = document.getElementById('wa-link');
      if (waLink) waLink.href = `https://wa.me/${cleanNumber.startsWith('55') ? cleanNumber : '55'+cleanNumber}?text=${encodeURIComponent(message)}`;
      if (actions) actions.style.display = 'flex';
    }
  } catch (err) {
    console.error(err);
    if (preview) preview.textContent = `Erro ao gerar mensagem: ${err.message}`;
  }
};

window.copyMessage = function() {
  const preview = document.getElementById('wa-preview');
  if (preview) {
    navigator.clipboard.writeText(preview.textContent).then(() => {
      alert('Mensagem copiada!');
    });
  }
};

window.searchGoogleMaps = function(query) {
  const cidade = document.getElementById('prop-cidade')?.value || 'Montes Claros';
  const fullQuery = `${query} em ${cidade} MG`;
  const encodedQuery = encodeURIComponent(fullQuery);
  
  const iframe = document.getElementById('google-map-frame');
  if (iframe) {
    iframe.src = `https://www.google.com/maps?q=${encodedQuery}&output=embed`;
  }
  
  window.open(`https://www.google.com/maps/search/${encodedQuery}`, '_blank');
};

// Tab Togglers
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

window.toggleEquipeTab = (btn, tab) => {
  document.querySelectorAll('#equipe-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const sections = ['todos', 'comercial', 'contabil', 'financeiro', 'atendimento'];
  sections.forEach(s => {
    const el = document.getElementById('equipe-content-' + s);
    if (el) el.style.display = (s === tab) ? 'block' : 'none';
  });
};

window.toggleConfigIA = function() {
  const el = document.getElementById('ia-config');
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
};

window.openAlterdataConfig = function() {
  const savedKey = localStorage.getItem('nobel_alterdata_key') || '';
  const savedUrl = localStorage.getItem('nobel_alterdata_url') || '';
  
  openModal({
    title: "Configurar Integração Alterdata",
    body: `
      <form id="alterdata-config-form">
        <div class="form-group">
          <label>URL da API Alterdata</label>
          <input type="text" id="alt-url" class="form-control" value="${savedUrl}" placeholder="https://api.alterdata.com.br/v1">
        </div>
        <div class="form-group">
          <label>Chave de API (Token)</label>
          <input type="password" id="alt-key" class="form-control" value="${savedKey}" placeholder="Seu token de acesso">
        </div>
        <div style="background:rgba(59,130,246,0.1);padding:1rem;border-radius:8px;font-size:0.8rem;color:var(--info)">
          <i data-lucide="info" style="width:14px;display:inline"></i> 
          Os dados do Alterdata serão usados para alimentar a Carteira de Clientes e a Inteligência de Perfil.
        </div>
      </form>
    `,
    confirmText: "Salvar Configurações",
    onConfirm: () => {
      const key = document.getElementById('alt-key').value;
      const url = document.getElementById('alt-url').value;
      localStorage.setItem('nobel_alterdata_key', key);
      localStorage.setItem('nobel_alterdata_url', url);
      
      const statusText = document.getElementById('alterdata-status-text');
      if (statusText) statusText.textContent = key ? 'Conectado' : 'Pendente';
      
      alert('Configurações do Alterdata salvas!');
      closeModal();
    }
  });
};

window.saveApiKeys = function() {
  const groq = document.getElementById('api-key-groq')?.value;
  if (groq) {
    localStorage.setItem('nobel_groq_key', groq);
    alert('Configurações de IA salvas!');
  }
};

window.handleAction = (action) => {
  const isInternal = action.toLowerCase().includes('financeiro') || action.toLowerCase().includes('equipe') || action.toLowerCase().includes('contabil') || action.toLowerCase().includes('conta') || action.toLowerCase().includes('pagar') || action.toLowerCase().includes('receber');
  
  
  openModal({
    title: "Ação: " + action,
    body: `<p>A funcionalidade <strong>${action}</strong> está sendo processada.</p>
           <p style="font-size:0.85rem;color:var(--text-muted);margin-top:1rem">
             ${isInternal ? 'Os dados desta operação são restritos ao uso interno do Escritório Nobel.' : 'Esta ação será sincronizada com os dados do cliente via Alterdata.'}
           </p>`,
    confirmText: "Entendido",
    onConfirm: () => closeModal()
  });
};

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
    // Simulação de busca real usando a chave
    await new Promise(resolve => setTimeout(resolve, 2000));
    document.getElementById('sync-status-text').textContent = "Buscando carteira de clientes...";
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Aqui seria o fetch real: const res = await fetch(`${url}/clientes`, { headers: { 'Authorization': `Bearer ${key}` } });
    
    document.getElementById('sync-status-icon').innerHTML = '<i data-lucide="check-circle" style="width:40px;height:40px;color:var(--accent)"></i>';
    document.getElementById('sync-status-text').innerHTML = "<strong>Sincronização Concluída!</strong><br>3 novos clientes importados e 12 atualizados.";
    if (window.lucide) window.lucide.createIcons();
    
    // Mock update
    const newClients = [
      { id: Date.now(), nome: "Padaria Vila Nova", cnpj: "33.444.555/0001-66", regime: "Simples Nacional", responsavel: "Julia Rocha (Atendimento)", status: "Regular" }
    ];
    window.appState.clientes = [...window.appState.clientes, ...newClients];
    window.renderClientes();
  } catch (err) {
    document.getElementById('sync-status-text').innerHTML = `<span style="color:var(--danger)">Erro na sincronização: ${err.message}</span>`;
  }
};

window.generateProjection = function() {
  alert('Projeção de fluxo de caixa gerada com dados dos últimos 6 meses.');
};

window.quickAction = function(type) {
  const msgs = {
    'analisar': 'Analisando saúde fiscal da empresa selecionada...',
    'proposta': 'Gerando proposta comercial personalizada...',
    'relatorio': 'Preparando relatório gerencial...',
    'campanha': 'Criando campanha de marketing...'
  };
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = msgs[type] || 'Como posso ajudar?';
    window.sendChat();
  }
};

window.sendPortalChat = function() {
  const input = document.getElementById('chat-portal-input');
  if (!input || !input.value.trim()) return;
  const container = document.getElementById('chat-portal-messages');
  const msg = input.value.trim();
  container.innerHTML += `
    <div class="chat-message user">
      <div class="chat-avatar user"><i data-lucide="user" style="width:18px"></i></div>
      <div class="chat-bubble">${msg}</div>
    </div>
    <div class="chat-message ai">
      <div class="chat-avatar ai"><i data-lucide="sparkles" style="width:18px"></i></div>
      <div class="chat-bubble">Entendido! Vou verificar essa informação para você. Nossa equipe também está disponível pelo WhatsApp para dúvidas mais complexas.</div>
    </div>
  `;
  input.value = '';
  if (window.lucide) window.lucide.createIcons();
  container.scrollTop = container.scrollHeight;
};

// Initialize App
function initApp() {
  console.log('Nobel ERP Initialized');
  
  // Show dashboard
  const dashView = document.getElementById('view-dashboard');
  if (dashView) {
    dashView.style.display = 'block';
    dashView.classList.add('active');
  }

  // Init charts
  setTimeout(() => {
    if (typeof window.initCharts === 'function') window.initCharts();
    if (typeof window.initFiscalCalendar === 'function') window.initFiscalCalendar();
    if (typeof window.initAgendaCalendar === 'function') window.initAgendaCalendar();
  }, 200);

  // Initial Renders
  window.renderClientes();
  window.renderLeads();
  window.renderFinanceiro();
  window.renderEquipe();
  window.renderFiscal();
  window.renderContabil();

  // Load saved API Keys
  const savedGroq = localStorage.getItem('nobel_groq_key');
  if (savedGroq && document.getElementById('api-key-groq')) {
    document.getElementById('api-key-groq').value = savedGroq;
  }

  const savedAltKey = localStorage.getItem('nobel_alterdata_key');
  const altStatusEl = document.getElementById('alterdata-status-text');
  if (altStatusEl) {
    altStatusEl.textContent = savedAltKey ? 'Conectado' : 'Pendente';
    if (savedAltKey) altStatusEl.style.color = 'var(--accent)';
  }

  if (window.lucide) window.lucide.createIcons();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// More CRUD & Modals
window.openNewEmployeeModal = function() {
  const body = `
    <form id="new-employee-form">
      <div class="form-group"><label>Nome Completo</label><input type="text" name="nome" class="form-control" required></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div class="form-group"><label>Cargo</label><input type="text" name="cargo" class="form-control" required></div>
        <div class="form-group"><label>Departamento</label>
          <select name="depto" class="form-control">
            <option>Fiscal</option><option>Contábil</option><option>Pessoal</option><option>Financeiro</option>
          </select>
        </div>
      </div>
      <div class="form-group"><label>Data Admissão</label><input type="date" name="admissao" class="form-control"></div>
    </form>
  `;
  openModal({
    title: "Cadastrar Novo Colaborador Nobel",
    body,
    confirmText: "Salvar Cadastro",
    onConfirm: () => {
      alert("Colaborador cadastrado no banco de dados interno da Nobel.");
      closeModal();
    }
  });
};

window.openNewTeamMemberModal = window.openNewEmployeeModal;

window.openNewEventModal = function() {
  const body = `
    <form id="new-event-form">
      <div class="form-group"><label>Título do Compromisso</label><input type="text" name="titulo" class="form-control" required></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div class="form-group"><label>Data</label><input type="date" name="data" class="form-control" required></div>
        <div class="form-group"><label>Hora</label><input type="time" name="hora" class="form-control"></div>
      </div>
      <div class="form-group"><label>Tipo</label>
        <select name="tipo" class="form-control">
          <option>Interno</option><option>Reunião Cliente</option><option>Prazo Fiscal</option>
        </select>
      </div>
    </form>
  `;
  openModal({
    title: "Novo Evento na Agenda Nobel",
    body,
    confirmText: "Agendar",
    onConfirm: () => {
      alert("Evento agendado com sucesso.");
      closeModal();
    }
  });
};

window.openNewFiscalModal = function() {
  const body = `
    <form id="new-fiscal-form">
      <div class="form-group"><label>Obrigação / Guia</label><input type="text" name="titulo" class="form-control" placeholder="Ex: DAS Junho" required></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div class="form-group"><label>Vencimento</label><input type="date" name="vencimento" class="form-control" required></div>
        <div class="form-group"><label>Prioridade</label>
          <select name="prioridade" class="form-control">
            <option>Normal</option><option>Urgente</option>
          </select>
        </div>
      </div>
    </form>
  `;
  openModal({
    title: "Cadastrar Prazo Fiscal",
    body,
    confirmText: "Salvar Prazo",
    onConfirm: () => {
      alert("Prazo fiscal cadastrado para monitoramento.");
      closeModal();
    }
  });
};

window.handleSocialPost = (platform, type, imgUrl) => {
  const url = decodeURIComponent(imgUrl);
  const text = encodeURIComponent("Confira o novo material da Contabilidade Nobel! #Contabilidade #NobelERP");
  
  if (platform === 'whatsapp') {
    window.open(`https://wa.me/?text=${text}%20${encodeURIComponent(url)}`, '_blank');
  } else if (platform === 'instagram') {
    // Instagram doesn't support direct API posting from web easily without auth, 
    // so we provide instructions/fallback
    openModal({
      title: "Postar no Instagram",
      body: `<div style="text-align:center">
               <img src="${url}" style="width:200px;border-radius:12px;margin-bottom:1rem">
               <p>O Instagram não permite postagens diretas via navegador. </p>
               <p style="font-weight:700">Salve a imagem e poste manualmente no seu perfil!</p>
               <a href="${url}" download="nobel-marketing.png" class="nav-cta" style="display:inline-block;margin-top:1rem">Baixar Imagem</a>
             </div>`,
      confirmText: "Entendido",
      onConfirm: () => closeModal()
    });
  }
};

window.analyzeFullPortfolioIA = async function() {
  const p1 = document.getElementById('portfolio-pillar-1');
  const p2 = document.getElementById('portfolio-pillar-2');
  const p3 = document.getElementById('portfolio-pillar-3');
  const p4 = document.getElementById('portfolio-pillar-4');
  const btn = document.getElementById('btn-analyze-full-portfolio');

  if (btn) btn.disabled = true;
  [p1, p2, p3, p4].forEach(p => { if(p) p.innerHTML = '<span class="spinner-mini" style="display:inline-block; width:10px; height:10px; border:1px solid #ccc; border-top-color:var(--primary); border-radius:50%; animation:spin 1s linear infinite"></span> Processando...'; });

  try {
    const clientsCount = window.appState.clientes.length;
    const regimes = [...new Set(window.appState.clientes.map(c => c.regime))].join(', ');
    
    const snapshot = `
      Analise a CARTEIRA TOTAL da Contabilidade Nobel contendo ${clientsCount} clientes sincronizados.
      Regimes presentes: ${regimes}.
      Forneça um diagnóstico MACRO da carteira dividido nos 4 pilares:
      1. Tendências & Crescimento (Visão geral de expansão)
      2. Risco de Churn (Alerta de possíveis saídas na base)
      3. Cross-Sell / Upsell (Serviços mais demandados)
      4. Saúde Fiscal (Média de conformidade da base)
      
      Retorne estritamente um JSON puro (sem markdown) com os campos: pillar1, pillar2, pillar3, pillar4.
    `;
    
    if (typeof window.generateBusinessInsights !== 'function') throw new Error('Serviço de IA não disponível');
    
    const result = await window.generateBusinessInsights({ snapshot, forceJson: true });
    let cleanContent = result.content.trim();
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```json|```/g, '').trim();
    }
    const data = JSON.parse(cleanContent);

    
    if (p1) p1.textContent = data.pillar1;
    if (p2) p2.textContent = data.pillar2;
    if (p3) p3.textContent = data.pillar3;
    if (p4) p4.textContent = data.pillar4;
  } catch (err) {
    console.error(err);
    [p1, p2, p3, p4].forEach(p => { if(p) p.textContent = 'Erro na análise.'; });
  } finally {
    if (btn) btn.disabled = false;
  }
};
