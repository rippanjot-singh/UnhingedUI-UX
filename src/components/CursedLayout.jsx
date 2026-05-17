import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SessionTimeoutModal from './SessionTimeoutModal';
import NotificationSpam from './NotificationSpam';
import PopupAd from './PopupAd';
import FakeVirusWarning from './FakeVirusWarning';
import CursedAssistant from './CursedAssistant';

const LINK_RESPONSES = {
  'About This Portal': {
    title: 'ℹ About This Portal',
    body: 'Commenced in 1997 as a secure bulletin board, this portal represents the pinnacle of 2004 federal web engineering. Powered by a single Pentium II processor in a damp basement in Reston, VA.',
    icon: '🏛'
  },
  'Contact Us': {
    title: '✉ Contact Information',
    body: 'Please write your request on physical parchment, secure a 37-cent stamp, and mail it to:\n\nBureau of Inefficient Correspondence\nPO Box 991, Washington DC.\n\nResponse time: 18–24 business months.',
    icon: '✉'
  },
  'FAQ': {
    title: '❓ FAQ Section A-1',
    body: 'Q: Why does this site look like this?\nA: To ensure compatibility with standard 2001 monochrome CRT monitors.\n\nQ: Why is my session constantly expiring?\nA: Security builds citizen character.',
    icon: '❓'
  },
  'Forms & Downloads': {
    title: '💾 Forms & Downloads Center',
    body: 'All forms must be downloaded as compressed .ARJ archives via our secure 56k dial-up mirror.\n\nMirror Status: OFFLINE (Due to high tidal waves affecting Reston server room).',
    icon: '💾'
  },
  'Privacy Policy': {
    title: '🕵 Privacy Policy Compliance',
    body: 'Your data is secure. By "secure", we mean it is shared with exactly 18 authorized federal agencies and a handful of approved commercial vacuum cleaner manufacturers for quality auditing.',
    icon: '🕵'
  },
  'Accessibility': {
    title: '♿ Netscape Accessibility Notice',
    body: 'This portal is fully optimized for Netscape Navigator 4.0. If you are using eyes to read this text, you are in complete federal compliance.',
    icon: '♿'
  },
  'News & Updates': {
    title: '📰 Portal News & Press Release',
    body: 'NEWS (03/12/2004): We are thrilled to announce our server upgrade from 16MB to 32MB of EDO RAM!\n\nPerformance gains of up to 4.2% are anticipated across all SSN dropdown fields.',
    icon: '📰'
  },
  'Site Map': {
    title: '🗺 Site Map Coordinates',
    body: 'Link 1 -> Page 1\nLink 2 -> Page 1\nLink 3 -> Page 1\nLink 4 -> Page 1\nLink 5 -> Page 1\n\nError 0x0012: Map rendering buffer overflow.',
    icon: '🗺'
  },
  'Help Desk': {
    title: '☎ Citizen Help Desk Desk',
    body: 'Current help desk queue is full.\n\nAverage wait time is: 4 hours 37 minutes.\nEnjoy our relaxing MIDI keyboard background music.',
    icon: '☎'
  },
  'Online Services': {
    title: '💳 Online Service Gateway',
    body: 'To proceed with online processing, please swipe your physical citizen token card through your computer\'s floppy drive slot.',
    icon: '💳'
  },
  'eGovernment Hub': {
    title: '☕ Java Applet Launcher',
    body: 'Triggering secure portal interface... Warning: Java Applet v1.2 failed to execute. Ensure original Netscape JVM installed on your machine.',
    icon: '☕'
  },
  'Tax Services': {
    title: '💰 IRS Audit Bot Flag',
    body: 'IRS Audit Bot has flagged your IP address for suspicious compliance activity. An audit appointment has been scheduled for April 14, 2031 at our regional branch.',
    icon: '💰'
  },
  'Benefits Portal': {
    title: '🎁 Benefits Eligibility Check',
    body: 'Your benefits eligibility status: PENDING.\n\nTo expedite, please mail 4 original physical passport photos showing your paternal grandfather\'s left shoulder.',
    icon: '🎁'
  },
  'License Renewal': {
    title: '🚗 DMV License Gateway',
    body: 'Online renewal is suspended. Please visit your local DMV office between 9:02 AM and 9:07 AM on alternate Thursdays.',
    icon: '🚗'
  },
  'Voter Registration': {
    title: '🗳 Voter Turnout Lockout',
    body: 'Voter registration is closed due to an excess of democratic participation. Please register in-person at our regional Barrow, Alaska branch.',
    icon: '🗳'
  },
  'Business Registration': {
    title: '🏢 Business Incorporation Board',
    body: 'Incorporations must register under the Standard Industrial Code 9999 (Non-classified Administrative Overhead) to prevent audit.',
    icon: '🏢'
  },
  'Document Upload': {
    title: '🖨 SCSI Document Interface',
    body: 'File scanner interface requires active SCSI adapter card. Rescan your document at 600dpi grayscale only.',
    icon: '🖨'
  },
  'Status Check': {
    title: '📋 Citizen Account Status',
    body: 'Your citizen status: ACTIVE.\n\nKeep standing, citizen.',
    icon: '📋'
  },
  'Appeals & Complaints': {
    title: '🗑 Appeals Router',
    body: 'All complaints are automatically routed to our standard bin (/dev/null).\n\nThank you for your valuable feedback.',
    icon: '🗑'
  },
  'FOIA Requests': {
    title: '🔒 FOIA Request Denied',
    body: 'FOIA Denied: The requested list of available FOIA logs is itself classified under Executive Order 12958. Your request has been logged as suspicious.',
    icon: '🔒'
  },
  'Public Records': {
    title: '💿 Public Records Archives',
    body: 'To access, please purchase our 44-CD set "Public Records 1999 Edition" at your local courthouse for $299.',
    icon: '💿'
  },
  'Emergency Notices': {
    title: '🚨 Emergency Alerts',
    body: 'There are currently zero emergency notices. If there were an emergency, this system would load too slowly to alert you anyway.',
    icon: '🚨'
  },
  'Veterans Affairs': {
    title: '🎖 Veterans Affairs File Room',
    body: 'Service file retrieval delayed. Our mainframe filing cabinet keys are currently locked inside another filing cabinet.',
    icon: '🎖'
  },
  'Child Services': {
    title: '👶 Parenting Compliance Review',
    body: 'Automated parenting compliance review active. Ensure child has completed their 12 hours of daily bureaucratic paperwork.',
    icon: '👶'
  },
  'Senior Programs': {
    title: '👴 Senior Pension Matrix',
    body: 'Pension calculation matrix adjusted for 1900-year rollover.\n\nEnjoy your pension of $0.00.',
    icon: '👴'
  },
  'Disability Benefits': {
    title: '🕊 Disability Verification',
    body: 'Ensure physical notarized fingerprint cards are sent to our central archives via registered carrier pigeon.',
    icon: '🕊'
  },
  'Housing Assistance': {
    title: '🏠 Housing Assistance Waiting List',
    body: 'Housing Waiting list position: 472,109.\n\nEstimated wait: 89 years. Keep paying rent in the meantime.',
    icon: '🏠'
  },
  'Employment Services': {
    title: '💼 Civil Job Placement',
    body: 'Available positions:\n- Bureaucracy Apprentice\n- Keyboard Dust Sweeper\n- Queue Coordinator\n\nApply within.',
    icon: '💼'
  },
  'Training Programs': {
    title: '📖 Training Seminar Schedule',
    body: 'Class DS-11 "Advanced Circular Reference Filing" begins next Tuesday. Attendance is mandatory for all citizens.',
    icon: '📖'
  },
  'Download Internet Explorer': {
    title: '🌐 IE6 Setup Wizard',
    body: 'Initializing secure 9.8 GB setup download.\n\nSpeed: 2.1 KB/s\nEstimated completion: 57 days.\nDo not disconnect your phone line.',
    icon: '🌐'
  },
  '508 Compliance Notice': {
    title: '🕶 508 Accessibility Compliance',
    body: 'This site is fully optimized for screen reader software v1.0 running on MS-DOS. Enjoy the high-contrast gray color palette.',
    icon: '🕶'
  },
  'Forgot password?': {
    title: '🔑 Credentials Reset Failure',
    body: 'Under Security Directive DHS-11, password recovery is permanently disabled. If you cannot remember your credentials, please legally change your name to start a new identity.',
    icon: '🔑'
  },
  'Advertise here': {
    title: '💰 Banner Placement Agency',
    body: 'Standard 120x60 banner space. Price: $4,500/month. Payment accepted only in cash delivered in unmarked manila envelopes to Reston, VA.',
    icon: '💰'
  },
  "I didn't receive my email code": {
    title: '📧 Email Delivery Quarantine',
    body: 'Your email verification token has been temporarily detained for standard anti-spam security quarantine. Please check back in 120 hours.',
    icon: '📧'
  },
  "I don't remember my security answers": {
    title: '🔑 Forgotten Security Matrix',
    body: 'Under security directive DHS-19, citizens who forget their security answers must re-verify their identity in-person at our central Reston mainframe server room.',
    icon: '🔑'
  },
  "My scanner doesn't produce .TIF files": {
    title: '🖨 Scanner Compatibility Manual',
    body: 'High-fidelity .TIF format is required for retro grayscale image compression.\n\nIf your physical scanner doesn\'t support it, please draw the document using MS Paint and save as monochrome .BMP.',
    icon: '🖨'
  },
  "Request in-person verification appointment": {
    title: '📅 Appointment Scheduler',
    body: 'The next available in-person identity verification appointment at our Reston, VA headquarters is scheduled for:\n\nOctober 14, 2038 at 6:42 AM.\n\nPlease arrive 4 hours early.',
    icon: '📅'
  },
  'File': {
    title: '🔒 Menu Locked',
    body: 'Access to the file browser system is locked under standard executive browser lockouts.',
    icon: '🔒'
  },
  'Edit': {
    title: '🔒 Edit Locked',
    body: 'Editing webpage static structure requires active administrative clearance.',
    icon: '🔒'
  },
  'View': {
    title: '🔒 View Locked',
    body: 'Source code view is encrypted to prevent citizen source-level reverse engineering.',
    icon: '🔒'
  },
  'Favorites': {
    title: '🔒 Favorites Locked',
    body: 'Adding gov-portal to favorites is automatically enforced. Locking folder selection.',
    icon: '🔒'
  },
  'Tools': {
    title: '🔒 Tools Locked',
    body: 'Administrative developer tools are disabled under security audit 104.',
    icon: '🔒'
  },
  'Help': {
    title: '🔒 Help Locked',
    body: 'Help documentation database is offline. Use the Help Desk queue.',
    icon: '🔒'
  }
};

