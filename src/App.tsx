import { useState, useEffect } from 'react';
import { AuthPortal, RadarLogo } from './components/AuthPortal';
import { MumbaiMap } from './components/MumbaiMap';
import { SiloUnifier } from './components/SiloUnifier';
import { PitchDeck } from './components/PitchDeck';
import { ProposalReport } from './components/ProposalReport';
import {
  LogOut,
  Waves,
  Ship,
  Radio,
  AlertTriangle,
  Train,
  Settings,
  Clock
} from 'lucide-react';
import { UserDirectory } from './components/UserDirectory';
import confetti from 'canvas-confetti';

interface SOSTicket {
  id: number;
  time: string;
  location: string;
  details: string;
  level: 'CRITICAL' | 'WARNING' | 'ALERT';
  contact: string;
  victimCount: number;
  status: 'PENDING' | 'DISPATCHING' | 'DISPATCHED';
  eta?: string;
  boatId?: string;
}

const INITIAL_SOS_TICKETS: SOSTicket[] = [
  {
    id: 1,
    time: '14:15',
    location: 'WARD G/S (Dadar)',
    details: 'Residential flood (Elderly stranded)',
    level: 'CRITICAL',
    contact: '+91 98200 11223',
    victimCount: 5,
    status: 'PENDING'
  },
  {
    id: 2,
    time: '14:12',
    location: 'WARD K/W (Andheri)',
    details: 'Metro station inundation',
    level: 'CRITICAL',
    contact: '+91 98200 44556',
    victimCount: 0,
    status: 'DISPATCHED',
    eta: 'Completed',
    boatId: 'TCET-BOAT-01'
  },
  {
    id: 3,
    time: '14:09',
    location: 'WARD D (Grant Rd)',
    details: 'Building wall collapse (3 injured)',
    level: 'CRITICAL',
    contact: '+91 98200 77889',
    victimCount: 3,
    status: 'DISPATCHED',
    eta: 'Completed',
    boatId: 'TCET-BOAT-02'
  },
  {
    id: 4,
    time: '14:05',
    location: 'WARD M/E (Govandi)',
    details: 'Road blockage (Heavy rain)',
    level: 'WARNING',
    contact: '+91 98100 12345',
    victimCount: 0,
    status: 'DISPATCHED',
    eta: 'Completed',
    boatId: 'TCET-BOAT-03'
  },
  {
    id: 5,
    time: '14:02',
    location: 'WARD H/E (Santacruz)',
    details: 'Slum area flooding (Evac needed)',
    level: 'CRITICAL',
    contact: '+91 98100 67890',
    victimCount: 15,
    status: 'PENDING'
  }
];

