import { 
  TelemetryPoint, 
  BuildingInfo, 
  AlertItem, 
  TicketItem, 
  SystemMetrics, 
  AIAnalysis, 
  SimulationMode,
  EvidenceStep 
} from '../types';
import { 
  INITIAL_METRICS, 
  INITIAL_BUILDINGS, 
  INITIAL_ALERTS, 
  INITIAL_TICKETS 
} from './mockData';
import { multiNodeEngine } from './multiNodeEngine';

export type TelemetryListener = (data: {
  telemetryHistory: TelemetryPoint[];
  latestTelemetry: TelemetryPoint;
  buildings: BuildingInfo[];
  alerts: AlertItem[];
  tickets: TicketItem[];
  aiAnalysis: AIAnalysis;
  metrics: SystemMetrics;
  mode: SimulationMode;
}) => void;

class TelemetryEngine {
  private baselineFlow = 43; // L/min
  private currentFlow = 43;
  private currentTankLevel = 74;
  private currentPressure = 2.8;
  private currentTemp = 27.0;
  private waterCostPer1000L = 45; // ₹45 per 1,000 Liters (INR)

  private mode: SimulationMode = 'NORMAL';
  private tickCount = 0;
  private leakRampStep = 0;
  private anomalyDurationSeconds = 0;
  private alertGeneratedForCurrentSession = false;

  private ticketCounter = 103; // Next generated ticket will be Ticket #104

  private telemetryHistory: TelemetryPoint[] = [];
  private buildings: BuildingInfo[] = [...INITIAL_BUILDINGS];
  private alerts: AlertItem[] = [...INITIAL_ALERTS];
  private tickets: TicketItem[] = [...INITIAL_TICKETS];
  private metrics: SystemMetrics = { ...INITIAL_METRICS };

  private listeners: Set<TelemetryListener> = new Set();
  private timerId: number | null = null;

  constructor() {
    this.initBaselineHistory();
  }

  private initBaselineHistory() {
    const times = ['15:00', '15:05', '15:10', '15:15', '15:20', '15:25', '15:30', '15:35', '15:40', '15:45', '15:50', '15:55'];
    this.telemetryHistory = times.map((t, i) => {
      const noise = (i % 3) - 1; // -1, 0, +1
      return {
        timestamp: t,
        actualFlow: 43 + noise,
        expectedFlow: 43,
        temperature: 27.0,
        tankLevel: 74,
        pressure: 2.8,
        isAnomaly: false,
      };
    });
  }

  public start() {
    if (this.timerId !== null) return;
    this.timerId = window.setInterval(() => {
      this.tick();
    }, 1000);
  }

