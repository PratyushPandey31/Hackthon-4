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
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
  const [sosRequests, setSosRequests] = useState<SOSTicket[]>(INITIAL_SOS_TICKETS);
  const [dispatchingId, setDispatchingId] = useState<number | null>(null);
  const [crisisLevel, setCrisisLevel] = useState<'NORMAL' | 'DRILL' | 'RED_ALERT'>('NORMAL');

  const [systemLogs, setSystemLogs] = useState<string[]>([
    `[${new Date().toLocaleDateString()}] 14:05:22 - NGO dispatch vessels synced. 6 crews placed on standby.`,
    `[${new Date().toLocaleDateString()}] 14:02:18 - Systems Integrity Check passed. 22 GIS wards loaded offline.`,
    `[${new Date().toLocaleDateString()}] 14:02:15 - Active Commander admin@floodpulse.in logged in from secure terminal node.`
  ]);

  const [broadcastAlerts, setBroadcastAlerts] = useState<any[]>([
    { id: 1, time: '14:15', type: 'CRITICAL', text: 'Dadar Subway completely flooded. Commuter traffic suspended.' },
    { id: 2, time: '14:09', type: 'WARNING', text: 'Kurla West railway lines experiencing minor track flooding.' },
    { id: 3, time: '14:02', type: 'INFO', text: 'Sluice drainage gates at Love Grove active at 100% efficiency.' }
  ]);

  const addSystemLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    setSystemLogs(prev => [`[${new Date().toLocaleDateString()} ${time}] - ${msg}`, ...prev]);
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

  // Check login session on mount
  useEffect(() => {
    const loggedUser = localStorage.getItem('floodpulse_active_user');
    const loggedEmail = localStorage.getItem('floodpulse_active_email');
    if (loggedUser && loggedEmail) {
      setUser(loggedUser);
      setUserEmail(loggedEmail);
    }
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
              <div className="glass-panel stat-card glass-panel-glow">
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

              <div className="glass-panel stat-card">
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

              <div className="glass-panel stat-card">
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

              <div className="glass-panel stat-card">
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
            </div>

            {/* Dashboard Content Grid */}
            <div className="dashboard-grid">
              
              {/* GIS Map visualization */}
              <div>
                <MumbaiMap
                  rainfall={crisisLevel === 'RED_ALERT' ? Math.min(150, rainfall + 30) : rainfall}
                  tide={crisisLevel === 'RED_ALERT' ? Math.min(6.0, tide + 1.2) : tide}
                  drainage={crisisLevel === 'RED_ALERT' ? Math.max(0, drainage - 20) : drainage}
                  selectedWardId={selectedWardId}
                  onWardSelect={(ward) => setSelectedWardId(ward.id)}
                />
              </div>

              {/* Controls and SOS queue */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* ENVIRONMENTAL CONTROLS */}
                {isAdmin ? (
                  <div className="glass-panel" style={{ padding: '20px' }}>
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
                  <div className="glass-panel" style={{ padding: '20px' }}>
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
                <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
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
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              Active Fleet & Relief Assets Telemetry
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>AVAILABLE VESSEL FLEET</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', marginTop: '6px' }}>35 Zodiacs</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>ACTIVE DEPLOYED CREWS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-blue)', marginTop: '6px' }}>14 Crews</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>FIELD OFFICERS ON-CALL</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-green)', marginTop: '6px' }}>68 Officers</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>RECONNAISSANCE DRONES</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-purple)', marginTop: '6px' }}>6 Active</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '12px', fontWeight: 700 }}>Asset ID</th>
                  <th style={{ padding: '12px', fontWeight: 700 }}>Vessel Type</th>
                  <th style={{ padding: '12px', fontWeight: 700 }}>Sector Ward Location</th>
                  <th style={{ padding: '12px', fontWeight: 700 }}>Crew Size</th>
                  <th style={{ padding: '12px', fontWeight: 700 }}>Telemetry Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'TCET-BOAT-01', type: 'Inflatable Zodiac', ward: 'WARD G/S (Dadar)', crew: 4, status: 'Deployed (Rescue enroute)', color: 'var(--accent-blue)' },
                  { id: 'TCET-BOAT-02', type: 'Fiber-Reinforced Hull', ward: 'WARD L/S (Kurla)', crew: 3, status: 'Standby (Operational)', color: 'var(--accent-green)' },
                  { id: 'TCET-BOAT-03', type: 'Aluminum Utility Craft', ward: 'WARD K/W (Andheri)', crew: 5, status: 'Deployed (Rescue complete)', color: 'rgba(255,255,255,0.5)' },
                  { id: 'TCET-DRONE-A', type: 'DJI Matrice 300 RTK', ward: 'WARD D (Grant Rd)', crew: 1, status: 'Aerial Telemetry Ingestion', color: 'var(--accent-purple)' },
                  { id: 'TCET-DRONE-B', type: 'DJI Matrice 300 RTK', ward: 'WARD H/E (Santacruz)', crew: 1, status: 'Standby (Charged)', color: 'var(--accent-green)' }
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px', fontWeight: 700 }}>{row.id}</td>
                    <td style={{ padding: '12px' }}>{row.type}</td>
                    <td style={{ padding: '12px' }}>{row.ward}</td>
                    <td style={{ padding: '12px' }}>{row.crew} Personnel</td>
                    <td style={{ padding: '12px', color: row.color, fontWeight: 600 }}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'weather' && (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              Meteorological Forecasting & Tide Telemetry
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
              {/* Left Column: Live Gauges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: 'white' }}>Current Meteorological Telemetry</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Precipitation Rate</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-blue)', marginTop: '4px' }}>{rainfall} mm/hr</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>High Tide Height</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-purple)', marginTop: '4px' }}>{tide} Meters</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Wind Velocity</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginTop: '4px' }}>24 km/h SW</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Relative Humidity</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginTop: '4px' }}>92%</div>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: 'white' }}>Next Astronomical High Tide</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-yellow)' }}>T-Minus 02h 15m</div>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Predicted Peak Height: 5.4 meters at 23:45</span>
                    </div>
                    <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>Backflow Warning</span>
                  </div>
                </div>
              </div>

              {/* Right Column: 4-Hour Predictions */}
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: 'white' }}>Precipitation Forecast Matrix</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { time: '22:00', rain: '65 mm/hr', risk: 'Moderate', color: 'var(--accent-blue)' },
                    { time: '23:00', rain: '110 mm/hr', risk: 'Severe (Tidal Peak)', color: 'var(--accent-red)' },
                    { time: '00:00', rain: '125 mm/hr', risk: 'Severe (Tidal Peak)', color: 'var(--accent-red)' },
                    { time: '01:00', rain: '45 mm/hr', risk: 'Moderate', color: 'var(--accent-blue)' }
                  ].map((row, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>{row.time} Forecast</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px' }}>Rainfall Rate: {row.rain}</div>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: row.color }}>{row.risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: 0 }}>
                Municipal Broadcast Center
              </h2>
              <span className="badge badge-danger">Live Stream</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1.5fr 1fr' : '1fr', gap: '24px' }}>
              {/* Broadcast Alert List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {broadcastAlerts.map((alertItem: any) => (
                  <div key={alertItem.id} style={{
                    padding: '16px',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(255,255,255,0.04)',
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
                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>TIMESTAMP: {alertItem.time}</span>
                        <span style={{
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: alertItem.type === 'CRITICAL' ? 'rgba(239,68,68,0.1)' : alertItem.type === 'WARNING' ? 'rgba(245,158,11,0.1)' : 'rgba(0,210,255,0.1)',
                          color: alertItem.type === 'CRITICAL' ? 'var(--accent-red)' : alertItem.type === 'WARNING' ? 'var(--accent-yellow)' : 'var(--accent-blue)'
                        }}>{alertItem.type}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#E2E8F0', marginTop: '6px', fontWeight: 500 }}>{alertItem.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin Broadcast controls */}
              {isAdmin && (
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', margin: 0 }}>Broadcast Custom Alert</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Alert Message</label>
                    <input
                      id="custom-alert-text"
                      type="text"
                      className="input-field"
                      placeholder="e.g. Hindmata flyover closed due to 3 feet water logging..."
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Severity Level</label>
                    <select id="custom-alert-level" className="input-field" style={{ cursor: 'pointer' }}>
                      <option value="INFO">INFO (Blue)</option>
                      <option value="WARNING">WARNING (Yellow)</option>
                      <option value="CRITICAL">CRITICAL (Red)</option>
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
                      addSystemLog(`Broadcasted municipal alert: "${textInput.value}"`);
                      textInput.value = '';
                      alert("Municipal Alert broadcasted successfully!");
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
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', height: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: 0 }}>
                System Audit Log Console
              </h2>
              <button
                onClick={() => {
                  setSystemLogs([`[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}] - Console log history flushed by Commander.`]);
                }}
                className="btn-secondary"
                style={{ padding: '4px 10px', fontSize: '0.7rem' }}
              >
                Clear Console
              </button>
            </div>
            
            <div style={{
              background: '#040711',
              border: '1px solid var(--border-light)',
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
              boxShadow: 'inset 0 0 10px rgba(0, 245, 212, 0.05)'
            }}>
              {systemLogs.map((logLine, idx) => (
                <div key={idx} style={{ borderBottom: '1px dashed rgba(52, 211, 153, 0.05)', paddingBottom: '4px' }}>
                  <span style={{ color: 'rgba(52, 211, 153, 0.5)' }}>&gt;</span> {logLine}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              Inundation Analytics & Submergence Distribution
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
              {/* Submergence Risk by Ward */}
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', marginBottom: '16px' }}>Submergence Risk Indices</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { ward: 'WARD L/S (Kurla)', val: 95, color: 'var(--accent-red)' },
                    { ward: 'WARD G/S (Dadar)', val: 80, color: 'var(--accent-red)' },
                    { ward: 'WARD K/W (Andheri)', val: 55, color: 'var(--accent-yellow)' },
                    { ward: 'WARD H/W (Bandra)', val: 30, color: 'var(--accent-blue)' }
                  ].map((row, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px' }}>
                        <span>{row.ward}</span>
                        <span style={{ color: row.color, fontWeight: 700 }}>{row.val}%</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${row.val}%`, height: '100%', background: row.color, borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rescue Ticket Statistics */}
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', marginBottom: '16px' }}>SOS Dispatch Ratios</h3>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Active Pending Tickets</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-red)' }}>{sosRequests.filter(t => t.status === 'PENDING').length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Dispatched Vessels</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-green)' }}>{sosRequests.filter(t => t.status === 'DISPATCHED').length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Total Ingested Incidents</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>{sosRequests.length}</span>
                  </div>
                </div>
              </div>

              {/* Rain Correlation Index */}
              <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', marginBottom: '16px' }}>Incidence Correlation</h3>
                <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', gap: '12px', justifyContent: 'center' }}>
                  {[30, 45, 80, 110, 130, 95].map((val, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                      <div style={{ height: `${val * 0.7}px`, width: '12px', background: val > 90 ? 'var(--gradient-danger)' : 'var(--gradient-primary)', borderRadius: '2px' }} />
                      <span style={{ fontSize: '0.65rem', color: '#64748B' }}>T-{6 - idx}h</span>
                    </div>
                  ))}
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
