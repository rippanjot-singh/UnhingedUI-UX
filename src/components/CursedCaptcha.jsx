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
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'dialup') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2500, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'beep') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
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

const UNHINGED_QUESTIONS = [
  { question: "lim(x->0) (sin(x)/x) = ?", answer: "1" },
  { question: "log2(256) = ?", answer: "8" },
  { question: "log(e) = ?", answer: "1" },
  { question: "sin(pi/2) = ?", answer: "1" },
  { question: "4 x 6 + H2O = ?", answer: "24" },
  { question: "Is water wet? (Y/N)", answer: "N" },
  { question: "1 + 1 (in binary) = ?", answer: "10" },
  { question: "d/dx(x^2) at x=3 is ?", answer: "6" },
  { question: "sqrt(169) - 3 = ?", answer: "10" },
  { question: "Write the digit 4 of Pi", answer: "1" },
];

function generateCaptcha(step) {
  // If step is 3 or random chance, throw a complex unhinged equation!
  if (step === 3 || Math.random() < 0.40) {
    const q = UNHINGED_QUESTIONS[Math.floor(Math.random() * UNHINGED_QUESTIONS.length)];
    return { question: q.question, answer: q.answer, isComplex: true };
  }

  const ops = ['+', '+', '-', 'x'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  let answer;
  if (op === '+') answer = a + b;
  else if (op === '-') answer = a - b;
  else answer = a * b;
  return { question: `${a} ${op} ${b} = ?`, answer: String(answer), isComplex: false };
}

export default function CursedCaptcha({ onVerify, label = 'CAPTCHA Verification Required' }) {
  const [captchaStep, setCaptchaStep] = useState(1);
  const [captcha, setCaptcha] = useState(() => generateCaptcha(1));
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [noiseKey, setNoiseKey] = useState(0);
  const [timeLeft, setTimeLeft] = useState(7);

  // Lockout timer count down
  useEffect(() => {
    if (!locked) return;
    if (lockTimer <= 0) { 
      setLocked(false); 
      setAttempts(0); 
      setError('Lockout lifted. Retrying Step 1...');
      setCaptchaStep(1);
      setCaptcha(generateCaptcha(1));
      setTimeLeft(7);
      return; 
    }
    const t = setInterval(() => setLockTimer(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [locked, lockTimer]);

  useEffect(() => {
    const handleSolve = () => {
      onVerify();
    };
    window.addEventListener('solve-captcha', handleSolve);
    return () => window.removeEventListener('solve-captcha', handleSolve);
  }, [onVerify]);

  // CAPTCHA speed decay countdown with Step 3 traffic latency compression jumps
  useEffect(() => {
    if (locked) return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        let decay = 1;
        // Step 3 timer compression jump chance!
        if (captchaStep === 3 && Math.random() < 0.25) {
          decay = 3;
          playCursedSound('error');
          setError('⚠️ TIME COMPRESSION: Expiration clock compressed by local server packet drift.');
        }

        if (prev <= decay) {
          // Timer ran out! Cascading Reset!
          playCursedSound('error');
          setCaptcha(generateCaptcha(1));
          setCaptchaStep(1);
          setInput('');
          setNoiseKey(k => k + 1);
          setError('⏳ CAPTCHA TIMEOUT: Verification cascading session reset back to Step 1.');
          return 7;
        }
        return prev - decay;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [locked, captchaStep]);

  const handleRefresh = () => {
    playCursedSound('beep');
    setCaptcha(generateCaptcha(1));
    setCaptchaStep(1);
    setTimeLeft(7);
    setInput('');
    setError('');
    setNoiseKey(k => k + 1);
  };

  const handleInputChange = (e) => {
    let val = e.target.value;
    
    // Reverse typing for Step 3 of 3 to maximize hilarity!
    if (captchaStep === 3 && val.length > input.length) {
      const lastChar = val.slice(-1);
      val = lastChar + input;
      playCursedSound('error');
    }
    
    setInput(val);
  };

  const handleSubmit = () => {
    if (locked) return;
    
    // Check answer case insensitively
    if (input.trim().toUpperCase() === captcha.answer.toUpperCase()) {
      playCursedSound('beep');
      if (captchaStep < 3) {
        // Advanced to next stage
        const nextStep = captchaStep + 1;
        setCaptchaStep(nextStep);
        setTimeLeft(7);
        setCaptcha(generateCaptcha(nextStep));
        setInput('');
        setNoiseKey(k => k + 1);
        setError(`✓ Stage ${captchaStep} verified! Solve Stage ${nextStep} of 3!`);
      } else {
        // Complete!
        onVerify();
      }
    } else {
      playCursedSound('error');
      // If complex chemistry question Y/N fails, throw customized humor!
      let customErr = `❌ Incorrect answer. Captcha cascade reset to Step 1!`;
      if (captcha.question.includes("Is water wet")) {
        customErr = `❌ Incorrect. Under Federal Municipal Code 14, water is declared wet on alternate Thursdays only. Captcha reset!`;
      }
      
      setAttempts(a => {
        const next = a + 1;
        if (next >= 3) {
          setLocked(true);
          setLockTimer(30);
          setError(`🚨 SECURITY MATRIX LOCKEDOUT: Too many attempts. Security matrix locked for 30s.`);
        } else {
          setError(`${customErr} (Attempt ${next} of 3)`);
        }
        return next;
      });
      
      setCaptchaStep(1);
      setTimeLeft(7);
      setCaptcha(generateCaptcha(1));
      setInput('');
      setNoiseKey(k => k + 1);
    }
  };

  const handleAudioCaptchaRequest = (e) => {
    e.preventDefault();
    playCursedSound('dialup');
    alert("⚠️ AUDIO CAPTCHA TRANSMISSION INITIATED:\n\nYour synthesized audio passcode has been transmitted via administrative fax to your nearest regional municipal postal node.\n\nPlease visit the post office in person within 24 hours, request Registry Envelope DS-FAX, and present two forms of government identification to retrieve your 3-digit CAPTCHA code.");
  };

  // Noise lines rendered as inline svg
  const noiseLines = Array.from({ length: 6 }, (_, i) => ({
    x1: Math.random() * 200, y1: Math.random() * 50,
    x2: Math.random() * 200, y2: Math.random() * 50,
    color: ['#cc0000','#0000cc','#006600','#cc6600'][i % 4],
  }));

  return (
    <div className="panel-raised" style={{ maxWidth: 320, marginTop: 6, border: '1px solid #808080', background: '#c0c0c0', padding: 8 }}>
      <div className="section-title" style={{ marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#404040', marginBottom: 4, lineHeight: 1.15 }}>
        To prevent automated math scripts, solve <strong>three verification equations in a row</strong>.
        Each stage expires in 7 seconds. <strong>A single failure resets progress to Step 1.</strong>
      </div>

      {/* Speed Decay progress bar */}
      {!locked && (
        <div style={{ border: '2px inset #808080', background: '#d0d0d0', height: 14, position: 'relative', margin: '4px 0', width: 220 }}>
          <div style={{
            background: timeLeft > 2 ? '#000080' : '#cc0000',
            height: '100%',
            width: `${(timeLeft / 7) * 100}%`,
            transition: 'width 1s linear'
          }} />
          <span style={{ position: 'absolute', top: 1, left: 4, fontSize: 8, color: timeLeft > 2.5 ? '#fff' : '#000', fontFamily: 'Arial', fontWeight: 'bold' }}>
            ⏳ CASCADE EXPIRES: {timeLeft}s | Step {captchaStep} of 3
          </span>
        </div>
      )}

      {/* Visual CAPTCHA */}
      <div style={{ position: 'relative', marginBottom: 4, display: 'inline-block' }}>
        <svg key={noiseKey} width="220" height="50" style={{ display: 'block', background: '#f0f0e0', border: '2px inset #808080' }}>
          {/* Noise lines */}
          {noiseLines.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.color} strokeWidth="1" opacity="0.5" />
          ))}
          {/* Dots */}
          {Array.from({ length: 20 }, (_, i) => (
            <circle key={i} cx={Math.random() * 220} cy={Math.random() * 50} r="1.5" fill="#888" opacity="0.4" />
          ))}
          {/* CAPTCHA text */}
          <text
            x="110" y="32"
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontSize={captcha.isComplex ? "14" : "20"}
            fontWeight="bold"
            fill="#cc0000"
            transform={`rotate(${Math.random() * 4 - 2}, 110, 25)`}
            style={{ textDecoration: 'line-through' }}
          >
            {captcha.question}
          </text>
        </svg>
      </div>

      <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 4 }}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{ width: 100, fontSize: 11, fontFamily: 'monospace' }}
          disabled={locked}
          placeholder={captchaStep === 3 ? "sdrawkcab epyT" : "Answer"}
          maxLength={15}
        />
        <button className="btn-98" onClick={handleRefresh} style={{ fontSize: 10, padding: '1px 5px', minWidth: 'unset' }} title="Reset Cascade">
          🔄
        </button>
        <button className="btn-98 btn-wiggle" onClick={handleSubmit} disabled={locked} style={{ fontSize: 10, padding: '1px 8px', fontWeight: 'bold' }}>
          Verify
        </button>
      </div>

      {captchaStep === 3 && (
        <div style={{ fontFamily: 'Arial', fontSize: 7, color: '#cc0000', fontWeight: 'bold', marginBottom: 2 }}>
          ⚠️ SECURITY WARNING: Character inversion array engaged. Inputs rendered backwards.
        </div>
      )}

      {locked && (
        <div className="error-msg" style={{ marginBottom: 3, fontSize: 9 }}>
          <span className="blink">🔒 SYSTEM LOCKOUT:</span> Multi-stage lock active. Wait {lockTimer}s...
        </div>
      )}
      {error && !locked && (
        <div style={{ 
          fontFamily: 'Arial', 
          fontSize: 9, 
          color: error.includes('✓') ? '#006600' : '#cc0000', 
          fontWeight: 'bold', 
          margin: '3px 0',
          lineHeight: 1.15
        }}>
          {error}
        </div>
      )}

      <div style={{ fontFamily: 'Arial', fontSize: 8, color: '#808080', marginTop: 4 }}>
        Cannot read? <span className="fake-link" onClick={handleAudioCaptchaRequest}>Request audio CAPTCHA</span> | 
        <span className="fake-link" onClick={() => window.dispatchEvent(new CustomEvent('cursed-link', { detail: "508 Compliance Notice" }))}> Accessibility options</span>
        <br />
        CAPTCHA service provided by SecureNet™ Anti-Bot Solutions v1.4.2
      </div>
    </div>
  );
}
