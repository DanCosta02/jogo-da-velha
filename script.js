/*
 * Jogo da Velha Inteligente
 * Desenvolvido por Daniel Costa
 * Licença: Uso não comercial
 * Este projeto utiliza técnicas de aprendizado de máquina, como Q-learning, 
 * além de heurísticas para melhorar a jogabilidade da máquina.
 */

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
const statusDisplay = document.querySelector('#status');
const cells = document.querySelectorAll('.cell');

// Aqui fica a Tabela Q (usada para aprendizado), recuperada do Local Storage
let QTable = loadQTable() || {};

// Parâmetros do aprendizado
const learningRate = 0.1;
const discountFactor = 0.9;
let explorationRate = 0.5; // Começa com uma taxa de exploração alta

let totalGames = loadTotalGames() || 0; // Número total de partidas jogadas (para reduzir a exploração ao longo do tempo)

// Condições de vitória
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Função para obter o estado do tabuleiro como uma string
function getBoardState() {
    return board.join('');
}

// Inicializa a Q-Table para um estado específico
function initializeQTable(state) {
    if (!QTable[state]) {
        QTable[state] = Array(9).fill(0); // 9 ações possíveis
    }
}

// Salva a Q-Table no Local Storage
function saveQTable() {
    localStorage.setItem('qtable', JSON.stringify(QTable));
}

// Carrega a Q-Table do Local Storage
function loadQTable() {
    return JSON.parse(localStorage.getItem('qtable'));
}

// Salva o total de partidas jogadas no Local Storage
function saveTotalGames() {
    localStorage.setItem('totalGames', totalGames);
}

// Carrega o total de partidas jogadas do Local Storage
function loadTotalGames() {
    return parseInt(localStorage.getItem('totalGames')) || 0;
}

// Função para encontrar uma jogada vencedora (ou para bloquear o adversário)
function findWinningMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === player && board[b] === player && board[c] === '') return c;
        if (board[a] === player && board[c] === player && board[b] === '') return b;
        if (board[b] === player && board[c] === player && board[a] === '') return a;
    }
    return null; // Se não encontrar nenhuma jogada vencedora
}

// Máquina faz uma jogada
function machinePlay() {
    const currentState = getBoardState();
    initializeQTable(currentState);

    // 1. Tentar vencer imediatamente
    let action = findWinningMove(currentPlayer);
    if (action === null) {
        // 2. Bloquear o oponente
        action = findWinningMove('X'); // Tenta bloquear o jogador
    }
    if (action === null) {
        // 3. Jogar no centro, se disponível
        if (board[4] === '') {
            action = 4;
        }
    }
    if (action === null) {
        // 4. Jogar nos cantos, se disponíveis
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(corner => board[corner] === '');
        if (availableCorners.length > 0) {
            action = availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }
    }
    if (action === null) {
        // 5. Jogada aleatória, se nada acima for possível
        action = Math.floor(Math.random() * 9);
        while (board[action] !== '') {
            action = Math.floor(Math.random() * 9);
        }
    }

    board[action] = currentPlayer;
    document.querySelector(`[data-index='${action}']`).innerText = currentPlayer;

    handleResultValidation();
    saveQTable();  // Salva a tabela sempre que a máquina joga
}

// Jogador faz uma jogada
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    board[clickedCellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;

    handleResultValidation();
    if (gameActive) {
        currentPlayer = 'O'; // Alterna para o jogador 'O' (máquina)
        machinePlay();
    }
}

// Validação de resultados
function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = board[winCondition[0]];
        let b = board[winCondition[1]];
        let c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = `Jogador ${currentPlayer} venceu!`;
        gameActive = false;
        return;
    }

    let roundDraw = !board.includes('');
    if (roundDraw) {
        statusDisplay.innerHTML = `Empate!`;
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Função para aprendizado Q-Learning
function updateQTable(prevState, action, reward, newState) {
    initializeQTable(prevState);
    initializeQTable(newState);

    // Fórmula de Q-learning
    QTable[prevState][action] = QTable[prevState][action] + learningRate * (
        reward + discountFactor * Math.max(...QTable[newState]) - QTable[prevState][action]
    );
}

// Função para redução gradual da exploração
function adjustExplorationRate() {
    explorationRate = Math.max(0.1, explorationRate - 0.01); // Não deixa a exploração cair abaixo de 10%
}

// Reiniciar o jogo
function handleRestartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    statusDisplay.innerHTML = '';
    cells.forEach(cell => cell.innerHTML = '');

    // Ajustar a taxa de exploração após cada jogo
    adjustExplorationRate();
    totalGames++;
    saveTotalGames();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));