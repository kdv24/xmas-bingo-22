import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { showToast } from './toast';
import ManageThemesModal from './ManageThemesModal';
import { editThemeOnServer } from './BingoArray';
import ThemeCreator from './ThemeCreator';

const DeleteThemeModal = ({
  isOpen,
  onRequestClose,
  customThemes,
  serverThemes: initialServerThemes = [],
  themeToDelete,
  setThemeToDelete,
  handleDeleteTheme,
  loadThemesFromServer,
  deleteThemeFromServer,
  restoreTheme,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [serverThemes, setServerThemes] = useState(initialServerThemes);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [manageOpen, setManageOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setServerThemes(initialServerThemes);
      // Only show spinner if both lists are empty
      setLoading((initialServerThemes.length === 0) && (customThemes.length === 0));
      (async () => {
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
  }, [isOpen, loadThemesFromServer, initialServerThemes, customThemes.length]);

  return (
    <Modal
      appElement={document.getElementById('root')}
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Manage Themes"
      className="modal"
      overlayClassName="overlay"
    >
      <div className="modal-content" style={{ maxWidth: 820, padding: 24, borderRadius: 14, background: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: '#222' }}>Manage Themes</h2>
          <button
            onClick={() => { if (!loading) onRequestClose(); }}
            style={{ border: 'none', background: 'transparent', fontSize: 22, cursor: 'pointer', color: '#888' }}
            aria-label="Close"
          >✕</button>
        </div>
        <div>
          <div style={{ borderRadius: 10, padding: 16, background: '#fff', minHeight: 320, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 15, color: '#222', fontWeight: 700 }}>
                All Themes ({(new Set([...serverThemes.map(s => s.themeName), ...customThemes.map(c => c.themeName)])).size})
              </div>
              <button
                className="modal-button"
                onClick={() => setIsCreateModalOpen(true)}
                style={{ background: '#10b981', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 7, fontWeight: 600 }}
              >+ New Theme</button>
            </div>
            {/* Create Theme Modal */}
            <Modal
              appElement={document.getElementById('root')}
              isOpen={isCreateModalOpen}
              onRequestClose={() => setIsCreateModalOpen(false)}
              contentLabel="Create a New Theme"
              className="modal"
              overlayClassName="overlay"
            >
              <ThemeCreator onSave={(newTheme) => { setIsCreateModalOpen(false); if (typeof restoreTheme === 'function') restoreTheme(newTheme); }} />
              <button onClick={() => setIsCreateModalOpen(false)} style={{ marginTop: 12 }}>Cancel</button>
            </Modal>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 10 }}>
              Select one or more themes to edit or delete. Click a theme name to edit.
            </div>
            <div style={{ maxHeight: 420, overflow: 'auto' }}>
              {(() => {
                const namesMap = new Map();
                serverThemes.forEach(s => namesMap.set(s.themeName, { source: 'server', item: s }));
                customThemes.forEach(c => namesMap.set(c.themeName, { source: 'local', item: c }));
                const all = Array.from(namesMap.values()).map(v => v.item);
                if (loading && all.length === 0) {
                  return (
                    <div style={{ color: '#888', fontSize: 15, textAlign: 'center', marginTop: 40 }}>
                      <span className="spinner" style={{ marginRight: 8, display: 'inline-block', width: 16, height: 16, border: '2px solid #ccc', borderTop: '2px solid #38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite', verticalAlign: 'middle' }}></span>
                      Loading themes...
                    </div>
                  );
                }
                if (all.length === 0) return <div style={{ color: '#666', textAlign: 'center', marginTop: 40 }}>No themes available.</div>;
                return all.map((t, i) => {
                  const checked = selected.includes(t.themeName);
                  return (
                    <label
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 8px',
                        borderRadius: 7,
                        background: checked ? '#e0f2fe' : 'transparent',
                        marginBottom: 7,
                        cursor: 'pointer',
                        border: checked ? '1px solid #38bdf8' : '1px solid transparent'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) setSelected(prev => [...prev, t.themeName]);
                          else setSelected(prev => prev.filter(n => n !== t.themeName));
                          setThemeToDelete(t.themeName);
                        }}
                        style={{ accentColor: '#38bdf8' }}
                      />
                      <div style={{ flex: 1 }} onClick={() => { setEditingTheme(t); setManageOpen(true); }}>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{t.themeName}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>
                          {Array.isArray(t.wordArrays)
                            ? t.wordArrays.length + ' words'
                            : (t.wordArrays && typeof t.wordArrays === 'object'
                              ? Object.keys(t.wordArrays).length + ' categories'
                              : '')}
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingTheme(t); setManageOpen(true); }}
                          style={{ background: 'transparent', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}
                        >Edit</button>
                      </div>
                    </label>
                  );
                });
              })()}
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
              <button
                disabled={loading || selected.length === 0}
                onClick={async () => {
                  if (!window.confirm(`Are you sure you want to delete the selected theme(s)? This cannot be undone.`)) return;
                  setLoading(true);
                  for (const name of selected.slice()) {
                    try {
                      await deleteThemeFromServer(name);
                      await handleDeleteTheme(name);
                      setSelected(prev => prev.filter(n => n !== name));
                    } catch (err) {
                      console.error('delete failed for', name, err);
                      await handleDeleteTheme(name);
                      showToast(`Deleted locally: ${name}`, 'error');
                    }
                  }
                  try { const list = await loadThemesFromServer(); setServerThemes(list); } catch (e) { console.warn(e); }
                  setLoading(false);
                  showToast('Theme(s) deleted', 'success');
                }}
                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, fontWeight: 600 }}
              >Delete selected ({selected.length})</button>
              <button
                onClick={() => { setSelected([]); setThemeToDelete(''); }}
                style={{ background: '#e6e6e6', border: 'none', padding: '10px 16px', borderRadius: 8, fontWeight: 600 }}
              >Clear selection</button>
            </div>
          </div>
          <div style={{ borderRadius: 10, padding: 16, background: '#f1f5f9', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 15, color: '#222', marginBottom: 10, fontWeight: 700 }}>
              {selected.length > 0 ? `Selected (${selected.length})` : 'No selection'}
            </div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 14 }}>
              {selected.length > 0 ? selected.join(', ') : 'Select themes to see details.'}
            </div>
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 13, color: '#b91c1c', fontWeight: 700 }}>Warning</div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>
                Deleting themes removes them locally and attempts to remove them from the shared sheet. This cannot be undone.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button
                className="modal-button"
                onClick={() => { setSelected([]); setThemeToDelete(''); }}
                style={{ background: '#e6e6e6', border: 'none', padding: '10px 16px', borderRadius: 8, fontWeight: 600 }}
              >Clear</button>
            </div>
          </div>
        </div>
        <ManageThemesModal
          isOpen={manageOpen}
          onRequestClose={() => { setManageOpen(false); setEditingTheme(null); }}
          customThemes={customThemes}
          editTheme={editingTheme}
          onSave={async (updated) => {
            // update local themes when editing
            const stored = JSON.parse(localStorage.getItem('customThemes')) || [];
            const next = stored.filter(t => t.themeName !== updated.themeName).concat(updated);
            localStorage.setItem('customThemes', JSON.stringify(next));
            // Save to server
            try {
              await editThemeOnServer(updated);
              showToast('Theme updated in Google Sheet', 'success');
            } catch (e) {
              showToast('Failed to update theme in Google Sheet', 'error');
            }
            // Refresh server themes
            try {
              const list = await loadThemesFromServer();
              setServerThemes(list);
            } catch (e) {}
            setManageOpen(false);
          }}
        />
      </div>
    </Modal>
  );
};

export default DeleteThemeModal;