"use client";

import React from "react";
import {
  ShieldAlert,
  Radio,
  SlidersHorizontal,
  Download,
  AlertTriangle,
  Radar,
  Crosshair,
  Sparkles,
  Zap,
  Globe2,
  Lock,
  Layers,
  Activity,
} from "lucide-react";
import { MaritimeZone } from "../types/dashboard";
import { ParticleCanvas } from "./ui/ParticleCanvas";

interface HeroBannerProps {
  selectedZone: MaritimeZone;
  onSelectZone: (zone: MaritimeZone) => void;
  onTriggerAlertModal: () => void;
  onExportReport: () => void;
}

export function HeroBanner({
  selectedZone,
  onSelectZone,
  onTriggerAlertModal,
  onExportReport,
}: HeroBannerProps) {
  const zones: { id: MaritimeZone; label: string; count: number }[] = [
    { id: "Global Fleet", label: "Global Fleet", count: 42 },
    { id: "Strait of Hormuz", label: "Strait of Hormuz", count: 14 },
    { id: "Black Sea & Kerch", label: "Black Sea & Kerch", count: 11 },
    { id: "South China Sea", label: "South China Sea", count: 8 },
    { id: "Bab-el-Mandeb", label: "Bab-el-Mandeb", count: 9 },
    { id: "Baltic Sea", label: "Baltic Sea", count: 5 },
    { id: "Gulf of Guinea", label: "Gulf of Guinea", count: 4 },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 border border-cyan-500/30 bg-gradient-to-br from-[#0c2238]/90 via-[#071728]/95 to-[#040e1a]/95 backdrop-blur-2xl shadow-[0_12px_45px_rgba(0,0,0,0.6),0_0_35px_rgba(6,182,212,0.12)] group">
      {/* 1. Floating Cyber Particles in Background */}
      <ParticleCanvas className="opacity-70" />

      {/* 2. Top Specular Gloss Highlight & Ambient Radial Glows */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />
      <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      {/* Subtle Coordinate Watermark */}
      <div className="absolute top-3 right-4 font-mono-telemetry text-[10px] text-cyan-400/40 select-none hidden md:flex items-center gap-3">
        <span className="flex items-center gap-1">
          <Globe2 className="w-3 h-3 text-cyan-400" />
          SYS_GRID: 26°14&apos;N 56°18&apos;E
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-teal-400" />
          CIPHER: AES-256 GCM
        </span>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-mono-telemetry bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <Radar className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "8s" }} />
              AUTONOMOUS MARITIME RECONNAISSANCE
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono-telemetry bg-teal-500/15 border border-teal-400/30 text-teal-300">
              <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              MULTI-CONSTELLATION GNSS CORRELATION ACTIVE
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono-telemetry bg-slate-800/80 border border-slate-700 text-slate-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              AI BAYESIAN ML ENGINE v4.2
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-mono-telemetry leading-tight">
            AI Maritime GPS/AIS Spoofing{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              Investigation Platform
            </span>
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            Enterprise-grade electronic warfare detection identifying circular drift spoofing,
            GNSS jamming denial, phantom ghost vessels, and dual-MMSI transponder cloning.
            Cross-referenced against multi-spectral synthetic aperture radar (SAR) and spaceborne LEO telemetry.
          </p>

          {/* Telemetry Micro Stats */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-mono-telemetry text-slate-400">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>RF Ingestion: <strong className="text-white">1.4M pkts/min</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>SAR Constellation: <strong className="text-white">32 Satellites</strong></span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>False Alarm Rate: <strong className="text-emerald-400">&lt;0.08%</strong></span>
            </div>
          </div>
        </div>

        {/* Action Buttons with Smooth Hover & Glowing Borders */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <button
            onClick={onTriggerAlertModal}
            className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-mono-telemetry text-xs font-bold shadow-[0_0_25px_rgba(244,63,94,0.4)] border border-rose-400/40 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(244,63,94,0.6)] active:scale-[0.98]"
          >
            <AlertTriangle className="w-4 h-4 text-white animate-bounce" />
            <span>BROADCAST NAV WARNING</span>
          </button>

          <button
            onClick={onExportReport}
            className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl bg-[#0a1a2b]/90 hover:bg-[#11273f] border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white font-mono-telemetry text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>EXPORT STIX 2.1 DOSSIER</span>
          </button>
        </div>
      </div>

      {/* Strategic Corridor Filters */}
      <div className="relative z-10 mt-6 pt-4 border-t border-cyan-500/20">
        <div className="flex items-center gap-2 mb-2.5 text-[11px] font-mono-telemetry text-slate-400">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300">STRATEGIC MARITIME CORRIDOR FILTER:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {zones.map((zone) => {
            const isSelected = selectedZone === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => onSelectZone(zone.id)}
                className={`whitespace-nowrap flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono-telemetry transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-500/30 to-teal-500/20 text-cyan-200 border border-cyan-400/70 shadow-[0_0_18px_rgba(6,182,212,0.35)] font-bold scale-[1.02]"
                    : "bg-slate-900/70 text-slate-400 border border-slate-800 hover:border-cyan-500/40 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <span>{zone.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold transition-colors ${
                    isSelected
                      ? "bg-cyan-400 text-navy-950 font-bold"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {zone.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
