import React, { useState, useEffect } from 'react';
import { saveCustomTheme } from './BingoArray';

const ThemeCreator = ({ onSave }) => {
  const [themeName, setThemeName] = useState('');
  const [wordArrays, setWordArrays] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');

  const handleSave = async () => {

    const newTheme = {
      themeName,
      wordArrays: wordArrays.split(',').map(word => word.trim()),
      backgroundColor: backgroundColor
    };
    await saveCustomTheme(newTheme, backgroundColor);
    await onSave(newTheme);
  };

  useEffect(() => {
    const storedThemes = JSON.parse(localStorage.getItem('customThemes')) || [];
    if (!storedThemes.some(theme => theme.themeName === themeName)) {
      const newTheme = {
        themeName,
        wordArrays: wordArrays.split(',').map(word => word.trim()),
        backgroundColor: backgroundColor
      };
      localStorage.setItem('customThemes', JSON.stringify([...storedThemes, newTheme]));
    }
  }, [themeName, wordArrays, backgroundColor]);

  return (
    <div className="modal-content">
      <h2>Create a New Theme</h2>
      <div>
        <label>Theme Name:</label>
        <input
          type="text"
          value={themeName}
          onChange={(e) => setThemeName(e.target.value)}
        />
      </div>
      <div>
        <label>Add bingo square words (comma separated):</label>
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
      <button onClick={handleSave}>Save Theme</button>
      <button onClick={() => onSave(null)}>Close</button>
    </div>
  );
};

export default ThemeCreator;
