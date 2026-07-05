import React, { useState } from 'react';
import { Database, Cpu, Check, MessageSquare, AlertCircle } from 'lucide-react';

interface SiloUnifierProps {
  isAdmin: boolean;
  onParsedSOS: (sos: {
    location: string;
    details: string;
    level: 'CRITICAL' | 'WARNING' | 'ALERT';
    contact: string;
    victimCount: number;
  }) => void;
}

const SAMPLE_MESSAGES = [
  {
    id: 1,
    title: 'Kurla L-Ward Rescue',
    text: 'URGENT: Kurla West near station has 4.5 feet water. Ground floor houses are completely submerged. Around 12 elderly people trapped. Contact number is 9876543210. Please send boats!'
  },
  {
    id: 2,
    title: 'Dadar G-North Inundation',
    text: 'Water level rising rapidly at Dadar East near Hindmata Cinema, currently 2.5 feet. Blocked drainage is overflowing. Traffic stopped. Volunteer contact: 9988776655.'
  },
  {
    id: 3,
    title: 'Sion Platform Halts',
    text: 'Rail tracks at Sion F-North station are completely submerged. Central line trains suspended between CSMT and Kurla. 150 passengers stranded on platform. Station master log: 9810023456.'
  },
  {
    id: 4,
    title: 'Malad P-North Housing',
    text: 'ALERT: Low-lying slums in Malad Malwani sector experiencing severe submergence, water level at 3.5 feet. Over 25 families trapped inside ground floor shanties. Emergency contact: 9830045678.'
  },
  {
    id: 5,
    title: 'Andheri K-West Subway',
    text: 'Andheri West subway flooded under railway bridge, water height is 4.0 feet. Multiple vehicles stalled. 5 citizens climbed on car roofs waiting for rescue. Contact: 9890012345.'
  },
  {
    id: 6,
    title: 'Dharavi G-North Density',
    text: 'CRITICAL: Severe waterlogging in Dharavi sector 3. Local creek backflowing. Heavy rain has flooded local households. 30 people exposed. Contact cell: 9820098765.'
  },
  {
    id: 7,
    title: 'Colaba A-Ward astronomical surge',
    text: 'Colaba Geeta Nagar slums hit by high tide astronomical surge. Coastal waves entering houses. Water logging level at 2.0 feet. Inhabitants moving to higher grounds. Contact: 9930054321.'
  },
  {
    id: 8,
    title: 'Byculla E-Ward Transit block',
    text: 'Byculla East underpass completely flooded due to backflow of Love Grove outfall. Inundation depth is 3.0 feet. Transit disrupted. Relief coordinator contact: 9967788990.'
  },
  {
    id: 9,
    title: 'Chembur M-West Waterlogging',
    text: 'Moderate waterlogging near Chembur Shell Colony. Height is 1.5 feet. Drainage channels blocked by plastic trash. Local resident contact: 9875566778.'
  },
  {
    id: 10,
    title: 'Santacruz H-East Subway',
    text: 'Santacruz East subway flooded. Water level currently 2.0 feet. Traffic diverted to Bandra flyover. 8 people seeking assistance. Contact number is 9812233445.'
  }
];

