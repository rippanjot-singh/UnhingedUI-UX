import { useState, useEffect } from 'react';

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
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'floppy') {
      let startTime = ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(100 + Math.random() * 10, startTime);
        gain.gain.setValueAtTime(0.06, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.04);
        startTime += 0.06;
      }
    } else if (type === 'siren') {
      // Rapid warbling pitch
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.15);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.3);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    console.error('Audio synthesis failed:', e);
  }
};

const ADS = [
  {
    title: '🎉 CONGRATULATIONS! You Are Our 1,000,000th Visitor!',
    body: 'You have been SELECTED by federal lotteries to receive a FREE Dell Inspiron Laptop!\n\nClick CLAIM NOW to receive your prize before it is recycled!',
    btn: '🎰 CLAIM MY FREE LAPTOP NOW!!!',
    color: '#ffff00',
    bg: '#ff0000',
  },
  {
    title: '⚠️ ALERT: YOUR PC IS COMPROMISED BY (37) WETWARE TROJANS',
    body: 'Threat logs detected! WORM.WIN32.DIALUP and SYSTEM32.REGISTRY.EXHAUSTION isolated.\nYour internet connection may explode.\nDownload PC SpeedBooster Pro 2004 now — 100% Free!',
    btn: '🛡️ FLUSH VIRUSES INSTANTLY NOW',
    color: '#000000',
    bg: '#ffff00',
  },
  {
    title: '💰 Earn $8,400/Week From Home — 100% SECURE!',
    body: 'Patriotic moms in Washington DC are earning massive treasuries using this ONE weird filing trick!\nBureaucrats HATE her. See the simple method.\n\nLIMITED SPOTS — Claim in your ZIP code immediately!',
    btn: '👉 REVEAL MY FEDERAL SECRET 👈',
    color: '#ffffff',
    bg: '#006600',
  },
  {
    title: '📱 Your Netscape Browser Has Been Selected for Upgrade!',
    body: 'Netscape Communications Corp. has flagged your browser version for emergency upgrade to version 12.0!\n\nDo not navigate away or close your connection window.',
    btn: '🌐 START INTERACTIVE NETSCAPE UPDATE',
    color: '#000000',
    bg: '#c0c0c0',
  },
];

