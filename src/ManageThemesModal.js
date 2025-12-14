import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

// Minimal manage modal: edits a theme object shape { themeName, backgroundColor, wordArrays }
export default function ManageThemesModal({ isOpen, onRequestClose, customThemes = [], editTheme = null, onSave }) {
  const [themeObj, setThemeObj] = useState(editTheme || { createdAt: '', themeName: '', backgroundColor: '', wordArrays: {} });
  useEffect(() => {
    setThemeObj(editTheme || { themeName: '', backgroundColor: '', wordArrays: {} });
  }, [editTheme]);

  return (
    <Modal appElement={document.getElementById('root')} isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Manage Theme" className="modal" overlayClassName="overlay">
      <div style={{ padding: 16, maxWidth: 640 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{themeObj?.themeName ? `Edit: ${themeObj.themeName}` : 'Create theme'}</h3>
          <button onClick={onRequestClose} style={{ border: 'none', background: 'transparent', fontSize: 18 }}>✕</button>
        </div>

        <div style={{ marginTop: 12 }}>
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
            let parsed = {};
            try { parsed = JSON.parse(e.target.value); } catch (err) { /* ignore parse error until save */ }
            setThemeObj({ ...themeObj, wordArrays: parsed });
          }} style={{ width: '100%', minHeight: 180, padding: 8 }} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={() => {
            if (!themeObj.themeName) return alert('Please provide a theme name');
            if (typeof onSave === 'function') onSave(themeObj);
          }} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8 }}>Save</button>
          <button onClick={onRequestClose} style={{ background: '#e6e6e6', border: 'none', padding: '8px 12px', borderRadius: 8 }}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}
