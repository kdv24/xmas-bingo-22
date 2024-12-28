import React, { useEffect, useState } from 'react';
import { 
  christmasStyleMap,
  christmasWordArrays,
  roadTripWordArrays,
  roadTripStyleMap,
  planeTripWordArrays,
  planeTripStyleMap,
  eurovisionWordArrays,
  eurovisionStyleMap,
  getWordsForTheme,
  shuffle
} from './BingoArray';
import Square from './Square';
import ToggleButton from './ToggleButton';
import './index.css';
import './App.css';

let appTheme = 'christmas';

function checkForBackgroundStyle(item, theme) {
  let styleMap;
  let wordArrays;
  switch (theme) {
    case 'Christmas':
      styleMap = christmasStyleMap;
      wordArrays = christmasWordArrays;
      break;
    case 'Road Trip':
      styleMap = roadTripStyleMap;
      wordArrays = roadTripWordArrays;
      break;
    case 'Traveling by Plane':
      styleMap = planeTripStyleMap;
      wordArrays = planeTripWordArrays;
      break;
    case 'Eurovision':
      styleMap = eurovisionStyleMap;
      wordArrays = eurovisionWordArrays;
      break;
    default:
      break;
  }

  if (item.includes('Free Space')) {
    return styleMap['Free Space'];
  }

  for (const [key, value] of Object.entries(styleMap)) {
    if (key === 'Free Space') continue; // Skip 'Free Space' as it's already checked
    if (wordArrays[key] && wordArrays[key].includes(item)) {
      return value;
    }
  }
  return '';
}

function toTitleCase(str) {
   return str.toLowerCase().split(" ").map(word => {
    if (word === "atm") {
      return word.toUpperCase();
    }
    else {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
   }).join(" ");
}

function App() {
    const [isToggled, setIsToggled] = useState(false);
    const [theme, setTheme] = useState('Christmas');
    const [finalArray, setFinalArray] = useState([]);
    const [foundArray, setFoundArray] = useState([12]);

    // Update the Square-selected class when isToggled changes
    useEffect(() => {
      const styleElement = document.createElement('style');
      styleElement.id = "dynamic-style";

      if (isToggled) {
          styleElement.innerHTML = `
              .Square-selected {
                  color: white !important;
              }
          `;
      } else {
          styleElement.innerHTML = `
              .Square-selected {
                  color: #146B38 !important;
              }
          `;
      }
      document.head.appendChild(styleElement);

      // Cleanup function to remove the style element when toggled off
      return () => {
          const existingStyleElement = document.getElementById('dynamic-style');
          if (existingStyleElement) {
              existingStyleElement.remove();
          }
      };
    }, [isToggled]);

    useEffect(() => {
      const words = getWordsForTheme(theme);
      const shuffledWords = shuffle(words);
      shuffledWords[12] = 'Free Space'; // Ensure "Free Space" is always in the center
      setFinalArray(shuffledWords.slice(0, 25));
    }, [theme]);

    const handleToggleChange = (newToggleState) => {
        setIsToggled(newToggleState);
    };

    const handleThemeChange = (event) => {
        setTheme(event.target.value);
        setFinalArray([]); // Reset the board when the theme changes
        setFoundArray([12]); // Reset the foundArray when the theme changes
    };

    useEffect(() => {
      const appDiv = document.getElementsByClassName('App')[0];
      switch (theme) {
        case 'Christmas':
          appDiv.classList.remove('road-trip', 'traveling-by-plane', 'eurovision');
          appDiv.classList.add('christmas');
          appTheme = 'christmas';
          break;
        case 'Road Trip':
          appDiv.classList.remove('christmas', 'traveling-by-plane', 'eurovision');
          appDiv.classList.add('road-trip');
          appTheme = 'road-trip';
          break;
        case 'Traveling by Plane':
          appDiv.classList.remove('christmas', 'road-trip', 'eurovision');
          appDiv.classList.add('traveling-by-plane');
          appTheme = 'traveling-by-plane';
          break;
        case 'Eurovision':
          appDiv.classList.remove('christmas', 'road-trip', 'traveling-by-plane');
          appDiv.classList.add('eurovision');
          appTheme = 'eurovision';
          break;
        default:
          break;
      }
    });
    
    return (
        <div className={`App ${appTheme}`}>
            <div className="App-header">{theme} Bingo</div>
            <div className="theme-dropdown-container">
                <label>
                    Select Theme:
                    <select className="theme-dropdown" value={theme} onChange={handleThemeChange}>
                        <option value="Christmas">Christmas</option>
                        <option value="Road Trip">Road Trip</option>
                        <option value="Traveling by Plane">Traveling by Plane</option>
                        <option value="Eurovision">Eurovision</option>
                    </select>
                </label>
            </div>
            <div className="grid-5-by-5">
                {finalArray.map((item, index) => {
                  let passedClass = checkForBackgroundStyle(item, theme);
                  const titleCaseItem = toTitleCase(item);
                  if (isToggled) {
                    passedClass += " is-toggled";
                }
                  return (
                    <Square
                      className={passedClass}
                      item={titleCaseItem}
                      key={index}
                      itemKey={index}
                      isToggled={isToggled}
                      theme={theme}
                      foundArray={foundArray}
                    />
                  );
                })}
                <ToggleButton isToggled={isToggled} onToggle={handleToggleChange} />
            </div>
        </div>
    );
}

export default App;
