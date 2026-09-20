import { telemetryEngine } from './telemetryEngine';
import { 
  BuildingInfo, 
  TelemetryPoint, 
  AlertItem, 
  TicketItem, 
  SystemMetrics, 
  AIAnalysis, 
  SimulationMode 
} from '../types';
import { 
  HISTORICAL_TELEMETRY_6H, 
  HISTORICAL_TELEMETRY_24H, 
  HISTORICAL_TELEMETRY_7D 
} from './mockData';

export class TelemetryService {
  public static getMetrics(): SystemMetrics {
    return telemetryEngine.getState().metrics;
  }

  public static getBuildings(): BuildingInfo[] {
    return telemetryEngine.getState().buildings;
  }

  public static getTelemetryHistory(): TelemetryPoint[] {
    return telemetryEngine.getState().telemetryHistory;
  }

  public static getTelemetryHistoryForRange(range: '1h' | '6h' | '24h' | '7d'): TelemetryPoint[] {
    switch (range) {
      case '1h':
        return telemetryEngine.getState().telemetryHistory;
      case '6h':
        return HISTORICAL_TELEMETRY_6H;
      case '24h':
        return HISTORICAL_TELEMETRY_24H;
      case '7d':
        return HISTORICAL_TELEMETRY_7D;
      default:
        return telemetryEngine.getState().telemetryHistory;
    }
  }

  public static getAlerts(): AlertItem[] {
    return telemetryEngine.getState().alerts;
  }

  public static getTickets(): TicketItem[] {
    return telemetryEngine.getState().tickets;
  }

  public static getSimulationMode(): SimulationMode {
    return telemetryEngine.getState().mode;
  }

  public static setSimulationMode(mode: SimulationMode): void {
    telemetryEngine.setMode(mode);
  }

  public static createNextTicket(): TicketItem {
    return telemetryEngine.createNextTicket();
  }

  public static updateTicketStatus(ticketId: string, status: TicketItem['status']): void {
    telemetryEngine.updateTicketStatus(ticketId, status);
  }

  public static getLatestTelemetry(): TelemetryPoint {
    return telemetryEngine.getState().latestTelemetry;
  }

  public static getAIAnalysis(): AIAnalysis {
    return telemetryEngine.getState().aiAnalysis;
  }
}
