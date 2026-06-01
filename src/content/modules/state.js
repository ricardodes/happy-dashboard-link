// Nobel ERP - Global State Management with Proxy for Error Prevention
// This allows us to catch undefined property accesses and log them
const stateHandler = {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    }
    console.warn(`Attempted to access non-existent property: ${prop} in appState`);
    return undefined;
  }
};

const rawState = {
  clientes: [
    { id: 1, nome: "Supermercado Central MOC", cnpj: "00.123.456/0001-99", regime: "Lucro Real", responsavel: "Ana Paula (Fiscal)", status: "Regular" },
    { id: 2, nome: "Clínica Vida Plena", cnpj: "11.222.333/0001-88", regime: "Simples Nacional", responsavel: "Carlos Mendes (Contábil)", status: "Pendência" },
    { id: 3, nome: "Construtora Norte Minas", cnpj: "22.333.444/0001-77", regime: "Lucro Presumido", responsavel: "Ana Paula (Fiscal)", status: "Regular" }
  ],
  leads: [
    { id: 1, nome: "TechSolutions Brasil", segmento: "Tecnologia", cidade: "São Paulo", responsavel: "Carlos M.", valor: "4.2K", stage: "novo" },
    { id: 2, nome: "Restaurante Sabor & Arte", segmento: "Alimentação", cidade: "Campinas", responsavel: "Julia A.", valor: "1.8K", stage: "novo" }
  ],
  financeiro: {
    pagar: [
      { id: 1, descricao: "Aluguel Sede Nobel", vencimento: "10/06/2024", valor: "12.500,00", status: "Pendente" }
    ],
    receber: []
  },
  fiscal: {
    nfe: [],
    sped: []
  },
  contabil: {
    lancamentos: []
  },
  users: [
    { id: 1, nome: "Admin Nobel", email: "admin@nobel.com", perfil: "Super Admin", status: "Ativo", initial: "AN", color: "var(--primary)" }
  ],
  equipe: [
    { id: 1, nome: "Ana Paula Silva", cargo: "Gestora Fiscal", depto: "Fiscal", admissao: "10/02/2020", status: "Ativo" }
  ]
};

window.appState = new Proxy(rawState, stateHandler);
