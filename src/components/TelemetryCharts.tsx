"use client";

import React, { useState } from "react";
import {
  PieChart,
  BarChart3,
  Activity,
  TrendingUp,
  Radio,
  Zap,
  Shield,
  Info,
  Sparkles,
  Layers,
} from "lucide-react";
import {
  ATTACK_VECTORS,
  HOURLY_FLUX,
  REGIONAL_RISK,
} from "../data/mockData";

export function TelemetryCharts() {
  const [activeHoverFlux, setActiveHoverFlux] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Chart 1: Threat Vectors Breakdown (Donut / Progress Matrix) */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 border border-cyan-500/25 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)] group hover:-translate-y-0.5">
        {/* Top Specular Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-cyan-500/15">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
                <PieChart className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-200 font-mono-telemetry">
                SPOOFING ATTACK VECTORS
              </h3>
            </div>
            <span className="text-[10px] text-teal-300 font-mono-telemetry font-bold px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30">
              125 ANOMALIES
            </span>
          </div>

          <p className="text-[11px] text-slate-400 font-mono-telemetry mt-2 mb-4">
            DISTRIBUTION ACROSS DETECTED RF & AIS SIGNATURES
          </p>

          {/* High-tech stylized SVG Donut visual */}
          <div className="relative flex items-center justify-center my-3">
            <svg className="w-44 h-44 -rotate-90 transform drop-shadow-[0_0_15px_rgba(6,182,212,0.25)]" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="38"
                className="stroke-slate-800/80"
                strokeWidth="10"
                fill="none"
              />
              {/* Orbital Drift Spoofing (37%) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#06b6d4"
                strokeWidth="10"
                strokeDasharray="238.7"
                strokeDashoffset="0"
                strokeLinecap="round"
                fill="none"
                style={{ strokeDashoffset: "150.3" }}
              />
              {/* Jamming Denial (26%) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#14b8a6"
                strokeWidth="10"
                strokeDasharray="238.7"
                fill="none"
                style={{ strokeDashoffset: "176.6", strokeDasharray: "62.0 238.7" }}
              />
              {/* Identity Cloned (19%) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#38bdf8"
                strokeWidth="10"
                strokeDasharray="238.7"
                fill="none"
                style={{ strokeDashoffset: "114.6", strokeDasharray: "45.3 238.7" }}
              />
              {/* GPS Teleportation Jump (11%) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#f43f5e"
                strokeWidth="10"
                strokeDasharray="238.7"
                fill="none"
                style={{ strokeDashoffset: "69.3", strokeDasharray: "26.2 238.7" }}
              />
              {/* Phantom Ghost Vessels (7%) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#fb923c"
                strokeWidth="10"
                strokeDasharray="238.7"
                fill="none"
                style={{ strokeDashoffset: "43.1", strokeDasharray: "16.7 238.7" }}
              />
            </svg>

            {/* Center metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white font-mono-telemetry tracking-tight">
                98.4%
              </span>
              <span className="text-[9px] text-cyan-300 font-mono-telemetry uppercase tracking-wider font-bold">
                CONFIDENCE
              </span>
            </div>
          </div>

          {/* Breakdown Vector Bars */}
          <div className="space-y-2.5 mt-4">
            {ATTACK_VECTORS.map((vec) => (
              <div key={vec.name} className="text-[11px] font-mono-telemetry group/row">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-sm"
                      style={{ backgroundColor: vec.color }}
                    />
                    <span className="text-slate-300 group-hover/row:text-white transition-colors">{vec.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{vec.count}</span>
                    <span className="text-slate-500 text-[10px]">({vec.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden p-0.2">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${vec.percentage}%`,
                      backgroundColor: vec.color,
                      boxShadow: `0 0 10px ${vec.color}66`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-cyan-500/10 text-[10px] text-slate-400 font-mono-telemetry flex items-center justify-between">
          <span>CLASSIFICATION ENGINE: v4.2</span>
          <span className="text-cyan-300 font-bold">BAYESIAN ML + RF</span>
        </div>
      </div>

      {/* Chart 2: 24-Hour Threat Frequency & Flux (Area/Bar Timeline) */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 border border-cyan-500/25 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)] group hover:-translate-y-0.5">
        {/* Top Specular Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500/40 to-transparent pointer-events-none" />

        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-cyan-500/15">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-400">
                <Activity className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-200 font-mono-telemetry">
                24H TELEMETRY FLUX & SPOOFING SPIKES
              </h3>
            </div>
            <span className="text-[10px] text-rose-300 font-mono-telemetry font-bold animate-pulse px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30">
              PEAK: 12:00 UTC
            </span>
          </div>

          <p className="text-[11px] text-slate-400 font-mono-telemetry mt-2 mb-4">
            RF JAMMING INTENSITY VS CONFIRMED AIS SPOOFS (HOURLY)
          </p>

          {/* Interactive Responsive SVG Bar & Area Telemetry */}
          <div className="h-52 w-full mt-2 relative">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 360 160"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="fluxThreatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="fluxJammingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Background Grid Lines */}
              <line x1="0" y1="40" x2="360" y2="40" stroke="rgba(6, 182, 212, 0.1)" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="360" y2="80" stroke="rgba(6, 182, 212, 0.1)" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="360" y2="120" stroke="rgba(6, 182, 212, 0.1)" strokeDasharray="3 3" />

              {/* Area filled curve for Jamming */}
              <polygon
                points="
                  0,150
                  0,118 30,113 60,100 90,73 120,52 150,26 180,19 210,28 240,46 270,64 300,88 330,109 360,112
                  360,150
                "
                fill="url(#fluxJammingGrad)"
              />
              <polyline
                points="
                  0,118 30,113 60,100 90,73 120,52 150,26 180,19 210,28 240,46 270,64 300,88 330,109 360,112
                "
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                className="drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
              />

              {/* Area filled curve for Critical Threats */}
              <polygon
                points="
                  0,150
                  0,138 30,136 60,131 90,122 120,115 150,109 180,108 210,111 240,114 270,119 300,126 330,132 360,134
                  360,150
                "
                fill="url(#fluxThreatGrad)"
              />
              <polyline
                points="
                  0,138 30,136 60,131 90,122 120,115 150,109 180,108 210,111 240,114 270,119 300,126 330,132 360,134
                "
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                className="drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]"
              />

              {/* Data points */}
              {HOURLY_FLUX.map((point, index) => {
                const x = (index / (HOURLY_FLUX.length - 1)) * 360;
                const jammingY = 160 - (point.jamming / 100) * 140;
                const threatY = 160 - (point.threats / 50) * 60;
                const isHovered = activeHoverFlux === index;

                return (
                  <g key={point.time} className="cursor-pointer">
                    {/* Vertical hover guide */}
                    {isHovered && (
                      <line
                        x1={x}
                        y1="0"
                        x2={x}
                        y2="150"
                        stroke="#00f2fe"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                    )}
                    <circle
                      cx={x}
                      cy={jammingY}
                      r={isHovered ? 6 : 3}
                      fill="#06b6d4"
                      stroke="#fff"
                      strokeWidth={isHovered ? 2 : 0}
                      className="transition-all"
                    />
                    <circle
                      cx={x}
                      cy={threatY}
                      r={isHovered ? 6 : 3}
                      fill="#f43f5e"
                      stroke="#fff"
                      strokeWidth={isHovered ? 2 : 0}
                      className="transition-all"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover overlay targets */}
            <div className="absolute inset-0 flex justify-between">
              {HOURLY_FLUX.map((point, i) => (
                <div
                  key={point.time}
                  onMouseEnter={() => setActiveHoverFlux(i)}
                  onMouseLeave={() => setActiveHoverFlux(null)}
                  className="flex-1 h-full cursor-pointer"
                />
              ))}
            </div>

            {/* Tooltip on active point */}
            {activeHoverFlux !== null && (
              <div
                style={{
                  left: `${(activeHoverFlux / (HOURLY_FLUX.length - 1)) * 90}%`,
                  top: "10px",
                }}
                className="absolute z-20 pointer-events-none p-2.5 rounded-xl bg-[#06121E]/95 border border-cyan-400 text-[10px] font-mono-telemetry shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-md"
              >
                <div className="font-bold text-white border-b border-cyan-500/30 pb-1 mb-1">
                  {HOURLY_FLUX[activeHoverFlux].time} UTC
                </div>
                <div className="text-cyan-300 font-semibold">
                  Jamming Events: {HOURLY_FLUX[activeHoverFlux].jamming}
                </div>
                <div className="text-rose-400 font-semibold">
                  Spoofed Vessels: {HOURLY_FLUX[activeHoverFlux].threats}
                </div>
              </div>
            )}
          </div>

          {/* Time axis */}
          <div className="flex justify-between text-[10px] text-slate-500 font-mono-telemetry mt-2 pt-2 border-t border-slate-800">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>22:00</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-cyan-500/10 text-[10px] text-slate-400 font-mono-telemetry flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />
              GNSS Jamming
            </span>
            <span className="flex items-center gap-1.5 text-rose-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
              Spoofing Attacks
            </span>
          </div>
          <span className="text-slate-500">1-HR RESOLUTION</span>
        </div>
      </div>

      {/* Chart 3: Regional Choke Point Risk Index */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 border border-cyan-500/25 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)] group hover:-translate-y-0.5">
        {/* Top Specular Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-cyan-500/15">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-200 font-mono-telemetry">
                STRATEGIC CHOKE POINT RISK
              </h3>
            </div>
            <span className="text-[10px] text-amber-300 font-mono-telemetry font-bold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
              6 CORRIDORS
            </span>
          </div>

          <p className="text-[11px] text-slate-400 font-mono-telemetry mt-2 mb-4">
            VULNERABILITY INDEX BY GEOPOLITICAL MARITIME STRAIT
          </p>

          <div className="space-y-3.5 mt-2">
            {REGIONAL_RISK.map((region) => (
              <div key={region.corridor} className="text-[11px] font-mono-telemetry space-y-1 group/bar">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200 font-bold truncate max-w-[160px] group-hover/bar:text-cyan-300 transition-colors">
                      {region.corridor}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold shadow-sm ${
                        region.status === "Critical"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : region.status === "High"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                      }`}
                    >
                      {region.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px]">{region.count} Threats</span>
                    <span className="text-white font-black">{region.riskScore}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-800/90 rounded-full h-2 overflow-hidden border border-slate-700/60 p-0.2">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      region.riskScore >= 85
                        ? "bg-gradient-to-r from-rose-500 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                        : region.riskScore >= 70
                        ? "bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                        : "bg-gradient-to-r from-teal-500 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    }`}
                    style={{ width: `${region.riskScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-cyan-500/10 text-[10px] text-slate-400 font-mono-telemetry flex items-center justify-between">
          <span>SURVEILLANCE ACCURACY: 99.1%</span>
          <span className="text-emerald-400 font-bold">DEFENSE COMPLIANT</span>
        </div>
      </div>
    </div>
  );
}
