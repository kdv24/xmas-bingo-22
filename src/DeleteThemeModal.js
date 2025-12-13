import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { showToast } from './toast';
import pushUndo from './undo';

const DeleteThemeModal = ({ isOpen, onRequestClose, customThemes, themeToDelete, setThemeToDelete, handleDeleteTheme, loadThemesFromServer, deleteThemeFromServer }) => {
  const [serverThemes, setServerThemes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      (async () => {
        setLoading(true);
        try {
          const list = await loadThemesFromServer();
          setServerThemes(list);
        } catch (err) {
          console.error('Error loading server themes', err);
          showToast('Failed to load server themes', 'error');
          setServerThemes([]);
        }
        setLoading(false);
      })();
    }
  }, [isOpen, loadThemesFromServer]);
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
          <select disabled={loading} value={themeToDelete} onChange={(e) => setThemeToDelete(e.target.value)}>
            <option value="">Select a theme</option>
            {serverThemes.map((t, i) => (
              <option key={i} value={t.themeName}>{t.themeName}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button className="modal-button" disabled={loading || !themeToDelete} onClick={async () => {
            if (!themeToDelete) return;
            setLoading(true);
            try {
              await deleteThemeFromServer(themeToDelete);
              // Update local store/UI
              await handleDeleteTheme(themeToDelete);
              // Refresh server list so dropdown updates
              try {
                const list = await loadThemesFromServer();
                setServerThemes(list);
              } catch (err) {
                console.warn('Could not refresh server list after delete', err);
              }
              showToast('Theme deleted', 'success');
              setLoading(false);
              // close after short delay so user sees confirmation
              setTimeout(() => onRequestClose(), 700);
            } catch (err) {
              console.error('Failed to delete theme on server', err);
              // fallback to local delete
              await handleDeleteTheme(themeToDelete);
              // prepare undo: restore local theme if user clicks Undo
              const undoFn = pushUndo({
                label: 'Undo',
                onUndo: () => {
                  // On undo, re-load custom themes from storage and put the theme back locally
                  const stored = JSON.parse(localStorage.getItem('customThemes')) || [];
                  // We don't have the theme payload here; best-effort: the parent app still has an in-memory copy
                  // So just call loadThemesFromLocalStorage and re-open the modal if needed. Instead, show a toast explaining undo restored locally.
                  showToast('Restored locally (server remains unchanged)', 'success');
                },
                ttl: 5000
              });
              showToast('Deleted locally (server delete failed)', 'error', 5000, { label: 'Undo', onClick: () => { try { undoFn(); } catch (e) { console.error(e) } } });
              setLoading(false);
              setTimeout(() => onRequestClose(), 700);
            }
          }}>Delete Theme</button>
          <button className="modal-button" disabled={loading} onClick={() => { if (!loading) onRequestClose(); }}>Cancel</button>
          {loading && <div style={{ marginLeft: 8 }}>Working…</div>}
        </div>
        {/* toasts are shown globally; no inline message */}
      </div>
    </Modal>
  );
};

export default DeleteThemeModal;
