import { useEffect, useState, useRef } from 'react';
import './App.css';

// todo make configurable
function App() {
  // const [icons, setIcon] = useState();
  const [gridLength, setGridLength] = useState(10);
  const [direction, setDirection] = useState(0);
  const [selectedIcons, setSelectedIcons] = useState(['⬆️']);
  const [iconIndex, setIconIndex] = useState(0);
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [grid, setGrid] = useState(
    Array.from({ length: gridLength }, () =>
      Array.from({ length: gridLength }, () => ''),
    ),
  );

  useEffect(() => {
    setLocation(row, col);
    setIconIndex(0);
  }, [selectedIcons]);

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
    newGrid[row] = [...newGrid[row]];
    newGrid[row][col] = selectedIcons[iconIndex];
    setGrid(newGrid);
  }

  function handleMoveForward() {
    setIconIndex((iconIndex + 1) % selectedIcons.length);
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
    <div>
      <h1>Configurable Robot Vacuum 😎</h1>
      <div>
        <IconSelector
          showCheckboxes={showCheckboxes}
          onSetShowCheckboxes={setShowCheckboxes}
          selectedIcons={selectedIcons}
          onSetSelectedIcons={setSelectedIcons}
        />
      </div>
      <button onClick={rotateRight} type="button">
        Rotate Roomba Right
      </button>
      <button onClick={() => handleMoveForward()} type="button">
        Move Forward
      </button>
      <select onChange={handleGridLengthChange} value={10}>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
      </select>
      <main className="container">
        <section
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
        </section>
      </main>
      <footer>Made with 🧡</footer>
    </div>
  );
}

export default App;

function IconSelector({
  selectedIcons,
  showCheckboxes,
  onSetSelectedIcons,
  onSetShowCheckboxes,
}) {
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const wrapperRef = useRef(null);
  const icons = ['⬆️', '☝️', '🔺', '⌃', '🙏'];

  function handleClickOutside(event) {
    // todo check event and current and stuff
    console.log('event.target', event.target);
    console.log(wrapperRef, wrapperRef.current);
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      onSetShowCheckboxes(false);
    }
  }

  function toggleIcon(icon) {
    if (selectedIcons.includes(icon)) {
      // remove icon
      onSetSelectedIcons(selectedIcons.filter((el) => el !== icon));
    } else {
      // add icon
      onSetSelectedIcons([...selectedIcons, icon]);
    }
  }

  return (
    <div className="icon-selector-container">
      <section className="selected-icons">
        {selectedIcons.map((selectedIcon) => (
          <button
            key={selectedIcon}
            type="button"
            onClick={() => toggleIcon(selectedIcon)}
            className="selected-icon btn-pill"
          >
            {selectedIcon}
            <span>x</span>
          </button>
        ))}
      </section>
      <input
        type="search"
        placeholder="search icons..."
        // onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => onSetShowCheckboxes(true)}
      />
      <section className="checkboxes" hidden={!showCheckboxes} ref={wrapperRef}>
        {icons.map((icon) => (
          <div key={icon}>
            <input
              checked={selectedIcons.includes(icon)}
              key={icon}
              id="icon"
              value={icon}
              type="checkbox"
              onChange={() => toggleIcon(icon)}
            />
            <label htmlFor="icon">{icon}</label>
          </div>
        ))}
      </section>
    </div>
  );
}
