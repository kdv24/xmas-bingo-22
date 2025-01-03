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

function setConfettiBackground(theme) {
  const appDiv = document.getElementsByClassName('App')[0];
  if (theme !== 'Christmas' && theme !== 'Road Trip' && theme !== 'Plane Travel' && theme !== 'Eurovision') {
    let customThemes = JSON.parse(localStorage.getItem('customThemes')) || [];
    let customTheme = customThemes.find(t => t.themeName === theme);
    let backgroundColor = customTheme ? customTheme.backgroundColor : null;
    if (backgroundColor) {
      appDiv.style.setProperty('background-image', `url('./blue-pink-confetti.png'), linear-gradient(${backgroundColor}, ${backgroundColor}, ${backgroundColor})`);
    } else {
      appDiv.style.setProperty('background-image', `url('https://www.transparenttextures.com/patterns/confetti.png'), linear-gradient(purple, purple, purple)`);
    }
  }
}

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
      if (theme !== 'Christmas' && theme !== 'Road Trip' && theme !== 'Plane Travel' && theme !== 'Eurovision') {
        appDiv.classList.add('confetti');
        setConfettiBackground(theme);
      }
      switch (theme) {
        case 'Christmas':
          appDiv.classList.add('snow');
          break;
        case 'Road Trip':
          appDiv.classList.add('national-park');
          break;
        case 'Plane Travel':
          appDiv.classList.add('clouds');
          break;
        case 'Eurovision':
          appDiv.classList.add('eurovision-background');
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
      className={(found === true || props.item === "Free Space") ? `Square-selected ${props.className}` : `Square ${props.className}` }
      onClick={() => {
        setFound(!found);
        checkForWin(!found, props.itemKey, props.theme, props.foundArray);
      }}
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
