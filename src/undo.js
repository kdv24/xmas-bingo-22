// Minimal undo helper: keep a short-lived stack of undo operations
const undoStack = [];

export function pushUndo({ label = 'Undo', onUndo, ttl = 5000 }) {
  const id = Date.now() + Math.random();
  const entry = { id, label, onUndo };
  undoStack.push(entry);
  // Auto-expire
  setTimeout(() => {
    const idx = undoStack.findIndex(e => e.id === id);
    if (idx >= 0) undoStack.splice(idx, 1);
  }, ttl);
  return () => {
    const idx = undoStack.findIndex(e => e.id === id);
    if (idx >= 0) {
      const e = undoStack[idx];
      try { e.onUndo(); } catch (err) { console.error('undo failed', err); }
      undoStack.splice(idx, 1);
      return true;
    }
    return false;
  };
}

export default pushUndo;
