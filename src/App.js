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
  'On a bare tree lights',
  'Bells lights',
  'All red or blue lights',
  'Palm tree lights',
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
  'Santa/Reindeer on roof',
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

const walmartPurchases = [
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
   ${blowUpWords}, ${lightsWords}, ${houseWords}, ${walmartPurchases}, ${misc}
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

function checkForBackgroundStyle(item) {
  let passedClass;

  if (item.includes('Free Space')) {
    return passedClass = 'free-space Square-selected';
  }
  if (lightsWords.includes(item)) {
    return passedClass = 'lights';
  }
  if (blowUpWords.includes(item)) {
    return passedClass = 'blow-up';
  }
  if (houseWords.includes(item)) {
    return passedClass = 'house-related';
  }
  if (walmartPurchases.includes(item)) {
    return passedClass = 'walmart';
  }
  else {
    passedClass = 'misc';
  }
  return passedClass;
}

const shuffledArray = shuffle(bingoArrayLarge);
const finalArray = shuffledArray.slice(0, 24);
finalArray.splice(12, 0, 'Free Space');

const bingoSquares = finalArray.map((item, index) => {
  const passedClass = checkForBackgroundStyle(item);
  return (
    <Square 
      className={passedClass}
      item={item}
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
