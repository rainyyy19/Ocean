export type ThreatSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type InvestigationStatus =
  | "investigating"
  | "confirmed_spoof"
  | "resolved"
  | "false_positive";

export type AnomalyType =
  | "Circular Drift Spoofing"
  | "GPS Teleportation Jump"
  | "Phantom Ghost Vessel"
  | "Identity Cloned (Duplicate MMSI)"
  | "GNSS Jamming Denial"
  | "False Static AIS Injection"
  | "Speed Vector Inconsistency";

export type MaritimeZone =
  | "Strait of Hormuz"
  | "Black Sea & Kerch"
  | "South China Sea"
  | "Baltic Sea"
  | "Bab-el-Mandeb"
  | "Gulf of Guinea"
  | "Eastern Mediterranean"
  | "Global Fleet";

export interface VesselInvestigation {
  id: string;
  name: string;
  flag: string;
  flagEmoji: string;
  imo: string;
  mmsi: string;
  type: string;
  zone: MaritimeZone;
  coordinates: {
    lat: number;
    lng: number;
    display: string;
  };
  anomaly: AnomalyType;
  severity: ThreatSeverity;
  riskScore: number; // 0 - 100
  status: InvestigationStatus;
  detectedTime: string;
  reportedSpeed: number; // knots
  radarTrueSpeed: number; // knots
  deviationNm: number; // nautical miles
  confidenceScore: number; // percentage
  satelliteSource: string;
  assignedAnalyst: string;
  description: string;
  historyPoints?: { x: number; y: number; time: string }[];
}

export interface ThreatAlert {
  id: string;
  vesselName: string;
  mmsi: string;
  anomaly: AnomalyType;
  severity: ThreatSeverity;
  zone: MaritimeZone;
  timestamp: string;
  coordinates: string;
  summary: string;
  verifiedBySAR: boolean;
  rfInterferenceDbm: number;
}

export interface Hotspot {
  id: string;
  name: string;
  zone: MaritimeZone;
  x: number; // percentage on map [0-100]
  y: number; // percentage on map [0-100]
  threatCount: number;
  criticalCount: number;
  radiusNm: number;
  dominantThreat: string;
  trend: string;
}

export interface StatMetric {
  title: string;
  value: string;
  change: string;
  isIncrease: boolean;
  status: "critical" | "warning" | "optimal" | "info";
  detail: string;
  subtitle: string;
}
