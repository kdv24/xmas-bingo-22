import React, { useEffect, useState } from 'react';
import { 
  finalArray,
  christmasStyleMap,
  christmasWordArrays
} from './BingoArray';
import Square from './Square';
import ToggleButton from './ToggleButton';
import './index.css';
import './App.css';

function checkForBackgroundStyle(item) {
  if (item.includes('Free Space')) {
    return christmasStyleMap['Free Space'];
  }

  for (const [key, value] of Object.entries(christmasStyleMap)) {
    if (key === 'Free Space') continue; // Skip 'Free Space' as it's already checked
    if (christmasWordArrays[key] && christmasWordArrays[key].includes(item)) {
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

    return (
        <div className={`App ${isToggled ? "dark-mode" : ""}`}>
            <div className="App-header">(Christmas Bingo)</div>
            <div className="grid-5-by-5">
                {finalArray.map((item, index) => {
                  let passedClass = checkForBackgroundStyle(item);
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
