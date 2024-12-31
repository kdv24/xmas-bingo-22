import React from 'react';
import Modal from 'react-modal';

const DeleteThemeModal = ({ isOpen, onRequestClose, customThemes, themeToDelete, setThemeToDelete, handleDeleteTheme }) => {
  return (
    <Modal
      appElement={document.getElementById('root')}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Delete a Theme"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="modal-content">
        <h2 className="modal-title">Delete a Theme</h2>
        <div className="modal-section">
          <label>Select Theme to Delete:</label>
          <select value={themeToDelete} onChange={(e) => setThemeToDelete(e.target.value)}>
            <option value="">Select a theme</option>
            {customThemes.map((customTheme, index) => (
              <option key={index} value={customTheme.themeName}>
                {customTheme.themeName}
              </option>
            ))}
          </select>
        </div>
        <button className="modal-button" onClick={handleDeleteTheme}>Delete Theme</button>
        <button className="modal-button" onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default DeleteThemeModal;
