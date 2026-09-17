"use client";

import React, { useState, useEffect } from "react";
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
  Maximize2,
  Clock,
  Zap,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { VesselInvestigation } from "../types/dashboard";
import { StatusBadge, SeverityBadge } from "./ui/Badge";

interface InvestigationModalProps {
  vessel: VesselInvestigation | null;
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: VesselInvestigation["status"]) => void;
}

export function InvestigationModal({
  vessel,
  onClose,
  onUpdateStatus,
}: InvestigationModalProps) {
  const [activeTab, setActiveTab] = useState<"forensics" | "rf-telemetry" | "mitigation">("forensics");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [replayStep, setReplayStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Animated replay trajectory steps
  const replayPositions = [
    { x: 120, y: 80, time: "T+00s", speed: "42.4 kt" },
    { x: 170, y: 35, time: "T+30s", speed: "43.1 kt" },
    { x: 235, y: 55, time: "T+60s", speed: "41.8 kt" },
    { x: 250, y: 110, time: "T+90s", speed: "42.7 kt" },
    { x: 180, y: 140, time: "T+120s", speed: "42.0 kt" },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setReplayStep((prev) => (prev + 1) % replayPositions.length);
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, replayPositions.length]);

  if (!vessel) return null;

  const handleAction = (msg: string, status?: VesselInvestigation["status"]) => {
    if (status) onUpdateStatus(vessel.id, status);
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const downloadDossier = () => {
    const data = {
      investigationId: vessel.id,
      exportTimestampUtc: new Date().toISOString(),
      classification: "DEFENSE RESTRICTED // MARITIME CYBER TASKFORCE",
      vessel: {
        name: vessel.name,
        flag: vessel.flag,
        imo: vessel.imo,
        mmsi: vessel.mmsi,
        type: vessel.type,
        zone: vessel.zone,
        lastReportedCoordinates: vessel.coordinates.display,
      },
      forensics: {
        anomalyType: vessel.anomaly,
        severityLevel: vessel.severity,
        riskScore: vessel.riskScore,
        deviationNauticalMiles: vessel.deviationNm,
        reportedAisSpeedKnots: vessel.reportedSpeed,
        radarDopplerTrueSpeedKnots: vessel.radarTrueSpeed,
        correlationConfidencePct: vessel.confidenceScore,
        spaceborneSatelliteSource: vessel.satelliteSource,
      },
      investigatingOfficer: vessel.assignedAnalyst,
      operationalAssessment: vessel.description,
      telemetryLog: [
        "!AIVDM,1,1,,B,15N7v@001?0l8D`N6a?d0?wp0000,0*1C",
        "!AIVDM,1,1,,A,15N93p0P00rF0w8N6d4<0?v0000,0*39",
        "!AIVDM,1,1,,B,402=w21ui@<P,0*21",
      ],
      complianceFrameworks: ["IMO MSC.428(98)", "SOLAS V/19", "ISO/IEC 27001", "STIX 2.1"],
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `OceanShield_${vessel.name.replace(/\s+/g, "_")}_${vessel.mmsi}_Dossier.json`;
    a.click();
    URL.revokeObjectURL(url);
    handleAction("Intelligence dossier file successfully downloaded.");
  };

  const currentReplay = replayPositions[replayStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#06121E] border border-cyan-400/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden my-auto">
        {/* Top Decorative Cyber Line */}
        <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-cyan-400 to-teal-400" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-cyan-500/20 bg-[#0a1a2b]/90">
          <div className="flex items-center space-x-3">
            <span className="text-2xl" title={vessel.flag}>
              {vessel.flagEmoji}
            </span>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-white font-mono-telemetry tracking-wide">
                  {vessel.name}
                </h2>
                <SeverityBadge severity={vessel.severity} />
                <StatusBadge status={vessel.status} />
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono-telemetry mt-0.5">
                <span>{vessel.type}</span>
                <span>•</span>
                <span>{vessel.imo}</span>
                <span>•</span>
                <span>MMSI: {vessel.mmsi}</span>
                <span>•</span>
                <span className="text-cyan-400 font-bold">{vessel.zone}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification Toast if Action Executed */}
        {actionSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-emerald-950/90 border border-emerald-400/50 text-emerald-300 text-xs font-mono-telemetry flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Modal Tab Navigation */}
        <div className="flex items-center px-6 pt-4 border-b border-slate-800 gap-4 text-xs font-mono-telemetry">
          <button
            onClick={() => setActiveTab("forensics")}
            className={`pb-3 font-bold transition-all relative ${
              activeTab === "forensics"
                ? "text-cyan-300 border-b-2 border-cyan-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            ANOMALY FORENSICS & RECON
          </button>
          <button
            onClick={() => setActiveTab("rf-telemetry")}
            className={`pb-3 font-bold transition-all relative ${
              activeTab === "rf-telemetry"
                ? "text-cyan-300 border-b-2 border-cyan-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            RF CARRIER & SATELLITE TELEMETRY
          </button>
          <button
            onClick={() => setActiveTab("mitigation")}
            className={`pb-3 font-bold transition-all relative ${
              activeTab === "mitigation"
                ? "text-cyan-300 border-b-2 border-cyan-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            TACTICAL COUNTERMEASURES
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {activeTab === "forensics" && (
            <div className="space-y-5">
              {/* Forensics Overview Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-[#0a1a2b]/80 border border-cyan-500/20 font-mono-telemetry text-xs">
                  <div className="text-slate-400 text-[10px] uppercase">
                    Calculated Deviation
                  </div>
                  <div className="text-xl font-extrabold text-rose-400 mt-1">
                    {vessel.deviationNm} nm
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Spatial discrepancy vs SAR
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0a1a2b]/80 border border-cyan-500/20 font-mono-telemetry text-xs">
                  <div className="text-slate-400 text-[10px] uppercase">
                    Reported AIS Speed
                  </div>
                  <div className="text-xl font-extrabold text-cyan-300 mt-1">
                    {vessel.reportedSpeed} kts
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Broadcasted via NMEA AIS
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0a1a2b]/80 border border-cyan-500/20 font-mono-telemetry text-xs">
                  <div className="text-slate-400 text-[10px] uppercase">
                    True Radar Doppler
                  </div>
                  <div className="text-xl font-extrabold text-amber-300 mt-1">
                    {vessel.radarTrueSpeed} kts
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Observed by spaceborne radar
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0a1a2b]/80 border border-cyan-500/20 font-mono-telemetry text-xs">
                  <div className="text-slate-400 text-[10px] uppercase">
                    Confidence Metric
                  </div>
                  <div className="text-xl font-extrabold text-teal-300 mt-1">
                    {vessel.confidenceScore}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Multi-source correlation
                  </div>
                </div>
              </div>

              {/* Spoofing Trajectory Forensics Diagram with Animated Replay Controls */}
              <div className="rounded-xl bg-[#030910] p-4 border border-cyan-500/25 relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between mb-3 text-xs font-mono-telemetry gap-2">
                  <span className="text-cyan-300 font-bold flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-cyan-400" />
                    AIS TRACK VS GROUND TRUTH OBSERVATION
                  </span>

                  {/* Replay Controls */}
                  <div className="flex items-center gap-2 bg-[#0a1a2b] px-2 py-1 rounded-lg border border-cyan-500/30">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-white font-bold"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3 h-3 text-amber-400" />
                          <span>PAUSE</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 text-emerald-400" />
                          <span>PLAY REPLAY</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsPlaying(false);
                        setReplayStep(0);
                      }}
                      className="text-slate-400 hover:text-white"
                      title="Reset Track"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] text-cyan-400 font-bold border-l border-slate-700 pl-1.5">
                      {currentReplay.time}
                    </span>
                  </div>
                </div>

                <div className="h-52 w-full relative flex items-center justify-center border border-slate-800 rounded-lg bg-navy-950/60">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 cyber-overlay opacity-40 pointer-events-none" />

                  {/* Synthetic Trajectory Curve */}
                  <svg className="w-full h-full" viewBox="0 0 400 160">
                    {/* Simulated True Course (Dotted Teal) */}
                    <path
                      d="M 50 80 L 150 80 L 250 82 L 350 80"
                      fill="none"
                      stroke="#14b8a6"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                    />
                    <text x="50" y="70" fill="#14b8a6" fontSize="9" fontFamily="monospace">
                      TRUE RADAR TRACK (0.1 - 4.2 kts)
                    </text>

                    {/* True vessel stationary icon */}
                    <circle cx="200" cy="80" r="5" fill="#14b8a6" />
                    <text x="210" y="83" fill="#14b8a6" fontSize="8" fontFamily="monospace">
                      ACTUAL VESSEL POSITION
                    </text>

                    {/* Spoofed Trajectory (Circular Loop Pattern) */}
                    <path
                      d="M 120 80 C 120 30, 200 20, 240 50 C 280 80, 260 140, 200 140 C 140 140, 120 110, 120 80"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2"
                    />

                    {/* Dynamic Animated Ghost Point */}
                    <circle
                      cx={currentReplay.x}
                      cy={currentReplay.y}
                      r="6"
                      fill="#f43f5e"
                      className="animate-ping"
                    />
                    <circle
                      cx={currentReplay.x}
                      cy={currentReplay.y}
                      r="4"
                      fill="#ffffff"
                    />
                    <text
                      x={currentReplay.x + 8}
                      y={currentReplay.y + 4}
                      fill="#f43f5e"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      AIS GHOST POS ({currentReplay.speed})
                    </text>
                  </svg>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] font-mono-telemetry text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-teal-300">
                      <span className="w-3 h-0.5 border-b-2 border-dashed border-teal-400" />
                      Physical Satellite Ground Truth
                    </span>
                    <span className="flex items-center gap-1 text-rose-300">
                      <span className="w-3 h-0.5 bg-rose-500" />
                      Transmitted False GPS Loop
                    </span>
                  </div>
                  <span className="text-slate-500">
                    OFFSET: {vessel.coordinates.display}
                  </span>
                </div>
              </div>

              {/* Analyst Briefing */}
              <div className="p-4 rounded-xl bg-[#0a1a2b]/90 border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-telemetry">
                  <span className="text-slate-400 uppercase font-bold">
                    Analyst Assessment Note
                  </span>
                  <span className="text-cyan-300">
                    Lead: {vessel.assignedAnalyst}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {vessel.description}
                </p>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono-telemetry flex items-center justify-between">
                  <span>SATELLITE RECON FEED: {vessel.satelliteSource}</span>
                  <span>INITIAL DETECTION: {vessel.detectedTime}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "rf-telemetry" && (
            <div className="space-y-4 font-mono-telemetry text-xs">
              <div className="p-4 rounded-xl bg-[#0a1a2b]/80 border border-cyan-500/20 space-y-3">
                <h4 className="text-cyan-300 font-bold uppercase text-[11px] flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  RAW NMEA 0183 / AIVDM PACKET TELEMETRY DUMP
                </h4>
                <div className="p-3 rounded-lg bg-black/60 border border-slate-800 text-cyan-400 font-mono text-[10px] overflow-x-auto space-y-1">
                  <div>!AIVDM,1,1,,B,15N7v@001?0l8D`N6a?d0?wp0000,0*1C</div>
                  <div>!AIVDM,1,1,,A,15N93p0P00rF0w8N6d4&lt;0?v0000,0*39</div>
                  <div className="text-rose-400">
                    &gt;&gt; [ALERT] SOG DISCONTINUITY DETECTED: VALUE=42.4 KT / ACCEL=8.4 G (PHYSICS VIOLATION)
                  </div>
                  <div className="text-amber-300">
                    &gt;&gt; [WARN] ROT (RATE OF TURN) = +720 DEG/MIN // ORBITAL DRIFT CONFIRMED
                  </div>
                  <div>!AIVDM,1,1,,B,402=w21ui@&lt;P,0*21</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0a1a2b]/80 border border-slate-800 space-y-2">
                  <span className="text-slate-400 uppercase text-[10px]">
                    GNSS Carrier-to-Noise (C/N0)
                  </span>
                  <div className="text-lg font-bold text-white">
                    22.4 dB-Hz (Degraded)
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans">
                    GPS L1 C/A nominal baseline: 42.0 dB-Hz. Indicates high-intensity terrestrial RF emitter.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0a1a2b]/80 border border-slate-800 space-y-2">
                  <span className="text-slate-400 uppercase text-[10px]">
                    Clock Bias Drift Rate
                  </span>
                  <div className="text-lg font-bold text-rose-400">
                    +1.84 ms / s
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans">
                    Synthesizer timestamp drift characteristic of software-defined radio (SDR) transmission replay.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "mitigation" && (
            <div className="space-y-4 font-mono-telemetry text-xs">
              <p className="text-slate-300 font-sans text-xs">
                Select authorized operational countermeasure protocol for vessel{" "}
                <span className="text-white font-bold">{vessel.name}</span> in accordance with IMO FAL and SOLAS cybersecurity recommendations:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() =>
                    handleAction(
                      "NAVTEX emergency navigational warning broadcasted to maritime corridor.",
                      "investigating"
                    )
                  }
                  className="p-4 rounded-xl bg-[#0a1a2b] hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cyan-300 font-bold group-hover:text-cyan-200">
                      BROADCAST NAVTEX WARNING
                    </span>
                    <Radio className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Emit urgent automated navigational safety broadcast alerting regional shipping to GPS inaccuracies.
                  </p>
                </button>

                <button
                  onClick={() =>
                    handleAction(
                      "Target confirmed as hostile spoof. Interpol Maritime Dossier generated.",
                      "confirmed_spoof"
                    )
                  }
                  className="p-4 rounded-xl bg-[#1a0e14] hover:bg-[#25121b] border border-rose-500/40 hover:border-rose-400 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-rose-300 font-bold group-hover:text-rose-200">
                      CONFIRM HOSTILE SPOOF
                    </span>
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Escalate to State Port Control and flag MMSI in global blacklist for mandatory physical boarding.
                  </p>
                </button>

                <button
                  onClick={() =>
                    handleAction(
                      "Cryptographic challenge dispatched. Awaiting vessel transponder ECDIS acknowledgment.",
                      "investigating"
                    )
                  }
                  className="p-4 rounded-xl bg-[#0a1a2b] hover:bg-slate-800 border border-teal-500/30 hover:border-teal-400 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-teal-300 font-bold group-hover:text-teal-200">
                      CRYPTOGRAPHIC AUTH CHALLENGE
                    </span>
                    <Zap className="w-4 h-4 text-teal-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Trigger satellite VHF data exchange (VDES) authentication challenge to confirm bridge ECDIS authenticity.
                  </p>
                </button>

                <button
                  onClick={() =>
                    handleAction(
                      "Incident cleared and marked as resolved.",
                      "resolved"
                    )
                  }
                  className="p-4 rounded-xl bg-[#0a1a2b] hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-300 font-bold group-hover:text-emerald-200">
                      MARK INCIDENT RESOLVED
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Archive investigation after confirming signal restabilization or verified transponder servicing.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 px-6 border-t border-cyan-500/20 bg-[#0a1a2b]/60">
          <div className="text-[11px] text-slate-400 font-mono-telemetry flex items-center gap-2">
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
            <span>GEO-ENCRYPTION TOKEN: OS-SEC-9981-ALPHA</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={downloadDossier}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono-telemetry text-xs font-semibold transition-colors"
            >
              <FileDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>DOWNLOAD DOSSIER JSON</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono-telemetry text-xs font-semibold transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