export const SiloUnifier: React.FC<SiloUnifierProps> = ({ isAdmin, onParsedSOS }) => {
  const [activeSubTab, setActiveSubTab] = useState<'unifier' | 'bmc' | 'railways' | 'ngo'>('unifier');
  const [inputText, setInputText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState<any>(null);

  const handleSampleClick = (text: string) => {
    setInputText(text);
    setParsedResult(null);
  };

  const handleParse = () => {
    if (!inputText.trim()) return;
    
    setIsParsing(true);
    setParsedResult(null);

    // Simulate AI / NLP extraction
    setTimeout(() => {
      let location = 'Mumbai';
      let level: 'CRITICAL' | 'WARNING' | 'ALERT' = 'ALERT';
      let details = 'General flood report';
      let contact = 'Unknown';
      let victimCount = 1;

      const lowerText = inputText.toLowerCase();

      // Extract location
      if (lowerText.includes('kurla')) {
        location = 'WARD L (Kurla)';
      } else if (lowerText.includes('dadar')) {
        location = 'WARD G/S (Dadar)';
      } else if (lowerText.includes('sion')) {
        location = 'WARD F/N (Sion)';
      } else if (lowerText.includes('bandra')) {
        location = 'WARD H/W (Bandra)';
      } else if (lowerText.includes('andheri')) {
        location = 'WARD K/W (Andheri)';
      } else if (lowerText.includes('colaba')) {
        location = 'WARD A (Colaba)';
      } else if (lowerText.includes('malad')) {
        location = 'WARD P/N (Malad)';
      } else if (lowerText.includes('dharavi')) {
        location = 'WARD G/N (Dharavi)';
      } else if (lowerText.includes('byculla')) {
        location = 'WARD E (Byculla)';
      } else if (lowerText.includes('chembur')) {
        location = 'WARD M/W (Chembur)';
      } else if (lowerText.includes('santacruz')) {
        location = 'WARD H/E (Santacruz)';
      } else if (lowerText.includes('ghatkopar')) {
        location = 'WARD N (Ghatkopar)';
      }

      // Extract severity & details
      if (lowerText.includes('4.5 feet') || lowerText.includes('submerged') || lowerText.includes('trapped') || lowerText.includes('critical')) {
        level = 'CRITICAL';
        details = 'Severe flooding. High risk of life. Rescue boat and food packages required immediately.';
      } else if (lowerText.includes('rising') || lowerText.includes('2.5 feet') || lowerText.includes('warning')) {
        level = 'WARNING';
        details = 'Moderate water-logging. Traffic disruption. Drainage backflow monitoring needed.';
      } else {
        level = 'ALERT';
        details = 'Minor water logging reported. Precautionary monitoring active.';
      }

      // Extract contact number
      const phoneRegex = /(\+?\d{10,12})/;
      const match = inputText.match(phoneRegex);
      if (match) {
        contact = match[0];
      }

      // Extract victims
      const victimRegex = /(\d+)\s+(people|trapped|passengers|elderly)/;
      const victimMatch = inputText.match(victimRegex);
      if (victimMatch) {
        victimCount = parseInt(victimMatch[1]);
      }

      setParsedResult({
        location,
        details: inputText,
        inferredImpact: details,
        level,
        contact,
        victimCount
      });

      setIsParsing(false);
    }, 1500);
  };

  const handleMerge = () => {
    if (!parsedResult) return;
    onParsedSOS({
      location: parsedResult.location,
      details: `[NLP Unified Feed] ${parsedResult.inferredImpact} Raw: "${parsedResult.details.substring(0, 60)}..."`,
      level: parsedResult.level,
      contact: parsedResult.contact,
      victimCount: parsedResult.victimCount
    });
    alert('Silo unified! Citizen SOS successfully ingested and appended to live Dispatch Queue.');
    setParsedResult(null);
    setInputText('');
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database style={{ color: 'var(--accent-purple)' }} size={20} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Data Silo Integration Engine</h2>
        </div>

        {/* Sub Navigation */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setActiveSubTab('unifier')}
            className={`tab-btn ${activeSubTab === 'unifier' ? 'active' : ''}`}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <Cpu size={14} /> NLP Unifier
          </button>
          <button
            onClick={() => setActiveSubTab('bmc')}
            className={`tab-btn ${activeSubTab === 'bmc' ? 'active' : ''}`}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            BMC Sensors
          </button>
          <button
            onClick={() => setActiveSubTab('railways')}
            className={`tab-btn ${activeSubTab === 'railways' ? 'active' : ''}`}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            Railway Telemetry
          </button>
          <button
            onClick={() => setActiveSubTab('ngo')}
            className={`tab-btn ${activeSubTab === 'ngo' ? 'active' : ''}`}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            NGO Assets
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeSubTab === 'unifier' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
              Mumbai's emergency data sits in silos (WhatsApp, logs, paper slips). Use this terminal to parse unstructured citizen reports using AI to extract coordinates, impact level, and merge them into the global command system.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', flex: 1 }}>
              {/* Input Area */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {SAMPLE_MESSAGES.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => handleSampleClick(msg.text)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px' }}
                    >
                      <MessageSquare size={12} /> {msg.title}
                    </button>
                  ))}
                </div>

                <textarea
                  className="input-field"
                  placeholder="Paste raw WhatsApp text, handwritten log transcription, or radio transcripts here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  style={{
                    flex: 1,
                    minHeight: '180px',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    resize: 'none'
                  }}
                />

                <button
                  onClick={handleParse}
                  className="btn-primary"
                  disabled={isParsing || !inputText.trim()}
                  style={{ alignSelf: 'flex-start' }}
                >
                  <Cpu size={18} />
                  {isParsing ? 'Processing Silo Data...' : 'Analyze & Extract'}
                </button>
              </div>

              {/* Parsing Result Visualizer */}
              <div style={{
                border: '1px dashed rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '20px',
                background: 'rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '260px'
              }}>
                {isParsing ? (
                  <div style={{ textAlign: 'center', color: 'var(--accent-purple)' }}>
                    <div className="logo-rotate" style={{ display: 'inline-block', marginBottom: '16px' }}>
                      <Cpu size={40} style={{ filter: 'drop-shadow(0 0 8px var(--accent-purple))' }} />
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Ingesting & Structuring Data</h3>
                    <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Extracting entities: Location, Water Level, Stranded Citizens...</p>
                  </div>
                ) : parsedResult ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={16} style={{ color: 'var(--accent-green)' }} /> Parsed Successfully
                      </h3>
                      <span className={`badge ${
                        parsedResult.level === 'CRITICAL' ? 'badge-danger' : 
                        parsedResult.level === 'WARNING' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {parsedResult.level}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Extracted Location</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>{parsedResult.location}</div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Affected Citizens</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{parsedResult.victimCount} Trapped</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Callback Info</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{parsedResult.contact}</span>
                            {parsedResult.contact !== 'NOT AVAILABLE' && parsedResult.contact !== 'Unknown' && (
                              <a 
                                href={`tel:${parsedResult.contact}`} 
                                style={{ 
                                  color: 'var(--accent-cyan)', 
                                  textDecoration: 'underline', 
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              >
                                [Dial]
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Operational Translation</div>
                        <div style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>{parsedResult.inferredImpact}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!isAdmin) {
                          alert("Security Notice: Analyst profile does not hold database writing credentials. Please log in as an administrator to merge silo feeds.");
                          return;
                        }
                        handleMerge();
                      }}
                      className={isAdmin ? "btn-primary" : "btn-secondary"}
                      style={{
                        width: '100%',
                        background: isAdmin ? 'var(--gradient-success)' : 'rgba(255,255,255,0.02)',
                        color: isAdmin ? 'white' : '#64748B',
                        cursor: isAdmin ? 'pointer' : 'not-allowed',
                        border: isAdmin ? 'none' : '1px dashed rgba(255,255,255,0.1)'
                      }}
                    >
                      {isAdmin ? 'Merge to Global SOS Queue' : 'Merge Queue (Admin Only)'}
                    </button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#64748B' }}>
                    <AlertCircle size={32} style={{ color: '#475569', marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>Awaiting Input</h3>
                    <p style={{ fontSize: '0.75rem' }}>Select a sample template or paste direct citizen messages to test the unifier.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'bmc' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}><strong>Live API Telemetry Feed:</strong> Municipal IoT Rain Gauges & Level Sensors</p>
              <span className="badge badge-success">Online</span>
            </div>
            <pre style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '0.75rem',
              color: '#34D399',
              fontFamily: 'monospace',
              overflowX: 'auto',
              flex: 1
            }}>{`{
  "api_endpoint": "https://api.disaster.bmc.gov.in/v2/telemetry",
  "source": "Municipal_Rain_Gauge_Sensors",
  "timestamp": "${new Date().toISOString()}",
  "sensors": [
    { "id": "RG_01", "name": "Hindmata Junction", "water_logging_m": 0.42, "status": "WARN" },
    { "id": "RG_02", "name": "Kurla Depot", "water_logging_m": 1.12, "status": "CRIT" },
    { "id": "RG_03", "name": "Andheri Subway", "water_logging_m": 0.85, "status": "CRIT" },
    { "id": "RG_04", "name": "Bandra Western Exp Highway", "water_logging_m": 0.12, "status": "OK" }
  ]
}`}
            </pre>
          </div>
        )}

        {activeSubTab === 'railways' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
              <strong>Railway Transit Status:</strong> Track telemetry from Central, Western, and Harbour lines.
            </p>
            <div style={{ border: '1px solid var(--border-light)', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: '10px' }}>Line</th>
                    <th style={{ padding: '10px' }}>Hotspot Location</th>
                    <th style={{ padding: '10px' }}>Track Status</th>
                    <th style={{ padding: '10px' }}>Service Alert</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '10px', fontWeight: 600, color: '#EF4444' }}>Central Line</td>
                    <td style={{ padding: '10px' }}>Sion - Kurla</td>
                    <td style={{ padding: '10px' }}>Water logging 350mm</td>
                    <td style={{ padding: '10px' }}><span className="badge badge-danger">Suspended</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '10px', fontWeight: 600, color: '#F59E0B' }}>Harbour Line</td>
                    <td style={{ padding: '10px' }}>Chunabhatti - GTB Nagar</td>
                    <td style={{ padding: '10px' }}>Water logging 210mm</td>
                    <td style={{ padding: '10px' }}><span className="badge badge-warning">Delayed 20m</span></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', fontWeight: 600, color: '#10B981' }}>Western Line</td>
                    <td style={{ padding: '10px' }}>Prabhadevi - Dadar</td>
                    <td style={{ padding: '10px' }}>Water logging 90mm</td>
                    <td style={{ padding: '10px' }}><span className="badge badge-success">Operational</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSubTab === 'ngo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
              <strong>NGO Resource Registry:</strong> Registered rescue vehicles, vessels, and relief pack inventories in real-time.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Rotaract Club TCET</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginTop: '4px' }}>3 Rescue Boats</div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>250 Food Kits</div>
              </div>
              <div className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Red Cross Mumbai</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginTop: '4px' }}>6 Rescue Boats</div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>1000 Water Packs</div>
              </div>
              <div className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Robin Hood Army</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginTop: '4px' }}>0 Vessels</div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>500 Dry Meals</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
