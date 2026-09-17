"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Radio,
  ExternalLink,
  ShieldCheck,
  Zap,
  Filter,
  CheckCircle2,
  Activity,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { THREAT_ALERTS } from "../data/mockData";
import { ThreatAlert, MaritimeZone } from "../types/dashboard";
import { SeverityBadge } from "./ui/Badge";

interface ThreatAlertsPanelProps {
  selectedZone: MaritimeZone;
  onSelectVessel: (mmsi: string) => void;
}

export function ThreatAlertsPanel({
  selectedZone,
  onSelectVessel,
}: ThreatAlertsPanelProps) {
  const [filterSeverity, setFilterSeverity] = useState<"ALL" | "CRITICAL">("ALL");
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([]);

  // Filter alerts by zone and severity
  const filteredAlerts = THREAT_ALERTS.filter((alert) => {
    const matchesZone =
      selectedZone === "Global Fleet" || alert.zone === selectedZone;
    const matchesSeverity =
      filterSeverity === "ALL" || alert.severity === "CRITICAL";
    return matchesZone && matchesSeverity;
  });

  const toggleAcknowledge = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAcknowledgedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-5 relative overflow-hidden transition-all duration-300 border border-cyan-500/25 flex flex-col h-full shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Top Specular Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500/40 to-transparent pointer-events-none" />

      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-cyan-500/15">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <AlertTriangle className="h-4.5 w-4.5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-rose-200 font-mono-telemetry flex items-center gap-1.5">
                LIVE THREAT ALERTS STREAM
              </h2>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-mono-telemetry font-bold border border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.3)]">
                {filteredAlerts.length} ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono-telemetry">
              SAR VERIFIED RF & AIS SPOOFING ANOMALIES
            </p>
          </div>
        </div>

        {/* Severity Filter Toggle */}
        <div className="flex items-center space-x-1 bg-[#06121E] p-1 rounded-xl border border-slate-800 text-[10px] font-mono-telemetry">
          <button
            onClick={() => setFilterSeverity("ALL")}
            className={`px-2.5 py-1 rounded-lg transition-all duration-200 ${
              filterSeverity === "ALL"
                ? "bg-cyan-500/25 text-cyan-200 font-bold border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setFilterSeverity("CRITICAL")}
            className={`px-2.5 py-1 rounded-lg transition-all duration-200 ${
              filterSeverity === "CRITICAL"
                ? "bg-rose-500/30 text-rose-300 font-bold border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            CRITICAL
          </button>
        </div>
      </div>

      {/* Alerts Scrollable List */}
      <div className="mt-3.5 space-y-2.5 overflow-y-auto max-h-[460px] pr-1">
        {filteredAlerts.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono-telemetry text-slate-500">
            No active threat alerts in this corridor matching criteria.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isAck = acknowledgedIds.includes(alert.id);

            return (
              <div
                key={alert.id}
                onClick={() => onSelectVessel(alert.mmsi)}
                className={`p-3.5 rounded-xl border transition-all duration-300 cursor-pointer group relative overflow-hidden hover:-translate-y-0.5 ${
                  isAck
                    ? "bg-slate-900/40 border-slate-800 opacity-60"
                    : alert.severity === "CRITICAL"
                    ? "bg-gradient-to-r from-[#170e18]/80 to-[#0c1826]/80 border-rose-500/35 hover:border-rose-400/80 hover:shadow-[0_0_25px_rgba(244,63,94,0.22)]"
                    : "bg-gradient-to-r from-[#0a1a2b]/80 to-[#071524]/80 border-cyan-500/25 hover:border-cyan-400/70 hover:shadow-[0_0_25px_rgba(6,182,212,0.18)]"
                }`}
              >
                {/* Left severity indicator bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
                    alert.severity === "CRITICAL"
                      ? "bg-rose-500 shadow-[0_0_10px_#f43f5e] group-hover:w-1.5"
                      : alert.severity === "HIGH"
                      ? "bg-amber-400 shadow-[0_0_10px_#f59e0b] group-hover:w-1.5"
                      : "bg-cyan-400 shadow-[0_0_10px_#06b6d4] group-hover:w-1.5"
                  }`}
                />

                <div className="pl-2 space-y-1.5">
                  {/* Top Line: Vessel, MMSI, Severity, Timestamp */}
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-mono-telemetry group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                        {alert.vesselName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono-telemetry">
                        (MMSI: {alert.mmsi})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={alert.severity} />
                      <span className="text-[10px] font-mono-telemetry text-slate-400 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-slate-500" />
                        {alert.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Anomaly Signature Tag */}
                  <div className="flex items-center gap-2 text-[11px] font-mono-telemetry">
                    <span className="text-cyan-300 font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      {alert.anomaly}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{alert.zone}</span>
                  </div>

                  {/* Summary Text */}
                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                    {alert.summary}
                  </p>

                  {/* Telemetry & Action Footer */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-telemetry">
                    <div className="flex items-center gap-3 text-slate-400">
                      {alert.verifiedBySAR && (
                        <span className="flex items-center gap-1 text-teal-300 font-bold">
                          <ShieldCheck className="w-3 h-3 text-teal-400" />
                          SAR VERIFIED
                        </span>
                      )}
                      <span>
                        RF POWER:{" "}
                        <span className="text-slate-300 font-bold">
                          {alert.rfInterferenceDbm} dBm
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleAcknowledge(alert.id, e)}
                        className={`px-2 py-0.5 rounded text-[10px] border transition-all duration-200 ${
                          isAck
                            ? "border-emerald-500/40 text-emerald-300 bg-emerald-950/40"
                            : "border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800"
                        }`}
                        title="Acknowledge alert"
                      >
                        {isAck ? "ACKNOWLEDGED" : "ACK"}
                      </button>

                      <button
                        onClick={() => onSelectVessel(alert.mmsi)}
                        className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold group/btn"
                      >
                        <span>DOSSIER</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
