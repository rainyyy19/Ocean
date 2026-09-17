import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: "cyan" | "teal" | "rose" | "none";
  headerAction?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function GlassCard({
  children,
  className,
  glow = "none",
  headerAction,
  title,
  subtitle,
  icon,
  ...props
}: GlassCardProps) {
  const glowClasses = {
    none: "",
    cyan: "hover:border-cyan-400/50 hover:shadow-[0_0_24px_rgba(6,182,212,0.15)]",
    teal: "hover:border-teal-400/50 hover:shadow-[0_0_24px_rgba(20,184,166,0.15)]",
    rose: "hover:border-rose-400/50 hover:shadow-[0_0_24px_rgba(244,63,94,0.15)]",
  };

  return (
    <div
      className={twMerge(
        clsx(
          "glass-panel rounded-xl p-5 relative overflow-hidden transition-all duration-300",
          "before:absolute before:inset-0 before:bg-gradient-to-b before:from-cyan-500/5 before:to-transparent before:pointer-events-none",
          glowClasses[glow],
          className
        )
      )}
      {...props}
    >
      {/* Subtle corner decorative marks */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400/40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400/40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400/40 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400/40 pointer-events-none" />

      {(title || icon || headerAction) && (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-cyan-500/15">
          <div className="flex items-center space-x-2.5">
            {icon && <div className="text-cyan-400 shrink-0">{icon}</div>}
            <div>
              {title && (
                <h3 className="text-xs font-semibold tracking-wider uppercase text-cyan-200 font-mono-telemetry flex items-center gap-2">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      {children}
    </div>
  );
}
