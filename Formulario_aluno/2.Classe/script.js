// ===== Classe Aluno =====
class Aluno {
    constructor(nome, idade, curso, notaFinal) {
        this.nome = nome;
        this.idade = idade;
        this.curso = curso;
        this.notaFinal = parseFloat(notaFinal);
    }

    isAprovado() {
        return this.notaFinal >= 7;
    }

    toString() {
        return `Nome: ${this.nome} | Idade: ${this.idade} | Curso: ${this.curso} | Nota: ${this.notaFinal} | ${this.isAprovado() ? "Aprovado" : "Reprovado"}`;
    }
}

// ===== Variáveis globais =====
let alunos = [];
let editandoIndex = -1;

// ===== Elementos =====
const form = document.getElementById('form-aluno');
const btnCadastrar = document.getElementById('btnCadastrar');
const tabela = document.querySelector('#tabela-alunos tbody');

// ===== Persistência =====
const salvarNoLocalStorage = () => {
    localStorage.setItem('alunos', JSON.stringify(alunos));
};

const carregarDoLocalStorage = () => {
    const dados = localStorage.getItem('alunos');
    if (dados) {
        const lista = JSON.parse(dados);
        // Reconstrói os objetos como instâncias de Aluno
        alunos = lista.map(a => new Aluno(a.nome, a.idade, a.curso, a.notaFinal));
        renderizarTabela();
    }
};

// ===== Funções principais (arrow functions) =====
const limparFormulario = () => {
    form.reset();
    document.querySelector('input[name="curso"][value="JavaScript"]').checked = true;
};

const renderizarTabela = () => {
    tabela.innerHTML = '';

    alunos.forEach((aluno, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.idade}</td>
            <td>${aluno.curso}</td>
            <td>${aluno.notaFinal}</td>
            <td>${aluno.isAprovado() ? '✅ Aprovado' : '❌ Reprovado'}</td>
            <td>
                <button class="btn-editar" data-index="${index}">Editar</button>
                <button class="btn-excluir" data-index="${index}">Excluir</button>
            </td>
        `;
        tabela.appendChild(tr);
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            editarAluno(index);
        });
    });

    document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            excluirAluno(index);
        });
    });
};

const cadastrarAluno = () => {
    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    const nota = document.getElementById('nota').value;
    const curso = document.querySelector('input[name="curso"]:checked')?.value;

    if (!nome || !idade || !nota || !curso) {
        alert("Preencha todos os campos!");
        return;
    }

    const aluno = new Aluno(nome, idade, curso, nota);

    if (editandoIndex === -1) {
        alunos.push(aluno);
        alert("Aluno cadastrado com sucesso!");
        console.log("Cadastrado:", aluno.toString());
    } else {
        alunos[editandoIndex] = aluno;
        alert("Aluno editado com sucesso!");
        console.log("Editado:", aluno.toString());
        editandoIndex = -1;
    }

    salvarNoLocalStorage();
    limparFormulario();
    renderizarTabela();
};

const excluirAluno = (index) => {
    if (confirm("Deseja excluir este aluno?")) {
        console.log("Excluído:", alunos[index].toString());
        alunos.splice(index, 1);
        alert("Aluno excluído com sucesso!");
        salvarNoLocalStorage();
        renderizarTabela();
    }
};

const editarAluno = (index) => {
    const aluno = alunos[index];
    document.getElementById('nome').value = aluno.nome;
    document.getElementById('idade').value = aluno.idade;
    document.getElementById('nota').value = aluno.notaFinal;

    document.querySelectorAll('input[name="curso"]').forEach(radio => {
        radio.checked = (radio.value === aluno.curso);
    });

    editandoIndex = index;
};

// ===== Eventos =====
btnCadastrar.addEventListener('click', function() {
    cadastrarAluno();
});

// ===== Inicialização =====
window.addEventListener('load', carregarDoLocalStorage);
