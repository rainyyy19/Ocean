"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Radar,
  ShieldAlert,
  Activity,
  Anchor,
  Compass,
  FileWarning,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Satellite,
  Lock,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const menuItems = [
    {
      id: "tactical-overview",
      label: "Tactical Overview",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "live-radar",
      label: "Live World Radar",
      icon: Radar,
      badge: "LIVE",
    },
    {
      id: "investigations",
      label: "Spoof Investigations",
      icon: ShieldAlert,
      badge: "10",
    },
    {
      id: "telemetry-flux",
      label: "Telemetry & RF Flux",
      icon: Activity,
      badge: null,
    },
    {
      id: "fleet-registry",
      label: "Vessel Registry",
      icon: Anchor,
      badge: null,
    },
    {
      id: "geofence-zones",
      label: "Choke Points",
      icon: Compass,
      badge: "6",
    },
    {
      id: "compliance",
      label: "Blacklist & Sanctions",
      icon: FileWarning,
      badge: null,
    },
    {
      id: "defense-config",
      label: "System Settings",
      icon: Sliders,
      badge: null,
    },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-cyan-500/20 bg-[#06121E]/95 backdrop-blur-2xl transition-all duration-300 z-30 shrink-0 shadow-2xl ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Collapse Toggle Button with glowing border */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 z-40 flex h-6 w-6 items-center justify-center rounded-full bg-[#0a1a2b] border border-cyan-400/50 text-cyan-300 hover:text-white hover:border-cyan-300 hover:shadow-[0_0_12px_rgba(6,182,212,0.5)] transition-all"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Navigation Links */}
      <div className="flex-1 py-5 px-2.5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono-telemetry uppercase tracking-wider text-slate-500 font-semibold flex items-center justify-between">
          {!collapsed && (
            <>
              <span>Defense Operations</span>
              <Sparkles className="w-3 h-3 text-cyan-400/50" />
            </>
          )}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono-telemetry transition-all duration-200 group relative ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/25 via-teal-500/15 to-transparent text-cyan-200 border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.2)] font-bold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent hover:border-cyan-500/20"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <div
                className={`relative flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                    : "text-slate-400 group-hover:text-cyan-300"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {isActive && (
                  <span className="absolute -left-3.5 h-5 w-1 bg-gradient-to-b from-cyan-300 to-teal-400 rounded-r shadow-[0_0_10px_#06b6d4]" />
                )}
              </div>

              {!collapsed && (
                <div className="flex-1 flex items-center justify-between overflow-hidden">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-sm ${
                        item.badge === "LIVE"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                          : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Satellite & Cipher Health Card */}
      {!collapsed ? (
        <div className="p-3.5 m-2.5 rounded-xl bg-gradient-to-b from-[#0a1a2b]/95 to-[#06121E]/95 border border-cyan-500/25 text-[11px] font-mono-telemetry space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Satellite className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              LEO MESH UPTIME
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            32 Active Satellites Syncing <br />
            RF Geo-Location: <span className="text-teal-300 font-bold">99.98% NOMINAL</span>
          </p>
          <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-cyan-400" />
              AES-256 GCM
            </span>
            <span className="text-emerald-400 font-bold">MIL-STD 810H</span>
          </div>
        </div>
      ) : (
        <div className="p-3.5 flex justify-center text-cyan-400 border-t border-cyan-500/20">
          <Satellite className="w-4 h-4 animate-pulse" />
        </div>
      )}
    </aside>
  );
}
