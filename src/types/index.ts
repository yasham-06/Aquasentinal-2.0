export type PageType = 
  | 'landing' 
  | 'dashboard' 
  | 'topology'
  | 'valves'
  | 'predictive'
  | 'esg'
  | 'monitoring' 
  | 'alerts' 
  | 'analytics' 
  | 'tickets' 
  | 'settings';

export type SimulationMode = 'NORMAL' | 'LEAK' | 'OVERFLOW' | 'HIGH_USAGE';

export type BuildingStatus = 'Normal' | 'Elevated' | 'Critical';

export interface BuildingInfo {
  id: string;
  name: string;
  status: BuildingStatus;
  flowRate: number;
  expectedFlow: number;
  tankLevel: number; // percentage
  pressure: number; // bar
  todayUsage: number; // Liters
  activeAlertsCount: number;
  locationDescription: string;
}

export interface TelemetryPoint {
  timestamp: string;
  actualFlow: number; // L/min
  expectedFlow: number; // L/min
  temperature: number; // °C
  tankLevel: number; // %
  pressure: number; // bar
  isAnomaly?: boolean;
}

export type AlertSeverity = 'CRITICAL' | 'ELEVATED' | 'INFO';

export interface AlertItem {
  id: string;
  title: string;
  location: string;
  currentFlow: number;
  expectedFlow: number;
  deviationPct: number;
  durationMinutes: number;
  severity: AlertSeverity;
  timestamp: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  isLeak?: boolean;
}

export type TicketStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface TicketItem {
  id: string;
  ticketNumber: string;
  location: string;
  issue: string;
  priority: TicketPriority;
  status: TicketStatus;
  estimatedLoss: string;
  createdAt: string;
  assignee?: string;
  description: string;
  buildingId: string;
}

export interface EvidenceStep {
  stage: string;
  value: string;
  status: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
  detail: string;
}

export interface AIAnalysis {
  isAnomaly: boolean;
  severity: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
  confidence: number;
  cause: string;
  explanation: string;
  recommendedAction: string;
  deviationPct: number;
  durationMinutes: number;
  estimatedLoss1h: number;
  estimatedLoss6h: number;
  estimatedLoss24h: number;
  estimatedFinancialLoss6h: number;
  evidenceTimeline: EvidenceStep[];
}

export interface SystemMetrics {
  todayConsumptionL: number;
  waterSavedL: number;
  activeAlertsCount: number;
  systemEfficiencyPct: number;
}

// ==========================================
// AQUASENTINEL 2.0 EXTENDED TYPES
// ==========================================

export type NodeType = 'MAIN_INFLOW' | 'SUB_MAIN' | 'RISER' | 'UTILITY_LINE' | 'RESERVOIR';
export type ValveStatus = 'OPEN' | 'CLOSED' | 'ISOLATING';

export interface MeshNodeInfo {
  id: string;
  name: string;
  type: NodeType;
  buildingId: string;
  flowRate: number;
  expectedFlow: number;
  pressureBar: number;
  status: 'Normal' | 'Elevated' | 'Critical';
  connectedValveId?: string;
  isIsolated: boolean;
}

export interface RemoteValve {
  id: string;
  valveTag: string;
  location: string;
  nodeId: string;
  status: ValveStatus;
  autoShutoffEnabled: boolean;
  lastActuated: string;
  responseLatencyMs: number;
}

export interface MicroPressurePoint {
  timestamp: string;
  baselinePressure: number;
  measuredPressure: number;
  pressureGradient: number; // ΔP/Δt (bar/sec)
  fatigueIndex: number; // 0-100 scale
  fatigueRisk: 'NORMAL' | 'ELEVATED' | 'CRITICAL_FATIGUE';
}

export interface EsgMetrics {
  totalWaterSavedLiters: number;
  energySavedKwh: number; // 0.85 kWh per 1,000 L
  co2AvoidedKg: number; // 0.71 kg CO2e per kWh
  financialSavingsINR: number;
  esgScoreGrade: 'A+' | 'A' | 'B+';
  auditCompliancePct: number;
}

