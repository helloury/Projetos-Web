
class Funcionario {
  constructor(nome, idade, cargo, salario) {
    this._nome = nome;
    this._idade = idade;
    this._cargo = cargo;
    this._salario = salario;
  }

  get nome() { return this._nome; }
  set nome(novoNome) { this._nome = novoNome; }

  get idade() { return this._idade; }
  set idade(novaIdade) { this._idade = novaIdade; }

  get cargo() { return this._cargo; }
  set cargo(novoCargo) { this._cargo = novoCargo; }

  get salario() { return this._salario; }
  set salario(novoSalario) { this._salario = novoSalario; }

  toString() {
    return `${this._nome} - ${this._cargo} (R$ ${this._salario.toFixed(2)})`;
  }
}


let funcionarios = [];
let indiceEdicao = null;
const form = document.getElementById("form-funcionario");
const tabela = document.querySelector("#tabela-funcionarios tbody");

// Carregar dados salvos no início
window.addEventListener("DOMContentLoaded", () => {
  const dadosSalvos = localStorage.getItem("funcionarios");
  if (dadosSalvos) {
    const objetos = JSON.parse(dadosSalvos);
    funcionarios = objetos.map(obj => new Funcionario(obj._nome, obj._idade, obj._cargo, obj._salario));
    atualizarTabela();
  }
});

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const idade = Number(document.getElementById("idade").value);
  const cargo = document.getElementById("cargo").value.trim();
  const salario = Number(document.getElementById("salario").value);

  if (indiceEdicao === null) {
    const funcionario = new Funcionario(nome, idade, cargo, salario);
    funcionarios.push(funcionario);
  } else {
    const f = funcionarios[indiceEdicao];
    f.nome = nome;
    f.idade = idade;
    f.cargo = cargo;
    f.salario = salario;
    indiceEdicao = null;
  }

  atualizarTabela();
  salvarDados(); // Salva toda vez que altera
  form.reset();
});

function atualizarTabela() {
  tabela.innerHTML = "";
  funcionarios.forEach((f, index) => {
    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>${f.nome}</td>
      <td>${f.idade}</td>
      <td>${f.cargo}</td>
      <td>R$ ${f.salario.toFixed(2)}</td>
      <td>
        <button onclick="editarFuncionario(${index})">Editar</button>
        <button onclick="excluirFuncionario(${index})">Excluir</button>
      </td>
    `;

    tabela.appendChild(linha);
  });
}

// Salvar dados no localStorage
function salvarDados() {
  localStorage.setItem("funcionarios", JSON.stringify(funcionarios));
}

function editarFuncionario(index) {
  const f = funcionarios[index];
  document.getElementById("nome").value = f.nome;
  document.getElementById("idade").value = f.idade;
  document.getElementById("cargo").value = f.cargo;
  document.getElementById("salario").value = f.salario;

  indiceEdicao = index;
}

function excluirFuncionario(index) {
  if (confirm("Deseja realmente excluir este funcionário?")) {
    funcionarios.splice(index, 1);
    atualizarTabela();
    salvarDados(); // Atualiza o armazenamento
  }
}
