
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
