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

const yardDecorations = [
  'Blow up Santa',
  'Blow up Snowman',
  'Blow up Penguin',
  'Blow up Polar bear',
  'Blow up Dinosaur',
  'Blow up Nativity',
  'Candy cane sidewalk',
  'Santa or Reindeer on roof',
  'Big star on house',
  'Projected something',
  'Decorated bush or hedge',
  'Rooftree',
  'Decorated columns',
  'Decorated archway',];

const holidaySymbols = [
  'Menorah or kinara',
  'Christmas tree',
  'Nativity',
  'Angel',
  'Nutcracker',
  'Seasonal person',
  'Peace sign',
  'Decor for other holiday',
];

const decorativeItems = [
  'Train',
  'Snow globe',
  'Sleigh',
  'Elves',
  'Gingerbread man',
  'Gift boxes',
  'Peppermints',
  'Candle',
  'Big balls',
];

export const christmasWordArrays = {
  lights: lightsWords,
  yardDecorations: yardDecorations,
  holidaySymbols: holidaySymbols,
  decorativeItems: decorativeItems
};

export const christmasStyleMap = {
  'Free Space': 'free-space',
  lights: 'lights',
  yardDecorations: 'yard-decorations',
  holidaySymbols: 'holiday-symbols',
  decorativeItems: 'decorative-items'
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
  'Free Space': 'free-space',
  gasStation: 'gas-station',
  restArea: 'rest-area',
  scenicOverlook: 'scenic-overlook',
  roadsideAttraction: 'roadside-attraction'
};

const airportWords = [
  'Check-in counter',
  'Security checkpoint',
  'Boarding gate',
  'Duty-free shop',
  'Baggage claim',
  'Airport lounge',
  'Runway',
  'Control tower',
  'Airport shuttle',
  'Lost and found',
];

const inFlightWords = [
  'In-flight meal',
  'Seatbelt sign',
  'Tray table',
  'Overhead bin',
  'Flight attendant',
  'In-flight entertainment',
  'Emergency exit',
  'Window seat',
  'Aisle seat',
  'Lavatory',
];

const destinationWords = [
  'Hotel lobby',
  'Tourist attraction',
  'Local cuisine',
  'Souvenir shop',
  'City skyline',
  'Beach',
  'Mountain',
  'Museum',
  'Park',
  'Historical site',
];

const travelItems = [
  'Passport',
  'Boarding pass',
  'Luggage',
  'Travel guide',
  'Map',
  'Currency exchange',
  'Travel insurance',
  'Travel adapter',
  'Travel pillow',
  'Travel app',
];

export const planeTripWordArrays = {
  airport: airportWords,
  inFlight: inFlightWords,
  destination: destinationWords,
  travelItems: travelItems
};

export const planeTripStyleMap = {
  'Free Space': 'free-space',
  airport: 'airport',
  inFlight: 'in-flight',
  destination: 'destination',
  travelItems: 'travel-items'
};

const stageWords = [
  'Main stage',
  'Backup dancers',
  'Pyrotechnics',
  'LED screens',
  'Stage props',
  'Lighting effects',
  'Movable LED cubes',
  'Cross-shaped stage',
  '360-degree stage',
  'Follow-spot systems',
  'Video installation',
  'Laser lighting',
];

const artistWords = [
  'Lead singer',
  'Backup singers',
  'Costume change',
  'Dance routine',
  'Special guest',
  'Vocal effects',
  'Solo performer',
  'Dramatic gestures',
  'Costume reveal',
  'Performance styling',
  'Stage persona',
  'Choreographed moment',
];

const songWords = [
  'Eurovision song',
  'Chorus',
  'Verse',
  'Bridge',
  'Key change',
  'High note',
  'Two-beat rhythm',
  '16-bar formula',
  'Upbeat tempo',
  'Catchy hook',
  'Instrumental solo',
  'Repeating lyrics',
];

const countryWords = [
  'Host country',
  'Participating country',
  'Flag',
  'National costume',
  'Traditional instrument',
  'Cultural reference',
  'National language song',
  'Ethnic music elements',
  'Cultural ambassador',
  'Regional musical style',
  'Traditional dress',
  'Folk music influence',
];

