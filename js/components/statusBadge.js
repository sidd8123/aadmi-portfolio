// statusBadge.js — Verification status indicator

export function createStatusBadge(status) {
  const el = document.createElement('span');
  el.className = `status-badge status-badge--${status}`;
  const labels = {
    verified: '✓ Verified',
    pending: '◷ Pending',
    private: '🔒 Private'
  };
  el.textContent = labels[status] || status;
  return el;
}
