import React, {useCallback, useState, useEffect} from "react";

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
    let backgroundColor = localStorage.getItem('customThemeBackground');
    console.log('backgroundImage: ', backgroundColor);
    if (backgroundColor) {
      console.log('Setting confetti background color');
      appDiv.style.setProperty('background', `linear-gradient(${backgroundColor}, ${backgroundColor}, ${backgroundColor})`);
      createConfettiEffect(appDiv);
    } else {
      appDiv.style.setProperty('background', 'linear-gradient(purple, purple, purple)');
      createConfettiEffect(appDiv);
    }
  }
}

function createConfettiEffect(container) {
  const confettiContainer = document.createElement('div');
  confettiContainer.id = 'confetti-container';

  // Create multiple confetti elements
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
    confetti.style.animationDelay = `${Math.random() * 5}s`;
    confettiContainer.appendChild(confetti);
  }

  container.appendChild(confettiContainer);

  // Add CSS for confetti
  const style = document.createElement('style');
  style.textContent = `
    #confetti-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
    }
    .confetti {
      position: absolute;
      width: 10px;
      height: 10px;
      background-color: rgba(255, 255, 255, 0.5);
      animation: confetti-fall linear infinite;
    }
    @keyframes confetti-fall {
      0% {
        transform: translateY(-100vh) rotate(0deg);
      }
      100% {
        transform: translateY(100vh) rotate(360deg);
      }
    }
  `;
  document.head.appendChild(style);
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
      console.log('theme in checking for win: ', theme)
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

  useEffect(() => {
    // Clean up confetti when component unmounts
    return () => {
      const confettiContainer = document.getElementById('confetti-container');
      if (confettiContainer) {
        confettiContainer.remove();
      }
    };
  }, []);

  return (
    <div 
      id={`bingo-square-${props.item}`}
      className={(found === true || props.item === "Free Space") ? `Square-selected ${props.className}` : `Square ${props.className}` }
      onClick={() => {
        setFound(!found);
        checkForWin(!found, props.itemKey, props.theme, props.foundArray);
      }}
      style={{ backgroundPosition: 'center' }} // Ensure the background is centered
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
