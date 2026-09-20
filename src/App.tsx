import React, { useState, useEffect } from 'react';
import { 
  PageType, 
  SimulationMode, 
  BuildingInfo, 
  TelemetryPoint, 
  AlertItem, 
  TicketItem, 
  SystemMetrics, 
  AIAnalysis,
  MeshNodeInfo,
  RemoteValve,
  EsgMetrics
} from './types';
import { telemetryEngine } from './services/telemetryEngine';
import { TelemetryService } from './services/telemetryService';
import { multiNodeEngine, MultiNodeState } from './services/multiNodeEngine';

// V2 Shell & Layout Components
import { V2Header } from './components/V2Header';
import { V2Sidebar } from './components/V2Sidebar';
import { V2Footer } from './components/V2Footer';
import { DemoControlBar } from './components/DemoControlBar';

// Pages
import { V2DashboardPage } from './pages/V2DashboardPage';
import { TopologyPage } from './pages/TopologyPage';
import { ValvesPage } from './pages/ValvesPage';
import { PredictiveAiPage } from './pages/PredictiveAiPage';
import { EsgPage } from './pages/EsgPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { TicketsPage } from './pages/TicketsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('NORMAL');
  const [detectTriggerCount, setDetectTriggerCount] = useState<number>(0);

  const handleNavigate = (page: PageType) => {
    if (page === 'dashboard') {
      setDetectTriggerCount(prev => prev + 1);
    }
    setCurrentPage(page);
  };

  // Core telemetry engine state
  const [metrics, setMetrics] = useState<SystemMetrics>(TelemetryService.getMetrics());
  const [buildings, setBuildings] = useState<BuildingInfo[]>(TelemetryService.getBuildings());
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>(TelemetryService.getTelemetryHistory());
  const [alerts, setAlerts] = useState<AlertItem[]>(TelemetryService.getAlerts());
  const [tickets, setTickets] = useState<TicketItem[]>(TelemetryService.getTickets());
  const [latestTelemetry, setLatestTelemetry] = useState<TelemetryPoint>(TelemetryService.getLatestTelemetry());
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>(TelemetryService.getAIAnalysis());

  // 2.0 Multi-Node Mesh State
  const [multiNodeState, setMultiNodeState] = useState<MultiNodeState>(multiNodeEngine.getState());

  // Subscribe to real-time engines
  useEffect(() => {
    telemetryEngine.start();
    multiNodeEngine.start();

    const unsubscribeTelemetry = telemetryEngine.subscribe((state) => {
      setMetrics(state.metrics);
      setBuildings(state.buildings);
      setTelemetryHistory(state.telemetryHistory);
      setAlerts(state.alerts);
      setTickets(state.tickets);
      setLatestTelemetry(state.latestTelemetry);
      setAiAnalysis(state.aiAnalysis);
      setSimulationMode(state.mode);
    });

    const unsubscribeMultiNode = multiNodeEngine.subscribe((state) => {
      setMultiNodeState(state);
    });

    return () => {
      unsubscribeTelemetry();
      unsubscribeMultiNode();
      telemetryEngine.stop();
      multiNodeEngine.stop();
    };
  }, []);

  const handleModeChange = (mode: SimulationMode) => {
    telemetryEngine.setMode(mode);
    multiNodeEngine.setMode(mode);
  };

  const handleReset = () => {
    telemetryEngine.reset();
    multiNodeEngine.setMode('NORMAL');
  };

  const handleToggleValve = (valveId: string) => {
    multiNodeEngine.toggleValve(valveId);
  };

  const handleUpdateTicketStatus = (ticketId: string, status: TicketItem['status']) => {
    telemetryEngine.updateTicketStatus(ticketId, status);
  };

  const targetValve = multiNodeState.valves.find(v => v.id === 'v-blk-b-02');
  const isTargetValveClosed = targetValve?.status === 'CLOSED';
  const isLeakActive = (simulationMode === 'LEAK' || multiNodeState.hasDifferentialLeak || multiNodeState.differentialLeakFlow > 5) && !isTargetValveClosed;
  const activeAlertCount = isLeakActive ? 1 : 0;

  return (
    <div className="min-h-screen bg-[#061421] text-[#F8FAFC] flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* 2.0 Global Header */}
      <V2Header simulationMode={simulationMode} />

      {/* Main Shell Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        
        {/* Left Vertical Sidebar */}
        <V2Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          activeAlertCount={activeAlertCount}
        />

        {/* Central Content Column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* Interactive Simulation Console Control Bar */}
          <DemoControlBar
            simulationMode={simulationMode}
            onModeChange={handleModeChange}
            onReset={handleReset}
          />

          {/* Main Working Canvas */}
          <main className="flex-1 p-5 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6">
            
            {currentPage === 'dashboard' && (
              <V2DashboardPage
                telemetryHistory={telemetryHistory}
                latestTelemetry={latestTelemetry}
                aiAnalysis={aiAnalysis}
                nodes={multiNodeState.nodes}
                valves={multiNodeState.valves}
                esgMetrics={multiNodeState.esgMetrics}
                differentialLeakFlow={multiNodeState.differentialLeakFlow}
                hasDifferentialLeak={multiNodeState.hasDifferentialLeak}
                simulationMode={simulationMode}
                onNavigate={handleNavigate}
                onToggleValve={handleToggleValve}
                onSimulateLeak={() => handleModeChange('LEAK')}
                detectTriggerCount={detectTriggerCount}
              />
            )}

            {currentPage === 'topology' && (
              <TopologyPage
                nodes={multiNodeState.nodes}
                valves={multiNodeState.valves}
                onToggleValve={handleToggleValve}
                differentialLeakFlow={multiNodeState.differentialLeakFlow}
                hasDifferentialLeak={multiNodeState.hasDifferentialLeak}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'valves' && (
              <ValvesPage
                valves={multiNodeState.valves}
                nodes={multiNodeState.nodes}
                esgMetrics={multiNodeState.esgMetrics}
                differentialLeakFlow={multiNodeState.differentialLeakFlow}
                hasDifferentialLeak={multiNodeState.hasDifferentialLeak}
                simulationMode={simulationMode}
                onToggleValve={handleToggleValve}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'predictive' && (
              <PredictiveAiPage
                pressurePoints={multiNodeState.pressurePoints}
                valves={multiNodeState.valves}
                nodes={multiNodeState.nodes}
                esgMetrics={multiNodeState.esgMetrics}
                differentialLeakFlow={multiNodeState.differentialLeakFlow}
                hasDifferentialLeak={multiNodeState.hasDifferentialLeak}
                simulationMode={simulationMode}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'esg' && (
              <EsgPage
                esgMetrics={multiNodeState.esgMetrics}
                nodes={multiNodeState.nodes}
                valves={multiNodeState.valves}
                differentialLeakFlow={multiNodeState.differentialLeakFlow}
                hasDifferentialLeak={multiNodeState.hasDifferentialLeak}
                simulationMode={simulationMode}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'monitoring' && (
              <MonitoringPage
                buildings={buildings}
                latestTelemetry={latestTelemetry}
              />
            )}

            {currentPage === 'alerts' && (
              <AlertsPage
                alerts={alerts}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'analytics' && (
              <AnalyticsPage 
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'tickets' && (
              <TicketsPage
                tickets={tickets}
                onCreateTicket={() => {
                  telemetryEngine.createNextTicket();
                }}
                onUpdateStatus={handleUpdateTicketStatus}
              />
            )}

            {currentPage === 'settings' && (
              <SettingsPage />
            )}

          </main>

          {/* Global Footer */}
          <V2Footer />

        </div>

      </div>

    </div>
  );
}
export default App;
