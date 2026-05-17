import { useState, useEffect, useRef } from 'react';
import clownWorldMp3 from '../assets/phantasticbeats-clown-world-fast-annoying-312436.mp3';

// Cursed sound synthesizer using Web Audio API
const playCursedSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (type === 'error') {
      // Harsh low frequency buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'aim_bong') {
      // Classic AIM warning/chat sound
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.frequency.setValueAtTime(600, ctx.currentTime);
      osc2.frequency.setValueAtTime(604, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.5);
      osc2.stop(ctx.currentTime + 0.5);
    } else if (type === 'dialup') {
      // Synthesized short screechy dial-up handshake sequence
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      // Sweeping pitch
      osc.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.4);
      osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.4);
      osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.8);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.9);
    } else if (type === 'floppy') {
      // Gritty clicking motor noise
      let startTime = ctx.currentTime;
      for (let i = 0; i < 6; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(80 + Math.random() * 20, startTime);
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.05);
        startTime += 0.08;
      }
    }
  } catch (e) {
    console.error('Audio synthesis failed:', e);
  }
};

const ASSISTANT_MESSAGES = [
  "It looks like you are trying to verify your citizenship. Did you know that the United States was founded in 1776? Please type 'I love democracy' in all inputs to proceed faster.",
  "Warning: Moving your mouse too quickly causes server cooling fans to work harder. Please navigate in a calm, patriotic manner.",
  "Under Section 42 of the Federal Paperwork Reduction Act of 1995, I am legally required to float here and block at least 15% of your screen.",
  "Are you having trouble with our drop-down menus? Try clicking them exactly 7 times to unlock the administrative bypass.",
  "Did you know? Form DS-4421-B must be submitted in quadruplicate if you have ever eaten a hotdog in Washington D.C.",
  "Pro-tip: If you register your computer's monitor with the Department of Displays, your processing wait time drops by 1.4 business seconds!",
  "Are you sure you typed your mother's maiden name correctly? Our federal archive database suggests it may contain more vowels.",
  "I am Govvy the Citizen Eagle! I am here to help you comply with our beautifully complex procedures! 🦅🇺🇸"
];

const BOT_RESPONSES = [
  "Away Message: Currently at lunch. Back in 4 hours. (If urgent, file Form AWY-77).",
  "Please refer to Chapter 14, Subsection B, Page 472 of the portal handbook.",
  "Have you tried turning your 56k dial-up modem off and back on again?",
  "Please type slower. Our Reston server runs on coal and cannot keep up with high-speed typing.",
  "Error: Input unrecognized. Did you mean: 'How do I pay my citizen fee of $247.50?'",
  "Buddy List Update: support_supervisor just signed off.",
  "System Message: Your session queue number is 4,721. Please do not close this window.",
  "🦅 🇺🇸 AMERICA! LAND OF THE FREE (SUBJECT TO ADMINISTRATIVE FEES) 🇺🇸 🦅"
];

