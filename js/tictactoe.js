document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('resetButton');
    const moveSound = document.getElementById('moveSound');
    const winSound = document.getElementById('winSound');

    let currentPlayer = 'X';
    let gameBoard = Array(9).fill('');
    let gameActive = true;

    // Create board cells
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        board.appendChild(cell);
    }

    function handleCellClick(index) {
        if (!gameActive || gameBoard[index] !== '') return;

        gameBoard[index] = currentPlayer;
        const cell = board.children[index];
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        if (moveSound) {
            moveSound.currentTime = 0;
            moveSound.play().catch(e => console.log('Audio play failed:', e));
        }

        if (checkWinner()) {
            if (winSound) {
                winSound.currentTime = 0;
                winSound.play().catch(e => console.log('Audio play failed:', e));
            }
            status.textContent = `¡${currentPlayer} wins!`;
            gameActive = false;
            return;
        }

        if (gameBoard.every(cell => cell !== '')) {
            status.textContent = '¡Draw!';
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    }

    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return gameBoard[a] !== '' &&
                   gameBoard[a] === gameBoard[b] &&
                   gameBoard[a] === gameBoard[c];
        });
    }

    function resetGame() {
        gameBoard = Array(9).fill('');
        gameActive = true;
        currentPlayer = 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
        
        board.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
    }

    resetButton.addEventListener('click', resetGame);
});
