(function () {
  'use strict';

  const WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  let state = {
    smallBoards: Array(9).fill(null).map(() => Array(9).fill(null)),
    bigBoard: Array(9).fill(null),
    currentPlayer: 1,
    nextBoard: null,
    playerNames: ['', ''],
    timerSeconds: [0, 0],
    timerIntervals: [null, null],
    gameOver: false,
    winner: null
  };

  const homeScreen = document.getElementById('home-screen');
  const gameScreen = document.getElementById('game-screen');
  const bigBoardEl = document.getElementById('big-board');
  const startBtn = document.getElementById('start-btn');
  const backBtn = document.getElementById('back-btn');
  const gameMessage = document.getElementById('game-message');

  function getTimerMinutes() {
    const customRadio = document.querySelector('input[name="timer"][value="custom"]');
    const customInput = document.getElementById('custom-minutes');
    if (customRadio && customRadio.checked && customInput) {
      const v = parseInt(customInput.value, 10);
      return Math.min(60, Math.max(1, isNaN(v) ? 5 : v));
    }
    const selected = document.querySelector('input[name="timer"]:checked');
    const val = selected ? selected.value : '5';
    return val === 'custom' ? Math.min(60, Math.max(1, parseInt(document.getElementById('custom-minutes').value, 10) || 5)) : parseInt(val, 10);
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function stopAllTimers() {
    state.timerIntervals.forEach(id => id != null && clearInterval(id));
    state.timerIntervals = [null, null];
  }

  function startTimerForPlayer(playerIndex) {
    const infoEl = document.querySelector(`.player-info[data-player="${playerIndex}"]`);
    if (!infoEl || state.gameOver) return;
    const display = infoEl.querySelector('.timer-display');
    state.timerIntervals[playerIndex - 1] = setInterval(() => {
      if (state.gameOver) return;
      state.timerSeconds[playerIndex - 1]--;
      display.textContent = formatTime(state.timerSeconds[playerIndex - 1]);
      infoEl.classList.toggle('low-time', state.timerSeconds[playerIndex - 1] <= 30 && state.timerSeconds[playerIndex - 1] > 0);
      if (state.timerSeconds[playerIndex - 1] <= 0) {
        stopAllTimers();
        state.gameOver = true;
        state.winner = playerIndex === 1 ? 2 : 1;
        showMessage(`${state.playerNames[state.winner - 1]} wins by time!`);
      }
    }, 1000);
  }

  function switchTurn() {
    stopAllTimers();
    state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
    startTimerForPlayer(state.currentPlayer);
    updateTurnIndicator();
    updatePlayerActiveClass();
  }

  function updateTurnIndicator() {
    const el = document.querySelector('.turn-indicator');
    if (el) el.textContent = `${state.playerNames[state.currentPlayer - 1]}'s turn`;
  }

  function updatePlayerActiveClass() {
    document.querySelectorAll('.player-info').forEach((el, i) => {
      el.classList.toggle('active', parseInt(el.dataset.player, 10) === state.currentPlayer);
    });
  }

  function checkSmallWin(board) {
    for (const line of WIN_LINES) {
      const a = board[line[0]], b = board[line[1]], c = board[line[2]];
      if (a && a === b && b === c) return a;
    }
    return null;
  }

  function isBoardFull(board) {
    return board.every(c => c !== null);
  }

  function checkBigWin() {
    const b = state.bigBoard;
    for (const line of WIN_LINES) {
      const a = b[line[0]], b2 = b[line[1]], c = b[line[2]];
      if (a && a === b2 && b2 === c) return a;
    }
    return null;
  }

  function isBigBoardFull() {
    return state.bigBoard.every(c => c !== null);
  }

  function getPlayableBoards() {
    if (state.nextBoard === null) return [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const b = state.nextBoard;
    if (state.bigBoard[b] !== null) {
      return state.bigBoard.map((_, i) => i).filter(i => state.bigBoard[i] === null);
    }
    return [b];
  }

  function renderBigBoard() {
    bigBoardEl.innerHTML = '';
    const playable = getPlayableBoards();

    for (let bi = 0; bi < 9; bi++) {
      const board = state.smallBoards[bi];
      const bigWinner = state.bigBoard[bi];
      const div = document.createElement('div');
      div.className = 'small-board';
      div.dataset.boardIndex = bi;
      if (bigWinner) {
        div.classList.add(bigWinner === 'x' ? 'won-x' : bigWinner === 'o' ? 'won-o' : 'won-draw');
        div.classList.add('disabled');
      } else if (!state.gameOver && playable.length > 0 && !playable.includes(bi)) {
        div.classList.add('disabled');
      } else if (!state.gameOver && playable.length > 0 && playable.includes(bi)) {
        div.classList.add('active');
      }

      for (let ci = 0; ci < 9; ci++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'cell';
        cell.dataset.boardIndex = bi;
        cell.dataset.cellIndex = ci;
        cell.setAttribute('aria-label', `Board ${bi + 1} cell ${ci + 1}`);
        const val = board[ci];
        if (val) {
          cell.textContent = val.toUpperCase();
          cell.classList.add(val, 'taken');
          if (bigWinner) cell.classList.add('big-mark');
        }
        if (bigWinner === 'x' || bigWinner === 'o') {
          const smallWin = checkSmallWin(board);
          if (smallWin) cell.classList.add('big-win');
        }
        div.appendChild(cell);
      }
      bigBoardEl.appendChild(div);
    }

    bigBoardEl.querySelectorAll('.cell:not(.taken)').forEach(btn => {
      btn.addEventListener('click', handleCellClick);
    });
  }

  function handleCellClick(e) {
    if (state.gameOver) return;
    const btn = e.target;
    if (btn.classList.contains('taken')) return;
    const bi = parseInt(btn.dataset.boardIndex, 10);
    const ci = parseInt(btn.dataset.cellIndex, 10);
    const playable = getPlayableBoards();
    if (!playable.includes(bi)) return;

    const mark = state.currentPlayer === 1 ? 'x' : 'o';
    state.smallBoards[bi][ci] = mark;

    const smallWinner = checkSmallWin(state.smallBoards[bi]);
    if (smallWinner) {
      state.bigBoard[bi] = smallWinner;
    } else if (isBoardFull(state.smallBoards[bi])) {
      state.bigBoard[bi] = 'draw';
    }

    const bigWinner = checkBigWin();
    if (bigWinner) {
      state.gameOver = true;
      stopAllTimers();
      state.winner = bigWinner === 'x' ? 1 : 2;
      showMessage(`${state.playerNames[state.winner - 1]} wins the game!`, 'win');
    } else if (isBigBoardFull()) {
      state.gameOver = true;
      stopAllTimers();
      showMessage("It's a draw!", 'draw');
    } else {
      state.nextBoard = ci;
      switchTurn();
    }

    renderBigBoard();
  }

  function showMessage(text, type = '') {
    gameMessage.textContent = text;
    gameMessage.className = 'game-message ' + type;
    gameMessage.hidden = false;
  }

  function hideMessage() {
    gameMessage.hidden = true;
    gameMessage.className = 'game-message';
  }

  function initGame() {
    const p1 = document.getElementById('player1-name').value.trim() || 'Player 1';
    const p2 = document.getElementById('player2-name').value.trim() || 'Player 2';
    const minutes = getTimerMinutes();

    state = {
      smallBoards: Array(9).fill(null).map(() => Array(9).fill(null)),
      bigBoard: Array(9).fill(null),
      currentPlayer: 1,
      nextBoard: null,
      playerNames: [p1, p2],
      timerSeconds: [minutes * 60, minutes * 60],
      timerIntervals: [null, null],
      gameOver: false,
      winner: null
    };

    document.querySelectorAll('.player-info').forEach((el, i) => {
      const idx = parseInt(el.dataset.player, 10);
      el.querySelector('.player-name').textContent = state.playerNames[idx - 1];
      el.querySelector('.timer-display').textContent = formatTime(state.timerSeconds[idx - 1]);
      el.classList.remove('low-time');
    });

    updateTurnIndicator();
    updatePlayerActiveClass();
    hideMessage();
    renderBigBoard();
    startTimerForPlayer(1);

    homeScreen.classList.remove('active');
    gameScreen.classList.add('active');
  }

  function goHome() {
    stopAllTimers();
    homeScreen.classList.add('active');
    gameScreen.classList.remove('active');
  }

  startBtn.addEventListener('click', initGame);
  backBtn.addEventListener('click', goHome);

  document.querySelectorAll('input[name="timer"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.getElementById('custom-minutes').disabled = document.querySelector('input[name="timer"]:checked').value !== 'custom';
    });
  });
  document.getElementById('custom-minutes').disabled = true;
})();
