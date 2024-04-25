import { useEffect, useState } from 'react';
import './App.css';

const ICON = '⬆️';
// todo make configurable
function App() {
  const [gridLength, setGridLength] = useState(10);
  const [direction, setDirection] = useState(0);
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [grid, setGrid] = useState(
    Array.from({ length: gridLength }, () =>
      Array.from({ length: gridLength }, () => ''),
    ),
  );

  useEffect(() => {
    setLocation(row, col);
    console.log(
      'FYI: useEffect double-invocation only happens in development mode, and not in production builds.',
    );

    return () => console.log('unmounting useEffect');
  }, []);

  useEffect(() => {
    setLocation(0, 0);
  }, [gridLength]);

  function rotateRight() {
    setDirection((dir) => (dir + 1) % 4);
  }

  function setLocation(row, col) {
    const newGrid = Array.from({ length: gridLength }, () =>
      Array.from({ length: gridLength }, () => ''),
    );
    setRow(row);
    setCol(col);
    newGrid[row][col] = ICON;
    setGrid(newGrid);
  }

  function handleMoveForward() {
    // 0-up, 1-right, 2-down, 3-left
    // 0,3 -up/down - row move
    let newRow = row;
    let newCol = col;

    if (direction === 0 && row - 1 > 0) {
      // up
      newRow = row - 1;
    } else if (direction === 1 && col + 1 <= gridLength - 1) {
      // right
      newCol = col + 1;
    } else if (direction === 2 && row + 1 <= gridLength - 1) {
      // down
      newRow = row + 1;
    } else if (direction === 3 && col - 1 >= 0) {
      // left
      newCol = col - 1;
    } else {
      rotateRight();
    }

    setLocation(newRow, newCol);
  }

  function handleGridLengthChange(e) {
    setGridLength(e.target.value);
  }

  function colorActiveBorder(rowIndex, colIndex) {
    if (row === rowIndex && col === colIndex) {
      return 'rgba(0, 88, 0, 0.2)';
    }
    return '';
  }

  return (
    <>
      <h1>Configurable Robot Vacuum 😎</h1>
      <button onClick={rotateRight} type="button">
        Rotate Roomba Right
      </button>
      <button onClick={() => handleMoveForward()} type="button">
        Move Forward
      </button>
      <select onChange={handleGridLengthChange}>
        <option value="5">5</option>
        <option value="10" selected>
          10
        </option>
        <option value="15">15</option>
      </select>
      <main
        className="Grid"
        style={{ gridTemplateRows: `repeat(${gridLength}, 1fr)` }}
      >
        {grid.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="Row"
            style={{ gridTemplateColumns: `repeat(${gridLength}, 1fr)` }}
          >
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="Cell"
                style={{
                  backgroundColor: colorActiveBorder(rowIndex, colIndex),
                }}
              >
                <div
                  style={{
                    transform: `rotate(${direction * 90}deg)`,
                  }}
                >
                  {cell}
                </div>
              </div>
            ))}
          </div>
        ))}
      </main>
      <footer>Made with 🧡</footer>
    </>
  );
}

export default App;
