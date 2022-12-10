import React, {useCallback, useState} from "react";

let foundArray = [];

let winningSets = [
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

function checkForWin() {
  foundArray = foundArray.toString()
  console.log(foundArray)
  winningSets.forEach(winningSet => {
    winningSet = winningSet.toString();
  //   if (foundArray.toString().includes(winningSet.toString()));
  //     console.log('you win! ', foundArray, winningSet);
  })
}

function Square(props) {
  const [found, setFound] = useToggle(false);
  return (
    <div 
      className={found === false ? "Square" : "Square-selected"}
      onClick={() => {
        setFound(!found);
        (found === false ? foundArray.push(props.itemKey) : foundArray.splice(props.itemKey, 1));
        if (foundArray.length > 4) {
          checkForWin()
        }
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
