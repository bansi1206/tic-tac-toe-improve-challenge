import { useState } from "react";
function Square({ value, onSquareClick, winning }) {
  const squareClass = "square " + (winning ? "square-winning" : "");
  return (
    <button className={squareClass} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    const col = 1 + (i % 3);
    const row = 1 + Math.floor(i / 3);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    nextSquares[9] = col;
    nextSquares[10] = row;

    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo[0] : null;
  const winningLine = winnerInfo ? winnerInfo[1] : [];
  let status;

  if (winner) {
    status = "Winner:" + winner;
  } else if (currentMove > 8) {
    status = "Draw";
  } else {
    status = "Next player:" + (xIsNext ? "X" : "O");
  }

  // const boardSquare = new Array(9).fill(null);
  const boardLength = 3;
  const boardRows = [...Array(boardLength).keys()].map((row) => {
    const boardSquares = [...Array(boardLength).keys()].map((col) => {
      const i = boardLength * row + col;
      return (
        <Square
          key={i}
          value={squares[i]}
          onSquareClick={() => handleClick(i)}
          winning={winningLine.includes(i)}
        />
      );
    });

    return (
      <div key={row} className="board-row">
        {boardSquares}
      </div>
    );
  });

  return (
    <>
      <div className="status">{status}</div>
      {/* <div className="board-row">
        {boardSquare.map((_, idx) => (
          <Square
            key={idx}
            value={squares[idx]}
            onSquareClick={() => handleClick(idx)}
          />
        ))}
      </div> */}
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(11).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [desc, setDesc] = useState(false);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];

    setHistory(nextHistory);

    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    const col = squares[9];
    const row = squares[10];
    if (move > 0) {
      description = `[${col},${row}]`;
      // description = history[move].description;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button
          onClick={() => jumpTo(move)}
          className={move === currentMove ? "current" : ""}
        >
          {description}
        </button>
      </li>
    );
  });

  const Descending = () => {
    setDesc(true);
  };

  const Ascending = () => {
    setDesc(false);
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          currentMove={currentMove}
        />
      </div>
      <div className="game-info">
        {!desc ? (
          <button onClick={Descending}>Descending</button>
        ) : (
          <button onClick={Ascending}>Ascending</button>
        )}
        <ol>{desc ? moves.reverse() : moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}
