
class Funcionario {
  constructor(id, nome, idade, cargo) {
    this.id = id;
    this.nome = nome;
    this.idade = Number(idade);
    this.cargo = cargo;
  }

  atualizar(nome, idade, cargo) {
    this.nome = nome;
    this.idade = Number(idade);
    this.cargo = cargo;
  }
}

// ===== Persistência de Dados =====
const salvarLocalStorage = () => {
  localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
};

const carregarLocalStorage = () => {
  const dados = localStorage.getItem("funcionarios");
  return dados ? JSON.parse(dados) : [];
};


let funcionarios = carregarLocalStorage();
let editandoId = null;

const form = document.getElementById("form-funcionario");
const tabela = document.getElementById("tabela-funcionarios").querySelector("tbody");

// ===== Tabela =====
const renderTabela = () => {
  tabela.innerHTML = "";
  funcionarios.forEach(f => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${f.nome}</td>
      <td>${f.idade}</td>
      <td>${f.cargo}</td>
      <td>
        <button class="editar">Editar</button>
        <button class="excluir">Excluir</button>
      </td>
    `;

    // Funções anônimas (arrow functions) nos botões
    tr.querySelector(".editar").onclick = () => editarFuncionario(f.id);
    tr.querySelector(".excluir").onclick = () => excluirFuncionario(f.id);

    tabela.appendChild(tr);
  });
};

// ===== Cadastro e Atualização =====
form.onsubmit = (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const idade = document.getElementById("idade").value;
  const cargo = document.getElementById("cargo").value.trim();

  if (editandoId === null) {
    const id = funcionarios.length > 0 ? funcionarios[funcionarios.length - 1].id + 1 : 1;
    const novo = new Funcionario(id, nome, idade, cargo);
    funcionarios.push(novo);
  } else {
    const f = funcionarios.find(f => f.id === editandoId);
    if (f) f.atualizar(nome, idade, cargo);
    editandoId = null;
  }

  salvarLocalStorage();
  renderTabela();
  form.reset();
};

// ===== Edição =====
const editarFuncionario = (id) => {
  const f = funcionarios.find(f => f.id === id);
  if (!f) return;
  document.getElementById("nome").value = f.nome;
  document.getElementById("idade").value = f.idade;
  document.getElementById("cargo").value = f.cargo;
  editandoId = id;
};

// ===== Exclusão =====
const excluirFuncionario = (id) => {
  funcionarios = funcionarios.filter(f => f.id !== id);
  salvarLocalStorage();
  renderTabela();
};

// ===== Busca por Nome  =====
const buscarFuncionarioPorNome = (nomeBusca) => {
  const resultado = funcionarios.filter(f =>
    f.nome.toLowerCase().includes(nomeBusca.toLowerCase())
  );

  tabela.innerHTML = "";
  resultado.forEach(f => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${f.nome}</td>
      <td>${f.idade}</td>
      <td>${f.cargo}</td>
      <td>
        <button class="editar">Editar</button>
        <button class="excluir">Excluir</button>
      </td>
    `;

    tr.querySelector(".editar").onclick = () => editarFuncionario(f.id);
    tr.querySelector(".excluir").onclick = () => excluirFuncionario(f.id);
    tabela.appendChild(tr);
  });
};

// ===== Inicialização =====
renderTabela();

// ===== Evento para Busca  =====
const btnBuscar = document.getElementById("btn-buscar");
if (btnBuscar) {
  btnBuscar.onclick = () => {
    const nomeBusca = document.getElementById("busca-nome").value.trim();
    if (nomeBusca) buscarFuncionarioPorNome(nomeBusca);
    else renderTabela(); // Se o campo estiver vazio, mostra todos
  };
}
