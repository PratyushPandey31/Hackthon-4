# FloodPulse Mumbai 🛰️🌊
> **Disaster Command Center & Predictive Hydrological Emergency Portal**
> Created by **Pratyush Pandey** representing **Professional Development Avenue, Rotaract Club of TCET** (Thakur College of Engineering and Technology).

[![Live Demo](https://img.shields.io/badge/Vercel-Live_Production_Demo-00D2FF?style=for-the-badge&logo=vercel&logoColor=white)](https://pratyush-two.vercel.app)
[![Vite](https://img.shields.io/badge/Vite-v8.1.3-9D4EDD?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-v19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.7.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

---

## 📸 Command Center Dashboard Showcase

![FloodPulse Mumbai Command Center](screenshot.png)

---

## 1. Executive Summary & Vision

FloodPulse Mumbai is a production-grade, offline-first Disaster Command & Relief Coordination portal specifically engineered to address Mumbai's five critical urban inundation bottlenecks (from high-tide coincidences to railway blockages).

Drawing inspiration from real municipal telemetry cells, it integrates fragmented data silos into a singular glassmorphic web dashboard. The portal operates on two strictly separated clearance levels: **Standard System Analyst** (read-only telemetry overview) and **Administrative Commander** (full simulation parameters, live dispatch control, user directory management, and city-wide crisis level overrides).

---

## 2. Key Operational Pillars

### 🌐 Glassmorphic GIS Submergence Map
* **Zero External Dependencies:** Native SVG rendering representing Mumbai's peninsular municipal wards (expanded to a high-resolution 22-ward dataset matching the mockup canvas). Functions completely offline without loading heavy Google Maps or Mapbox tiles.
* **Blueprint Styling:** Features a tactical vector grid pattern (20px modules), geographical water body labels (Arabian Sea, Thane Creek, Back Bay), overlay street network lines, and a rotating radar sweep overlay.
* **Hardware-Accelerated Glow Filters:** Applies inline SVG Gaussian blur glow layers (`#neonGlow`) around high-risk and selected wards to instantly highlight critical zones without CPU overhead.
* **Translucent Linear Gradients:** Color codes wards dynamically based on calculated risk levels (Mint Green: Safe, Cyan: Alert, Amber: Warning, Neon Red: Critical).

### 🎛️ AI Hydrological Simulator (Admin Exclusive)
* **Live Forecast Sliders:** Allows commanders to tweak precipitation rates (Range: 0-250 mm/hr) and high tide surge tables (Range: 0.0m to 6.5m).
* **Coincidence Risk Model:** Evaluates simulated variables against ward elevation profiles to predict water-logging depths and update status feeds in real-time.
* **Railway Network Interlock:** Automatically triggers delay/suspension warnings for central railway tracks under severe storm coincidences.

### 🧩 Silo Parser & Unstructured NLP Ingest
* **Unstructured Text extraction:** Simulates Natural Language Processing to extract coordinates, victim counts, and priority tags from raw volunteer messages (e.g., WhatsApp groups or text logs).
* **Ingestion Queue:** Admin commanders can verify parsed feeds and click "Merge" to push them into the global SOS dispatch stack.

### ⚓ SOS Coordination Queue & Active Dispatch
* **Compact Feed Rows:** Features clock-based rows with custom inline actions (`[Dispatch]`, `[Details]`) instead of chunky block buttons, matching the exact styling of the mockup.
* **Vessel Routing:** Identifies nearest available NGO response craft, showing loading telemetry states during dispatch.
* **Interactive Feedback:** Triggers micro-animations and screen-wide canvas-confetti celebratory explosions upon successful boat assignments.

### 🔐 Administrative Registry & Profile Controls
* **Separation of Powers:** Standard analysts cannot access user lists, merge queues, or assign boats (buttons are hidden or replaced with passive status labels).
* **Analyst Revocation:** Admins can view all registered system accounts and revoke credentials.
* **Active Protection:** Safety interlocks prevent administrators from revoking their own active sessions.

---

## 3. Technology Stack & Design Systems

* **Core Platform:** React 19 SPA, TypeScript, Vite 8 compilation.
* **Design Philosophy:** Sleek dark-mode aesthetic with translucent glassmorphic components (`backdrop-filter: blur(16px)`), harmonized neon color palettes (HSL variables), and custom CSS grid templates.
* **Optimization Rationale:** Zero heavy framework dependencies (no Tailwind/Bootstrap/Material-UI) resulting in a sub-300kb bundle size. Loads and operates instantly on low-bandwidth disaster cellular connections.

---

## 4. Quick Portal Access

For immediate inspection and judging, the portal provides dual bypass buttons at the login screen:
1. **Quick Login as Admin:** Logs in as `Pratyush Pandey` (`admin@floodpulse.in`) with full commander privileges.
2. **Quick Login as Analyst:** Logs in as `Rohan Sharma` (`analyst@floodpulse.in`) with read-only monitor clearance.

---

## 5. Local Setup & Build Guide

Ensure you have **Node.js (v18+)** installed.

```bash
# Clone the repository
git clone https://github.com/PratyushPandey31/Hackthon-4.git
cd Hackthon-4

# Install dependencies
npm install

# Run dev server
npm run dev

# Compile for production build
npm run build
```

---
*Developed for The Blueprint Ideathon. Submission by Thakur College of Engineering and Technology (TCET).*