export default function CursedAssistant() {
  const [govvyMsg, setGovvyMsg] = useState("Hello, Citizen! I am Govvy the Eagle! 🦅 Ready to fill out 45 pages of documentation?");
  const [govvyPos, setGovvyPos] = useState({ x: 20, y: 350 });
  const [govvyVisible, setGovvyVisible] = useState(true);
  const [govvyDragging, setGovvyDragging] = useState(false);
  const govvyRef = useRef(null);

  // AIM Chat states
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'US_Gov_HelpBot', text: 'Welcome to federal AIM chat support! My name is Officer Jenkins. I am here to assist you with compliance.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const [chatPos, setChatPos] = useState({ x: 450, y: 150 });
  const [chatDragging, setChatDragging] = useState(false);

  // Speed Limit Warning states
  const [showSpeedWarning, setShowSpeedWarning] = useState(false);
  const [speedWarningCount, setSpeedWarningCount] = useState(0);
  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() });

  // Draggable drag offsets
  const dragOffset = useRef({ x: 0, y: 0 });

  // Floating Windows Media Player 98 States
  const [wmpOpen, setWmpOpen] = useState(true);
  const [wmpPlaying, setWmpPlaying] = useState(false);
  const [wmpVolume, setWmpVolume] = useState(0.85);
  const [wmpCurrentTime, setWmpCurrentTime] = useState(0);
  const [wmpDuration, setWmpDuration] = useState(0);
  const [wmpMuted, setWmpMuted] = useState(false);
  const [wmpPos, setWmpPos] = useState({ x: 740, y: 340 });
  const [wmpDragging, setWmpDragging] = useState(false);
  const [wmpWarningOpen, setWmpWarningOpen] = useState(false);
  const [wmpWarningCountdown, setWmpWarningCountdown] = useState(3);
  const [visualizerLevels, setVisualizerLevels] = useState([3, 4, 2, 5, 1, 4, 3, 2, 4, 5, 2, 1]);
  const audioRef = useRef(null);

  // Global sound triggers on mouseover/click for buttons to maximize chaos
  useEffect(() => {
    const handleGlobalInteraction = (e) => {
      const target = e.target;
      if (target.tagName === 'BUTTON' || target.classList.contains('btn-98') || target.tagName === 'A') {
        if (e.type === 'click') {
          if (Math.random() < 0.25) {
            playCursedSound('error');
          } else {
            playCursedSound('floppy');
          }
        } else if (e.type === 'mouseover') {
          if (Math.random() < 0.15) {
            playCursedSound('floppy');
          }
        }
      }
    };

    window.addEventListener('click', handleGlobalInteraction);
    window.addEventListener('mouseover', handleGlobalInteraction);
    return () => {
      window.removeEventListener('click', handleGlobalInteraction);
      window.removeEventListener('mouseover', handleGlobalInteraction);
    };
  }, []);

  // Monitor mouse movements for "Speed Limit" warning
  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = Date.now();
      const dt = now - lastMousePos.current.time;
      if (dt > 100) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = (distance / dt) * 1000;

        if (speed > 1800 && !showSpeedWarning && speedWarningCount < 3) {
          playCursedSound('error');
          setShowSpeedWarning(true);
          setSpeedWarningCount(c => c + 1);
        }

        lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showSpeedWarning, speedWarningCount]);

  // Govvy random movements and periodic messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.35 && govvyVisible) {
        const newX = Math.max(10, Math.min(window.innerWidth - 180, govvyPos.x + (Math.random() * 160 - 80)));
        const newY = Math.max(80, Math.min(window.innerHeight - 200, govvyPos.y + (Math.random() * 160 - 80)));
        setGovvyPos({ x: newX, y: newY });
        
        const msg = ASSISTANT_MESSAGES[Math.floor(Math.random() * ASSISTANT_MESSAGES.length)];
        setGovvyMsg(msg);
        playCursedSound('floppy');
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [govvyPos, govvyVisible]);

  // Periodically open AIM support window if closed
  useEffect(() => {
    const openTimer = setTimeout(() => {
      if (!chatOpen) {
        setChatOpen(true);
        playCursedSound('aim_bong');
      }
    }, 18000);
    return () => clearTimeout(openTimer);
  }, [chatOpen]);

  // Global Compliance Audio Setup
  useEffect(() => {
    const aud = new Audio(clownWorldMp3);
    aud.loop = true;
    aud.playbackRate = 1.15;
    aud.volume = 0.85;
    audioRef.current = aud;

    const handleLoadedMetadata = () => {
      setWmpDuration(aud.duration);
    };
    const handleTimeUpdate = () => {
      setWmpCurrentTime(aud.currentTime);
    };

    aud.addEventListener('loadedmetadata', handleLoadedMetadata);
    aud.addEventListener('timeupdate', handleTimeUpdate);

    // Try autoplay on first click anywhere in the window
    const enableAutoplay = () => {
      aud.play().then(() => {
        setWmpPlaying(true);
      }).catch(e => console.log("Autoplay blocked/deferred", e));
      window.removeEventListener('click', enableAutoplay);
      window.removeEventListener('keydown', enableAutoplay);
    };
    window.addEventListener('click', enableAutoplay);
    window.addEventListener('keydown', enableAutoplay);

    return () => {
      aud.pause();
      if (aud.dialupInterval) {
        clearInterval(aud.dialupInterval);
      }
      aud.removeEventListener('loadedmetadata', handleLoadedMetadata);
      aud.removeEventListener('timeupdate', handleTimeUpdate);
      window.removeEventListener('click', enableAutoplay);
      window.removeEventListener('keydown', enableAutoplay);
    };
  }, []);

  // peak levels wiggling animation interval
  useEffect(() => {
    if (!wmpPlaying) return;
    const t = setInterval(() => {
      setVisualizerLevels(Array.from({ length: 12 }, () => Math.floor(Math.random() * 6)));
    }, 150);
    return () => clearInterval(t);
  }, [wmpPlaying]);

  // WMP warning countdown
  useEffect(() => {
    if (!wmpWarningOpen) return;
    if (wmpWarningCountdown <= 0) {
      setWmpWarningOpen(false);
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log(e));
        setWmpPlaying(true);
      }
      return;
    }
    const t = setTimeout(() => {
      setWmpWarningCountdown(c => c - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [wmpWarningOpen, wmpWarningCountdown]);

  // Draggable logic for Govvy
  const handleGovvyStart = (e) => {
    setGovvyDragging(true);
    dragOffset.current = { x: e.clientX - govvyPos.x, y: e.clientY - govvyPos.y };
  };

  // Draggable logic for AIM
  const handleChatStart = (e) => {
    setChatDragging(true);
    dragOffset.current = { x: e.clientX - chatPos.x, y: e.clientY - chatPos.y };
  };

  // Draggable logic for Windows Media Player
  const handleWmpStart = (e) => {
    setWmpDragging(true);
    dragOffset.current = { x: e.clientX - wmpPos.x, y: e.clientY - wmpPos.y };
  };

  useEffect(() => {
    const handleGlobalMove = (e) => {
      if (govvyDragging) {
        setGovvyPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
      }
      if (chatDragging) {
        setChatPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
      }
      if (wmpDragging) {
        setWmpPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y });
      }
    };

    const handleGlobalUp = () => {
      setGovvyDragging(false);
      setChatDragging(false);
      setWmpDragging(false);
    };

    if (govvyDragging || chatDragging || wmpDragging) {
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('mouseup', handleGlobalUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalUp);
    };
  }, [govvyDragging, chatDragging, wmpDragging]);

  const sendChatMessage = () => {
    if (!inputText.trim()) return;
    const userMsg = { sender: 'Citizen_992', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setBotTyping(true);
    playCursedSound('floppy');

    setTimeout(() => {
      const resp = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
      setMessages(prev => [...prev, { sender: 'US_Gov_HelpBot', text: resp }]);
      setBotTyping(false);
      playCursedSound('aim_bong');
    }, 1500 + Math.random() * 1500);
  };

  // Cursed WMP Interactivities
  const handleWmpPauseStop = () => {
    playCursedSound('error');
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setWmpPlaying(false);
    setWmpWarningOpen(true);
    setWmpWarningCountdown(3);
  };

  const handleWmpPlay = () => {
    if (wmpWarningOpen) {
      alert("⚠️ NOTICE: Visual and auditory stimulus override override. Compliance audio recovery in progress.");
      return;
    }
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setWmpPlaying(true);
      }).catch(e => console.log(e));
    }
  };

  const handleVolumeSlider = (val) => {
    if (Math.random() < 0.66) {
      if (audioRef.current) {
        audioRef.current.volume = 1.0;
      }
      setWmpVolume(1.0);
      playCursedSound('error');
      alert("⚠️ AUDITED REGULATION ENFORCEMENT: Volume automatically maximized to meet Federal Audibility Standard 88-B. Do not attempt to reduce compliance stimulation audio volume.");
    } else {
      if (audioRef.current) {
        audioRef.current.volume = val;
      }
      setWmpVolume(val);
    }
  };

  const handleSeekSlider = (val) => {
    if (!audioRef.current) return;
    if (Math.random() < 0.50) {
      const randomOffset = Math.random() * (wmpDuration || 60);
      audioRef.current.currentTime = randomOffset;
      setWmpCurrentTime(randomOffset);
      playCursedSound('error');
      alert("⚠️ DATAGRAM CONGESTION: Multiplexer connection jitter offset seek frame by a random duration due to local server packet loss.");
    } else {
      audioRef.current.currentTime = val;
      setWmpCurrentTime(val);
    }
  };

  const handleMuteToggle = () => {
    if (!audioRef.current) return;
    if (!wmpMuted) {
      audioRef.current.volume = 0;
      setWmpMuted(true);
      playCursedSound('dialup');
      alert("⚠️ SECURE TUNNEL PROTOCOL: Auditory compliance channel has been muted, but local bypass triggered. Continuous server handshake tone injected to verify connection stability.");
      
      const dialupInterval = setInterval(() => {
        playCursedSound('dialup');
      }, 1000);
      audioRef.current.dialupInterval = dialupInterval;
    } else {
      if (audioRef.current.dialupInterval) {
        clearInterval(audioRef.current.dialupInterval);
        audioRef.current.dialupInterval = null;
      }
      audioRef.current.volume = wmpVolume;
      setWmpMuted(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {/* 1. Govvy the Eagle Floating Assistant */}
      {govvyVisible && (
        <div
          ref={govvyRef}
          style={{
            position: 'absolute',
            left: govvyPos.x,
            top: govvyPos.y,
            width: 170,
            pointerEvents: 'all',
            background: '#ffffcc',
            border: '1px solid #000000',
            padding: 5,
            boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
            fontFamily: 'Comic Sans MS, cursive, sans-serif',
            fontSize: 9,
            lineHeight: 1.2,
          }}
        >
          {/* Govvy Header */}
          <div
            style={{
              background: '#000080',
              color: '#ffffff',
              padding: '1px 3px',
              fontFamily: 'Arial',
              fontWeight: 'bold',
              cursor: 'move',
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 4,
            }}
            onMouseDown={handleGovvyStart}
          >
            <span>Govvy Assistant</span>
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => {
                playCursedSound('error');
                alert("⚠️ NOTICE: Closing the government assistant requires filling out Form CLOSE-EAGLE-3 in triplicate. Govvy will temporarily remain to ensure federal compliance.");
              }}
            >
              ✕
            </span>
          </div>

          <div style={{ textAlign: 'center', fontSize: 24, marginBottom: 2 }}>🦅</div>
          
          <div
            className="panel-inset"
            style={{
              background: '#ffffff',
              padding: 4,
              border: '1px solid #808080',
              borderRadius: 3,
              fontSize: 9,
              marginBottom: 4,
            }}
          >
            {govvyMsg}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              className="btn-98"
              style={{ fontSize: 8, padding: '1px 4px', minWidth: 'unset' }}
              onClick={() => {
                const randMsg = ASSISTANT_MESSAGES[Math.floor(Math.random() * ASSISTANT_MESSAGES.length)];
                setGovvyMsg(randMsg);
                playCursedSound('dialup');
              }}
            >
              Ask For Help
            </button>
          </div>
        </div>
      )}

      {/* 2. AIM Chat Window (AOL Instant Messenger style) */}
      {chatOpen && (
        <div
          style={{
            position: 'absolute',
            left: chatPos.x,
            top: chatPos.y,
            width: 320,
            pointerEvents: 'all',
            background: '#f1f1f1',
            borderTop: '2px solid #ffffff',
            borderLeft: '2px solid #ffffff',
            borderRight: '2px solid #555555',
            borderBottom: '2px solid #555555',
            boxShadow: '3px 3px 0 #000',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(to right, #04246c, #a4c4f4)',
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: 10,
              padding: '2px 4px',
              cursor: 'move',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onMouseDown={handleChatStart}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span>💬</span> Buddy Chat: US_Gov_HelpBot
            </span>
            <div style={{ display: 'flex', gap: 1 }}>
              <button 
                style={{ background: '#c0c0c0', border: '1px solid #777', width: 12, height: 10, fontSize: 6, padding: 0, cursor: 'pointer' }}
                onClick={() => setChatOpen(false)}
              >
                _
              </button>
              <button 
                style={{ background: '#c0c0c0', border: '1px solid #777', width: 12, height: 10, fontSize: 6, padding: 0, cursor: 'pointer', fontWeight: 'bold' }}
                onClick={() => {
                  playCursedSound('error');
                  alert("Warning: Closing secure support messenger terminates active citizen queue location. Spawning backup helper.");
                  playCursedSound('aim_bong');
                }}
              >
                ✕
              </button>
            </div>
          </div>

          <div style={{ background: '#ffdd00', color: '#000', fontSize: 8, padding: '1px 4px', borderBottom: '1px solid #777', textAlign: 'center' }}>
            ⚠️ Chat warning level: 0% | <span className="fake-link" style={{ fontSize: 8 }}>Block buddy</span>
          </div>

          <div style={{ display: 'flex', padding: 3, gap: 3 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div
                style={{
                  height: 120,
                  background: '#ffffff',
                  border: '1.5px inset #808080',
                  overflowY: 'auto',
                  padding: 4,
                  fontSize: 9,
                }}
              >
                {messages.map((m, i) => (
                  <div key={i} style={{ marginBottom: 4, wordBreak: 'break-word' }}>
                    <span
                      style={{
                        fontWeight: 'bold',
                        color: m.sender === 'US_Gov_HelpBot' ? '#ff0000' : '#0000ff',
                      }}
                    >
                      {m.sender}:
                    </span>{' '}
                    <span>{m.text}</span>
                  </div>
                ))}
                {botTyping && (
                  <div style={{ color: '#888', fontStyle: 'italic' }}>US_Gov_HelpBot is typing...</div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 2 }}>
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                  style={{ flex: 1, fontSize: 9, padding: '1px 3px' }}
                  placeholder="Type message here..."
                />
                <button
                  className="btn-98"
                  style={{ fontSize: 9, minWidth: 'unset', padding: '1px 6px' }}
                  onClick={sendChatMessage}
                >
                  Send
                </button>
              </div>
            </div>

            <div
              style={{
                width: 65,
                background: '#e0e0e0',
                border: '1px outset #fff',
                padding: 2,
                fontSize: 8,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold', borderBottom: '1px solid #aaa', marginBottom: 2 }}>Buddy Icon</div>
                <div style={{ fontSize: 20 }}>👮‍♂️</div>
              </div>
              <div style={{ fontSize: 7, color: '#808080' }}>
                AIM Ver. 5.2<br />
                <span className="fake-link" style={{ fontSize: 7 }}>Info</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Satirical Mouse Speed Warning Modal */}
      {showSpeedWarning && (
        <div className="modal-backdrop" style={{ zIndex: 9999, pointerEvents: 'all' }}>
          <div className="win98-window" style={{ width: 360 }}>
            <div className="titlebar" style={{ background: '#cc0000', display: 'flex', justifyContent: 'space-between' }}>
              <span>🚨 FEDERAL CURSOR SPEED WARNING</span>
              <span className="titlebar-btn" onClick={() => setShowSpeedWarning(false)}>✕</span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 32 }}>🚨</span>
                <div>
                  <div style={{ fontFamily: 'Arial', fontSize: 11, fontWeight: 'bold', color: '#cc0000', marginBottom: 4 }}>
                    CURSOR SPEED LIMIT EXCEEDED
                  </div>
                  <div style={{ fontFamily: 'Arial', fontSize: 10, lineHeight: 1.3 }}>
                    The server detected your mouse pointer moving at <strong>2,450 px/second</strong>.<br /><br />
                    Under DHS cyber security protocol 7-A, rapid pointer movements can trigger database overflow, 
                    artificial traffic spikes, and server cooling fan exhaustion.<br /><br />
                    Please navigate at a patriotic, measured speed (maximum 350 px/sec) to avoid federal warning penalty logs.
                  </div>
                </div>
              </div>
              <div className="hr-98" style={{ margin: '8px 0' }} />
              <div style={{ textAlign: 'right' }}>
                <button
                  className="btn-98"
                  onClick={() => {
                    setShowSpeedWarning(false);
                    playCursedSound('dialup');
                  }}
                  style={{ padding: '2px 12px', fontWeight: 'bold' }}
                >
                  I Promise to Scroll Slower
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Windows Media Player 98 Widget (Mandatory Auditory Compliance Loop) */}
      {wmpOpen && (
        <div
          style={{
            position: 'absolute',
            left: wmpPos.x,
            top: wmpPos.y,
            width: 250,
            pointerEvents: 'all',
            background: '#c0c0c0',
            borderTop: '2.5px solid #ffffff',
            borderLeft: '2.5px solid #ffffff',
            borderRight: '2.5px solid #555555',
            borderBottom: '2.5px solid #555555',
            boxShadow: '3px 3px 0 #000',
            fontFamily: 'Arial, sans-serif',
            zIndex: 9000
          }}
        >
          {/* Player Titlebar */}
          <div
            style={{
              background: 'linear-gradient(to right, #000080, #80c0ff)',
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: 10,
              padding: '2px 4px',
              cursor: 'move',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onMouseDown={handleWmpStart}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span>▶</span> Windows Media Player
            </span>
            <div style={{ display: 'flex', gap: 1 }}>
              <span
                className="titlebar-btn"
                style={{ cursor: 'pointer', padding: '0 2px' }}
                onClick={() => {
                  playCursedSound('error');
                  alert("⚠️ DIRECTIVE DHS-99: Minimizing compliance audio player is locked to ensure constant citizen stimulus exposure.");
                }}
              >
                _
              </span>
              <span
                className="titlebar-btn"
                style={{ cursor: 'pointer', padding: '0 2px', fontWeight: 'bold' }}
                onClick={() => {
                  playCursedSound('error');
                  alert("⚠️ ACCESS COMPLIANCE ALERT: Termination of compliance soundtrack is prohibited. Access code denied.");
                }}
              >
                ✕
              </span>
            </div>
          </div>

          {/* Menus */}
          <div style={{ display: 'flex', gap: 6, fontSize: 8, padding: '2px 6px', borderBottom: '1px solid #808080', background: '#c0c0c0' }}>
            {['File', 'View', 'Play', 'Favorites', 'Help'].map(m => (
              <span key={m} style={{ cursor: 'pointer' }} onClick={() => alert(`Warning: ${m} options are restricted to regional portal administrators.`)}>{m}</span>
            ))}
          </div>

          <div style={{ padding: 4 }}>
            {/* Visualizer Panel */}
            <div style={{
              height: 48,
              background: '#000000',
              border: '2.5px inset #808080',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              padding: '2px 8px',
              marginBottom: 4,
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* LED visualizer blocks */}
              {visualizerLevels.map((lvl, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  width: 14,
                  height: '100%',
                  justifyContent: 'flex-end'
                }}>
                  {Array.from({ length: 6 }).map((_, blockIdx) => {
                    const isActive = 6 - blockIdx <= lvl;
                    let color = '#00ff00';
                    if (blockIdx <= 1) color = '#ff0000';
                    else if (blockIdx <= 3) color = '#ffcc00';
                    return (
                      <div
                        key={blockIdx}
                        style={{
                          height: 4,
                          width: '100%',
                          background: isActive ? color : '#112211',
                          border: '0.5px solid #000'
                        }}
                      />
                    );
                  })}
                </div>
              ))}
              
              <div style={{
                position: 'absolute',
                top: 2,
                left: 0,
                width: '100%',
                textAlign: 'center',
                color: '#00ff00',
                fontFamily: 'monospace',
                fontSize: 8,
                textShadow: '1px 1px #000',
                pointerEvents: 'none'
              }}>
                {wmpPlaying ? '🤡 COMPLIANCE BEAT CLOWN_WORLD.MP3 🤡' : '⏸ SYSTEM COMPLIANCE OVERRIDE'}
              </div>
            </div>

            {/* Seek bar and Time display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <input
                type="range"
                min={0}
                max={wmpDuration || 100}
                value={wmpCurrentTime}
                onChange={(e) => handleSeekSlider(parseFloat(e.target.value))}
                style={{
                  flex: 1,
                  height: 10,
                  cursor: 'pointer',
                  accentColor: '#000080'
                }}
              />
              <div style={{ fontFamily: 'monospace', fontSize: 8, color: '#000', minWidth: 54 }}>
                {Math.floor(wmpCurrentTime / 60)}:{( '0' + Math.floor(wmpCurrentTime % 60) ).slice(-2)}
              </div>
            </div>

            {/* Silver Outset Bottom Player buttons */}
            <div style={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #808080', paddingTop: 4 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                <button
                  className="btn-98"
                  onClick={handleWmpPlay}
                  style={{
                    padding: '2px 6px',
                    fontSize: 8,
                    fontWeight: 'bold',
                    minWidth: 26,
                    background: wmpPlaying ? '#dcdcdc' : '#c0c0c0'
                  }}
                >
                  ▶ Play
                </button>
                <button
                  className="btn-98"
                  onClick={handleWmpPauseStop}
                  style={{
                    padding: '2px 6px',
                    fontSize: 8,
                    fontWeight: 'bold',
                    minWidth: 26
                  }}
                >
                  ❚❚ Pause
                </button>
                <button
                  className="btn-98"
                  onClick={handleWmpPauseStop}
                  style={{
                    padding: '2px 6px',
                    fontSize: 8,
                    fontWeight: 'bold',
                    minWidth: 26
                  }}
                >
                  ■ Stop
                </button>
              </div>
              
              <div style={{ fontSize: 7, color: '#555', fontStyle: 'italic' }}>
                WMP Ver. 9.0
              </div>
            </div>

            {/* Volume slider & mute */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 8, marginTop: 4, padding: '2px', background: '#d0d0d0', border: '1.5px inset #808080' }}>
              <span style={{ fontSize: 9 }}>🔊</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={wmpVolume}
                onChange={(e) => handleVolumeSlider(parseFloat(e.target.value))}
                style={{ flex: 1, height: 6 }}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 7 }}>
                <input type="checkbox" checked={wmpMuted} onChange={handleMuteToggle} style={{ margin: 0, width: 9, height: 9 }} />
                Mute
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 5. Satirical compliance music stopping warning modal */}
      {wmpWarningOpen && (
        <div className="modal-backdrop" style={{ zIndex: 9999, pointerEvents: 'all' }}>
          <div className="win98-window shake" style={{ width: 340 }}>
            <div className="titlebar" style={{ background: '#cc0000', display: 'flex', justifyContent: 'space-between' }}>
              <span>⚠️ DIRECTIVE INFRINGEMENT ALERT</span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 32 }}>⚠️</span>
                <div style={{ fontFamily: 'Arial', fontSize: 11, fontWeight: 'bold', color: '#cc0000' }}>
                  COMPLIANCE STIMULUS SUSPENDED (DHS-99)
                </div>
              </div>
              <div style={{ fontFamily: 'Arial', fontSize: 10, marginBottom: 8, lineHeight: 1.3 }}>
                Under federal citizen portal guidelines, active auditive compliance loops must remain broadcasting 
                to ensure focus, patriotism, and administrative compliance.<br /><br />
                Your security volume logs have been flagged. The frantic loop will automatically resume to maintain compliance.
                <br /><br />
                <span className="blink" style={{ color: '#cc0000', fontWeight: 'bold' }}>
                  RESTORING COMPLIANCE AUDIO IN: {wmpWarningCountdown} SECONDS...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
