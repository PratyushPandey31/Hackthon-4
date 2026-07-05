import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Presentation, CheckCircle, ShieldAlert, Cpu, Sparkles, TrendingUp, Compass, Play, Pause, Timer, Award } from 'lucide-react';

export const PitchDeck: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simDelay, setSimDelay] = useState(65); // interactive response delay

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev === 4 ? 0 : prev + 1));
    }, 5500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const slides = [
    {
      title: "FLOODPULSE MUMBAI",
      subtitle: "Unified Predictive Flood Command & Emergency Dispatch Portal",
      tagline: "Solving the Urban Flood Response Blindspot • Ideathon 2026",
      icon: <Presentation size={48} style={{ color: 'var(--accent-cyan)' }} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', height: '100%', justifyContent: 'center', position: 'relative' }}>
          
          {/* Glowing Radar scan grid background */}
          <div style={{ position: 'absolute', width: '260px', height: '260px', borderRadius: '50%', border: '1px solid rgba(0, 245, 212, 0.1)', background: 'radial-gradient(circle, rgba(0, 245, 212, 0.03) 0%, transparent 70%)', zIndex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-ring 3s infinite' }}>
            <div style={{ width: '180px', height: '180px', borderRadius: '50%', border: '1.5px dashed rgba(0, 245, 212, 0.15)', animation: 'logo-rotate 20s linear infinite' }} />
          </div>

          <div className="glass-panel" style={{
            padding: '32px 40px',
            background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.08) 0%, rgba(157, 78, 221, 0.08) 100%)',
            borderColor: 'rgba(0, 210, 255, 0.25)',
            maxWidth: '650px',
            textAlign: 'center',
            zIndex: 1,
            boxShadow: '0 8px 32px 0 rgba(0, 210, 255, 0.05), inset 0 0 16px rgba(0, 245, 212, 0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', background: 'rgba(0, 245, 212, 0.12)', color: 'var(--accent-cyan)' }}>OFFICIAL PROPOSAL</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', background: 'rgba(157, 78, 221, 0.12)', color: 'var(--accent-purple)' }}>IDEATHON 2026</span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', marginBottom: '12px', letterSpacing: '-0.01em' }}>
              UNIFYING FRAGMENTED DISASTER DATASETS
            </h3>
            <p style={{ color: '#E2E8F0', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Designed to break administrative, transit, and volunteer information silos to enable predictive, real-time dispatch of emergency assets during Mumbai monsoons.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%', maxWidth: '700px', marginTop: '16px', zIndex: 1 }}>
            <div style={{ textAlign: 'center', background: 'rgba(4, 7, 18, 0.4)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Organizing Guild</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginTop: '4px' }}>Rotaract Club of TCET</div>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(4, 7, 18, 0.4)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Core Theme Focus</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginTop: '4px' }}>Smart Cities & Social Impact</div>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(4, 7, 18, 0.4)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Lead Developer</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '4px' }}>Pratyush Pandey</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "1. THE MONSOON CRISIS SILO BLINDSPOT",
      subtitle: "Fragmented Telemetry Feeds & Reactive Emergency Dispatch",
      tagline: "Critical information roadblocks causing response delays during heavy downpours",
      icon: <ShieldAlert size={48} style={{ color: 'var(--accent-red)' }} />,
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', height: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            
            {/* Visual Vector Node Diagram */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '8px', padding: '16px', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-red)', fontFamily: 'monospace', marginBottom: '6px' }}>DISCONNECTED INFRASTRUCTURE NODES:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.02)', border: '1px dashed #EF4444', borderRadius: '4px', fontSize: '0.75rem', color: '#EF4444' }}>BMC TELEMETRY</span>
                <span style={{ color: '#EF4444', fontWeight: 'bold' }}>✕ NO CONNECTIVITY ✕</span>
                <span style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.02)', border: '1px dashed #EF4444', borderRadius: '4px', fontSize: '0.75rem', color: '#EF4444' }}>NGO RESCUE BOATS</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--accent-red)', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0, marginTop: '2px' }}>1</div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', margin: 0 }}>Data Segregation</h4>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px', lineHeight: '1.4' }}>
                  BMC tide sensors, Central Railway track logs, and NGO logistics spreadsheets remain isolated. There is no unified schema.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--accent-red)', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0, marginTop: '2px' }}>2</div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', margin: 0 }}>Reactive Operations</h4>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px', lineHeight: '1.4' }}>
                  Emergency services react only after tracks and slums submerge. There is no joint forecasting model incorporating tide calendars.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--accent-red)', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0, marginTop: '2px' }}>3</div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', margin: 0 }}>Lost Citizen SOS Chats</h4>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px', lineHeight: '1.4' }}>
                  Low-income residents in high-risk zones (like Kurla or Malad slums) post emergency calls in raw chat files that fail to reach central dispatchers.
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '20px', background: 'rgba(239,68,68,0.03)', borderColor: 'rgba(239,68,68,0.25)', textAlign: 'left', boxShadow: 'inset 0 0 10px rgba(239,68,68,0.05)' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>TACTICAL EXPOSURE INDEX</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                3.5 <span style={{ fontSize: '1rem', color: '#64748B' }}>Hours</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px', marginBottom: '14px' }}>Average delay in localized municipal rescue dispatch</div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 'bold' }}>MONSOON IMPACT:</span>
                <p style={{ fontSize: '0.8rem', color: 'white', fontWeight: 500, marginTop: '4px', lineHeight: '1.4' }}>
                  Stranded local transit trains, flooded subway underpasses, and stranded elderly residents locked out from immediate coordination.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "2. THE SOLUTION: FLOODPULSE INTEGRATED PORTAL",
      subtitle: "GIS Telemetry Command, Predictive Simulation & NLP Ingestion",
      tagline: "One central command console merging municipal APIs, railway feeds, and citizen SOS queues",
      icon: <Sparkles size={48} style={{ color: 'var(--accent-cyan)' }} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', justifyContent: 'center' }}>
          
          {/* Flowchart Schematic */}
          <div style={{ background: '#030712', border: '1px solid rgba(0, 245, 212, 0.1)', borderRadius: '8px', padding: '16px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontFamily: 'monospace', position: 'relative' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 1 }}>
                <span style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#94A3B8' }}>BMC TELEMETRY API</span>
                <span style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#94A3B8' }}>RAILWAY TRANSIT NET</span>
                <span style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#94A3B8' }}>UNSTRUCTURED CHATS (NLP)</span>
              </div>
              
              {/* Laser connecting lines */}
              <div style={{ flex: 1, height: '2px', background: 'linear-gradient(90deg, rgba(0, 245, 212, 0) 0%, rgba(0, 245, 212, 0.8) 50%, rgba(0, 245, 212, 0) 100%)', margin: '0 20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: '40px', height: '100%', background: '#FFF', filter: 'blur(2px)', position: 'absolute', animation: 'scan-sweep 2s linear infinite' }} />
              </div>

              <div style={{ padding: '16px', background: 'rgba(0, 245, 212, 0.05)', border: '1.5px solid var(--accent-cyan)', borderRadius: '8px', zIndex: 1, boxShadow: '0 0 15px rgba(0, 245, 212, 0.2)' }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}>FLOODPULSE CONTROL CORE</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 800, fontSize: '0.65rem' }}>ACTIVE DISPATCH MODEL</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'left' }}>
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(4, 7, 18, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Compass size={18} style={{ color: 'var(--accent-blue)' }} />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', margin: 0 }}>Unified GIS Map</h4>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: '1.4', margin: 0 }}>
                High-fidelity, vector-based interactive map displaying live submergence depths, active rescue vessels, and population indices.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(4, 7, 18, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Cpu size={18} style={{ color: 'var(--accent-purple)' }} />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', margin: 0 }}>Predictive AI Engine</h4>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: '1.4', margin: 0 }}>
                Calculates real-time inundation hazard values by correlating precipitation volumes, tide curves, and drainage efficiency parameters.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(4, 7, 18, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', margin: 0 }}>Silo Integration NLP</h4>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: '1.4', margin: 0 }}>
                Automatically parses unstructured chat feeds, extracts coordinates and contacts, and generates structured rescue tasks.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "3. INTERACTIVE IMPACT SIMULATOR (JUDGES EYE)",
      subtitle: "Drag the Slider to Simulate Rescue Dispatch Efficiency Gain",
      tagline: "Test in real-time how immediate predictive coordination saves lives and cuts transit halts",
      icon: <Award size={48} style={{ color: 'var(--accent-green)' }} />,
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '32px', height: '100%', alignItems: 'center' }}>
          
          {/* Interactive Calculator Slider Panel */}
          <div className="glass-panel" style={{ padding: '24px', background: 'rgba(4, 7, 18, 0.5)', textAlign: 'left' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Timer size={18} style={{ color: 'var(--accent-cyan)' }} />
              SIMULATED RESPONSE TIME DELAY
            </h4>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px' }}>
                <span style={{ color: '#94A3B8' }}>Dispatch Delay (Minutes)</span>
                <span style={{ color: simDelay < 15 ? 'var(--accent-green)' : simDelay < 45 ? 'var(--accent-yellow)' : 'var(--accent-red)', fontWeight: 'extrabold', fontSize: '1.1rem' }}>
                  {simDelay} Minutes
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={simDelay}
                onChange={(e) => setSimDelay(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-cyan)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748B', marginTop: '4px' }}>
                <span>5m (Predictive Target)</span>
                <span>120m (Reactive Average)</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 'bold', letterSpacing: '0.05em' }}>DIAGNOSTICS PROFILE:</span>
              <p style={{ fontSize: '0.8rem', color: '#E2E8F0', marginTop: '6px', margin: 0, lineHeight: '1.4' }}>
                {simDelay < 15 
                  ? 'Ideathon Winner Grade. Local sub-ward dispatch is preemptive. All stranded targets successfully assigned vessels before flood rise.' 
                  : simDelay < 45 
                  ? 'Alert status active. Low-lying slum roads submerged. Boats experiencing routing bottlenecks.' 
                  : 'Critical status. Heavy downpour has flooded subways. NGO units operating blindly with zero telemetry routing.'}
              </p>
            </div>
          </div>

          {/* Calculator Results Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', borderLeft: `4px solid ${simDelay < 15 ? 'var(--accent-green)' : simDelay < 45 ? 'var(--accent-yellow)' : 'var(--accent-red)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Projected Casualties</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: simDelay < 15 ? 'var(--accent-green)' : simDelay < 45 ? 'var(--accent-yellow)' : 'var(--accent-red)' }}>
                  {simDelay < 15 ? '0' : Math.floor(simDelay * 0.9)}
                </span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', borderLeft: '4px solid var(--accent-blue)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>NGO Dispatch Efficiency</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
                  {Math.max(15, 100 - Math.floor(simDelay * 0.7))}%
                </span>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', borderLeft: '4px solid var(--accent-cyan)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Impact Multiplier Rating</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
                  {simDelay < 15 ? 'OPTIMAL [9.8x]' : simDelay < 45 ? 'STABLE [4.5x]' : 'DEGRADED [1.2x]'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "4. ROADMAP & SCALE HORIZONS",
      subtitle: "Transitioning to Closed-Loop Automated Infrastructure Actions",
      tagline: "The three-phase deployment plan built for metropolitan expansions",
      icon: <TrendingUp size={48} style={{ color: 'var(--accent-cyan)' }} />,
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', height: '100%', alignItems: 'center', textAlign: 'left' }}>
          
          {/* Timeline roadmap dots */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: '2px solid rgba(0, 245, 212, 0.15)', paddingLeft: '20px', position: 'relative' }}>
            
            <div style={{ position: 'relative' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-green)', position: 'absolute', left: '-27px', top: '4px', boxShadow: '0 0 8px var(--accent-green)' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white' }}>Phase 1 (Immediate Ideathon): Data Unification</div>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px', lineHeight: '1.4' }}>
                Deploy cross-silo APIs, structured NLP message parser engines, and visual GIS overlays.
              </p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-yellow)', position: 'absolute', left: '-27px', top: '4px', boxShadow: '0 0 8px var(--accent-yellow)' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white' }}>Phase 2 (monsoon 2026): IoT Sluice Automation</div>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px', lineHeight: '1.4' }}>
                Connect APIs directly to municipal stormwater pumps and drainage gates for automated trigger operations.
              </p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-cyan)', position: 'absolute', left: '-27px', top: '4px', boxShadow: '0 0 8px var(--accent-cyan)' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white' }}>Phase 3 (2027): Broadcaster Telecommunications</div>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px', lineHeight: '1.4' }}>
                Integrate with telecom cells to auto-alert citizen devices located in high-risk coordinates in local language SMS formats.
              </p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(0, 245, 212, 0.02)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'white', marginBottom: '12px', letterSpacing: '0.05em' }}>SUSTAINABILITY MATRIX</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                <span>Cloud Server Costs</span>
                <span style={{ color: 'white', fontWeight: 600 }}>Minimal (Static Hosting)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                <span>Maintenance</span>
                <span style={{ color: 'white', fontWeight: 600 }}>Rotaract Volunteer Hub</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                <span>Inter-City Scaling</span>
                <span style={{ color: 'white', fontWeight: 600 }}>High (Chennai, Kochi)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px' }}>
                <span>Select Feasibility</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>READY TO DEPLOY NOW</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '620px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Slide Progress Indicator */}
      <div style={{ height: '3px', width: '100%', background: 'rgba(255,255,255,0.04)', position: 'absolute', top: 0, left: 0, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${((currentSlide + 1) / slides.length) * 100}%`, background: 'var(--gradient-primary)', transition: 'width 0.4s ease-out' }} />
      </div>

      {/* Slide Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '20px', marginTop: '4px' }}>
        <div>
          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #FFF 30%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '4px'
          }}>
            {slides[currentSlide].title}
          </h2>
          <p style={{ color: 'var(--accent-cyan)', fontSize: '0.95rem', fontWeight: 600 }}>
            {slides[currentSlide].subtitle}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {slides[currentSlide].icon}
        </div>
      </div>

      {/* Slide Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10px 0' }}>
        {slides[currentSlide].content}
      </div>

      {/* Slide Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginTop: '20px' }}>
        <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Slide {currentSlide + 1} of {slides.length}</span>
          <span>•</span>
          <span style={{ fontStyle: 'italic' }}>{slides[currentSlide].tagline}</span>
        </span>

        {/* Navigation Controls */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Autoplay Slideshow */}
          <button
            onClick={() => setIsPlaying(prev => !prev)}
            className="btn-secondary"
            style={{ 
              padding: '8px 14px', 
              borderRadius: '6px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '0.75rem', 
              borderColor: isPlaying ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.08)', 
              color: isPlaying ? 'var(--accent-cyan)' : '#E2E8F0',
              height: '34px'
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'PAUSE AUTO' : 'PLAY DECK'}</span>
          </button>

          <button
            onClick={() => {
              setCurrentSlide(prev => Math.max(0, prev - 1));
              setIsPlaying(false);
            }}
            className="btn-secondary"
            disabled={currentSlide === 0}
            style={{ padding: '8px 12px', borderRadius: '6px', height: '34px' }}
          >
            <ChevronLeft size={18} />
          </button>
          
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {slides.map((_, index) => (
              <span
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setIsPlaying(false);
                }}
                style={{
                  width: index === currentSlide ? '18px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: index === currentSlide ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: index === currentSlide ? '0 0 8px rgba(0, 245, 212, 0.4)' : 'none'
                }}
              />
            ))}
          </div>

          <button
            onClick={() => {
              setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
              setIsPlaying(false);
            }}
            className="btn-secondary"
            disabled={currentSlide === slides.length - 1}
            style={{ padding: '8px 12px', borderRadius: '6px', height: '34px' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
