import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CursedLayout from '../components/CursedLayout';
import CursedCaptcha from '../components/CursedCaptcha';
import ConfirmDialog from '../components/ConfirmDialog';

export default function VerificationPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('cursed_user') || '{}');
  const [verifyStep, setVerifyStep] = useState(1); // 1=email, 2=phone, 3=security questions, 4=file upload
  const [progress, setProgress] = useState(10);
  const [captchaDone, setCaptchaDone] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [shake, setShake] = useState(false);
  const [errors, setErrors] = useState({});
  const [fakeLoading, setFakeLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState('');

  // Step fields
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [secAnswers, setSecAnswers] = useState({ q1: '', q2: '', q3: '' });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState('');

  // Clipboard prevention modal states
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteAttempts, setPasteAttempts] = useState(0);

  // Animated progress that occasionally goes backward
  useEffect(() => {
    const target = verifyStep === 1 ? 25 : verifyStep === 2 ? 50 : verifyStep === 3 ? 75 : 90;
    const t = setInterval(() => {
      setProgress(p => {
        const goBack = Math.random() < 0.15;
        if (goBack) return Math.max(0, p - Math.floor(Math.random() * 8));
        if (p >= target) return target;
        return p + Math.floor(Math.random() * 4) + 1;
      });
    }, 400);
    return () => clearInterval(t);
  }, [verifyStep]);

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 600); };

  const handlePasteInfraction = (e) => {
    e.preventDefault();
    setPasteAttempts(a => a + 1);
    setShowPasteModal(true);
    triggerShake();
  };

  const fakeLoadThen = (msg, cb) => {
    setFakeLoading(true);
    setLoadMsg(msg);
    setTimeout(() => { setFakeLoading(false); cb(); }, 2500 + Math.random() * 1500);
  };

  const handleEmailVerify = () => {
    if (!captchaDone) { setErrors({ captcha: 'CAPTCHA required.' }); triggerShake(); return; }
    if (!emailCode.trim()) { setErrors({ emailCode: 'Please enter the verification code.' }); triggerShake(); return; }
    
    // Strict email code length validation
    if (emailCode.trim().length !== 47) {
      setErrors({ emailCode: 'Verification code must be exactly 47 characters long (including dashes).' });
      triggerShake();
      return;
    }

    setConfirm({
      msg: 'Are you sure this is the correct email verification code? Entering an incorrect code 3 times will lock your account for 72 hours.',
      onConfirm: () => {
        setConfirm(null);
        fakeLoadThen('Verifying email code with secure server...', () => {
          setCaptchaDone(false); setErrors({}); setVerifyStep(2);
        });
      }
    });
  };

  const handlePhoneVerify = () => {
    if (!phoneCode.trim()) { setErrors({ phoneCode: 'Phone code required.' }); triggerShake(); return; }
    if (phoneCode.trim().length !== 6) {
      setErrors({ phoneCode: 'Phone code must be exactly 6 digits.' });
      triggerShake();
      return;
    }

    setConfirm({
      msg: 'Confirm: You are submitting your phone verification code. This will be logged.',
      onConfirm: () => {
        setConfirm(null);
        fakeLoadThen('Contacting SMS verification gateway...', () => {
          setErrors({}); setVerifyStep(3);
        });
      }
    });
  };

  const handleSecurityVerify = () => {
    if (!secAnswers.q1 || !secAnswers.q2 || !secAnswers.q3) {
      setErrors({ sec: 'All security questions are required.' }); triggerShake(); return;
    }
    setConfirm({
      msg: 'Are you sure your security answers are correct? Incorrect answers will require you to restart the verification process from Step 1.',
      onConfirm: () => {
        setConfirm(null);
        fakeLoadThen('Cross-referencing answers with federal identity database...', () => {
          setErrors({}); setVerifyStep(4);
        });
      }
    });
  };

  const handleFileUpload = () => {
    if (!uploadFile) { setUploadError('You must upload a file to proceed.'); triggerShake(); return; }
    const name = uploadFile.name.toLowerCase();
    const allowed = ['.tif', '.tiff', '.bmp'];
    if (!allowed.some(ext => name.endsWith(ext))) {
      setUploadError(`File format "${uploadFile.name.split('.').pop().toUpperCase()}" is not accepted. Only .TIF, .TIFF, and .BMP files are allowed. Please rescan your document using a compatible scanner.`);
      setUploadFile(null);
      triggerShake();
      return;
    }
    setConfirm({
      msg: 'You are about to submit your identity document to a federal government server. This file will be retained permanently. Are you sure?',
      onConfirm: () => {
        setConfirm(null);
        fakeLoadThen('Uploading document to secure federal archive... encrypting... validating...', () => {
          localStorage.setItem('cursed_verified', '1');
          navigate('/dashboard');
        });
      }
    });
  };

  const STEP_LABELS = ['Email', 'Phone', 'Security Qs', 'Document'];

  return (
    <CursedLayout>
      {confirm && (
        <ConfirmDialog message={confirm.msg} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />
      )}

      {/* Clipboard access security infraction alert */}
      {showPasteModal && (
        <div className="modal-backdrop" style={{ zIndex: 9600 }}>
          <div className="win98-window shake" style={{ width: 420 }}>
            <div className="titlebar" style={{ background: '#cc0000' }}>
              <span>❌ Federal Security Infraction Alert</span>
              <span className="titlebar-btn" onClick={() => setShowPasteModal(false)}>✕</span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 32 }}>🚫</span>
                <div style={{ fontFamily: 'Arial', fontSize: 11, fontWeight: 'bold', color: '#cc0000' }}>
                  CLIPBOARD ACCESS DENIED (18 U.S.C. § 1028a)
                </div>
              </div>
              <div style={{ fontFamily: 'Arial', fontSize: 10, marginBottom: 8 }}>
                Under the <strong>Federal Copy-Paste Prevention Security Act of 2004</strong>, secure government authentication tokens must be typed manually using a physical hardware keyboard.
                <br /><br />
                Direct clipboard access/copy-pasting is strictly prohibited to prevent automated buffer exploits.
                <br /><br />
                <span style={{ color: '#cc0000', fontWeight: 'bold' }}>
                  Security infractions logged against your citizen record today: {pasteAttempts}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="btn-98 btn-wiggle" onClick={() => setShowPasteModal(false)} style={{ minWidth: 120 }}>
                  I Will Type Manually
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {fakeLoading && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 8500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="win98-window" style={{ width: 360 }}>
            <div className="titlebar"><span>Please Wait...</span></div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontFamily: 'Arial', fontSize: 11, marginBottom: 8 }}>{loadMsg}</div>
              <div className="progress-bar-outer" style={{ marginBottom: 4 }}>
                <div className="progress-bar-inner" style={{ width: `${progress}%` }} />
              </div>
              <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080' }}>
                <span className="blink">Please do not close this window or click Back...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="page-title">Multi-Factor Identity Verification</div>
      <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080', marginBottom: 8 }}>
        Home &gt; Login &gt; Verification | Step {verifyStep} of 4 | Logged in as: <strong>{user.username || 'UNKNOWN'}</strong>
      </div>

      {/* Progress bar with step labels */}
      <div className="panel-raised" style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontFamily: 'Arial', fontSize: 9 }}>
          {STEP_LABELS.map((l, i) => (
            <span key={l} style={{ color: i + 1 === verifyStep ? '#000080' : i + 1 < verifyStep ? '#006600' : '#808080', fontWeight: i + 1 === verifyStep ? 'bold' : 'normal' }}>
              {i + 1 < verifyStep ? '✓' : i + 1 === verifyStep ? '▶' : '○'} {l}
            </span>
          ))}
        </div>
        <div className="progress-bar-outer">
          <div className="progress-bar-inner" style={{ width: `${progress}%` }}>
            <span style={{ fontSize: 9 }}>{progress}%</span>
          </div>
        </div>
        <div style={{ fontFamily: 'Arial', fontSize: 8, color: '#808080', marginTop: 2 }}>
          Note: Progress may fluctuate due to server load. This is normal.
        </div>
      </div>

      <table width="100%" cellPadding="0" cellSpacing="4"><tbody><tr valign="top">
        <td width="65%">
          <div className={`panel-raised ${shake ? 'shake' : ''}`}>
            {verifyStep === 1 && (
              <>
                <div className="section-title">Step 1 of 4: Email Verification</div>
                <div style={{ fontFamily: 'Arial', fontSize: 10, padding: '6px 4px' }}>
                  <div style={{ marginBottom: 6 }}>
                    A verification code has been sent to your registered email address.
                    <strong> This may take 3–5 business days</strong> to arrive due to federal mail security screening.
                    Please check your spam folder. If you did not receive the code, wait 72 hours before requesting a new one.
                  </div>
                  <div style={{ marginBottom: 4 }}>
                    <label style={{ fontFamily: 'Arial', fontSize: 10, display: 'block', marginBottom: 2 }}>
                      Email Verification Code: <span className="required-star">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={emailCode} 
                      onChange={e => setEmailCode(e.target.value)}
                      onPaste={handlePasteInfraction}
                      placeholder="Enter 47-character code" 
                      style={{ width: 280 }} 
                      maxLength={47} 
                    />
                    {errors.emailCode && <div className="error-msg">{errors.emailCode}</div>}
                    <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080', marginTop: 2 }}>
                      Code format: XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX (47 chars including dashes)
                    </div>
                  </div>

                  {!captchaDone
                    ? <CursedCaptcha onVerify={() => setCaptchaDone(true)} label="Anti-Bot Verification (Step 1)" />
                    : <div className="success-msg" style={{ margin: '4px 0' }}>✓ CAPTCHA verified.</div>
                  }
                  {errors.captcha && <div className="error-msg">{errors.captcha}</div>}

                  <div className="hr-98" style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-98 btn-wiggle" onClick={handleEmailVerify} style={{ background: '#000080', color: '#fff', fontWeight: 'bold' }}>
                      Verify Email Code →
                    </button>
                    <button className="btn-98 btn-wiggle" onClick={() => alert('A new code will be sent within 3-5 business days.')}>
                      Resend Code
                    </button>
                  </div>
                </div>
              </>
            )}

            {verifyStep === 2 && (
              <>
                <div className="section-title">Step 2 of 4: Phone Verification</div>
                <div style={{ fontFamily: 'Arial', fontSize: 10, padding: '6px 4px' }}>
                  <div style={{ marginBottom: 6 }}>
                    A 6-digit SMS code has been sent to your registered phone number ending in <strong>****</strong>.
                    Standard message and data rates may apply. The code expires in 30 seconds.
                  </div>
                  <div style={{ marginBottom: 6 }}>
                    <label style={{ display: 'block', marginBottom: 2 }}>SMS Verification Code:</label>
                    <input 
                      type="text" 
                      value={phoneCode} 
                      onChange={e => setPhoneCode(e.target.value)}
                      onPaste={handlePasteInfraction}
                      placeholder="6-digit code" 
                      style={{ width: 120 }} 
                      maxLength={6} 
                    />
                    {errors.phoneCode && <div className="error-msg">{errors.phoneCode}</div>}
                  </div>
                  <div className="warning-box" style={{ marginBottom: 8 }}>
                    ⚠ Did not receive the code? Please ensure your phone is on, has signal, is not on Do Not Disturb mode,
                    and that you have not blocked SMS from short code 55555. If problems persist, call 1-800-555-0199.
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn-98 btn-wiggle" onClick={handlePhoneVerify} style={{ background: '#000080', color: '#fff', fontWeight: 'bold' }}>
                      Verify Phone Code →
                    </button>
                    <button className="btn-98 btn-wiggle" onClick={() => alert('Code resent. Please wait 30 seconds.')}>Resend</button>
                  </div>
                </div>
              </>
            )}

            {verifyStep === 3 && (
              <>
                <div className="section-title">Step 3 of 4: Security Questions</div>
                <div style={{ fontFamily: 'Arial', fontSize: 10, padding: '6px 4px' }}>
                  <div style={{ marginBottom: 8, color: '#cc0000', fontWeight: 'bold' }}>
                    ⚠ Answers are case-sensitive. Incorrect answers restart verification from Step 1.
                  </div>
                  <div style={{ background: '#ffffe0', border: '1px solid #c0c000', padding: '4px 8px', marginBottom: 8, fontSize: 9 }}>
                    🔒 <strong>ANTI-SHOULDER-SURFING PROTECTIVE SHIELD ACTIVE:</strong><br />
                    For physical environment visual sniffing security, input answers are fully masked. Keystrokes are captured correctly but rendered as bullet characters.
                  </div>
                  {[
                    { key: 'q1', q: 'What was the name of your first elementary school? (Include full official name as it appeared on birth certificate records)' },
                    { key: 'q2', q: 'What is the middle name of your paternal grandmother\'s oldest sibling?' },
                    { key: 'q3', q: 'What was the street address of the house where you lived when you were 7 years old? (Include apartment number if applicable)' },
                  ].map(({ key, q }) => (
                    <div key={key} style={{ marginBottom: 8 }}>
                      <label style={{ display: 'block', marginBottom: 2, fontWeight: 'bold' }}>{q}</label>
                      <input 
                        type="password" 
                        value={secAnswers[key]}
                        onChange={e => setSecAnswers(s => ({ ...s, [key]: e.target.value }))}
                        onPaste={handlePasteInfraction}
                        style={{ width: '100%' }} 
                        autoComplete="off" 
                      />
                    </div>
                  ))}
                  {errors.sec && <div className="error-msg">{errors.sec}</div>}
                  <div className="hr-98" style={{ margin: '8px 0' }} />
                  <button className="btn-98 btn-wiggle" onClick={handleSecurityVerify} style={{ background: '#000080', color: '#fff', fontWeight: 'bold' }}>
                    Submit Answers →
                  </button>
                </div>
              </>
            )}

            {verifyStep === 4 && (
              <>
                <div className="section-title">Step 4 of 4: Document Upload</div>
                <div style={{ fontFamily: 'Arial', fontSize: 10, padding: '6px 4px' }}>
                  <div style={{ marginBottom: 6 }}>
                    Please upload a scanned copy of a government-issued photo ID to complete verification.
                    <strong> Document must be notarized</strong> and submitted as a <strong>.TIF or .BMP file only.</strong>
                  </div>
                  <div className="warning-box" style={{ marginBottom: 8 }}>
                    <strong>Accepted Formats:</strong> .TIF, .TIFF, .BMP only<br />
                    <strong>NOT Accepted:</strong> .JPG, .PNG, .PDF, .GIF, .DOC, .DOCX, .XLS, .ZIP, or any other format<br />
                    <strong>Max File Size:</strong> 47 KB<br />
                    <strong>Minimum Resolution:</strong> 300 DPI<br />
                    <strong>Color Mode:</strong> Grayscale only (not color, not black & white)
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <input type="file" accept=".tif,.tiff,.bmp"
                      onChange={e => { setUploadFile(e.target.files[0] || null); setUploadError(''); }}
                      style={{ fontFamily: 'Arial', fontSize: 10 }} />
                    {uploadFile && <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#006600', marginTop: 2 }}>
                      Selected: {uploadFile.name} ({(uploadFile.size / 1024).toFixed(1)} KB)
                    </div>}
                    {uploadError && <div className="error-msg" style={{ marginTop: 4 }}>{uploadError}</div>}
                  </div>
                  <div className="hr-98" style={{ margin: '8px 0' }} />
                  <button className="btn-98 btn-wiggle" onClick={handleFileUpload} style={{ background: '#000080', color: '#fff', fontWeight: 'bold' }}>
                    Upload &amp; Complete Verification →
                  </button>
                </div>
              </>
            )}
          </div>
        </td>

        <td width="35%">
          <div className="panel-raised" style={{ marginBottom: 6 }}>
            <div className="section-title">Verification Requirements</div>
            <div style={{ fontFamily: 'Arial', fontSize: 9, padding: '2px 4px' }}>
              <div style={{ marginBottom: 3, fontWeight: 'bold' }}>All 4 steps must be completed:</div>
              {['Email Code (47 chars)', 'Phone SMS Code', 'Security Questions (3)', 'Document Upload (.TIF/.BMP)'].map((s, i) => (
                <div key={s} style={{ padding: '2px 0', color: i + 1 < verifyStep ? '#006600' : i + 1 === verifyStep ? '#000080' : '#808080' }}>
                  {i + 1 < verifyStep ? '✓' : i + 1 === verifyStep ? '▶' : '○'} Step {i + 1}: {s}
                </div>
              ))}
              <hr className="hr-98" />
              <div style={{ color: '#cc0000', fontSize: 8, fontStyle: 'italic' }}>
                Verification expires after 10 minutes of inactivity. If it expires, you must restart from Step 1.
              </div>
            </div>
          </div>
          <div className="panel-raised">
            <div className="section-title">Having Trouble?</div>
            <div style={{ fontFamily: 'Arial', fontSize: 9, padding: '2px 4px' }}>
              <span className="fake-link" onClick={() => window.dispatchEvent(new CustomEvent('cursed-link', { detail: "I didn't receive my email code" }))}>I didn't receive my email code</span><br />
              <span className="fake-link" onClick={() => window.dispatchEvent(new CustomEvent('cursed-link', { detail: "I don't remember my security answers" }))}>I don't remember my security answers</span><br />
              <span className="fake-link" onClick={() => window.dispatchEvent(new CustomEvent('cursed-link', { detail: "My scanner doesn't produce .TIF files" }))}>My scanner doesn't produce .TIF files</span><br />
              <span className="fake-link" onClick={() => window.dispatchEvent(new CustomEvent('cursed-link', { detail: "Request in-person verification appointment" }))}>Request in-person verification appointment</span><br />
              <hr className="hr-98" />
              <div>Help Desk: 1-800-555-0199</div>
              <div style={{ color: '#cc0000' }}>Wait: ~4 hrs 37 min</div>
            </div>
          </div>
        </td>
      </tr></tbody></table>
    </CursedLayout>
  );
}
