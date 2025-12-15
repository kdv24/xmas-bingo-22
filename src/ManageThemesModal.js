import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

// Minimal manage modal: edits a theme object shape { themeName, backgroundColor, wordArrays }
export default function ManageThemesModal({ isOpen, onRequestClose, customThemes = [], editTheme = null, onSave }) {
  const [saving, setSaving] = useState(false);
  const [themeObj, setThemeObj] = useState(() => {
    if (!editTheme) return { createdAt: '', themeName: '', backgroundColor: '', wordArrays: [] };
    // Always convert wordArrays to array if string
    let wa = editTheme.wordArrays;
    if (typeof wa === 'string') wa = wa.split(',').map(s => s.trim()).filter(Boolean);
    return { ...editTheme, wordArrays: wa };
  });
  useEffect(() => {
    if (!editTheme) {
      setThemeObj({ themeName: '', backgroundColor: '', wordArrays: [] });
    } else {
      let wa = editTheme.wordArrays;
      if (typeof wa === 'string') wa = wa.split(',').map(s => s.trim()).filter(Boolean);
      setThemeObj({ ...editTheme, wordArrays: wa });
    }
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
          <label style={{ display: 'block', marginBottom: 6 }}>Words (comma separated)</label>
          <textarea
            value={Array.isArray(themeObj.wordArrays)
              ? themeObj.wordArrays.join(', ')
              : (typeof themeObj.wordArrays === 'string'
                  ? themeObj.wordArrays
                  : '')}
            onChange={e => {
              setThemeObj({
                ...themeObj,
                wordArrays: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              });
            }}
            style={{ width: '100%', minHeight: 180, padding: 8 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
          <button
            onClick={async () => {
              if (!themeObj.themeName) return alert('Please provide a theme name');
              setSaving(true);
              try {
                if (typeof onSave === 'function') {
                  const maybePromise = onSave(themeObj);
                  if (maybePromise && typeof maybePromise.then === 'function') {
                    await maybePromise;
                  }
                }
              } finally {
                setSaving(false);
              }
            }}
            style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
            disabled={saving}
          >
            {saving ? (
              <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                <span className="spinner" style={{ marginRight: 8, display: 'inline-block', width: 16, height: 16, border: '2px solid #ccc', borderTop: '2px solid #38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite', verticalAlign: 'middle' }}></span>
                Saving...
              </span>
            ) : 'Save'}
          </button>
          <button onClick={onRequestClose} style={{ background: '#e6e6e6', border: 'none', padding: '8px 12px', borderRadius: 8 }} disabled={saving}>Cancel</button>
        </div>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    </Modal>
  );
}
