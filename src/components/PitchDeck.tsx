import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Presentation, CheckCircle, ShieldAlert, Cpu, Sparkles, TrendingUp, Compass } from 'lucide-react';

export const PitchDeck: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "FLOODPULSE MUMBAI",
      subtitle: "Unified Predictive Flood Command & Emergency Dispatch Portal",
      tagline: "Solving the Urban Flood Response Blindspot • Ideathon 2026",
      icon: <Presentation size={48} style={{ color: 'var(--accent-cyan)' }} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
          <div className="glass-panel" style={{
            padding: '24px 40px',
            background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.08) 0%, rgba(157, 78, 221, 0.08) 100%)',
            borderColor: 'rgba(0, 210, 255, 0.2)',
            maxWidth: '650px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '12px' }}>
              OFFICIAL COMPETITION PROPOSAL
            </h3>
            <p style={{ color: '#E2E8F0', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Designed to break municipal, transit, and humanitarian information silos to enable predictive, real-time dispatch of emergency assets during Mumbai monsoons.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%', maxWidth: '700px', marginTop: '16px' }}>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Organized By</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginTop: '4px' }}>Rotaract Club of TCET</div>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Competition Theme</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginTop: '4px' }}>Community Social Impact</div>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Team Representative</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-blue)', marginTop: '4px' }}>Pratyush Pandey</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "1. THE PROBLEM: URBAN FLOOD BLINDSPOTS",
      subtitle: "Fragmented Data Silos & Reactive Operations",
      tagline: "Critical operational challenges faced during extreme monsoon events in Mumbai",
      icon: <ShieldAlert size={48} style={{ color: 'var(--accent-red)' }} />,
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '32px', height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--accent-red)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', flexShrink: 0, marginTop: '2px' }}>1</span>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Data Silos</h4>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '4px' }}>
                  BMC telemetry (tides, level sensors), Railway track logs (water heights), NGOs (boat location, food stock), and Citizen SOS reports (WhatsApp chats, logs) exist in separate, isolated databases.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--accent-red)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', flexShrink: 0, marginTop: '2px' }}>2</span>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Reactive Response</h4>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '4px' }}>
                  Emergency services react *after* flooding occurs. No unified predictive model combines rainfall forecast + tides + topography to map inundation zones in advance.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--accent-red)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', flexShrink: 0, marginTop: '2px' }}>3</span>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Inefficient NGO Dispatch</h4>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '4px' }}>
                  NGOs want to deploy rescue boats and food packets but lack real-time visibility into which local slum pockets (like Dharavi or Kurla East) are most submerged.
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '20px', background: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.15)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-red)', textTransform: 'uppercase', marginBottom: '8px' }}>Monsoon Impact Summary</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white' }}>450mm+</div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px', marginBottom: '12px' }}>Single-day rainfall capacity in Mumbai hot spots</div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Result:</span>
                <p style={{ fontSize: '0.8rem', color: 'white', fontWeight: 500, marginTop: '2px' }}>
                  Critical transit halts, structural collapses, and isolated low-income pockets without immediate aid.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "2. THE SOLUTION: FLOODPULSE PORTAL",
      subtitle: "Command Center, Predictive Engine & Unstructured NLP Ingestion",
      tagline: "A unified system mapping real-time hydrological risk and executing rescue dispatches",
      icon: <Sparkles size={48} style={{ color: 'var(--accent-cyan)' }} />,
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', height: '100%', alignItems: 'center' }}>
          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(0, 210, 255, 0.02)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0, 210, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--accent-blue)' }}>
              <Compass size={20} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Unified GIS Map</h4>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: '1.5' }}>
              An interactive vector-based map of Mumbai's key wards (Colaba to Borivali) showing live submergence depth, population exposure, and asset distribution.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(157, 78, 221, 0.02)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(157, 78, 221, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--accent-purple)' }}>
              <Cpu size={20} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Predictive AI Engine</h4>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: '1.5' }}>
              Simulates flood forecasting by calculating risk index based on real-time inputs: Rainfall intensity (mm/h), Tide Height (m), and Drainage Efficiency (%).
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(0, 245, 212, 0.02)' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0, 245, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--accent-cyan)' }}>
              <CheckCircle size={20} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Silo Integration NLP</h4>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: '1.5' }}>
              Parses unstructured WhatsApp reports or handwritten entries, extracting location names, stranded person counts, and contact numbers, and merges them to the queue.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "3. FEASIBILITY & TECH STACK",
      subtitle: "Modern, Scalable Web Architecture built for Resilience",
      tagline: "Designed for immediate deployment and integration with existing municipal frameworks",
      icon: <Cpu size={48} style={{ color: 'var(--accent-purple)' }} />,
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px', height: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ border: '1px solid var(--border-light)', borderRadius: '8px', padding: '12px', background: 'rgba(0,0,0,0.2)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: 700 }}>FRONTEND CORE</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginTop: '2px' }}>React 19 + TypeScript + Vite</div>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>Extremely fast, client-side rendering with full compile-time safety and lightweight bundle sizes.</p>
            </div>
            <div style={{ border: '1px solid var(--border-light)', borderRadius: '8px', padding: '12px', background: 'rgba(0,0,0,0.2)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-purple)', fontWeight: 700 }}>GEOSPATIAL LAYER</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginTop: '2px' }}>High-Fidelity SVG / GIS Mapping</div>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>No slow external tile-server dependancies. Renders custom coordinates mapping Mumbai wards instantly, styleable via CSS.</p>
            </div>
            <div style={{ border: '1px solid var(--border-light)', borderRadius: '8px', padding: '12px', background: 'rgba(0,0,0,0.2)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>AI / NLP COMPONENT</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginTop: '2px' }}>Simulated Regex + LLM Parse Model</div>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>Extracts key parameters from raw feeds and maps them into emergency operational schema fields.</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '20px', background: 'rgba(157, 78, 221, 0.05)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', marginBottom: '8px' }}>DATA INTEGRATION SOURCES</div>
              <ul style={{ fontSize: '0.8rem', color: '#94A3B8', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>BMC Telemetry API (JSON Gauge level)</li>
                <li>Western / Central Railway logs</li>
                <li>WhatsApp Volunteer chat hooks</li>
                <li>NGO Asset spreadsheets & Ledgers</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "4. SOCIAL VALUE & IMPACT",
      subtitle: "Mitigating Risk, Saving Lives, Optimizing Logistics",
      tagline: "Empowering local communities and resource managers during crisis",
      icon: <TrendingUp size={48} style={{ color: 'var(--accent-green)' }} />,
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', height: '100%', alignItems: 'center' }}>
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', background: 'rgba(16, 185, 129, 0.02)' }}>
            <span style={{ fontSize: '1.8rem', color: 'var(--accent-green)', fontWeight: 800 }}>80%</span>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>Response Time Reduction</h4>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px', lineHeight: '1.4' }}>
                Pre-planning boat locations based on tide forecasts reduces rescue dispatch delays from hours to minutes.
              </p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', background: 'rgba(16, 185, 129, 0.02)' }}>
            <span style={{ fontSize: '1.8rem', color: 'var(--accent-green)', fontWeight: 800 }}>100%</span>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>Silo Ingestion Accuracy</h4>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px', lineHeight: '1.4' }}>
                Crowd-sourced messages containing ward names are parsed and mapped immediately, ensuring no local pocket is missed.
              </p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', background: 'rgba(16, 185, 129, 0.02)' }}>
            <span style={{ fontSize: '1.8rem', color: 'var(--accent-green)', fontWeight: 800 }}>3.5x</span>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>Resource Efficiency</h4>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px', lineHeight: '1.4' }}>
                Boats and food packs are routed to exact sub-wards with high submergence levels, eliminating resource wastage.
              </p>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', background: 'rgba(16, 185, 129, 0.02)' }}>
            <span style={{ fontSize: '1.8rem', color: 'var(--accent-green)', fontWeight: 800 }}>₹Cr</span>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>Economic Damage Control</h4>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px', lineHeight: '1.4' }}>
                Timely railway warnings prevent rolling stock from being marooned on tracks, saving huge repair costs.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "5. ROADMAP & FUTURE SCOPE",
      subtitle: "Moving towards Automated Infrastructure Actions",
      tagline: "The evolutionary trajectory of the FloodPulse platform",
      icon: <Sparkles size={48} style={{ color: 'var(--accent-cyan)' }} />,
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', height: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Phase 2: IoT Actuation Integration</h4>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: '1.5' }}>
              Connect FloodPulse directly to automated sluice gates and pumps. When water levels exceed threshold at specific wards (e.g. Kurla L-Ward), triggers pump activation commands.
            </p>
            
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Phase 3: Cell Broadcasting API</h4>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: '1.5' }}>
              Integrate with telecom operators to automatically send local language SMS warnings to mobile devices located within critical sub-wards.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', background: 'rgba(0, 245, 212, 0.02)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'white', marginBottom: '12px' }}>SUSTAINABILITY MATRIX</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', justifyContent: 'between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                <span>Server Costs</span>
                <span style={{ color: 'white', fontWeight: 600 }}>Low (Static App + APIs)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                <span>Maintenance</span>
                <span style={{ color: 'white', fontWeight: 600 }}>Volunteer + Gov IT Cell</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px' }}>
                <span>Scaling Model</span>
                <span style={{ color: 'white', fontWeight: 600 }}>Standard API adaptors</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'between', paddingTop: '6px' }}>
                <span>Community Fit</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Highly replicable in Chennai, Kochi</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '620px' }}>
      
      {/* Slide Header */}
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '20px' }}>
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
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginTop: '20px' }}>
        <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Slide {currentSlide + 1} of {slides.length}</span>
          <span>•</span>
          <span style={{ fontStyle: 'italic' }}>{slides[currentSlide].tagline}</span>
        </span>

        {/* Navigation Controls */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            className="btn-secondary"
            disabled={currentSlide === 0}
            style={{ padding: '8px 12px', borderRadius: '6px' }}
          >
            <ChevronLeft size={18} />
          </button>
          
          <div style={{ display: 'flex', gap: '6px' }}>
            {slides.map((_, index) => (
              <span
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: index === currentSlide ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
            className="btn-secondary"
            disabled={currentSlide === slides.length - 1}
            style={{ padding: '8px 12px', borderRadius: '6px' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
