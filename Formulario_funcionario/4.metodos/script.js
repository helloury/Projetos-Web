// --- Definição da Classe Funcionario ---
const STORAGE_KEY = 'funcionariosDB';
class Funcionario {
    constructor(nome, idade, cargo, salario, id= null) {
        this._id  != null ? id : Date.now(); 
        this._nome = nome;
        this._idade = idade;
        this._cargo = cargo;
        this._salario = salario;
    }
    // ... (Getters e Setters permanecem os mesmos) ...
    get id() { return this._id; }
    get nome() { return this._nome; }
    get idade() { return this._idade; }
    get cargo() { return this._cargo; }
    get salario() { return this._salario; }
    set nome(novoNome) { this._nome = novoNome; }
    set idade(novaIdade) { this._idade = novaIdade; }
    set cargo(novoCargo) { this._cargo = novoCargo; }
    set salario(novoSalario) { this._salario = novoSalario; }
    toString() {
        return `ID: ${this._id} - ${this._nome}, Cargo: ${this._cargo}, Salário: R$${this._salario.toFixed(2)}`;
    }
}
const salvarDados = () => {
    // 1. Converte o array de objetos em string JSON
    const dadosString = JSON.stringify(funcionarios);
    
    // 2. Salva no localStorage com a nossa chave
    localStorage.setItem(STORAGE_KEY, dadosString);
};
const carregarDados = () => {
    // 1. Pega a string JSON do localStorage
    const dadosGuardados = localStorage.getItem(STORAGE_KEY);

    // 2. Se não houver nada salvo, retorna um array vazio
    if (!dadosGuardados) {
        return [];
    }

    // 3. Converte a string de volta para objetos simples
    const dadosPlanos = JSON.parse(dadosGuardados);

    // 4. O "Pulo do Gato": Transforma os objetos simples de volta
    //    em instâncias da classe Funcionario, restaurando o ID.
    const funcionariosInstanciados = dadosPlanos.map(obj => {
        // (Note que obj._nome, obj._idade vêm do JSON)
        return new Funcionario(obj._nome, obj._idade, obj._cargo, obj._salario, obj._id);
    });
    
    return funcionariosInstanciados;
};
// --- Lógica Principal da Aplicação ---

const funcionarios = [];

// 2. Selecionar os elementos do DOM
const form = document.getElementById('formFuncionario');
const tabelaBody = document.getElementById('tbodyFuncionarios');
const inputNome = document.getElementById('nome');
const inputIdade = document.getElementById('idade');
const inputCargo = document.getElementById('cargo');
const inputSalario = document.getElementById('salario');
const inputEditId = document.getElementById('editId'); 
const submitButton = form.querySelector('button[type="submit"]');

// --- NOVO: Selecionar elementos dos Relatórios ---
const btnRelatorioSalario = document.getElementById('btnRelatorioSalario');
const btnRelatorioMedia = document.getElementById('btnRelatorioMedia');
const btnRelatorioCargos = document.getElementById('btnRelatorioCargos');
const btnRelatorioNomes = document.getElementById('btnRelatorioNomes');
const resultadoRelatorio = document.getElementById('resultadoRelatorio');


// 3. Evento de 'submit' (Cadastro/Edição)
form.addEventListener('submit', (evento) => {
    // ... (Lógica de cadastro e edição permanece a mesma) ...
    evento.preventDefault(); 
    const nome = inputNome.value;
    const idade = parseInt(inputIdade.value);
    const cargo = inputCargo.value;
    const salario = parseFloat(inputSalario.value);
    const idParaEditar = inputEditId.value;

    if (idParaEditar) {
        const funcParaEditar = funcionarios.find( f => f.id === parseInt(idParaEditar) );
        if (funcParaEditar) {
            funcParaEditar.nome = nome;
            funcParaEditar.idade = idade;
            funcParaEditar.cargo = cargo;
            funcParaEditar.salario = salario;
        }
        inputEditId.value = '';
        submitButton.textContent = 'Cadastrar';
    } else {
        const novoFuncionario = new Funcionario(nome, idade, cargo, salario);
        funcionarios.push(novoFuncionario);
    }
   salvarDados();

    atualizarTabela();
    form.reset();
    inputNome.focus();
});

