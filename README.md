# Games Collection

A small collection of browser-based games built with HTML, CSS, and JavaScript.

## For Everyone

This project includes simple games that run in your browser. You can open the main menu in `index.html`, then choose a game to play.

Included games:

- **Nested Tic Tac Toe** — a 3×3 grid of 3×3 boards. Players take turns placing X or O in a small board, and winning a small board counts as a mark on the larger board. The first player to capture a row, column, or diagonal of small boards wins.
- **5×5 Tic Tac Toe** — a 5×5 board where the first player to connect **4 in a line** wins.

### How to Play

1. Open `index.html` from the project root.
2. Click the game you want to play.
3. Enter player names if you like.
4. Click **Start Game**.
5. Play until one player wins or the game ends in a draw.

## For Tech People

### Project structure

- `index.html` — main game launcher page.
- `home.js` — home page logic and game list rendering.
- `home.css` — styling for the launcher page.
- `nested-tic-tac-toe/` — existing nested tic tac toe game.
- `five-by-five-tic-tac-toe/` — newly added 5×5 tic tac toe game.

### Run locally

From the project root run one of these commands:

```powershell
Set-Location -LiteralPath 'd:\Games\Games'
python -m http.server 8000
```

Then open:

```
http://localhost:8000
```

### Notes

- The project is static and does not require a backend.
- Nested Tic Tac Toe is played on nine 3×3 boards inside a larger 3×3 layout; winning a smaller board counts toward the larger board victory.
- The 5×5 game uses a 5×5 grid and checks for 4 winning marks in a row horizontally, vertically, or diagonally.
- The home page is data-driven from `home.js` and can be extended with additional game entries.
