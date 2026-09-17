"use client";

import React, { useState, useEffect } from "react";
import { TopNav } from "../components/TopNav";
import { Sidebar } from "../components/Sidebar";
import { HeroBanner } from "../components/HeroBanner";
import { StatCards } from "../components/StatCards";
import { WorldMapCard } from "../components/WorldMapCard";
import { ThreatAlertsPanel } from "../components/ThreatAlertsPanel";
import { InvestigationsTable } from "../components/InvestigationsTable";
import { TelemetryCharts } from "../components/TelemetryCharts";
import { InvestigationModal } from "../components/InvestigationModal";
import { InvestigationDrawer } from "../components/InvestigationDrawer";
import { FleetMap } from "../components/FleetMap";
import { STAT_METRICS, INVESTIGATIONS, HOTSPOTS } from "../data/mockData";
import {
  MaritimeZone,
  VesselInvestigation,
  Hotspot,
} from "../types/dashboard";
import {
  Radio,
  ShieldAlert,
  AlertTriangle,
  X,
  Bell,
  CheckCircle,
  FileDown,
  Terminal,
  Zap,
  Map as MapIcon,
  Radar,
} from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("tactical-overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedZone, setSelectedZone] = useState<MaritimeZone>("Global Fleet");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVessel, setSelectedVessel] = useState<VesselInvestigation | null>(null);
  const [showNavWarningModal, setShowNavWarningModal] = useState(false);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [warningSent, setWarningSent] = useState(false);
  const [investigationData, setInvestigationData] = useState<VesselInvestigation[]>(INVESTIGATIONS);
  const [activeThreatCount, setActiveThreatCount] = useState(42);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [mapMode, setMapMode] = useState<"tactical" | "mapbox">("mapbox");

  const liveTickerFeeds = [
    "[13:42:04 UTC] SAT-AIS-32 // MT VALOROUS SUN: ORBITAL ROTATION +720°/MIN DETECTED IN KERCH CHOKE POINT",
    "[13:42:09 UTC] ESA SENTINEL-1 SAR PASS // CONFIRMED ZERO SURFACE REFLECTION ON PHANTOM GHOST SHIP (BAB-EL-MANDEB)",
    "[13:42:14 UTC] HAWKEYE 360 RF // BROADBAND GNSS L1/L2 JAMMING BARRAGE DETECTED OVER BALTIC SEA ENTRANCE",
    "[13:42:19 UTC] SPIRE MARITIME LEO // SEA PHANTOM XII POSITION DISPLACEMENT SPEED VIOLATION (>140,000 KM/H)",
    "[13:42:24 UTC] VDES CRYPTO CHALLENGE // PACIFIC TRIDENT GHOST CLONE FAILED ELLIPTIC CURVE SIGNATURE CHECK",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % liveTickerFeeds.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [liveTickerFeeds.length]);

  // If user clicks live-radar tab in sidebar, activate Mapbox GL map
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === "live-radar") {
      setMapMode("mapbox");
      const el = document.getElementById("fleet-map-container");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle vessel selection by MMSI
  const handleSelectVesselByMmsi = (mmsi: string) => {
    const vessel = investigationData.find((v) => v.mmsi === mmsi);
    if (vessel) {
      setSelectedVessel(vessel);
    } else {
      setSelectedVessel(investigationData[0]);
    }
  };

  // Handle hotspot selection from map
  const handleSelectHotspot = (spot: Hotspot) => {
    setSelectedZone(spot.zone);
    const relatedVessel = investigationData.find((v) => v.zone === spot.zone);
    if (relatedVessel) {
      setSelectedVessel(relatedVessel);
    }
  };

  // Update status in local state
  const handleUpdateStatus = (
    id: string,
    newStatus: VesselInvestigation["status"]
  ) => {
    setInvestigationData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedVessel && selectedVessel.id === id) {
      setSelectedVessel({ ...selectedVessel, status: newStatus });
    }
  };

  // Broadcast warning handler
  const handleBroadcastWarning = (e: React.FormEvent) => {
    e.preventDefault();
    setWarningSent(true);
    setTimeout(() => {
      setWarningSent(false);
      setShowNavWarningModal(false);
    }, 2500);
  };

  // Export STIX 2.1 intelligence package
  const handleExportStixDossier = () => {
    const stixPackage = {
      type: "bundle",
      id: `bundle--${Date.now()}`,
      spec_version: "2.1",
      created: new Date().toISOString(),
      generator: "OceanShield AI Maritime Electronic Warfare Platform",
      objects: investigationData.map((inv) => ({
        type: "observed-data",
        id: `observed-data--${inv.id}`,
        first_observed: inv.detectedTime,
        last_observed: new Date().toISOString(),
        number_observed: 1,
        vessel: {
          name: inv.name,
          imo: inv.imo,
          mmsi: inv.mmsi,
          flag: inv.flag,
          anomalyVector: inv.anomaly,
          riskIndex: inv.riskScore,
        },
        deviationMiles: inv.deviationNm,
        confidence: inv.confidenceScore,
        analyst: inv.assignedAnalyst,
      })),
    };

    const blob = new Blob([JSON.stringify(stixPackage, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `OceanShield_Maritime_Threat_Intelligence_STIX2.1_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Simulate new threat ping
  const handleSimulateThreat = () => {
    setActiveThreatCount((c) => c + 1);
    alert("Simulated RF Jamming Anomaly Ping Ingested! Threat counter updated.");
  };

  const dynamicMetrics = STAT_METRICS.map((m) =>
    m.title === "Active Threats"
      ? { ...m, value: `${activeThreatCount}` }
      : m
  );

  return (
    <div className="min-h-screen bg-[#06121E] text-slate-100 flex flex-col font-sans">
      {/* 1. Top Navigation */}
      <TopNav
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        unreadAlertsCount={4}
        onOpenNotifications={() => setShowNotificationsDrawer(!showNotificationsDrawer)}
      />

      {/* Real-time Maritime Telemetry Ticker */}
      <div className="bg-[#03080e] border-b border-cyan-500/20 py-1.5 px-4 sm:px-6 flex items-center justify-between text-[11px] font-mono-telemetry overflow-hidden">
        <div className="flex items-center gap-2 text-cyan-400 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
          <span className="font-bold uppercase tracking-wider text-[10px]">
            SATELLITE DOWNLINK:
          </span>
        </div>

        <div className="truncate mx-4 text-slate-300 transition-all duration-500">
          <span className="text-teal-300 font-bold">{liveTickerFeeds[tickerIndex]}</span>
        </div>

        <button
          onClick={handleSimulateThreat}
          className="shrink-0 flex items-center gap-1 px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 text-[10px] font-bold transition-colors"
          title="Inject test anomaly ping"
        >
          <Zap className="w-3 h-3 text-cyan-400" />
          <span className="hidden sm:inline">SIMULATE ANOMALY</span>
        </button>
      </div>

      {/* Main Body with Sidebar + Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* 4. Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Scrollable Dashboard Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6 max-w-[1780px] mx-auto w-full">
          {/* 2. Hero Banner */}
          <HeroBanner
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            onTriggerAlertModal={() => setShowNavWarningModal(true)}
            onExportReport={handleExportStixDossier}
          />

          {/* 3. Four Statistic Cards */}
          <StatCards
            metrics={dynamicMetrics}
            onCardClick={(title) => {
              if (title === "Active Threats") {
                const el = document.getElementById("threats-panel");
                el?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          />

          {/* Main Tactical Grid: World Map Mode Switcher + Map + Threat Alerts Panel */}
          <div id="fleet-map-container" className="space-y-3">
            {/* View Mode Switcher */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-300 font-mono-telemetry">
                  GLOBAL SURVEILLANCE RADAR ENGINE
                </h2>
              </div>

              {/* Map Switcher Pills */}
              <div className="flex items-center bg-[#0a1a2b] p-1 rounded-xl border border-cyan-500/30 text-[11px] font-mono-telemetry shadow-md">
                <button
                  onClick={() => setMapMode("mapbox")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                    mapMode === "mapbox"
                      ? "bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>MAPBOX GL FLEET MAP</span>
                </button>
                <button
                  onClick={() => setMapMode("tactical")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                    mapMode === "tactical"
                      ? "bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Radar className="w-3.5 h-3.5 text-teal-400" />
                  <span>VECTOR RADAR MAP</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Map Card (8 Columns on XL) */}
              <div className="xl:col-span-8">
                {mapMode === "mapbox" ? (
                  <FleetMap
                    vessels={investigationData}
                    onSelectVessel={(vessel) => setSelectedVessel(vessel)}
                  />
                ) : (
                  <WorldMapCard
                    selectedZone={selectedZone}
                    onSelectZone={setSelectedZone}
                    onSelectHotspot={handleSelectHotspot}
                  />
                )}
              </div>

              {/* 6. Threat Alerts Panel (4 Columns on XL) */}
              <div id="threats-panel" className="xl:col-span-4 h-full">
                <ThreatAlertsPanel
                  selectedZone={selectedZone}
                  onSelectVessel={handleSelectVesselByMmsi}
                />
              </div>
            </div>
          </div>

          {/* 8. Beautiful Charts Placeholders */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-300 font-mono-telemetry">
                  MARITIME CYBERSECURITY ANALYTICS & TELEMETRY
                </h2>
              </div>
              <span className="text-[10px] text-slate-500 font-mono-telemetry">
                STANDARDS: IMO MSC.428(98) // ISO/IEC 27001
              </span>
            </div>
            <TelemetryCharts />
          </section>

          {/* 7. Recent Investigations Table */}
          <section id="investigations-table">
            <InvestigationsTable
              selectedZone={selectedZone}
              searchQuery={searchQuery}
              onSelectVessel={(vessel) => setSelectedVessel(vessel)}
            />
          </section>

          {/* Tactical Platform Footer */}
          <footer className="pt-6 pb-4 border-t border-cyan-500/15 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono-telemetry text-slate-500 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold">OCEANSHIELD AI</span>
              <span>// MARITIME ELECTRONIC WARFARE & ANTI-SPOOFING PLATFORM</span>
            </div>
            <div className="flex items-center gap-4 text-[10px]">
              <span>SYSTEM LATENCY: 18ms</span>
              <span>•</span>
              <span>SATELLITE CONSTEL: 32 ACTIVE</span>
              <span>•</span>
              <span className="text-teal-400">DEFENSE VERIFIED</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Slide-over Investigation Drawer */}
      <InvestigationDrawer
        vessel={selectedVessel}
        isOpen={Boolean(selectedVessel)}
        onClose={() => setSelectedVessel(null)}
        onUpdateStatus={handleUpdateStatus}
        onBroadcastWarning={(vessel) => {
          setSelectedVessel(vessel);
          setShowNavWarningModal(true);
        }}
      />

      {/* Broadcast Navigational Warning Modal */}
      {showNavWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#06121E] border border-rose-500/50 p-6 shadow-[0_0_50px_rgba(244,63,94,0.3)]">
            <div className="flex items-center justify-between pb-3 border-b border-rose-500/30">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
                <h3 className="text-sm font-bold text-white font-mono-telemetry uppercase tracking-wider">
                  BROADCAST EMERGENCY NAVTEX WARNING
                </h3>
              </div>
              <button
                onClick={() => setShowNavWarningModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {warningSent ? (
              <div className="py-8 text-center space-y-3 font-mono-telemetry">
                <div className="flex justify-center">
                  <CheckCircle className="w-12 h-12 text-emerald-400 animate-pulse" />
                </div>
                <h4 className="text-base font-bold text-white">
                  NAVTEX / SAFETYNET WARNING DISPATCHED
                </h4>
                <p className="text-xs text-slate-300">
                  Broadcast transmitted to coastal radio stations covering{" "}
                  <span className="text-cyan-400">{selectedZone}</span>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBroadcastWarning} className="mt-4 space-y-4 font-mono-telemetry text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">
                    TARGET MARITIME REGION:
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={selectedZone}
                    className="w-full h-9 px-3 rounded-lg bg-[#0a1a2b] border border-cyan-500/30 text-cyan-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    THREAT VECTOR CLASSIFICATION:
                  </label>
                  <select className="w-full h-9 px-3 rounded-lg bg-[#0a1a2b] border border-cyan-500/30 text-white">
                    <option>HIGH-RISK GPS POSITION JUMP & TELEPORTATION</option>
                    <option>CIRCULAR DRIFT SPOOFING / ORBITAL PATTERN</option>
                    <option>BROADBAND GNSS BARRAGE JAMMING</option>
                    <option>CLONED IDENTITY & PHANTOM DECOY VESSELS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">
                    TRANSMISSION ADVISORY NOTICE:
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="ALL VESSELS NAVIGATING IN VICINITY ARE STRONGLY ADVISED TO CROSS-VERIFY GPS POSITIONS AGAINST TERRESTRIAL RADAR AND CELESTIAL FIXES. MULTIPLE HIGH-POWER GNSS SPOOFING INCIDENTS CONFIRMED."
                    className="w-full p-2.5 rounded-lg bg-[#0a1a2b] border border-cyan-500/30 text-slate-200 resize-none font-sans text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNavWarningModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                  >
                    TRANSMIT BROADCAST
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Notifications Drawer (Slide-over) */}
      {showNotificationsDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm h-full bg-[#06121E] border-l border-cyan-500/30 p-5 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-300 font-mono-telemetry text-xs font-bold">
                <Bell className="w-4 h-4 text-cyan-400" />
                <span>SYSTEM NOTIFICATION FEED</span>
              </div>
              <button
                onClick={() => setShowNotificationsDrawer(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3 font-mono-telemetry text-xs">
              <div className="p-3 rounded-lg bg-[#0a1a2b] border border-rose-500/30">
                <div className="text-rose-400 font-bold text-[11px]">
                  NEW SPOOF CLUSTER
                </div>
                <p className="text-slate-300 text-[11px] font-sans mt-1">
                  Kerch Strait cluster expanded to 11 vessels exhibiting synchronized 42kt loops.
                </p>
                <span className="text-[10px] text-slate-500">2 min ago</span>
              </div>

              <div className="p-3 rounded-lg bg-[#0a1a2b] border border-amber-500/30">
                <div className="text-amber-300 font-bold text-[11px]">
                  RADAR SAR OVERPASS COMPLETED
                </div>
                <p className="text-slate-300 text-[11px] font-sans mt-1">
                  Sentinel-1 SAR imagery acquired for Bab-el-Mandeb. Zero wake confirmed for Al-Baraka.
                </p>
                <span className="text-[10px] text-slate-500">18 min ago</span>
              </div>

              <div className="p-3 rounded-lg bg-[#0a1a2b] border border-cyan-500/30">
                <div className="text-cyan-300 font-bold text-[11px]">
                  SATELLITE EPHEMERIS SYNC
                </div>
                <p className="text-slate-300 text-[11px] font-sans mt-1">
                  GPS Block III / Galileo E1 constellation almanac refreshed across 32 nodes.
                </p>
                <span className="text-[10px] text-slate-500">45 min ago</span>
              </div>
            </div>

            <button
              onClick={() => setShowNotificationsDrawer(false)}
              className="w-full py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white font-mono-telemetry"
            >
              DISMISS DRAWER
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
