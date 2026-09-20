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
  MicroPressurePoint,
  EsgMetrics
} from './types';
import { telemetryEngine } from './services/telemetryEngine';
import { TelemetryService } from './services/telemetryService';
import { multiNodeEngine, MultiNodeState } from './services/multiNodeEngine';
import { V2Navbar } from './components/V2Navbar';
import { DemoControlBar } from './components/DemoControlBar';
import { LandingPage } from './pages/LandingPage';
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

  const handleCreateTicket = (): TicketItem => {
    return telemetryEngine.createNextTicket();
  };

  const handleUpdateTicketStatus = (ticketId: string, status: TicketItem['status']) => {
    telemetryEngine.updateTicketStatus(ticketId, status);
  };

  const activeAlertCount = alerts.filter(a => a.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans">
      
      {/* 2.0 Navigation Bar */}
      <V2Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        simulationMode={simulationMode}
        activeAlertCount={activeAlertCount}
      />

      {/* Demo Simulation Toolbar */}
      <DemoControlBar
        simulationMode={simulationMode}
        onModeChange={handleModeChange}
        onReset={handleReset}
      />

      {/* Main Page Render */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
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
            onNavigate={setCurrentPage}
            onToggleValve={handleToggleValve}
            onSimulateLeak={() => handleModeChange('LEAK')}
          />
        )}

        {currentPage === 'topology' && (
          <TopologyPage
            nodes={multiNodeState.nodes}
            valves={multiNodeState.valves}
            onToggleValve={handleToggleValve}
            differentialLeakFlow={multiNodeState.differentialLeakFlow}
            hasDifferentialLeak={multiNodeState.hasDifferentialLeak}
          />
        )}

        {currentPage === 'valves' && (
          <ValvesPage
            valves={multiNodeState.valves}
            onToggleValve={handleToggleValve}
          />
        )}

        {currentPage === 'predictive' && (
          <PredictiveAiPage
            pressurePoints={multiNodeState.pressurePoints}
          />
        )}

        {currentPage === 'esg' && (
          <EsgPage
            esgMetrics={multiNodeState.esgMetrics}
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
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'analytics' && (
          <AnalyticsPage />
        )}

        {currentPage === 'tickets' && (
          <TicketsPage
            tickets={tickets}
            onCreateTicket={(ticket) => {
              telemetryEngine.createNextTicket();
            }}
            onUpdateStatus={handleUpdateTicketStatus}
          />
        )}

        {currentPage === 'settings' && (
          <SettingsPage />
        )}
      </main>

    </div>
  );
}
export default App;
