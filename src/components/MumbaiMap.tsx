import React, { useState } from 'react';
import { Compass, AlertTriangle, Ship, Info } from 'lucide-react';

interface WardData {
  id: string;
  name: string;
  elevation: number; // in meters
  vulnerability: number; // 0 to 1
  populationDensity: string;
  activeBoats: number;
  svgPath: string;
  centerText: { x: number; y: number };
}

interface MumbaiMapProps {
  rainfall: number; // mm/hr
  tide: number; // meters
  drainage: number; // efficiency %
  onWardSelect: (ward: any) => void;
  selectedWardId: string | null;
}

const WARDS: WardData[] = [
  {
    id: 'borivali',
    name: 'Borivali (R-Central)',
    elevation: 9.0,
    vulnerability: 0.15,
    populationDensity: 'High (26,000/km²)',
    activeBoats: 1,
    svgPath: 'M 100 20 L 220 15 L 230 70 L 110 80 Z',
    centerText: { x: 165, y: 48 }
  },
  {
    id: 'kandivali',
    name: 'Kandivali (R-South)',
    elevation: 7.5,
    vulnerability: 0.25,
    populationDensity: 'Very High (32,000/km²)',
    activeBoats: 2,
    svgPath: 'M 110 80 L 230 70 L 240 140 L 95 130 Z',
    centerText: { x: 165, y: 105 }
  },
  {
    id: 'andheri',
    name: 'Andheri (K-West)',
    elevation: 3.5,
    vulnerability: 0.60,
    populationDensity: 'Extremely High (45,000/km²)',
    activeBoats: 4,
    svgPath: 'M 95 130 L 240 140 L 220 220 L 80 200 Z',
    centerText: { x: 160, y: 175 }
  },
  {
    id: 'kurla',
    name: 'Kurla (L-Ward)',
    elevation: 1.5,
    vulnerability: 0.95,
    populationDensity: 'Extremely High (58,000/km²)',
    activeBoats: 8,
    svgPath: 'M 190 220 L 270 210 L 280 320 L 165 310 Z',
    centerText: { x: 220, y: 265 }
  },
  {
    id: 'bandra',
    name: 'Bandra (H-West)',
    elevation: 5.0,
    vulnerability: 0.35,
    populationDensity: 'High (28,000/km²)',
    activeBoats: 3,
    svgPath: 'M 80 200 L 220 220 L 165 310 L 90 300 Z',
    centerText: { x: 145, y: 255 }
  },
  {
    id: 'dadar',
    name: 'Dadar (G-North)',
    elevation: 4.0,
    vulnerability: 0.50,
    populationDensity: 'High (34,000/km²)',
    activeBoats: 3,
    svgPath: 'M 90 300 L 165 310 L 140 400 L 85 390 Z',
    centerText: { x: 120, y: 350 }
  },
  {
    id: 'colaba',
    name: 'Colaba (A-Ward)',
    elevation: 6.0,
    vulnerability: 0.20,
    populationDensity: 'Moderate (18,000/km²)',
    activeBoats: 1,
    svgPath: 'M 85 390 L 140 400 L 120 480 L 70 510 L 55 450 Z',
    centerText: { x: 95, y: 445 }
  }
];

