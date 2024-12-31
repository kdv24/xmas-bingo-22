import React, { useState, useEffect } from 'react';
import { saveCustomTheme } from './BingoArray';

const ThemeCreator = ({ onSave }) => {
  const [themeName, setThemeName] = useState('');
  const [wordArrays, setWordArrays] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');

  const saveToGoogleSheet = async (themeData) => {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxb2QVElxoPiELzifG-Qt-pSNjN8pJPulJv6ADf19AZLZ2IZrs_6DR6MYhxmtUQ-AYU/exec';
    const formData = new FormData();
    formData.append('themeName', themeData.themeName);
    formData.append('wordArrays', themeData.wordArrays.join(', '));
    formData.append('backgroundColor', themeData.backgroundColor);

    try {
      const response = await fetch(scriptURL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteFromGoogleSheet = async (themeName) => {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxb2QVElxoPiELzifG-Qt-pSNjN8pJPulJv6ADf19AZLZ2IZrs_6DR6MYhxmtUQ-AYU/exec';
    const formData = new FormData();
    formData.append('themeName', themeName);

    try {
      const response = await fetch(scriptURL, {
        method: 'DELETE',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    const newTheme = {
      themeName,
      wordArrays: wordArrays.split(',').map(word => word.trim()),
      backgroundColor: backgroundColor
    };
    await saveCustomTheme(newTheme, backgroundColor);
    await onSave(newTheme);
    await saveToGoogleSheet(newTheme);
  };

  const deleteThemeFromLocalStorage = (themeName) => {
    const storedThemes = JSON.parse(localStorage.getItem('customThemes')) || [];
    const updatedThemes = storedThemes.filter(theme => theme.themeName !== themeName);
    localStorage.setItem('customThemes', JSON.stringify(updatedThemes));
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
      <h2 className="modal-title">Create a New Theme</h2>
      <div className="modal-section theme-name">
        <label>Theme Name:</label>
        <input
          type="text"
          value={themeName}
          onChange={(e) => setThemeName(e.target.value)}
        />
      </div>
      <div className="modal-section word-arrays">
        <label>Add bingo square words (comma separated)*:</label>
        <input
          type="text"
          value={wordArrays}
          onChange={(e) => setWordArrays(e.target.value)}
        />
      </div>
      <div className="modal-footnote">*These only last until you refresh your browser, so save them elsewhere if you want to use them again.</div>
      <div className="modal-section background-color">
      <label>Background color by name or&nbsp; <a href="https://htmlcolorcodes.com/">#hexcode</a>:</label>
      <input
          type="text"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
      </div>
      <button className="modal-button" onClick={handleSave}>Save Theme</button>
    </div>
  );
};

export default ThemeCreator;
