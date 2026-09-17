"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  ShieldAlert,
  Radio,
  Satellite,
  AlertTriangle,
  Compass,
  Anchor,
  User,
  CheckCircle2,
  FileDown,
  Navigation,
  Crosshair,
  Clock,
  Zap,
  Camera,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Send,
  Download,
  Flame,
  Activity,
} from "lucide-react";
import { VesselInvestigation, ThreatSeverity } from "../types/dashboard";

interface InvestigationDrawerProps {
  vessel: VesselInvestigation | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (id: string, newStatus: VesselInvestigation["status"]) => void;
  onBroadcastWarning?: (vessel: VesselInvestigation) => void;
}

// Circular Animated Confidence Gauge Component
function ConfidenceGauge({
  score,
  severity,
}: {
  score: number;
  severity: ThreatSeverity;
}) {
  const radius = 42;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const colorConfig =
    severity === "CRITICAL"
      ? {
          stroke: "#f43f5e",
          glow: "rgba(244, 63, 94, 0.4)",
          text: "text-rose-400",
          ring: "stroke-rose-500",
        }
      : severity === "HIGH"
      ? {
          stroke: "#f59e0b",
          glow: "rgba(245, 158, 11, 0.4)",
          text: "text-amber-400",
          ring: "stroke-amber-500",
        }
      : {
          stroke: "#06b6d4",
          glow: "rgba(6, 182, 212, 0.4)",
          text: "text-cyan-400",
          ring: "stroke-cyan-500",
        };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <svg className="w-28 h-28 -rotate-90 transform" viewBox="0 0 100 100">
        {/* Background Track */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#091422"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Secondary Track */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="rgba(6, 182, 212, 0.12)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Ring */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={colorConfig.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${colorConfig.glow})`,
          }}
        />
      </svg>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className={`text-xl font-black font-mono-telemetry tracking-tight ${colorConfig.text}`}
        >
          {score.toFixed(1)}%
        </span>
        <span className="text-[9px] font-mono-telemetry uppercase tracking-wider text-slate-400 font-bold">
          AI CONFIDENCE
        </span>
      </div>
    </div>
  );
}

