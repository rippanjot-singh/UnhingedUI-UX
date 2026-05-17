import { useState, useEffect } from 'react';

const NOTIFICATIONS = [
  'Your session will expire in 15 minutes.',
  'New message from: DEPT-ADMIN-07@gov.us.net',
  'Form DS-4421-B is due in 3 business days.',
  'Security scan complete. 0 threats found. (Please verify manually)',
  'Your account password expires in 2 days.',
  'Cookie policy updated. You must re-accept to continue.',
  'Server maintenance scheduled for tonight 2:00AM - 6:00AM EST.',
  'REMINDER: Attach notarized copy of Form I-797 to your application.',
  'Your IP address has been logged for compliance purposes.',
  'System update available. Restart required. Do not restart.',
  'You have (3) unread messages in your secure inbox.',
  'Action required: Verify your registered mailing address.',
  'WARNING: Unusual login attempt detected from 192.168.1.1',
  'Your digital signature certificate expires in 90 days.',
  'Please complete your annual privacy agreement re-confirmation.',
  'Download failed: govform_DS7749_rev2003.pdf (retry?)',
];

export default function NotificationSpam() {
  const [toasts, setToasts] = useState([]);
  const isDisabled = sessionStorage.getItem('popups_disabled') === '1';

  useEffect(() => {
    if (isDisabled) return;
    let idx = 0;
    const intervals = [3000, 7000, 12000, 18000, 25000, 33000, 42000];
    
    const timers = intervals.map((delay) =>
      setTimeout(() => {
        const msg = NOTIFICATIONS[idx % NOTIFICATIONS.length];
        idx++;
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev.slice(-4), { id, msg }]);
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, 6000);
      }, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [isDisabled]);

  if (isDisabled) return null;

  return (
    <div className="notification-container">
      {toasts.map(t => (
        <div key={t.id} className="notification-toast">
          <div className="titlebar" style={{ background: '#c0c0c0', color: '#000', borderBottom: '1px solid #808080' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10 }}>
              <img src="data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7" alt="" style={{width:14,height:14}} onError={e=>e.target.style.display='none'} />
              Windows — Information
            </span>
            <span
              className="titlebar-btn"
              onClick={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))}
              style={{ color: '#000', background: '#c0c0c0' }}
            >✕</span>
          </div>
          <div style={{ padding: '4px 6px', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>ℹ️</span>
            <span style={{ fontFamily: 'Arial', fontSize: 10, flex: 1 }}>{t.msg}</span>
          </div>
          <div style={{ padding: '2px 6px 3px', display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
            <button className="btn-98" style={{ fontSize: 10, minWidth: 50, padding: '1px 6px' }}
              onClick={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))}>
              OK
            </button>
            <button className="btn-98" style={{ fontSize: 10, minWidth: 50, padding: '1px 6px' }}
              onClick={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))}>
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
