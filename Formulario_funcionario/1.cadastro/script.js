
class Funcionario {
  constructor(nome, idade, cargo, salario) {
    this._nome = nome;
    this._idade = idade;
    this._cargo = cargo;
    this._salario = salario;
  }

  // Getters e setters
  get nome() { return this._nome; }
  set nome(novoNome) { this._nome = novoNome; }

  get idade() { return this._idade; }
  set idade(novaIdade) { this._idade = novaIdade; }

  get cargo() { return this._cargo; }
  set cargo(novoCargo) { this._cargo = novoCargo; }

  get salario() { return this._salario; }
  set salario(novoSalario) { this._salario = novoSalario; }

  // Método toString
  toString() {
    return `${this._nome} - ${this._cargo} (R$ ${this._salario.toFixed(2)})`;
  }
}

const funcionarios = [];
const form = document.getElementById("form-funcionario");
const tabela = document.querySelector("#tabela-funcionarios tbody");

form.addEventListener("submit", function(event) {
  event.preventDefault(); // Evita recarregar a página

  const nome = document.getElementById("nome").value.trim();
  const idade = Number(document.getElementById("idade").value);
  const cargo = document.getElementById("cargo").value.trim();
  const salario = Number(document.getElementById("salario").value);

  const funcionario = new Funcionario(nome, idade, cargo, salario);
  funcionarios.push(funcionario);

  atualizarTabela();
  form.reset();
});

function atualizarTabela() {
  tabela.innerHTML = "";
  for (const f of funcionarios) {
    const linha = `
      <tr>
        <td>${f.nome}</td>
        <td>${f.idade}</td>
        <td>${f.cargo}</td>
        <td>R$ ${f.salario.toFixed(2)}</td>
      </tr>`;
    tabela.innerHTML += linha;
  }
}
