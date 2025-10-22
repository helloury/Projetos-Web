
class Aluno {
  constructor(nome, idade, curso, notaFinal) {
    this.nome = nome;
    this.idade = Number(idade);
    this.curso = curso;
    this.notaFinal = Number(notaFinal);
  }

  isAprovado() {
    return this.notaFinal >= 7;
  }

  toString() {
    return `${this.nome} - ${this.curso} (${this.notaFinal})`;
  }
}

// ===== Dados e Elementos =====
let alunos = [];
const form = document.getElementById("formAluno");
const tabela = document.querySelector("#tabelaAlunos tbody");
const saidaRelatorio = document.getElementById("saidaRelatorio");


const salvarAlunos = () => {
  localStorage.setItem("alunos", JSON.stringify(alunos));
};

const carregarAlunos = () => {
  const dados = localStorage.getItem("alunos");
  if (dados) {
    const lista = JSON.parse(dados);
    alunos = lista.map(a => new Aluno(a.nome, a.idade, a.curso, a.notaFinal));
    atualizarTabela();
  }
};

// ===== Função =====
const atualizarTabela = () => {
  tabela.innerHTML = "";
  alunos.forEach((a, i) => {
    const linha = tabela.insertRow();
    linha.innerHTML = `
      <td>${a.nome}</td>
      <td>${a.idade}</td>
      <td>${a.curso}</td>
      <td>${a.notaFinal}</td>
      <td>${a.isAprovado() ? "✅ Sim" : "❌ Não"}</td>
      <td>
        <button class="editar" data-i="${i}">Editar</button>
        <button class="excluir" data-i="${i}">Excluir</button>
      </td>
    `;
  });
  salvarAlunos(); 
};

// ===== Cadastro =====
form.addEventListener("submit", e => {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const idade = document.getElementById("idade").value;
  const curso = document.querySelector('input[name="curso"]:checked')?.value;
  const notaFinal = document.getElementById("notaFinal").value;

  if (!curso) return alert("Selecione um curso!");

  const novoAluno = new Aluno(nome, idade, curso, notaFinal);
  alunos.push(novoAluno);
  atualizarTabela();
  form.reset();
  alert("Aluno cadastrado com sucesso!");
});

// ===== Edição e exclusão =====
tabela.addEventListener("click", e => {
  const i = e.target.dataset.i;
  if (e.target.classList.contains("excluir")) {
    alunos.splice(i, 1);
    atualizarTabela();
    alert("Aluno excluído!");
  } else if (e.target.classList.contains("editar")) {
    const a = alunos[i];
    document.getElementById("nome").value = a.nome;
    document.getElementById("idade").value = a.idade;
    document.getElementById("notaFinal").value = a.notaFinal;
    document.querySelector(`input[value="${a.curso}"]`).checked = true;
    alunos.splice(i, 1);
    atualizarTabela();
    alert("Edite os dados e clique em Cadastrar novamente para atualizar.");
  }
});

// ===== Relatórios =====
document.getElementById("btnAprovados").addEventListener("click", () => {
  const aprovados = alunos.filter(a => a.isAprovado());
  saidaRelatorio.innerHTML = aprovados.length
    ? `<strong>Aprovados:</strong> ${aprovados.map(a => a.nome).join(", ")}`
    : "Nenhum aluno aprovado.";
});

document.getElementById("btnMediaNotas").addEventListener("click", () => {
  if (alunos.length === 0)
    return (saidaRelatorio.textContent = "Nenhum aluno cadastrado.");
  const media = alunos.reduce((s, a) => s + a.notaFinal, 0) / alunos.length;
  saidaRelatorio.textContent = `Média das notas: ${media.toFixed(2)}`;
});

document.getElementById("btnMediaIdades").addEventListener("click", () => {
  if (alunos.length === 0)
    return (saidaRelatorio.textContent = "Nenhum aluno cadastrado.");
  const media = alunos.reduce((s, a) => s + a.idade, 0) / alunos.length;
  saidaRelatorio.textContent = `Média das idades: ${media.toFixed(1)} anos`;
});

document.getElementById("btnOrdemAlfabetica").addEventListener("click", () => {
  if (alunos.length === 0)
    return (saidaRelatorio.textContent = "Nenhum aluno cadastrado.");
  const nomes = alunos.map(a => a.nome).sort();
  saidaRelatorio.innerHTML = `<strong>Ordem alfabética:</strong> ${nomes.join(", ")}`;
});

document.getElementById("btnQtdPorCurso").addEventListener("click", () => {
  if (alunos.length === 0)
    return (saidaRelatorio.textContent = "Nenhum aluno cadastrado.");
  const qtd = alunos.reduce((acc, a) => {
    acc[a.curso] = (acc[a.curso] || 0) + 1;
    return acc;
  }, {});
  const lista = Object.entries(qtd)
    .map(([curso, n]) => `${curso}: ${n}`)
    .join(" | ");
  saidaRelatorio.innerHTML = `<strong>Quantidade por curso:</strong> ${lista}`;
});

// ===== Carregar ao iniciar =====
window.addEventListener("load", carregarAlunos);