export default function PopupAd({ onClose, onAdClick }) {
  const [ad] = useState(() => ADS[Math.floor(Math.random() * ADS.length)]);
  const [pos, setPos] = useState({ x: 220, y: 120 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [closeClicks, setCloseClicks] = useState(0);

  // Unhinged shuffling title bar buttons
  const [btnOrder, setBtnOrder] = useState(['min', 'max', 'close']);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!dragging || isMaximized) return;
    const handleMove = (e) => {
      setPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    };
    const handleUp = () => setDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging, dragOffset, isMaximized]);

  // Siren alarms for maximized chaos
  useEffect(() => {
    if (!isMaximized) return;
    const interval = setInterval(() => {
      playCursedSound('siren');
    }, 450);
    return () => clearInterval(interval);
  }, [isMaximized]);

  const handleClose = () => {
    if (closeClicks < 2) {
      setCloseClicks(c => c + 1);
      setPos(p => ({ x: p.x + Math.random() * 140 - 70, y: p.y + Math.random() * 90 - 45 }));
      playCursedSound('error');
    } else {
      onClose();
    }
  };

  const shuffleButtons = () => {
    // Shuffle the three buttons, ensuring the 'close' button is NOT in the third slot (far right)
    const list = ['min', 'max', 'close'];
    let shuffled = [...list].sort(() => Math.random() - 0.5);
    while (shuffled[2] === 'close') {
      shuffled = [...list].sort(() => Math.random() - 0.5);
    }
    setBtnOrder(shuffled);
    playCursedSound('floppy');
  };

  const handleClaimClick = () => {
    playCursedSound('error');
    // Spawn 5 popups in a rapid stack!
    if (onAdClick) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          onAdClick();
        }, i * 200);
      }
    }
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9800, pointerEvents: 'none' }}>
      <div
        style={isMaximized ? {
          position: 'fixed',
          inset: 0,
          background: ad.bg,
          color: ad.color,
          pointerEvents: 'all',
          zIndex: 9850,
          padding: 40,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          animation: 'blink 0.4s step-start infinite',
          fontFamily: 'Impact, sans-serif'
        } : {
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: 380,
          pointerEvents: 'all',
          background: '#c0c0c0',
          borderTop: '2.5px solid #ffffff',
          borderLeft: '2.5px solid #ffffff',
          borderRight: '2.5px solid #808080',
          borderBottom: '2.5px solid #808080',
          boxShadow: '4px 4px 0 #000',
          zIndex: 9800,
        }}
      >
        {/* Title bar */}
        {!isMaximized ? (
          <div
            className="titlebar"
            style={{ cursor: 'move', background: '#cc0000', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            onMouseDown={(e) => {
              setDragging(true);
              setDragOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
            }}
          >
            <span style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>🌐 Windows Internet Explorer — Security Alert</span>
            <div style={{ display: 'flex', gap: 2 }}>
              {btnOrder.map(type => {
                if (type === 'min') {
                  return (
                    <span 
                      key="min" 
                      className="titlebar-btn" 
                      onClick={() => alert("⚠️ SECURITY DIRECTIVE: Warning panels cannot be minimized while active.")}
                    >
                      _
                    </span>
                  );
                }
                if (type === 'max') {
                  return (
                    <span 
                      key="max" 
                      className="titlebar-btn" 
                      onClick={() => {
                        playCursedSound('error');
                        alert("⚠️ CRITICAL OVERRIDE: Maximizing alert context to ensure optimal compliance focus.");
                        setIsMaximized(true);
                      }}
                    >
                      □
                    </span>
                  );
                }
                return (
                  <span
                    key="close"
                    className="titlebar-btn"
                    onClick={handleClose}
                    onMouseEnter={shuffleButtons}
                    style={{ fontWeight: 'bold' }}
                  >
                    ✕
                  </span>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Ad content */}
        {isMaximized ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <h1 className="blink" style={{ fontSize: 44, color: '#ffff00', marginBottom: 12 }}>
              ⚠️ URGENT ADVISORY NOTICE ⚠️
            </h1>
            <p style={{ fontSize: 24, textTransform: 'uppercase', lineHeight: 1.3, marginBottom: 20 }}>
              {ad.title}<br /><br />
              {ad.body}
            </p>
            <button
              className="btn-wiggle"
              onClick={handleClaimClick}
              style={{
                background: '#ff6600',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 22,
                padding: '12px 36px',
                border: '4px solid #fff',
                cursor: 'pointer',
                marginBottom: 30,
                fontFamily: 'Arial, sans-serif'
              }}
            >
              👉 CLAIM NOW BEFORE EXCLUSION 👈
            </button>
            <div>
              <button 
                className="btn-98" 
                onClick={handleClaimClick}
                style={{ color: '#000', fontSize: 14, fontWeight: 'bold', padding: '6px 20px', fontFamily: 'Arial' }}
              >
                Restore Window to Citizen Size
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ background: ad.bg, padding: '10px 12px' }}>
              <div style={{
                fontFamily: 'Arial',
                fontSize: 13,
                fontWeight: 'bold',
                color: ad.color,
                textAlign: 'center',
                marginBottom: 8,
                textShadow: '1px 1px 0 rgba(0,0,0,0.3)',
              }}>
                <span className="blink">{ad.title}</span>
              </div>
              <div style={{ fontFamily: 'Arial', fontSize: 10, color: ad.color, whiteSpace: 'pre-line', marginBottom: 10, textAlign: 'center', lineHeight: 1.2 }}>
                {ad.body}
              </div>
              <div style={{ textAlign: 'center' }}>
                <button
                  className="btn-wiggle"
                  onClick={handleClaimClick}
                  style={{
                    background: '#ff6600',
                    color: '#ffffff',
                    fontFamily: 'Arial',
                    fontWeight: 'bold',
                    fontSize: 11,
                    padding: '4px 12px',
                    border: '2px solid #cc3300',
                    cursor: 'pointer',
                    animation: 'blink 0.8s step-start infinite',
                  }}
                >
                  {ad.btn}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '2px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#c0c0c0', borderTop: '1px solid #808080' }}>
              <span style={{ fontFamily: 'Arial', fontSize: 7, color: '#808080' }}>
                Ad by: ValuClick Network™ | <span className="fake-link" onClick={() => alert("Restricted context.")}>Privacy Policy</span>
              </span>
              <span
                onClick={handleClose}
                onMouseEnter={shuffleButtons}
                style={{ fontFamily: 'Arial', fontSize: 8, cursor: 'pointer', color: '#808080', textDecoration: 'underline' }}
              >
                close
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
