
class Funcionario {
  constructor(id, nome, idade, cargo, salario) {
    this.id = id;
    this.nome = nome;
    this.idade = Number(idade);
    this.cargo = cargo;
    this.salario = Number(salario);
  }

  atualizar(nome, idade, cargo, salario) {
    this.nome = nome;
    this.idade = Number(idade);
    this.cargo = cargo;
    this.salario = Number(salario);
  }
}

// ===== Usando localStorage =====
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
const resultadoRelatorio = document.getElementById("resultado-relatorio");

// ===== Renderização =====
const renderTabela = () => {
  tabela.innerHTML = "";
  funcionarios.forEach((f) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${f.nome}</td>
      <td>${f.idade}</td>
      <td>${f.cargo}</td>
      <td>R$ ${f.salario.toFixed(2)}</td>
      <td>
        <button class="editar">Editar</button>
        <button class="excluir">Excluir</button>
      </td>
    `;

    // Eventos anônimos
    tr.querySelector(".editar").onclick = () => editarFuncionario(f.id);
    tr.querySelector(".excluir").onclick = () => excluirFuncionario(f.id);

    tabela.appendChild(tr);
  });
};

// ===== Funções CRUD =====
const editarFuncionario = (id) => {
  const f = funcionarios.find((f) => f.id === id);
  if (!f) return;

  document.getElementById("nome").value = f.nome;
  document.getElementById("idade").value = f.idade;
  document.getElementById("cargo").value = f.cargo;
  document.getElementById("salario").value = f.salario;

  editandoId = id;
};

const excluirFuncionario = (id) => {
  funcionarios = funcionarios.filter((f) => f.id !== id);
  salvarLocalStorage();
  renderTabela();
};

// ===== Evento de Cadastro =====
form.onsubmit = (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const idade = document.getElementById("idade").value;
  const cargo = document.getElementById("cargo").value.trim();
  const salario = document.getElementById("salario").value;

  if (editandoId) {
    const f = funcionarios.find((f) => f.id === editandoId);
    f.atualizar(nome, idade, cargo, salario);
    editandoId = null;
  } else {
    const novo = new Funcionario(Date.now(), nome, idade, cargo, salario);
    funcionarios.push(novo);
  }

  salvarLocalStorage();
  form.reset();
  renderTabela();
};

// ===== Relatórios com map/filter/reduce =====
document.getElementById("relatorio1").onclick = () => {
  const resultado = funcionarios.filter((f) => f.salario > 5000);
  resultadoRelatorio.innerHTML = `
    <h3>Funcionários com salário maior que R$ 5000:</h3>
    <ul>${resultado.map((f) => `<li>${f.nome} - R$ ${f.salario.toFixed(2)}</li>`).join("")}</ul>
  `;
};

document.getElementById("relatorio2").onclick = () => {
  const media =
    funcionarios.reduce((acc, f) => acc + f.salario, 0) / funcionarios.length || 0;
  resultadoRelatorio.innerHTML = `<h3>Média Salarial: R$ ${media.toFixed(2)}</h3>`;
};

document.getElementById("relatorio3").onclick = () => {
  const cargosUnicos = [...new Set(funcionarios.map((f) => f.cargo))];
  resultadoRelatorio.innerHTML = `
    <h3>Cargos Únicos:</h3>
    <ul>${cargosUnicos.map((c) => `<li>${c}</li>`).join("")}</ul>
  `;
};

document.getElementById("relatorio4").onclick = () => {
  const nomesMaiusculos = funcionarios.map((f) => f.nome.toUpperCase());
  resultadoRelatorio.innerHTML = `
    <h3>Nomes em Maiúsculo:</h3>
    <ul>${nomesMaiusculos.map((n) => `<li>${n}</li>`).join("")}</ul>
  `;
};

// ===== Inicialização =====
renderTabela();
