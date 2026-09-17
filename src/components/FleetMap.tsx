"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Ship,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Layers,
  Key,
  Eye,
  AlertTriangle,
  Radio,
  Crosshair,
  Shield,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { INVESTIGATIONS } from "../data/mockData";
import { VesselInvestigation } from "../types/dashboard";
import { WORLD_LAND_GEOJSON } from "../data/worldLandGeoJson";

interface FleetMapProps {
  vessels?: VesselInvestigation[];
  onSelectVessel?: (vessel: VesselInvestigation) => void;
  mapboxToken?: string;
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

// White Background & White Land with Clearly Visible Dark Outline Style
const createWhiteLandStyle = (): mapboxgl.Style => ({
  version: 8,
  name: "OceanShield White Land High-Contrast",
  sources: {
    "carto-base": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      minzoom: 0,
      maxzoom: 20,
      attribution: "© OpenStreetMap contributors, © CARTO | OceanShield AI",
    },
    "world-land": {
      type: "geojson",
      data: WORLD_LAND_GEOJSON,
    },
    "shipping-corridors": {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          // North Atlantic route
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [-74.0, 40.7],
                [-45.0, 45.0],
                [-10.0, 48.0],
                [0.0, 50.5],
              ],
            },
            properties: { name: "North Atlantic Corridor" },
          },
          // Med to Suez to Hormuz
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [-5.5, 36.0],
                [14.0, 36.5],
                [32.5, 31.2],
                [43.3, 12.5],
                [56.3, 26.2],
              ],
            },
            properties: { name: "Suez - Hormuz Choke Point Corridor" },
          },
          // Hormuz to Malacca to South China Sea
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [56.3, 26.2],
                [75.0, 10.0],
                [95.0, 5.0],
                [103.8, 1.3],
                [114.5, 12.0],
                [121.5, 25.0],
              ],
            },
            properties: { name: "Malacca - South China Sea Corridor" },
          },
          // Baltic Sea Corridor
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [10.0, 57.5],
                [14.8, 55.2],
                [20.0, 56.0],
                [28.0, 60.0],
              ],
            },
            properties: { name: "Baltic Sea Defense Corridor" },
          },
        ],
      },
    },
  },
  layers: [
    // 1. Map background turned to pure white
    {
      id: "map-background-white",
      type: "background",
      paint: {
        "background-color": "#ffffff",
      },
    },
    // 2. High-precision Carto Positron raster base (minzoom 0-20, pure white land/ocean with crisp outlines)
    {
      id: "carto-positron-base",
      type: "raster",
      source: "carto-base",
      minzoom: 0,
      maxzoom: 20,
      paint: {
        "raster-opacity": 1.0,
        "raster-contrast": 0.25,
        "raster-saturation": -0.85,
        "raster-brightness-max": 1.0,
      },
    },
    // 3. Natural Earth 110m vector coastline outlines: BOLD, CRISP, HIGH-CONTRAST (#020617)
    {
      id: "world-land-outline-clearly-visible",
      type: "line",
      source: "world-land",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#020617",
        "line-width": 2.2,
        "line-opacity": 0.95,
      },
    },
    // 4. Strategic shipping corridors
    {
      id: "corridors-glow",
      type: "line",
      source: "shipping-corridors",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#0284c7",
        "line-width": 4,
        "line-opacity": 0.35,
        "line-blur": 2,
      },
    },
    {
      id: "corridors-line",
      type: "line",
      source: "shipping-corridors",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#0284c7",
        "line-width": 2,
        "line-opacity": 0.9,
        "line-dasharray": [3, 2],
      },
    },
  ],
});

