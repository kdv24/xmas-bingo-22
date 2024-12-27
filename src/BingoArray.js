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

const gasStationWords = [
  'Gas station',
  'Fuel pump',
  'Convenience store',
  'Restroom',
  'Air pump',
  'Car wash',
  'ATM',
  'Snack aisle',
  'Coffee station',
  'Lottery tickets',
];

const restAreaWords = [
  'Rest area',
  'Picnic table',
  'Restroom',
  'Vending machine',
  'Pet area',
  'Playground',
  'Information kiosk',
  'Scenic view',
  'Walking trail',
  'Parking lot',
];

const scenicOverlookWords = [
  'Scenic overlook',
  'Viewpoint',
  'Binoculars',
  'Photo spot',
  'Hiking trail',
  'Wildlife',
  'Historical marker',
  'Picnic area',
  'Parking area',
  'Sunset view',
];

const roadsideAttractionWords = [
  'Roadside attraction',
  'Giant statue',
  'Quirky museum',
  'Tourist trap',
  'Gift shop',
  'Photo op',
  'Historical site',
  'Local legend',
  'Unusual landmark',
  'Souvenir stand',
];

export const roadTripWordArrays = {
  gasStation: gasStationWords,
  restArea: restAreaWords,
  scenicOverlook: scenicOverlookWords,
  roadsideAttraction: roadsideAttractionWords
};

export const roadTripStyleMap = {
  'Free Space': 'free-space Square-selected',
  gasStation: 'gas-station',
  restArea: 'rest-area',
  scenicOverlook: 'scenic-overlook',
  roadsideAttraction: 'roadside-attraction'
};

const stageWords = [
  'Main stage',
  'Backup dancers',
  'Pyrotechnics',
  'LED screens',
  'Stage props',
  'Lighting effects',
];

const artistWords = [
  'Lead singer',
  'Backup singers',
  'Costume change',
  'Dance routine',
  'Special guest',
  'Vocal effects',
];

const songWords = [
  'Eurovision song',
  'Chorus',
  'Verse',
  'Bridge',
  'Key change',
  'High note',
];

const countryWords = [
  'Host country',
  'Participating country',
  'Flag',
  'National costume',
  'Traditional instrument',
  'Cultural reference',
];

export const eurovisionWordArrays = {
  stage: stageWords,
  artist: artistWords,
  song: songWords,
  country: countryWords
};

export const eurovisionStyleMap = {
  'Free Space': 'free-space Square-selected',
  stage: 'stage',
  artist: 'artist',
  song: 'song',
  country: 'country'
};

export function getWordsForTheme(theme) {
  const wordArrays = theme === 'Christmas' ? christmasWordArrays : theme === 'Road Trip' ? roadTripWordArrays : eurovisionWordArrays;
  const allWords = Object.values(wordArrays).flat();
  return allWords;
}

export function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

 return array;
}