export const MumbaiMap: React.FC<MumbaiMapProps> = ({
  rainfall,
  tide,
  drainage,
  onWardSelect,
  selectedWardId
}) => {
  const [hoveredWard, setHoveredWard] = useState<WardData | null>(null);

  // Function to calculate live water-logging level based on variables
  const calculateWaterLogging = (ward: WardData) => {
    // High tide + Heavy rain increases flooding
    // Drainage efficiency decreases flooding
    // Higher elevation decreases flooding
    // Vulnerability multiplies the risk
    const rainFactor = (rainfall / 150) * 60; // Up to 60 units
    const tideFactor = ((tide - 1.0) / 5.0) * 35; // Up to 35 units
    const drainageMitigation = (drainage / 100) * 25; // Reduces up to 25 units
    const elevationMitigation = (ward.elevation / 10.0) * 30; // Reduces up to 30 units

    let score = (rainFactor + tideFactor - drainageMitigation - elevationMitigation) * ward.vulnerability;
    score = Math.max(0, Math.min(100, score * 2.5)); // Scale it

    let severity: 'SAFE' | 'ALERT' | 'WARNING' | 'CRITICAL' = 'SAFE';
    let waterLevel = 0; // in feet

    if (score > 75) {
      severity = 'CRITICAL';
      waterLevel = 3.5 + (score - 75) * 0.1;
    } else if (score > 45) {
      severity = 'WARNING';
      waterLevel = 1.5 + (score - 45) * 0.07;
    } else if (score > 20) {
      severity = 'ALERT';
      waterLevel = 0.5 + (score - 20) * 0.04;
    }

    return {
      score: Math.round(score),
      severity,
      waterLevel: parseFloat(waterLevel.toFixed(1))
    };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'var(--accent-red)';
      case 'WARNING': return 'var(--accent-yellow)';
      case 'ALERT': return 'var(--accent-blue)';
      default: return 'var(--accent-green)';
    }
  };



  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass className="logo-rotate" style={{ color: 'var(--accent-cyan)' }} size={20} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Geographical Submergence GIS Map</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }} /> Safe
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)' }} /> Alert
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-yellow)' }} /> Warning
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)' }} /> Critical
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1, minHeight: '480px' }}>
        {/* Interactive Map Visualizer */}
        <div style={{
          position: 'relative',
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Radar Scanner Overlay */}
          <div style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            border: '1px solid rgba(0, 210, 255, 0.05)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}>
            <div className="radar-sweep" style={{
              width: '100%',
              height: '100%',
              background: 'conic-gradient(from 0deg, rgba(0, 210, 255, 0) 0deg, rgba(0, 210, 255, 0.08) 360deg)',
              borderRadius: '50%'
            }} />
          </div>

          <svg width="280" height="520" viewBox="0 0 300 550" style={{ cursor: 'pointer' }}>
            <defs>
              {/* Technical Grid Pattern */}
              <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="0.8" />
              </pattern>
              
              {/* Neon Glow Filter */}
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComponentTransfer in="blur" result="glow">
                  <feFuncA type="linear" slope="1.5"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* SAFE Gradients */}
              <linearGradient id="safeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(16, 185, 129, 0.12)" />
                <stop offset="100%" stopColor="rgba(5, 150, 105, 0.03)" />
              </linearGradient>
              <linearGradient id="safeGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(16, 185, 129, 0.35)" />
                <stop offset="100%" stopColor="rgba(5, 150, 105, 0.1)" />
              </linearGradient>

              {/* ALERT Gradients */}
              <linearGradient id="alertGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(0, 210, 255, 0.15)" />
                <stop offset="100%" stopColor="rgba(0, 100, 250, 0.04)" />
              </linearGradient>
              <linearGradient id="alertGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(0, 210, 255, 0.4)" />
                <stop offset="100%" stopColor="rgba(0, 100, 250, 0.12)" />
              </linearGradient>

              {/* WARNING Gradients */}
              <linearGradient id="warningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(245, 158, 11, 0.18)" />
                <stop offset="100%" stopColor="rgba(217, 119, 6, 0.05)" />
              </linearGradient>
              <linearGradient id="warningGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(245, 158, 11, 0.45)" />
                <stop offset="100%" stopColor="rgba(217, 119, 6, 0.15)" />
              </linearGradient>

              {/* CRITICAL Gradients */}
              <linearGradient id="criticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(239, 68, 68, 0.22)" />
                <stop offset="100%" stopColor="rgba(220, 38, 38, 0.06)" />
              </linearGradient>
              <linearGradient id="criticalGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(239, 68, 68, 0.5)" />
                <stop offset="100%" stopColor="rgba(220, 38, 38, 0.18)" />
              </linearGradient>
            </defs>

            {/* Background Grid */}
            <rect width="300" height="550" fill="url(#mapGrid)" pointerEvents="none" />

            {/* Water body labels for realistic cartography */}
            <text x="25" y="240" fill="rgba(0, 210, 255, 0.12)" fontSize="9" fontWeight="700" letterSpacing="0.15em" transform="rotate(-90 25 240)" pointerEvents="none">ARABIAN SEA</text>
            <text x="275" y="320" fill="rgba(0, 210, 255, 0.12)" fontSize="9" fontWeight="700" letterSpacing="0.15em" transform="rotate(90 275 320)" pointerEvents="none">THANE CREEK</text>
            <text x="45" y="490" fill="rgba(255, 255, 255, 0.08)" fontSize="8" fontWeight="600" letterSpacing="0.05em" pointerEvents="none">BACK BAY</text>
            <text x="180" y="475" fill="rgba(255, 255, 255, 0.08)" fontSize="8" fontWeight="600" letterSpacing="0.05em" pointerEvents="none">HARBOUR BAY</text>

            {/* SVG Wards */}
            {WARDS.map((ward) => {
              const status = calculateWaterLogging(ward);
              const isSelected = selectedWardId === ward.id;
              const isHovered = hoveredWard?.id === ward.id;
              const color = getSeverityColor(status.severity);

              return (
                <g 
                  key={ward.id}
                  onClick={() => onWardSelect(ward)}
                  onMouseEnter={() => setHoveredWard(ward)}
                  onMouseLeave={() => setHoveredWard(null)}
                >
                  <path
                    d={ward.svgPath}
                    fill={`url(#${status.severity.toLowerCase()}Gradient${isHovered || isSelected ? 'Hover' : ''})`}
                    stroke={isSelected ? '#FFFFFF' : isHovered ? 'var(--accent-cyan)' : color}
                    strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '1.5'}
                    filter={isSelected || isHovered ? "url(#neonGlow)" : "none"}
                    style={{
                      transition: 'all 0.2s ease'
                    }}
                  />
                  {/* Glowing Pulse Dot for Active Rescue Boats if Critical */}
                  {status.severity === 'CRITICAL' && (
                    <circle
                      cx={ward.centerText.x - 10}
                      cy={ward.centerText.y - 12}
                      r="4"
                      fill="var(--accent-red)"
                      style={{
                        animation: 'pulse-ring 1.5s cubic-bezier(0.24, 0, 0.38, 1) infinite'
                      }}
                    />
                  )}
                  {/* Ward Label */}
                  <text
                    x={ward.centerText.x}
                    y={ward.centerText.y}
                    fill={isSelected || isHovered ? '#FFFFFF' : '#94A3B8'}
                    fontSize="9.5"
                    fontWeight={isSelected || isHovered ? '700' : '600'}
                    textAnchor="middle"
                    style={{ pointerEvents: 'none', transition: 'all 0.2s' }}
                  >
                    {ward.name.split(' ')[0]}
                  </text>
                  {/* Small Water Level Text under name */}
                  <text
                    x={ward.centerText.x}
                    y={ward.centerText.y + 12}
                    fill={color}
                    fontSize="8.5"
                    fontWeight="600"
                    textAnchor="middle"
                    style={{ pointerEvents: 'none' }}
                  >
                    {status.waterLevel > 0 ? `${status.waterLevel} ft` : 'Dry'}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Sidebar Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
          {(hoveredWard || selectedWardId) ? (
            (() => {
              const currentWard = WARDS.find(w => w.id === selectedWardId) || hoveredWard!;
              const status = calculateWaterLogging(currentWard);
              const color = getSeverityColor(status.severity);

              return (
                <div className="glass-panel" style={{
                  padding: '20px',
                  background: 'rgba(255,255,255,0.01)',
                  borderColor: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <div>
                    <span className="badge badge-info" style={{ marginBottom: '8px' }}>Ward Profile</span>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{currentWard.name}</h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '2px' }}>Elevation (MSL)</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                        {currentWard.elevation} meters
                      </div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '2px' }}>Tidal Vulnerability</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                        {Math.round(currentWard.vulnerability * 100)}%
                      </div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', gridColumn: 'span 2' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '2px' }}>Population Density</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600 }}>{currentWard.populationDensity}</div>
                    </div>
                  </div>

                  <div style={{
                    borderLeft: `4px solid ${color}`,
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '14px',
                    borderRadius: '0 8px 8px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8' }}>Submergence Status:</span>
                      <span className="badge" style={{
                        background: `${color}20`,
                        border: `1px solid ${color}`,
                        color: color
                      }}>
                        {status.severity}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Predicted Water Level:</span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: color }}>
                        {status.waterLevel} feet
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>AI Flood Index Risk:</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, color: color }}>
                        {status.score}/100
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '0.85rem' }}>
                    <Ship size={16} style={{ color: 'var(--accent-blue)' }} />
                    <span><strong>{currentWard.activeBoats}</strong> NGO rescue boats stationed in ward.</span>
                  </div>

                  {status.severity === 'CRITICAL' && (
                    <div className="glass-panel" style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      borderColor: 'rgba(239, 68, 68, 0.2)',
                      padding: '12px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '0.8rem',
                      color: '#F87171'
                    }}>
                      <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Critical Flood Warning:</strong> Low elevation and high runoff risk. Evacuate basement areas and deploy additional rescue boats immediately.</span>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="glass-panel" style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#64748B',
              background: 'rgba(255,255,255,0.01)',
              borderColor: 'rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Info size={32} style={{ color: '#475569' }} />
              <p style={{ fontSize: '0.9rem' }}>
                Select a ward on the map to inspect its real-time hydrological parameters, population exposure, and assets.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
