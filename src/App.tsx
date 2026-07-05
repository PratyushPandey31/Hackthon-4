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
  RefreshCw,
  Check,
  MapPin,
  Phone,
  Users
} from 'lucide-react';
import { UserDirectory } from './components/UserDirectory';
import confetti from 'canvas-confetti';

interface SOSTicket {
  id: number;
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
    location: 'Kurla (L-Ward)',
    details: 'Water level entered ground floors. 8 senior citizens stranded in Kranti Nagar. Require immediate evacuation boat.',
    level: 'CRITICAL',
    contact: '+91 98765 43210',
    victimCount: 8,
    status: 'PENDING'
  },
  {
    id: 2,
    location: 'Dadar (G-North)',
    details: 'Hindmata junction water logging at 2.2ft. Heavy drainage overflow. Local traffic diverted.',
    level: 'WARNING',
    contact: '+91 99887 76655',
    victimCount: 0,
    status: 'DISPATCHED',
    eta: 'Completed',
    boatId: 'TCET-BOAT-02'
  },
  {
    id: 3,
    location: 'Andheri (K-West)',
    details: 'Andheri Subway flooded up to 3.5ft. Two vehicles stuck. Police present. Need support to drain water.',
    level: 'CRITICAL',
    contact: '+91 91234 56789',
    victimCount: 2,
    status: 'PENDING'
  }
];

