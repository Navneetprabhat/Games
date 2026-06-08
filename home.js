(function () {
  'use strict';

  const games = [
    {
      id: 'nested-tic-tac-toe',
      title: 'Nested Tic Tac Toe',
      description: '3×3 boards inside a 3×3 board. Win the small boards to claim the big one. Two players, optional timer.',
      tags: 'tic tac toe strategy board nested'
    },
    {
      id: 'five-by-five-tic-tac-toe',
      title: '5×5 Tic Tac Toe',
      description: 'Classic 5×5 board play. Win by connecting 4 in a row horizontally, vertically, or diagonally.',
      tags: 'tic tac toe 5x5 connect4 board'
    }
  ];

  const listEl = document.getElementById('game-list');
  const searchEl = document.getElementById('search');
  const noResultsEl = document.getElementById('no-results');

  function renderGames(filter) {
    const q = (filter || '').toLowerCase().trim();
    const filtered = q
      ? games.filter(function (g) {
          return g.title.toLowerCase().includes(q) ||
            g.description.toLowerCase().includes(q) ||
            (g.tags && g.tags.toLowerCase().includes(q));
        })
      : games;

    listEl.innerHTML = '';
    filtered.forEach(function (g) {
      const a = document.createElement('a');
      a.href = g.id + '/';
      a.className = 'game-card';
      a.setAttribute('data-game-id', g.id);
      a.innerHTML = '<h2>' + escapeHtml(g.title) + '</h2><p>' + escapeHtml(g.description) + '</p>';
      listEl.appendChild(a);
    });

    noResultsEl.hidden = filtered.length > 0;
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  searchEl.addEventListener('input', function () {
    renderGames(searchEl.value);
  });

  searchEl.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      searchEl.value = '';
      searchEl.focus();
      renderGames('');
    }
  });

  renderGames('');
})();
