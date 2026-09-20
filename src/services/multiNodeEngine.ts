import { 
  MeshNodeInfo, 
  RemoteValve, 
  MicroPressurePoint, 
  EsgMetrics,
  SimulationMode,
  AlertItem,
  TicketItem
} from '../types';

export interface MultiNodeState {
  nodes: MeshNodeInfo[];
  valves: RemoteValve[];
  differentialLeakFlow: number; // Inflow - sum(outflows)
  hasDifferentialLeak: boolean;
  pressurePoints: MicroPressurePoint[];
  esgMetrics: EsgMetrics;
  mode: SimulationMode;
}

export type MultiNodeListener = (state: MultiNodeState) => void;

class MultiNodeEngine {
  private mode: SimulationMode = 'NORMAL';
  private tickCount = 0;
  private listeners: Set<MultiNodeListener> = new Set();
  private timerId: number | null = null;

  // 6 Campus Mesh Nodes
  private nodes: MeshNodeInfo[] = [
    {
      id: 'node-main-01',
      name: 'Main Inflow Supply Meter (Campus Gate)',
      type: 'MAIN_INFLOW',
      buildingId: 'campus-main',
      flowRate: 140,
      expectedFlow: 140,
      pressureBar: 4.2,
      status: 'Normal',
      connectedValveId: 'v-main-01',
      isIsolated: false
    },
    {
      id: 'node-blk-a',
      name: 'Block A Sub-Main Supply Line',
      type: 'SUB_MAIN',
      buildingId: 'block-a',
      flowRate: 48,
      expectedFlow: 48,
      pressureBar: 3.2,
      status: 'Normal',
      connectedValveId: 'v-blk-a',
      isIsolated: false
    },
    {
      id: 'node-blk-b-01',
      name: 'Block B Riser 1 (Floors 1-3)',
      type: 'RISER',
      buildingId: 'block-b',
      flowRate: 43,
      expectedFlow: 43,
      pressureBar: 2.8,
      status: 'Normal',
      connectedValveId: 'v-blk-b-01',
      isIsolated: false
    },
    {
      id: 'node-blk-b-02',
      name: 'Block B Floor 2 Utility Line',
      type: 'UTILITY_LINE',
      buildingId: 'block-b',
      flowRate: 43,
      expectedFlow: 43,
      pressureBar: 2.8,
      status: 'Normal',
      connectedValveId: 'v-blk-b-02',
      isIsolated: false
    },
    {
      id: 'node-blk-c',
      name: 'Block C Hostel Supply Riser',
      type: 'RISER',
      buildingId: 'block-c',
      flowRate: 35,
      expectedFlow: 35,
      pressureBar: 3.0,
      status: 'Normal',
      connectedValveId: 'v-blk-c',
      isIsolated: false
    },
    {
      id: 'node-tank-01',
      name: 'Central Overhead Storage Reservoir',
      type: 'RESERVOIR',
      buildingId: 'central-tank',
      flowRate: 140,
      expectedFlow: 140,
      pressureBar: 1.8,
      status: 'Normal',
      connectedValveId: 'v-tank-01',
      isIsolated: false
    }
  ];

