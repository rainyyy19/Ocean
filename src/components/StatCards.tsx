"use client";

import React, { useState, useEffect } from "react";
import {
  Ship,
  ShieldAlert,
  Gauge,
  AlertOctagon,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
} from "lucide-react";
import { StatMetric } from "../types/dashboard";

interface StatCardsProps {
  metrics: StatMetric[];
  onCardClick?: (title: string) => void;
}

export function StatCards({ metrics, onCardClick }: StatCardsProps) {
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setHasLoaded(true);
  }, []);

  const iconMap = {
    "Total Ships": Ship,
    "Active Threats": ShieldAlert,
    "Fleet Risk": Gauge,
    "Incidents Today": AlertOctagon,
  };

  const sparklinePaths = {
    "Total Ships": "M 0 25 Q 30 15, 60 20 T 120 12 T 180 8 T 240 14",
    "Active Threats": "M 0 28 Q 30 25, 60 18 T 120 22 T 180 8 T 240 4",
    "Fleet Risk": "M 0 15 Q 30 20, 60 12 T 120 16 T 180 10 T 240 6",
    "Incidents Today": "M 0 10 Q 30 18, 60 14 T 120 24 T 180 18 T 240 22",
  };

  const borderStyles = {
    "Total Ships":
      "border-cyan-500/25 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]",
    "Active Threats":
      "border-rose-500/30 hover:border-rose-400/70 hover:shadow-[0_0_30px_rgba(244,63,94,0.25),inset_0_1px_0_rgba(255,255,255,0.12)]",
    "Fleet Risk":
      "border-amber-500/25 hover:border-amber-400/60 hover:shadow-[0_0_30px_rgba(245,158,11,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]",
    "Incidents Today":
      "border-teal-500/25 hover:border-teal-400/60 hover:shadow-[0_0_30px_rgba(20,184,166,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]",
  };

  const iconStyles = {
    "Total Ships":
      "text-cyan-300 bg-cyan-950/70 border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]",
    "Active Threats":
      "text-rose-300 bg-rose-950/70 border-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]",
    "Fleet Risk":
      "text-amber-300 bg-amber-950/70 border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]",
    "Incidents Today":
      "text-teal-300 bg-teal-950/70 border-teal-400/40 shadow-[0_0_15px_rgba(20,184,166,0.25)]",
  };

  const sparklineStroke = {
    "Total Ships": "#06b6d4",
    "Active Threats": "#f43f5e",
    "Fleet Risk": "#f59e0b",
    "Incidents Today": "#14b8a6",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {metrics.map((metric, idx) => {
        const IconComponent =
          iconMap[metric.title as keyof typeof iconMap] || Ship;
        const borderClass =
          borderStyles[metric.title as keyof typeof borderStyles] || "";
        const iconClass =
          iconStyles[metric.title as keyof typeof iconStyles] || "";
        const strokeColor =
          sparklineStroke[metric.title as keyof typeof sparklineStroke] || "#06b6d4";
        const sparkPath =
          sparklinePaths[metric.title as keyof typeof sparklinePaths] || "";

        return (
          <div
            key={metric.title}
            onClick={() => onCardClick && onCardClick(metric.title)}
            className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-gradient-to-b from-[#0b1f35]/85 to-[#06121E]/95 backdrop-blur-xl border transition-all duration-300 cursor-pointer group hover:-translate-y-1 ${borderClass}`}
            style={{
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Top Specular Gloss Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

            {/* Corner Decorative Marks */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400/50" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400/50" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400/50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400/50" />

            {/* Top row: Title and Modern Icon */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono-telemetry flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                {metric.title}
              </span>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110 ${iconClass}`}
              >
                <IconComponent className="h-5 w-5" />
              </div>
            </div>

            {/* Middle row: Large Animated Value and Trend Badge */}
            <div className="flex items-baseline justify-between mb-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono-telemetry tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  {metric.value}
                </span>
              </div>

              <div
                className={`inline-flex items-center gap-1 text-[11px] font-bold font-mono-telemetry px-2.5 py-0.5 rounded-full border shadow-sm transition-all duration-300 ${
                  metric.status === "critical"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                    : metric.status === "warning"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.25)]"
                    : "bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-[0_0_10px_rgba(20,184,166,0.25)]"
                }`}
              >
                {metric.isIncrease ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>{metric.change}</span>
              </div>
            </div>

            {/* Fleet Risk Progress Gauge Bar */}
            {metric.title === "Fleet Risk" && (
              <div className="w-full bg-slate-800/90 rounded-full h-2 mb-3 overflow-hidden border border-slate-700/80 p-0.5">
                <div
                  className="bg-gradient-to-r from-teal-400 via-amber-400 to-rose-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(244,63,94,0.5)]"
                  style={{ width: hasLoaded ? "78.4%" : "0%" }}
                />
              </div>
            )}

            {/* Micro Waveform Sparkline showing live telemetry */}
            <div className="h-6 w-full my-2 overflow-hidden relative opacity-75 group-hover:opacity-100 transition-opacity">
              <svg className="w-full h-full" viewBox="0 0 240 30" preserveAspectRatio="none">
                <path
                  d={sparkPath}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  className={hasLoaded ? "animate-sparkline" : ""}
                />
              </svg>
            </div>

            {/* Bottom row: Breakdown detail and subtitle */}
            <div className="pt-2 border-t border-cyan-500/15 text-[11px] space-y-0.5">
              <p className="text-slate-300 font-mono-telemetry truncate font-medium">
                {metric.detail}
              </p>
              <p className="text-[10px] text-slate-500 font-sans">
                {metric.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
