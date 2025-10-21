// Recupera alunos salvos no localStorage 
let alunos = JSON.parse(localStorage.getItem('alunos')) || [];

// Função para atualizar a tabela na tela
function atualizarTabela() {
    const tbody = document.querySelector("#tabela-alunos tbody");
    tbody.innerHTML = ""; // limpa a tabela

    alunos.forEach((aluno, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.idade}</td>
            <td>${aluno.curso}</td>
            <td>${aluno.nota}</td>
            <td><button onclick="editarAluno(${index})">Editar</button></td>
            <td><button onclick="removerAluno(${index})">Remover</button></td>
        `;

        tbody.appendChild(tr);
    });
}

// Função para cadastrar aluno
function cadastrarAluno() {
    const nome = document.getElementById("nome").value;
    const idade = document.getElementById("idade").value;
    const curso = document.querySelector('input[name="curso"]:checked').value;
    const nota = document.getElementById("nota").value;

    if (!nome || !idade || !nota) {
        alert("Preencha todos os campos!");
        return;
    }

    const aluno = { nome, idade, curso, nota };

    alunos.push(aluno);
    localStorage.setItem('alunos', JSON.stringify(alunos)); // salva no localStorage
    atualizarTabela();
    document.getElementById("form-aluno").reset(); // limpa o formulário
}
function editarAluno(index) {
    const aluno = alunos[index];
    document.getElementById("nome").value = aluno.nome;
    document.getElementById("idade").value = aluno.idade;
    document.querySelector(`input[name="curso"][value="${aluno.curso}"]`).checked = true;
    document.getElementById("nota").value = aluno.nota;

    // Altera o botão para salvar edição
    const botao = document.querySelector("#form-aluno button");
    botao.textContent = "Salvar Alterações";
    botao.onclick = function() { salvarEdicao(index); };
}
function salvarEdicao(index) {
    const nome = document.getElementById("nome").value;
    const idade = document.getElementById("idade").value;
    const curso = document.querySelector('input[name="curso"]:checked').value;
    const nota = document.getElementById("nota").value;

    if (!nome || !idade || !nota) {
        alert("Preencha todos os campos!");
        return;
    }
     alunos[index] = { nome, idade, curso, nota };
    localStorage.setItem('alunos', JSON.stringify(alunos));
    atualizarTabela();

    // Volta o botão ao estado original
    const botao = document.querySelector("#form-aluno button");
    botao.textContent = "Cadastrar";
    botao.onclick = cadastrarAluno;
    document.getElementById("form-aluno").reset();
}

// Função para remover aluno
function removerAluno(index) {
    alunos.splice(index, 1);
    localStorage.setItem('alunos', JSON.stringify(alunos));
    atualizarTabela();
}

// Atualiza a tabela ao carregar a página
window.onload = atualizarTabela;
