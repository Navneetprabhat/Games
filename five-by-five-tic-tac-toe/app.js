(function () {
  'use strict';

  const BOARD_SIZE = 5;
  const WIN_LENGTH = 4;
  const TOTAL_CELLS = BOARD_SIZE * BOARD_SIZE;
  const DIRECTIONS = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1]
  ];

  const homeScreen = document.getElementById('home-screen');
  const gameScreen = document.getElementById('game-screen');
  const boardEl = document.getElementById('board');
  const startBtn = document.getElementById('start-btn');
  const restartBtn = document.getElementById('restart-btn');
  const gameMessage = document.getElementById('game-message');
  const turnIndicator = document.querySelector('.turn-indicator');

  const state = {
    board: Array(TOTAL_CELLS).fill(null),
    currentPlayer: 'x',
    playerNames: ['Player 1', 'Player 2'],
    gameOver: false,
    winnerLine: []
  };

  function getPlayerName(player) {
    return state.playerNames[player === 'x' ? 0 : 1];
  }

  function getCellIndex(row, col) {
    return row * BOARD_SIZE + col;
  }

  function getCellValue(row, col) {
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
      return null;
    }
    return state.board[getCellIndex(row, col)];
  }

  function formatTurnText() {
    return `${getPlayerName(state.currentPlayer)}'s turn (${state.currentPlayer.toUpperCase()})`;
  }

  function setTurnIndicator() {
    turnIndicator.textContent = state.gameOver ? '' : formatTurnText();
  }

  function showMessage(text) {
    gameMessage.textContent = text;
    gameMessage.hidden = false;
  }

  function hideMessage() {
    gameMessage.hidden = true;
    gameMessage.textContent = '';
  }

  function countLine(row, col, dr, dc, mark) {
    let count = 0;
    let r = row;
    let c = col;

    while (getCellValue(r, c) === mark) {
      count += 1;
      r += dr;
      c += dc;
    }

    return count;
  }

  function findWinningLine() {
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const mark = getCellValue(row, col);
        if (!mark) continue;

        for (const [dr, dc] of DIRECTIONS) {
          const line = [];
          for (let step = 0; step < WIN_LENGTH; step += 1) {
            const next = getCellValue(row + dr * step, col + dc * step);
            if (next !== mark) {
              break;
            }
            line.push(getCellIndex(row + dr * step, col + dc * step));
          }
          if (line.length === WIN_LENGTH) {
            return { mark, line };
          }
        }
      }
    }
    return null;
  }

  function isBoardFull() {
    return state.board.every(cell => cell !== null);
  }

  function renderBoard() {
    boardEl.innerHTML = '';
    state.winnerLine = [];

    if (state.gameOver) {
      const result = findWinningLine();
      if (result) {
        state.winnerLine = result.line;
      }
    }

    for (let index = 0; index < TOTAL_CELLS; index += 1) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell';
      cell.dataset.index = index;
      const value = state.board[index];
      if (value) {
        cell.textContent = value.toUpperCase();
        cell.classList.add(value);
      }
      if (state.winnerLine.includes(index)) {
        cell.classList.add('winning');
      }
      if (!state.gameOver && !value) {
        cell.addEventListener('click', handleCellClick);
      }
      boardEl.appendChild(cell);
    }
  }

  function handleCellClick(event) {
    if (state.gameOver) return;

    const button = event.currentTarget;
    const index = parseInt(button.dataset.index, 10);
    if (state.board[index] !== null) return;

    state.board[index] = state.currentPlayer;
    const winResult = findWinningLine();
    if (winResult) {
      state.gameOver = true;
      setTurnIndicator();
      renderBoard();
      showMessage(`${getPlayerName(winResult.mark)} wins!`);
      return;
    }

    if (isBoardFull()) {
      state.gameOver = true;
      setTurnIndicator();
      renderBoard();
      showMessage("It's a draw!");
      return;
    }

    state.currentPlayer = state.currentPlayer === 'x' ? 'o' : 'x';
    setTurnIndicator();
    renderBoard();
  }

  function resetGame() {
    state.board = Array(TOTAL_CELLS).fill(null);
    state.currentPlayer = 'x';
    state.gameOver = false;
    state.winnerLine = [];
    hideMessage();
    setTurnIndicator();
    renderBoard();
  }

  function initGame() {
    const player1 = document.getElementById('player1-name').value.trim();
    const player2 = document.getElementById('player2-name').value.trim();

    state.playerNames[0] = player1 || 'Player 1';
    state.playerNames[1] = player2 || 'Player 2';
    state.currentPlayer = 'x';
    state.gameOver = false;
    state.winnerLine = [];
    state.board = Array(TOTAL_CELLS).fill(null);

    hideMessage();
    setTurnIndicator();
    renderBoard();

    homeScreen.classList.remove('active');
    gameScreen.classList.add('active');
  }

  startBtn.addEventListener('click', initGame);
  restartBtn.addEventListener('click', resetGame);
  setTurnIndicator();
  renderBoard();
})();
