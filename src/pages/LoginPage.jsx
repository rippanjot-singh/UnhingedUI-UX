import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CursedLayout from '../components/CursedLayout';
import CursedCaptcha from '../components/CursedCaptcha';
import ConfirmDialog from '../components/ConfirmDialog';

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState('login');
  const [countdown, setCountdown] = useState(5);
  const [captchaDone, setCaptchaDone] = useState(false);
  const [shakeForm, setShakeForm] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loginData, setLoginData] = useState({ username: '', password: '', remember: false });
  const [regData, setRegData] = useState({
    firstName: '', lastName: '', ssn: '', dob: '',
    email: '', phone: '', username: '', password: '', password2: '',
    motherMaiden: '', cityBorn: '', petName: '', agree: false,
  });

  // Keyboard switches dust timer
  const [dustTimer, setDustTimer] = useState(0);

  // Diplomat Queue modal state
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [queuePosition, setQueuePosition] = useState(9);
  const [queueHistory, setQueueHistory] = useState([]);

  // Swapping buttons state
  const [buttonsSwapped, setButtonsSwapped] = useState(false);

  // Federal Virtual Input Matrix states
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const numbers = '0123456789'.split('');
  const symbols = '!@#$'.split('');
  const [keys, setKeys] = useState(() => [...letters, ...numbers, ...symbols]);
  const [isCaps, setIsCaps] = useState(false);
  const [focusedField, setFocusedField] = useState('username');

  const shuffleKeys = () => {
    setKeys(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  // Redirection pipeline pump states
  const [showRouterPumpModal, setShowRouterPumpModal] = useState(false);
  const [pumpProgress, setPumpProgress] = useState(30);

  const handlePumpClick = (e) => {
    e.preventDefault();
    setPumpProgress(p => Math.min(100, p + 6));
  };

  // Fake 404 countdown
  useEffect(() => {
    if (step !== 0) return;
    if (countdown <= 0) { setStep(1); return; }
    const t = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [step, countdown]);

  // dusty compressed air countdown
  useEffect(() => {
    if (dustTimer <= 0) return;
    const t = setInterval(() => setDustTimer(d => d - 1), 1000);
    return () => clearInterval(t);
  }, [dustTimer]);

  // Pipeline pressure decay effect
  useEffect(() => {
    if (!showRouterPumpModal) return;
    const interval = setInterval(() => {
      setPumpProgress(p => {
        if (p <= 0) return 0;
        return Math.max(0, p - 3); // decay by 3% every 500ms
      });
    }, 500);
    return () => clearInterval(interval);
  }, [showRouterPumpModal]);

  // Complete pump redirection check
  useEffect(() => {
    if (!showRouterPumpModal) return;
    if (pumpProgress >= 100) {
      setShowRouterPumpModal(false);
      navigate('/verify');
    }
  }, [pumpProgress, showRouterPumpModal, navigate]);

  // Diplomat access session queue logic
  useEffect(() => {
    if (!showQueueModal) return;
    if (queuePosition <= 0) {
      setShowQueueModal(false);
      const savedUser = JSON.parse(localStorage.getItem('cursed_user') || '{}');
      const finalUsername = savedUser.username || loginData.username || 'admin';
      localStorage.setItem('cursed_user', JSON.stringify({ 
        username: finalUsername, 
        password: savedUser.password || 'Password123!',
        loginTime: Date.now() 
      }));
      setShowRouterPumpModal(true);
      setPumpProgress(30);
      return;
    }

    const intervalTime = 1200 + Math.random() * 800;
    const t = setTimeout(() => {
      if (Math.random() < 0.16 && queuePosition < 9) {
        const diplomats = ['Senator Jenkins', 'Ambassador Vance', 'Director of Postal Operations', 'Sec. of Citizenship', 'Bureaucracy Bot 2000'];
        const dip = diplomats[Math.floor(Math.random() * diplomats.length)];
        setQueuePosition(p => p + 1);
        setQueueHistory(h => [...h, `⚠️ PRIORITY BYPASS: ${dip} accessed portal. Queue reset to position ${queuePosition + 1}.`]);
      } else {
        setQueuePosition(p => p - 1);
        setQueueHistory(h => [...h, `> Citizen advanced in queue. Current position: ${queuePosition - 1}`]);
      }
    }, intervalTime);

    return () => clearTimeout(t);
  }, [showQueueModal, queuePosition]);

  const triggerShake = () => {
    setShakeForm(true);
    setTimeout(() => setShakeForm(false), 600);
  };

  const handleDustyInput = (prevVal, newVal, setter, isVirtual = false) => {
    if (newVal.length < prevVal.length) {
      if (Math.random() < 0.33) {
        setter('');
        alert('⚠️ DATA CORRUPTION ALERT: Government keystroke input experienced state loss. Session input buffer flushed.');
        return;
      }
    }

    if (newVal.length > prevVal.length) {
      // Direct typing error injection (50% chance of garbage character)
      if (!isVirtual && Math.random() < 0.50) {
        const garbageChars = '☠#@$&%?+=*^';
        const garbage = garbageChars[Math.floor(Math.random() * garbageChars.length)];
        newVal = newVal.slice(0, -1) + garbage;
        alert('⚠️ KEYSTROKE ENCRYPTION FAILURE: Physical input security check failed. Character corrupted. Please use the Approved Virtual Keyboard Matrix below.');
      }

      if (dustTimer === 0) {
        const addedChar = newVal[newVal.length - 1];
        if (Math.random() < 0.22 && addedChar !== ' ') {
          setter(newVal + addedChar);
          shuffleKeys();
          return;
        }
      }
    }

    setter(newVal);
    shuffleKeys();
  };

  const handleVirtualKeyClick = (key) => {
    const char = /[a-zA-Z]/.test(key) ? (isCaps ? key.toUpperCase() : key.toLowerCase()) : key;
    if (focusedField === 'username') {
      const prevVal = loginData.username;
      const newVal = prevVal + char;
      handleDustyInput(prevVal, newVal, val => setLoginData(d => ({ ...d, username: val })), true);
    } else if (focusedField === 'password') {
      const prevVal = loginData.password;
      const newVal = prevVal + char;
      handleDustyInput(prevVal, newVal, val => setLoginData(d => ({ ...d, password: val })), true);
    }
    shuffleKeys();
  };

  const blowAir = () => {
    setDustTimer(30);
  };

  const handleCancelHover = () => {
    setButtonsSwapped(prev => !prev);
  };

  const getPasswordRulesStatus = (pass) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return {
      length: pass.length >= 14,
      uppercase: (pass.match(/[A-Z]/g) || []).length >= 3,
      special: (pass.match(/[^A-Za-z0-9]/g) || []).length >= 2,
      prime: /[2357]/.test(pass),
      day: pass.toLowerCase().includes(today.toLowerCase()),
      roman: /[IVXLCDM]/.test(pass),
      chemical: /(He|Au|Na)/.test(pass),
    };
  };

  const handleLogin = () => {
    const errs = {};
    if (!loginData.username) errs.username = 'This field is required.';
    if (!loginData.password) errs.password = 'This field is required.';
    if (!captchaDone) errs.captcha = 'You must complete CAPTCHA verification.';
    if (Object.keys(errs).length > 0) { setErrors(errs); triggerShake(); return; }

    // Seed default credentials if none exist
    if (!localStorage.getItem('cursed_user')) {
      localStorage.setItem('cursed_user', JSON.stringify({ username: 'admin', password: 'Password123!', loginTime: Date.now() }));
    }

    const savedUser = JSON.parse(localStorage.getItem('cursed_user') || '{}');
    const enteredPassReversed = loginData.password.split('').reverse().join('');

    if (loginData.username !== savedUser.username) {
      errs.username = 'User ID not registered in session state.';
      setErrors(errs);
      triggerShake();
      return;
    }

    // Verify reversed password matching registered or seeded password!
    if (enteredPassReversed !== savedUser.password) {
      errs.password = `Security credentials mismatch. Ensure reversed sequence entry (Homeland Directive DHS-4).`;
      setErrors(errs);
      triggerShake();
      return;
    }
    
    setConfirm({
      msg: `You are about to log in as "${loginData.username}". Proceeding will initiate a secure government session and you will be held legally responsible for all actions taken under this account. Are you sure?`,
      onConfirm: () => {
        setConfirm(null);
        setShowQueueModal(true);
        setQueuePosition(9);
        setQueueHistory(['> Initializing secure session handshake...', '> Accessing GOVWEB-04 server...', '> Checking current connection load...']);
      }
    });
  };

  const handleRegister = () => {
    const errs = {};
    if (!regData.firstName) errs.firstName = 'Required.';
    if (!regData.lastName) errs.lastName = 'Required.';
    if (!regData.ssn) errs.ssn = 'SSN required for identity verification.';
    if (!regData.email) errs.email = 'Required.';
    if (!regData.username) errs.username = 'Required.';
    
    const passRules = getPasswordRulesStatus(regData.password || '');
    const allPassRulesPassed = Object.values(passRules).every(Boolean);
    if (!regData.password) {
      errs.password = 'Required.';
    } else if (!allPassRulesPassed) {
      errs.password = 'Password fails to meet the Security Matrix criteria listed below.';
    }

    if (regData.password !== regData.password2) {
      errs.password2 = 'Passwords do not match.';
    }

    if (!regData.agree) errs.agree = 'You must read and agree to all 87 pages of Terms & Conditions.';
    if (!captchaDone) errs.captcha = 'CAPTCHA verification required.';
    
    if (Object.keys(errs).length > 0) { setErrors(errs); triggerShake(); return; }
    
    setConfirm({
      msg: 'By registering, you consent to data sharing with 14 federal agencies, 50 state governments, and approved third-party contractors. This cannot be undone. Are you absolutely sure?',
      onConfirm: () => {
        setConfirm(null);
        // Save the valid credentials!
        localStorage.setItem('cursed_user', JSON.stringify({ 
          username: regData.username, 
          password: regData.password, 
          loginTime: Date.now() 
        }));
        // Direct queue to verify transition
        setShowQueueModal(true);
        setQueuePosition(9);
        setQueueHistory([
          '> Initializing secure registration handshake...', 
          '> Committing citizen registration payload...', 
          '> Committing data to federal session vault...', 
          '> COMMITTED. Placing session in the traffic queue...'
        ]);
      }
    });
  };

  const passRules = getPasswordRulesStatus(regData.password || '');

  if (step === 0) {
    return (
      <div style={{ minWidth: 1024, minHeight: '100vh', background: '#c0c0c0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="win98-window" style={{ width: 500 }}>
          <div className="titlebar" style={{ background: '#cc0000' }}>
            <span>❌ Internet Explorer — Page Not Found</span>
            <div><span className="titlebar-btn">_</span><span className="titlebar-btn">□</span><span className="titlebar-btn">✕</span></div>
          </div>
          <div style={{ padding: '20px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 8 }}>🚫</div>
            <div style={{ fontFamily: 'Times New Roman', fontSize: 22, fontWeight: 'bold', color: '#cc0000', marginBottom: 8 }}>404 — Page Not Found</div>
            <div style={{ fontFamily: 'Arial', fontSize: 11, marginBottom: 10 }}>
              The page you are looking for does not exist, has been moved, or is temporarily unavailable.
            </div>
            <div className="panel-inset" style={{ marginBottom: 12, textAlign: 'left' }}>
              <div style={{ fontFamily: 'Courier New', fontSize: 10 }}>
                HTTP Error 404.0 - Not Found<br />
                Requested URL: /services/en/citizen/login.asp<br />
                Physical Path: C:\\inetpub\\wwwroot\\govportal\\login.asp<br />
                Error Code: 0x80070002
              </div>
            </div>
            <div style={{ fontFamily: 'Arial', fontSize: 11, color: '#006600', fontWeight: 'bold' }}>
              Redirecting in{' '}<span className="blink" style={{ fontSize: 18, color: '#cc0000' }}>{countdown}</span>{' '}second{countdown !== 1 ? 's' : ''}...
            </div>
            <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080', marginTop: 6 }}>
              <span className="fake-link" onClick={() => setStep(1)}>Click here</span> if you are not redirected automatically.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CursedLayout>
      {confirm && (
        <ConfirmDialog
          message={confirm.msg}
          onConfirm={() => { setConfirm(null); confirm.onConfirm(); }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Access session queue modal */}
      {showQueueModal && (
        <div className="modal-backdrop" style={{ zIndex: 9500 }}>
          <div className="win98-window" style={{ width: 380 }}>
            <div className="titlebar"><span>⏳ Session Access Queue (GOVWEB-04)</span></div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontFamily: 'Arial', fontSize: 11, marginBottom: 10, fontWeight: 'bold' }}>
                You are placed in the queue to access the secure citizen terminal.
              </div>
              <div className="panel-raised" style={{ padding: 6, marginBottom: 8, background: '#ffffd0', border: '1px solid #808080' }}>
                <span className="blink" style={{ color: '#cc0000', fontWeight: 'bold' }}>⏰ POSITION: {queuePosition}</span> | Estimated Wait Time: {queuePosition * 3} seconds
              </div>
              <div style={{ fontFamily: 'Courier New', fontSize: 9, background: '#000', color: '#00ff00', height: 100, overflowY: 'auto', padding: 6, borderRadius: 2 }}>
                {queueHistory.map((h, i) => <div key={i}>{h}</div>)}
                <div className="blink">&gt; Waiting...</div>
              </div>
              <div style={{ fontFamily: 'Arial', fontSize: 8, color: '#808080', marginTop: 6, lineHeight: 1.1 }}>
                *Due to massive government network load, priority diplomats and senator staff sessions take precedence. Do not refresh.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Redirection Router Pipeline Pump Modal */}
      {showRouterPumpModal && (
        <div className="modal-backdrop" style={{ zIndex: 9600 }}>
          <div className="win98-window" style={{ width: 400 }}>
            <div className="titlebar"><span>⚡ GOV-ROUTE-04 Redirection Router (Stuck)</span></div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontFamily: 'Arial', fontSize: 11, marginBottom: 8, fontWeight: 'bold' }}>
                ⚠️ ROUTER PIPELINE SATURATION DETECTED
              </div>
              <div style={{ fontFamily: 'Arial', fontSize: 10, marginBottom: 10, lineHeight: 1.25 }}>
                Your citizen credentials have been validated, but the main redirection pipe is clogged under high Senator traffic load.
                Please **manually compress and pump** the data pipeline to push your session handshake through!
              </div>

              {/* Progress bar */}
              <div style={{ border: '2px inset #808080', background: '#d0d0d0', height: 20, position: 'relative', margin: '8px 0' }}>
                <div style={{
                  background: '#000080',
                  height: '100%',
                  width: `${pumpProgress}%`,
                  transition: 'width 0.1s ease-out'
                }} />
                <span style={{ position: 'absolute', top: 3, left: 0, width: '100%', textAlign: 'center', fontSize: 9, color: pumpProgress > 50 ? '#fff' : '#000', fontFamily: 'Arial', fontWeight: 'bold' }}>
                  HANDSHAKE PRESSURIZATION: {Math.floor(pumpProgress)}% (Requires 100%)
                </span>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
                <button 
                  className="btn-98 btn-wiggle" 
                  onClick={handlePumpClick}
                  style={{
                    background: '#000080',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '8px 12px',
                    flex: 1,
                    fontSize: 11,
                    cursor: 'pointer'
                  }}
                >
                  💨 PUMP DATA PIPELINE (MASH CLICK)
                </button>
              </div>

              <div style={{ fontFamily: 'Courier New', fontSize: 8, background: '#000', color: '#00ff00', height: 60, overflowY: 'auto', padding: 6, marginTop: 10, borderRadius: 2 }}>
                <div>&gt; REDIRECT STATUS: PIPELINE SATURATED</div>
                <div>&gt; CURRENT PRESSURE: {pumpProgress.toFixed(1)} psi</div>
                {pumpProgress > 80 && <div className="blink">&gt; WARNING: Pipeline high pressure bypass active...</div>}
                <div>&gt; Waiting for manual pump compression...</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="page-title">Secure Citizen Login Portal</div>
      <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080', marginBottom: 6 }}>
        Home &gt; Login | All access attempts are logged per 18 U.S.C. § 1030.
      </div>

      {/* dusty terminal switch banner */}
      {dustTimer > 0 ? (
        <div style={{ background: '#e8ffe8', border: '1px solid #00aa00', padding: '3px 8px', fontSize: 9, fontFamily: 'Arial', marginBottom: 4 }}>
          ✓ Virtual terminal switches cleared! Compressed air active for <strong>{dustTimer}s</strong>. Double-typing suspended.
        </div>
      ) : (
        <div style={{ background: '#ffd0d0', border: '2px solid #cc0000', padding: '3px 8px', fontSize: 9, fontFamily: 'Arial', marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚠️ <strong>TERMINAL SWITCH DUST DETECTED:</strong> Keystrokes may repeat. Blow compressed air to clear.</span>
          <button className="btn-98 btn-wiggle" onClick={blowAir} style={{ fontSize: 8, padding: '1px 5px', minWidth: 'unset', background: '#ffcc00' }}>💨 Blow Compressed Air</button>
        </div>
      )}

      <table width="100%" cellPadding="0" cellSpacing="4"><tbody><tr valign="top">
        <td width="62%">
          <div style={{ display: 'flex', marginBottom: -1, position: 'relative', zIndex: 1 }}>
            {['login', 'register'].map(t => (
              <div key={t} onClick={() => { setTab(t); setErrors({}); setCaptchaDone(false); }}
                style={{
                  padding: '3px 14px', fontFamily: 'Arial', fontSize: 11, cursor: 'pointer',
                  background: tab === t ? '#c0c0c0' : '#a0a0a0',
                  borderTop: tab === t ? '2px solid #fff' : '1px solid #808080',
                  borderLeft: tab === t ? '2px solid #fff' : '1px solid #808080',
                  borderRight: tab === t ? '2px solid #808080' : '1px solid #808080',
                  borderBottom: tab === t ? '2px solid #c0c0c0' : '2px solid #808080',
                  fontWeight: tab === t ? 'bold' : 'normal',
                }}>
                {t === 'login' ? '🔐 Login' : '📝 Register New Account'}
              </div>
            ))}
          </div>
          <div className={shakeForm ? 'shake' : ''} style={{ background: '#c0c0c0', borderTop: '2px solid #fff', borderLeft: '2px solid #fff', borderRight: '2px solid #808080', borderBottom: '2px solid #808080', padding: '10px 12px' }}>
            {tab === 'login' ? (
              <>
                <div className="warning-box" style={{ marginBottom: 8 }}>
                  ⚠ <strong>Security Notice:</strong> This is a U.S. Government computer system. Unauthorized use is a criminal offense under 18 U.S.C. § 1030.
                </div>

                <div className="warning-box" style={{ marginBottom: 8, background: '#ffffd0', border: '1px solid #ccaa00' }}>
                  🔐 <strong>DHS-4 Reverse Password Mandate:</strong> To prevent keyboard-logger sniffing, passwords must be entered in <strong>reverse order</strong> (e.g. if password is `123`, type `321`).
                  <br />
                  <span style={{ fontSize: 9, color: '#666' }}>
                    *Default credentials: Username <strong>admin</strong> | Password <strong>Password123!</strong> (Type: <strong>!321drowssaP</strong>)
                  </span>
                </div>

                <table cellPadding="3"><tbody>
                  <tr>
                    <td style={{ fontFamily: 'Arial', fontSize: 11, paddingRight: 8 }}>User ID / Username:</td>
                    <td>
                      <input 
                        type="text" 
                        value={loginData.username} 
                        onChange={e => handleDustyInput(loginData.username, e.target.value, val => setLoginData(d => ({ ...d, username: val })), false)} 
                        onFocus={() => setFocusedField('username')}
                        style={{ width: 180 }} 
                        autoComplete="off" 
                      />
                      {errors.username && <div className="error-msg">{errors.username}</div>}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontFamily: 'Arial', fontSize: 11, paddingRight: 8 }}>Password: <span style={{ fontSize: 9, color: '#808080' }}>(case sensitive)</span></td>
                    <td>
                      <input 
                        type="password" 
                        value={loginData.password} 
                        onChange={e => handleDustyInput(loginData.password, e.target.value, val => setLoginData(d => ({ ...d, password: val })), false)} 
                        onFocus={() => setFocusedField('password')}
                        style={{ width: 180 }} 
                      />
                      {errors.password && <div className="error-msg">{errors.password}</div>}
                    </td>
                  </tr>
                  <tr><td /><td>
                    <label style={{ fontFamily: 'Arial', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input type="checkbox" checked={loginData.remember} onChange={e => setLoginData(d => ({ ...d, remember: e.target.checked }))} />
                      Remember me for 15 minutes
                    </label>
                  </td></tr>
                </tbody></table>

                {/* Federal Virtual Keyboard Matrix */}
                <div className="panel-raised" style={{ padding: 6, margin: '8px 0', background: '#c0c0c0', border: '1px solid #808080' }}>
                  <div style={{ fontFamily: 'Arial', fontSize: 9, fontWeight: 'bold', background: '#000080', color: '#fff', padding: '1px 4px', marginBottom: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>🛡️ CYBER-SHIELD VIRTUAL INPUT MATRIX (REQUIRED)</span>
                    <button 
                      className="btn-98" 
                      onClick={(e) => { e.preventDefault(); setIsCaps(c => !c); }}
                      style={{ fontSize: 8, padding: '0 4px', minWidth: 'unset', background: isCaps ? '#fff' : '#c0c0c0', color: '#000' }}
                    >
                      Caps Lock: {isCaps ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 3 }}>
                    {keys.map(k => {
                      const displayChar = /[a-zA-Z]/.test(k) ? (isCaps ? k.toUpperCase() : k.toLowerCase()) : k;
                      return (
                        <button
                          key={k}
                          className="btn-98"
                          onClick={(e) => { e.preventDefault(); handleVirtualKeyClick(k); }}
                          style={{
                            padding: '4px 0',
                            fontSize: 9,
                            fontWeight: 'bold',
                            minWidth: 'unset',
                            textAlign: 'center',
                            color: '#000',
                            background: focusedField === 'username' && loginData.username.includes(displayChar) ? '#ffffd0' : '#c0c0c0'
                          }}
                        >
                          {displayChar}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ fontFamily: 'Arial', fontSize: 8, color: '#666', marginTop: 4, lineHeight: 1.1 }}>
                    *Focus on User ID or Password field first (currently active: <strong>{focusedField === 'username' ? 'User ID' : 'Password'}</strong>). Click keys to input. Direct physical typing has a 50% encryption error rate.
                  </div>
                </div>

                {!captchaDone
                  ? <CursedCaptcha onVerify={() => setCaptchaDone(true)} label="Login Security CAPTCHA" />
                  : <div className="success-msg" style={{ margin: '4px 0' }}>✓ CAPTCHA verified successfully.</div>
                }
                {errors.captcha && <div className="error-msg">{errors.captcha}</div>}
                <div className="hr-98" style={{ margin: '8px 0' }} />
                
                {/* Dynamic Swapping buttons with keyboard bypass option */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', minHeight: 30 }}>
                  {!buttonsSwapped ? (
                    <>
                      <button 
                        className="btn-98 btn-wiggle" 
                        onMouseEnter={handleCancelHover}
                        onClick={handleLogin} 
                        style={{ background: '#808080', fontSize: 10 }}
                      >
                        Cancel
                      </button>
                      <button 
                        className="btn-98 btn-wiggle" 
                        onClick={() => navigate('/')} 
                        style={{ background: '#000080', color: '#fff', fontWeight: 'bold' }}
                      >
                        ► Login (click here)
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="btn-98 btn-wiggle" 
                        onClick={() => navigate('/')} 
                        style={{ background: '#000080', color: '#fff', fontWeight: 'bold' }}
                      >
                        ► Login (click here)
                      </button>
                      <button 
                        className="btn-98 btn-wiggle" 
                        onMouseEnter={handleCancelHover}
                        onClick={handleLogin} 
                        style={{ background: '#808080', fontSize: 10 }}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  <span className="fake-link" style={{ fontSize: 10 }} onClick={() => window.dispatchEvent(new CustomEvent('cursed-link', { detail: 'Forgot password?' }))}>Forgot password?</span>
                </div>
                <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080', marginTop: 6 }}>
                  Accounts locked after 2 failed attempts. You have attempted <strong>0</strong> time(s) today.
                </div>
              </>
            ) : (
              <>
                <div style={{ fontFamily: 'Arial', fontSize: 10, marginBottom: 6, color: '#cc0000', fontWeight: 'bold' }}>
                  Fields marked <span className="required-star">†</span> are required. Fields marked * may or may not be required.
                </div>
                <table cellPadding="2" cellSpacing="0" width="100%"><tbody>
                  {[
                    { label: 'First Name', key: 'firstName', req: '†', type: 'text' },
                    { label: 'Last Name', key: 'lastName', req: '†', type: 'text' },
                    { label: 'Social Security Number', key: 'ssn', req: '†', type: 'text', note: 'Format: XXX-XX-XXXX' },
                    { label: 'Date of Birth', key: 'dob', req: '*', type: 'text', note: 'MM/DD/YYYY' },
                    { label: 'Email Address', key: 'email', req: '†', type: 'email' },
                    { label: 'Phone Number', key: 'phone', req: '', type: 'text', note: 'Include area code' },
                    { label: 'Desired Username', key: 'username', req: '†', type: 'text', note: '6-8 chars' },
                    { label: 'Password', key: 'password', req: '†', type: 'password', note: 'Secure matrix below' },
                    { label: 'Confirm Password', key: 'password2', req: '†', type: 'password' },
                    { label: "Mother's Maiden Name", key: 'motherMaiden', req: '*', type: 'text' },
                    { label: 'City of Birth', key: 'cityBorn', req: '*', type: 'text' },
                    { label: 'Name of First Pet', key: 'petName', req: '', type: 'text' },
                  ].map(({ label, key, req, type, note }) => (
                    <tr key={key}>
                      <td style={{ fontFamily: 'Arial', fontSize: 10, paddingRight: 6, whiteSpace: 'nowrap', verticalAlign: 'top', paddingTop: 3 }}>
                        {label}:{req && <span className="required-star">{req}</span>}
                      </td>
                      <td>
                        <input 
                          type={type} 
                          value={regData[key]} 
                          onChange={e => {
                            if (key === 'username' || key === 'password') {
                              handleDustyInput(regData[key], e.target.value, val => setRegData(d => ({ ...d, [key]: val })));
                            } else {
                              setRegData(d => ({ ...d, [key]: e.target.value }));
                            }
                          }} 
                          style={{ width: 170 }} 
                        />
                        {note && <span style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080', marginLeft: 4 }}>{note}</span>}
                        {errors[key] && <div className="error-msg" style={{ fontSize: 9 }}>{errors[key]}</div>}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Real-time Cursed Password Matrix */}
                  <tr>
                    <td colSpan={2}>
                      <div className="panel-inset" style={{ padding: '6px', background: '#f8f8f8', marginTop: 4, width: '100%' }}>
                        <div style={{ fontWeight: 'bold', fontSize: 9, marginBottom: 3 }}>🔒 Password Security Matrix:</div>
                        {[
                          [passRules.length, 'Minimum 14 characters'],
                          [passRules.uppercase, 'At least 3 uppercase letters (A-Z)'],
                          [passRules.special, 'At least 2 special symbols (e.g. !, @, #)'],
                          [passRules.prime, 'Contains a single-digit prime number (2, 3, 5, 7)'],
                          [passRules.day, `Contains current day of the week (${new Date().toLocaleDateString('en-US', { weekday: 'long' })})`],
                          [passRules.roman, 'Contains an uppercase Roman numeral (I, V, X, L, C, D, M)'],
                          [passRules.chemical, 'Contains Helium (He), Gold (Au), or Sodium (Na) chemical symbol'],
                        ].map(([status, label], idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 8, color: status ? '#006600' : '#cc0000', fontWeight: status ? 'bold' : 'normal' }}>
                            <span>{status ? '✓' : '✗'}</span>
                            <span>{label}</span>
                          </div>
                        ))}
                      </div>
                      {errors.password && <div className="error-msg" style={{ marginTop: 2 }}>{errors.password}</div>}
                    </td>
                  </tr>

                  <tr><td colSpan={2}>
                    {!captchaDone
                      ? <CursedCaptcha onVerify={() => setCaptchaDone(true)} label="Registration CAPTCHA" />
                      : <div className="success-msg">✓ CAPTCHA verified.</div>
                    }
                    {errors.captcha && <div className="error-msg">{errors.captcha}</div>}
                  </td></tr>
                  <tr><td colSpan={2}>
                    <div className="panel-inset" style={{ height: 80, overflow: 'auto', marginTop: 6, fontSize: 9, fontFamily: 'Arial' }}>
                      TERMS AND CONDITIONS (87 pages — please read all before agreeing):<br /><br />
                      1. By registering you agree all information is accurate under penalty of perjury (18 U.S.C. § 1621). False statements may result in criminal prosecution...<br /><br />
                      2. The Department reserves the right to share your personal information including name, address, SSN, biometric data, browsing history, and financial records with any federal, state, or local agency, law enforcement, or approved third-party contractor without prior notice...<br /><br />
                      3. Your account may be suspended or terminated at any time for any or no reason...<br /><br />
                      [Scroll down — 84 pages remaining]
                    </div>
                    <label style={{ fontFamily: 'Arial', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <input type="checkbox" checked={regData.agree} onChange={e => setRegData(d => ({ ...d, agree: e.target.checked }))} />
                      I have read and agree to all Terms, Privacy Policy, and Cookie Policy
                    </label>
                    {errors.agree && <div className="error-msg">{errors.agree}</div>}
                  </td></tr>
                </tbody></table>
                <div className="hr-98" style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-98 btn-wiggle" onClick={handleRegister} style={{ background: '#000080', color: '#fff', fontWeight: 'bold' }}>Submit Registration</button>
                  <button className="btn-98 btn-wiggle" onClick={() => setRegData({
                    firstName: '', lastName: '', ssn: '', dob: '',
                    email: '', phone: '', username: '', password: '', password2: '',
                    motherMaiden: '', cityBorn: '', petName: '', agree: false,
                  })}>Clear All Fields</button>
                  <button className="btn-98 btn-wiggle" onClick={() => navigate('/')}>Cancel</button>
                </div>
                {errors.password2 && <div className="error-msg" style={{ marginTop: 4 }}>{errors.password2}</div>}
              </>
            )}
          </div>
        </td>
        <td width="38%">
          <div className="panel-raised" style={{ marginBottom: 6 }}>
            <div className="section-title">⚠ Security Information</div>
            <div style={{ fontFamily: 'Arial', fontSize: 10, padding: '2px 4px' }}>
              <div style={{ marginBottom: 4 }}><strong>This is a SECURE government website.</strong></div>
              <div>• Do NOT share your password</div>
              <div>• Always log out when finished</div>
              <div>• Clear your browser cache after use</div>
              <div>• Report suspicious activity immediately</div>
              <hr className="hr-98" />
              <div style={{ fontSize: 9, color: '#808080' }}>Protected by SSL 2.0 encryption.</div>
              <div style={{ fontSize: 9, color: '#cc0000', marginTop: 4 }} className="blink">⚠ Never enter your SSN on non-government sites!</div>
            </div>
          </div>
          <div className="panel-raised">
            <div className="section-title">Technical Issues?</div>
            <div style={{ fontFamily: 'Arial', fontSize: 10, padding: '2px 4px' }}>
              <div>Help Desk: 1-800-555-0199</div>
              <div style={{ fontSize: 9 }}>Mon–Fri 9AM–4PM EST</div>
              <div style={{ fontSize: 9, color: '#cc0000', fontWeight: 'bold', marginTop: 4 }}>Avg wait: 4 hrs 37 min</div>
              <hr className="hr-98" />
              <div style={{ fontSize: 8, color: '#808080', marginBottom: 4 }}>
                *A11y Accessibility Compliance: Keyboard Tab-navigation acts as a direct hover-trigger bypass in standard mode.
              </div>
              <span className="fake-link" style={{ fontSize: 10 }}>Submit Help Ticket</span><br />
              <span className="fake-link" style={{ fontSize: 10 }}>Download Remote Assistance Tool</span>
            </div>
          </div>
        </td>
      </tr></tbody></table>
    </CursedLayout>
  );
}
