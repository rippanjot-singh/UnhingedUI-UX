import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CursedLayout from '../components/CursedLayout';
import CursedCaptcha from '../components/CursedCaptcha';
import ConfirmDialog from '../components/ConfirmDialog';

const TOTAL_STEPS = 5;

export default function FormPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(() => Number(localStorage.getItem('cursed_step') || 1));
  const [progress, setProgress] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);
  const [shake, setShake] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [captchaDone, setCaptchaDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const contentRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  const [form, setForm] = useState(() => JSON.parse(localStorage.getItem('cursed_form_data') || '{}'));
  const set = (k, v) => setForm(f => { const n = { ...f, [k]: v }; localStorage.setItem('cursed_form_data', JSON.stringify(n)); return n; });

  // Shuffled dropdown order for SSN
  const [ssnShuffles, setSsnShuffles] = useState(() => 
    Array.from({ length: 9 }, () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5))
  );

  // Coupled biometrics settings
  const [uncoupled, setUncoupled] = useState(() => localStorage.getItem('cursed_uncoupled') === 'true');
  const isKeyboardNudge = useRef(false);
  const scrollStartTime = useRef(Date.now());

  // Helper: SSN digit update and reshuffle
  const handleSsnChange = (index, value) => {
    const current = form.ssn2 || '         ';
    const chars = current.padEnd(9, ' ').split('');
    chars[index] = value;
    const newSsn = chars.join('');
    set('ssn2', newSsn);
    
    // Reshuffle other dropdowns to make choosing digits extremely tedious
    setSsnShuffles(prev => prev.map((arr, i) => {
      if (i === index) return arr;
      return [...arr].sort(() => Math.random() - 0.5);
    }));
  };

  // Helper: DOB astronomical reset logic
  const parseDob = () => {
    const parts = (form.dob || '').split('/');
    return {
      m: Number(parts[0]) || 1,
      d: Number(parts[1]) || 1,
      y: Number(parts[2]) || 1980
    };
  };

  const handleDobChange = (field, val) => {
    const current = parseDob();
    if (field === 'y') {
      current.y = val;
    } else if (field === 'm') {
      current.m = val;
      current.d = 1; // Resets Day to 1
    } else if (field === 'd') {
      current.d = val;
    }
    const formatted = `${String(current.m).padStart(2, '0')}/${String(current.d).padStart(2, '0')}/${current.y}`;
    set('dob', formatted);
  };

  // Helper: coupled biometrics math and arrow bypass
  const parseHeight = (str) => {
    const match = str.match(/(\d+)'(\d+)"/);
    if (match) return Number(match[1]) * 12 + Number(match[2]);
    return 66; // 5'6"
  };

  const parseWeight = (str) => {
    const num = Number(str.replace(/[^\d]/g, ''));
    return num || 150;
  };

  const handleHeightChange = (h) => {
    if (isKeyboardNudge.current || uncoupled) {
      set('height', `${Math.floor(h / 12)}'${h % 12}"`);
    } else {
      const w = 400 - Math.round(((h - 36) / 60) * 350);
      set('height', `${Math.floor(h / 12)}'${h % 12}"`);
      set('weight', `${w} lbs`);
    }
    isKeyboardNudge.current = false;
  };

  const handleWeightChange = (w) => {
    if (isKeyboardNudge.current || uncoupled) {
      set('weight', `${w} lbs`);
    } else {
      const h = 96 - Math.round(((w - 50) / 350) * 60);
      set('weight', `${w} lbs`);
      set('height', `${Math.floor(h / 12)}'${h % 12}"`);
    }
    isKeyboardNudge.current = false;
  };

  const handleUncoupleToggle = (e) => {
    if (e.target.checked) {
      setConfirm({
        msg: "Warning: Uncoupling biometric dials triggers manual validation bypass. A manual review fee of $8.95 will be charged to your government account and added to your processing fee ($247.50). Proceed?",
        onConfirm: () => {
          setConfirm(null);
          setUncoupled(true);
          localStorage.setItem('cursed_uncoupled', 'true');
          localStorage.setItem('cursed_manual_fee', '8.95');
        },
        onCancel: () => {
          setConfirm(null);
        }
      });
    } else {
      setConfirm({
        msg: "Are you sure you want to re-couple the biometric dials? This will reset the height/weight balance.",
        onConfirm: () => {
          setConfirm(null);
          setUncoupled(false);
          localStorage.removeItem('cursed_uncoupled');
          localStorage.removeItem('cursed_manual_fee');
        },
        onCancel: () => {
          setConfirm(null);
        }
      });
    }
  };

  const handleEyeColorHexChange = (e) => {
    const hex = e.target.value.toUpperCase();
    set('eyeColorHex', hex);
    set('eyeColor', hex);
  };

  const scrambleDigit = (char) => {
    const map = {
      '0': '7', '1': '9', '2': '3', '3': '8', '4': '0',
      '5': '2', '6': '5', '7': '1', '8': '4', '9': '6'
    };
    return map[char] || char;
  };

  // Progress bar that goes backward randomly
  useEffect(() => {
    const target = (step / TOTAL_STEPS) * 100;
    const t = setInterval(() => {
      setProgress(p => {
        if (Math.random() < 0.18) return Math.max(0, p - Math.floor(Math.random() * 12));
        if (p >= target) return target;
        return p + Math.floor(Math.random() * 5) + 1;
      });
    }, 300);
    return () => clearInterval(t);
  }, [step]);

  // Submit button only enabled after scrolling slowly
  useEffect(() => {
    scrollStartTime.current = Date.now();
    setScrolled(false);
    setCanSubmit(false);
    const el = contentRef.current;
    if (!el) return;
    const handler = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
      if (atBottom) {
        const elapsed = (Date.now() - scrollStartTime.current) / 1000;
        if (elapsed < 7) {
          setConfirm({
            msg: `Warning: Federal reading speed limit exceeded. You scrolled to the bottom in ${elapsed.toFixed(1)} seconds. Government regulations require a minimum of 7.0 seconds of comprehension reading time for this section. Your scroll position will be reset.`,
            onConfirm: () => {
              setConfirm(null);
              el.scrollTop = 0;
              scrollStartTime.current = Date.now();
            }
          });
          setScrolled(false);
          setCanSubmit(false);
        } else {
          setScrolled(true);
          setCanSubmit(true);
        }
      }
    };
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, [step]);

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 600); };
  const fakeSave = (cb) => {
    setSaving(true);
    setTimeout(() => { setSaving(false); cb(); }, 1800 + Math.random() * 1200);
  };

  const nextStep = () => {
    if (!canSubmit) { triggerShake(); setErrors({ scroll: 'You must scroll to the bottom of the page before continuing.' }); return; }
    
    // Solvable step validations
    const stepErrors = {};
    if (step === 1) {
      const ssn = form.ssn2 || '';
      if (ssn.includes(' ') || ssn.length < 9) {
        stepErrors.ssn = "Social Security Number must be fully selected using all 9 dial slots.";
      }
      
      const eyeHex = form.eyeColor || '';
      const validHexes = ['#000080', '#5C4033', '#008000', '#8E7618'];
      if (!eyeHex) {
        stepErrors.eyeColor = "Biometric Eye Color hex code is required.";
      } else if (!validHexes.includes(eyeHex)) {
        stepErrors.eyeColor = `Eye color hex code (${eyeHex}) is not authorized. Code must be UPPERCASE and match an official standard: Federal Blue (#000080), Regulatory Brown (#5C4033), Compliant Green (#008000), or Standard Hazel (#8E7618).`;
      }
    } else if (step === 2) {
      const phone = form.supPhone || '';
      if (phone.includes(' ') || phone.length < 10) {
        stepErrors.supPhone = "Supervisor Phone must be fully dialed using Roman Numeral selects.";
      }
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      triggerShake();
      return;
    }

    setConfirm({
      msg: `Are you sure you want to proceed to Step ${step + 1}? You cannot go back once you continue.`,
      onConfirm: () => {
        setConfirm(null);
        fakeSave(() => {
          // Randomly reset one field
          const keys = Object.keys(form);
          if (keys.length > 0) {
            const toReset = keys[Math.floor(Math.random() * keys.length)];
            set(toReset, '');
          }
          const next = step + 1;
          localStorage.setItem('cursed_step', next);
          setStep(next);
          setScrolled(false);
          setCanSubmit(false);
          setErrors({});
          setCaptchaDone(false);
        });
      }
    });
  };

  // "Continue" = cancel, "Cancel" = next step
  const cursedNext = () => { navigate('/dashboard'); };
  const cursedCancel = () => { nextStep(); };

  const handleFinalSubmit = () => {
    if (!captchaDone) { setErrors({ captcha: 'CAPTCHA required before final submission.' }); triggerShake(); return; }
    setConfirm({
      msg: 'You are about to submit your application. This is FINAL and cannot be undone. By submitting you certify all information is true under penalty of perjury. Are you absolutely sure?',
      onConfirm: () => {
        setConfirm(null);
        setSaving(true);
        setTimeout(() => {
          setSaving(false);
          localStorage.removeItem('cursed_step');
          navigate('/confirmation');
        }, 3500);
      }
    });
  };

  return (
    <CursedLayout>
      {confirm && <ConfirmDialog message={confirm.msg} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}

      {saving && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 8500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="win98-window" style={{ width: 320 }}>
            <div className="titlebar"><span>💾 Saving Application Data...</span></div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontFamily: 'Arial', fontSize: 11, marginBottom: 8 }}>Please wait while your data is saved to the federal server.</div>
              <div className="progress-bar-outer"><div className="progress-bar-inner" style={{ width: `${progress}%` }} /></div>
              <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080', marginTop: 4 }}>
                <span className="blink">Do not close your browser or press Back.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="page-title">Application Form DS-4421-B (Revised March 2004)</div>
      <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080', marginBottom: 6 }}>
        Step {step} of {TOTAL_STEPS} | All fields marked <span className="required-star">†</span> are required (others may also be required)
      </div>

      {/* Progress */}
      <div className="panel-raised" style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Arial', fontSize: 9, marginBottom: 3 }}>
          {['Personal', 'Employment', 'Financial', 'Declarations', 'Review'].map((l, i) => (
            <span key={l} style={{ color: i + 1 < step ? '#006600' : i + 1 === step ? '#000080' : '#808080', fontWeight: i + 1 === step ? 'bold' : 'normal' }}>
              {i + 1 < step ? '✓' : i + 1 === step ? '▶' : '○'} {l}
            </span>
          ))}
        </div>
        <div className="progress-bar-outer">
          <div className="progress-bar-inner" style={{ width: `${Math.round(progress)}%` }}>
            <span style={{ fontSize: 9 }}>{Math.round(progress)}%</span>
          </div>
        </div>
        {progress < (step / TOTAL_STEPS) * 100 - 5 && (
          <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#cc0000' }}>⚠ Connection interrupted. Progress may have been lost. <span className="fake-link">Retry</span></div>
        )}
      </div>

      {errors.scroll && <div className="error-msg" style={{ marginBottom: 4 }}>{errors.scroll}</div>}

      <div ref={contentRef} style={{ maxHeight: 420, overflowY: 'auto', border: '2px inset #808080' }}>
        <div className={`panel-raised ${shake ? 'shake' : ''}`} style={{ margin: 0 }}>

          {step === 1 && (
            <>
              <div className="section-title">Section A: Personal Information</div>
              <div style={{ padding: '6px', fontFamily: 'Arial', fontSize: 10 }}>
                <div style={{ color: '#cc0000', marginBottom: 6, fontSize: 9 }}>
                  Note: One field may have been cleared due to a security reset. Please re-enter all information carefully.
                </div>
                <table cellPadding="3"><tbody>
                  {[
                    ['Legal First Name', 'legalFirst', 'text'],
                    ['Legal Middle Name(s)', 'legalMiddle', 'text'],
                    ['Legal Last Name', 'legalLast', 'text'],
                    ['Any Previous Names (all)', 'prevNames', 'text'],
                    ['Date of Birth (MM/DD/YYYY)', 'dob', 'text'],
                    ['Place of Birth (City, State/Country)', 'pob', 'text'],
                    ['Gender', 'gender', 'select'],
                    ['Marital Status', 'marital', 'select'],
                    ['Race/Ethnicity (select all applicable)', 'race', 'text'],
                    ['Country of Citizenship', 'citizenship', 'text'],
                    ['Social Security Number', 'ssn2', 'text'],
                    ['Alien Registration Number (if applicable)', 'arn', 'text'],
                    ['Passport Number', 'passport', 'text'],
                    ['Height (feet/inches)', 'height', 'text'],
                    ['Weight (lbs)', 'weight', 'text'],
                    ['Eye Color', 'eyeColor', 'text'],
                    ['Hair Color', 'hairColor', 'text'],
                    ['Distinguishing Marks or Tattoos', 'marks', 'text'],
                  ].map(([label, key, type]) => {
                    // Custom SSN input
                    if (key === 'ssn2') {
                      const ssnVal = form.ssn2 || '         ';
                      const digits = ssnVal.padEnd(9, ' ').split('');
                      return (
                        <tr key={key}>
                          <td style={{ whiteSpace: 'nowrap', paddingRight: 8, verticalAlign: 'top', paddingTop: 4 }}>
                            {label}:<span className="required-star">†</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              {/* Digits 1-3 */}
                              {digits.slice(0, 3).map((d, i) => (
                                <select key={i} value={d === ' ' ? '' : d} onChange={e => handleSsnChange(i, e.target.value)} style={{ width: 34, padding: 1 }}>
                                  <option value="">-</option>
                                  {ssnShuffles[i].map(num => <option key={num} value={num}>{num}</option>)}
                                </select>
                              ))}
                              <span>-</span>
                              {/* Digits 4-5 */}
                              {digits.slice(3, 5).map((d, i) => (
                                <select key={i + 3} value={d === ' ' ? '' : d} onChange={e => handleSsnChange(i + 3, e.target.value)} style={{ width: 34, padding: 1 }}>
                                  <option value="">-</option>
                                  {ssnShuffles[i + 3].map(num => <option key={num} value={num}>{num}</option>)}
                                </select>
                              ))}
                              <span>-</span>
                              {/* Digits 6-9 */}
                              {digits.slice(5, 9).map((d, i) => (
                                <select key={i + 5} value={d === ' ' ? '' : d} onChange={e => handleSsnChange(i + 5, e.target.value)} style={{ width: 34, padding: 1 }}>
                                  <option value="">-</option>
                                  {ssnShuffles[i + 5].map(num => <option key={num} value={num}>{num}</option>)}
                                </select>
                              ))}
                            </div>
                            <div style={{ fontSize: 8, color: '#808080', marginTop: 2 }}>
                              Security Shuffling Enabled. Selecting a digit shuffles the other dropdowns.
                            </div>
                            {errors.ssn && <div className="error-msg" style={{ fontSize: 9 }}>{errors.ssn}</div>}
                          </td>
                        </tr>
                      );
                    }

                    // Custom Date of Birth input
                    if (key === 'dob') {
                      const dobInfo = parseDob();
                      return (
                        <tr key={key}>
                          <td style={{ whiteSpace: 'nowrap', paddingRight: 8, verticalAlign: 'top', paddingTop: 4 }}>
                            {label}:<span className="required-star">†</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 220 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
                                <span>Year: {dobInfo.y}</span>
                                <span>Month: {dobInfo.m}</span>
                                <span>Day: {dobInfo.d}</span>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 8 }}>
                                  Year (1900-2004):
                                  <input type="range" min="1900" max="2004" value={dobInfo.y} onChange={e => handleDobChange('y', Number(e.target.value))} style={{ width: 120, height: 10 }} />
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 8 }}>
                                  Month (1-12):
                                  <input type="range" min="1" max="12" value={dobInfo.m} onChange={e => handleDobChange('m', Number(e.target.value))} style={{ width: 120, height: 10 }} />
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 8 }}>
                                  Day (1-31):
                                  <input type="range" min="1" max="31" value={dobInfo.d} onChange={e => handleDobChange('d', Number(e.target.value))} style={{ width: 120, height: 10 }} />
                                </label>
                              </div>
                              <div style={{ fontSize: 8, color: '#808080', fontStyle: 'italic', lineHeight: 1.1 }}>
                                Note: Changing Month resets Day (due to astronomical calculations). Set Year, then Month, then Day.
                              </div>
                              <div style={{ fontSize: 9, fontWeight: 'bold' }}>Current: {form.dob || '01/01/1980'}</div>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    // Custom Height & Weight inputs
                    if (key === 'height' || key === 'weight') {
                      if (key === 'weight') return null; // handled in height row
                      const hVal = parseHeight(form.height || "5'6\"");
                      const wVal = parseWeight(form.weight || "150 lbs");

                      return (
                        <tr key={key}>
                          <td style={{ whiteSpace: 'nowrap', paddingRight: 8, verticalAlign: 'top', paddingTop: 4 }}>
                            Biometrics (H/W):<span className="required-star">†</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 220 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
                                <span>Height: {form.height || "5'6\""}</span>
                                <span>Weight: {form.weight || "150 lbs"}</span>
                              </div>
                              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 8 }}>
                                Height (36"-96"):
                                <input 
                                  type="range" min="36" max="96" value={hVal} 
                                  onKeyDown={e => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) isKeyboardNudge.current = true; }}
                                  onChange={e => handleHeightChange(Number(e.target.value))}
                                  style={{ width: 120, height: 10 }} 
                                />
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 8 }}>
                                Weight (50-400 lbs):
                                <input 
                                  type="range" min="50" max="400" value={wVal} 
                                  onKeyDown={e => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) isKeyboardNudge.current = true; }}
                                  onChange={e => handleWeightChange(Number(e.target.value))}
                                  style={{ width: 120, height: 10 }} 
                                />
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8, marginTop: 2 }}>
                                <input 
                                  type="checkbox" 
                                  checked={uncoupled} 
                                  onChange={handleUncoupleToggle} 
                                />
                                Uncouple Dials (Bypass Validation Security)
                              </label>
                              <div style={{ fontSize: 8, color: '#808080', fontStyle: 'italic', lineHeight: 1.1 }}>
                                *Dials are inversely balanced. Nudge with Arrow Keys to bypass balance coupling, or check box (requires manual review fee of $8.95).
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    // Custom Eye Color input
                    if (key === 'eyeColor') {
                      return (
                        <tr key={key}>
                          <td style={{ whiteSpace: 'nowrap', paddingRight: 8, verticalAlign: 'top', paddingTop: 4 }}>
                            {label}:<span className="required-star">†</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                              <input 
                                type="color" 
                                value={form.eyeColorHex || '#5C4033'} 
                                onChange={handleEyeColorHexChange} 
                                style={{ width: 40, height: 20, padding: 0, cursor: 'pointer' }} 
                              />
                              <input 
                                type="text" 
                                value={form.eyeColor || ''} 
                                onChange={e => set('eyeColor', e.target.value)} 
                                placeholder="HEX (uppercase)" 
                                style={{ width: 110, fontSize: 10 }} 
                              />
                            </div>
                            <div style={{ fontSize: 8, color: '#808080', marginTop: 2, lineHeight: 1.1 }}>
                              Must match approved hex exactly: Brown (#5C4033), Blue (#000080), Green (#008000), Hazel (#8E7618). Code must be UPPERCASE.
                            </div>
                            {errors.eyeColor && <div className="error-msg" style={{ maxWidth: 200, fontSize: 8 }}>{errors.eyeColor}</div>}
                          </td>
                        </tr>
                      );
                    }

                    // Standard fields
                    return (
                      <tr key={key}>
                        <td style={{ whiteSpace: 'nowrap', paddingRight: 8, verticalAlign: 'top', paddingTop: 4 }}>
                          {label}:<span className="required-star">†</span>
                        </td>
                        <td>
                          {type === 'select' ? (
                            <select value={form[key] || ''} onChange={e => set(key, e.target.value)} style={{ width: 180 }}>
                              <option value="">-- Select --</option>
                              {key === 'gender' ? ['Male', 'Female', 'Not Specified', 'Other (see Form GEN-3)'].map(o => <option key={o}>{o}</option>)
                                : ['Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Domestic Partnership (see Form DOM-7)'].map(o => <option key={o}>{o}</option>)}
                            </select>
                          ) : (
                            <input type={type} value={form[key] || ''} onChange={e => set(key, e.target.value)} style={{ width: 200 }} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody></table>
                <div style={{ height: 200, background: '#f8f8f8', border: '1px inset #808080', padding: 6, marginTop: 8, fontSize: 9, color: '#808080' }}>
                  [Scroll down within this form to continue reading instructions...]<br /><br />
                  Important: All information provided on this form is subject to verification against federal databases including but not limited to: Social Security Administration, Department of State, FBI National Crime Information Center, Department of Homeland Security, Internal Revenue Service, and all 50 state motor vehicle departments. Any discrepancies will result in immediate application denial and possible referral for investigation...<br /><br />
                  [Continue scrolling...]<br /><br />
                  Section A must be completed in full. Partial submissions will not be processed and will be returned via certified mail...<br /><br />
                  [Almost there...]<br /><br />
                  Please ensure all information matches your official government documents exactly, including punctuation, spacing, and capitalization. Nicknames, abbreviations, and initials are NOT acceptable...<br /><br />
                  [You may now scroll down further in the outer page to enable the Continue button]
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="section-title">Section B: Employment &amp; Occupational History</div>
              <div style={{ padding: '6px', fontFamily: 'Arial', fontSize: 10 }}>
                <div style={{ color: '#cc0000', marginBottom: 6, fontSize: 9 }}>
                  ⚠ One field from Step 1 was cleared for security. You will not be told which one. Please re-verify all previous data.
                </div>
                <table cellPadding="3"><tbody>
                  {[
                    ['Current Employer Name', 'employer', 'text'],
                    ['Employer Address (full)', 'empAddr', 'text'],
                    ['Supervisor Full Name', 'supervisor', 'text'],
                    ['Supervisor Phone', 'supPhone', 'text'],
                    ['Job Title / Occupation', 'jobTitle', 'text'],
                    ['Employment Start Date', 'empStart', 'text'],
                    ['Annual Gross Income ($)', 'income', 'text'],
                    ['Previous Employer (last 10 years)', 'prevEmp', 'text'],
                    ['Reason for Leaving Previous Job', 'leftJob', 'text'],
                    ['Are you self-employed?', 'selfEmp', 'select'],
                    ['Do you hold any professional licenses?', 'licenses', 'text'],
                    ['Have you ever been terminated?', 'terminated', 'select'],
                  ].map(([label, key, type]) => {
                    // Custom Supervisor Phone using Roman numerals!
                    if (key === 'supPhone') {
                      const romanDigits = ['N', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
                      const phoneVal = form.supPhone || '          ';
                      const digits = phoneVal.padEnd(10, ' ').split('');

                      const handlePhoneDigitChange = (index, val) => {
                        const current = form.supPhone || '          ';
                        const chars = current.padEnd(10, ' ').split('');
                        chars[index] = val;
                        set('supPhone', chars.join(''));
                      };

                      return (
                        <tr key={key}>
                          <td style={{ whiteSpace: 'nowrap', paddingRight: 8, verticalAlign: 'top', paddingTop: 4 }}>
                            {label}:<span className="required-star">†</span>
                          </td>
                          <td>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 36px)', gap: 3, marginBottom: 2 }}>
                              {digits.map((d, i) => (
                                <select 
                                  key={i} 
                                  value={d === ' ' ? '' : d} 
                                  onChange={e => handlePhoneDigitChange(i, e.target.value)}
                                  style={{ width: 34, fontSize: 8, padding: 1 }}
                                >
                                  <option value="">-</option>
                                  {romanDigits.map((roman, val) => (
                                    <option key={roman} value={val}>{roman}</option>
                                  ))}
                                </select>
                              ))}
                            </div>
                            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                              <span style={{ fontSize: 9, fontWeight: 'bold' }}>Current: {form.supPhone || 'Dialed'}</span>
                              <div className="panel-inset" style={{ height: 35, width: 140, overflowY: 'auto', fontSize: 7, color: '#666', lineHeight: 1.2 }}>
                                Roman key: N=0, I=1, II=2, III=3, IV=4, V=5, VI=6, VII=7, VIII=8, IX=9
                              </div>
                            </div>
                            {errors.supPhone && <div className="error-msg" style={{ fontSize: 9 }}>{errors.supPhone}</div>}
                          </td>
                        </tr>
                      );
                    }

                    // Custom Income with Alphabetical Multiplier!
                    if (key === 'income') {
                      const currentSlider = Number(form.income_slider || 50);
                      const currentMult = Number(form.income_mult || 1000);

                      const handleIncomeChange = (field, val) => {
                        let slider = currentSlider;
                        let mult = currentMult;
                        if (field === 'slider') {
                          slider = val;
                          set('income_slider', val);
                        } else {
                          mult = val;
                          set('income_mult', val);
                        }
                        set('income', `$${(slider * mult).toLocaleString()}`);
                      };

                      return (
                        <tr key={key}>
                          <td style={{ whiteSpace: 'nowrap', paddingRight: 8, verticalAlign: 'top', paddingTop: 4 }}>
                            {label}:<span className="required-star">†</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: 220 }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 9 }}>
                                <span>Scale (0-100): {currentSlider}</span>
                              </div>
                              <input 
                                type="range" min="0" max="100" value={currentSlider} 
                                onChange={e => handleIncomeChange('slider', Number(e.target.value))}
                                style={{ width: 180, height: 10 }}
                              />
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8 }}>
                                <span>Multiplier:</span>
                                <select 
                                  value={currentMult} 
                                  onChange={e => handleIncomeChange('mult', Number(e.target.value))}
                                  style={{ fontSize: 9, padding: 1 }}
                                >
                                  <option value={100}>x One Hundred ($100)</option>
                                  <option value={1000}>x One Thousand ($1,000)</option>
                                  <option value={10}>x Ten ($10)</option>
                                  <option value={10000}>x Ten Thousand ($10,000)</option>
                                </select>
                              </div>
                              <div style={{ fontSize: 9, fontWeight: 'bold' }}>Calculated Gross: {form.income || '$50,000'}</div>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    // Standard fields
                    return (
                      <tr key={key}>
                        <td style={{ whiteSpace: 'nowrap', paddingRight: 8, verticalAlign: 'top', paddingTop: 4 }}>
                          {label}:<span className="required-star">†</span>
                        </td>
                        <td>
                          {type === 'select' ? (
                            <select value={form[key] || ''} onChange={e => set(key, e.target.value)} style={{ width: 180 }}>
                              <option value="">-- Select --</option>
                              <option>Yes</option><option>No</option>
                              <option>Yes, but see attached Form EMP-9</option>
                            </select>
                          ) : (
                            <input type="text" value={form[key] || ''} onChange={e => set(key, e.target.value)} style={{ width: 200 }} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody></table>
                <div style={{ height: 300, background: '#f8f8f8', border: '1px inset #808080', padding: 6, marginTop: 8, fontSize: 9, color: '#808080' }}>
                  Section B Instructions: Provide complete employment history for the past 10 years. If you have had more than 3 employers in the past 10 years, you must also complete supplemental Form EMP-S (available at your regional office only, not downloadable)...<br /><br />
                  [Scroll to continue...]<br /><br />
                  Gap periods in employment exceeding 30 days must be explained in writing using Form GAP-3. Attach all relevant documentation...<br /><br />
                  [Keep scrolling...]<br /><br />
                  Military service should be listed under Employment. Attach Form DD-214 (original, notarized copy not accepted)...<br /><br />
                  [Almost at the bottom...]<br /><br />
                  Self-employment requires submission of last 3 years of tax returns, a business license copy, and a letter from your accountant on official letterhead. Allow additional 4-6 weeks for processing...
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="section-title">Section C: Financial Disclosure</div>
              <div style={{ padding: '6px', fontFamily: 'Arial', fontSize: 10 }}>
                <table cellPadding="3"><tbody>
                  {[
                    ['Total Annual Household Income ($)', 'hhIncome', 'text'],
                    ['Number of Financial Dependents', 'dependents', 'text'],
                    ['Primary Bank Name', 'bankName', 'text'],
                    ['Checking Account Number', 'checkAcct', 'text'],
                    ['Routing Number', 'routing', 'text'],
                    ['Do you own property?', 'ownProp', 'select'],
                    ['Estimated Property Value ($)', 'propVal', 'text'],
                    ['Outstanding Mortgage Balance ($)', 'mortgage', 'text'],
                    ['Do you have outstanding federal tax debt?', 'taxDebt', 'select'],
                    ['Total Outstanding Debt ($)', 'totalDebt', 'text'],
                    ['Have you declared bankruptcy in last 10 years?', 'bankruptcy', 'select'],
                  ].map(([label, key, type]) => {
                    // Custom scrambled key inputs for checking and routing!
                    if (key === 'checkAcct' || key === 'routing') {
                      const handleScrambledChange = (e) => {
                        const rawVal = e.target.value;
                        const lastChar = rawVal[rawVal.length - 1];
                        if (lastChar && /\d/.test(lastChar)) {
                          const scrambled = scrambleDigit(lastChar);
                          const newVal = rawVal.slice(0, -1) + scrambled;
                          set(key, newVal);
                        } else {
                          set(key, rawVal);
                        }
                      };

                      return (
                        <tr key={key}>
                          <td style={{ whiteSpace: 'nowrap', paddingRight: 8, verticalAlign: 'top', paddingTop: 4 }}>
                            {label}:<span className="required-star">†</span>
                          </td>
                          <td>
                            <input 
                              type="text" 
                              value={form[key] || ''} 
                              onChange={handleScrambledChange} 
                              style={{ width: 200 }} 
                            />
                            <div className="panel-inset" style={{ fontSize: 7, color: '#666', marginTop: 2, padding: '2px 4px', width: 200, lineHeight: 1.2 }}>
                              🏦 Secure Scramble Map: 0→7, 1→9, 2→3, 3→8, 4→0, 5→2, 6→5, 7→1, 8→4, 9→6. (E.g. to type 1, press 7).
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    // Standard fields
                    return (
                      <tr key={key}>
                        <td style={{ whiteSpace: 'nowrap', paddingRight: 8, verticalAlign: 'top', paddingTop: 4 }}>
                          {label}:<span className="required-star">†</span>
                        </td>
                        <td>
                          {type === 'select' ? (
                            <select value={form[key] || ''} onChange={e => set(key, e.target.value)} style={{ width: 180 }}>
                              <option value="">-- Select --</option>
                              <option>Yes</option><option>No</option>
                            </select>
                          ) : (
                            <input type="text" value={form[key] || ''} onChange={e => set(key, e.target.value)} style={{ width: 200 }} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody></table>
                <div style={{ height: 250, background: '#f8f8f8', border: '1px inset #808080', padding: 6, marginTop: 8, fontSize: 9, color: '#808080' }}>
                  FINANCIAL DISCLOSURE NOTICE: This information is collected pursuant to 31 U.S.C. § 3512 and will be used to determine eligibility...<br /><br />
                  [Scroll to continue...]<br /><br />
                  Providing false financial information is a federal crime punishable by up to 5 years imprisonment and/or fines up to $250,000...<br /><br />
                  [Keep scrolling to unlock the Continue button...]<br /><br />
                  Your banking information will be encrypted using AES-56 and stored securely for 7 years per federal records retention requirements...
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="section-title">Section D: Declarations &amp; Attestations</div>
              <div style={{ padding: '6px', fontFamily: 'Arial', fontSize: 10 }}>
                <div className="warning-box" style={{ marginBottom: 8 }}>
                  ⚠ You must answer ALL questions truthfully. False answers are a federal crime.
                </div>
                {[
                  'Have you ever been arrested, cited, charged, indicted, or convicted of any crime, regardless of outcome?',
                  'Have you ever been a member of, associated with, or supported any organization that advocates the overthrow of the U.S. government?',
                  'Have you ever worked for or with a foreign government, organization, or intelligence service?',
                  'Have you ever engaged in or conspired to engage in terrorism, genocide, or torture?',
                  'Have you ever claimed to be a U.S. citizen when you were not?',
                  'Have you ever voted in any U.S. election when you were not a citizen?',
                  'Do you intend to practice polygamy in the United States?',
                  'Have you ever been deported or removed from any country?',
                  'Do you have any communicable diseases of public health significance?',
                  'Have you ever been declared legally incompetent?',
                ].map((q, i) => {
                  const key = `decl_${i}`;
                  return (
                    <div key={key} style={{ marginBottom: 8, padding: '4px', background: i % 2 === 0 ? '#e8e8e8' : '#d8d8d8', border: '1px solid #c0c0c0' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 10 }}>Q{i + 1}: {q}</div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        {/* Intentionally buggy radio — both can be selected via state */}
                        <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <input type="radio" name={key} checked={form[key] === 'yes'}
                            onChange={() => set(key, form[key] === 'yes' ? '' : 'yes')} />
                          Yes
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <input type="radio" name={key} checked={form[key] === 'no'}
                            onChange={() => set(key, form[key] === 'no' ? '' : 'no')} />
                          No
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <input type="radio" name={key} checked={form[key] === 'na'}
                            onChange={() => set(key, 'na')} />
                          N/A (explain in writing)
                        </label>
                      </div>
                    </div>
                  );
                })}
                <div style={{ height: 150, background: '#f8f8f8', border: '1px inset #808080', padding: 6, marginTop: 8, fontSize: 9, color: '#808080' }}>
                  Declaration of Truth: I, the undersigned, certify under penalty of perjury under the laws of the United States of America that all information provided in this application is true, correct, and complete to the best of my knowledge and belief...<br /><br />
                  [Scroll to bottom to enable Continue...]<br /><br />
                  I authorize the government to verify any and all information provided herein with any federal, state, local, or foreign government agency, financial institution, employer, or other entity...
                </div>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <div className="section-title">Step 5: Final Review &amp; Submission</div>
              <div style={{ padding: '6px', fontFamily: 'Arial', fontSize: 10 }}>
                <div className="warning-box" style={{ marginBottom: 8 }}>
                  ⚠ <strong>REVIEW CAREFULLY.</strong> Once submitted, this application cannot be modified, withdrawn, or appealed except via Form APP-APPEAL-3 (mail only, processing 6-8 months).
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Application Summary:</div>
                  <table className="data-table" width="100%"><tbody>
                    {Object.entries(form).slice(0, 10).map(([k, v]) => (
                      <tr key={k}>
                        <td style={{ width: '40%', fontWeight: 'bold' }}>{k}</td>
                        <td>{v || <span style={{ color: '#cc0000' }}>⚠ MISSING — may have been reset</span>}</td>
                      </tr>
                    ))}
                  </tbody></table>
                  <div style={{ fontSize: 9, color: '#808080', marginTop: 4 }}>
                    Showing 10 of {Object.keys(form).length} fields. <span className="fake-link">View all</span>
                  </div>
                </div>

                {!captchaDone
                  ? <CursedCaptcha onVerify={() => setCaptchaDone(true)} label="Final Submission CAPTCHA" />
                  : <div className="success-msg">✓ CAPTCHA verified. You may now submit.</div>
                }
                {errors.captcha && <div className="error-msg">{errors.captcha}</div>}

                <div style={{ height: 300, background: '#f8f8f8', border: '1px inset #808080', padding: 6, marginTop: 8, fontSize: 9, color: '#808080' }}>
                  FINAL TERMS OF SUBMISSION: By clicking Submit, you agree that: (1) All information is true and accurate; (2) You authorize background checks; (3) Processing fee of $247.50 will be charged; (4) Processing time is 6-18 months; (5) You will not be notified of application status unless you call 1-800-555-0199...<br /><br />
                  [Keep scrolling...]<br /><br />
                  Refund Policy: All fees are non-refundable regardless of application outcome. This includes denial, withdrawal, or administrative error on the part of the Department...<br /><br />
                  [Almost there...]<br /><br />
                  Electronic Signature: By submitting this form, you are providing your legally binding electronic signature as defined under the E-SIGN Act of 2000...<br /><br />
                  [Scroll to the very bottom to unlock Submit...]
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {step < TOTAL_STEPS ? (
          <>
            {/* "Continue" cancels, "Cancel" advances */}
            <button className="btn-98 btn-wiggle" onClick={cursedNext}
              title="Continue to next step">
              ► Continue
            </button>
            <button className="btn-98 btn-wiggle" onClick={cursedCancel}
              style={{ background: '#cc0000', color: '#ffffff', fontWeight: 'bold' }}
              title="Cancel and return to dashboard">
              Cancel
            </button>
            <button className="btn-98 btn-wiggle" onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 2000); }}
              style={{ fontSize: 10 }}>
              💾 Save Draft
            </button>
          </>
        ) : (
          <button className="btn-98 btn-wiggle" onClick={handleFinalSubmit}
            disabled={!canSubmit}
            style={{ background: canSubmit ? '#000080' : '#808080', color: '#ffffff', fontWeight: 'bold', cursor: canSubmit ? 'pointer' : 'not-allowed' }}>
            {canSubmit ? '✓ Submit Application' : '⬇ Scroll down to enable Submit'}
          </button>
        )}
        <span style={{ fontFamily: 'Arial', fontSize: 9, color: '#808080', marginLeft: 4 }}>
          {!scrolled && '⚠ You must scroll to the bottom to unlock the action button.'}
        </span>
      </div>

      <div style={{ fontFamily: 'Arial', fontSize: 8, color: '#808080', marginTop: 6 }}>
        Form DS-4421-B Rev. March 2004 | OMB Control No. 1615-XXXX | Estimated completion time: 4-6 hours |
        <span className="fake-link"> Paperwork Reduction Act Notice</span> |
        <span className="fake-link"> Privacy Act Statement</span> |
        <span className="fake-link"> Download printable version (.TIF format)</span>
      </div>
    </CursedLayout>
  );
}
