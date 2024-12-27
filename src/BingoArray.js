const lightsWords = [
  'Reindeer lights',
  'Snowman lights',
  'Wreath lights',
  'Palm tree lights',
  'Snowflake lights',
  'Path or railing lights',
  'Color-changing lights',
  'Spiral tree lights',
  'Window lights',
  'Icicle lights',
  'Twinkling lights',
  'Lights on a bare tree',
  'Bell lights',
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
  'Menorah or kinara',
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

const roadTripWords = [
  'Gas station',
  'Rest area',
  'Scenic view',
  'Road sign',
  'Toll booth',
  'Highway',
  'Exit sign',
  'Mile marker',
  'Overpass',
  'Underpass',
  'Billboard',
  'Rest stop',
  'Truck stop',
  'Welcome center',
  'Tourist attraction',
  'State line',
  'City limit',
  'Speed limit sign',
  'Construction zone',
  'Detour',
  'Traffic light',
  'Roundabout',
  'Pedestrian crossing',
  'Bicycle lane',
];

export const christmasWordArrays = {
  lights: lightsWords,
  blowUp: blowUpWords,
  house: houseWords,
  walmartPurchase: walmartPurchaseWords
};

export const christmasStyleMap = {
  'Free Space': 'free-space Square-selected',
  lights: 'lights',
  blowUp: 'blow-up',
  house: 'house-related',
  walmartPurchase: 'walmart'
};

export const roadTripStyleMap = {
  'Free Space': 'free-space Square-selected',
  gasStation: 'gas-station',
  restArea: 'rest-area',
  scenicView: 'scenic-view',
  roadSign: 'road-sign',
  tollBooth: 'toll-booth',
  highway: 'highway',
  exitSign: 'exit-sign',
  mileMarker: 'mile-marker',
  overpass: 'overpass',
  underpass: 'underpass',
  billboard: 'billboard',
  restStop: 'rest-stop',
  truckStop: 'truck-stop',
  welcomeCenter: 'welcome-center',
  touristAttraction: 'tourist-attraction',
  stateLine: 'state-line',
  cityLimit: 'city-limit',
  speedLimitSign: 'speed-limit-sign',
  constructionZone: 'construction-zone',
  detour: 'detour',
  trafficLight: 'traffic-light',
  roundabout: 'roundabout',
  pedestrianCrossing: 'pedestrian-crossing',
  bicycleLane: 'bicycle-lane',
};

export const bingoArrayLarge = `
   ${christmasWordArrays.blowUp}, ${christmasWordArrays.lights}, ${christmasWordArrays.house},
   ${christmasWordArrays.walmartPurchase}, ${misc}, ${roadTripWords}`
   .split(',').map(item => item.trim());

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

 return array;
}

const shuffledArray = shuffle(bingoArrayLarge);
export const finalArray = shuffledArray.slice(0, 24);
finalArray.splice(12, 0, "Free Space");

export { roadTripWords, roadTripStyleMap };
