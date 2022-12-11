import React, {useCallback, useState} from "react";

let foundArray = [];

const winningSets = [
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 6, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20]
];

function checkForWin(found, itemKey) {
  if (found === true && !foundArray.includes(found)) {
    foundArray.push(itemKey);
  }
  else if (found === false) {
    let foundIndex = foundArray.indexOf(itemKey);
    foundArray.splice(foundIndex, 1);
  }

  winningSets.forEach((winningSet) => {
    let count = 0;
    winningSet.forEach((winningItem) => {
      if (foundArray.includes(winningItem)) {
        count += 1;
      }
    });
    if (count >= 5) {
      const appDiv = document.getElementsByClassName('App');
      appDiv[0].classList.add('snow');
    }
  })
}

function Square(props) {
  const [found, setFound] = useToggle(false);
  return (
    <div 
      className={found === false ? "Square" : "Square-selected"}
      onClick={() => {
        setFound(!found);
        checkForWin(!found, props.itemKey)
      }
    }
    >
      {props.item}
    </div>
  );
}

const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState(state => !state), []);
  return [state, toggle]
}

export default Square;