export function InvestigationDrawer({
  vessel,
  isOpen,
  onClose,
  onUpdateStatus,
  onBroadcastWarning,
}: InvestigationDrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "telemetry">("overview");
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!vessel) return null;

  const isCritical = vessel.severity === "CRITICAL";
  const isHigh = vessel.severity === "HIGH";

  // Dynamic timeline events based on vessel details
  const timelineEvents = [
    {
      id: "ev-1",
      time: "T-00m (Current)",
      type: "ANOMALY TRIGGER",
      title: `${vessel.anomaly} Detected`,
      detail: `Reported AIS speed of ${vessel.reportedSpeed} kts contradicts satellite radar return of ${vessel.radarTrueSpeed} kts (Delta: ${Math.abs(
        vessel.reportedSpeed - vessel.radarTrueSpeed
      ).toFixed(1)} kts).`,
      icon: ShieldAlert,
      color: isCritical ? "text-rose-400" : "text-amber-400",
      bg: isCritical ? "bg-rose-950/40 border-rose-500/30" : "bg-amber-950/40 border-amber-500/30",
    },
    {
      id: "ev-2",
      time: "T-14m",
      type: "ORBITAL TELEMETRY",
      title: `SAR Correlation via ${vessel.satelliteSource}`,
      detail: `Synthetic Aperture Radar downlink confirmed vessel physical position at ${vessel.coordinates.display}. Trajectory deviation calculated at ${vessel.deviationNm} NM.`,
      icon: Satellite,
      color: "text-cyan-400",
      bg: "bg-cyan-950/40 border-cyan-500/30",
    },
    {
      id: "ev-3",
      time: "T-32m",
      type: "RF ANALYSIS",
      title: "Kalman Filter Divergence Alert",
      detail:
        "Time-of-Arrival (ToA) Doppler drift exceeds 14.8 Hz. Marine GPS receiver reported invalid pseudo-range clock bias across 8 tracked GNSS channels.",
      icon: Radio,
      color: "text-teal-400",
      bg: "bg-teal-950/40 border-teal-500/30",
    },
    {
      id: "ev-4",
      time: "T-58m",
      type: "DEFENSE AUDIT",
      title: "Automatic STIX 2.1 Threat Package Queued",
      detail: `Assigned to Lead Analyst ${vessel.assignedAnalyst}. Sector command at ${vessel.zone} notified for active maritime intercept verification.`,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-950/40 border-emerald-500/30",
    },
  ];

  // Export JSON dossier
  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(vessel, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `OceanShield_Forensic_${vessel.mmsi}_${Date.now()}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleStatusChange = (newStatus: VesselInvestigation["status"]) => {
    if (onUpdateStatus) {
      onUpdateStatus(vessel.id, newStatus);
      setActionNotice(`Status updated to ${newStatus.toUpperCase()}`);
      setTimeout(() => setActionNotice(null), 2500);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide-over Panel */}
      <aside
        aria-label="Vessel Investigation Drawer"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-xl md:max-w-2xl bg-[#06121E] border-l border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-cyan-500/20 bg-[#040c14]/90 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 truncate">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                isCritical
                  ? "bg-rose-950/80 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                  : isHigh
                  ? "bg-amber-950/80 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  : "bg-cyan-950/80 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
            </div>

            <div className="truncate">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide truncate">
                  {vessel.name}
                </h2>
                <span className="text-sm shrink-0" title={vessel.flag}>
                  {vessel.flagEmoji}
                </span>
                {/* Threat Badge */}
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black font-mono-telemetry uppercase tracking-wider shrink-0 border flex items-center gap-1 ${
                    isCritical
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                      : isHigh
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                  {vessel.severity}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono-telemetry truncate">
                MMSI: {vessel.mmsi} // IMO: {vessel.imo} // ZONE: {vessel.zone}
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-400 transition-all hover:rotate-90 duration-200"
            title="Close Investigation Drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-5 pt-3 border-b border-cyan-500/15 bg-[#050f18] text-xs font-mono-telemetry shrink-0 gap-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2.5 font-bold transition-all relative ${
              activeTab === "overview"
                ? "text-cyan-300 border-b-2 border-cyan-400 shadow-[0_2px_10px_rgba(6,182,212,0.4)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            OVERVIEW & HUD
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`pb-2.5 font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === "timeline"
                ? "text-cyan-300 border-b-2 border-cyan-400 shadow-[0_2px_10px_rgba(6,182,212,0.4)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>TIMELINE CARDS</span>
            <span className="px-1.5 py-0.2 rounded-full bg-cyan-950 text-[10px] text-cyan-300 border border-cyan-500/30">
              {timelineEvents.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("telemetry")}
            className={`pb-2.5 font-bold transition-all relative ${
              activeTab === "telemetry"
                ? "text-cyan-300 border-b-2 border-cyan-400 shadow-[0_2px_10px_rgba(6,182,212,0.4)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            RAW NMEA / RF
          </button>
        </div>

        {/* Status Toast Notice */}
        {actionNotice && (
          <div className="mx-5 mt-3 p-2 rounded-lg bg-cyan-950/90 border border-cyan-400 text-xs font-mono-telemetry text-cyan-200 flex items-center justify-between animate-fadeIn">
            <span>{actionNotice}</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
        )}

        {/* Scrollable Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* 1. Ship Photo Surveillance Feed Placeholder */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-telemetry">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <Camera className="w-3.5 h-3.5" />
                    <span>OPTICAL SATELLITE / FLIR RECONNAISSANCE</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    EO/IR SURVEILLANCE FEED
                  </span>
                </div>

                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-cyan-500/30 bg-gradient-to-b from-[#081726] to-[#02070e] group shadow-inner">
                  {/* Optical Reticle Matrix Grid */}
                  <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

                  {/* Corner Target Brackets */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

                  {/* Center Targeting Reticle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 rounded-full border border-cyan-400/25 flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                      <div className="absolute w-28 h-[1px] bg-cyan-500/25" />
                      <div className="absolute h-28 w-[1px] bg-cyan-500/25" />
                    </div>
                  </div>

                  {/* Live Feed Status Tags */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/75 border border-rose-500/40 text-[9px] font-mono-telemetry font-bold text-rose-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      LIVE EO/IR FEED
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/75 border border-cyan-500/30 text-[9px] font-mono-telemetry text-cyan-300">
                      4K UHD 60FPS
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/75 border border-slate-700 text-[9px] font-mono-telemetry text-slate-400">
                    FOV: 14.2° // ZOOM: 18X
                  </div>

                  {/* Vessel Silhouette Graphic */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg
                      className="w-52 h-28 text-cyan-400/30 transition-transform duration-700 group-hover:scale-105"
                      viewBox="0 0 200 100"
                      fill="currentColor"
                    >
                      {/* Ship Hull Silhouette */}
                      <path
                        d="M 15 65 L 45 80 L 160 80 L 185 65 L 180 55 L 20 55 Z"
                        opacity="0.9"
                      />
                      <rect x="50" y="40" width="12" height="15" opacity="0.9" />
                      <rect x="68" y="32" width="12" height="23" opacity="0.9" />
                      <rect x="86" y="28" width="12" height="27" opacity="0.9" />
                      <rect x="104" y="25" width="12" height="30" opacity="0.9" />
                      <rect x="122" y="32" width="12" height="23" opacity="0.9" />
                      {/* Bridge & Mast */}
                      <path d="M 140 20 L 165 20 L 165 55 L 140 55 Z" opacity="0.95" />
                      <rect x="150" y="10" width="4" height="10" opacity="0.8" />
                      <line
                        x1="145"
                        y1="12"
                        x2="160"
                        y2="12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      {/* Ocean Waterline Wave */}
                      <path
                        d="M 0 82 Q 25 78 50 82 T 100 82 T 150 82 T 200 82"
                        fill="none"
                        stroke="rgba(6,182,212,0.6)"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  {/* Bottom HUD Bar */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono-telemetry text-slate-300 bg-black/75 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-cyan-500/20">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{vessel.name}</span>
                      <span className="text-slate-400">({vessel.type})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-teal-300">
                        LAT: {vessel.coordinates.lat.toFixed(2)}°
                      </span>
                      <span className="text-teal-300">
                        LNG: {vessel.coordinates.lng.toFixed(2)}°
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Top Metric Cards: Circular Confidence Gauge + Threat Details */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Confidence Circular Gauge (5 cols) */}
                <div className="sm:col-span-5 rounded-xl bg-[#0a1a2b]/80 border border-cyan-500/25 p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-md">
                  <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/15">
                    <span className="text-[10px] font-bold text-slate-400 font-mono-telemetry uppercase tracking-wider">
                      ANOMALY CONFIDENCE
                    </span>
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  </div>

                  <ConfidenceGauge
                    score={vessel.confidenceScore}
                    severity={vessel.severity}
                  />

                  <div className="w-full mt-3 pt-2 border-t border-cyan-500/15 flex items-center justify-between text-[10px] font-mono-telemetry text-slate-400">
                    <span>KALMAN FIT: 99.1%</span>
                    <span className="text-teal-300">PASSIVE RF VERIFIED</span>
                  </div>
                </div>

                {/* Threat Classification & Status (7 cols) */}
                <div className="sm:col-span-7 rounded-xl bg-[#0a1a2b]/80 border border-cyan-500/25 p-4 flex flex-col justify-between shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 font-mono-telemetry uppercase tracking-wider">
                      PRIMARY THREAT VECTOR
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/40 text-[10px] font-mono-telemetry font-bold text-rose-300">
                      RISK {vessel.riskScore}/100
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white font-mono-telemetry">
                      {vessel.anomaly}
                    </h3>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                      {vessel.description}
                    </p>
                  </div>

                  {/* Velocity Comparison Delta */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cyan-500/15 text-[11px] font-mono-telemetry">
                    <div className="p-2 rounded bg-[#06121E] border border-cyan-500/20">
                      <span className="text-slate-400 text-[10px] block">
                        REPORTED SPEED:
                      </span>
                      <strong className="text-white text-xs">
                        {vessel.reportedSpeed} knots
                      </strong>
                    </div>
                    <div className="p-2 rounded bg-[#06121E] border border-amber-500/30">
                      <span className="text-amber-400 text-[10px] block font-bold">
                        TRUE RADAR SOG:
                      </span>
                      <strong className="text-amber-300 text-xs">
                        {vessel.radarTrueSpeed} knots
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. AI Summary Box */}
              <div className="rounded-xl border border-cyan-500/40 bg-gradient-to-br from-[#061c30] via-[#091b2c] to-[#05111d] p-4 shadow-[0_0_25px_rgba(6,182,212,0.15)] relative overflow-hidden space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-200 font-mono-telemetry">
                      OCEANSHIELD AI NEURAL FORENSICS
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-[9px] text-cyan-300 font-mono font-bold">
                    MODEL: MARITIME-LLM-V4
                  </span>
                </div>

                <div className="text-xs text-slate-200 leading-relaxed font-sans bg-[#030911]/60 p-3 rounded-lg border border-cyan-500/20">
                  <p>
                    <strong className="text-cyan-300 font-mono">ASSESSMENT: </strong>
                    Telemetry signals from vessel <strong className="text-white">{vessel.name}</strong> (MMSI: {vessel.mmsi}) demonstrate a textbook{" "}
                    <span className="text-amber-300 font-bold">{vessel.anomaly}</span>. Broadcasted NMEA 0183 sentences reveal an unnatural Doppler frequency curve and sudden coordinate delta exceeding physical engine propulsion limits by{" "}
                    <span className="text-rose-400 font-bold">
                      {(
                        Math.abs(vessel.reportedSpeed - vessel.radarTrueSpeed) /
                        (vessel.radarTrueSpeed || 1) *
                        100
                      ).toFixed(0)}
                      %
                    </span>
                    .
                  </p>
                  <p className="mt-2 text-slate-400 text-[11px]">
                    <strong className="text-teal-300 font-mono">RECOMMENDED ACTION: </strong>
                    Broadcast NAVTEX navigational hazard warning to commercial traffic within 25 NM radius and dispatch STIX 2.1 package to regional maritime coast guard command.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (onBroadcastWarning) onBroadcastWarning(vessel);
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>BROADCAST NAVTEX</span>
                  </button>

                  <button
                    onClick={handleExportJson}
                    className="py-2 px-3 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{downloadSuccess ? "DOWNLOADED" : "EXPORT DOSSIER"}</span>
                  </button>
                </div>
              </div>

              {/* 4. Vessel Information Table / Grid */}
              <div className="rounded-xl bg-[#0a1a2b]/80 border border-cyan-500/25 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-cyan-500/15">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono-telemetry flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    <span>VESSEL REGISTRY & RECON SPECIFICATIONS</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono-telemetry">
                    LLOYD&apos;S REGISTER VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px] font-mono-telemetry">
                  <div className="p-2 rounded bg-[#06121E] border border-cyan-500/15">
                    <span className="text-slate-500 text-[10px] block">NAME:</span>
                    <strong className="text-white truncate block">{vessel.name}</strong>
                  </div>
                  <div className="p-2 rounded bg-[#06121E] border border-cyan-500/15">
                    <span className="text-slate-500 text-[10px] block">MMSI:</span>
                    <strong className="text-cyan-300">{vessel.mmsi}</strong>
                  </div>
                  <div className="p-2 rounded bg-[#06121E] border border-cyan-500/15">
                    <span className="text-slate-500 text-[10px] block">IMO:</span>
                    <strong className="text-slate-300">{vessel.imo}</strong>
                  </div>
                  <div className="p-2 rounded bg-[#06121E] border border-cyan-500/15">
                    <span className="text-slate-500 text-[10px] block">FLAG:</span>
                    <span className="text-slate-200">
                      {vessel.flagEmoji} {vessel.flag}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-[#06121E] border border-cyan-500/15">
                    <span className="text-slate-500 text-[10px] block">CLASS:</span>
                    <span className="text-slate-300 truncate block">{vessel.type}</span>
                  </div>
                  <div className="p-2 rounded bg-[#06121E] border border-cyan-500/15">
                    <span className="text-slate-500 text-[10px] block">ZONE:</span>
                    <span className="text-teal-300 truncate block">{vessel.zone}</span>
                  </div>
                  <div className="p-2 rounded bg-[#06121E] border border-cyan-500/15">
                    <span className="text-slate-500 text-[10px] block">POSITION:</span>
                    <span className="text-slate-300 truncate block">{vessel.coordinates.display}</span>
                  </div>
                  <div className="p-2 rounded bg-[#06121E] border border-cyan-500/15">
                    <span className="text-slate-500 text-[10px] block">ORBITAL SOURCE:</span>
                    <span className="text-cyan-300 truncate block">{vessel.satelliteSource}</span>
                  </div>
                  <div className="p-2 rounded bg-[#06121E] border border-cyan-500/15">
                    <span className="text-slate-500 text-[10px] block">ANALYST:</span>
                    <span className="text-slate-300 truncate block">{vessel.assignedAnalyst}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE CARDS */}
          {activeTab === "timeline" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-200 font-mono-telemetry">
                    FORENSIC INCIDENT CHRONOLOGY ({timelineEvents.length} EVENTS)
                  </h3>
                </div>
                <span className="text-[10px] text-slate-500 font-mono-telemetry">
                  UTC TIME SYNC
                </span>
              </div>

              {/* Timeline Sequence Cards */}
              <div className="space-y-3 relative before:absolute before:top-2 before:bottom-2 before:left-4 before:w-[2px] before:bg-cyan-500/20">
                {timelineEvents.map((ev, index) => {
                  const Icon = ev.icon;
                  return (
                    <div
                      key={ev.id}
                      className={`relative pl-9 p-3.5 rounded-xl border transition-all ${ev.bg} hover:border-cyan-400/50`}
                    >
                      {/* Timeline Node Icon */}
                      <div className="absolute left-2.5 top-4 -translate-x-1/2 w-6 h-6 rounded-full bg-[#06121E] border border-cyan-400/60 flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                        <Icon className={`w-3.5 h-3.5 ${ev.color}`} />
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono-telemetry mb-1">
                        <span className="px-2 py-0.5 rounded bg-black/50 border border-slate-700 text-slate-300 font-bold">
                          {ev.time}
                        </span>
                        <span className={`font-bold ${ev.color}`}>{ev.type}</span>
                      </div>

                      <h4 className="text-xs font-bold text-white font-mono-telemetry mt-1">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {ev.detail}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: RAW NMEA / TELEMETRY */}
          {activeTab === "telemetry" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20">
                <span className="text-xs font-bold text-cyan-200 font-mono-telemetry">
                  DECODED AIS / NMEA 0183 SATELLITE PACKETS
                </span>
                <span className="text-[10px] text-emerald-400 font-mono-telemetry">
                  PARSER: ACTIVE
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/80 border border-cyan-500/30 font-mono text-[11px] text-teal-300 space-y-1.5 overflow-x-auto shadow-inner">
                <p className="text-slate-500">// TIME: {new Date().toISOString()} // SAT: {vessel.satelliteSource}</p>
                <p className="text-rose-400">!AIVDM,1,1,,B,15N7v@001?0g5N8M4E=Fq?wt0&lt;00,0*1E</p>
                <p className="text-slate-400">  [DEC]: MMSI: {vessel.mmsi} | SOG: {vessel.reportedSpeed} kt | COG: 142.6°</p>
                <p className="text-amber-400">!AIVDO,1,1,,B,403Ovi1v`0g5&lt;8M4E=Fq?wt00000,0*2A</p>
                <p className="text-slate-400">  [DEC]: S-BAND RADAR OBSERVATION SOG: {vessel.radarTrueSpeed} kt</p>
                <p className="text-cyan-400">$GPGGA,120415.00,{vessel.coordinates.lat},N,{vessel.coordinates.lng},E,1,08,0.9,12.4,M,0.0,M,,*42</p>
                <p className="text-rose-300 font-bold">  [ERR]: CLOCK_BIAS_DELTA = +84.2ns (SPOOF THRESHOLD EXCEEDED)</p>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 border-t border-cyan-500/20 bg-[#040c14] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono-telemetry text-slate-400">
              STATUS:
            </span>
            <button
              onClick={() => handleStatusChange("confirmed_spoof")}
              className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono-telemetry transition-all border ${
                vessel.status === "confirmed_spoof"
                  ? "bg-rose-500/30 text-rose-300 border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                  : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
              }`}
            >
              CONFIRM SPOOF
            </button>
            <button
              onClick={() => handleStatusChange("resolved")}
              className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono-telemetry transition-all border ${
                vessel.status === "resolved"
                  ? "bg-emerald-500/30 text-emerald-300 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                  : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
              }`}
            >
              RESOLVE
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold font-mono-telemetry transition-colors"
          >
            DISMISS
          </button>
        </div>
      </aside>
    </>
  );
}

export default InvestigationDrawer;
