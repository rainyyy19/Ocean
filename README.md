# OceanShield AI — Maritime Cybersecurity & AIS Spoofing Investigation Platform

![OceanShield AI Banner](https://img.shields.io/badge/Platform-Next.js%2015-06b6d4?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind%20CSS-0284c7?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Mapbox GL](https://img.shields.io/badge/Maps-Mapbox%20GL%20v3-10b981?style=for-the-badge&logo=mapbox&logoColor=white)
![Cybersecurity](https://img.shields.io/badge/Defense-Palantir%20Aesthetic-rose?style=for-the-badge&logo=shield&logoColor=white)

**OceanShield AI** is an enterprise-grade maritime electronic warfare and cybersecurity surveillance dashboard designed to detect, track, and investigate real-time GPS/GNSS spoofing, AIS manipulation, ghost vessels, and maritime choke-point anomalies across global shipping corridors.

---

## Key Features

### 1. Global Surveillance Radar & Fleet Map
- **Dual Engine Architecture**:
  - **Mapbox GL Engine** (`FleetMap.tsx`): High-contrast white ocean and land theme with crisp dark coastline outlines (`#020617`), dynamic ship icon markers with expanding pulse halos, and click-to-inspect popups. Zero-config token bypass with CartoDB Positron base + Natural Earth 110m vector layers.
  - **Vector Tactical Radar** (`WorldMapCard.tsx`): Real-time SVG radar sweep overlaying authentic Natural Earth coastlines with active spoofing hotspot clusters.
- **Corridor Monitoring**: Live tracking across high-risk choke points (Strait of Hormuz, Bab-el-Mandeb, Malacca Strait, South China Sea, and Baltic Sea).

### 2. Slide-Over Investigation Drawer (`InvestigationDrawer.tsx`)
- **Optical/FLIR Surveillance Feed**: HUD simulation with targeting crosshairs, corner brackets, and 4K sensor overlay.
- **Vessel Registry Grid**: Comprehensive specifications including MMSI, IMO, vessel class, coordinates, flag, and assigned analyst.
- **Circular Confidence Gauge**: Animated radial SVG gauge with glowing gradient thresholds (Critical, High, Medium).
- **Forensic Timeline Cards**: Multi-stage incident chronology tracking Kalman filter divergence, Doppler frequency drift, and SAR satellite correlations.
- **AI Neural Forensics Box**: Real-time synthesized threat rationale comparing reported velocity vs true S-band radar SOG.
- **Actions**: Emergency NAVTEX warning broadcast modal and client-side STIX 2.1 JSON dossier export.

### 3. Tactical Defense Operations
- **Real-Time SAT-AIS Ticker**: Live downlink stream with simulated anomaly injection.
- **Interactive Metric Cards**: Total Ships, Active Threats, Fleet Risk Index, and Today's Incidents with micro SVG waveforms.
- **Threat Alerts Stream**: Live anomaly feeds with SAR-verified status, ACK acknowledgments, and priority filters.
- **Forensic Investigations Table**: Searchable, filterable ledger comparing reported vs true radar speeds, trajectory deviations, and risk ratings.
- **Telemetry Charts**: Spoofing vector distribution donut, 24-hour flux timeline, and choke point risk index.

---

## Project Structure

```text
├── components/
│   ├── FleetMap.tsx                # Mapbox GL component export
│   └── InvestigationDrawer.tsx     # Slide-over investigation drawer export
├── src/
│   ├── app/
│   │   ├── globals.css             # Tactical dark navy theme & radar animations
│   │   ├── layout.tsx              # Root HTML & typography layout
│   │   └── page.tsx                # Main operations dashboard coordinator
│   ├── components/
│   │   ├── FleetMap.tsx            # WebGL Mapbox GL maritime map engine
│   │   ├── HeroBanner.tsx          # Threat overview, particle canvas & corridor filter
│   │   ├── InvestigationDrawer.tsx # Slide-over forensic investigation panel
│   │   ├── InvestigationModal.tsx  # Modal dossier with trajectory replay
│   │   ├── InvestigationsTable.tsx # Forensic ledger with speed delta analysis
│   │   ├── Sidebar.tsx             # Collapsible defense navigation sidebar
│   │   ├── StatCards.tsx           # High-impact animated metric cards
│   │   ├── TelemetryCharts.tsx     # Vector distribution, flux timeline & risk index
│   │   ├── ThreatAlertsPanel.tsx   # Live stream of active maritime threats
│   │   ├── TopNav.tsx              # Header with UTC clock, MARSEC level & search
│   │   ├── WorldMapCard.tsx        # Vector radar SVG world map
│   │   └── ui/
│   │       ├── Badge.tsx           # Pulsing tactical status & severity tags
│   │       ├── GlassCard.tsx       # Glassmorphism container with glowing borders
│   │       └── ParticleCanvas.tsx  # HTML5 particle grid background
│   ├── data/
│   │   ├── cargoVessels25.json     # 25 realistic commercial cargo vessels
│   │   ├── mockData.ts             # Investigations, alerts & choke point telemetry
│   │   ├── worldLandGeoJson.ts     # Natural Earth 110m landmass GeoJSON
│   │   └── worldSvgPaths.ts        # High-resolution world coastline SVG paths
│   └── types/
│       └── dashboard.ts            # TypeScript interfaces & domain types
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Glassmorphism + Custom Radar Keyframe Animations
- **Mapping**: [Mapbox GL JS v3](https://docs.mapbox.com/mapbox-gl-js/) & Natural Earth Vector GeoJSON
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme**: Dark Navy (`#06121E`), Neon Cyan (`#00f2fe`), Teal (`#06b6d4`), Ruby (`#f43f5e`)

---

## Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- npm, yarn, or pnpm

### Installation

```bash
# Clone repository
git clone git@github.com:rainyyy19/Ocean.git
cd Ocean

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the platform.

### Production Build

```bash
npm run build
npm run start
```

---

## License
MIT License. Developed for advanced maritime cybersecurity research and anti-spoofing defense operations.