function App() {
  const [user, setUser] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [rainfall, setRainfall] = useState(45); // mm/hr
  const [tide, setTide] = useState(2.8); // meters
  const [drainage] = useState(75); // efficiency %
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
  const [sosRequests, setSosRequests] = useState<SOSTicket[]>(INITIAL_SOS_TICKETS);
  const [dispatchingId, setDispatchingId] = useState<number | null>(null);
  const [crisisLevel, setCrisisLevel] = useState<'NORMAL' | 'DRILL' | 'RED_ALERT'>('NORMAL');
  const [logLevelFilter, setLogLevelFilter] = useState<string>('ALL');
  const [scanProgress, setScanProgress] = useState<number>(35);
  const [scanningSector, setScanningSector] = useState<string>('WARD L (Kurla)');

  const [systemLogs, setSystemLogs] = useState<string[]>([
    `[INFO] [${new Date().toLocaleDateString()} 14:05:22] - NGO dispatch vessels synced. 6 crews placed on standby.`,
    `[INFO] [${new Date().toLocaleDateString()} 14:02:18] - Systems Integrity Check passed. 22 GIS wards loaded offline.`,
    `[INFO] [${new Date().toLocaleDateString()} 14:02:15] - Active Commander admin@floodpulse.in logged in from secure terminal node.`,
    `[CRITICAL] [${new Date().toLocaleDateString()} 13:58:45] - Level check: Kurla L-Ward water logging rose to 4.5 feet.`,
    `[WARNING] [${new Date().toLocaleDateString()} 13:45:00] - Hindmata drainage efficiency decreased due to backflow.`
  ]);

  const [broadcastAlerts, setBroadcastAlerts] = useState<any[]>([
    { id: 1, time: '14:15', type: 'CRITICAL', text: 'Dadar Subway completely flooded. Commuter traffic suspended.' },
    { id: 2, time: '14:09', type: 'WARNING', text: 'Kurla West railway lines experiencing minor track flooding.' },
    { id: 3, time: '14:02', type: 'INFO', text: 'Sluice drainage gates at Love Grove active at 100% efficiency.' }
  ]);

  const addSystemLog = (msg: string, level = 'INFO') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    let finalLevel = level;
    const lowerMsg = msg.toLowerCase();
    if (lowerMsg.includes('flood') || lowerMsg.includes('critical') || lowerMsg.includes('danger') || lowerMsg.includes('red_alert')) {
      finalLevel = 'CRITICAL';
    } else if (lowerMsg.includes('warning') || lowerMsg.includes('alert') || lowerMsg.includes('warn') || lowerMsg.includes('limit')) {
      finalLevel = 'WARNING';
    } else if (lowerMsg.includes('dispatch') || lowerMsg.includes('vessel') || lowerMsg.includes('boat')) {
      finalLevel = 'DISPATCH';
    }
    setSystemLogs(prev => [`[${finalLevel}] [${new Date().toLocaleDateString()} ${time}] - ${msg}`, ...prev]);
  };

  const getRainfallStatus = (val: number) => {
    if (val < 15) return { text: 'LIGHT DRIZZLE', color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' };
    if (val < 60) return { text: 'MODERATE RAIN', color: '#00D2FF', bg: 'rgba(0,210,255,0.1)', border: 'rgba(0,210,255,0.3)' };
    if (val < 110) return { text: 'HEAVY RAIN', color: '#FBBF24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' };
    return { text: 'CLOUDBURST ALERT', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' };
  };

  const getTideStatus = (val: number) => {
    if (val < 3.2) return { text: 'NORMAL TIDE', color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' };
    if (val < 4.5) return { text: 'HIGH TIDE ALERT', color: '#FBBF24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' };
    return { text: 'HIGH TIDE WARNING', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' };
  };

  const getCardClass = (id: string, baseClass = 'glass-panel') => {
    return `${baseClass} ${selectedCardId === id ? 'active-hollow-card' : ''}`;
  };

  // Check login session and register click hollow listener on mount
  useEffect(() => {
    const loggedUser = localStorage.getItem('floodpulse_active_user');
    const loggedEmail = localStorage.getItem('floodpulse_active_email');
    if (loggedUser && loggedEmail) {
      setUser(loggedUser);
      setUserEmail(loggedEmail);
    }

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.glass-panel')) {
        setSelectedCardId(null);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  // Live Doppler scanning simulation loop
  useEffect(() => {
    const sectors = [
      'WARD L (Kurla)', 'WARD G/S (Dadar)', 'WARD F/N (Sion)', 'WARD H/W (Bandra)', 
      'WARD K/W (Andheri)', 'WARD A (Colaba)', 'WARD P/N (Malad)', 'WARD G/N (Dharavi)',
      'WARD E (Byculla)', 'WARD M/W (Chembur)', 'WARD H/E (Santacruz)', 'WARD N (Ghatkopar)'
    ];
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          const nextSector = sectors[Math.floor(Math.random() * sectors.length)];
          setScanningSector(nextSector);
          // Let's add the system log using the correct helper
          addSystemLog(`Systems telemetry sweep complete for ${nextSector}. Integrity status: SECURE.`, 'INFO');
          return 0;
        }
        return prev + 10;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = (name: string, email: string) => {
    setUser(name);
    setUserEmail(email);
    localStorage.setItem('floodpulse_active_user', name);
    localStorage.setItem('floodpulse_active_email', email);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const handleLogout = () => {
    setUser(null);
    setUserEmail('');
    localStorage.removeItem('floodpulse_active_user');
    localStorage.removeItem('floodpulse_active_email');
  };

  const isAdmin = userEmail === 'admin@floodpulse.in';

  // Add new parsed SOS from SiloUnifier
  const handleParsedSOS = (newSOS: {
    location: string;
    details: string;
    level: 'CRITICAL' | 'WARNING' | 'ALERT';
    contact: string;
    victimCount: number;
  }) => {
    const ticket: SOSTicket = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      location: newSOS.location,
      details: newSOS.details,
      level: newSOS.level,
      contact: newSOS.contact,
      victimCount: newSOS.victimCount,
      status: 'PENDING'
    };
    setSosRequests(prev => [ticket, ...prev]);
    addSystemLog(`Parsed and merged volunteer SOS ticket for ${newSOS.location}`);
    setActiveTab('dashboard'); // Redirect to dashboard to see it
  };

  // Trigger dispatch animation
  const handleDispatch = (ticketId: number) => {
    setDispatchingId(ticketId);
    
    // Update ticket state to DISPATCHING
    setSosRequests(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: 'DISPATCHING' } : ticket
    ));
    addSystemLog(`Initiated vessel dispatch sequence to ticket #${ticketId}`);

    // Simulate dispatch delay
    setTimeout(() => {
      setSosRequests(prev => prev.map(ticket => 
        ticket.id === ticketId ? { 
          ...ticket, 
          status: 'DISPATCHED',
          eta: `${Math.floor(Math.random() * 12) + 8} mins`,
          boatId: `TCET-BOAT-0${Math.floor(Math.random() * 5) + 3}`
        } : ticket
      ));
      addSystemLog(`Vessel successfully assigned and enroute to ticket #${ticketId}`);
      setDispatchingId(null);
      
      // Fire confetti for successful dispatch!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00D2FF', '#00F5D4', '#9D4EDD']
      });
    }, 2000);
  };

  const handleCrisisChange = (level: 'NORMAL' | 'DRILL' | 'RED_ALERT') => {
    setCrisisLevel(level);
    addSystemLog(`Crisis warning status altered to [${level}] by Commander ${user || 'Admin'}`);
  };

  // Calculated properties based on rainfall, tide, and drainage
  const submergenceBoost = crisisLevel === 'RED_ALERT' ? 1.5 : crisisLevel === 'DRILL' ? 0.4 : 0;
  const averageSubmergence = parseFloat(
    Math.max(0, (rainfall * 0.03 + (tide - 2.0) * 0.5 - (drainage / 100) * 1.2 + submergenceBoost)).toFixed(1)
  );

  const getRailwayStatus = () => {
    if (rainfall > 80 && tide > 4.5) return { status: 'SUSPENDED', color: 'var(--accent-red)' };
    if (rainfall > 50 || tide > 3.8) return { status: 'DELAYED 25M', color: 'var(--accent-yellow)' };
    return { status: 'OPERATIONAL', color: 'var(--accent-green)' };
  };

  const railway = getRailwayStatus();
  const activeSOSCount = sosRequests.filter(r => r.status !== 'DISPATCHED').length;
  const deployedBoats = sosRequests.filter(r => r.status === 'DISPATCHED').length + 3; // base 3 boats

  if (!user) {
    return <AuthPortal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Crisis Warning Banner */}
      {crisisLevel === 'RED_ALERT' && (
        <div style={{
          background: 'var(--gradient-danger)',
          color: 'white',
          padding: '8px',
          textAlign: 'center',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          position: 'relative',
          zIndex: 11,
          boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)'
        }}>
          ⚠️ MUNICIPAL STATE OF EMERGENCY DECLARED: ALL DISTRICT UNITS ON ACTIVE STANDBY
        </div>
      )}
      {crisisLevel === 'DRILL' && (
        <div style={{
          background: 'var(--gradient-warning)',
          color: '#0B0F19',
          padding: '8px',
          textAlign: 'center',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          position: 'relative',
          zIndex: 11
        }}>
          ⚡ SYSTEM TRAINING DRILL ACTIVE: EMERGENCY PROTOCOLS ENABLED FOR SIMULATION MODE
        </div>
      )}
      
      {/* Background Neon Blur Blobs for Glassmorphism */}
      <div style={{ position: 'absolute', top: '5%', left: '10%', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(0, 210, 255, 0.15)', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '45%', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(157, 78, 221, 0.12)', filter: 'blur(120px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '25%', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(0, 245, 212, 0.08)', filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }} />
      
      {/* Header bar */}
      <header className="glass-panel" style={{
        margin: '16px',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-light)',
        borderRadius: '12px',
        position: 'sticky',
        top: '16px',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <RadarLogo size={36} />
          <div>
            <h1 style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-0.015em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              margin: 0
            }}>
              <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FLOODPULSE MUMBAI</span>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 300 }}>|</span>
              <span style={{ fontSize: '1.05rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.02em' }}>COMMAND CENTER</span>
            </h1>
          </div>
        </div>

        {/* Tab switcher */}
        <nav style={{ display: 'flex', gap: '4px', overflowX: 'auto', maxWidth: '60%' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            Operations Room {activeTab === 'dashboard' && <span style={{ fontSize: '0.65rem', color: '#00F5D4', marginLeft: '4px', fontWeight: 700 }}>(Active)</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('unifier')}
            className={`tab-btn ${activeTab === 'unifier' ? 'active' : ''}`}
          >
            Data Silo Unifier
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
          >
            Resources
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className={`tab-btn ${activeTab === 'weather' ? 'active' : ''}`}
          >
            Weather
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          >
            Alerts
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          >
            Logs
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          >
            Analytics
          </button>

          {/* Extra tabs for PDF/PPT documentation */}
          <button
            onClick={() => setActiveTab('pitch')}
            className={`tab-btn ${activeTab === 'pitch' ? 'active' : ''}`}
          >
            Pitch Deck
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`tab-btn ${activeTab === 'report' ? 'active' : ''}`}
          >
            Proposal Report
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('users')}
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            >
              Analyst Registry
            </button>
          )}
        </nav>

        {/* Glowing Telemetry Wave Graphic from Mockup */}
        <svg width="120" height="32" viewBox="0 0 120 32" style={{ opacity: 0.85, pointerEvents: 'none', marginLeft: 'auto', marginRight: '16px' }} className="desktop-only">
          <defs>
            <linearGradient id="headerWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00D2FF" />
              <stop offset="50%" stopColor="#9D4EDD" />
              <stop offset="100%" stopColor="#FF007A" />
            </linearGradient>
            <filter id="headerWaveGlow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d="M 0 25 Q 20 8 40 20 T 80 12 T 120 18" fill="none" stroke="url(#headerWaveGrad)" strokeWidth="2.2" strokeLinecap="round" filter="url(#headerWaveGlow)" />
          <path d="M 0 16 Q 30 28 60 12 T 120 22" fill="none" stroke="rgba(0, 210, 255, 0.25)" strokeWidth="0.8" strokeDasharray="3,3" />
        </svg>

        {/* Profile info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Admin Crisis Level Control */}
          {isAdmin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>CRISIS LEVEL:</span>
              <select
                value={crisisLevel}
                onChange={(e) => handleCrisisChange(e.target.value as any)}
                className="input-field"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  width: 'auto',
                  background: crisisLevel === 'RED_ALERT' ? 'rgba(239, 68, 68, 0.15)' : crisisLevel === 'DRILL' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.03)',
                  borderColor: crisisLevel === 'RED_ALERT' ? 'var(--accent-red)' : crisisLevel === 'DRILL' ? 'var(--accent-yellow)' : 'rgba(255,255,255,0.08)',
                  color: crisisLevel === 'RED_ALERT' ? 'var(--accent-red)' : crisisLevel === 'DRILL' ? 'var(--accent-yellow)' : 'white',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <option value="NORMAL" style={{ background: '#0B0F19', color: 'white' }}>Normal</option>
                <option value="DRILL" style={{ background: '#0B0F19', color: 'var(--accent-yellow)' }}>Drill Mode</option>
                <option value="RED_ALERT" style={{ background: '#0B0F19', color: 'var(--accent-red)' }}>Red Alert</option>
              </select>
            </div>
          )}

          <div className="desktop-only" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Active Commander</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{user}</div>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px 12px', borderRadius: '8px' }}>
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Panel Content */}
      <main style={{ flex: 1, padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
        
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Real-time KPI Statistics */}
            <div className="stats-grid">
              <div className={getCardClass('card-stat-sos', 'glass-panel stat-card')} onClick={() => setSelectedCardId('card-stat-sos')}>
                <div className="stat-header">
                  <span>ACTIVE SOS DISPATCHES</span>
                  <AlertTriangle size={18} style={{ color: activeSOSCount > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }} />
                </div>
                <div>
                  <div className="stat-value" style={{ color: activeSOSCount > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                    {activeSOSCount}
                  </div>
                  <div className="stat-footer">
                    <span>{sosRequests.filter(r => r.status === 'PENDING').length} awaiting immediate boat assignment</span>
                  </div>
                </div>
              </div>

              <div className={getCardClass('card-stat-boats', 'glass-panel stat-card')} onClick={() => setSelectedCardId('card-stat-boats')}>
                <div className="stat-header">
                  <span>NGO VESSELS DEPLOYED</span>
                  <Ship size={18} style={{ color: 'var(--accent-blue)' }} />
                </div>
                <div>
                  <div className="stat-value">{deployedBoats}</div>
                  <div className="stat-footer">
                    <span>Active rescue vessels monitoring designated wards</span>
                  </div>
                </div>
              </div>

              <div className={getCardClass('card-stat-depth', 'glass-panel stat-card')} onClick={() => setSelectedCardId('card-stat-depth')}>
                <div className="stat-header">
                  <span>AVG SUBMERGENCE DEPTH</span>
                  <Waves size={18} style={{ color: averageSubmergence > 2.0 ? 'var(--accent-yellow)' : 'var(--accent-cyan)' }} />
                </div>
                <div>
                  <div className="stat-value">{averageSubmergence} ft</div>
                  <div className="stat-footer">
                    <span>Calculated across local Mumbai ward elevation markers</span>
                  </div>
                </div>
              </div>

              <div className={getCardClass('card-stat-transit', 'glass-panel stat-card')} onClick={() => setSelectedCardId('card-stat-transit')}>
                <div className="stat-header">
                  <span>RAILWAY TRANSIT NET</span>
                  <Train size={18} style={{ color: railway.color }} />
                </div>
                <div>
                  <div className="stat-value" style={{ color: railway.color, fontSize: '1.4rem', marginTop: '6px', marginBottom: '8px' }}>
                    {railway.status}
                  </div>
                  <div className="stat-footer">
                    <span>Central & Western transit status feed</span>
                  </div>
                </div>
              </div>

              {/* Weather Telemetry KPI Card */}
              <div className={getCardClass('card-stat-weather', 'glass-panel stat-card')} style={{ cursor: 'pointer' }} onClick={() => {
                setSelectedCardId('card-stat-weather');
                setActiveTab('weather');
              }}>
                <div className="stat-header">
                  <span>WEATHER MET STATS</span>
                  <Waves size={18} style={{ color: getRainfallStatus(rainfall).color }} />
                </div>
                <div>
                  <div className="stat-value" style={{ color: getRainfallStatus(rainfall).color }}>
                    {rainfall} mm/hr
                  </div>
                  <div className="stat-footer">
                    <span>Current warning: <strong style={{ color: getRainfallStatus(rainfall).color }}>{getRainfallStatus(rainfall).text}</strong></span>
                  </div>
                </div>
              </div>

              {/* Live Log Ticker KPI Card */}
              <div className={getCardClass('card-stat-logs', 'glass-panel stat-card')} style={{ cursor: 'pointer' }} onClick={() => {
                setSelectedCardId('card-stat-logs');
                setActiveTab('logs');
              }}>
                <div className="stat-header">
                  <span>AUDIT DIAGNOSTICS</span>
                  <Clock size={18} style={{ color: 'var(--accent-cyan)' }} />
                </div>
                <div>
                  <div className="stat-value" style={{ fontSize: '0.95rem', color: '#10B981', fontFamily: 'monospace', letterSpacing: '-0.02em', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginTop: '12px', marginBottom: '14px' }}>
                    {systemLogs[0] ? systemLogs[0].split(' - ')[1] || systemLogs[0] : 'STABLE'}
                  </div>
                  <div className="stat-footer">
                    <span>Audit logs synced. Tap to open kernel console.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="dashboard-grid">
              
               {/* GIS Map visualization */}
               <div style={{ height: '100%' }}>
                 <MumbaiMap
                   rainfall={crisisLevel === 'RED_ALERT' ? Math.min(150, rainfall + 30) : rainfall}
                   tide={crisisLevel === 'RED_ALERT' ? Math.min(6.0, tide + 1.2) : tide}
                   drainage={crisisLevel === 'RED_ALERT' ? Math.max(0, drainage - 20) : drainage}
                   selectedWardId={selectedWardId}
                   onWardSelect={(ward) => setSelectedWardId(ward.id)}
                   className={getCardClass('card-gis-map')}
                   onClick={() => setSelectedCardId('card-gis-map')}
                 />
               </div>

              {/* Controls and SOS queue */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* ENVIRONMENTAL CONTROLS */}
                {isAdmin ? (
                  <div className={getCardClass('card-env-controls')} onClick={() => setSelectedCardId('card-env-controls')} style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Settings style={{ color: 'var(--accent-cyan)' }} size={18} />
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.05em' }}>ENVIRONMENTAL CONTROLS</h3>
                      </div>
                      <span style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>•••</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                      {/* Rainfall Intensity Slider */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                          <span style={{ color: '#E2E8F0' }}>Rainfall Intensity (mm/hr)</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'white', fontWeight: 700 }}>{rainfall} mm/hr</span>
                            <span style={{
                              padding: '2px 8px',
                              fontSize: '0.6rem',
                              fontWeight: 700,
                              borderRadius: '4px',
                              background: getRainfallStatus(rainfall).bg,
                              color: getRainfallStatus(rainfall).color,
                              border: `1px solid ${getRainfallStatus(rainfall).border}`
                            }}>
                              {getRainfallStatus(rainfall).text.split(' ')[0]}
                            </span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="250"
                          value={rainfall}
                          onChange={(e) => setRainfall(parseInt(e.target.value))}
                          className="slider-rainfall"
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748B', marginTop: '4px' }}>
                          <span>Range: 0-250</span>
                          <span>Status: <span style={{ color: getRainfallStatus(rainfall).color, fontWeight: 600 }}>{getRainfallStatus(rainfall).text}</span></span>
                        </div>
                      </div>

                      {/* Tide Height Slider */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                          <span style={{ color: '#E2E8F0' }}>Tide Height (Meters)</span>
                          <span style={{ color: 'white', fontWeight: 700 }}>{tide} M</span>
                        </div>
                        <input
                          type="range"
                          min="0.0"
                          max="6.5"
                          step="0.1"
                          value={tide}
                          onChange={(e) => setTide(parseFloat(e.target.value))}
                          className="slider-tide"
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748B', marginTop: '4px' }}>
                          <span>Range: 0.0-6.5</span>
                          <span>Status: <span style={{ color: getTideStatus(tide).color, fontWeight: 600 }}>{getTideStatus(tide).text}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={getCardClass('card-env-controls')} onClick={() => setSelectedCardId('card-env-controls')} style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Radio style={{ color: 'var(--accent-green)', animation: 'pulse-ring 2s infinite' }} size={18} />
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.05em' }}>ENVIRONMENTAL TELEMETRY</h3>
                      </div>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1rem' }}>•••</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                      <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Precipitation Telemetry</div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-blue)', marginTop: '2px' }}>{rainfall} mm/hr</div>
                        </div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: getRainfallStatus(rainfall).bg, color: getRainfallStatus(rainfall).color }}>{getRainfallStatus(rainfall).text}</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Astronomical Tide Gauge</div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-purple)', marginTop: '2px' }}>{tide} M</div>
                        </div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: getTideStatus(tide).bg, color: getTideStatus(tide).color }}>{getTideStatus(tide).text}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* EMERGENCY SOS REQUESTS */}
                <div className={getCardClass('card-sos-requests')} onClick={() => setSelectedCardId('card-sos-requests')} style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Radio style={{ color: 'var(--accent-red)', animation: 'pulse-ring 2s infinite' }} size={18} />
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.05em' }}>EMERGENCY SOS REQUESTS</h3>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>•••</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '380px', flex: 1, paddingRight: '4px' }}>
                    {sosRequests.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="glass-panel"
                        style={{
                          padding: '12px 16px',
                          background: 'rgba(10, 18, 30, 0.25)',
                          borderColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          textAlign: 'left'
                        }}
                      >
                        {/* Clock Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#64748B', gap: '2px', borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: '12px', minWidth: '45px' }}>
                          <Clock size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
                          <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>{ticket.time}</span>
                        </div>

                        {/* Mid Details Column */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>
                            {ticket.location}:
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                            <span>{ticket.details}</span>
                            
                            {/* Inline Dispatch Actions */}
                            {ticket.status === 'PENDING' ? (
                              isAdmin ? (
                                <button
                                  onClick={() => handleDispatch(ticket.id)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: 0,
                                    color: 'var(--accent-blue)',
                                    textDecoration: 'underline',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                  disabled={dispatchingId !== null}
                                >
                                  [Dispatch]
                                </button>
                              ) : (
                                <span style={{ color: '#64748B', fontSize: '0.7rem', fontWeight: 600 }}>[Pending Admin]</span>
                              )
                            ) : ticket.status === 'DISPATCHING' ? (
                              <span style={{ color: 'var(--accent-blue)', fontSize: '0.7rem', fontWeight: 700, animation: 'pulse 1s infinite' }}>[Dispatching...]</span>
                            ) : (
                              <span style={{ color: 'var(--accent-green)', fontSize: '0.7rem', fontWeight: 700 }}>
                                [Assigned: {ticket.boatId}]
                              </span>
                            )}
                            
                            <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
                            
                            <button
                              onClick={() => alert(`Analyst Log [Contact: ${ticket.contact} | Exposures: ${ticket.victimCount} citizens]`)}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                color: 'rgba(0, 210, 255, 0.6)',
                                textDecoration: 'underline',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              [Details]
                            </button>
                          </div>
                        </div>

                        {/* Status Badge Column */}
                        <div style={{ minWidth: '85px', textAlign: 'right' }}>
                          <span style={{
                            padding: '4px 10px',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            borderRadius: '20px',
                            background: ticket.status === 'PENDING' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                            color: ticket.status === 'PENDING' ? 'var(--accent-red)' : 'var(--accent-green)',
                            border: ticket.status === 'PENDING' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
                            boxShadow: ticket.status === 'PENDING' ? '0 0 8px rgba(239, 68, 68, 0.2)' : '0 0 8px rgba(16, 185, 129, 0.2)',
                            display: 'inline-block',
                            width: '100%',
                            textAlign: 'center'
                          }}>
                            {ticket.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {activeTab === 'unifier' && (
          <SiloUnifier isAdmin={isAdmin} onParsedSOS={handleParsedSOS} />
        )}

        {activeTab === 'pitch' && (
          <PitchDeck />
        )}

        {activeTab === 'report' && (
          <ProposalReport />
        )}

        {activeTab === 'users' && isAdmin && (
          <UserDirectory currentUserEmail={userEmail} />
        )}

        {activeTab === 'resources' && (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)', animation: 'pulse 1.5s infinite' }} />
                Tactical Resource Allocation Matrix
              </h2>
              <span className="badge badge-info" style={{ letterSpacing: '0.05em' }}>GPS LINK SYNCED</span>
            </div>

            {/* Transponder Radar Sweep Banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(0, 245, 212, 0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(0, 245, 212, 0.08)', marginBottom: '24px' }}>
              <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                <svg width="60" height="60" viewBox="0 0 60 60" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="30" cy="30" r="28" fill="none" stroke="rgba(0, 245, 212, 0.12)" strokeWidth="1" />
                  <circle cx="30" cy="30" r="18" fill="none" stroke="rgba(0, 245, 212, 0.08)" strokeWidth="1" />
                  <line x1="30" y1="0" x2="30" y2="60" stroke="rgba(0, 245, 212, 0.06)" strokeWidth="1" />
                  <line x1="0" y1="30" x2="60" y2="30" stroke="rgba(0, 245, 212, 0.06)" strokeWidth="1" />
                  <path d="M 30 30 L 30 2 A 28 28 0 0 1 58 30 Z" fill="url(#radarSweepGrad)" style={{ transformOrigin: '30px 30px', animation: 'logo-rotate 4s linear infinite' }} />
                  <defs>
                    <linearGradient id="radarSweepGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="rgba(0, 245, 212, 0.35)" />
                      <stop offset="100%" stopColor="rgba(0, 245, 212, 0)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', top: '27px', left: '27px', width: '6px', height: '6px', background: 'var(--accent-red)', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', margin: 0, letterSpacing: '0.02em' }}>ACTIVE TRANSPONDER BEACONS</h4>
                <p style={{ fontSize: '0.72rem', color: '#94A3B8', margin: '4px 0 0', lineHeight: '1.4' }}>
                  Ingesting telemetry from rescue craft transponders. Automatic GPS pinging interval active at <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>5000ms</span>.
                </p>
              </div>
            </div>

            {/* Asset Cards Grid */}
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94A3B8', marginBottom: '12px' }}>RELIEF VESSEL FLEET STATUS</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[
                { id: 'TCET-BOAT-01', type: 'Zodiac Inflatable', location: 'WARD G/S (Dadar Subway)', status: 'ENROUTE TO RESCUE', battery: '92%', signal: 'STABLE [98%]', lat: '19.0284', lon: '72.8402', color: 'var(--accent-blue)' },
                { id: 'TCET-BOAT-02', type: 'Fiberglass Patrol', location: 'WARD L (Kurla Creek)', status: 'STANDBY OPERATIONAL', battery: '100%', signal: 'STRONG [100%]', lat: '19.0722', lon: '72.8791', color: 'var(--accent-green)' },
                { id: 'TCET-BOAT-03', type: 'Aluminum Utility', location: 'WARD K/W (Andheri subway)', status: 'STANDBY OPERATIONAL', battery: '85%', signal: 'STABLE [94%]', lat: '19.1172', lon: '72.8339', color: 'var(--accent-green)' },
                { id: 'TCET-DRONE-01', type: 'Reconnaissance Quad', location: 'WARD G/N (Dharavi)', status: 'AERIAL SCAN ONGOING', battery: '47%', signal: 'WARNING [65%]', lat: '19.0380', lon: '72.8538', color: 'var(--accent-purple)' },
                { id: 'TCET-TRUCK-01', type: 'Amphibious Unimog', location: 'WARD F/S (Parel road)', status: 'BLOCKED IN TRANSIT', battery: '96%', signal: 'DEGRADED [40%]', lat: '19.0028', lon: '72.8422', color: 'var(--accent-red)' }
              ].map((asset) => (
                <div
                  key={asset.id}
                  style={{
                    background: 'rgba(10, 18, 32, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Decorative corner tag */}
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', background: asset.color }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white' }}>{asset.id}</span>
                    <span style={{ fontSize: '0.65rem', color: asset.color, fontWeight: 700 }}>{asset.status}</span>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    <div style={{ marginBottom: '4px' }}><strong>Type:</strong> {asset.type}</div>
                    <div style={{ marginBottom: '4px' }}><strong>Sector:</strong> {asset.location}</div>
                    <div style={{ marginBottom: '4px' }}><strong>GPS:</strong> {asset.lat}, {asset.lon}</div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: '#64748B' }}>
                    <span>⚡ BATT: {asset.battery}</span>
                    <span>📶 {asset.signal}</span>
                  </div>

                  <button
                    onClick={() => alert(`[COMMAND PIN SENT]\nPinged transponder ${asset.id} successfully!\nLat: ${asset.lat}\nLon: ${asset.lon}\nResponse latency: 14ms\nHardware Check: SECURE.`)}
                    className="btn-secondary"
                    style={{ padding: '6px', fontSize: '0.7rem', width: '100%', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}
                  >
                    Ping Asset Transponder
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'weather' && (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', margin: 0 }}>
                Meteorological Doppler & Astronomical Tide Matrix
              </h2>
              <span className="badge badge-warning" style={{ animation: 'pulse 2s infinite' }}>COINCIDENCE DANGER INDEX: HIGH</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
              {/* Doppler feeds */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#030712', border: '1px solid rgba(0, 245, 212, 0.1)', borderRadius: '8px', height: '240px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.15 }}>
                    <pattern id="dopplerGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--accent-cyan)" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#dopplerGrid)" />
                  </svg>
                  <svg width="220" height="220" viewBox="0 0 200 200" style={{ position: 'relative' }}>
                    <defs>
                      <linearGradient id="sweepGlowGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(0, 245, 212, 0.4)" />
                        <stop offset="100%" stopColor="rgba(0, 245, 212, 0)" />
                      </linearGradient>
                      <filter id="radarGlow">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Concentric Technical HUD Rings */}
                    <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(0, 245, 212, 0.35)" strokeWidth="1" strokeDasharray="4,4" />
                    <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(0, 210, 255, 0.2)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="50" fill="none" stroke="rgba(157, 78, 221, 0.25)" strokeWidth="1" strokeDasharray="2,5" />
                    <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1" />

                    {/* Coordinate Grid Crosshairs */}
                    <line x1="100" y1="10" x2="100" y2="190" stroke="rgba(0, 245, 212, 0.08)" strokeWidth="0.8" strokeDasharray="3,3" />
                    <line x1="10" y1="100" x2="190" y2="100" stroke="rgba(0, 245, 212, 0.08)" strokeWidth="0.8" strokeDasharray="3,3" />

                    {/* Compass Ticks & Labels */}
                    <text x="100" y="14" fill="rgba(0, 245, 212, 0.7)" fontSize="8px" fontFamily="monospace" fontWeight="bold" textAnchor="middle">0° N</text>
                    <text x="100" y="195" fill="rgba(0, 245, 212, 0.7)" fontSize="8px" fontFamily="monospace" fontWeight="bold" textAnchor="middle">180° S</text>
                    <text x="187" y="103" fill="rgba(0, 245, 212, 0.7)" fontSize="8px" fontFamily="monospace" fontWeight="bold" textAnchor="start">90° E</text>
                    <text x="13" y="103" fill="rgba(0, 245, 212, 0.7)" fontSize="8px" fontFamily="monospace" fontWeight="bold" textAnchor="end">270° W</text>

                    {/* Simulated storm cell radar returns */}
                    <circle cx="130" cy="80" r={Math.min(45, Math.max(12, rainfall * 0.25))} fill="rgba(239, 68, 68, 0.4)" filter="blur(5px)" />
                    <circle cx="70" cy="110" r={Math.min(30, Math.max(8, tide * 5))} fill="rgba(245, 158, 11, 0.3)" filter="blur(4px)" />
                    
                    {/* Active Tracking Reticle Crosshairs */}
                    <path d="M 125 80 L 135 80 M 130 75 L 130 85" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="1" />
                    <text x="136" y="78" fill="rgba(239, 68, 68, 0.8)" fontSize="6px" fontFamily="monospace" fontWeight="bold">CELL_A: INUNDATION</text>

                    <path d="M 65 110 L 75 110 M 70 105 L 70 115" stroke="rgba(245, 158, 11, 0.8)" strokeWidth="1" />
                    <text x="76" y="108" fill="rgba(245, 158, 11, 0.8)" fontSize="6px" fontFamily="monospace" fontWeight="bold">CELL_B: SURGE</text>

                    <circle cx="120" cy="90" r="4" fill="var(--accent-cyan)" style={{ animation: 'pulse 1.5s infinite' }} />

                    {/* Sweeper Hand and Trailer Trail Fade */}
                    <g style={{ transformOrigin: '100px 100px', animation: 'logo-rotate 5s linear infinite' }}>
                      <path d="M 100 100 L 190 100 A 90 90 0 0 0 163.6 36.4 Z" fill="url(#sweepGlowGrad)" />
                      <line x1="100" y1="100" x2="190" y2="100" stroke="rgba(0, 245, 212, 0.95)" strokeWidth="1.8" filter="url(#radarGlow)" />
                    </g>
                  </svg>
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0,0,0,0.6)', padding: '6px 12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', fontFamily: 'monospace', color: '#34D399' }}>
                    MET-RADAR // SWEEP ACTIVE // CELL INUNDATION MARKER: <span style={{ color: 'var(--accent-red)', fontWeight: 'bold' }}>{rainfall > 100 ? 'CLOUDBURST DETECTED' : 'PRECIPITATION STABLE'}</span>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', marginBottom: '12px', letterSpacing: '0.02em' }}>CURRENT TELEMETRY METRICS</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>RAIN RATE</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-blue)', marginTop: '4px' }}>{rainfall} mm/hr</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>TIDE LEVEL</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-purple)', marginTop: '4px' }}>{tide} Meters</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>WIND SPEED</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginTop: '4px' }}>24 km/h</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B' }}>HUMIDITY</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginTop: '4px' }}>92%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tide Hydrograph Predictor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', marginBottom: '12px', letterSpacing: '0.02em' }}>NEXT SURGE PEAK WINDOW</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-yellow)' }}>T-Minus 02h 15m</div>
                      <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Peak Height: 5.4 meters at 23:45</span>
                    </div>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '70%', height: '100%', background: 'var(--gradient-warning)', borderRadius: '3px' }} />
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-light)', flex: 1 }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', marginBottom: '12px', letterSpacing: '0.02em' }}>PRECIPITATION OUTLOOK MATRIX</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { time: '22:00', rain: '65 mm/hr', risk: 'Moderate', color: 'var(--accent-blue)' },
                      { time: '23:00', rain: '110 mm/hr', risk: 'Severe (Tidal Peak)', color: 'var(--accent-red)' },
                      { time: '00:00', rain: '125 mm/hr', risk: 'Severe (Tidal Peak)', color: 'var(--accent-red)' },
                      { time: '01:00', rain: '45 mm/hr', risk: 'Moderate', color: 'var(--accent-blue)' }
                    ].map((row, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>{row.time} Forecast</span>
                        <span style={{ fontSize: '0.7rem', color: row.color, fontWeight: 700 }}>{row.rain} ({row.risk})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)', animation: 'pulse 1s infinite' }} />
                Strategic Commander Broadcaster
              </h2>
              <span className="badge badge-danger" style={{ letterSpacing: '0.05em' }}>TACTICAL TICKER ACTIVE</span>
            </div>

            {/* Marquee Command Banner */}
            <div style={{ background: '#090D1A', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', padding: '10px 16px', overflow: 'hidden', position: 'relative', marginBottom: '24px' }}>
              <div className="logo-pulse" style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-red)', marginRight: '16px', borderRight: '1px solid rgba(239,68,68,0.2)', paddingRight: '16px' }}>
                CRITICAL BROADCAST
              </div>
              <div style={{ display: 'inline-block', fontSize: '0.75rem', color: '#E2E8F0', fontFamily: 'monospace' }}>
                *** DADAR SUBWAY RESCUE IN PROGRESS // HINDMATA COINCIDENCES REACHED MAXIMUM FLOOD THRESHOLD ***
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1.5fr 1fr' : '1fr', gap: '24px' }}>
              {/* Broadcast Alert List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94A3B8', margin: '0 0 4px' }}>ACTIVE REGIONAL WARNINGS</h3>
                {broadcastAlerts.map((alertItem: any) => (
                  <div key={alertItem.id} style={{
                    padding: '16px',
                    background: 'rgba(10, 18, 30, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${
                      alertItem.type === 'CRITICAL' ? 'var(--accent-red)' :
                      alertItem.type === 'WARNING' ? 'var(--accent-yellow)' : 'var(--accent-blue)'
                    }`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>{alertItem.time} EST</span>
                        <span style={{
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: alertItem.type === 'CRITICAL' ? 'rgba(239,68,68,0.1)' : alertItem.type === 'WARNING' ? 'rgba(245,158,11,0.1)' : 'rgba(0,210,255,0.1)',
                          color: alertItem.type === 'CRITICAL' ? 'var(--accent-red)' : alertItem.type === 'WARNING' ? 'var(--accent-yellow)' : 'var(--accent-blue)'
                        }}>{alertItem.type}</span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'white', marginTop: '6px', fontWeight: 500 }}>{alertItem.text}</p>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setBroadcastAlerts(prev => prev.filter(a => a.id !== alertItem.id));
                          addSystemLog(`Removed broadcast alert: "${alertItem.text}"`);
                        }}
                        style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        [Resolve]
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Admin Broadcast controls */}
              {isAdmin && (
                <div style={{ background: 'rgba(10, 18, 30, 0.3)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', margin: 0 }}>Strategic Alert Broadcaster</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Warning Text</label>
                    <input
                      id="custom-alert-text"
                      type="text"
                      className="input-field"
                      placeholder="Enter critical warning text..."
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Severity Level</label>
                    <select id="custom-alert-level" className="input-field" style={{ cursor: 'pointer' }}>
                      <option value="INFO">INFO (Blue Indicator)</option>
                      <option value="WARNING">WARNING (Yellow Indicator)</option>
                      <option value="CRITICAL">CRITICAL (Red Indicator)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      const textInput = document.getElementById('custom-alert-text') as HTMLInputElement;
                      const levelSelect = document.getElementById('custom-alert-level') as HTMLSelectElement;
                      if (!textInput || !textInput.value) {
                        alert("Alert message cannot be blank!");
                        return;
                      }
                      const newAlert = {
                        id: Date.now(),
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                        type: levelSelect.value,
                        text: textInput.value
                      };
                      setBroadcastAlerts(prev => [newAlert, ...prev]);
                      addSystemLog(`Broadcasted strategic alert: "${textInput.value}"`);
                      textInput.value = '';
                      alert("Strategic Alert broadcasted successfully!");
                    }}
                    className="btn-primary"
                    style={{ background: 'var(--gradient-primary)', border: 'none', padding: '10px' }}
                  >
                    Broadcast Alert
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', height: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#34D399', animation: 'pulse 1s infinite' }} />
                  Real-Time Diagnostics Console
                </h2>
                <span style={{ fontSize: '0.65rem', color: '#64748B', fontFamily: 'monospace', display: 'block', marginTop: '2px' }}>
                  LOG INGESTION: ACTIVE | LATENCY: 4ms | AUDIT DB STATUS: SYNCED
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select
                  value={logLevelFilter}
                  onChange={(e) => setLogLevelFilter(e.target.value)}
                  className="input-field"
                  style={{ padding: '4px 10px', fontSize: '0.75rem', width: '120px', cursor: 'pointer', height: '32px' }}
                >
                  <option value="ALL">ALL LEVELS</option>
                  <option value="INFO">INFO</option>
                  <option value="WARN">WARNING</option>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="VESSEL">DISPATCH</option>
                </select>

                <input
                  id="logs-filter-input"
                  type="text"
                  placeholder="Filter by keyword..."
                  className="input-field"
                  style={{ padding: '4px 10px', fontSize: '0.75rem', width: '150px', height: '32px' }}
                  onChange={() => {
                    // Triggers state re-render
                    setSystemLogs(prev => [...prev]);
                  }}
                />

                <button
                  onClick={() => {
                    const content = systemLogs.join('\n');
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `floodpulse_system_audit_${new Date().toISOString().split('T')[0]}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    addSystemLog('Exported system audit logs to text report.');
                    alert('Diagnostics Audit Report extracted and downloaded successfully!');
                  }}
                  className="btn-primary"
                  style={{ padding: '0 14px', fontSize: '0.7rem', height: '32px', border: 'none', background: 'var(--gradient-primary)' }}
                >
                  Extract Report
                </button>

                <button
                  onClick={() => {
                    setSystemLogs([`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}] - Console diagnostics database flushed.`]);
                  }}
                  className="btn-secondary"
                  style={{ padding: '0 12px', fontSize: '0.7rem', height: '32px' }}
                >
                  Flush Console
                </button>
              </div>
            </div>

            {/* Live Doppler Scan Ticker HUD */}
            <div style={{ background: 'rgba(0, 245, 212, 0.03)', border: '1px solid rgba(0, 245, 212, 0.12)', borderRadius: '6px', padding: '12px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>📡 ACTIVE MET-RADAR SWEEP: WARD INTEGRITY ANALYSIS</span>
                <span style={{ color: 'white', fontWeight: 600 }}>SCANNING: <span style={{ color: 'var(--accent-yellow)' }}>{scanningSector}</span></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${scanProgress}%`, height: '100%', background: 'var(--gradient-primary)', transition: 'width 0.3s ease' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-cyan)', minWidth: '35px', textAlign: 'right' }}>{scanProgress}%</span>
              </div>
            </div>

            {/* ASCII System Art */}
            <div style={{ background: '#02050D', border: '1px solid rgba(52, 211, 153, 0.1)', borderRadius: '6px', padding: '12px', fontFamily: 'monospace', fontSize: '0.65rem', color: '#10B981', marginBottom: '16px', opacity: 0.8 }}>
              <pre style={{ margin: 0 }}>
{` ______   _        ____     ____   _____   ____   _    _  _       ____   ______
|  ____| | |      / __ \\   / __ \\ |  __ \\ |  _ \\ | |  | || |     / ____| |  ____|
| |__    | |     | |  | | | |  | || |  | || |_) || |  | || |    | (___   | |__   
|  __|   | |     | |  | | | |  | || |  | ||  __/ | |  | || |     \\___ \\  |  __|  
| |      | |____ | |__| | | |__| || |__| || |    | |__| || |____ ____) | | |____ 
|_|      |______| \\____/   \\____/ |_____/ |_|     \\____/ |______|_____/  |______|`}
              </pre>
            </div>
            
            <div style={{
              background: '#02050D',
              border: '1px solid rgba(52, 211, 153, 0.15)',
              borderRadius: '8px',
              padding: '16px',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: '#34D399',
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              boxShadow: 'inset 0 0 16px rgba(0, 0, 0, 0.8)'
            }}>
              {systemLogs
                .filter(log => {
                  // Severity Filter
                  if (logLevelFilter !== 'ALL') {
                    if (logLevelFilter === 'VESSEL' && !log.toLowerCase().includes('vessel')) return false;
                    if (logLevelFilter === 'INFO' && !log.toLowerCase().includes('info') && !log.toLowerCase().includes('sync') && !log.toLowerCase().includes('check')) return false;
                    if (logLevelFilter === 'WARN' && !log.toLowerCase().includes('warning') && !log.toLowerCase().includes('warn')) return false;
                    if (logLevelFilter === 'CRITICAL' && !log.toLowerCase().includes('critical') && !log.toLowerCase().includes('red_alert')) return false;
                  }
                  
                  const filterInput = document.getElementById('logs-filter-input') as HTMLInputElement;
                  if (!filterInput || !filterInput.value) return true;
                  return log.toLowerCase().includes(filterInput.value.toLowerCase());
                })
                .map((logLine, idx) => {
                  let badgeColor = 'rgba(52, 211, 153, 0.1)';
                  let textColor = 'var(--accent-green)';
                  let label = 'INFO';
                  let restOfLine = logLine;

                  if (logLine.startsWith('[')) {
                    const match = logLine.match(/^\[(.*?)\] (.*)$/);
                    if (match) {
                      label = match[1];
                      restOfLine = match[2];
                      if (label === 'CRITICAL') {
                        badgeColor = 'rgba(239, 68, 68, 0.15)';
                        textColor = 'var(--accent-red)';
                      } else if (label === 'WARNING') {
                        badgeColor = 'rgba(245, 158, 11, 0.15)';
                        textColor = 'var(--accent-yellow)';
                      } else if (label === 'DISPATCH') {
                        badgeColor = 'rgba(0, 210, 255, 0.15)';
                        textColor = 'var(--accent-blue)';
                      }
                    }
                  }

                  return (
                    <div key={idx} style={{ borderBottom: '1px dashed rgba(255, 255, 255, 0.02)', paddingBottom: '6px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '0.6rem', 
                        fontWeight: 700, 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        background: badgeColor, 
                        color: textColor, 
                        fontFamily: 'monospace',
                        minWidth: '70px',
                        textAlign: 'center'
                      }}>
                        {label}
                      </span>
                      <span style={{ color: label === 'CRITICAL' ? '#EF4444' : label === 'WARNING' ? '#FBBF24' : '#E2E8F0', flex: 1 }}>{restOfLine}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', margin: 0 }}>
                System Exposure & Submergence Distribution Curves
              </h2>
              <span className="badge badge-info">Ingestion Ratio: 100%</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
              {/* Vulnerability Distribution */}
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', marginBottom: '16px', letterSpacing: '0.02em' }}>SUBMERGENCE VULNERABILITY INDEX</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { ward: 'WARD L/S (Kurla)', val: Math.min(100, Math.floor(rainfall * 0.4 + tide * 8)), color: 'var(--accent-red)' },
                    { ward: 'WARD G/S (Dadar)', val: Math.min(100, Math.floor(rainfall * 0.32 + tide * 7)), color: 'var(--accent-red)' },
                    { ward: 'WARD K/W (Andheri)', val: Math.min(100, Math.floor(rainfall * 0.25 + tide * 5)), color: 'var(--accent-yellow)' },
                    { ward: 'WARD H/W (Bandra)', val: Math.min(100, Math.floor(rainfall * 0.15 + tide * 3)), color: 'var(--accent-blue)' }
                  ].map((row, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px' }}>
                        <span>{row.ward}</span>
                        <span style={{ color: row.color, fontWeight: 700 }}>{row.val}% Risk</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${row.val}%`, height: '100%', background: row.color, borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hydrograph area chart */}
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', marginBottom: '8px', letterSpacing: '0.02em' }}>COINCIDENCE WATER LEVEL CURVE</h3>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  
                  {/* Beautiful SVG Hydrograph Area Chart */}
                  <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100px', overflow: 'visible', marginTop: '16px' }}>
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(0, 210, 255, 0.4)" />
                        <stop offset="100%" stopColor="rgba(0, 210, 255, 0)" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`M 0 80 Q 50 ${100 - rainfall * 0.4} 100 ${90 - tide * 10} T 200 ${100 - drainage * 0.5} T 300 85 L 300 100 L 0 100 Z`}
                      fill="url(#chartGrad)"
                      stroke="var(--accent-cyan)"
                      strokeWidth="1.5"
                    />
                    {/* Data markers */}
                    <circle cx="100" cy={90 - tide * 10} r="4" fill="white" stroke="var(--accent-cyan)" strokeWidth="1.5" />
                    <text x="105" y={85 - tide * 10} fill="white" fontSize="6px" fontFamily="monospace">Peak: {tide}M</text>
                  </svg>
                  
                  <div style={{ textAlign: 'center', fontSize: '0.65rem', color: '#64748B', marginTop: '12px' }}>
                    Storm Coincidence: Rainfall Rate ({rainfall} mm/hr) vs Astronomical Surge Height ({tide}M).
                  </div>
                </div>
              </div>

              {/* Exposure ratio stats */}
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white', marginBottom: '16px', letterSpacing: '0.02em' }}>INCIDENCE CORRELATION</h3>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Unassigned Tickets</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-red)' }}>
                      {sosRequests.filter(t => t.status === 'PENDING').length} Incidents
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Dispatched NGO Vessels</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                      {sosRequests.filter(t => t.status === 'DISPATCHED').length} Active
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Total Ingested Data feeds</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>
                      {sosRequests.length} Total
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
      
      {/* Footer copyright */}
      <footer style={{ padding: '16px', color: '#475569', fontSize: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--border-light)', marginTop: 'auto', position: 'relative', zIndex: 2 }}>
        FloodPulse Command Center © 2026. Prepared for Rotaract Club of TCET Professional Development Avenue.
      </footer>
    </div>
  );
}

export default App;
