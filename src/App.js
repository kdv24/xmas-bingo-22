import Lottie from 'lottie-web';

import Square from './Square';
import './index.css';
import './App.css';

const bingoArrayLarge = [
  'Blow-Up Nativity Scene', 'Nativity Scene (Not blow up)', 'Candy cane sidewalk lights', 'Blow-up santa', 'Train', 'Santa and reindeer on roof',
  'Reindeer lights', 'Snowman lights', 'Blow-up snowman', 'Noel', 'Christmas tree', 'Big star on house', 'Lit up wreath', 'Music from a house', 
  'Twinkling lights', 'Lights on a bare tree', 'Bell lights', 'Bells', 'Candle', 'Angel', 'Menorah', 'All blue or red lights on a house',
  'Lighted palm tree', 'Blow-Up Penguin', 'Blow-Up Polar bear', 'Snow globe', 'Snowflake lights', 'Sleigh', 'Projected something', 'Elves',
  'Decorated bush/hedge', 'Big balls', 'Nutcracker', 'Rooftree', 'Lit up path or railing', 'House with non-winter holiday decorations', 
  'Decorated columns', 'Decorated arches or arbors', 'Person dressed up for Winter holiday', 'Color-change lights', 'Gingerbread man', 
  'Spiral Light Tree', 'Gift boxes', 'Peace sign', 'Peppermints', 'Blowup dinosaur', 'Lights around a window', 'Icicle lights'
];

Lottie.loadAnimation({
  container: document.getElementById('christmas-wind-chimes'), // the dom element that will contain the animation
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: './christmas-wind-chimes.json' // the path to the animation json
});

Lottie.loadAnimation({
  container: document.getElementById('growing-tree-1'),
  renderer: 'svg',
  loop: false,
  autoplay: true,
  path: './growing-tree.json' // the path to the animation json
})

Lottie.loadAnimation({
  container: document.getElementById('growing-tree-2'),
  renderer: 'svg',
  loop: false,
  autoplay: true,
  path: './growing-tree.json' // the path to the animation json
})

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
    data={item}
  />
))

function App() {
  return (
    <div className='App'>
      <div className='App-header' style={{display: 'flex', flexDirection: 'row'}}>
        <div id='growing-tree-1' className='lottie growing-tree'></div>
          <span>(Christmas Bingo)</span>
        <div id='growing-tree-2' className='lottie growing-tree'></div>
      </div>
      <div className="grid-5-by-5">
        {bingoSquares}
      </div>
    </div>
  );
}

export default App;
