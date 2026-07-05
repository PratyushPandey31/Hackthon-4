import React, { useRef } from 'react';
import { Printer, Award, BookOpen, Layers, CheckCircle2, Shield } from 'lucide-react';

export const ProposalReport: React.FC = () => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', display: 'flex', gap: '24px', minHeight: '620px' }}>
      
      {/* Table of Contents Sidebar */}
      <div style={{ width: '220px', borderRight: '1px solid var(--border-light)', paddingRight: '20px', display: 'flex', flexDirection: 'column', gap: '16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)' }}>
          <BookOpen size={18} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>DOCUMENT INDEX</span>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
          <a href="#abstract" style={{ color: '#E2E8F0', textDecoration: 'none', fontWeight: 500 }}>Abstract & Executive Summary</a>
          <a href="#problem" style={{ color: '#94A3B8', textDecoration: 'none' }}>Problem Statement Details</a>
          <a href="#solution" style={{ color: '#94A3B8', textDecoration: 'none' }}>The FloodPulse Framework</a>
          <a href="#architecture" style={{ color: '#94A3B8', textDecoration: 'none' }}>Technical Architecture</a>
          <a href="#social" style={{ color: '#94A3B8', textDecoration: 'none' }}>Social Impact & Feasibility</a>
          <a href="#sustainability" style={{ color: '#94A3B8', textDecoration: 'none' }}>Sustainability & Scale</a>
        </nav>

        <button onClick={handlePrint} className="btn-secondary" style={{ marginTop: 'auto', fontSize: '0.8rem', padding: '8px 12px' }}>
          <Printer size={14} /> Print / Export PDF
        </button>
      </div>

      {/* Main Document Content */}
      <div ref={reportRef} style={{ flex: 1, overflowY: 'auto', maxHeight: '580px', paddingRight: '12px', textAlign: 'left', lineHeight: '1.7' }} className="report-content">
        
        {/* Document Header */}
        <div style={{ borderBottom: '2px solid var(--accent-cyan)', paddingBottom: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
            <span className="badge badge-info" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <Award size={12} /> Ideathon 2026 Proposal
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>DRAFT ID: FP-MUM-01</span>
          </div>
          
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '12px', color: 'white', letterSpacing: '-0.02em' }}>
            FloodPulse Mumbai: Unifying Fragmented Urban Datasets for Predictive Disaster Dispatch
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '6px' }}>
            Prepared by Team Leader: <strong>Pratyush Pandey</strong> | Professional Development Avenue (TCET)
          </p>
        </div>

        {/* Section: Abstract */}
        <section id="abstract" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} /> Abstract & Executive Summary
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#E2E8F0', marginBottom: '12px' }}>
            Every monsoon season, metropolitan cities like Mumbai undergo severe water-logging that cripples transportation and isolates vulnerable residential pockets. While municipal corporations (BMC), transit operators (Railways), and civil society groups (NGOs) collect massive volumes of telemetry and operational logs, these datasets remain in segregated silos. Consequently, the crisis response is entirely reactive, leading to misallocated assets and delayed relief dispatch.
          </p>
          <p style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>
            <strong>FloodPulse Mumbai</strong> proposes a production-grade emergency command platform that aggregates real-time sensory inputs, simulates hydrological inundation based on tidal models, and ingests raw citizen feedback using Natural Language Processing (NLP). By consolidating data into a single visual dashboard, the platform enables coordinated dispatch of rescue boats and food rations to the most critical, low-elevation sub-wards.
          </p>
        </section>

        {/* Section: Problem Statement */}
        <section id="problem" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} /> Problem Statement Details
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#E2E8F0', marginBottom: '12px' }}>
            The Mumbai monsoon crisis is fundamentally an <em>information coordination problem</em> rather than a resource deficit. The official docket identifies several distinct information blocks:
          </p>
          <ul style={{ fontSize: '0.85rem', color: '#94A3B8', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            <li><strong>Municipal Silos:</strong> BMC registers rainfall intensity and water-logging sensor details on private internal dashboard APIs.</li>
            <li><strong>Transit Silos:</strong> Western, Central, and Harbour railway authorities record track submergence logs manually, causing delays in suspending train services, resulting in passengers stranded on platforms.</li>
            <li><strong>Civil Society Silos:</strong> NGOs possess supply logs and rescue vessels but distribute food packages and boats blindly based on hearsay rather than centralized dispatch statistics.</li>
            <li><strong>Citizen Silos:</strong> Residents in low-lying slum pockets (such as Kurla or Dharavi) post emergency reports in unstructured chat formats (WhatsApp messages, handwritten notes) that fail to reach municipal disaster cells.</li>
          </ul>
        </section>

        {/* Section: The Framework */}
        <section id="solution" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> The FloodPulse Framework
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#E2E8F0', marginBottom: '12px' }}>
            FloodPulse solves these coordination blindspots through three main operational pillars:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>1. Unification API</h4>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Unifies REST API sensory feeds from BMC, XML logs from railways, and JSON inventory ledgers from NGOs into a centralized operational state.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>2. Predictive AI Model</h4>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Processes precipitation rates combined with high-tide calendars and elevation GIS coordinates to calculate localized inundation risk hours before it hits.</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>3. Ingestion Engine</h4>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Utilizes Natural Language Processing (NLP) regex adapters to scan, tag, and locate unstructured text reports, creating dispatchable tickets instantly.</p>
            </div>
          </div>
        </section>

        {/* Section: Technical Architecture */}
        <section id="architecture" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} /> Technical Architecture
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#E2E8F0', marginBottom: '12px' }}>
            The platform is built on an robust, high-performance tech stack engineered for extreme availability and zero-dependency GIS rendering:
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left', marginBottom: '16px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: '8px', fontWeight: 700 }}>Stack Layer</th>
                <th style={{ padding: '8px', fontWeight: 700 }}>Technology Choice</th>
                <th style={{ padding: '8px', fontWeight: 700 }}>Operational Rationale</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '8px', fontWeight: 600 }}>Frontend App</td>
                <td style={{ padding: '8px' }}>React 19 + TypeScript</td>
                <td style={{ padding: '8px' }}>Ensures lightweight, rapid rendering, and strict type safety for critical numeric coordinates.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '8px', fontWeight: 600 }}>Compilation Tool</td>
                <td style={{ padding: '8px' }}>Vite 8</td>
                <td style={{ padding: '8px' }}>Provides near-instant local bundle builds and highly optimized asset delivery.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '8px', fontWeight: 600 }}>GIS Map Layer</td>
                <td style={{ padding: '8px' }}>Vector SVG paths with CSS transitions</td>
                <td style={{ padding: '8px' }}>Offline-first design. Map functions without relying on external tile servers (Google/Mapbox), rendering perfectly on disaster-grade hardware.</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', fontWeight: 600 }}>UI Framework</td>
                <td style={{ padding: '8px' }}>Custom Glassmorphic Vanilla CSS Variables</td>
                <td style={{ padding: '8px' }}>Enables precise micro-interactions, hardware-accelerated animations, and absolute layout responsiveness.</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Section: Social Impact */}
        <section id="social" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={16} /> Social Impact & Feasibility
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#E2E8F0', marginBottom: '12px' }}>
            The deployment of FloodPulse has immediate, high-fidelity social impact in dense urban settlements:
          </p>
          <ul style={{ fontSize: '0.85rem', color: '#94A3B8', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong>Democratization of Relief:</strong> Low-income slum pockets, which are typically underrepresented in official dashboards, get equal weight as citizen text messages are instantly logged on the map based on coordinate names.</li>
            <li><strong>Resource Optimization:</strong> Prevents clustering of rescue teams. NGO boats are automatically routed to vacant critical wards, reducing response times by up to 80%.</li>
            <li><strong>Transit Safety:</strong> Early warning maps sent to railway coordinators prevent train suspension delays, preventing commuters from being stranded overnight.</li>
          </ul>
        </section>

        {/* Section: Sustainability */}
        <section id="sustainability" style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} /> Sustainability & Scale
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#E2E8F0', marginBottom: '12px' }}>
            Because the client application utilizes standard browser features, server hosting overhead is extremely minimal. Scale is achieved by creating modular adapter scripts for different cities:
          </p>
          <p style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>
            In subsequent phases, the system will scale by integrating directly with automated IoT drainage valves, utilizing cell broadcasting APIs for direct ward-level emergency notifications, and applying drone aerial mapping to estimate post-flood structural damages.
          </p>
        </section>

      </div>
    </div>
  );
};
