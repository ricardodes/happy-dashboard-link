// Nobel ERP - Global State Management
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
