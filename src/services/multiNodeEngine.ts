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
  leakPrevented: boolean;
}

export type MultiNodeListener = (state: MultiNodeState) => void;

class MultiNodeEngine {
  private mode: SimulationMode = 'NORMAL';
  private tickCount = 0;
  private listeners: Set<MultiNodeListener> = new Set();
  private timerId: number | null = null;
  private leakPrevented = false;

  // 6 Campus Mesh Nodes
  private nodes: MeshNodeInfo[] = [
    {
      id: 'node-main-01',
      name: 'Main Inflow Supply Meter (Campus Gate)',
      type: 'MAIN_INFLOW',
      buildingId: 'campus-main',
      flowRate: 169,
      expectedFlow: 169,
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
      flowRate: 169,
      expectedFlow: 169,
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

  // Cumulated Saved Water for ESG (starts at 0 in baseline)
  private savedWaterLiters = 0;

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
      // Re-open all valves if normal reset and reset saved water to baseline 0
      this.valves = this.valves.map(v => ({ ...v, status: 'OPEN' }));
      this.nodes = this.nodes.map(n => ({ ...n, isIsolated: false, status: 'Normal', flowRate: n.expectedFlow }));
      this.savedWaterLiters = 0;
      this.leakPrevented = false;
    }
    this.notify();
  }

  public toggleValve(valveId: string) {
    let wasLeakActive = this.mode === 'LEAK' || this.mode === 'OVERFLOW';

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

        // If target valve is closed during leak, mark leak as prevented & set saved water to 18,360 L
        if (newStatus === 'CLOSED' && (wasLeakActive || valveId === 'v-blk-b-02')) {
          this.savedWaterLiters = 18360; // 6h prevented water loss volume
          this.leakPrevented = true;
        }

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
          return { ...node, flowRate: 43, status: 'Normal' };
        }
      }

      return node;
    });

    // Calculate sum of active sub-node outflows
    const b2Node = this.nodes.find(n => n.id === 'node-blk-b-02');
    const isB2Isolated = b2Node?.isIsolated || false;
    const b2Flow = b2Node?.flowRate || 43;

    const actualTotalFlow = (this.nodes.find(n => n.id === 'node-blk-a')?.flowRate || 48) +
                            (this.nodes.find(n => n.id === 'node-blk-b-01')?.flowRate || 43) +
                            b2Flow +
                            (this.nodes.find(n => n.id === 'node-blk-c')?.flowRate || 35);

    // Update main inflow node & reservoir node to equal total campus inflow
    this.nodes = this.nodes.map(node => {
      if (node.id === 'node-main-01' || node.id === 'node-tank-01') {
        return { 
          ...node, 
          flowRate: actualTotalFlow, 
          status: b2Flow > 64.5 && !isB2Isolated ? 'Critical' : 'Normal' 
        };
      }
      return node;
    });

    // Micro pressure fatigue tracking
    const isLeak = b2Node ? (b2Node.flowRate > 64.5 && !b2Node.isIsolated) : false;
    
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

    this.notify();
  }

  public getState(): MultiNodeState {
    const b2Node = this.nodes.find(n => n.id === 'node-blk-b-02');
    const isB2Isolated = b2Node?.isIsolated || false;

    // Actual Main Inflow (at campus gate)
    const mainInflow = this.nodes.find(n => n.id === 'node-main-01')?.flowRate || 169;

    // Normal Accounted Sub-node Consumption (expected meters)
    // If B2 is isolated: 48 + 43 + 0 + 35 = 126
    // If B2 is normal or leaking: 48 + 43 + 43 + 35 = 169
    const accountedFlow = isB2Isolated 
      ? (48 + 43 + 0 + 35) 
      : (48 + 43 + 43 + 35);

    // UNACCOUNTED WATER = max(0, MAIN INFLOW - ACCOUNTED FLOW)
    // In NORMAL mode: 169 - 169 = 0 L/min (Option A exact match!)
    // In LEAK mode: 220 - 169 = 51 L/min (clearly significant differential leak!)
    // In ISOLATED mode: 126 - 126 = 0 L/min (converged!)
    const diff = Math.max(0, mainInflow - accountedFlow);
    const hasDiffLeak = diff > 5;

    // ESG Conversions:
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
      mode: this.mode,
      leakPrevented: this.leakPrevented
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach(l => l(state));
  }
}

export const multiNodeEngine = new MultiNodeEngine();
