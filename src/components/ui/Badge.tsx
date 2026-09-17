import React from "react";
import { ThreatSeverity, InvestigationStatus } from "../../types/dashboard";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "critical"
    | "high"
    | "medium"
    | "low"
    | "optimal"
    | "info"
    | "cyan"
    | "teal";
  size?: "sm" | "md";
  pulse?: boolean;
}

export function Badge({
  children,
  variant = "info",
  size = "sm",
  pulse = false,
}: BadgeProps) {
  const variantStyles = {
    critical:
      "bg-rose-500/15 text-rose-300 border-rose-500/30 hover:border-rose-500/50",
    high: "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:border-amber-500/50",
    medium:
      "bg-sky-500/15 text-sky-300 border-sky-500/30 hover:border-sky-500/50",
    low: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:border-emerald-500/50",
    optimal:
      "bg-teal-500/15 text-teal-300 border-teal-500/30 hover:border-teal-500/50",
    info: "bg-slate-700/40 text-slate-300 border-slate-600/40 hover:border-slate-500/60",
    cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:border-cyan-500/50",
    teal: "bg-teal-500/15 text-teal-300 border-teal-500/30 hover:border-teal-500/50",
  };

  const dotColors = {
    critical: "bg-rose-400",
    high: "bg-amber-400",
    medium: "bg-sky-400",
    low: "bg-emerald-400",
    optimal: "bg-teal-400",
    info: "bg-slate-400",
    cyan: "bg-cyan-400",
    teal: "bg-teal-400",
  };

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 font-mono-telemetry",
    md: "text-xs px-2.5 py-1 font-mono-telemetry",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColors[variant]}`}
        />
      </span>
      {children}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: ThreatSeverity }) {
  const map: Record<ThreatSeverity, "critical" | "high" | "medium" | "low"> = {
    CRITICAL: "critical",
    HIGH: "high",
    MEDIUM: "medium",
    LOW: "low",
  };
  return (
    <Badge variant={map[severity]} pulse={severity === "CRITICAL"}>
      {severity}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: InvestigationStatus }) {
  const config: Record<
    InvestigationStatus,
    { label: string; variant: "critical" | "high" | "optimal" | "info" }
  > = {
    investigating: { label: "INVESTIGATING", variant: "high" },
    confirmed_spoof: { label: "CONFIRMED SPOOF", variant: "critical" },
    resolved: { label: "RESOLVED", variant: "optimal" },
    false_positive: { label: "FALSE POSITIVE", variant: "info" },
  };

  const current = config[status];
  return (
    <Badge variant={current.variant} pulse={status === "investigating"}>
      {current.label}
    </Badge>
  );
}
