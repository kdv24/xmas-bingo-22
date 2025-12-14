import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { showToast } from './toast';
import ManageThemesModal from './ManageThemesModal';
import ThemeCreator from './ThemeCreator';

const DeleteThemeModal = ({ isOpen, onRequestClose, customThemes, themeToDelete, setThemeToDelete, handleDeleteTheme, loadThemesFromServer, deleteThemeFromServer, restoreTheme }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [serverThemes, setServerThemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [manageOpen, setManageOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState(null);

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
      <div className="modal-content" style={{ maxWidth: 760, padding: 20, borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Delete a Theme</h3>
          <button onClick={() => { if (!loading) onRequestClose(); }} style={{ border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer' }} aria-label="Close">✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
          <div style={{ borderRadius: 8, padding: 12, background: '#fbfbfb', minHeight: 300 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 13, color: '#333', fontWeight: 700 }}>Themes ({(new Set([...serverThemes.map(s => s.themeName), ...customThemes.map(c => c.themeName)])).size})</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="modal-button" onClick={() => { setManageOpen(true); }} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Manage themes</button>
                <button className="modal-button" onClick={() => setIsCreateModalOpen(true)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Create new theme</button>
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
        <button onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
      </Modal>
                <button className="modal-button" onClick={() => { setSelected([]); setThemeToDelete(''); }} style={{ background: '#e6e6e6', border: 'none', padding: '6px 10px', borderRadius: 6 }}>Clear</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: '#666' }}>Select themes to delete (checkboxes)</div>
            </div>

            <div style={{ maxHeight: 420, overflow: 'auto' }}>
              {(() => {
                const namesMap = new Map();
                serverThemes.forEach(s => namesMap.set(s.themeName, { source: 'server', item: s }));
                customThemes.forEach(c => namesMap.set(c.themeName, { source: 'local', item: c }));
                const all = Array.from(namesMap.values()).map(v => v.item);
                if (all.length === 0) return <div style={{ color: '#666' }}>No themes available.</div>;
                return all.map((t, i) => {
                  const checked = selected.includes(t.themeName);
                  return (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: 6, background: checked ? '#fff1f0' : 'transparent', marginBottom: 6 }}>
                      <input type="checkbox" checked={checked} onChange={(e) => {
                        if (e.target.checked) setSelected(prev => [...prev, t.themeName]); else setSelected(prev => prev.filter(n => n !== t.themeName));
                        setThemeToDelete(t.themeName);
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{t.themeName}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{t.wordArrays ? Object.keys(t.wordArrays).length + ' categories' : ''}</div>
                      </div>
                      <div>
                        <button onClick={() => { setEditingTheme(t); setManageOpen(true); }} style={{ background: 'transparent', border: 'none', color: '#2563eb', cursor: 'pointer' }}>Edit</button>
                      </div>
                    </label>
                  );
                });
              })()}
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button disabled={loading || selected.length === 0} onClick={async () => {
                // delete each selected theme sequentially
                setLoading(true);
                for (const name of selected.slice()) {
                  try {
                    await deleteThemeFromServer(name);
                    await handleDeleteTheme(name);
                    // remove from selected set
                    setSelected(prev => prev.filter(n => n !== name));
                  } catch (err) {
                    console.error('delete failed for', name, err);
                    // fallback local delete
                    await handleDeleteTheme(name);
                    showToast(`Deleted locally: ${name}`, 'error');
                  }
                }
                try { const list = await loadThemesFromServer(); setServerThemes(list); } catch (e) { console.warn(e); }
                setLoading(false);
              }} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8 }}>Delete selected ({selected.length})</button>
              <button onClick={() => { setSelected([]); setThemeToDelete(''); }} style={{ background: '#e6e6e6', border: 'none', padding: '8px 12px', borderRadius: 8 }}>Clear selection</button>
            </div>
          </div>

          <div style={{ borderRadius: 8, padding: 12, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 13, color: '#333', marginBottom: 8, fontWeight: 700 }}>{selected.length > 0 ? `Selected (${selected.length})` : 'No selection'}</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>{selected.length > 0 ? selected.join(', ') : 'Select themes to see details.'}</div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 12, color: '#b91c1c', fontWeight: 700 }}>Warning</div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>Deleting themes removes them locally and attempts to remove them from the shared sheet. The modal will remain open so you can delete multiple themes.</div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button className="modal-button" onClick={() => { setSelected([]); setThemeToDelete(''); }} style={{ background: '#e6e6e6', border: 'none', padding: '10px 12px', borderRadius: 8 }}>Clear</button>
              <button className="modal-button" onClick={() => { setManageOpen(true); }} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 12px', borderRadius: 8 }}>Manage themes</button>
            </div>
          </div>
        </div>
        <ManageThemesModal isOpen={manageOpen} onRequestClose={() => { setManageOpen(false); setEditingTheme(null); }} customThemes={customThemes} editTheme={editingTheme} onSave={(updated) => {
          // update local themes when editing
          const stored = JSON.parse(localStorage.getItem('customThemes')) || [];
          const next = stored.filter(t => t.themeName !== updated.themeName).concat(updated);
          localStorage.setItem('customThemes', JSON.stringify(next));
          // notify parent by refreshing window storage via reload or callback; simpler: show toast
          showToast('Theme saved locally', 'success');
          setManageOpen(false);
        }} />
      </div>
    </Modal>
  );
};

export default DeleteThemeModal;
