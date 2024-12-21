import React, { useEffect, useState } from 'react';
import Square from './Square';
import ToggleButton from './ToggleButton';
import './index.css';
import './App.css';

const lightsWords = [
  'Reindeer lights',
  'Snowman lights',
  'Wreath lights',
  'Palm tree lights',
  'Snowflakes lights',
  'Path or railing lights',
  'Color-changing lights',
  'Spiral tree lights',
  'Window lights',
  'Icicles lights',
  'Twinkling lights',
  'Lights on a bare tree',
  'Bells lights',
  'All red or blue lights',
];

const blowUpWords = [
  'Blow up Santa',
  'Blow up Snowman',
  'Blow up Penguin',
  'Blow up Polar bear',
  'Blow up Dinosaur',
  'Blow up Nativity',
];

const houseWords = [
  'Candy cane sidewalk',
  'Santa or Reindeer on roof',
  'Big star on house',
  'Projected something',
  'Decorated bush or hedge',
  'Rooftree',
  'Decor for other holiday',
  'Decorated columns',
  'Decorated archway',
  'Menorah',
  'Christmas tree', 
];

const walmartPurchaseWords = [
  'Train',
  'Snow globe',
  'Sleigh',
  'Elves',
  'Gingerbread man', 
  'Gift boxes',
  'Peppermints',
];

const misc = [
  'Nativity',
  'Candle',
  'Angel', 
  'Big balls',
  'Nutcracker',
  'Seasonal person',
  'Peace sign',
];

const bingoArrayLarge = `
   ${blowUpWords}, ${lightsWords}, ${houseWords}, ${walmartPurchaseWords}, ${misc}
`.split(',').map(item => item.trim());

function shuffle(array) {
   let currentIndex = array.length, randomIndex;

   while (currentIndex !== 0) {
     randomIndex = Math.floor(Math.random() * currentIndex);
     currentIndex--;
     [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
   }

  return array;
}

const styleMap = {
  'Free Space': 'free-space Square-selected',
  lights: 'lights',
  blowUp: 'blow-up',
  house: 'house-related',
  walmartPurchase: 'walmart'
};

const wordArrays = {
   lights: lightsWords,
   blowUp: blowUpWords,
   house: houseWords,
   walmartPurchase: walmartPurchaseWords
};

function checkForBackgroundStyle(item) {
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

const shuffledArray = shuffle(bingoArrayLarge);
const finalArray = shuffledArray.slice(0, 24);
finalArray.splice(12, 0, "Free Space");

function App() {
    const [isToggled, setIsToggled] = useState(false);
    // Dynamically update the Square-selected class when isToggled changes
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

      // Append the style element to the document head
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
                  // Add "is-toggled" to the class if isToggled is true
                  if (isToggled) {
                    passedClass += " is-toggled";
                }
                  return (
                    <Square
                    className={passedClass}
                    item={titleCaseItem}
                    key={index}
                    isToggled={isToggled} // Pass toggle state here
                    />
                  );
                })}
                <ToggleButton isToggled={isToggled} onToggle={handleToggleChange} />
            </div>
        </div>
    );
}

export default App;