const SIDEBAR_LINKS = [
  'Home', 'About This Portal', 'Contact Us', 'FAQ',
  'Forms & Downloads', 'Privacy Policy', 'Accessibility',
  'News & Updates', 'Site Map', 'Help Desk',
  'Online Services', 'eGovernment Hub', 'Tax Services',
  'Benefits Portal', 'License Renewal', 'Voter Registration',
  'Business Registration', 'Document Upload', 'Status Check',
  'Appeals & Complaints', 'FOIA Requests', 'Public Records',
  'Emergency Notices', 'Veterans Affairs', 'Child Services',
  'Senior Programs', 'Disability Benefits', 'Housing Assistance',
  'Employment Services', 'Training Programs',
];

export default function CursedLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAd, setShowAd] = useState(false);
  const [showVirus, setShowVirus] = useState(false);
  const [virusDone, setVirusDone] = useState(false);
  const [time, setTime] = useState(new Date());
  const [tooltip, setTooltip] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);

  // Custom stacked recursive spam popups
  const [spawnedAds, setSpawnedAds] = useState([]);

  // Popups disabled surrender state
  const [popupsDisabled, setPopupsDisabled] = useState(() => {
    return sessionStorage.getItem('popups_disabled') === '1';
  });

  const [portalTitle, setPortalTitle] = useState('UNITED STATES DEPARTMENT OF CITIZEN SERVICES');
  const [visitors, setVisitors] = useState('0004721');
  const [layoutRotation, setLayoutRotation] = useState(0);
  const [typedBuffer, setTypedBuffer] = useState('');
  const [isSheryiansMode, setIsSheryiansMode] = useState(false);
  const [isSarthakMode, setIsSarthakMode] = useState(false);
  const [harshSirDialog, setHarshSirDialog] = useState(false);

  const playSheryiansFanfare = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      let startTime = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
        startTime += 0.12;
      });
    } catch (e) {
      console.error('Audio failed:', e);
    }
  };

  const handleConcedeLoss = () => {
    const alreadyDisabled = sessionStorage.getItem('popups_disabled') === '1';
    sessionStorage.setItem('popups_disabled', '1');
    setPopupsDisabled(true);
    setShowAd(false);
    setSpawnedAds([]);
    setShowVirus(false);
    setVirusDone(true);
    setActiveAlert(null);
    if (!alreadyDisabled) {
      alert("🏆 CONGRATULATIONS:\n\nYou have officially yielded to Govvy the Eagle.\n\nAll active adware streams, virus simulation widgets, and administrative popups have been retired under Citizen Concession Clause 99-C.\n\nEnjoy your silent, compliant experience!");
    } else {
      alert("✅ CONCESSION PERSISTENCE:\n\nSurrender agreement remains active. All active adware streams, virus warning frames, and temporary notification popups have been successfully flushed.");
    }
  };

  const spawnNewAd = () => {
    const id = Date.now() + Math.random();
    const adTypes = [
      {
        title: '🎰 CASINO BIG WIN JACKPOT!!!',
        body: '💰 YOU HAVE WON $1,472,900.00!\nSpin the slots now to claim your payout directly to your citizen bank account!',
        btn: '🎰 SPIN SLOTS TO CLAIM NOW',
        bg: '#990000',
        color: '#ffdd00',
        w: 320,
        h: 180,
      },
      {
        title: '💘 5 Single Citizens Near You!',
        body: 'Local citizens are online right now and want to review your notarized document uploads!\nClick CHAT NOW to open secure chatroom.',
        btn: '💬 START PRIVATE CHAT NOW',
        bg: '#ffb6c1',
        color: '#8b0000',
        w: 300,
        h: 200,
      },
      {
        title: '💊 LOSE 50 LBS IN 2 HOURS!',
        body: 'Doctor reveals ONE weird federal agricultural secret to burn belly fat overnight!\nDieticians HATE him. Click below to buy.',
        btn: '⚡️ BUY MIRACLE PILLS NOW',
        bg: '#006655',
        color: '#ffffff',
        w: 280,
        h: 220,
      },
      {
        title: '🚔 F.B.I. WEBCAM SECURITY ALERT',
        body: 'A critical cyber threat has tried to access your webcam. Protect your computer immediately with our authorized governmental firewall software!',
        btn: '🛡️ ACTIVATE SECURE SHIELD',
        bg: '#000033',
        color: '#00ffff',
        w: 340,
        h: 190,
      },
      {
        title: '🎓 GET A COLLEGE DEGREE IN 6 DAYS!',
        body: 'Pre-approved university diplomas in: Bureaucracy, Tax Evasion, or Advanced Compliance.\nNo studying required. Click below!',
        btn: '📜 PRINT DIPLOMA NOW',
        bg: '#553300',
        color: '#ffffaa',
        w: 310,
        h: 210,
      }
    ];

    const type = adTypes[Math.floor(Math.random() * adTypes.length)];
    const x = Math.max(20, Math.floor(Math.random() * (window.innerWidth - 360)));
    const y = Math.max(50, Math.floor(Math.random() * (window.innerHeight - 250)));

    setSpawnedAds(prev => [...prev, { id, x, y, ...type }]);
  };

  const handleCloseSpawned = (id) => {
    // 40% chance of spawning 2 more when trying to close!
    if (Math.random() < 0.40) {
      alert("⚠️ ERROR: Secure browser popup manager failed to close window. Adware infection critical. Spawning 2 backup mirrors.");
      spawnNewAd();
      spawnNewAd();
    } else {
      setSpawnedAds(prev => prev.filter(ad => ad.id !== id));
    }
  };

  const handleSpawnedAdClick = (id) => {
    // Closes the current one, but spawns TWO more!
    setSpawnedAds(prev => prev.filter(ad => ad.id !== id));
    spawnNewAd();
    spawnNewAd();
  };

  const handleAdMouseDown = (e, adId) => {
    e.preventDefault();
    const ad = spawnedAds.find(a => a.id === adId);
    if (!ad) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialAdX = ad.x;
    const initialAdY = ad.y;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      setSpawnedAds(prev => prev.map(a => {
        if (a.id === adId) {
          return {
            ...a,
            x: initialAdX + dx,
            y: initialAdY + dy
          };
        }
        return a;
      }));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleLinkClick = (name) => {
    if (name === 'Home') {
      navigate('/');
      return;
    }
    if (name === 'Force Active Infection' || name === 'Restore Chaos Mode') {
      sessionStorage.removeItem('virus_shown');
      sessionStorage.removeItem('popups_disabled');
      setPopupsDisabled(false);
      setVirusDone(false);
      if (name === 'Force Active Infection') {
        setShowVirus(true);
      } else {
        setShowAd(true);
        alert("🔥 CHAOS MODE RESTORED:\n\nSurrender contract revoked! Adware spawning loops, tracking matrices, and threat simulation widgets have been reactivated.");
      }
      return;
    }
    const resp = LINK_RESPONSES[name];
    if (resp) {
      setActiveAlert(resp);
    } else {
      setActiveAlert({
        title: `🗄️ Bureaucratic Notice: ${name}`,
        body: `Accessing the sub-directory for "${name}" is currently queue-locked.\n\nEstimated administrative review time: 48 business hours.`,
        icon: '🗄️'
      });
    }
  };

  useEffect(() => {
    const handleCursedLink = (e) => {
      handleLinkClick(e.detail);
    };
    window.addEventListener('cursed-link', handleCursedLink);
    return () => window.removeEventListener('cursed-link', handleCursedLink);
  }, []);

  // First-time virus warning
  useEffect(() => {
    if (popupsDisabled) return;
    const seen = sessionStorage.getItem('virus_shown');
    if (!seen) {
      const t = setTimeout(() => setShowVirus(true), 4000);
      return () => clearTimeout(t);
    }
  }, [popupsDisabled]);

  // Popup ads every 45s
  useEffect(() => {
    if (popupsDisabled) return;
    const t = setTimeout(() => setShowAd(true), 8000);
    const t2 = setInterval(() => setShowAd(true), 45000);
    return () => { clearTimeout(t); clearInterval(t2); };
  }, [popupsDisabled]);

  // Random tooltips
  const TOOLTIP_MESSAGES = [
    'Click here for important information',
    'WARNING: This link may be outdated',
    'Session expires in 14:32',
    'Error Code: 0x80072EE7 — Connection interrupted',
    'Loading... please wait',
    'Your browser is not supported. Download IE6',
  ];
  useEffect(() => {
    const t = setInterval(() => {
      const msg = TOOLTIP_MESSAGES[Math.floor(Math.random() * TOOLTIP_MESSAGES.length)];
      setTooltip({ msg, x: Math.random() * 600 + 100, y: Math.random() * 400 + 100 });
      setTimeout(() => setTooltip(null), 3000);
    }, 15000);
    return () => clearInterval(t);
  }, []);

  // Fake clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Sheryians Coding School Cheat Codes / Easter Eggs listener
  useEffect(() => {
    const handleKeyPress = (e) => {
      const char = e.key.toLowerCase();
      if (/^[a-z0-9]$/i.test(char)) {
        setTypedBuffer(prev => {
          const next = (prev + char).slice(-20);
          
          if (next.includes('sheryians')) {
            playSheryiansFanfare();
            setIsSheryiansMode(true);
            setVisitors('9999999');
            setPortalTitle('🎓 SHERYIANS SCHOOL OF UNHINGED DEVELOPERS');
            setSpawnedAds([]);
            setShowAd(false);
            setPopupsDisabled(true);
            sessionStorage.setItem('popups_disabled', '1');
            return '';
          }

          if (next.includes('harsh')) {
            playSheryiansFanfare();
            setHarshSirDialog(true);
            window.dispatchEvent(new CustomEvent('solve-captcha'));
            setShowVirus(false);
            setVirusDone(true);
            sessionStorage.setItem('virus_shown', '1');
            return '';
          }

          if (next.includes('sarthak')) {
            playSheryiansFanfare();
            setIsSarthakMode(true);
            setLayoutRotation(362.5); // Spin 360 + skew by 2.5 degrees!
            return '';
          }

          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleBack = () => {
    localStorage.removeItem('cursed_user');
    navigate('/');
  };

  return (
    <div 
      className={`page-wrapper ${isSheryiansMode ? 'sheryians-mode' : ''} ${isSarthakMode ? 'sarthak-mode' : ''}`}
      style={{
        transition: 'transform 0.8s ease-in-out',
        transform: `rotate(${layoutRotation}deg)`
      }}
    >
      {/* IE Banner */}
      <div className="ie-banner">
        ⚠ This site is best viewed in <strong>Internet Explorer 6.0</strong> at <strong>1024×768</strong> resolution. 
        Other browsers may display incorrectly. | 
        <span className="fake-link" onClick={() => handleLinkClick('Download Internet Explorer')}> Download Internet Explorer</span> | 
        <span className="fake-link" onClick={() => handleLinkClick('508 Compliance Notice')}> 508 Compliance Notice</span>
      </div>

      {/* Top Menu Bar */}
      <div className="top-menubar">
        {['File', 'Edit', 'View', 'Favorites', 'Tools', 'Help'].map(m => (
          <span key={m} className="menu-item" onClick={() => handleLinkClick(m)}>{m}</span>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#808080', fontFamily: 'Arial' }}>
          🔒 Secure Connection | <span className="blink" style={{ color: '#cc0000' }}>●</span> GOVNET-04
        </span>
      </div>

      {/* Address Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 4px', background: '#c0c0c0', borderBottom: '1px solid #808080' }}>
        <button className="btn-98" onClick={handleBack} style={{ fontSize: 10, padding: '1px 6px', minWidth: 'unset' }}>◀ Back</button>
        <button className="btn-98" style={{ fontSize: 10, padding: '1px 6px', minWidth: 'unset' }}>▶</button>
        <button className="btn-98" style={{ fontSize: 10, padding: '1px 6px', minWidth: 'unset' }}>✖</button>
        <button className="btn-98" style={{ fontSize: 10, padding: '1px 6px', minWidth: 'unset' }}>🔄</button>
        <button className="btn-98" style={{ fontSize: 10, padding: '1px 6px', minWidth: 'unset' }}>🏠</button>
        <div className="panel-inset" style={{ flex: 1, fontSize: 10, fontFamily: 'Arial', padding: '1px 4px', background: '#ffffff' }}>
          http://www.usgov-citizen-portal.gov.us.net/services/en{location.pathname}?sessid=7f4d2a&lang=en&mode=compat&ie=6
        </div>
        <button className="btn-98" style={{ fontSize: 10, padding: '1px 8px', minWidth: 'unset' }}>Go</button>
      </div>

      {/* Portal Header */}
      <div className="portal-header">
        <div style={{ fontSize: 28, lineHeight: 1 }}>🏛</div>
        <div>
          <div style={{ fontFamily: 'Arial', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 }}>
            {portalTitle}
          </div>
          <div style={{ fontFamily: 'Arial', fontSize: 10, color: '#aaccff' }}>
            Official U.S. Government Web Portal | Citizen eServices Division | Est. 1997
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right', fontSize: 10, fontFamily: 'Arial', color: '#aaccff' }}>
          <div className="blink">● SECURE SESSION ACTIVE</div>
          <div>Session ID: SES-{Math.random().toString(36).substr(2,8).toUpperCase()}</div>
          <div>{time.toLocaleString()}</div>
        </div>
      </div>

      {/* Marquee */}
      <div style={{ background: '#ffff99', borderBottom: '1px solid #cc9900', overflow: 'hidden', height: 16 }}>
        <div className="marquee-content" style={{ fontFamily: 'Arial', fontSize: 10, color: '#330000', paddingTop: 2 }}>
          *** NOTICE: Portal maintenance scheduled March 15, 2004 12:00AM - 4:00AM EST. 
          All online services will be unavailable. Plan accordingly. *** 
          NEW: Form DS-4421-B now available for download. 
          Print and mail with original notarized signature. No faxes accepted. *** 
          REMINDER: Annual re-registration deadline is approaching. 
          Failure to re-register will result in account deactivation. ***
          Security Notice: Never share your password with government officials over the phone. ***
        </div>
      </div>

      {/* Main Area */}
      <div className="main-area">
        {/* Sidebar */}
        <div className="sidebar">
          <div style={{ padding: '2px 4px', fontFamily: 'Arial', fontSize: 9, color: '#808080', borderBottom: '1px solid #808080' }}>
            Navigation Menu v2.1
          </div>
          <div className="sidebar-section-title">◀ MAIN MENU</div>
          {SIDEBAR_LINKS.slice(0, 10).map(l => (
            <span key={l} className="sidebar-link" onClick={() => handleLinkClick(l)}>{l}</span>
          ))}
          <div className="sidebar-section-title">◀ SERVICES</div>
          {SIDEBAR_LINKS.slice(10, 20).map(l => (
            <span key={l} className="sidebar-link" onClick={() => handleLinkClick(l)}>{l}</span>
          ))}
          <div className="sidebar-section-title">◀ PROGRAMS</div>
          {SIDEBAR_LINKS.slice(20).map(l => (
            <span key={l} className="sidebar-link" onClick={() => handleLinkClick(l)}>{l}</span>
          ))}

          <div className="hr-98" style={{ margin: '4px 2px' }} />

          {/* Fake banner ads in sidebar */}
          <div 
            onClick={() => { spawnNewAd(); spawnNewAd(); }}
            style={{ background: '#ffff00', border: '2px solid #cc0000', padding: '2px', textAlign: 'center', margin: '2px', fontSize: 9, fontFamily: 'Arial', fontWeight: 'bold', cursor: 'pointer', color: '#cc0000' }}
          >
            <div className="blink">FREE CREDIT REPORT!</div>
            <div style={{ fontSize: 8, color: '#000' }}>Click here now!</div>
          </div>

          <div 
            onClick={() => { spawnNewAd(); spawnNewAd(); }}
            style={{ background: '#003399', border: '1px solid #000', padding: '3px', textAlign: 'center', margin: '2px', fontSize: 8, fontFamily: 'Arial', color: '#ffffff', cursor: 'pointer' }}
          >
            <div style={{ fontWeight: 'bold' }}>PC SlowMax Pro</div>
            <div>Speed up your PC!</div>
            <div style={{ background: '#ff6600', color: '#fff', padding: '1px', marginTop: 2, cursor: 'pointer' }}>DOWNLOAD FREE</div>
          </div>

          <div className="hr-98" style={{ margin: '4px 2px' }} />

          {popupsDisabled ? (
            <button
              className="btn-98 btn-wiggle"
              onClick={() => handleLinkClick('Restore Chaos Mode')}
              style={{
                width: 'calc(100% - 4px)',
                margin: '2px',
                background: '#006600',
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: 10,
                padding: '4px 2px',
                border: '2px outset #ffffff',
                cursor: 'pointer',
                whiteSpace: 'normal',
                lineHeight: 1.15
              }}
            >
              🔥 Restore Chaos Mode
            </button>
          ) : (
            <>
              {/* Debug Force Infection Button */}
              <button
                className="btn-98 btn-wiggle"
                onClick={() => handleLinkClick('Force Active Infection')}
                style={{
                  width: 'calc(100% - 4px)',
                  margin: '2px',
                  background: '#cc0000',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: 10,
                  padding: '4px 2px',
                  border: '2px outset #ffffff',
                  cursor: 'pointer',
                  whiteSpace: 'normal',
                  lineHeight: 1.15
                }}
              >
                ⚠️ Force Active Infection (Test)
              </button>

              {/* Concession Button */}
              <button
                className="btn-98 btn-wiggle"
                onClick={handleConcedeLoss}
                style={{
                  width: 'calc(100% - 4px)',
                  margin: '2px',
                  background: '#000080',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: 10,
                  padding: '4px 2px',
                  border: '2px outset #ffffff',
                  cursor: 'pointer',
                  whiteSpace: 'normal',
                  lineHeight: 1.15
                }}
              >
                🏳️ I Lost, You Win - Remove All Popups
              </button>
            </>
          )}

          <div style={{ fontSize: 8, fontFamily: 'Arial', color: '#808080', padding: '2px', marginTop: 4 }}>
            <div className="fake-link" onClick={() => handleLinkClick('Advertise here')}>Advertise here</div>
            <div>Webmaster: admin@gov-portal.net</div>
            <div>Last updated: 03/14/2004</div>
            <div>Visitors: <span style={{ color: '#cc0000' }}>{visitors}</span></div>
          </div>
        </div>

        {/* Content */}
        <div className="content-area">
          {children}
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <span className="status-panel" onClick={() => handleLinkClick('Status Check')} style={{ cursor: 'pointer' }}>Done</span>
        <span className="status-panel" onClick={() => handleLinkClick('508 Compliance Notice')} style={{ cursor: 'pointer' }}>🔒 SSL Secured</span>
        <span className="status-panel" style={{ flex: 1 }}>
          http://www.usgov-citizen-portal.gov.us.net/services/en{location.pathname}
        </span>
        <span className="status-panel">Internet</span>
        <span className="status-panel">
          <span className="blink" style={{ color: '#cc0000' }}>⚠</span> Pop-up Blocked (3)
        </span>
      </div>

      {/* Global curse components */}
      <SessionTimeoutModal />
      <NotificationSpam />
      <CursedAssistant />

      {showVirus && !virusDone && (
        <FakeVirusWarning 
          onDismiss={() => {
            setShowVirus(false);
            setVirusDone(true);
            sessionStorage.setItem('virus_shown', '1');
          }}
          onConcede={handleConcedeLoss}
        />
      )}

      {showAd && (
        <PopupAd onClose={() => setShowAd(false)} onAdClick={() => { spawnNewAd(); spawnNewAd(); }} />
      )}

      {/* Render explosive stacked spam ads list */}
      {spawnedAds.map(ad => (
        <div
          key={ad.id}
          style={{
            position: 'fixed',
            left: ad.x,
            top: ad.y,
            width: ad.w,
            background: '#c0c0c0',
            borderTop: '2px solid #ffffff',
            borderLeft: '2px solid #ffffff',
            borderRight: '2px solid #808080',
            borderBottom: '2px solid #808080',
            boxShadow: '4px 4px 0 #000',
            zIndex: 9900,
          }}
        >
          <div 
            className="titlebar" 
            onMouseDown={(e) => handleAdMouseDown(e, ad.id)}
            style={{ background: '#cc0000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 4px', cursor: 'move' }}
          >
            <span style={{ fontSize: 9, color: '#fff', fontWeight: 'bold', userSelect: 'none' }}>{ad.title}</span>
            <span 
              className="titlebar-btn" 
              onClick={(e) => {
                e.stopPropagation();
                handleCloseSpawned(ad.id);
              }} 
              style={{ cursor: 'pointer', fontSize: 9, padding: '0 2px' }}
            >
              ✕
            </span>
          </div>
          <div style={{ background: ad.bg, color: ad.color, padding: 10, fontFamily: 'Arial', fontSize: 10, textAlign: 'center' }}>
            <div className="blink" style={{ fontWeight: 'bold', fontSize: 11, marginBottom: 6 }}>{ad.title}</div>
            <div style={{ marginBottom: 8, whiteSpace: 'pre-line', lineHeight: 1.1 }}>{ad.body}</div>
            <button 
              className="btn-wiggle"
              onClick={() => handleSpawnedAdClick(ad.id)}
              style={{
                background: '#ff6600',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 9,
                border: '2px solid #cc3300',
                padding: '3px 8px',
                cursor: 'pointer'
              }}
            >
              {ad.btn}
            </button>
          </div>
          <div style={{ padding: '2px 4px', background: '#c0c0c0', display: 'flex', justifyContent: 'space-between', fontSize: 7, color: '#808080' }}>
            <span>Ad by: MegaClick Network™</span>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => handleCloseSpawned(ad.id)}>close</span>
          </div>
        </div>
      ))}

      {/* Satirical Bureaucratic Link Alert Overlay */}
      {activeAlert && (
        <div className="modal-backdrop" style={{ zIndex: 9950 }}>
          <div className="win98-window" style={{ width: 340 }}>
            <div className="titlebar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{activeAlert.title}</span>
              <span className="titlebar-btn" onClick={() => setActiveAlert(null)} style={{ cursor: 'pointer' }}>✕</span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 24 }}>{activeAlert.icon}</span>
                <div style={{ fontFamily: 'Arial', fontSize: 10, whiteSpace: 'pre-line', lineHeight: 1.25 }}>
                  {activeAlert.body}
                </div>
              </div>
              <div className="hr-98" style={{ margin: '8px 0' }} />
              <div style={{ textAlign: 'right' }}>
                <button className="btn-98" onClick={() => setActiveAlert(null)} style={{ padding: '2px 16px', fontWeight: 'bold' }}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tooltip && (
        <div className="cursed-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          ℹ {tooltip.msg}
        </div>
      )}

      {/* Harsh Sir Code Review Easter Egg Modal */}
      {harshSirDialog && (
        <div className="modal-backdrop" style={{ zIndex: 999995, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(3.5px)' }}>
          <div className="win98-window" style={{ width: 400, border: '3px solid #ffcc00', boxShadow: '5px 5px 0 #000000' }}>
            <div className="titlebar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(90deg, #ffcc00, #990000)', padding: '3px 6px' }}>
              <span style={{ fontWeight: 'bold', color: '#fff', fontSize: 11, fontFamily: 'Arial' }}>🦁 SHERYIANS EMERGENCY AUDIT SYSTEM</span>
              <span className="titlebar-btn" onClick={() => setHarshSirDialog(false)} style={{ cursor: 'pointer', color: '#fff', fontSize: 11 }}>✕</span>
            </div>
            <div style={{ padding: '16px 18px', background: '#1c1308', color: '#ffcc00' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 36 }}>🦁</span>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: 13, fontFamily: 'Arial', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Code Critique by Harsh Sir
                  </h3>
                  <div className="blink" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 12, color: '#ffffff', lineHeight: 1.35, marginBottom: 12 }}>
                    "Bhailog, ye kya ganda UI/UX banaya hai! Isko to main bypass hi kar deta hu!"
                  </div>
                  <div style={{ fontFamily: 'Arial', fontSize: 9, color: '#ffaa00', lineHeight: 1.4 }}>
                    The Sheryians Auditing Matrix has detected extreme governmental digital latency and class-level compliance friction. Emergency overrides have been applied:
                  </div>
                  <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4, fontFamily: 'monospace', fontSize: 9, color: '#aaffaa' }}>
                    <div>[✓] Auto-solved active CAPTCHA forms</div>
                    <div>[✓] Deactivated government registry Trojan warnings</div>
                    <div>[✓] Flushed active citizens administrative queues</div>
                    <div>[✓] Injected creative developer acceleration (999% speedup)</div>
                  </div>
                </div>
              </div>
              <div className="hr-98" style={{ margin: '12px 0', borderBottom: '1px solid #ffcc00' }} />
              <div style={{ textAlign: 'center' }}>
                <button 
                  className="btn-98" 
                  onClick={() => {
                    try {
                      const AudioContext = window.AudioContext || window.webkitAudioContext;
                      if (AudioContext) {
                        const ctx = new AudioContext();
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(600, ctx.currentTime);
                        gain.gain.setValueAtTime(0.08, ctx.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start();
                        osc.stop(ctx.currentTime + 0.15);
                      }
                    } catch(e){}
                    setHarshSirDialog(false);
                  }} 
                  style={{ 
                    padding: '4px 24px', 
                    fontWeight: 'bold', 
                    background: '#ffcc00', 
                    color: '#000', 
                    border: '2px solid #ff9900',
                    cursor: 'pointer'
                  }}
                >
                  🦁 Dhanyawad Harsh Sir! (Bypass Now)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Concession Button - Always Visible fixed on top in bottom-right */}
      <button
        className="btn-98 btn-wiggle"
        onClick={handleConcedeLoss}
        style={{
          position: 'fixed',
          bottom: 30,
          right: 20,
          zIndex: 99990,
          background: '#000080',
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: 11,
          padding: '6px 14px',
          border: '2.5px outset #ffffff',
          boxShadow: '3px 3px 0 #000',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}
      >
        🏳️ I Lost, You Win - Remove All Popups
      </button>
    </div>
  );
}
