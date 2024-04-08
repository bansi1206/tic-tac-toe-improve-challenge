import React, { useState } from "react";
import "./styles.css";

// Tic Tac Toe component
function TicTacToe({ rows, cols, linesToWin }) {
  const [board, setBoard] = useState(Array(rows).fill(Array(cols).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [history, setHistory] = useState([]);

  const handleClick = (row, col) => {
    if (!board[row][col] && !winner) {
      const newBoard = board.map((rowArr, rowIndex) =>
        rowArr.map((cell, colIndex) =>
          rowIndex === row && colIndex === col ? currentPlayer : cell
        )
      );
      const newHistory = [...history, { row, col }];
      setBoard(newBoard);
      setHistory(newHistory);
      checkWinner(newBoard, row, col);
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const checkWinner = (board, row, col) => {
    const symbol = board[row][col];
    // Check horizontally
    for (let i = 0; i < cols - linesToWin + 1; i++) {
      let count = 0;
      for (let j = 0; j < linesToWin; j++) {
        if (board[row][i + j] === symbol) {
          count++;
        } else {
          count = 0;
          break;
        }
      }
      if (count === linesToWin) {
        setWinner(symbol);
        return;
      }
    }

    // Check vertically
    for (let i = 0; i < rows - linesToWin + 1; i++) {
      let count = 0;
      for (let j = 0; j < linesToWin; j++) {
        if (board[i + j][col] === symbol) {
          count++;
        } else {
          count = 0;
          break;
        }
      }
      if (count === linesToWin) {
        setWinner(symbol);
        return;
      }
    }

    // Check diagonally (top-left to bottom-right)
    for (let i = 0; i < rows - linesToWin + 1; i++) {
      for (let j = 0; j < cols - linesToWin + 1; j++) {
        let count = 0;
        for (let k = 0; k < linesToWin; k++) {
          if (board[i + k][j + k] === symbol) {
            count++;
          } else {
            count = 0;
            break;
          }
        }
        if (count === linesToWin) {
          setWinner(symbol);
          return;
        }
      }
    }

    // Check diagonally (bottom-left to top-right)
    for (let i = linesToWin - 1; i < rows; i++) {
      for (let j = 0; j < cols - linesToWin + 1; j++) {
        let count = 0;
        for (let k = 0; k < linesToWin; k++) {
          if (board[i - k][j + k] === symbol) {
            count++;
          } else {
            count = 0;
            break;
          }
        }
        if (count === linesToWin) {
          setWinner(symbol);
          return;
        }
      }
    }

    // Check for draw
    if (board.every((row) => row.every((cell) => cell !== null))) {
      setWinner("draw");
    }
  };

  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <div key={rowIndex} className="row">
        {row.map((cell, colIndex) => (
          <div
            key={colIndex}
            className={`cell ${winner && checkWinningCell(rowIndex, colIndex)}`}
            onClick={() => handleClick(rowIndex, colIndex)}
          >
            {cell}
          </div>
        ))}
      </div>
    ));
  };

  const checkWinningCell = (row, col) => {
    if (winner !== null) {
      const symbol = board[row][col];
      if (board[row][col] === winner) {
        for (let i = 0; i < linesToWin; i++) {
          // Check horizontally
          if (col + i < cols && board[row][col + i] === symbol) {
            return "winning-cell";
          }
          // Check vertically
          else if (row + i < rows && board[row + i][col] === symbol) {
            return "winning-cell";
          }
          // Check diagonally (top-left to bottom-right)
          else if (
            row + i < rows &&
            col + i < cols &&
            board[row + i][col + i] === symbol
          ) {
            return "winning-cell";
          }
          // Check diagonally (bottom-left to top-right)
          else if (
            row - i >= 0 &&
            col + i < cols &&
            board[row - i][col + i] === symbol
          ) {
            return "winning-cell";
          }
        }
      }
    }
    return "";
  };

  const jumpTo = (step) => {
    if (step === -1) {
      setBoard(Array(rows).fill(Array(cols).fill(null)));
      setHistory([]);
      setCurrentPlayer("X");
      setWinner(null);
      return;
    }
    const newHistory = history.slice(0, step + 1);
    setHistory(newHistory);
    const newBoard = Array(rows)
      .fill()
      .map(() => Array(cols).fill(null));
    newHistory.forEach(({ row, col }, index) => {
      newBoard[row][col] = index % 2 === 0 ? "X" : "O";
    });
    setBoard(newBoard);
    setCurrentPlayer(newHistory.length % 2 === 0 ? "X" : "O");
    setWinner(null);
  };

  return (
    <div className="tic-tac-toe">
      <h2>Tic Tac Toe</h2>
      <div className="board">{renderBoard()}</div>
      <div className="history">
        <h3>Move History:</h3>
        <ol>
          <li>
            <button onClick={() => jumpTo(-1)}>Reset</button>
          </li>
          {history.map((move, step) => (
            <li key={step}>
              <button
                onClick={() => jumpTo(step)}
              >{`(${move.row}, ${move.col})`}</button>
            </li>
          ))}
        </ol>
      </div>
      {winner && (
        <div className="winner">
          {winner === "draw" ? "It's a draw!" : `Winner: ${winner}`}
        </div>
      )}
    </div>
  );
}
// Form component for customizing the game
function GameForm({ onSubmit }) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [linesToWin, setLinesToWin] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (linesToWin > rows && linesToWin > cols) {
      alert("Lines to win must smaller or equal rows and columns");
    } else {
      onSubmit(rows, cols, linesToWin);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Rows:
        <input
          type="number"
          value={rows}
          onChange={(e) => setRows(parseInt(e.target.value))}
        />
      </label>
      <label>
        Columns:
        <input
          type="number"
          value={cols}
          onChange={(e) => setCols(parseInt(e.target.value))}
        />
      </label>
      <label>
        Lines to win:
        <input
          type="number"
          value={linesToWin}
          onChange={(e) => setLinesToWin(parseInt(e.target.value))}
        />
      </label>
      <button type="submit">Start Game</button>
    </form>
  );
}

// Main App component
function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [linesToWin, setLinesToWin] = useState(3);

  const startGame = (rows, cols, linesToWin) => {
    setGameStarted(true);
    setRows(rows);
    setCols(cols);
    setLinesToWin(linesToWin);
  };

  return (
    <div className="App">
      <h1>Custom Tic Tac Toe</h1>
      {gameStarted ? (
        <TicTacToe rows={rows} cols={cols} linesToWin={linesToWin} />
      ) : (
        <GameForm onSubmit={startGame} />
      )}
    </div>
  );
}

export default App;
