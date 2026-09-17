"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Compass,
  FileSpreadsheet,
  Zap,
  Activity,
} from "lucide-react";
import { INVESTIGATIONS } from "../data/mockData";
import {
  VesselInvestigation,
  InvestigationStatus,
  MaritimeZone,
} from "../types/dashboard";
import { StatusBadge, SeverityBadge } from "./ui/Badge";

interface InvestigationsTableProps {
  selectedZone: MaritimeZone;
  searchQuery: string;
  onSelectVessel: (vessel: VesselInvestigation) => void;
}

export function InvestigationsTable({
  selectedZone,
  searchQuery,
  onSelectVessel,
}: InvestigationsTableProps) {
  const [statusFilter, setStatusFilter] = useState<"ALL" | InvestigationStatus>("ALL");
  const [internalSearch, setInternalSearch] = useState("");

  const effectiveSearch = (searchQuery || internalSearch).toLowerCase();

  const filteredList = INVESTIGATIONS.filter((item) => {
    const matchesZone =
      selectedZone === "Global Fleet" || item.zone === selectedZone;
    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;
    const matchesSearch =
      !effectiveSearch ||
      item.name.toLowerCase().includes(effectiveSearch) ||
      item.imo.toLowerCase().includes(effectiveSearch) ||
      item.mmsi.includes(effectiveSearch) ||
      item.anomaly.toLowerCase().includes(effectiveSearch) ||
      item.type.toLowerCase().includes(effectiveSearch);

    return matchesZone && matchesStatus && matchesSearch;
  });

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 relative overflow-hidden transition-all duration-300 border border-cyan-500/25 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Top Specular Gloss Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-cyan-500/15 gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-950/80 border border-cyan-400/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <ShieldAlert className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-200 font-mono-telemetry flex items-center gap-1.5">
                RECENT MARITIME SPOOFING INVESTIGATIONS
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-mono-telemetry font-bold shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                {filteredList.length} ACTIVE CASES
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono-telemetry">
              REAL-TIME SATELLITE DISCREPANCY FORENSICS // AUTOMATED DEFENSE QUEUE
            </p>
          </div>
        </div>

        {/* Filter Pills and Local Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Tabs */}
          <div className="flex items-center bg-[#06121E] p-1 rounded-xl border border-cyan-500/20 text-[11px] font-mono-telemetry">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                statusFilter === "ALL"
                  ? "bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.25)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setStatusFilter("investigating")}
              className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                statusFilter === "investigating"
                  ? "bg-amber-500/30 text-amber-200 font-bold border border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.25)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ACTIVE
            </button>
            <button
              onClick={() => setStatusFilter("confirmed_spoof")}
              className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                statusFilter === "confirmed_spoof"
                  ? "bg-rose-500/30 text-rose-200 font-bold border border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.25)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              CONFIRMED SPOOF
            </button>
            <button
              onClick={() => setStatusFilter("resolved")}
              className={`px-3 py-1 rounded-lg transition-all duration-200 ${
                statusFilter === "resolved"
                  ? "bg-teal-500/30 text-teal-200 font-bold border border-teal-400/40 shadow-[0_0_10px_rgba(20,184,166,0.25)]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              RESOLVED
            </button>
          </div>

          {/* Table search if not globally searching */}
          {!searchQuery && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={internalSearch}
                onChange={(e) => setInternalSearch(e.target.value)}
                placeholder="Filter table..."
                className="h-8 pl-8 pr-3 text-[11px] font-mono-telemetry bg-[#06121E] border border-cyan-500/25 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-36 sm:w-48 transition-all"
              />
            </div>
          )}
        </div>
      </div>

      {/* High-density Tactical Table */}
      <div className="mt-4 overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
        <table className="w-full text-left border-collapse min-w-[960px]">
          <thead>
            <tr className="border-b border-cyan-500/20 text-[10px] uppercase font-mono-telemetry text-slate-400 bg-[#06121E]/70">
              <th className="py-3 px-3 font-semibold">VESSEL / FLAG</th>
              <th className="py-3 px-3 font-semibold">IDENTIFIERS</th>
              <th className="py-3 px-3 font-semibold">ANOMALY VECTOR</th>
              <th className="py-3 px-3 font-semibold">OPERATIONAL ZONE</th>
              <th className="py-3 px-3 font-semibold">SPEED DISCREPANCY</th>
              <th className="py-3 px-3 font-semibold text-center">RISK INDEX</th>
              <th className="py-3 px-3 font-semibold">STATUS</th>
              <th className="py-3 px-3 font-semibold text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono-telemetry text-xs">
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-500 text-xs">
                  No vessel investigations found matching criteria.
                </td>
              </tr>
            ) : (
              filteredList.map((vessel) => {
                const speedDiff = Math.abs(vessel.reportedSpeed - vessel.radarTrueSpeed);
                const hasLargeDiscrepancy = speedDiff > 5;

                return (
                  <tr
                    key={vessel.id}
                    onClick={() => onSelectVessel(vessel)}
                    className="hover:bg-cyan-950/25 hover:shadow-[inset_0_0_15px_rgba(6,182,212,0.06)] cursor-pointer transition-all duration-200 group"
                  >
                    {/* Vessel Name & Flag */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-lg transition-transform duration-200 group-hover:scale-110" title={vessel.flag}>
                          {vessel.flagEmoji}
                        </span>
                        <div>
                          <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                            {vessel.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-sans">
                            {vessel.type}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Identifiers */}
                    <td className="py-3.5 px-3">
                      <div className="text-slate-300 text-[11px] font-bold">
                        {vessel.mmsi}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {vessel.imo}
                      </div>
                    </td>

                    {/* Anomaly Signature */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-cyan-300 font-semibold text-[11px]">
                          {vessel.anomaly}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Deviation:{" "}
                        <span className="text-rose-400 font-bold">
                          {vessel.deviationNm} nm
                        </span>
                      </div>
                    </td>

                    {/* Zone & Coordinates */}
                    <td className="py-3.5 px-3">
                      <div className="text-slate-300 text-[11px] font-semibold">
                        {vessel.zone}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono-telemetry">
                        {vessel.coordinates.display}
                      </div>
                    </td>

                    {/* Speed Discrepancy */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="text-[11px] text-slate-300">
                            AIS: <span className="text-white font-bold">{vessel.reportedSpeed} kt</span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            SAR: <span className="text-cyan-400">{vessel.radarTrueSpeed} kt</span>
                          </div>
                        </div>
                        {hasLargeDiscrepancy && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[9px] font-bold border border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.3)]">
                            Δ {speedDiff.toFixed(1)} kt
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Risk Index with glowing gauge */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded border shadow-sm ${
                            vessel.riskScore >= 85
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
                              : vessel.riskScore >= 70
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]"
                              : "bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-[0_0_8px_rgba(20,184,166,0.25)]"
                          }`}
                        >
                          {vessel.riskScore}
                        </span>
                        <div className="w-12 bg-slate-800 rounded-full h-1 mt-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              vessel.riskScore >= 85
                                ? "bg-rose-500"
                                : vessel.riskScore >= 70
                                ? "bg-amber-400"
                                : "bg-teal-400"
                            }`}
                            style={{ width: `${vessel.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3">
                      <StatusBadge status={vessel.status} />
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectVessel(vessel);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1a2b] hover:bg-cyan-950/80 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 text-[11px] font-bold transition-all duration-200 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] group/btn"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>INSPECT</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