export function FleetMap({
  vessels = INVESTIGATIONS,
  onSelectVessel,
  mapboxToken,
  className = "",
  initialCenter = [45, 25],
  initialZoom = 1.8,
}: FleetMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [tokenInput, setTokenInput] = useState(mapboxToken || "");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "CRITICAL" | "SPOOF">("ALL");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [cursorCoords, setCursorCoords] = useState("24°18'N 54°21'E");
  const [tokenApplied, setTokenApplied] = useState(false);

  // Initialize Mapbox GL Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Ensure Mapbox GL does not block or throw when no personal token is provided
    try {
      if ((mapboxgl as any).config) {
        (mapboxgl as any).config.REQUIRE_ACCESS_TOKEN = false;
      }
    } catch {
      // Ignore
    }

    // Check if user provided an official valid personal Mapbox token
    const hasValidCustomToken =
      tokenInput &&
      tokenInput.startsWith("pk.") &&
      tokenInput.length > 40 &&
      !tokenInput.includes("ciy68");

    mapboxgl.accessToken = hasValidCustomToken
      ? tokenInput
      : "pk.eyJ1IjoicGxhY2Vob2xkZXIiLCJhIjoiY204MW9jZ2k1MDAwazJtc2N3Zm95b2l4aSJ9.public_preview_token";

    const mapStyle = hasValidCustomToken
      ? "mapbox://styles/mapbox/light-v11"
      : createWhiteLandStyle();

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: initialCenter,
      zoom: initialZoom,
      projection: { name: "mercator" },
      attributionControl: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      setMapLoaded(true);
      map.resize();
    });

    map.on("error", (e) => {
      console.warn("Mapbox GL event:", e);
    });

    map.on("mousemove", (e) => {
      const lat = e.lngLat.lat;
      const lng = e.lngLat.lng;
      const latDir = lat >= 0 ? "N" : "S";
      const lngDir = lng >= 0 ? "E" : "W";
      setCursorCoords(
        `${Math.abs(lat).toFixed(2)}°${latDir} ${Math.abs(lng).toFixed(2)}°${lngDir}`
      );
    });

    // Multiple resize triggers to ensure canvas is 100% visible immediately
    const resizeTimer1 = setTimeout(() => map.resize(), 100);
    const resizeTimer2 = setTimeout(() => map.resize(), 400);

    // ResizeObserver for dynamic layout shifts
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && mapContainerRef.current) {
      ro = new ResizeObserver(() => {
        map.resize();
      });
      ro.observe(mapContainerRef.current);
    }

    // Cleanup on unmount
    return () => {
      clearTimeout(resizeTimer1);
      clearTimeout(resizeTimer2);
      if (ro) ro.disconnect();
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [tokenInput, tokenApplied]);

  // Render markers when map is loaded or vessels/filter change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Filter vessels
    const filtered = vessels.filter((v) => {
      if (activeFilter === "CRITICAL") return v.severity === "CRITICAL";
      if (activeFilter === "SPOOF")
        return v.status === "confirmed_spoof" || v.status === "investigating";
      return true;
    });

    // Add custom Lucide Ship markers
    filtered.forEach((vessel) => {
      const { lat, lng } = vessel.coordinates;

      const el = document.createElement("div");
      el.className = "fleet-ship-marker group cursor-pointer relative";
      el.setAttribute("data-mmsi", vessel.mmsi);

      const isCritical = vessel.severity === "CRITICAL";
      const isHigh = vessel.severity === "HIGH";

      const haloColor = isCritical
        ? "bg-rose-500/30 border-rose-500/70"
        : isHigh
        ? "bg-amber-500/30 border-amber-500/70"
        : "bg-cyan-500/30 border-cyan-500/70";

      const pinBg = isCritical
        ? "bg-rose-600 border-rose-950 text-white shadow-[0_0_20px_rgba(244,63,94,0.8)] ring-2 ring-rose-300"
        : isHigh
        ? "bg-amber-500 border-amber-950 text-white shadow-[0_0_20px_rgba(245,158,11,0.8)] ring-2 ring-amber-300"
        : "bg-cyan-600 border-cyan-950 text-white shadow-[0_0_20px_rgba(6,182,212,0.8)] ring-2 ring-cyan-300";

      // Lucide Ship SVG inside the marker
      el.innerHTML = `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 select-none">
          <!-- Outer Radar Ripple Animation -->
          <div class="absolute -inset-3.5 rounded-full border-2 animate-ping-subtle ${haloColor}"></div>
          
          <!-- Ship Icon Node -->
          <div class="relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-125 ${pinBg}">
            <svg class="w-4 h-4 transition-transform duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
              <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
              <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/>
              <path d="M12 10v4"/>
              <path d="M12 2v3"/>
            </svg>
          </div>

          <!-- Hover Tag -->
          <div class="absolute left-9 whitespace-nowrap px-2.5 py-1 rounded-lg bg-[#06121E] border border-cyan-400 text-[10px] font-mono font-bold text-cyan-200 shadow-[0_4px_20px_rgba(0,0,0,0.6)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
            ${vessel.name} (${vessel.reportedSpeed} kt)
          </div>
        </div>
      `;

      // Custom Glassmorphic Popup
      const popupHtml = `
        <div class="font-mono text-xs space-y-2 p-1 max-w-xs text-slate-200 select-none">
          <div class="flex items-center justify-between border-b border-cyan-500/30 pb-2">
            <div class="flex items-center gap-1.5 font-bold text-white text-sm">
              <span>${vessel.flagEmoji}</span>
              <span>${vessel.name}</span>
            </div>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-black ${
              isCritical
                ? "bg-rose-500/30 text-rose-300 border border-rose-500/50"
                : "bg-cyan-500/30 text-cyan-300 border border-cyan-500/50"
            }">
              ${vessel.severity}
            </span>
          </div>

          <div class="text-[11px] text-slate-400 space-y-1">
            <div class="flex justify-between">
              <span>MMSI:</span>
              <strong class="text-cyan-300">${vessel.mmsi}</strong>
            </div>
            <div class="flex justify-between">
              <span>Class:</span>
              <span class="text-slate-300">${vessel.type}</span>
            </div>
            <div class="flex justify-between">
              <span>Zone:</span>
              <span class="text-teal-300">${vessel.zone}</span>
            </div>
            <div class="flex justify-between">
              <span>Reported Speed:</span>
              <span class="text-white font-bold">${vessel.reportedSpeed} kts</span>
            </div>
            <div class="flex justify-between">
              <span>True Radar Speed:</span>
              <span class="text-amber-300 font-bold">${vessel.radarTrueSpeed} kts</span>
            </div>
            <div class="flex justify-between">
              <span>Coordinates:</span>
              <span class="text-slate-300 font-mono text-[10px]">${vessel.coordinates.display}</span>
            </div>
            <div class="flex justify-between pt-1 border-t border-slate-800">
              <span class="text-rose-400 font-bold">Anomaly:</span>
              <span class="text-rose-300">${vessel.anomaly}</span>
            </div>
          </div>

          <button
            id="inspect-popup-btn-${vessel.id}"
            class="w-full mt-2.5 py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            <span>INSPECT FORENSIC DOSSIER</span>
          </button>
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
      }).setHTML(popupHtml);

      popup.on("open", () => {
        setTimeout(() => {
          const btn = document.getElementById(`inspect-popup-btn-${vessel.id}`);
          if (btn) {
            btn.onclick = () => {
              if (onSelectVessel) onSelectVessel(vessel);
            };
          }
        }, 50);
      });

      el.addEventListener("click", () => {
        if (onSelectVessel) onSelectVessel(vessel);
      });

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [mapLoaded, vessels, activeFilter, onSelectVessel]);

  // Zoom controls
  const handleZoomIn = () => mapRef.current?.zoomIn({ duration: 300 });
  const handleZoomOut = () => mapRef.current?.zoomOut({ duration: 300 });
  const handleReset = () => {
    mapRef.current?.flyTo({
      center: initialCenter,
      zoom: initialZoom,
      pitch: 0,
      bearing: 0,
      duration: 1200,
    });
  };
  const handleResetBearing = () => {
    mapRef.current?.resetNorthPitch({ duration: 600 });
  };

  const handleApplyToken = () => {
    setTokenApplied(!tokenApplied);
    setShowTokenInput(false);
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden glass-panel border border-cyan-500/30 shadow-[0_12px_45px_rgba(0,0,0,0.6),0_0_30px_rgba(6,182,212,0.15)] flex flex-col ${className}`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-cyan-500/20 bg-[#06121E]/95 backdrop-blur-xl gap-3 z-10">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Ship className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-200 font-mono-telemetry flex items-center gap-1.5">
                MAPBOX GL TACTICAL FLEET RADAR
              </h2>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono-telemetry">
              HIGH-CONTRAST WHITE LAND // CLEAR OUTLINE // {vessels.length} SHIPS TRACKED
            </p>
          </div>
        </div>

        {/* Filter Pills & Key Settings */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#0a1a2b] p-1 rounded-xl border border-cyan-500/25 text-[11px] font-mono-telemetry">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === "ALL"
                  ? "bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ALL ({vessels.length})
            </button>
            <button
              onClick={() => setActiveFilter("CRITICAL")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === "CRITICAL"
                  ? "bg-rose-500/30 text-rose-200 font-bold border border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              CRITICAL THREATS
            </button>
            <button
              onClick={() => setActiveFilter("SPOOF")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeFilter === "SPOOF"
                  ? "bg-amber-500/30 text-amber-200 font-bold border border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              INVESTIGATIONS
            </button>
          </div>

          <button
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="p-1.5 rounded-lg bg-[#0a1a2b] border border-cyan-500/30 text-slate-300 hover:text-cyan-300 hover:border-cyan-400 transition-colors"
            title="Custom Mapbox Token Settings"
          >
            <Key className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Optional Token Settings Drawer */}
      {showTokenInput && (
        <div className="p-3 bg-[#0a1a2b]/95 border-b border-cyan-500/25 flex items-center justify-between gap-3 text-xs font-mono-telemetry z-20">
          <div className="flex-1 flex items-center gap-2">
            <span className="text-slate-400 shrink-0">MAPBOX ACCESS TOKEN:</span>
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Optional: pk.eyJ1... (Leave blank for high-contrast white land engine)"
              className="flex-1 h-7 px-2.5 text-[11px] bg-[#06121E] border border-cyan-500/30 rounded-lg text-cyan-200 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            onClick={handleApplyToken}
            className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] transition-colors"
          >
            APPLY
          </button>
        </div>
      )}

      {/* Main Mapbox GL Canvas Container with White Background & High Contrast */}
      <div
        className="relative w-full bg-white border-y border-slate-300"
        style={{ minHeight: "560px", height: "560px", position: "relative" }}
      >
        <div
          ref={mapContainerRef}
          style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
        />

        {/* Floating Zoom & Camera Controls (Top Right) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-[#06121E]/90 border border-cyan-500/40 p-1.5 rounded-xl backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg hover:bg-cyan-950/80 text-slate-300 hover:text-cyan-300 transition-colors border border-transparent hover:border-cyan-500/40"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg hover:bg-cyan-950/80 text-slate-300 hover:text-cyan-300 transition-colors border border-transparent hover:border-cyan-500/40"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-[1px] bg-slate-800 my-0.5" />
          <button
            onClick={handleReset}
            className="p-2 rounded-lg hover:bg-cyan-950/80 text-slate-300 hover:text-teal-300 transition-colors border border-transparent hover:border-teal-500/40"
            title="Reset World View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetBearing}
            className="p-2 rounded-lg hover:bg-cyan-950/80 text-slate-300 hover:text-cyan-300 transition-colors border border-transparent hover:border-cyan-500/40"
            title="Reset North Bearing"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Left Status & Cursor Readout */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2 font-mono-telemetry text-[10px] pointer-events-none">
          <div className="bg-[#06121E]/95 border border-cyan-500/40 px-3 py-1.5 rounded-lg text-cyan-300 flex items-center gap-2 shadow-lg backdrop-blur-md pointer-events-auto">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>MAPBOX GL: WHITE LAND ENGINE</span>
          </div>
          <div className="bg-[#06121E]/95 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-200 backdrop-blur-md hidden sm:block pointer-events-auto shadow-md">
            CURSOR: <span className="text-cyan-400 font-bold">{cursorCoords}</span>
          </div>
        </div>

        {/* Bottom Right Legend */}
        <div className="absolute bottom-4 right-4 z-20 bg-[#06121E]/95 border border-cyan-500/35 px-3.5 py-1.5 rounded-xl text-[10px] font-mono-telemetry flex items-center gap-3 text-slate-200 hidden sm:flex backdrop-blur-md shadow-lg pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
            <span>Critical Spoofing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            <span>Investigation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
            <span>Nominal Vessel</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FleetMap;