// 4. Função 'atualizarTabela'
const atualizarTabela = () => {
    // ... (Lógica de atualizar tabela permanece a mesma) ...
    tabelaBody.innerHTML = '';
    funcionarios.forEach((func) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${func.nome}</td>
            <td>${func.idade}</td>
            <td>${func.cargo}</td>
            <td>R$ ${func.salario.toFixed(2).replace('.', ',')}</td>
        `; 
        const tdAcoes = document.createElement('td');
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.className = 'btn-acao btn-editar';
        btnEditar.onclick = () => carregarParaEditar(func.id);
        tdAcoes.appendChild(btnEditar);

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.className = 'btn-acao btn-excluir';
        btnExcluir.onclick = () => excluirFuncionario(func.id);
        tdAcoes.appendChild(btnExcluir);

        tr.appendChild(tdAcoes);
        tabelaBody.appendChild(tr);
    });
};

// 5. Funções 'carregarParaEditar' e 'excluirFuncionario'
const carregarParaEditar = (id) => {
    // ... (Lógica permanece a mesma) ...
    const func = funcionarios.find(f => f.id === id);
    if (!func) return;
    inputNome.value = func.nome;
    inputIdade.value = func.idade;
    inputCargo.value = func.cargo;
    inputSalario.value = func.salario;
    inputEditId.value = func.id;
    submitButton.textContent = 'Salvar Edição';
    inputNome.focus();
};

const excluirFuncionario = (id) => {
    // ... (Lógica permanece a mesma) ...
    const indexParaExcluir = funcionarios.findIndex(f => f.id === id);
    if (indexParaExcluir === -1) return;
    const nomeFunc = funcionarios[indexParaExcluir].nome;
    if (confirm(`Tem certeza que deseja excluir ${nomeFunc}?`)) {
        funcionarios.splice(indexParaExcluir, 1); 
        salvarDados();
        atualizarTabela();
    }
};

// --- NOVO: Lógica dos Relatórios ---

// Função auxiliar para exibir resultados
const exibirResultado = (titulo, dadosArray) => {
    // Converte o array de dados em uma string formatada
    const textoResultado = dadosArray.join('\n');
    resultadoRelatorio.textContent = `${titulo}:\n\n${textoResultado}`;
};

// Relatório 1: Salários > R$ 5000 (Usando filter e map)
btnRelatorioSalario.onclick = () => {
    // Dica: Use filter
    const salariosAltos = funcionarios.filter(func => func.salario > 5000);
    
    // Mapeando para um formato de string legível
    const resultado = salariosAltos.map(func => 
        ` - ${func.nome} (Cargo: ${func.cargo}, Salário: R$ ${func.salario.toFixed(2)})`
    );

    if (resultado.length === 0) {
        resultado.push("Nenhum funcionário encontrado com salário superior a R$ 5000.");
    }

    exibirResultado("Funcionários com Salário > R$ 5000", resultado);
};

// Relatório 2: Média Salarial (Usando reduce)
btnRelatorioMedia.onclick = () => {
    if (funcionarios.length === 0) {
        exibirResultado("Média Salarial", ["Nenhum funcionário cadastrado."]);
        return;
    }

    // Dica: Use reduce
    // 1. Mapeia apenas os salários
    const todosSalarios = funcionarios.map(func => func.salario);
    
    // 2. Soma tudo com reduce
    const somaTotal = todosSalarios.reduce((acumulador, salarioAtual) => {
        return acumulador + salarioAtual;
    }, 0); // O '0' é o valor inicial do acumulador

    // 3. Calcula a média
    const media = somaTotal / funcionarios.length;

    exibirResultado("Média Salarial", [
        `Total de Funcionários: ${funcionarios.length}`,
        `Soma Total: R$ ${somaTotal.toFixed(2)}`,
        `Média: R$ ${media.toFixed(2)}`
    ]);
};

// Relatório 3: Cargos Únicos (Usando map e new Set)
btnRelatorioCargos.onclick = () => {
    // Dica: Use map e new Set()
    
    // 1. Cria um array com TODOS os cargos (incluindo duplicados)
    const todosCargos = funcionarios.map(func => func.cargo);
    
    // 2. Cria um Set a partir desse array (remove duplicatas automaticamente)
    const cargosUnicosSet = new Set(todosCargos);
    
    // 3. Converte o Set de volta para um Array (usando Spread operator [...])
    const cargosUnicosArray = [...cargosUnicosSet];
    
    const resultado = cargosUnicosArray.map(cargo => ` - ${cargo}`);

    if (resultado.length === 0) {
        resultado.push("Nenhum cargo cadastrado.");
    }
    
    exibirResultado("Lista de Cargos Únicos", resultado);
};

// Relatório 4: Nomes em Maiúsculo (Usando map)
btnRelatorioNomes.onclick = () => {
    // Dica: Use map
    const nomesMaiusculos = funcionarios.map(func => 
        ` - ${func.nome.toUpperCase()}`
    );

    if (nomesMaiusculos.length === 0) {
        nomesMaiusculos.push("Nenhum funcionário cadastrado.");
    }

    exibirResultado("Nomes dos Funcionários (em maiúsculo)", nomesMaiusculos);
    atualizarTabela();
};