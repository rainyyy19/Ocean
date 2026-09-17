import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#03080e",
          900: "#06121E",
          850: "#081726",
          800: "#0a1e32",
          750: "#0d263f",
          700: "#11304f",
          600: "#18426c",
        },
        cyber: {
          cyan: "#00f2fe",
          "cyan-bright": "#22d3ee",
          teal: "#14b8a6",
          "teal-bright": "#2dd4bf",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
      },
      backgroundImage: {
        "radar-radial": "radial-gradient(circle at center, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
        "cyber-grid": "linear-gradient(to right, rgba(6, 182, 212, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(6, 182, 212, 0.05) 1px, transparent 1px)",
      },
      animation: {
        "radar-sweep": "radarSweep 4s linear infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "scan-line": "scanline 8s linear infinite",
      },
      keyframes: {
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.9" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