  // 6 Remote Actuation Valves
  private valves: RemoteValve[] = [
    {
      id: 'v-main-01',
      valveTag: 'VALVE-MAIN-01',
      location: 'Main Inflow Meter Room',
      nodeId: 'node-main-01',
      status: 'OPEN',
      autoShutoffEnabled: true,
      lastActuated: 'System Start',
      responseLatencyMs: 140
    },
    {
      id: 'v-blk-a',
      valveTag: 'VALVE-BLK-A',
      location: 'Block A Basement Manifold',
      nodeId: 'node-blk-a',
      status: 'OPEN',
      autoShutoffEnabled: false,
      lastActuated: '12h ago',
      responseLatencyMs: 220
    },
    {
      id: 'v-blk-b-01',
      valveTag: 'VALVE-BLK-B1',
      location: 'Block B Ground Riser',
      nodeId: 'node-blk-b-01',
      status: 'OPEN',
      autoShutoffEnabled: true,
      lastActuated: '1d ago',
      responseLatencyMs: 180
    },
    {
      id: 'v-blk-b-02',
      valveTag: 'VALVE-BLK-B2',
      location: 'Block B Floor 2 Utility Closet',
      nodeId: 'node-blk-b-02',
      status: 'OPEN',
      autoShutoffEnabled: true,
      lastActuated: '2h ago',
      responseLatencyMs: 120
    },
    {
      id: 'v-blk-c',
      valveTag: 'VALVE-BLK-C',
      location: 'Block C Entry Junction',
      nodeId: 'node-blk-c',
      status: 'OPEN',
      autoShutoffEnabled: false,
      lastActuated: '3d ago',
      responseLatencyMs: 310
    },
    {
      id: 'v-tank-01',
      valveTag: 'VALVE-TANK-01',
      location: 'Central Storage Outlet',
      nodeId: 'node-tank-01',
      status: 'OPEN',
      autoShutoffEnabled: true,
      lastActuated: '5h ago',
      responseLatencyMs: 160
    }
  ];

  // Micro-Pressure Fatigue History
  private pressurePoints: MicroPressurePoint[] = [];

  // Cumulated Saved Water for ESG
  private savedWaterLiters = 18360;

  constructor() {
    this.initPressureHistory();
  }

  private initPressureHistory() {
    const times = ['15:35', '15:40', '15:45', '15:50', '15:55', '16:00'];
    this.pressurePoints = times.map((t, i) => ({
      timestamp: t,
      baselinePressure: 2.8,
      measuredPressure: Number((2.8 + (i % 2 === 0 ? 0.02 : -0.01)).toFixed(2)),
      pressureGradient: 0.01,
      fatigueIndex: 12 + i * 2,
      fatigueRisk: 'NORMAL'
    }));
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

  public subscribe(listener: MultiNodeListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public setMode(mode: SimulationMode) {
    this.mode = mode;
    if (mode === 'NORMAL') {
      // Re-open all valves if normal reset
      this.valves = this.valves.map(v => ({ ...v, status: 'OPEN' }));
      this.nodes = this.nodes.map(n => ({ ...n, isIsolated: false, status: 'Normal' }));
    }
    this.notify();
  }

  public toggleValve(valveId: string) {
    this.valves = this.valves.map(v => {
      if (v.id === valveId) {
        const newStatus = v.status === 'OPEN' ? 'CLOSED' : 'OPEN';
        // Isolate target node
        this.nodes = this.nodes.map(n => {
          if (n.connectedValveId === valveId) {
            return {
              ...n,
              isIsolated: newStatus === 'CLOSED',
              flowRate: newStatus === 'CLOSED' ? 0 : 43,
              status: newStatus === 'CLOSED' ? 'Normal' : n.status
            };
          }
          return n;
        });
        return {
          ...v,
          status: newStatus,
          lastActuated: 'Just now'
        };
      }
      return v;
    });
    this.notify();
  }

  public emergencyIsolate(nodeId: string) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node && node.connectedValveId) {
      this.toggleValve(node.connectedValveId);
    }
  }

