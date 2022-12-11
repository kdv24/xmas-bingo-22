import Square from './Square';
import './index.css';
import './App.css';

const bingoArrayLarge = [
  'Blow-Up Nativity Scene', 'Nativity Scene (Not blow up)', 'Candy cane sidewalk lights', 'Blow-up santa', 'Train', 'Santa and reindeer on roof',
  'Reindeer lights', 'Snowman lights', 'Blow-up snowman', 'Noel', 'Christmas tree', 'Big star on house', 'Lit up wreath', 'Music from a house', 
  'Twinkling lights', 'Lights on a bare tree', 'Bell lights', 'Bells', 'Candle', 'Angel', 'Minorah', 'All blue or red lights on a house',
  'Lighted palm tree', 'Blow-Up Penguin', 'Blow-Up Polar bear', 'Snow globe', 'Snowflake lights', 'Sleigh', 'Projected something', 'Elves',
  'Decorated bush/hedge', 'Big balls', 'Nutcracker', 'Rooftree', 'Lit up path or railing', 'House with non-winter holiday decorations', 
  'Decorated columns', 'Decorated arches or arbors', 'Person dressed up for Winter holiday', 'Color-change lights', 'Gingerbread man', 
  'Spiral Light Tree', 'Gift boxes', 'Peace sign', 'Peppermints', 'Blowup dinosaur', 'Lights around a window', 'Icicle lights'
];

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

const shuffledArray = shuffle(bingoArrayLarge);
const finalArray = shuffledArray.slice(0, 24);
finalArray.splice(12, 0, 'Free Space');


const bingoSquares = finalArray.map((item, index) => (
  <Square 
    item={item}
    key={index}
    itemKey={index}
  />
))

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
