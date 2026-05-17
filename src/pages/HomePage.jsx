import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CursedLayout from '../components/CursedLayout';
import ConfirmDialog from '../components/ConfirmDialog';

const FAKE_NEWS = [
  'Portal scheduled for maintenance: March 15, 2004 – Services may be interrupted',
  'New Form DS-7749 Rev.C now required for all Section 12-B filings',
  'Security Notice: Do not share your PIN with any government employee',
  'Reminder: Annual renewal deadline extended to April 30, 2004',
  'URGENT: Users born before 1970 must re-register by end of month',
  'Download the new PDF reader plugin to view government forms correctly',
  'System Notice: Internet Explorer 5.0 no longer supported. Please upgrade.',
  'Notice: Uploaded files must be in .TIF or .BMP format only. JPGs rejected.',
];

export default function HomePage() {
  const navigate = useNavigate();
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState('');
  const [accordion, setAccordion] = useState({});
  const [fakeLoading, setFakeLoading] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [counter, setCounter] = useState(4721);

  // Mouse Cursor Letter Trail states
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const charArray = "🦅 PROUD TO BE AN AMERICAN CITIZEN 🦅".split("");
      setTrail(prev => {
        const nextTrail = [{ x: e.clientX, y: e.clientY, id: Math.random() }, ...prev];
        return nextTrail.slice(0, charArray.length);
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCounter(c => c + Math.floor(Math.random() * 3)), 5000);
    return () => clearInterval(t);
  }, []);



  const handleCounterClick = (e) => {
    e.preventDefault();
    alert('🎉 CONGRATULATIONS CITIZEN! You have triggered the Federal Surplus Toaster Lottery! Click OK to claim your government surplus appliance.');
    window.dispatchEvent(new CustomEvent('cursed-link', { detail: 'Surplus Toaster Claim Form' }));
  };

  const goTo = (path) => {
    setConfirmTarget(path);
    setConfirmLeave(true);
  };

  const handleConfirm = () => {
    setConfirmLeave(false);
    setFakeLoading(true);
    setLoadPct(0);
    const interval = setInterval(() => {
      setLoadPct(p => {
        if (p >= 100) {
          clearInterval(interval);
          navigate(confirmTarget);
          return 100;
        }
        return p + Math.floor(Math.random() * 12) + 3;
      });
    }, 120);
  };

  const toggleAccordion = (key) => setAccordion(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <CursedLayout>
      {/* 🦅 Mouse Trail Letters 🦅 */}
      {trail.map((t, idx) => {
        const trailStr = "🦅 PROUD TO BE AN AMERICAN CITIZEN 🦅";
        const char = trailStr[idx % trailStr.length];
        return (
          <div
            key={t.id}
            style={{
              position: 'fixed',
              left: t.x + 12 + idx * 9,
              top: t.y + 12,
              pointerEvents: 'none',
              zIndex: 9999,
              fontFamily: 'Courier New',
              fontSize: 10,
              fontWeight: 'bold',
              color: idx % 3 === 0 ? '#cc0000' : idx % 3 === 1 ? '#000080' : '#ffffff',
              textShadow: '1px 1px #000',
              opacity: (trailStr.length - idx) / trailStr.length,
            }}
          >
            {char}
          </div>
        );
      })}

      {/* Fake loading overlay */}
      {fakeLoading && (
        <div style={{ position: 'fixed', inset: 0, background: '#c0c0c0', zIndex: 8500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="win98-window" style={{ width: 360 }}>
            <div className="titlebar"><span>Loading Page...</span></div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontFamily: 'Arial', fontSize: 11, marginBottom: 8 }}>Connecting to server... Please wait.</div>
              <div className="progress-bar-outer" style={{ marginBottom: 4 }}>
                <div className="progress-bar-inner" style={{ width: `${loadPct}%` }} />
              </div>
              <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080' }}>
                Retrieving page from GOVWEB-04... {loadPct}% complete
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmLeave && (
        <ConfirmDialog
          title="Leave This Page?"
          message="Are you sure you want to navigate away from this page? Any unsaved progress in your current session will be lost and you may be required to re-verify your identity."
          onConfirm={handleConfirm}
          onCancel={() => setConfirmLeave(false)}
        />
      )}

      {/* Top warning banner */}
      <div style={{ background: '#cc0000', color: '#ffffff', padding: '2px 6px', fontFamily: 'Arial', fontSize: 10, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
        <span className="blink">🔔 IMPORTANT NOTICE: Portal will be DOWN for maintenance Feb 31, 2004</span>
        <span className="fake-link" style={{ color: '#ffff99' }}>Click to dismiss</span>
      </div>

      {/* Page title */}
      <div style={{ marginBottom: 6 }}>
        <div className="page-title">Welcome to the U.S. Citizen Services Portal</div>
        <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080' }}>
          Home &gt; Main &gt; Welcome | Page ID: HP-001-EN | Last reviewed: 03/14/2004 | 
          <span className="fake-link"> Printer-Friendly Version</span> | 
          <span className="fake-link"> Email This Page</span> | 
          <span className="fake-link"> Translate</span>
        </div>
      </div>

      {/* Two column layout */}
      <table width="100%" cellPadding="0" cellSpacing="3" style={{ tableLayout: 'fixed' }}>
        <tbody>
          <tr valign="top">
            {/* Main column */}
            <td width="65%">
              {/* Welcome panel */}
              <div className="panel-raised" style={{ marginBottom: 6 }}>
                <div className="section-title">Welcome, Citizen</div>
                <div style={{ fontFamily: 'Times New Roman', fontSize: 12, marginBottom: 6, lineHeight: 1.4 }}>
                  Welcome to the Official United States Department of Citizen Services Online Portal.
                  This website provides citizens with secure, convenient access to government services.
                  Please read all instructions carefully before proceeding.
                </div>
                <div style={{ fontFamily: 'Arial', fontSize: 10, marginBottom: 6 }}>
                  <strong>IMPORTANT:</strong> This portal requires a valid <span className="fake-link">Citizen Access Code (CAC)</span> and
                  government-issued photo identification to access services. If you do not have a CAC,
                  please <span className="fake-link">complete Form CAC-1 (PDF, 47 pages)</span> and mail to your regional office.
                  Processing time: 6-8 weeks.
                </div>

                 {/* MIDI Player Compliance Notice */}
                 <div className="panel-inset" style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8, padding: 6, background: '#ffffd0', border: '1px solid #808080' }}>
                   <span style={{ fontSize: 18 }}>🔊</span>
                   <div style={{ fontFamily: 'Arial', fontSize: 10 }}>
                     <strong>Mandatory Compliance Audio Active:</strong> Under Directive DHS-99, federal acoustic compliance stimulation is broadcasting globally. Please consult the secure, floating <strong>Windows Media Player 98</strong> widget on your desktop to verify acoustic synchronization.
                   </div>
                 </div>

                {/* CTA buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
                  <button className="btn-98 btn-wiggle" onClick={() => goTo('/login')} style={{ background: '#006600', color: '#ffffff', fontWeight: 'bold', borderColor: '#44aa44 #003300 #003300 #44aa44' }}>
                    ▶ Access My Account
                  </button>
                  <button className="btn-98 btn-wiggle" onClick={() => goTo('/login')}>
                    Register New User
                  </button>
                  <button className="btn-98 btn-wiggle" onClick={() => goTo('/login')} style={{ fontSize: 9 }}>
                    Guest Access (Limited)
                  </button>
                  <button className="btn-98 btn-wiggle" onClick={() => goTo('/login')} style={{ fontSize: 14, fontWeight: 'bold', color: '#cc0000' }}>
                    Click Here!!!
                  </button>
                  <button className="btn-98 btn-wiggle" onClick={() => goTo('/login')} style={{ fontSize: 8, color: '#808080' }}>
                    Continue Without Registering
                  </button>
                </div>

                <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080' }}>
                  By accessing this portal you agree to our <span className="fake-link">Terms of Service (87 pages)</span>,{' '}
                  <span className="fake-link">Privacy Notice</span>, <span className="fake-link">Cookie Policy</span>,{' '}
                  <span className="fake-link">Section 508 Compliance Statement</span>, and{' '}
                  <span className="fake-link">Electronic Surveillance Disclosure (FISMA 2002)</span>.
                </div>
              </div>

              {/* News panel */}
              <div className="panel-raised" style={{ marginBottom: 6 }}>
                <div className="section-title">📢 Latest Announcements</div>
                <table className="data-table" width="100%">
                  <thead>
                    <tr>
                      <th width="80">Date</th>
                      <th>Announcement</th>
                      <th width="60">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FAKE_NEWS.map((n, i) => (
                      <tr key={i}>
                        <td style={{ fontFamily: 'Arial', fontSize: 9, whiteSpace: 'nowrap' }}>
                          {`0${(i+1) % 12 + 1}`.slice(-2)}/14/2004
                        </td>
                        <td>
                          <span className="fake-link" style={{ fontSize: 10 }}>{n}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ color: i < 2 ? '#cc0000' : i < 4 ? '#cc6600' : '#006600', fontFamily: 'Arial', fontSize: 9, fontWeight: 'bold' }}>
                            {i < 2 ? 'HIGH' : i < 4 ? 'MED' : 'LOW'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Accordion hell */}
              <div className="panel-raised">
                <div className="section-title">Frequently Asked Questions</div>
                {[
                  { q: 'How do I register?', a: 'To register, click "Register New User" and complete all required fields. A physical verification letter will be mailed to your address. Allow 6-8 weeks.' },
                  { q: 'What documents do I need?', a: 'You will need: (1) Original birth certificate, (2) Two forms of government-issued photo ID, (3) Proof of address dated within 30 days, (4) Notarized authorization letter (Form AUTH-7B), (5) Completed Form DS-4421-B Rev.C' },
                  { q: 'Why is my account locked?', a: 'Accounts are locked after 2 failed login attempts for security. To unlock, complete the 12-step identity verification process or call 1-800-555-0199 (M-F 9AM-4PM EST, except federal holidays).' },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: 2 }}>
                    <div className="accordion-header" onClick={() => toggleAccordion(`faq-${i}`)}>
                      <span style={{ fontSize: 10 }}>{accordion[`faq-${i}`] ? '▼' : '▶'} {item.q}</span>
                      <span style={{ fontSize: 10, color: '#808080' }}>Click to {accordion[`faq-${i}`] ? 'collapse' : 'expand'}</span>
                    </div>
                    {accordion[`faq-${i}`] && (
                      <div className="accordion-body">
                        <div style={{ marginBottom: 4 }}>{item.a}</div>
                        {/* Nested accordion inside accordion */}
                        <div className="accordion-header" onClick={() => toggleAccordion(`faq-sub-${i}`)} style={{ background: '#d0d0d0' }}>
                          <span style={{ fontSize: 9 }}>{accordion[`faq-sub-${i}`] ? '▼' : '▶'} Related Information</span>
                        </div>
                        {accordion[`faq-sub-${i}`] && (
                          <div className="accordion-body" style={{ background: '#c8c8c8' }}>
                            <div style={{ fontSize: 9 }}>See also: <span className="fake-link">Form DS-001</span>, <span className="fake-link">Help Topic 4421-B</span>, <span className="fake-link">Regional Office Locator</span></div>
                            <div className="accordion-header" onClick={() => toggleAccordion(`faq-sub2-${i}`)} style={{ background: '#c0c0c0', marginTop: 3 }}>
                              <span style={{ fontSize: 8 }}>{accordion[`faq-sub2-${i}`] ? '▼' : '▶'} Additional Resources</span>
                            </div>
                            {accordion[`faq-sub2-${i}`] && (
                              <div className="accordion-body" style={{ background: '#b8b8b8', fontSize: 9 }}>
                                Please contact your regional office for further assistance.
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

            {/* Right column */}
            <td width="35%">
              {/* Visitor counter */}
              <div className="panel-raised" style={{ marginBottom: 4, textAlign: 'center', cursor: 'pointer' }} onClick={handleCounterClick}>
                <div className="section-title">Portal Statistics</div>
                <div style={{ fontFamily: 'Verdana', fontSize: 9, padding: '4px' }}>
                  <div>You are visitor #:</div>
                  <div style={{ fontFamily: 'Courier New', fontSize: 18, color: '#cc0000', fontWeight: 'bold', letterSpacing: 4, textDecoration: 'underline' }}>
                    {String(counter).padStart(7, '0')}
                  </div>
                  <div style={{ fontSize: 8, color: '#808080' }}>Since January 1, 1997 (Click to check eligibility)</div>
                  <img src="https://www.hitwebcounter.com/hwcounter.php?PAGE=7182&STYLE=1&NBR=1&BORDER=NO&CLR=FF0000" alt="Hit Counter" style={{ marginTop: 2 }} onError={e => e.target.style.display='none'} />
                </div>
              </div>

              {/* Quick links */}
              <div className="panel-raised" style={{ marginBottom: 4 }}>
                <div className="section-title">Quick Access</div>
                <div style={{ padding: '2px 4px', fontFamily: 'Arial', fontSize: 10 }}>
                  {[
                    '📄 Check Application Status',
                    '💳 Pay Fee Online',
                    '📥 Download Forms',
                    '📅 Schedule Appointment',
                    '🔑 Reset Password',
                    '📞 Contact Regional Office',
                    '🗺 Find Service Center',
                  ].map((l, i) => (
                    <div key={i} style={{ borderBottom: '1px dotted #808080', padding: '2px 0' }}>
                      <span className="fake-link" style={{ fontSize: 10 }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System requirements */}
              <div className="panel-raised" style={{ marginBottom: 4 }}>
                <div className="section-title">System Requirements</div>
                <div style={{ fontFamily: 'Arial', fontSize: 9, padding: '2px 4px' }}>
                  <div>• Internet Explorer 5.5 or 6.0 <span className="blink" style={{ color: '#cc0000' }}>REQUIRED</span></div>
                  <div>• Windows 98/2000/XP</div>
                  <div>• 56k modem or faster</div>
                  <div>• 800×600 minimum resolution</div>
                  <div>• Java v1.3.1 or later</div>
                  <div>• Adobe Acrobat Reader 5.0</div>
                  <div>• Macromedia Flash 5</div>
                  <div>• Cookies enabled</div>
                  <div>• JavaScript enabled</div>
                  <div>• Pop-ups allowed for this site</div>
                  <hr className="hr-98" />
                  <div style={{ color: '#808080', fontSize: 8 }}>
                    Netscape, Firefox, Safari, Opera and Chrome are <strong>NOT SUPPORTED</strong>.
                    The government is not responsible for display issues in unsupported browsers.
                  </div>
                </div>
              </div>

              {/* Seal / badge */}
              <div className="panel-raised" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36 }}>🦅</div>
                <div style={{ fontFamily: 'Arial', fontSize: 8, color: '#808080', lineHeight: 1.3 }}>
                  <div style={{ fontWeight: 'bold', color: '#000080' }}>U.S. DEPT. OF CITIZEN SERVICES</div>
                  <div>Official Government Website</div>
                  <div>Protected by SSL 2.0</div>
                  <img src="" alt="VeriSign Secured" style={{ display: 'block', margin: '3px auto', border: '1px solid #ccc', width: 80, height: 30, background: '#eee' }} />
                  <div>
                    <span className="fake-link">Privacy Policy</span> | <span className="fake-link">Security</span>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Footer */}
      <div className="hr-98" style={{ marginTop: 8 }} />
      <div style={{ fontFamily: 'Arial', fontSize: 8, color: '#808080', textAlign: 'center', paddingBottom: 4 }}>
        U.S. Department of Citizen Services | 1600 Pennsylvania Ave NW, Washington, DC 20500 |
        <span className="fake-link"> Contact</span> | <span className="fake-link">Accessibility</span> |
        <span className="fake-link">Freedom of Information Act</span> | <span className="fake-link">No Fear Act</span> |
        <span className="fake-link">Inspector General</span> | <span className="fake-link">USA.gov</span>
        <br />
        Last reviewed: March 14, 2004 | Web Policy | Disclaimer | This website contains U.S. government information.
        <span className="blink" style={{ color: '#cc0000' }}> ⚠ NOT HTTPS</span>
      </div>
    </CursedLayout>
  );
}