  public stop() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public subscribe(listener: TelemetryListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public setWaterCost(rate: number) {
    this.waterCostPer1000L = rate;
    this.notify();
  }

  public getWaterCost(): number {
    return this.waterCostPer1000L;
  }

  public setMode(mode: SimulationMode) {
    this.mode = mode;
    this.leakRampStep = 0;

    if (mode === 'NORMAL') {
      this.currentFlow = 43;
      this.currentTankLevel = 74;
      this.currentPressure = 2.8;
      this.anomalyDurationSeconds = 0;
      this.alertGeneratedForCurrentSession = false;
      
      // Reset all building statuses to Normal
      this.buildings = this.buildings.map(b => ({
        ...b,
        flowRate: 43,
        status: 'Normal' as const,
        activeAlertsCount: 0,
      }));

      // Mark any active alerts in list as RESOLVED for history
      this.alerts = this.alerts.map(a => 
        a.status === 'ACTIVE' ? { ...a, status: 'RESOLVED' as const } : a
      );
    } else if (mode === 'LEAK') {
      this.anomalyDurationSeconds = 0;
      this.alertGeneratedForCurrentSession = false;
    } else if (mode === 'OVERFLOW') {
      this.currentTankLevel = 98;
      this.currentFlow = 88;
      this.currentPressure = 3.4;
    } else if (mode === 'HIGH_USAGE') {
      this.currentFlow = 68;
      this.currentTankLevel = 65;
    }

    this.notify();
  }

  public reset() {
    this.setMode('NORMAL');
    this.initBaselineHistory();
    this.notify();
  }

  private tick() {
    this.tickCount++;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    const multiState = multiNodeEngine.getState();
    const b2Node = multiState.nodes.find(n => n.id === 'node-blk-b-02');
    const isB2Isolated = b2Node?.isIsolated || false;

    if (isB2Isolated) {
      this.currentFlow = 0;
    }
    else if (this.mode === 'NORMAL') {
      const noise = Math.floor(Math.sin(this.tickCount * 0.8) * 1.5); // 41 to 44 L/min
      this.currentFlow = 43 + noise;
      this.currentPressure = Number((2.8 + Math.sin(this.tickCount * 0.4) * 0.05).toFixed(1));
      this.currentTemp = Number((27.0 + Math.cos(this.tickCount * 0.3) * 0.2).toFixed(1));
    } 
    else if (this.mode === 'LEAK') {
      const rampValues = [43, 44, 48, 55, 61, 69, 78, 86, 94];
      if (this.leakRampStep < rampValues.length - 1) {
        this.leakRampStep++;
        this.currentFlow = rampValues[this.leakRampStep];
      } else {
        const noise = Math.floor(Math.sin(this.tickCount * 0.9) * 2);
        this.currentFlow = 94 + noise;
      }
      this.anomalyDurationSeconds += 1;
    } 
    else if (this.mode === 'OVERFLOW') {
      const noise = Math.floor(Math.sin(this.tickCount * 0.5) * 2);
      this.currentFlow = 88 + noise;
      this.currentTankLevel = Math.min(100, 98 + (this.tickCount % 3));
      this.anomalyDurationSeconds += 1;
    } 
    else if (this.mode === 'HIGH_USAGE') {
      const noise = Math.floor(Math.cos(this.tickCount * 0.7) * 2);
      this.currentFlow = 68 + noise;
      this.anomalyDurationSeconds += 1;
    }

    const isAnomaly = this.currentFlow > this.baselineFlow * 1.5; // Threshold: 64.5 L/min

    // Update building status based strictly on live current flow
    this.buildings = this.buildings.map(b => {
      if (b.id === 'block-b') {
        const status = isAnomaly ? 'Critical' : this.currentFlow > 55 ? 'Elevated' : 'Normal';
        return { ...b, flowRate: this.currentFlow, status, activeAlertsCount: isAnomaly ? 1 : 0 };
      }
      return { ...b, status: 'Normal', activeAlertsCount: 0 };
    });

    const newPoint: TelemetryPoint = {
      timestamp: timeStr,
      actualFlow: this.currentFlow,
      expectedFlow: this.baselineFlow,
      temperature: this.currentTemp,
      tankLevel: this.currentTankLevel,
      pressure: this.currentPressure,
      isAnomaly,
    };

    this.telemetryHistory = [...this.telemetryHistory.slice(1), newPoint];

    // Auto-generate alert ONLY when anomaly threshold (64.5 L/min) is confirmed
    if (isAnomaly && !this.alertGeneratedForCurrentSession && this.anomalyDurationSeconds >= 2) {
      this.alertGeneratedForCurrentSession = true;
      const diff = Math.max(0, this.currentFlow - this.baselineFlow);
      const devPct = Math.round((diff / this.baselineFlow) * 100); // +118% for 94 L/m vs 43 L/m

      const newAlert: AlertItem = {
        id: `alt-${Date.now().toString().slice(-4)}`,
        title: '🚨 Possible Leak Detected',
        location: 'Block B — Floor 2',
        currentFlow: this.currentFlow,
        expectedFlow: this.baselineFlow,
        deviationPct: devPct,
        durationMinutes: 15, // 15 min simulated
        severity: 'CRITICAL',
        timestamp: 'Just now',
        status: 'ACTIVE',
        isLeak: true,
      };
      this.alerts = [newAlert, ...this.alerts];
    }

    this.notify();
  }

  public createNextTicket(): TicketItem {
    this.ticketCounter += 1;
    const ticketNum = `Ticket #${this.ticketCounter}`;
    const isAnomaly = this.currentFlow > this.baselineFlow * 1.5;
    const diff = Math.max(0, this.currentFlow - this.baselineFlow);
    const devPct = Math.round((diff / this.baselineFlow) * 100);

    if (isAnomaly) {
      const loss6h = 18360; // Exact calculation: 51 L/m * 360 min = 18,360 L
      const financial6hINR = 826.20; // Exact calculation: (18,360 / 1000) * 45 = ₹826.20

      const newTicket: TicketItem = {
        id: `t-${Date.now().toString().slice(-4)}`,
        ticketNumber: ticketNum,
        location: 'Block B — Floor 2',
        issue: 'Possible water leak detected by 1.5× Baseline Anomaly Threshold',
        priority: 'CRITICAL',
        status: 'ASSIGNED',
        estimatedLoss: '18,360 L / 6 hours',
        createdAt: 'Just now',
        assignee: 'Rajesh Kumar (Plumbing Team)',
        description: `Continuous flow measured at 94 L/min vs baseline 43 L/min (+${devPct}% deviation). Excess flow: 51 L/min. 15 min simulated excess: 765 L. Projected 6-hour loss: 18,360 L (₹826.20). Recommended inspection on Block B, Floor 2 water line.`,
        buildingId: 'block-b',
      };

      this.tickets = [newTicket, ...this.tickets];
      this.notify();
      return newTicket;
    } else {
      // Normal routine inspection ticket
      const newTicket: TicketItem = {
        id: `t-${Date.now().toString().slice(-4)}`,
        ticketNumber: ticketNum,
        location: 'Block B — Floor 2',
        issue: 'Routine preventative water line check',
        priority: 'LOW',
        status: 'OPEN',
        estimatedLoss: '0 L (Normal Flow)',
        createdAt: 'Just now',
        assignee: 'Unassigned',
        description: `Routine work order logged. Current flow rate ${this.currentFlow} L/min is within normal expected baseline (43 L/min).`,
        buildingId: 'block-b',
      };

      this.tickets = [newTicket, ...this.tickets];
      this.notify();
      return newTicket;
    }
  }

  public updateTicketStatus(ticketId: string, status: TicketItem['status']) {
    this.tickets = this.tickets.map(t => t.id === ticketId ? { ...t, status } : t);
    this.notify();
  }

  public getState() {
    const latest = this.telemetryHistory[this.telemetryHistory.length - 1] || {
      timestamp: '15:55',
      actualFlow: 43,
      expectedFlow: 43,
      temperature: 27.0,
      tankLevel: 74,
      pressure: 2.8,
    };

    const isAnomaly = latest.actualFlow > this.baselineFlow * 1.5; // Threshold: 64.5 L/min
    const diff = isAnomaly ? Math.max(0, latest.actualFlow - this.baselineFlow) : 0;
    const deviationPct = isAnomaly ? Math.round((diff / this.baselineFlow) * 100) : 0;

    // Calculations:
    const loss15m = isAnomaly ? 765 : 0;       // 51 L/m * 15 min = 765 L
    const loss1h = isAnomaly ? 3060 : 0;       // 51 L/m * 60 min = 3,060 L
    const loss6h = isAnomaly ? 18360 : 0;     // 51 L/m * 360 min = 18,360 L
    const loss24h = isAnomaly ? 73440 : 0;    // 51 L/m * 1440 min = 73,440 L
    const financialLoss6hINR = isAnomaly ? 826.20 : 0.00; // (18,360 / 1000) * 45 = ₹826.20

    const evidenceTimeline: EvidenceStep[] = isAnomaly ? [
      {
        stage: 'NORMAL',
        value: '43 L/min baseline',
        status: 'NORMAL',
        detail: 'Expected consumption within standard bounds (40-50 L/min).',
      },
      {
        stage: 'FLOW INCREASE',
        value: '61 L/min',
        status: 'ELEVATED',
        detail: 'Flow rate began rising above standard variance range.',
      },
      {
        stage: 'THRESHOLD CROSSED',
        value: '78 L/min',
        status: 'CRITICAL',
        detail: 'Crossed 1.5× baseline anomaly threshold (64.5 L/min).',
      },
      {
        stage: 'SUSTAINED DEVIATION',
        value: `${latest.actualFlow} L/min (15 min simulated)`,
        status: 'CRITICAL',
        detail: 'Sustained continuous flow persisted without return to baseline.',
      },
      {
        stage: 'ANOMALY CONFIRMED',
        value: 'Continuous leak pattern detected',
        status: 'CRITICAL',
        detail: 'Magnitude + Duration criteria met. Critical Alarm triggered.',
      },
    ] : [
      {
        stage: 'NORMAL',
        value: `${this.baselineFlow} L/min baseline`,
        status: 'NORMAL',
        detail: 'Expected consumption within standard bounds (40-50 L/min).',
      },
      {
        stage: 'FLOW VARIANCE',
        value: `${latest.actualFlow} L/min`,
        status: 'NORMAL',
        detail: 'Normal operational noise around baseline.',
      },
      {
        stage: 'THRESHOLD CHECK',
        value: '64.5 L/min threshold',
        status: 'NORMAL',
        detail: 'No threshold breach detected.',
      },
      {
        stage: 'DURATION',
        value: '0 min',
        status: 'NORMAL',
        detail: 'Baseline stable.',
      },
      {
        stage: 'STATUS',
        value: 'System Normal',
        status: 'NORMAL',
        detail: 'All facility water nodes operating normally.',
      },
    ];

    const aiAnalysis: AIAnalysis = {
      isAnomaly,
      severity: isAnomaly ? 'CRITICAL' : latest.actualFlow > 55 ? 'ELEVATED' : 'NORMAL',
      confidence: isAnomaly ? 94 : 0,
      cause: isAnomaly 
        ? (this.mode === 'OVERFLOW' ? 'Overhead tank overflow' : 'Continuous pipe leak') 
        : 'Normal water usage',
      explanation: isAnomaly
        ? `Water flow has remained sustained at ${latest.actualFlow} L/min (2.2× baseline) for 15 min (simulated). The sustained continuous flow pattern is inconsistent with standard usage and indicates a continuous pipe leak.`
        : 'Water consumption is operating within standard expected baseline bounds (40–50 L/min). All building nodes operating normally.',
      recommendedAction: isAnomaly
        ? 'Inspect Block B — Floor 2 water line and isolate main supply valve immediately.'
        : 'No maintenance action required. System operating normally.',
      deviationPct: isAnomaly ? 118 : 0,
      durationMinutes: isAnomaly ? 15 : 0,
      estimatedLoss1h: loss1h,
      estimatedLoss6h: loss6h,
      estimatedLoss24h: loss24h,
      estimatedFinancialLoss6h: financialLoss6hINR,
      evidenceTimeline,
    };

    const activeAlertsCount = this.alerts.filter(a => a.status === 'ACTIVE').length;

    const metrics: SystemMetrics = {
      ...this.metrics,
      activeAlertsCount,
      systemEfficiencyPct: 100.0,
    };

    return {
      telemetryHistory: this.telemetryHistory,
      latestTelemetry: latest,
      buildings: this.buildings,
      alerts: this.alerts,
      tickets: this.tickets,
      aiAnalysis,
      metrics,
      mode: this.mode,
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach(l => l(state));
  }
}

export const telemetryEngine = new TelemetryEngine();
