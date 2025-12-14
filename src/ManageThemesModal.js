import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { addThemeToServer, updateThemeOnServer, deleteThemeFromServer, loadThemesFromServer } from './BingoArray';
import { showToast } from './toast';
// Minimal manage modal: edits a theme object shape { themeName, backgroundColor, wordarrays }
export default function ManageThemesModal({ isOpen, onRequestClose, customThemes = [], editTheme = null, onSave }) {
  const [serverThemes, setServerThemes] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [themeObj, setThemeObj] = useState({ themeName: '', backgroundColor: '', wordArrays: {} });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true);
      try {
        const list = await loadThemesFromServer();
        setServerThemes(list || []);
      } catch (err) {
        console.warn('Could not load server themes', err);
        setServerThemes([]);
      }
      setLoading(false);
    })();
  }, [isOpen]);

  useEffect(() => {
    // When selection changes, populate editor
    if (!selectedName) {
      setThemeObj({ themeName: '', backgroundColor: '', wordArrays: {} });
      return;
    }
    const serverMatch = serverThemes.find(t => t.themeName === selectedName);
    const localMatch = (customThemes || []).find(t => t.themeName === selectedName);
    const chosen = serverMatch || localMatch || { themeName: selectedName, backgroundColor: '', wordArrays: {} };
    setThemeObj(chosen);
  }, [selectedName, serverThemes, customThemes]);

  const allNames = Array.from(new Set([...(serverThemes || []).map(s => s.themeName), ...(customThemes || []).map(c => c.themeName)])).sort();

  return (
    <Modal appElement={document.getElementById('root')} isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Manage Themes" className="modal" overlayClassName="overlay">
      <div style={{ padding: 16, maxWidth: 880 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Manage Themes</h3>
          <button onClick={onRequestClose} style={{ border: 'none', background: 'transparent', fontSize: 18 }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, marginTop: 12 }}>
          <div style={{ borderRadius: 8, padding: 12, background: '#fbfbfb', minHeight: 360 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontWeight: 700 }}>All themes ({allNames.length})</div>
              <div><button onClick={() => { setSelectedName(''); setThemeObj({ themeName: '', backgroundColor: '', wordArrays: {} }); }} style={{ border: 'none', background: '#10b981', color: '#fff', padding: '6px 8px', borderRadius: 6 }}>Create</button></div>
            </div>
            <div style={{ maxHeight: 420, overflow: 'auto' }}>
              {allNames.length === 0 && <div style={{ color: '#666' }}>No themes yet.</div>}
              {allNames.map((name, i) => (
                <div key={i} onClick={() => setSelectedName(name)} style={{ padding: 8, borderRadius: 6, cursor: 'pointer', background: (selectedName === name ? '#e6f2ff' : 'transparent'), marginBottom: 6 }}>
                  <div style={{ fontWeight: 700 }}>{name}</div>
                  <div style={{ fontSize: 12, color: '#666' }}>{(serverThemes.find(s => s.themeName === name) ? 'server' : '')}{(customThemes.find(c => c.themeName === name) ? (serverThemes.find(s => s.themeName === name) ? ' · local' : 'local') : '')}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderRadius: 8, padding: 12, background: '#fff', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{themeObj.themeName || 'New theme'}</div>
            <div>
              <label style={{ display: 'block', marginBottom: 6 }}>Theme name</label>
              <input value={themeObj.themeName || ''} onChange={(e) => setThemeObj({ ...themeObj, themeName: e.target.value })} style={{ width: '100%', padding: 8 }} />
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Background color</label>
              <input value={themeObj.backgroundColor || ''} onChange={(e) => setThemeObj({ ...themeObj, backgroundColor: e.target.value })} style={{ width: '100%', padding: 8 }} />
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'block', marginBottom: 6 }}>wordArrays (JSON)</label>
              <textarea value={JSON.stringify(themeObj.wordArrays || {}, null, 2)} onChange={(e) => {
                try { const parsed = JSON.parse(e.target.value); setThemeObj({ ...themeObj, wordArrays: parsed }); } catch (err) { /* ignore until save */ }
              }} style={{ width: '100%', minHeight: 200, padding: 8 }} />
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={() => {
                if (!themeObj.themeName) return alert('Please provide a theme name');
                // save locally
                const stored = JSON.parse(localStorage.getItem('customThemes')) || [];
                const next = stored.filter(t => t.themeName !== themeObj.themeName).concat(themeObj);
                localStorage.setItem('customThemes', JSON.stringify(next));
                if (typeof onSave === 'function') onSave(themeObj);
                showToast('Saved locally', 'success');
                setSelectedName(themeObj.themeName);
              }} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8 }}>Save locally</button>

              <button onClick={async () => {
                if (!themeObj.themeName) return alert('Please provide a theme name');
                setLoading(true);
                try {
                  await updateThemeOnServer(themeObj);
                  showToast('Updated on server', 'success');
                } catch (err) {
                  try { await addThemeToServer(themeObj); showToast('Added to server', 'success'); } catch (err2) { console.error(err2); showToast('Server save failed', 'error'); }
                }
                setLoading(false);
                // refresh server list
                try { const list = await loadThemesFromServer(); setServerThemes(list || []); } catch (e) { console.warn(e); }
              }} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8 }}>{loading ? 'Saving…' : 'Save to server'}</button>

              <button onClick={() => {
                if (!themeObj.themeName) return;
                if (window.confirm(`Delete '${themeObj.themeName}' locally?`)) {
                  const stored = JSON.parse(localStorage.getItem('customThemes')) || [];
                  const next = stored.filter(t => t.themeName !== themeObj.themeName);
                  localStorage.setItem('customThemes', JSON.stringify(next));
                  if (typeof onSave === 'function') onSave({ themeName: themeObj.themeName, deleted: true });
                  showToast('Deleted locally', 'success');
                  setThemeObj({ themeName: '', backgroundColor: '', wordArrays: {} });
                  setSelectedName('');
                }
              }} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8 }}>Delete locally</button>

              <button onClick={async () => {
                if (!themeObj.themeName) return;
                if (!window.confirm(`Delete '${themeObj.themeName}' from server?`)) return;
                try { await deleteThemeFromServer(themeObj.themeName); showToast('Deleted from server', 'success'); } catch (err) { console.error(err); showToast('Server delete failed', 'error'); }
                try { const list = await loadThemesFromServer(); setServerThemes(list || []); } catch (e) { console.warn(e); }
              }} style={{ background: '#a41f1f', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8 }}>Delete from server</button>

              <button onClick={onRequestClose} style={{ background: '#e6e6e6', border: 'none', padding: '8px 12px', borderRadius: 8 }}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
