import Square from './Square';
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
]

const blowUpWords = [
  'Blow-up Santa',
  'Blow-up Snowman',
  'Blow-up Penguin',
  'Blow-up Polar bear',
  'Blow-up Dinosaur',
  'Blow-up Nativity',
]

const houseWords = [
  'Candy cane sidewalk',
  'Santa or Reindeer on roof',
  'Big star on house',
  'Projected something',
  'Decorated bush/hedge',
  'Rooftree',
  'Decor for other holiday',
  'Decorated columns',
  'Decorated archway',
  'Menorah',
  'Christmas tree', 
]

const walmartPurchaseWords = [
  'Train',
  'Snow globe',
  'Sleigh',
  'Elves',
  'Gingerbread man', 
  'Gift boxes',
]

const misc = [
  'Nativity',
  'Candle',
  'Angel', 
  'Big balls',
  'Nutcracker',
  'Seasonal person',
  'Peace sign',
  'Peppermints',
]

const bingoArrayLarge = `
   ${blowUpWords}, ${lightsWords}, ${houseWords}, ${walmartPurchaseWords}, ${misc}
`.split(',').map(item => item.trim());

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const styleMap = {
  'Free Space': 'free-space Square-selected',
  lights: 'lights',
  blowUp: 'blow-up',
  house: 'house-related',
  walmartPurchase: 'walmart-purchase'
};

// Assume these arrays are defined elsewhere in your code
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
  return str.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

const shuffledArray = shuffle(bingoArrayLarge);
const finalArray = shuffledArray.slice(0, 24);
finalArray.splice(12, 0, 'Free Space');

const bingoSquares = finalArray.map((item, index) => {
  const passedClass = checkForBackgroundStyle(item);
  const titleCaseItem = toTitleCase(item);
  return (
    <Square 
      className={passedClass}
      item={titleCaseItem}
      key={index}
      itemKey={index}
      data={item}
    />
  );
});

function App() {
  return (
    <div className='App'>
      <div className='App-header'>(Christmas Bingo)</div>
        <div className="grid-5-by-5">
          {bingoSquares}
        </div>
    </div>
  );
}

export default App;