  private tick() {
    this.tickCount++;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    // Update target node flow rates based on mode and isolation state
    this.nodes = this.nodes.map(node => {
      if (node.isIsolated) {
        return { ...node, flowRate: 0, status: 'Normal' };
      }

      if (node.id === 'node-blk-b-02') {
        if (this.mode === 'LEAK') {
          return { ...node, flowRate: 94, status: 'Critical' };
        } else if (this.mode === 'HIGH_USAGE') {
          return { ...node, flowRate: 68, status: 'Elevated' };
        } else if (this.mode === 'OVERFLOW') {
          return { ...node, flowRate: 88, status: 'Critical' };
        } else {
          const noise = Math.floor(Math.sin(this.tickCount * 0.8) * 1.5);
          return { ...node, flowRate: 43 + noise, status: 'Normal' };
        }
      }

      if (node.id === 'node-main-01') {
        const b2Flow = this.nodes.find(n => n.id === 'node-blk-b-02')?.flowRate || 43;
        const totalSubFlows = 48 + 43 + b2Flow + 35; // A + B1 + B2 + C
        return { ...node, flowRate: totalSubFlows, status: b2Flow > 64.5 ? 'Critical' : 'Normal' };
      }

      return node;
    });

    // Calculate Differential Flow Audit (Main Inflow vs sum of Sub-meters)
    const mainInflow = this.nodes.find(n => n.id === 'node-main-01')?.flowRate || 140;
    const subSum = (this.nodes.find(n => n.id === 'node-blk-a')?.flowRate || 48) +
                   (this.nodes.find(n => n.id === 'node-blk-b-01')?.flowRate || 43) +
                   (this.nodes.find(n => n.id === 'node-blk-b-02')?.flowRate || 43) +
                   (this.nodes.find(n => n.id === 'node-blk-c')?.flowRate || 35);
    
    const diff = Math.max(0, mainInflow - subSum);

    // Micro pressure fatigue tracking
    const b2Node = this.nodes.find(n => n.id === 'node-blk-b-02');
    const isLeak = b2Node ? b2Node.flowRate > 64.5 : false;
    
    const measuredP = Number((2.8 - (isLeak ? 0.45 : 0.02 * Math.sin(this.tickCount * 0.5))).toFixed(2));
    const grad = Number((isLeak ? 0.14 : 0.01).toFixed(2));
    const fatigueIdx = isLeak ? Math.min(96, 45 + (this.tickCount % 50)) : 14;

    const newPPoint: MicroPressurePoint = {
      timestamp: timeStr,
      baselinePressure: 2.8,
      measuredPressure: measuredP,
      pressureGradient: grad,
      fatigueIndex: fatigueIdx,
      fatigueRisk: isLeak ? 'CRITICAL_FATIGUE' : fatigueIdx > 35 ? 'ELEVATED' : 'NORMAL'
    };

    this.pressurePoints = [...this.pressurePoints.slice(1), newPPoint];

    if (isLeak) {
      this.savedWaterLiters += 0.85; // accumulate saved water volume from active 2.0 prevention
    }

    this.notify();
  }

  public getState(): MultiNodeState {
    const mainInflow = this.nodes.find(n => n.id === 'node-main-01')?.flowRate || 140;
    const subSum = (this.nodes.find(n => n.id === 'node-blk-a')?.flowRate || 48) +
                   (this.nodes.find(n => n.id === 'node-blk-b-01')?.flowRate || 43) +
                   (this.nodes.find(n => n.id === 'node-blk-b-02')?.flowRate || 43) +
                   (this.nodes.find(n => n.id === 'node-blk-c')?.flowRate || 35);
    
    const diff = Math.max(0, mainInflow - subSum);
    const hasDiffLeak = diff > 5;

    // ESG Conversions:
    // 1,000 L saved = 0.85 kWh saved
    // 1 kWh saved = 0.71 kg CO2e avoided
    const totalWaterSaved = Math.round(this.savedWaterLiters);
    const energyKwh = Number(((totalWaterSaved / 1000) * 0.85).toFixed(2));
    const co2Kg = Number((energyKwh * 0.71).toFixed(2));
    const financialSavings = Number(((totalWaterSaved / 1000) * 45).toFixed(2));

    const esgMetrics: EsgMetrics = {
      totalWaterSavedLiters: totalWaterSaved,
      energySavedKwh: energyKwh,
      co2AvoidedKg: co2Kg,
      financialSavingsINR: financialSavings,
      esgScoreGrade: 'A+',
      auditCompliancePct: 98.4
    };

    return {
      nodes: this.nodes,
      valves: this.valves,
      differentialLeakFlow: diff,
      hasDifferentialLeak: hasDiffLeak,
      pressurePoints: this.pressurePoints,
      esgMetrics,
      mode: this.mode
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach(l => l(state));
  }
}

export const multiNodeEngine = new MultiNodeEngine();
