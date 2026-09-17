"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Search,
  Bell,
  Radio,
  Clock,
  Activity,
  UserCheck,
  ChevronDown,
  Terminal,
  Command,
  Sparkles,
  Wifi,
} from "lucide-react";
import { Badge } from "./ui/Badge";

interface TopNavProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  unreadAlertsCount: number;
  onOpenNotifications: () => void;
}

export function TopNav({
  onSearch,
  searchQuery,
  unreadAlertsCount,
  onOpenNotifications,
}: TopNavProps) {
  const [utcTime, setUtcTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(
        now.toISOString().substring(11, 19) + " UTC"
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/25 bg-[#06121E]/90 backdrop-blur-2xl transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Branding & MARSEC Status */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-950/90 via-navy-900 to-teal-950/90 border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-transform duration-300 group-hover:scale-105">
              <ShieldAlert className="h-5 w-5 text-cyan-300 group-hover:text-cyan-200 transition-colors" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-wider text-white font-mono-telemetry">
                  OCEAN<span className="text-cyan-400">SHIELD</span>
                  <span className="text-xs ml-1.5 px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                    AI
                  </span>
                </span>
              </div>
              <p className="text-[10px] tracking-widest text-slate-400 font-mono-telemetry uppercase hidden sm:block">
                Maritime Cyber Defense & Anti-Spoofing
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-2.5 pl-4 border-l border-slate-800">
            <Badge variant="critical" pulse size="sm">
              MARSEC 2 // ELEVATED
            </Badge>
            <div className="flex items-center text-[11px] font-mono-telemetry text-slate-400 gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800 shadow-sm">
              <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>SAT-AIS: 18ms</span>
            </div>
          </div>
        </div>

        {/* Center: Search Vessel / MMSI with Modern Shortcut Pill */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400/70 group-focus-within:text-cyan-300 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search IMO, MMSI, Vessel Name or Threat Vector..."
              className="w-full h-9 pl-9 pr-14 text-xs font-mono-telemetry bg-[#0a1a2b]/80 border border-cyan-500/25 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all shadow-inner"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700 pointer-events-none font-mono-telemetry">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right: Live UTC clock & Notifications & Operator */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-cyan-300 font-mono-telemetry text-xs shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{utcTime || "12:00:00 UTC"}</span>
          </div>

          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-[#0a1a2b] border border-cyan-500/30 text-slate-300 hover:text-cyan-300 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all duration-200"
            title="Threat Stream Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-[0_0_10px_rgba(244,63,94,0.7)] animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* User / Operator Badge */}
          <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-800">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-900/80 to-slate-900 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-mono-telemetry text-xs font-bold shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              OP
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-bold text-slate-200 font-mono-telemetry flex items-center gap-1.5">
                CDR. VANCE
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]"></span>
              </p>
              <p className="text-[10px] text-cyan-400 font-mono-telemetry font-medium">
                CYBER MARITIME UNIT
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
