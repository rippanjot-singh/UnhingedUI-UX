import { useState, useEffect, useCallback } from 'react';

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
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'floppy') {
      let startTime = ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(110 + Math.random() * 15, startTime);
        gain.gain.setValueAtTime(0.07, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.04);
        startTime += 0.07;
      }
    }
  } catch (e) {
    console.error('Audio synthesis failed:', e);
  }
};

export default function SessionTimeoutModal() {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [shakeCount, setShakeCount] = useState(0);
  const [btnPos, setBtnPos] = useState({ top: 0, left: 0 });

  const reset = useCallback(() => {
    setVisible(false);
    setCountdown(60);
    setBtnPos({ top: 0, left: 0 });
    // Show again in 20 seconds for high pressure testing
    setTimeout(() => {
      setVisible(true);
      playCursedSound('error');
    }, 20000);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      playCursedSound('error');
    }, 20000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (countdown <= 0) {
      setCountdown(60);
      setShakeCount(c => c + 1);
      playCursedSound('error');
      return;
    }
    const t = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [visible, countdown]);

  const handleMouseEnter = () => {
    // Button jumps randomly inside a safe container limit
    const randomTop = Math.floor(Math.random() * 60 - 30); // -30px to +30px
    const randomLeft = Math.floor(Math.random() * 100 - 50); // -50px to +50px
    setBtnPos({ top: randomTop, left: randomLeft });
    playCursedSound('floppy'); // Gritty click when button flees
  };

  const handleLogOutNow = () => {
    reset();
    playCursedSound('error');
    alert("✓ LOG OUT EXEMPTION GRANTED:\n\nYour request to 'Log Out Now' has been rejected by the secure terminal system under standard Federal Bureaucracy Clause 42-B.\n\nSession successfully extended by 30 minutes.");
  };

  if (!visible) return null;

  return (
    // Backdrop set to ultimate zIndex: 999999 to guarantee it sits above all virus, media player, and captcha layers!
    <div className="modal-backdrop" style={{ zIndex: 999999, pointerEvents: 'all' }}>
      <div className={`win98-window ${shakeCount > 0 ? 'shake' : ''}`} style={{ width: 380 }} key={shakeCount}>
        <div className="titlebar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚠️ Session Timeout Warning</span>
          <span className="titlebar-btn" onClick={reset} style={{ fontSize: 8, cursor: 'pointer' }}>✕</span>
        </div>
        <div style={{ padding: '10px 12px' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ fontSize: 32, lineHeight: 1 }}>⏰</div>
            <div>
              <div style={{ fontFamily: 'Arial', fontSize: 11, fontWeight: 'bold', marginBottom: 4 }}>
                Your session will expire due to inactivity!
              </div>
              <div style={{ fontFamily: 'Arial', fontSize: 10 }}>
                For the security of your personal information, you will be automatically
                logged out in <span className="blink" style={{ color: '#cc0000', fontWeight: 'bold', fontSize: 13 }}>{countdown}</span> second{countdown !== 1 ? 's' : ''}.
              </div>
              <br />
              <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080' }}>
                Warning ID: STO-{Math.floor(Math.random() * 99999).toString().padStart(5, '0')} | 
                Last activity: {new Date().toLocaleTimeString()} | 
                Server: GOVWEB-04
              </div>
            </div>
          </div>

          <div className="warning-box" style={{ marginBottom: 8, padding: 8, background: '#ffffd0', border: '1px solid #808080' }}>
            <div style={{ fontFamily: 'Arial', fontSize: 10, fontWeight: 'bold', marginBottom: 2 }}>
              ⚠️ IMPORTANT NOTICE:
            </div>
            <div style={{ fontFamily: 'Arial', fontSize: 9, lineHeight: 1.2 }}>
              Any unsaved form data will be permanently lost. This includes but is not limited to:
              Section A (Personal Information), Section B (Tax ID Verification), Section C-7
              (Dependency Declarations), and all attachments uploaded in Step 4.
            </div>
          </div>

          {/* Cursed runaway buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, minHeight: 60, alignItems: 'center', position: 'relative' }}>
            <button 
              className="btn-98 btn-wiggle" 
              onMouseEnter={handleMouseEnter}
              onClick={() => {
                playCursedSound('error');
                alert("Impossible! You actually caught the button! Session extended.");
                reset();
              }}
              style={{ 
                position: 'relative',
                top: `${btnPos.top}px`,
                left: `${btnPos.left}px`,
                transition: 'top 0.1s ease, left 0.1s ease',
                minWidth: 135,
                zIndex: 999999
              }}
            >
              ✓ Yes, I Am Still Here
            </button>
            <button 
              className="btn-98 btn-wiggle" 
              onClick={handleLogOutNow} 
              style={{ minWidth: 110 }}
            >
              Log Out Now
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 6, fontFamily: 'Arial', fontSize: 8, color: '#808080' }}>
            Do you want to extend your session? (Choosing "Log Out Now" extends your session by 30 minutes)
          </div>
        </div>
      </div>
    </div>
  );
}
