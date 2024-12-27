import React, { useEffect, useState } from 'react';
import { 
  finalArray,
  christmasStyleMap,
  christmasWordArrays,
  roadTripStyleMap,
  roadTripWords
} from './BingoArray';
import Square from './Square';
import ToggleButton from './ToggleButton';
import './index.css';
import './App.css';

function checkForBackgroundStyle(item, selectedTheme) {
  const styleMap = selectedTheme === 'christmas' ? christmasStyleMap : roadTripStyleMap;
  const wordArrays = selectedTheme === 'christmas' ? christmasWordArrays : { roadTrip: roadTripWords };

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
     return word.charAt(0).toUpperCase() + word.slice(1);
   }).join(" ");
}

function App() {
    const [isToggled, setIsToggled] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState('christmas');

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

    const handleToggleChange = (newToggleState) => {
        setIsToggled(newToggleState);
    };

    const handleThemeChange = (event) => {
        setSelectedTheme(event.target.value);
    };

    return (
        <div className={`App ${isToggled ? "dark-mode" : ""}`}>
            <div className="App-header">(Christmas Bingo)</div>
            <div>
                <label htmlFor="theme-select">Choose a theme:</label>
                <select id="theme-select" value={selectedTheme} onChange={handleThemeChange}>
                    <option value="christmas">Christmas</option>
                    <option value="roadTrip">Road Trip</option>
                </select>
            </div>
            <div className="grid-5-by-5">
                {finalArray.map((item, index) => {
                  let passedClass = checkForBackgroundStyle(item, selectedTheme);
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
                    />
                  );
                })}
                <ToggleButton isToggled={isToggled} onToggle={handleToggleChange} />
            </div>
        </div>
    );
}

export default App;
