import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { 
  christmasStyleMap,
  christmasWordArrays,
  roadTripWordArrays,
  roadTripStyleMap,
  planeTripWordArrays,
  planeTripStyleMap,
  eurovisionWordArrays,
  eurovisionStyleMap,
  getWordsForTheme,
  shuffle
} from './BingoArray';
import Square from './Square';
import ToggleButton from './ToggleButton';
import ThemeCreator from './ThemeCreator';
import DeleteThemeModal from './DeleteThemeModal';
import './index.css';
import './App.css';

let appTheme = 'christmas';

function checkForBackgroundStyle(item, theme) {
  let styleMap;
  let wordArrays;
  switch (theme) {
    case 'Christmas':
      styleMap = christmasStyleMap;
      wordArrays = christmasWordArrays;
      break;
    case 'Road Trip':
      styleMap = roadTripStyleMap;
      wordArrays = roadTripWordArrays;
      break;
    case 'Plane Travel':
      styleMap = planeTripStyleMap;
      wordArrays = planeTripWordArrays;
      break;
    case 'Eurovision':
      styleMap = eurovisionStyleMap;
      wordArrays = eurovisionWordArrays;
      break;
    default:
      return '';
  }

  if (item.includes('Free Space')) {
    return styleMap['Free Space'];
  }

  for (const [key, value] of Object.entries(styleMap)) {
    if (key === 'Free Space') continue; // Skip 'Free Space' as it's already checked
    if (wordArrays[key] && wordArrays[key].includes(item)) {
      return value;
    }
  }
  return '';
}

