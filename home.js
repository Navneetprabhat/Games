(function () {
  'use strict';

  const games = [
    {
      id: 'nested-tic-tac-toe',
      title: 'Nested Tic Tac Toe',
      description: '3×3 boards inside a 3×3 board. Win the small boards to claim the big one. Two players, optional timer.',
      tags: 'tic tac toe strategy board nested',
      icon: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="10" y="10" width="44" height="44" rx="8" stroke="currentColor" stroke-width="4"/><path d="M10 24h44M10 40h44M24 10v44M40 10v44" stroke="currentColor" stroke-width="4"/><rect x="18" y="18" width="10" height="10" rx="3" fill="currentColor"/><rect x="36" y="36" width="10" height="10" rx="3" fill="currentColor"/></svg>'
    },
    {
      id: 'five-by-five-tic-tac-toe',
      title: '5×5 Tic Tac Toe',
      description: 'Classic 5×5 board play. Win by connecting 4 in a row horizontally, vertically, or diagonally.',
      tags: 'tic tac toe 5x5 connect4 board',
      icon: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="10" y="10" width="44" height="44" rx="8" stroke="currentColor" stroke-width="4"/><path d="M10 20h44M10 30h44M10 40h44M10 50h44M20 10v44M30 10v44M40 10v44M50 10v44" stroke="currentColor" stroke-width="3"/><path d="M14 38h36" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><path d="M34 18v28" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>'
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
      a.setAttribute('data-description', g.description);
      a.setAttribute('aria-describedby', g.id + '-desc');
      a.innerHTML =
        '<span class="game-icon">' + g.icon + '</span>' +
        '<div class="game-card-body">' +
        '<h2>' + escapeHtml(g.title) + '</h2>' +
        '<span class="sr-only" id="' + g.id + '-desc">' + escapeHtml(g.description) + '</span>' +
        '</div>';
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