function App() {
  const [user, setUser] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [rainfall, setRainfall] = useState(45); // mm/hr
  const [tide, setTide] = useState(2.8); // meters
  const [drainage, setDrainage] = useState(75); // efficiency %
  const [activeTab, setActiveTab] = useState<'dashboard' | 'unifier' | 'pitch' | 'report' | 'users'>('dashboard');
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
  const [sosRequests, setSosRequests] = useState<SOSTicket[]>(INITIAL_SOS_TICKETS);
  const [dispatchingId, setDispatchingId] = useState<number | null>(null);

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
      location: newSOS.location,
      details: newSOS.details,
      level: newSOS.level,
      contact: newSOS.contact,
      victimCount: newSOS.victimCount,
      status: 'PENDING'
    };
    setSosRequests(prev => [ticket, ...prev]);
    setActiveTab('dashboard'); // Redirect to dashboard to see it
  };

  // Trigger dispatch animation
  const handleDispatch = (ticketId: number) => {
    setDispatchingId(ticketId);
    
    // Update ticket state to DISPATCHING
    setSosRequests(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: 'DISPATCHING' } : ticket
    ));

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

  // Calculated properties based on rainfall, tide, and drainage
  const averageSubmergence = parseFloat(
    Math.max(0, (rainfall * 0.03 + (tide - 2.0) * 0.5 - (drainage / 100) * 1.2)).toFixed(1)
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
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.025em'
            }}>
              FLOODPULSE MUMBAI
            </h1>
            <span style={{ fontSize: '0.65rem', color: '#64748B', display: 'block', fontWeight: 600, marginTop: '-2px' }}>
              REAL-TIME DISASTER CONTROL
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <nav style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <Radio size={16} /> Operations Room
          </button>
          <button
            onClick={() => setActiveTab('unifier')}
            className={`tab-btn ${activeTab === 'unifier' ? 'active' : ''}`}
          >
            Data Silo Unifier
          </button>
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
              <Users size={16} /> Analyst Registry
            </button>
          )}
        </nav>

        {/* Profile info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                  rainfall={rainfall}
                  tide={tide}
                  drainage={drainage}
                  selectedWardId={selectedWardId}
                  onWardSelect={(ward) => setSelectedWardId(ward.id)}
                />
              </div>

              {/* Controls and SOS queue */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* AI Simulation Control Panel */}
                {/* AI Simulation / Telemetry Status Panel based on Role */}
                {isAdmin ? (
                  <div className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <Settings style={{ color: 'var(--accent-cyan)' }} size={18} />
                      <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>AI Submergence Simulator</h3>
                    </div>

                    <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '16px', textAlign: 'left' }}>
                      Adjust real-time rainfall levels, high tide tables, and drainage blockages to recalculate inundation risk on the map.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                          <span>Rainfall Intensity</span>
                          <span style={{ color: 'var(--accent-blue)' }}>{rainfall} mm/hr</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="150"
                          value={rainfall}
                          onChange={(e) => setRainfall(parseInt(e.target.value))}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748B', marginTop: '4px' }}>
                          <span>Drizzle (0mm)</span>
                          <span>Cloudburst (150mm)</span>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                          <span>High Tide Height</span>
                          <span style={{ color: 'var(--accent-purple)' }}>{tide} meters</span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="6.0"
                          step="0.1"
                          value={tide}
                          onChange={(e) => setTide(parseFloat(e.target.value))}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748B', marginTop: '4px' }}>
                          <span>Low Tide (1.0m)</span>
                          <span>Extreme Surge (6.0m)</span>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                          <span>Drainage Efficiency</span>
                          <span style={{ color: drainage < 50 ? 'var(--accent-red)' : 'var(--accent-green)' }}>{drainage}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={drainage}
                          onChange={(e) => setDrainage(parseInt(e.target.value))}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748B', marginTop: '4px' }}>
                          <span>Blocked (0%)</span>
                          <span>Clear Channels (100%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <Radio style={{ color: 'var(--accent-green)', animation: 'pulse-ring 2s infinite' }} size={18} />
                      <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Telemetry Sensor Status</h3>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '16px', textAlign: 'left' }}>
                      Read-only real-time metrics parsed from Municipal Rain Gauges and creek level gauges.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                      <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Precipitation telemetry</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-blue)', marginTop: '2px' }}>{rainfall} mm/hr</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Astronomical surge gauge</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-purple)', marginTop: '2px' }}>{tide} meters</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Sewer gate efficiency</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-green)', marginTop: '2px' }}>{drainage}%</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Live SOS Queue */}
                <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Radio style={{ color: 'var(--accent-red)', animation: 'pulse-ring 2s infinite' }} size={18} />
                      <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>ResQ SOS Dispatch Feed</h3>
                    </div>
                    <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>Live Ingest</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '320px', flex: 1, paddingRight: '4px' }}>
                    {sosRequests.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="glass-panel"
                        style={{
                          padding: '14px',
                          background: 'rgba(255,255,255,0.01)',
                          borderColor: ticket.status === 'PENDING' ? 'rgba(239, 68, 68, 0.15)' : 'var(--border-light)',
                          borderRadius: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', color: 'white' }}>
                            <MapPin size={12} style={{ color: 'var(--accent-cyan)' }} /> {ticket.location}
                          </span>
                          <span className={`badge ${
                            ticket.level === 'CRITICAL' ? 'badge-danger' : 
                            ticket.level === 'WARNING' ? 'badge-warning' : 'badge-info'
                          }`} style={{ fontSize: '0.6rem' }}>
                            {ticket.level}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: '1.4' }}>
                          {ticket.details}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px', fontSize: '0.7rem', color: '#64748B' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={10} /> {ticket.contact}
                          </span>
                          
                          {ticket.victimCount > 0 && (
                            <span style={{ fontWeight: 600, color: 'white' }}>
                              {ticket.victimCount} People Exposed
                            </span>
                          )}
                        </div>

                        {ticket.status === 'PENDING' ? (
                          isAdmin ? (
                            <button
                              onClick={() => handleDispatch(ticket.id)}
                              className="btn-primary"
                              style={{ padding: '8px 12px', fontSize: '0.75rem', width: '100%', background: 'var(--gradient-primary)' }}
                              disabled={dispatchingId !== null}
                            >
                              Assign Nearest NGO Boat
                            </button>
                          ) : (
                            <div style={{
                              padding: '10px',
                              textAlign: 'center',
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px dashed rgba(255,255,255,0.08)',
                              borderRadius: '6px',
                              color: '#64748B',
                              fontSize: '0.75rem',
                              fontWeight: 500
                            }}>
                              Awaiting Administrative Dispatch
                            </div>
                          )
                        ) : ticket.status === 'DISPATCHING' ? (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            padding: '8px',
                            background: 'rgba(0, 210, 255, 0.1)',
                            border: '1px solid rgba(0, 210, 255, 0.2)',
                            borderRadius: '6px',
                            color: 'var(--accent-blue)',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            <RefreshCw size={12} className="logo-rotate" /> Ingesting Coordinates & Dispatching...
                          </div>
                        ) : (
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 12px',
                            background: 'rgba(16, 185, 129, 0.08)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '6px',
                            color: 'var(--accent-green)',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Check size={14} /> Assigned: {ticket.boatId}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#34D399' }}>ETA: {ticket.eta}</span>
                          </div>
                        )}
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

      </main>
      
      {/* Footer copyright */}
      <footer style={{ padding: '16px', color: '#475569', fontSize: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--border-light)', marginTop: 'auto', position: 'relative', zIndex: 2 }}>
        FloodPulse Command Center © 2026. Prepared for Rotaract Club of TCET Professional Development Avenue.
      </footer>
    </div>
  );
}

export default App;
