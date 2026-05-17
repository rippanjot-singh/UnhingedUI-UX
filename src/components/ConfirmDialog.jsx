import { useState } from 'react';

export default function ConfirmDialog({ message, onConfirm, onCancel, title = 'Confirm Action' }) {
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = () => {
    if (!confirming) {
      setConfirming(true);
    } else {
      onConfirm();
    }
  };

  return (
    <div className="modal-backdrop" style={{ zIndex: 9600 }}>
      <div className="win98-window" style={{ width: 340 }}>
        <div className="titlebar">
          <span>❓ {title}</span>
          <span className="titlebar-btn" onClick={onCancel}>✕</span>
        </div>
        <div style={{ padding: '12px 14px' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
            <span style={{ fontSize: 28 }}>❓</span>
            <div>
              <div style={{ fontFamily: 'Arial', fontSize: 11, marginBottom: 6 }}>{message}</div>
              {confirming && (
                <div className="warning-box" style={{ marginTop: 4 }}>
                  <span style={{ fontFamily: 'Arial', fontSize: 10, fontWeight: 'bold' }}>
                    Are you absolutely sure? This action may be irreversible.
                    Click "Yes" again to confirm your confirmation.
                  </span>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <button className="btn-98 btn-wiggle" onClick={handleConfirm}>
              {confirming ? 'Yes (Final Confirmation)' : 'Yes'}
            </button>
            <button className="btn-98 btn-wiggle" onClick={onCancel}>No</button>
            <button className="btn-98 btn-wiggle" onClick={onCancel} style={{ color: '#000080', fontWeight: 'bold' }}>
              Cancel
            </button>
          </div>
          <div style={{ textAlign: 'center', fontFamily: 'Arial', fontSize: 8, color: '#808080', marginTop: 6 }}>
            Note: Clicking "No" may also proceed with the action depending on your session state.
          </div>
        </div>
      </div>
    </div>
  );
}