export const eurovisionWordArrays = {
  stage: stageWords,
  artist: artistWords,
  song: songWords,
  country: countryWords
};

export const eurovisionStyleMap = {
  'Free Space': 'free-space',
  stage: 'stage',
  artist: 'artist',
  song: 'song',
  country: 'country'
};

export async function getWordsForTheme(theme) {
  let wordArrays;
  switch (theme) {
    case 'Christmas':
      wordArrays = christmasWordArrays;
      break;
    case 'Road Trip':
      wordArrays = roadTripWordArrays;
      break;
    case 'Plane Travel':
      wordArrays = planeTripWordArrays;
      break;
    case 'Eurovision':
      wordArrays = eurovisionWordArrays;
      break;
    default:
      const customTheme = await loadCustomTheme(theme);
      if (customTheme) {
        wordArrays = customTheme.wordArrays;
      } else {
        wordArrays = [];
      }
      break;
  } 
  let allWords = [];
  if (Array.isArray(wordArrays)) {
    allWords = wordArrays;
  } else if (wordArrays && typeof wordArrays === 'object') {
    allWords = Object.values(wordArrays).flat();
  }
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

export async function saveCustomTheme(theme, backgroundColor) {
  let themes = JSON.parse(localStorage.getItem('customThemes')) || [];
  if (!Array.isArray(themes)) {
    themes = [];
  }
  themes.push(theme);
  localStorage.setItem('customThemes', JSON.stringify(themes));
  let customThemeBackgrounds = JSON.parse(localStorage.getItem('customThemeBackgrounds')) || {};
  customThemeBackgrounds[theme.themeName] = backgroundColor;
  localStorage.setItem('customThemeBackgrounds', JSON.stringify(customThemeBackgrounds));
}

export async function loadCustomTheme(themeName) {
  const themes = JSON.parse(localStorage.getItem('customThemes')) || [];
  return Array.isArray(themes) ? themes.find(theme => theme.themeName === themeName) : null;
}

export function loadThemesFromLocalStorage() {
  const themes = JSON.parse(localStorage.getItem('customThemes')) || [];
  return themes;
}

export function saveThemesToLocalStorage(themes) {
  localStorage.setItem('customThemes', JSON.stringify(themes));
}

// Server integration: list and delete themes via Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyf6NXXCszp8utjjWkR46kCtT6UrvIODuUKA-37bPrf1SKe3HjQJ4ps8i5XZI7Rxuh4/exec';
// If you set a DELETE_SECRET in the Apps Script, put the same value here.
// Leave empty to disable secret protection on client-side.
export const DELETE_SECRET = '';

export async function loadThemesFromServer() {
  const maxTries = 2;
  let lastErr;
  for (let attempt = 1; attempt <= maxTries; attempt++) {
    try {
      const res = await fetch(SCRIPT_URL + '?action=list');
      if (!res.ok) throw new Error(`Network response not ok (${res.status})`);
      const data = await res.json();
      return data.themes || [];
    } catch (err) {
      lastErr = err;
      console.warn(`loadThemesFromServer attempt ${attempt} failed:`, err);
      // small backoff
      await new Promise(r => setTimeout(r, 150 * attempt));
    }
  }
  console.error('Failed to load themes from server after retries', lastErr);
  throw lastErr;
}

export async function deleteThemeFromServer(themeName) {
  const maxTries = 2;
  let lastErr;
  for (let attempt = 1; attempt <= maxTries; attempt++) {
    try {
      const form = new FormData();
      form.append('action', 'delete');
      form.append('themeName', themeName);
      if (DELETE_SECRET) form.append('secret', DELETE_SECRET);
      const res = await fetch(SCRIPT_URL, { method: 'POST', body: form });
      if (!res.ok) throw new Error(`Network response not ok (${res.status})`);
      const data = await res.json();
      return data;
    } catch (err) {
      lastErr = err;
      console.warn(`deleteThemeFromServer attempt ${attempt} failed:`, err);
      await new Promise(r => setTimeout(r, 150 * attempt));
    }
  }
  console.error('Failed to delete theme from server after retries', lastErr);
  throw lastErr;
}
