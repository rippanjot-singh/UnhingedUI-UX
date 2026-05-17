import { useState, useEffect, useRef } from 'react';

// Cursed sound synthesizer using Web Audio API
const playCursedSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'error') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'floppy') {
      let startTime = ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(90 + Math.random() * 20, startTime);
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.05);
        startTime += 0.07;
      }
    } else if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch (e) {
    console.error('Audio synthesis failed:', e);
  }
};

export default function FakeVirusWarning({ onDismiss, onConcede }) {
  const [step, setStep] = useState(0); // 0=warning, 1=scan, 2=results, 3=checkout, 4=sure, 5=BSOD
  const [scanPct, setScanPct] = useState(0);
  const [scanFile, setScanFile] = useState('C:\\WINDOWS\\System32\\kernel32.dll');

  // Checkout states
  const [cardholder, setCardholder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState(6);
  const [expiryYear, setExpiryYear] = useState(2029);
  const [cvc, setCvc] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  // Slippery buttons positions
  const [unprotectedPos, setUnprotectedPos] = useState(null);
  const [destroyPos, setDestroyPos] = useState(null);
  const [unprotectedFleeCount, setUnprotectedFleeCount] = useState(0);
  const [destroyFleeCount, setDestroyFleeCount] = useState(0);

  const FILES = [
    'C:\\WINDOWS\\System32\\kernel32.dll',
    'C:\\Program Files\\Internet Explorer\\iexplore.exe',
    'C:\\WINDOWS\\explorer.exe',
    'C:\\Documents and Settings\\User\\Local Settings\\Temp\\tmp4F2A.tmp',
    'C:\\WINDOWS\\system32\\cmd.exe',
    'C:\\Program Files\\Common Files\\Microsoft Shared\\MSInfo\\msinfo32.exe',
    'C:\\WINDOWS\\system32\\drivers\\etc\\hosts',
    'C:\\WINDOWS\\Fonts\\times.ttf',
  ];

  // Auto-scan loader
  useEffect(() => {
    if (step !== 1) return;
    if (scanPct >= 100) {
      setTimeout(() => setStep(2), 500);
      return;
    }
    const t = setInterval(() => {
      setScanPct(p => Math.min(p + Math.floor(Math.random() * 4) + 1, 100));
      setScanFile(FILES[Math.floor(Math.random() * FILES.length)]);
    }, 70);
    return () => clearInterval(t);
  }, [step, scanPct]);

  // BSOD Escape event listener
  useEffect(() => {
    if (step !== 5) return;
    const handleKeyDown = () => {
      // Reload is the ultimate cursed wipe
      playCursedSound('error');
      sessionStorage.setItem('virus_shown', '1');
      window.location.reload();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step]);

  // Payment scrambler double-typing injector
  const handleCardNumberChange = (e) => {
    let val = e.target.value;
    val = val.replace(/\D/g, ''); // Numeric only

    if (val.length > cardNumber.replace(/\s/g, '').length) {
      if (Math.random() < 0.35) {
        const lastDigit = val.slice(-1);
        val = val + lastDigit;
        playCursedSound('error');
      }
    }

    // Group in chunks of 4 digits
    const chunks = val.match(/.{1,4}/g);
    const formatted = chunks ? chunks.join(' ') : val;
    setCardNumber(formatted.slice(0, 19));
  };

  const handleMonthSlider = (e) => {
    const val = parseInt(e.target.value);
    setExpiryMonth(val);
    if (val % 2 === 0) {
      setExpiryYear(2026);
      playCursedSound('error');
      alert("⚠️ LEAP CALENDAR RE-CALIBRATION: Selecting an even month triggers administrative leap-year adjustment. Expiration Year rolled back to 2026.");
    }
  };

  const handleIgnoreClick = () => {
    playCursedSound('error');
    alert("⚠️ FEDERAL CYBERSECURITY ACT VIOLATION DETECTED:\n\nUnder Section 4-B of the Cybersecurity Protection Directive (Homeland Security Act of 2002), ignoring active trojan threats on public networks is classified as Class C Digital Negligence.\n\nPC VirusShield must perform a secure scan immediately to prevent server cluster quarantine. Initializing Mandatory Scan...");
    setScanPct(0);
    setStep(1);
  };

  // Run away logic for Continue Unprotected
  const handleUnprotectedHover = () => {
    if (unprotectedFleeCount >= 3) return; // Stays still
    const width = 160;
    const height = 28;
    const newX = Math.max(10, Math.min(window.innerWidth - width - 10, Math.floor(Math.random() * (window.innerWidth - width))));
    const newY = Math.max(10, Math.min(window.innerHeight - height - 10, Math.floor(Math.random() * (window.innerHeight - height))));
    playCursedSound('floppy');
    setUnprotectedPos({ x: newX, y: newY });
    setUnprotectedFleeCount(c => c + 1);
  };

  // Run away logic for Destroy Computer
  const handleDestroyHover = () => {
    if (destroyFleeCount >= 3) return; // Stays still
    const width = 160;
    const height = 28;
    const newX = Math.max(10, Math.min(window.innerWidth - width - 10, Math.floor(Math.random() * (window.innerWidth - width))));
    const newY = Math.max(10, Math.min(window.innerHeight - height - 10, Math.floor(Math.random() * (window.innerHeight - height))));
    playCursedSound('floppy');
    setDestroyPos({ x: newX, y: newY });
    setDestroyFleeCount(c => c + 1);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!cardholder || cardNumber.length < 15 || !cvc) {
      playCursedSound('error');
      setCheckoutError('Error: Credit card authorization forms must be completely filled out.');
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError('');
    playCursedSound('floppy');

    setTimeout(() => {
      setCheckoutLoading(false);
      
      if (cardholder.trim().toUpperCase() === 'SHERYIANS') {
        playCursedSound('beep');
        alert("🎉 SHERYIANS EMERGENCY SPONSORSHIP GRANTED!\n\nSheryians Coding School has sponsored your digital compliance license. Quarantine loop cleanly bypassed!\n\nSanitizing registry nodes...");
        onDismiss();
        return;
      }

      playCursedSound('error');
      // The ultimate payment decline reason!
      setCheckoutError("❌ TRANSACTION DECLINED: Insufficient Citizen Patriotic Credits (CPC) on local bank node. Transaction rejected by Federal Reserve merchant hub (Reston, VA). Code: 402-B. Please use alternative treasury bonds or choose Continue Unprotected.");
      // Reset the slippery button position so it is fully armed on screen!
      setUnprotectedPos(null);
    }, 2200);
  };

  return (
    <div 
      className="modal-backdrop" 
      style={{ 
        zIndex: 999990, 
        pointerEvents: 'all',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(3.5px)',
        flexDirection: 'column',
        gap: 15
      }}
    >
      {/* Step 0: Warning screen */}
      {step === 0 && (
        <div className="win98-window" style={{ width: 420 }}>
          <div className="titlebar" style={{ background: '#cc0000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>🚨 WARNING — PC VirusShield Pro 2004</span>
            <span className="titlebar-btn" onClick={handleIgnoreClick}>✕</span>
          </div>
          <div style={{ padding: '10px 14px' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 40 }}>🚨</span>
              <div>
                <div style={{ fontFamily: 'Arial', fontSize: 13, fontWeight: 'bold', color: '#cc0000', marginBottom: 4 }}>
                  <span className="blink">⚠️ CRITICAL INFECTION DETECTED ⚠️</span>
                </div>
                <div style={{ fontFamily: 'Arial', fontSize: 11, marginBottom: 6 }}>
                  PC VirusShield has detected **3 aggressive infections** actively compromising your system:
                </div>
                <div className="panel-inset" style={{ marginBottom: 6, fontFamily: 'Arial', fontSize: 10, background: '#fff' }}>
                  <div style={{ color: '#cc0000', fontWeight: 'bold' }}>🦠 TROJAN.WIN32.RESTON.BQNX — RISK: CRITICAL</div>
                  <div style={{ color: '#cc6600', fontWeight: 'bold' }}>🦠 WORM.BYPASS.NETSCAPE — RISK: HIGH</div>
                  <div style={{ color: '#cc0000', fontWeight: 'bold' }}>🦠 BACKDOOR.DIALUP.LOGGER — RISK: CRITICAL</div>
                </div>
                <div style={{ fontFamily: 'Arial', fontSize: 10, marginBottom: 8, lineHeight: 1.25 }}>
                  Infected nodes are attempting to send your keystrokes, SSN, and citizen credentials to unsecure servers. Immediate sanitization required.
                </div>
                <div style={{ fontFamily: 'Arial', fontSize: 8, color: '#808080' }}>
                  System IP: 192.168.1.{Math.floor(Math.random() * 200) + 50} | Scan Database: v4.88 (Updated 2004)
                </div>
              </div>
            </div>
            <hr className="hr-98" style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn-98 btn-wiggle" onClick={() => { setScanPct(0); setStep(1); }}
                style={{ background: '#cc0000', color: '#ffffff', fontWeight: 'bold', borderColor: '#ff4444 #880000 #880000 #ff4444' }}>
                🛡️ Scan & Clean Now (FREE)
              </button>
              <button className="btn-98 btn-wiggle" onClick={handleIgnoreClick}>
                Ignore Threat (Not Recommended)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Scanning... */}
      {step === 1 && (
        <div className="win98-window" style={{ width: 380 }}>
          <div className="titlebar">
            <span>🛡️ PC VirusShield Pro — Scanning System Directory...</span>
          </div>
          <div style={{ padding: '10px 14px' }}>
            <div style={{ fontFamily: 'Arial', fontSize: 11, marginBottom: 8 }}>
              Scanning critical government records and citizen registers. Please wait...
            </div>
            <div className="progress-bar-outer" style={{ marginBottom: 6 }}>
              <div className="progress-bar-inner" style={{ width: `${scanPct}%` }}>
                <span style={{ fontSize: 9 }}>{scanPct}%</span>
              </div>
            </div>
            <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080', marginBottom: 2, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              Scanning: {scanFile}
            </div>
            <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#cc0000', fontWeight: 'bold' }}>
              Files Audited: {Math.floor(scanPct * 124.7)} / ~12,477 | Spyware Quarantined: 3
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Quarantined & Purchase Warning */}
      {step === 2 && (
        <div className="win98-window" style={{ width: 420 }}>
          <div className="titlebar" style={{ background: '#cc0000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ Clean Status: QUARANTINED</span>
            <span className="titlebar-btn" onClick={() => alert("Warning: Sanitization loop pending registry license key.")}>✕</span>
          </div>
          <div style={{ padding: '10px 14px' }}>
            <div style={{ fontFamily: 'Arial', fontSize: 11, fontWeight: 'bold', color: '#cc0000', marginBottom: 6 }}>
              Registry Sweep Complete: 3 critical threats isolated.
            </div>
            <div className="warning-box" style={{ marginBottom: 8, padding: 8, background: '#ffffd0', border: '1px solid #808080' }}>
              <div style={{ fontFamily: 'Arial', fontSize: 10, lineHeight: 1.3 }}>
                *Threats have been **temporarily quarantined**. To permanently delete registry infections
                and protect your credentials, please register your license of **PC VirusShield Pro GOLD Edition** ($49.99/year).
              </div>
            </div>
            <div style={{ fontFamily: 'Arial', fontSize: 10, marginBottom: 8, lineHeight: 1.3 }}>
              Your computer remains highly vulnerable. Click 'Buy Pro Gold' to execute instant secure checkout.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn-98 btn-wiggle"
                style={{ background: '#006600', color: '#ffffff', fontWeight: 'bold', borderColor: '#44aa44 #003300 #003300 #44aa44' }}
                onClick={() => setStep(3)}>
                💳 Buy Pro Gold — $49.99
              </button>
              <button
                className="btn-98 btn-wiggle"
                onMouseEnter={handleUnprotectedHover}
                onClick={() => setStep(4)}
                style={unprotectedPos ? {
                  position: 'fixed',
                  left: unprotectedPos.x,
                  top: unprotectedPos.y,
                  zIndex: 1000000,
                  transition: 'none'
                } : {}}
              >
                {unprotectedFleeCount === 0 && "Continue Unprotected"}
                {unprotectedFleeCount === 1 && "Continue Unprotected (No!)"}
                {unprotectedFleeCount === 2 && "Continue (Stop it!)"}
                {unprotectedFleeCount >= 3 && "Continue Unprotected (Ugh, fine...)"}
              </button>
            </div>
            <div style={{ textAlign: 'center', fontFamily: 'Arial', fontSize: 8, color: '#808080', marginTop: 6 }}>
              Clicking "Continue Unprotected" accepts all liability for digital system deterioration,
              identity fraud, andReston Server core load warnings.
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Secure CC Checkout Panel */}
      {step === 3 && (
        <div className="win98-window" style={{ width: 440 }}>
          <div className="titlebar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>💳 PC VirusShield Gold — Secure Federal Merchant Port</span>
            <span className="titlebar-btn" onClick={() => setStep(2)}>✕</span>
          </div>
          <form onSubmit={handlePaymentSubmit} style={{ padding: '10px 14px' }}>
            <div style={{ fontFamily: 'Arial', fontSize: 11, fontWeight: 'bold', marginBottom: 6 }}>
              Upgrade to PC VirusShield Pro Gold (Instant Removal Authorization)
            </div>

            {checkoutError && (
              <div style={{
                color: '#cc0000',
                background: '#ffffd0',
                border: '1.5px double #cc0000',
                padding: 6,
                fontSize: 9,
                fontFamily: 'Arial',
                marginBottom: 8,
                lineHeight: 1.3
              }}>
                {checkoutError}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* Cardholder Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <label style={{ fontFamily: 'Arial', fontSize: 10, fontWeight: 'bold' }}>Cardholder Name:</label>
                <input
                  type="text"
                  value={cardholder}
                  onChange={(e) => setCardholder(e.target.value)}
                  style={{ padding: '2px 4px', fontSize: 10, fontFamily: 'Arial' }}
                  placeholder="e.g. John A. Citizen"
                />
              </div>

              {/* Credit Card Number */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <label style={{ fontFamily: 'Arial', fontSize: 10, fontWeight: 'bold' }}>
                  Credit Card Number:
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  style={{ padding: '2px 4px', fontSize: 10, fontFamily: 'monospace' }}
                  placeholder="4000 1234 5678 9010"
                />
                <span style={{ fontSize: 8, color: '#808080' }}>*35% typing duplication security interference matrix is active.</span>
              </div>

              {/* Sliders for Expiry */}
              <div style={{ display: 'flex', gap: 10 }}>
                {/* Expiry Month Slider */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <label style={{ fontFamily: 'Arial', fontSize: 10, fontWeight: 'bold' }}>
                    Exp Month: <span style={{ color: '#000080', fontWeight: 'bold' }}>{expiryMonth}</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={expiryMonth}
                    onChange={handleMonthSlider}
                    style={{ height: 12 }}
                  />
                  <span style={{ fontSize: 7, color: '#808080' }}>*Even months reset year to 2026.</span>
                </div>

                {/* Expiry Year Slider */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <label style={{ fontFamily: 'Arial', fontSize: 10, fontWeight: 'bold' }}>
                    Exp Year: <span style={{ color: '#000080', fontWeight: 'bold' }}>{expiryYear}</span>
                  </label>
                  <input
                    type="range"
                    min={2026}
                    max={2046}
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(parseInt(e.target.value))}
                    style={{ height: 12 }}
                  />
                </div>
              </div>

              {/* CVC & Zip Code */}
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <label style={{ fontFamily: 'Arial', fontSize: 10, fontWeight: 'bold' }}>CVC:</label>
                  <input
                    type="password"
                    maxLength={3}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                    style={{ padding: '2px 4px', fontSize: 10, width: 50, fontFamily: 'monospace' }}
                    placeholder="***"
                  />
                </div>
                <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <label style={{ fontFamily: 'Arial', fontSize: 10, fontWeight: 'bold' }}>Billing Zip Code:</label>
                  <input
                    type="text"
                    maxLength={5}
                    style={{ padding: '2px 4px', fontSize: 10 }}
                    placeholder="20500"
                  />
                </div>
              </div>
            </div>

            <hr className="hr-98" style={{ margin: '10px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, alignItems: 'center' }}>
              {checkoutLoading ? (
                <div style={{ fontSize: 9, fontFamily: 'Arial', color: '#555', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="blink">⌛</span> Authorizing merchant credentials...
                </div>
              ) : (
                <>
                  <button type="submit" className="btn-98" style={{ background: '#006600', color: '#fff', fontWeight: 'bold' }}>
                    🔒 Submit Secure Payment ($49.99)
                  </button>
                  <button
                    type="button"
                    className="btn-98"
                    onMouseEnter={handleUnprotectedHover}
                    onClick={() => setStep(4)}
                    style={unprotectedPos ? {
                      position: 'fixed',
                      left: unprotectedPos.x,
                      top: unprotectedPos.y,
                      zIndex: 10050,
                      transition: 'none'
                    } : {}}
                  >
                    Continue Unprotected
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Step 4: Are you absolutely sure? */}
      {step === 4 && (
        <div className="win98-window" style={{ width: 360 }}>
          <div className="titlebar" style={{ background: '#cc0000' }}>
            <span>⚠️ CONFIRMATION OF NEGLECT RISK</span>
          </div>
          <div style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 32 }}>⚠️</span>
              <div style={{ fontFamily: 'Arial', fontSize: 11, fontWeight: 'bold', color: '#cc0000' }}>
                ARE YOU ABSOLUTELY 100% SURE?
              </div>
            </div>
            <div style={{ fontFamily: 'Arial', fontSize: 10, lineHeight: 1.35, marginBottom: 10 }}>
              Choosing to bypass quarantine removal exposes your computer to irreversible system registry damage,
              trojan server bypass loops, and structural hardware overheating.<br /><br />
              Please choose safety immediately.
            </div>
            <hr className="hr-98" style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                className="btn-98"
                onClick={() => setStep(3)}
                style={{ background: '#006600', color: '#fff', fontWeight: 'bold', padding: '2px 14px' }}
              >
                No, Protect My PC! (Recommended)
              </button>
              <button
                className="btn-98"
                onMouseEnter={handleDestroyHover}
                onClick={() => setStep(5)}
                style={destroyPos ? {
                  position: 'fixed',
                  left: destroyPos.x,
                  top: destroyPos.y,
                  zIndex: 1000000,
                  fontSize: 7,
                  padding: '2px 4px',
                  transition: 'none'
                } : { fontSize: 7, padding: '2px 4px' }}
              >
                {destroyFleeCount === 0 && "Yes, destroy my computer and log violation"}
                {destroyFleeCount === 1 && "Yes, destroy... (Wait, stop!)"}
                {destroyFleeCount === 2 && "Yes, destroy... (Click safety!)"}
                {destroyFleeCount >= 3 && "Yes, destroy... (Tired, click me)"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Windows 98 Blue Screen of Death (BSOD) */}
      {step === 5 && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#0000aa',
          color: '#ffffff',
          fontFamily: '"Lucida Console", Monaco, monospace',
          fontSize: 14,
          padding: '40px 60px',
          zIndex: 10100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          pointerEvents: 'all'
        }}>
          <div>
            <div style={{ background: '#ffffff', color: '#0000aa', display: 'inline-block', padding: '2px 10px', fontWeight: 'bold', marginBottom: 20 }}>
              Windows
            </div>
            <div style={{ lineHeight: 1.6 }}>
              A fatal exception 0E has occurred at 0028:C0011C06 in VXD VMM(01)<br />
              under DHS-99 citizen cyber compliance registry monitor.<br />
              The active digital session has been terminated to protect the federal core.<br /><br />

              * Press any key to terminate the unsafe, unhygienic operation.<br />
              * Press CTRL+ALT+DEL to restart your citizen computer. You will<br />
              lose any unsaved documentation and queue locations on Form DS-7749.<br />
              * Press ENTER to attempt recovery and restore mandatory sound stimulation.<br /><br />

              Registry records indicate the security breach was caused by digital negligence.<br />
              Federal warning logs have successfully synchronized.
            </div>
          </div>
          <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
            <span className="blink">Press any key to restore citizen queue... _</span>
          </div>
        </div>
      )}
    </div>
  );
}