function toTitleCase(str, theme) {
  if (['Christmas', 'Road Trip', 'Plane Travel', 'Eurovision'].includes(theme)) {
    return str.toLowerCase().split(" ").map(word => {
      if (word === "atm") {
        return word.toUpperCase();
      }
      else {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
    }).join(" ");
  }
  return str;
}

function App() {
    const [isToggled, setIsToggled] = useState(false);
    const [theme, setTheme] = useState('Christmas');
    const [finalArray, setFinalArray] = useState([]);
    const [foundArray, setFoundArray] = useState([12]);
    const [customThemes, setCustomThemes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [themeToDelete, setThemeToDelete] = useState('');

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

    useEffect(() => {
      const loadWords = async () => {
        const words = await getWordsForTheme(theme);
        const shuffledWords = shuffle(words);
        shuffledWords[12] = 'Free Space'; // Ensure "Free Space" is always in the center
        setFinalArray(shuffledWords.slice(0, 25));
      };
      loadWords();
    }, [theme]);

    const handleToggleChange = (newToggleState) => {
        setIsToggled(newToggleState);
    };

    const handleThemeChange = (event) => {
        const selectedTheme = event.target.value;
        if (selectedTheme === "Create a new theme") {
            setIsModalOpen(true);
        } else if (selectedTheme === "Delete a theme") {
            setIsDeleteModalOpen(true);
        } else {
            setTheme(selectedTheme);
            setFinalArray([]); // Reset the board when the theme changes
            setFoundArray([12]); // Reset the foundArray when the theme changes
            const appDiv = document.getElementsByClassName('App')[0];
            appDiv.style.removeProperty('background-image'); // Reset the background color when switching to a non-custom theme
        }
    };

    const handleSaveTheme = async (newTheme) => {
        const defaultColors = ['red', 'green', 'blue', 'yellow'];
        const defaultUrl = 'https://google.com';

        if (!newTheme.colors || newTheme.colors.length === 0) {
            newTheme.colors = defaultColors;
        }

        if (!newTheme.backgroundImage) {
            newTheme.backgroundImage = defaultUrl;
        }

        setCustomThemes([...customThemes, newTheme]);
        setIsModalOpen(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDeleteTheme = async () => {
        const updatedThemes = customThemes.filter(theme => theme.themeName !== themeToDelete);
        setCustomThemes(updatedThemes);
        // Add code to delete the theme from Google Sheets here
        setIsDeleteModalOpen(false);
        if (theme === themeToDelete) {
            setTheme('Christmas');
        }
    };

    useEffect(() => {
      const appDiv = document.getElementsByClassName('App')[0];
      switch (theme) {
        case 'Christmas':
          appDiv.classList.remove('road-trip', 'plane-travel', 'eurovision');
          appDiv.classList.add('christmas');
          appTheme = 'christmas';
          break;
        case 'Road Trip':
          appDiv.classList.remove('christmas', 'plane-travel', 'eurovision');
          appDiv.classList.add('road-trip');
          appTheme = 'road-trip';
          break;
        case 'Plane Travel':
          appDiv.classList.remove('christmas', 'road-trip', 'eurovision');
          appDiv.classList.add('plane-travel');
          appTheme = 'plane-travel';
          break;
        case 'Eurovision':
          appDiv.classList.remove('christmas', 'road-trip', 'plane-travel');
          appDiv.classList.add('eurovision');
          appTheme = 'eurovision';
          break;
        default:
          appDiv.classList.remove('christmas', 'road-trip', 'plane-travel', 'eurovision');
          appDiv.classList.add('custom-theme');
          appTheme = 'custom-theme';
          
          let customThemes = JSON.parse(localStorage.getItem('customThemes')) || [];
          let customTheme = customThemes.find(t => t.themeName === theme);
          let backgroundColor = customTheme ? customTheme.backgroundColor : null;
          
          // Check if backgroundColor is not null or undefined
          if (backgroundColor) {
            // Set the background image to a linear gradient of the background color.
            appDiv.style.setProperty('background-image', `linear-gradient(${backgroundColor}, ${backgroundColor}, ${backgroundColor})`);
          } else {
            // Setting a default color
            appDiv.style.setProperty('background-image', 'linear-gradient(purple, purple, purple)');
          }          
          break;
      }
    }, [theme]);

    useEffect(() => {
      const storedThemes = JSON.parse(localStorage.getItem('customThemes')) || [];
      setCustomThemes(storedThemes);
    }, []);

    useEffect(() => {
      localStorage.setItem('customThemes', JSON.stringify(customThemes));
    }, [customThemes]);
    
    return (
        <div className={`App ${appTheme}`}>
            <div className="App-header">{theme} Bingo</div>
            <div className="theme-dropdown-container">
                <label>
                    Select Theme:
                    <select value={theme} onChange={handleThemeChange}>
                        <option value="Christmas">Christmas</option>
                        <option value="Road Trip">Road Trip</option>
                        <option value="Plane Travel">Plane Travel</option>
                        <option value="Eurovision">Eurovision</option>
                        {customThemes.map((customTheme, index) => (
                            <option key={index} value={customTheme.themeName}>
                                {customTheme.themeName}
                            </option>
                        ))}
                        <option value="Create a new theme">Create a new theme</option>
                        <option value="Delete a theme">Delete a theme</option>
                    </select>
                </label>
            </div>
            <Modal
                appElement={document.getElementById('root')}
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Create a New Theme"
                className="modal"
                overlayClassName="overlay"
            >
                <ThemeCreator onSave={handleSaveTheme} />
                <button onClick={closeModal}>Cancel</button>
            </Modal>
            <DeleteThemeModal
                isOpen={isDeleteModalOpen}
                onRequestClose={closeDeleteModal}
                customThemes={customThemes}
                themeToDelete={themeToDelete}
                setThemeToDelete={setThemeToDelete}
                handleDeleteTheme={handleDeleteTheme}
            />
            <div className="grid-5-by-5">
                {finalArray.map((item, index) => {
                  let passedClass = checkForBackgroundStyle(item, theme);
                  const titleCaseItem = toTitleCase(item, theme);
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
                      theme={theme}
                      foundArray={foundArray}
                    />
                  );
                })}
                <ToggleButton isToggled={isToggled} onToggle={handleToggleChange} />
            </div>
        </div>
    );
}

export default App;
