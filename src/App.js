import React, { useEffect, useState } from 'react';
import { 
  christmasStyleMap,
  christmasWordArrays,
  roadTripWordArrays,
  roadTripStyleMap,
  planeTripWordArrays,
  planeTripStyleMap,
  getWordsForTheme,
  shuffle
} from './BingoArray';
import Square from './Square';
import ToggleButton from './ToggleButton';
import './index.css';
import './App.css';

function checkForBackgroundStyle(item, theme) {
  const styleMap = theme === 'Christmas' ? christmasStyleMap : theme === 'Road Trip' ? roadTripStyleMap : planeTripStyleMap;
  const wordArrays = theme === 'Christmas' ? christmasWordArrays : theme === 'Road Trip' ? roadTripWordArrays : planeTripWordArrays;

  if (item.includes('Free Space')) {
    return styleMap['Free Space'];
  }

  for (const [key, value] of Object.entries(styleMap)) {
    if (key === 'Free Space') continue; // Skip 'Free Space' as it's already checked
    if (wordArrays[key] && wordArrays[key].includes(item)) {
      return value;
    }
  }
  return 'misc';
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
          appDiv.classList.remove('road-trip', 'traveling-by-plane');
          appDiv.classList.add('christmas');
          break;
        case 'Road Trip':
          appDiv.classList.remove('christmas', 'traveling-by-plane');
          appDiv.classList.add('road-trip');
          break;
        case 'Traveling by Plane':
          appDiv.classList.remove('christmas', 'road-trip');
          appDiv.classList.add('traveling-by-plane');
          break;
        default:
          break;
      }
    });
    
    return (
        <div className={`App ${theme === 'Road Trip' ? "road-trip" : theme === 'Traveling by Plane' ? "traveling-by-plane" : "christmas"}`}>
            <div className="App-header">{theme} Bingo</div>
            <div className="theme-dropdown-container">
                <label>
                    Select Theme:
                    <select className="theme-dropdown" value={theme} onChange={handleThemeChange}>
                        <option value="Christmas">Christmas</option>
                        <option value="Road Trip">Road Trip</option>
                        <option value="Traveling by Plane">Traveling by Plane</option>
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
