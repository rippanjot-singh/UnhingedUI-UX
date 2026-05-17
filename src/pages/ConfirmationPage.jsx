import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CursedLayout from '../components/CursedLayout';

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('cursed_user') || '{}');
  const [savingStep, setSavingStep] = useState(0);
  const [done, setDone] = useState(false);
  const [refNum] = useState(() => `DS-${Math.floor(Math.random() * 900000 + 100000)}-${new Date().getFullYear()}-${Math.floor(Math.random() * 99 + 1).toString().padStart(2, '0')}`);
  const [showPrint, setShowPrint] = useState(false);

  const SAVE_STEPS = [
    'Initializing secure submission...',
    'Encrypting personal data (AES-256)...',
    'Transmitting to GOVWEB-04 server...',
    'Cross-referencing with federal databases...',
    'Generating case reference number...',
    'Logging submission in federal audit trail...',
    'Sending confirmation to regional office...',
    'Archiving application data (retain 7 years)...',
    'Finalizing submission...',
    'Complete.',
  ];

  useEffect(() => {
    if (savingStep >= SAVE_STEPS.length) { setDone(true); return; }
    const delay = 600 + Math.random() * 800;
    const t = setTimeout(() => setSavingStep(s => s + 1), delay);
    return () => clearTimeout(t);
  }, [savingStep]);

  useEffect(() => {
    if (done) {
      localStorage.removeItem('cursed_form_data');
      localStorage.removeItem('cursed_step');
    }
  }, [done]);

  return (
    <CursedLayout>
      {showPrint && (
        <div className="modal-backdrop" style={{ zIndex: 9200 }}>
          <div className="win98-window" style={{ width: 380 }}>
            <div className="titlebar"><span>🖨 Print</span><span className="titlebar-btn" onClick={() => setShowPrint(false)}>✕</span></div>
            <div style={{ padding: '10px 14px' }}>
              <div style={{ fontFamily: 'Arial', fontSize: 11, marginBottom: 8 }}>Preparing document for printing...</div>
              <div className="warning-box" style={{ marginBottom: 8 }}>
                ⚠ Your default printer (HP LaserJet 1200) is offline or not responding.<br />
                Please ensure your printer is connected, powered on, and has paper loaded.<br />
                If printing to PDF, ensure Adobe PDF Printer is installed.
              </div>
              <div style={{ fontFamily: 'Arial', fontSize: 10, marginBottom: 8 }}>
                Alternatively, your confirmation has been mailed to your registered address. Allow 6-8 weeks for delivery.
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                <button className="btn-98 btn-wiggle" onClick={() => setShowPrint(false)}>Retry</button>
                <button className="btn-98 btn-wiggle" onClick={() => setShowPrint(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="page-title">Application Submission {done ? 'Complete' : 'Processing...'}</div>
      <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080', marginBottom: 8 }}>
        Home &gt; Dashboard &gt; Form &gt; Confirmation | Logged in as: <strong>{user.username || 'CITIZEN'}</strong>
      </div>

      {!done ? (
        <div className="panel-raised" style={{ maxWidth: 500 }}>
          <div className="section-title">
            <span className="blink">⏳</span> Processing Your Submission
          </div>
          <div style={{ padding: '10px 12px' }}>
            <div style={{ fontFamily: 'Arial', fontSize: 11, fontWeight: 'bold', marginBottom: 10 }}>
              Please do NOT close this window, press Back, or refresh the page.
              Doing so may result in duplicate submission and a $247.50 reprocessing fee.
            </div>
            <div className="progress-bar-outer" style={{ marginBottom: 8 }}>
              <div className="progress-bar-inner" style={{ width: `${(savingStep / SAVE_STEPS.length) * 100}%` }}>
                <span style={{ fontSize: 9 }}>{Math.round((savingStep / SAVE_STEPS.length) * 100)}%</span>
              </div>
            </div>
            <div style={{ fontFamily: 'Courier New', fontSize: 10, padding: 6, background: '#000', color: '#00ff00', minHeight: 120 }}>
              {SAVE_STEPS.slice(0, savingStep).map((s, i) => (
                <div key={i}>&gt; {s}</div>
              ))}
              {savingStep < SAVE_STEPS.length && (
                <span className="blink">&gt; _</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Success — but make it hard to find */}
          <div style={{ padding: '4px 8px', background: '#e8ffe8', border: '1px solid #00aa00', marginBottom: 8, fontFamily: 'Arial', fontSize: 9, color: '#004400' }}>
            ✓ Your application has been received and is being processed.
          </div>

          <table width="100%" cellPadding="0" cellSpacing="4"><tbody><tr valign="top">
            <td width="60%">
              <div className="panel-raised" style={{ marginBottom: 6 }}>
                <div className="section-title">✓ Submission Confirmation</div>
                <div style={{ padding: '8px 10px' }}>
                  <table cellPadding="3" style={{ fontFamily: 'Arial', fontSize: 10 }}><tbody>
                    <tr>
                      <td style={{ fontWeight: 'bold', paddingRight: 12 }}>Reference Number:</td>
                      <td><span style={{ fontFamily: 'Courier New', fontSize: 11, fontWeight: 'bold', color: '#000080' }}>{refNum}</span></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Submission Date:</td>
                      <td>{new Date().toLocaleDateString('en-US')}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Submission Time:</td>
                      <td>{new Date().toLocaleTimeString()}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Form Type:</td>
                      <td>DS-4421-B (Revised March 2004)</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Processing Fee:</td>
                      <td style={{ color: '#cc0000', fontWeight: 'bold' }}>$247.50 — CHARGED</td>
                    </tr>
                    {localStorage.getItem('cursed_manual_fee') === '8.95' && (
                      <>
                        <tr>
                          <td style={{ fontWeight: 'bold' }}>Manual Review Fee:</td>
                          <td style={{ color: '#cc0000', fontWeight: 'bold' }}>$8.95 — CHARGED (Bypass Security)</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 'bold' }}>Total Charged Fee:</td>
                          <td style={{ color: '#cc0000', fontWeight: 'bold' }}>$256.45 — CHARGED</td>
                        </tr>
                      </>
                    )}
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Estimated Processing:</td>
                      <td style={{ color: '#cc6600', fontWeight: 'bold' }}>6–18 months</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Status:</td>
                      <td><span style={{ color: '#cc6600' }}>⏳ Pending Initial Review</span></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>Regional Office:</td>
                      <td>Washington DC — Processing Center 7</td>
                    </tr>
                  </tbody></table>

                  <div className="warning-box" style={{ marginTop: 8 }}>
                    <div style={{ fontFamily: 'Arial', fontSize: 10, fontWeight: 'bold', marginBottom: 3 }}>⚠ IMPORTANT — Please Read:</div>
                    <div style={{ fontFamily: 'Arial', fontSize: 9 }}>
                      A confirmation has been sent to your registered email address. If you do not receive it within 3–5 business days, check your spam folder. Do NOT call the Help Desk to check on your application for at least 90 days. The status of your application will be communicated via U.S. mail to your address on file. Do not contact the regional office directly. All inquiries must go through the Help Desk.
                    </div>
                  </div>

                  <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080', marginTop: 8 }}>
                    <strong>Write down your reference number:</strong> <span style={{ fontFamily: 'Courier New' }}>{refNum}</span><br />
                    This number will NOT be emailed to you or displayed again after you leave this page.
                    <span className="blink" style={{ color: '#cc0000', fontWeight: 'bold' }}> Do not close this window until you have written it down.</span>
                  </div>
                </div>
              </div>

              <div className="panel-raised">
                <div className="section-title">Next Steps</div>
                <div style={{ padding: '4px 8px', fontFamily: 'Arial', fontSize: 10 }}>
                  <div style={{ marginBottom: 4 }}>1. Write down reference number <strong>{refNum}</strong></div>
                  <div style={{ marginBottom: 4 }}>2. Pay $247.50 processing fee (already charged)</div>
                  <div style={{ marginBottom: 4 }}>3. Mail notarized copies of all supporting documents to your regional office</div>
                  <div style={{ marginBottom: 4 }}>4. Wait 6-18 months for processing</div>
                  <div style={{ marginBottom: 4 }}>5. Do not call for at least 90 days</div>
                  <div style={{ marginBottom: 4 }}>6. Complete annual re-registration by March 15, 2004</div>
                  <div style={{ marginBottom: 4 }}>7. <span className="fake-link">Download and print Form DS-4421-B-RECEIPT</span> (TIF format, requires TIF viewer)</div>

                  <div className="hr-98" style={{ margin: '8px 0' }} />

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button className="btn-98 btn-wiggle" onClick={() => setShowPrint(true)}>🖨 Print Confirmation</button>
                    <button className="btn-98 btn-wiggle" onClick={() => {
                      localStorage.removeItem('cursed_manual_fee');
                      localStorage.removeItem('cursed_uncoupled');
                      navigate('/dashboard');
                    }}>Return to Dashboard</button>
                    <button className="btn-98 btn-wiggle" onClick={() => {
                      localStorage.removeItem('cursed_manual_fee');
                      localStorage.removeItem('cursed_uncoupled');
                      navigate('/form');
                    }} style={{ fontSize: 9 }}>
                      Submit Another Application
                    </button>
                    <button className="btn-98 btn-wiggle" onClick={() => { localStorage.clear(); navigate('/'); }} style={{ fontSize: 9 }}>
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            </td>

            <td width="40%">
              <div className="panel-raised" style={{ marginBottom: 6 }}>
                <div className="section-title">📋 What Happens Next</div>
                <div style={{ padding: '4px 8px', fontFamily: 'Arial', fontSize: 9 }}>
                  <div style={{ marginBottom: 4 }}>Your application will be:</div>
                  {[
                    ['Week 1-4', 'Initial receipt confirmation mailed'],
                    ['Week 4-8', 'Assigned to case officer'],
                    ['Week 8-16', 'Background check initiated'],
                    ['Week 16-32', 'Document verification'],
                    ['Week 32-52', 'Final review'],
                    ['Week 52+', 'Decision mailed (no email)'],
                  ].map(([t, a]) => (
                    <div key={t} style={{ display: 'flex', gap: 6, padding: '2px 0', borderBottom: '1px dotted #808080' }}>
                      <span style={{ minWidth: 70, color: '#808080' }}>{t}:</span>
                      <span>{a}</span>
                    </div>
                  ))}
                  <div style={{ color: '#cc0000', fontWeight: 'bold', marginTop: 4, fontSize: 9 }}>
                    ⚠ Timeline is an estimate only. Actual processing may take longer.
                  </div>
                </div>
              </div>

              <div className="panel-raised" style={{ marginBottom: 6 }}>
                <div className="section-title">💬 Satisfaction Survey</div>
                <div style={{ padding: '4px 8px', fontFamily: 'Arial', fontSize: 10 }}>
                  <div style={{ marginBottom: 4 }}>How was your experience today?</div>
                  {['Excellent', 'Good', 'Fair', 'Poor', 'I need therapy'].map(o => (
                    <div key={o}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10 }}>
                        <input type="radio" name="survey" value={o} /> {o}
                      </label>
                    </div>
                  ))}
                  <button className="btn-98 btn-wiggle" style={{ marginTop: 6, fontSize: 10 }}
                    onClick={() => alert('Thank you for your feedback. Your response has been recorded and will be reviewed in 2-3 years.')}>
                    Submit Survey
                  </button>
                </div>
              </div>

              <div className="panel-raised">
                <div className="section-title">🔒 Security Reminder</div>
                <div style={{ padding: '4px 8px', fontFamily: 'Arial', fontSize: 9, color: '#808080' }}>
                  <div className="blink" style={{ color: '#cc0000', fontWeight: 'bold', marginBottom: 4 }}>
                    ⚠ CLEAR YOUR BROWSER CACHE NOW
                  </div>
                  <div>Your session contained sensitive government data. Please:</div>
                  <div>• Clear browser history</div>
                  <div>• Delete all cookies</div>
                  <div>• Close all browser windows</div>
                  <div>• Restart your computer</div>
                  <div>• Run a full virus scan</div>
                  <div style={{ marginTop: 4 }}>
                    <span className="fake-link">How to clear IE6 cache</span>
                  </div>
                </div>
              </div>
            </td>
          </tr></tbody></table>
        </>
      )}
    </CursedLayout>
  );
}
