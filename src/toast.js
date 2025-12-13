// Minimal toast helper: call showToast(message, type) where type is 'success'|'error'|'info'
export function showToast(message, type = 'info', duration = 2500, action) {
  // action: { label: 'Undo', onClick: () => {} }
  let container = document.getElementById('__app_toast_container');
  if (!container) {
    container = document.createElement('div');
    container.id = '__app_toast_container';
    Object.assign(container.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      alignItems: 'flex-end',
      pointerEvents: 'none'
    });
    document.body.appendChild(container);
  }

  const el = document.createElement('div');
  el.textContent = message;
  el.style.pointerEvents = 'auto';
  el.style.padding = '8px 12px';
  el.style.borderRadius = '6px';
  el.style.color = '#fff';
  el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
  el.style.maxWidth = '320px';
  el.style.fontSize = '13px';
  if (type === 'success') el.style.background = '#22c55e';
  else if (type === 'error') el.style.background = '#ef4444';
  else el.style.background = '#2563eb';
  if (action && action.label && typeof action.onClick === 'function') {
    const actionBtn = document.createElement('button');
    actionBtn.textContent = action.label;
    actionBtn.style.marginLeft = '8px';
    actionBtn.style.border = 'none';
    actionBtn.style.background = 'rgba(255,255,255,0.12)';
    actionBtn.style.color = 'inherit';
    actionBtn.style.padding = '4px 8px';
    actionBtn.style.borderRadius = '4px';
    actionBtn.style.cursor = 'pointer';
    actionBtn.onclick = (e) => {
      try { action.onClick(e); } catch (_) {}
      el.remove();
    };
    el.appendChild(actionBtn);
  }

  container.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity 240ms ease, transform 240ms ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    setTimeout(() => el.remove(), 260);
  }, duration);
  return el;
}

export default showToast;
