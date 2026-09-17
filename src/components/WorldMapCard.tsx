"use client";

import React, { useState } from "react";
import {
  Layers,
  Crosshair,
  Maximize2,
  RefreshCw,
  Eye,
  Zap,
  Radio,
  Compass,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation,
} from "lucide-react";
import { HOTSPOTS } from "../data/mockData";
import { Hotspot, MaritimeZone } from "../types/dashboard";
import { WORLD_SVG_LAND_PATH } from "../data/worldSvgPaths";

interface WorldMapCardProps {
  selectedZone: MaritimeZone;
  onSelectZone: (zone: MaritimeZone) => void;
  onSelectHotspot: (hotspot: Hotspot) => void;
}

export function WorldMapCard({
  selectedZone,
  onSelectZone,
  onSelectHotspot,
}: WorldMapCardProps) {
  const [activeLayer, setActiveLayer] = useState<"all" | "spoofing" | "jamming" | "ghost">("all");
  const [hoveredHotspot, setHoveredHotspot] = useState<Hotspot | null>(null);
  const [mouseCoord, setMouseCoord] = useState("24°18'22\"N  54°21'08\"E");
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 360 - 180;
    const y = 90 - ((e.clientY - rect.top) / rect.height) * 180;
    const latDir = y >= 0 ? "N" : "S";
    const lngDir = x >= 0 ? "E" : "W";
    setMouseCoord(
      `${Math.abs(y).toFixed(2)}°${latDir}  ${Math.abs(x).toFixed(2)}°${lngDir}`
    );
  };

  // Filter hotspots according to the selected layer
  const filteredHotspots = HOTSPOTS.filter((spot) => {
    if (activeLayer === "all") return true;
    if (activeLayer === "spoofing") {
      return (
        spot.dominantThreat.toLowerCase().includes("drift") ||
        spot.dominantThreat.toLowerCase().includes("circle") ||
        spot.dominantThreat.toLowerCase().includes("gps")
      );
    }
    if (activeLayer === "jamming") {
      return (
        spot.dominantThreat.toLowerCase().includes("jamming") ||
        spot.dominantThreat.toLowerCase().includes("denial")
      );
    }
    if (activeLayer === "ghost") {
      return (
        spot.dominantThreat.toLowerCase().includes("ghost") ||
        spot.dominantThreat.toLowerCase().includes("clone") ||
        spot.dominantThreat.toLowerCase().includes("shutdown")
      );
    }
    return true;
  });

  const zoomIn = () => setZoomLevel((z) => Math.min(z + 0.35, 2.0));
  const zoomOut = () => setZoomLevel((z) => Math.max(z - 0.35, 1.0));
  const resetZoom = () => setZoomLevel(1.0);

  return (
    <div className="glass-panel rounded-xl p-5 relative overflow-hidden transition-all duration-300 border border-cyan-500/25 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-cyan-500/15 gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950/80 border border-cyan-400/40 text-cyan-400">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-200 font-mono-telemetry">
                GLOBAL TACTICAL MARITIME RADAR & AIS SURVEILLANCE
              </h2>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono-telemetry">
              PROJECTION: MERCATOR WGS-84 // RECON RESOLUTION: 1.8NM // SCAN CYCLE: 3.2S
            </p>
          </div>
        </div>

        {/* Layer Filters & Zoom Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Layer Selector */}
          <div className="flex items-center bg-[#06121E]/90 p-1 rounded-lg border border-cyan-500/20 text-[11px] font-mono-telemetry">
            <span className="text-slate-500 px-2 flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyan-400" />
              LAYER:
            </span>
            <button
              onClick={() => setActiveLayer("all")}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeLayer === "all"
                  ? "bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ALL ({HOTSPOTS.length})
            </button>
            <button
              onClick={() => setActiveLayer("spoofing")}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeLayer === "spoofing"
                  ? "bg-rose-500/30 text-rose-200 font-bold border border-rose-400/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              SPOOFING
            </button>
            <button
              onClick={() => setActiveLayer("jamming")}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeLayer === "jamming"
                  ? "bg-amber-500/30 text-amber-200 font-bold border border-amber-400/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              JAMMING
            </button>
            <button
              onClick={() => setActiveLayer("ghost")}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeLayer === "ghost"
                  ? "bg-teal-500/30 text-teal-200 font-bold border border-teal-400/40"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              GHOST AIS
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-[#06121E] rounded-lg border border-slate-800 p-1 text-slate-300">
            <button
              onClick={zoomIn}
              className="p-1 hover:text-cyan-300 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono-telemetry px-1 text-cyan-400">
              {zoomLevel.toFixed(1)}x
            </span>
            <button
              onClick={zoomOut}
              className="p-1 hover:text-cyan-300 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            {zoomLevel > 1 && (
              <button
                onClick={resetZoom}
                className="p-1 hover:text-rose-400 transition-colors border-l border-slate-800 ml-0.5 pl-1"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Map Container with White Background & High Contrast */}
      <div
        onMouseMove={handleMouseMove}
        className="relative w-full h-[380px] sm:h-[460px] lg:h-[500px] mt-4 rounded-xl overflow-hidden bg-white border border-slate-300 group select-none cursor-crosshair shadow-inner"
      >
        {/* Scaled Inner Map Canvas */}
        <div
          className="absolute inset-0 transition-transform duration-500 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Rotating Radar Sweep Line with high contrast */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
            <div className="w-[140%] h-[140%] rounded-full border border-cyan-500/20 relative animate-radar-sweep pointer-events-none">
              <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-cyan-600 shadow-[0_0_8px_#06b6d4] origin-left" />
              <div
                className="absolute top-1/2 left-1/2 w-1/2 h-1/2 origin-top-left pointer-events-none"
                style={{
                  background:
                    "conic-gradient(from 0deg at 0% 0%, rgba(6,182,212,0.12) 0deg, transparent 60deg)",
                }}
              />
            </div>
          </div>

          {/* Global World Vector Map: White Background, White Land, Clearly Visible #0f172a Outline */}
          <svg
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            viewBox="0 0 1000 500"
            preserveAspectRatio="none"
          >
            {/* Meridian and Latitude Grid Lines */}
            <g stroke="rgba(15, 23, 42, 0.12)" strokeWidth="0.8" strokeDasharray="4 6">
              <line x1="0" y1="125" x2="1000" y2="125" />
              <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(15, 23, 42, 0.22)" />
              <line x1="0" y1="375" x2="1000" y2="375" />
              <line x1="200" y1="0" x2="200" y2="500" />
              <line x1="400" y1="0" x2="400" y2="500" />
              <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(15, 23, 42, 0.22)" />
              <line x1="600" y1="0" x2="600" y2="500" />
              <line x1="800" y1="0" x2="800" y2="500" />
            </g>

            {/* Continents: High-resolution Natural Earth 110m Vector Coastlines: White Land (#ffffff), Clearly Visible Dark Slate Outline (#020617) */}
            <path
              d={WORLD_SVG_LAND_PATH}
              fill="#ffffff"
              stroke="#020617"
              strokeWidth="1.8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* High-traffic Maritime Shipping Corridors */}
            <g stroke="#0284c7" strokeWidth="2" strokeDasharray="3 4" fill="none" opacity="0.85">
              <path d="M 240 130 Q 350 100 480 130" />
              <path d="M 470 160 Q 530 180 580 230" />
              <path d="M 580 230 Q 610 240 640 215" />
              <path d="M 640 215 Q 710 260 780 260" />
              <path d="M 830 180 Q 950 160 990 170" />
              <path d="M 10 170 Q 100 160 180 170" />
              <path d="M 480 270 Q 510 390 600 370" />
            </g>

            {/* Moving Commercial Ships Blips along the lanes */}
            <g fill="#22d3ee" opacity="0.85">
              <circle cx="280" cy="122" r="2.5" className="animate-pulse" />
              <circle cx="390" cy="110" r="2" />
              <circle cx="510" cy="180" r="2.5" />
              <circle cx="730" cy="255" r="2.5" className="animate-pulse" />
              <circle cx="860" cy="175" r="2" />
              <circle cx="530" cy="360" r="2.5" />
            </g>
          </svg>

          {/* Hotspots / Tactical Spoofing Clusters */}
          {filteredHotspots.map((spot) => {
            const isSelected = selectedZone === spot.zone;
            const isHovered = hoveredHotspot?.id === spot.id;

            return (
              <div
                key={spot.id}
                onClick={() => {
                  onSelectZone(spot.zone);
                  onSelectHotspot(spot);
                }}
                onMouseEnter={() => setHoveredHotspot(spot)}
                onMouseLeave={() => setHoveredHotspot(null)}
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group/pin"
              >
                {/* Threat Range Glow Circles */}
                <div
                  className={`absolute -inset-4 rounded-full transition-opacity duration-300 pointer-events-none ${
                    spot.criticalCount > 2
                      ? "bg-rose-500/20 border border-rose-500/40 animate-ping-subtle"
                      : "bg-cyan-500/15 border border-cyan-400/30 animate-ping-subtle"
                  }`}
                />

                {/* Pin Center */}
                <div
                  className={`relative flex items-center justify-center w-6 h-6 rounded-full border shadow-lg transition-transform duration-200 group-hover/pin:scale-125 ${
                    isSelected
                      ? "bg-rose-500 border-white text-white shadow-[0_0_20px_#f43f5e] ring-4 ring-rose-500/30"
                      : spot.criticalCount > 2
                      ? "bg-rose-600/90 border-rose-400 text-white shadow-[0_0_15px_#f43f5e]"
                      : "bg-cyan-600/90 border-cyan-300 text-white shadow-[0_0_15px_#06b6d4]"
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </div>

                {/* Pin Label Tag */}
                <div
                  className={`absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-0.5 rounded font-mono-telemetry text-[10px] pointer-events-none transition-all duration-200 ${
                    isSelected || isHovered
                      ? "bg-[#06121E]/95 border border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)] opacity-100 z-30"
                      : "bg-[#0a1a2b]/80 border border-slate-700 text-slate-300 opacity-75 group-hover/pin:opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>{spot.name}</span>
                    <span
                      className={`px-1 rounded text-[9px] ${
                        spot.criticalCount > 2
                          ? "bg-rose-500 text-white"
                          : "bg-cyan-500 text-navy-950 font-bold"
                      }`}
                    >
                      {spot.threatCount}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Hotspot Detailed Floating Tooltip */}
        {hoveredHotspot && (
          <div
            style={{
              left: `${Math.min(Math.max(hoveredHotspot.x, 15), 75)}%`,
              top: `${Math.min(hoveredHotspot.y + 7, 75)}%`,
            }}
            className="absolute z-30 pointer-events-none transform -translate-x-1/2 w-64 p-3 rounded-lg bg-[#06121E]/95 border border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.25)] text-xs font-mono-telemetry backdrop-blur-md transition-all"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1.5 mb-1.5">
              <span className="font-bold text-white text-[11px] uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                {hoveredHotspot.name}
              </span>
              <span className="text-[10px] text-cyan-400 font-bold">
                {hoveredHotspot.trend}
              </span>
            </div>
            <div className="space-y-1 text-[10px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Active Threats:</span>
                <span className="text-white font-bold">{hoveredHotspot.threatCount} Detected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Critical Spoofing:</span>
                <span className="text-rose-400 font-bold">{hoveredHotspot.criticalCount} Confirmed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Threat Signature:</span>
                <span className="text-cyan-300 truncate max-w-[130px]">{hoveredHotspot.dominantThreat}</span>
              </div>
            </div>
            <div className="mt-2 pt-1 border-t border-slate-800 text-[9px] text-slate-500 text-center uppercase tracking-wider">
              Click marker to inspect vessels
            </div>
          </div>
        )}

        {/* Bottom Left: Tactical Map Telemetry Readouts */}
        <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-2 font-mono-telemetry text-[10px]">
          <div className="bg-[#06121E]/90 border border-cyan-500/30 px-2.5 py-1 rounded text-cyan-300 flex items-center gap-1.5 shadow-sm">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>BEACON: ACTIVE</span>
          </div>
          <div className="bg-[#06121E]/90 border border-slate-800 px-2.5 py-1 rounded text-slate-300 hidden sm:block">
            CURSOR: <span className="text-cyan-400">{mouseCoord}</span>
          </div>
          <div className="bg-[#06121E]/90 border border-slate-800 px-2.5 py-1 rounded text-slate-300">
            ACTIVE CORRIDORS: <span className="text-teal-400">{filteredHotspots.length} MONITORED</span>
          </div>
        </div>

        {/* Bottom Right: Legend */}
        <div className="absolute bottom-3 right-3 z-20 bg-[#06121E]/90 border border-cyan-500/25 px-3 py-1.5 rounded-lg text-[10px] font-mono-telemetry flex items-center gap-3 text-slate-300 hidden sm:flex">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping-subtle" />
            <span>Critical Spoofing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>RF Jamming</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-b border-dashed border-cyan-400" />
            <span>Trade Corridor</span>
          </div>
        </div>
      </div>
    </div>
  );
}
