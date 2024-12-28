import React, { useState, useEffect } from 'react';
import { saveCustomTheme, updateCustomTheme } from './BingoArray';

const ThemeCreator = ({ onSave }) => {
  const [themeName, setThemeName] = useState('');
  const [wordArrays, setWordArrays] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    const newTheme = {
      themeName,
      wordArrays: wordArrays.split(',').map(word => word.trim()),
      backgroundColor: backgroundColor
    };

    if (isUpdating) {
      await updateCustomTheme(themeName, wordArrays.split(',').map(word => word.trim()), backgroundColor);
    } else {
      await saveCustomTheme(newTheme, backgroundColor);
    }

    await onSave(newTheme);
  };

  useEffect(() => {
    const storedThemes = JSON.parse(localStorage.getItem('customThemes')) || [];
    const existingTheme = storedThemes.find(theme => theme.themeName === themeName);
    if (existingTheme) {
      setIsUpdating(true);
      setWordArrays(existingTheme.wordArrays.join(', '));
      setBackgroundColor(existingTheme.backgroundColor);
    } else {
      setIsUpdating(false);
    }
  }, [themeName]);

  return (
    <div>
      <h2>{isUpdating ? 'Update' : 'Create'} a Theme</h2>
      <div>
        <label>Theme Name:</label>
        <input
          type="text"
          value={themeName}
          onChange={(e) => setThemeName(e.target.value)}
        />
      </div>
      <div>
        <label>{isUpdating ? 'Update' : 'Add'} bingo square words (comma separated):</label>
        <input
          type="text"
          value={wordArrays}
          onChange={(e) => setWordArrays(e.target.value)}
        />
      </div>
      <div>
        <label>Choose a background color:</label>
        <input
          type="text"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
      </div>
      <button onClick={handleSave}>{isUpdating ? 'Update' : 'Save'} Theme</button>
    </div>
  );
};

export default ThemeCreator;
