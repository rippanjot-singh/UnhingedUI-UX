import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CursedLayout from '../components/CursedLayout';
import ConfirmDialog from '../components/ConfirmDialog';

const FAKE_CASES = [
  { id: 'DS-4421-B', status: 'Pending Review', date: '01/12/2004', priority: 'HIGH' },
  { id: 'CAC-7892', status: 'Additional Info Required', date: '02/28/2004', priority: 'URGENT' },
  { id: 'TAX-0091-REV', status: 'Processing', date: '03/01/2004', priority: 'MED' },
  { id: 'LIC-5512', status: 'Awaiting Notarization', date: '03/10/2004', priority: 'LOW' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('cursed_user') || '{}');
  const [accordion, setAccordion] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });

  // Fake auto-save loop
  useEffect(() => {
    const msgs = ['Saving...', 'Auto-saving session data...', 'Syncing with server...', 'Saving preferences...'];
    const t = setInterval(() => {
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      setSaving(true); setSaveMsg(msg);
      setTimeout(() => setSaving(false), 1800 + Math.random() * 1200);
    }, 12000);
    return () => clearInterval(t);
  }, []);

  const toggle = (k) => setAccordion(p => ({ ...p, [k]: !p[k] }));

  const goToForm = () => {
    setConfirm({
      msg: 'You are about to begin a multi-step form submission. This process cannot be paused. If you leave the form, all progress will be lost. Are you sure you want to proceed?',
      onConfirm: () => { setConfirm(null); navigate('/form'); }
    });
  };

  const showTip = (e, text) => {
    setTooltip({ visible: true, text, x: e.clientX + 12, y: e.clientY + 8 });
  };
  const hideTip = () => setTooltip({ visible: false, text: '', x: 0, y: 0 });

  return (
    <CursedLayout>
      {confirm && <ConfirmDialog message={confirm.msg} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}

      {tooltip.visible && (
        <div className="cursed-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>{tooltip.text}</div>
      )}

      {/* Saving indicator */}
      {saving && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: '#ffffc0', border: '1px solid #808080', padding: '2px 10px', fontFamily: 'Arial', fontSize: 10, zIndex: 7500, boxShadow: '2px 2px 0 #000' }}>
          <span className="blink">💾</span> {saveMsg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <div className="page-title">Citizen Dashboard</div>
          <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080' }}>
            Welcome back, <strong>{user.username || 'CITIZEN'}</strong> | Home &gt; Dashboard |
            Last login: {new Date(user.loginTime || Date.now()).toLocaleString()}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 280 }}>
          <button className="btn-98 btn-wiggle" onClick={goToForm} style={{ background: '#006600', color: '#fff', fontWeight: 'bold', fontSize: 11 }}>
            ► Begin New Application
          </button>
          <button className="btn-98 btn-wiggle" style={{ fontSize: 9 }} onClick={() => alert('Feature not available in your browser. Please use Internet Explorer 6.')}>
            View All Applications
          </button>
          <button className="btn-98 btn-wiggle" style={{ fontSize: 9 }} onClick={() => alert('Your session data has been logged.')}>
            Update Profile
          </button>
          <button className="btn-98 btn-wiggle" style={{ fontSize: 8, color: '#808080' }}
            onClick={() => { localStorage.clear(); navigate('/'); }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Alert banners */}
      <div style={{ background: '#ffff99', border: '2px solid #cc9900', padding: '3px 8px', fontFamily: 'Arial', fontSize: 10, marginBottom: 4 }}>
        <span className="blink" style={{ color: '#cc0000', fontWeight: 'bold' }}>⚠ ACTION REQUIRED:</span>{' '}
        Your application DS-4421-B requires additional documentation. Deadline: <strong>March 31, 2004</strong>.
        <span className="fake-link" style={{ marginLeft: 6 }}>View Details</span>
        <span className="fake-link" style={{ marginLeft: 6 }}>Upload Documents</span>
        <span className="fake-link" style={{ marginLeft: 6 }}>Dismiss</span>
      </div>
      <div style={{ background: '#ffd0d0', border: '2px solid #cc0000', padding: '3px 8px', fontFamily: 'Arial', fontSize: 10, marginBottom: 6 }}>
        <span className="blink" style={{ color: '#cc0000', fontWeight: 'bold' }}>⚠ URGENT:</span>{' '}
        Your account will be deactivated in <strong>7 days</strong> unless you complete annual re-registration.
        <span className="fake-link" style={{ marginLeft: 6 }}>Re-register Now</span>
      </div>

      <table width="100%" cellPadding="0" cellSpacing="4"><tbody><tr valign="top">
        {/* Left: Cases */}
        <td width="55%">
          <div className="panel-raised" style={{ marginBottom: 6 }}>
            <div className="section-title">My Applications &amp; Cases</div>
            <table className="data-table" width="100%">
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Status</th>
                  <th>Filed</th>
                  <th>Priority</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {FAKE_CASES.map(c => (
                  <tr key={c.id}>
                    <td>
                      <span className="fake-link"
                        onMouseEnter={e => showTip(e, `Case ${c.id}: Click to view full case details and history`)}
                        onMouseLeave={hideTip}>
                        {c.id}
                      </span>
                    </td>
                    <td style={{ color: c.priority === 'URGENT' ? '#cc0000' : c.priority === 'HIGH' ? '#cc6600' : '#000' }}>
                      {c.status}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{c.date}</td>
                    <td>
                      <span style={{ color: c.priority === 'URGENT' ? '#cc0000' : c.priority === 'HIGH' ? '#cc6600' : '#808080', fontWeight: 'bold', fontSize: 9 }}>
                        {c.priority}
                      </span>
                    </td>
                    <td>
                      <span className="fake-link" style={{ fontSize: 9 }}
                        onMouseEnter={e => showTip(e, 'This feature requires Adobe Acrobat 5.0 and Internet Explorer 6')}
                        onMouseLeave={hideTip}>
                        View
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080', padding: '3px 4px' }}>
              Showing 4 of 4 records | <span className="fake-link">Export to Excel 97</span> | <span className="fake-link">Print</span>
            </div>
          </div>

          {/* Accordions */}
          <div className="panel-raised">
            <div className="section-title">Account Information</div>
            {[
              { key: 'personal', title: 'Personal Information', content: 'Name: [REDACTED FOR SECURITY] | DOB: **/**/19** | SSN: ***-**-**** | Citizenship: U.S. Citizen | Verification Status: ✓ Verified' },
              { key: 'address', title: 'Address on File', content: '[REDACTED] Washington, DC 20500 | Last updated: 01/01/2004 | To update, submit Form ADDR-7 with notarized proof of new address.' },
              { key: 'contact', title: 'Contact Preferences', content: 'Primary Email: ****@****.gov | Phone: (***) ***-**** | Preferred contact: U.S. Mail only (processing 6-8 weeks)' },
              { key: 'security', title: 'Security Settings', content: 'Password: Last changed 45 days ago (EXPIRED — must change immediately) | Last login: Multiple locations detected | 2FA: Enabled (partial)' },
              { key: 'notifications', title: 'Notifications', content: 'You have 7 unread notifications. You cannot read them because this feature requires Internet Explorer 6.0 with ActiveX enabled.' },
            ].map(({ key, title, content }) => (
              <div key={key} style={{ marginBottom: 2 }}>
                <div className="accordion-header" onClick={() => toggle(key)}>
                  <span>{accordion[key] ? '▼' : '▶'} {title}</span>
                  <span style={{ fontSize: 9, color: '#808080' }}>{accordion[key] ? 'Collapse' : 'Expand'}</span>
                </div>
                {accordion[key] && (
                  <div className="accordion-body">
                    <div style={{ fontSize: 10 }}>{content}</div>
                    {/* Nested */}
                    <div className="accordion-header" style={{ background: '#d0d0d0', marginTop: 4 }} onClick={() => toggle(`${key}_sub`)}>
                      <span style={{ fontSize: 9 }}>{accordion[`${key}_sub`] ? '▼' : '▶'} Related Settings</span>
                    </div>
                    {accordion[`${key}_sub`] && (
                      <div className="accordion-body" style={{ background: '#c8c8c8' }}>
                        <span className="fake-link" style={{ fontSize: 9 }}>Edit this section</span> | <span className="fake-link" style={{ fontSize: 9 }}>Download as PDF</span>
                        <div className="accordion-header" style={{ background: '#bdbdbd', marginTop: 3 }} onClick={() => toggle(`${key}_sub2`)}>
                          <span style={{ fontSize: 8 }}>{accordion[`${key}_sub2`] ? '▼' : '▶'} Audit Log</span>
                        </div>
                        {accordion[`${key}_sub2`] && (
                          <div className="accordion-body" style={{ background: '#b5b5b5', fontSize: 9 }}>
                            All changes to this section are logged per FISMA 2002. Contact your regional office for audit records.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </td>

        {/* Right: Widgets */}
        <td width="45%">
          <div className="panel-raised" style={{ marginBottom: 6 }}>
            <div className="section-title">📊 Account Summary</div>
            <table width="100%" cellPadding="2" style={{ fontFamily: 'Arial', fontSize: 10 }}>
              <tbody>
                <tr><td>Applications Filed:</td><td style={{ fontWeight: 'bold' }}>4</td></tr>
                <tr><td>Pending Actions:</td><td style={{ fontWeight: 'bold', color: '#cc0000' }}>3 <span className="blink">⚠</span></td></tr>
                <tr><td>Documents Uploaded:</td><td style={{ fontWeight: 'bold' }}>1</td></tr>
                <tr><td>Fees Owed:</td><td style={{ fontWeight: 'bold', color: '#cc0000' }}>$247.50</td></tr>
                <tr><td>Account Status:</td><td><span style={{ color: '#cc6600', fontWeight: 'bold' }}>⚠ NEEDS ATTENTION</span></td></tr>
                <tr><td>Verification Level:</td><td>Level 2 of 7</td></tr>
                <tr><td>Password Status:</td><td><span style={{ color: '#cc0000', fontWeight: 'bold' }} className="blink">EXPIRED</span></td></tr>
              </tbody>
            </table>
          </div>

          <div className="panel-raised" style={{ marginBottom: 6 }}>
            <div className="section-title">⏰ Upcoming Deadlines</div>
            <div style={{ fontFamily: 'Arial', fontSize: 10, padding: '2px 4px' }}>
              {[
                { date: 'Mar 15, 2004', task: 'Annual Re-registration', urgent: true },
                { date: 'Mar 31, 2004', task: 'DS-4421-B Additional Docs', urgent: true },
                { date: 'Apr 15, 2004', task: 'Fee Payment — $247.50', urgent: false },
                { date: 'Apr 30, 2004', task: 'License Renewal (CAC-7892)', urgent: false },
                { date: 'May 1, 2004', task: 'Annual Privacy Agreement', urgent: false },
              ].map(({ date, task, urgent }) => (
                <div key={date} style={{ display: 'flex', gap: 6, padding: '2px 0', borderBottom: '1px dotted #808080' }}>
                  <span style={{ minWidth: 80, color: urgent ? '#cc0000' : '#000', fontWeight: urgent ? 'bold' : 'normal', fontSize: 9 }}>{date}</span>
                  <span style={{ color: urgent ? '#cc0000' : '#000', fontSize: 9 }}>{urgent && '⚠ '}{task}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-raised">
            <div className="section-title">Quick Actions</div>
            <div style={{ padding: '4px', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <button className="btn-98 btn-wiggle" onClick={goToForm} style={{ textAlign: 'left', background: '#000080', color: '#fff', fontWeight: 'bold' }}>
                ► Submit New Application
              </button>
              <button className="btn-98 btn-wiggle" style={{ textAlign: 'left' }}
                onClick={() => alert('Please download and complete Form FEE-7 and mail a cashier\'s check to your regional office.')}>
                💳 Pay Outstanding Fees
              </button>
              <button className="btn-98 btn-wiggle" style={{ textAlign: 'left' }}
                onClick={() => alert('Document upload requires Internet Explorer 6.0 with Java enabled.')}>
                📄 Upload Documents
              </button>
              <button className="btn-98 btn-wiggle" style={{ textAlign: 'left', fontSize: 9 }}
                onClick={() => alert('Appointment scheduling is currently unavailable online. Please call 1-800-555-0199.')}>
                📅 Schedule Appointment
              </button>
              <button className="btn-98 btn-wiggle" style={{ textAlign: 'left', fontSize: 9 }}
                onClick={() => { localStorage.clear(); navigate('/'); }}>
                🔒 Log Out
              </button>
            </div>
          </div>
        </td>
      </tr></tbody></table>
    </CursedLayout>
  );
}
