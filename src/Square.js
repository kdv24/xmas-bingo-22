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

function checkForWin(found, itemKey) {
  console.log('found in checkForWin: ', found);
  if (found === true && !foundArray.includes(found)) {
    foundArray.push(itemKey);
    console.log(foundArray)
  }
  else if (found === false) {
    console.log('already there: ', itemKey, foundArray);
    let foundIndex = foundArray.indexOf(itemKey);
    console.log(foundIndex)
    foundArray.splice(foundIndex, 1);
    console.log('after splice: ', foundArray)
  }
  // const keyIndex = foundArray.length === 0 ? 0 : foundArray.findIndex(itemKey);

  winningSets.forEach(winningSet => {
    // console.log(foundArray.length);
    // console.log(winningSet.length)
    // console.log('found after: ', found);

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
