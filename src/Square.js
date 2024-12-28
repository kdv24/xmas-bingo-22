import React, {useCallback, useState} from "react";


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

function checkForWin(found, itemKey, theme, foundArray) {
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
      const appDiv = document.getElementsByClassName('App')[0];
      switch (theme) {
        case 'Christmas':
          appDiv.classList.add('snow');
          break;
        case 'Road Trip':
          appDiv.classList.add('national-park');
          break;
        case 'Traveling by Plane':
          appDiv.classList.add('clouds');
          break;
        default:
          break;
      }
    }
  })
}

function Square(props) {
  const [found, setFound] = useToggle(false);
  return (
    <div 
      id={`bingo-square-${props.item}`}
      className={found === false ? `Square ${props.className}` : `Square-selected ${props.className}`}
      onClick={() => {
        setFound(!found);
        checkForWin(!found, props.itemKey, props.theme, props.foundArray);
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
