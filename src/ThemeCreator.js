import React, { useState } from 'react';
import { saveCustomTheme } from './BingoArray';

const ThemeCreator = ({ onSave }) => {
  const [themeName, setThemeName] = useState('');
  const [wordArrays, setWordArrays] = useState('');
  const [colors, setColors] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');

  const handleSave = async () => {
    const newTheme = {
      themeName,
      wordArrays: wordArrays.split(',').map(word => word.trim()),
      colors: colors.split(',').map(color => color.trim()),
      backgroundImage
    };
    await saveCustomTheme(newTheme);
    await onSave(newTheme);
  };

  return (
    <div>
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
        <label>Word Arrays (comma separated):</label>
        <input
          type="text"
          value={wordArrays}
          onChange={(e) => setWordArrays(e.target.value)}
        />
      </div>
      <div>
        <label>Colors (comma separated):</label>
        <input
          type="text"
          value={colors}
          onChange={(e) => setColors(e.target.value)}
        />
      </div>
      <div>
        <label>Background Image URL:</label>
        <input
          type="text"
          value={backgroundImage}
          onChange={(e) => setBackgroundImage(e.target.value)}
        />
      </div>
      <button onClick={handleSave}>Save Theme</button>
    </div>
  );
};

export default ThemeCreator;
