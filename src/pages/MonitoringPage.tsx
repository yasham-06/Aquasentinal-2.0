import React, { useState } from 'react';
import { BuildingInfo, TelemetryPoint } from '../types';
import { Building2, Gauge, Thermometer, Droplet, Activity, Radio } from 'lucide-react';

interface MonitoringPageProps {
  buildings: BuildingInfo[];
  latestTelemetry: TelemetryPoint;
}

export const MonitoringPage: React.FC<MonitoringPageProps> = ({ buildings, latestTelemetry }) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('block-b');

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId) || buildings[0];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="bg-[#0D1B2A] p-5 rounded-lg border border-[#243B53]">
        <div className="flex items-center space-x-2 text-[#22D3EE] font-mono text-xs font-semibold uppercase tracking-wider mb-1">
          <Activity className="w-4 h-4 text-[#22D3EE]" />
          <span>Telemetry Stream Visualizer</span>
        </div>
        <h1 className="text-xl font-bold text-[#F1F5F9]">Sensor Network Monitoring</h1>
        <p className="text-[#94A3B8] text-xs mt-0.5">
          Detailed node-level sensor telemetry feeds and interactive campus spatial map.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Column: Node Selector & Spatial Map */}
        <div className="bg-[#0D1B2A] rounded-lg p-4 border border-[#243B53] space-y-3">
          <h2 className="text-sm font-bold text-[#F1F5F9] flex items-center space-x-2 border-b border-[#243B53] pb-2">
            <Building2 className="w-4 h-4 text-[#22D3EE]" />
            <span>Select Sensor Node</span>
          </h2>

          <div className="space-y-2 font-mono text-xs">
            {buildings.map((b) => {
              const isSelected = b.id === selectedBuildingId;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBuildingId(b.id)}
                  className={`w-full text-left p-3 rounded border transition-all flex items-center justify-between ${
                    isSelected 
                      ? 'bg-[#13263A] border-[#22D3EE]/40 text-[#22D3EE] font-bold' 
                      : 'bg-[#07111F] border-[#243B53] text-[#94A3B8] hover:text-[#F1F5F9]'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[#F1F5F9] font-bold">{b.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                        b.status === 'Critical' ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40' :
                        b.status === 'Elevated' ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40' :
                        'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">{b.locationDescription}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-[#22D3EE] block">
                      {b.id === 'block-b' ? latestTelemetry.actualFlow : b.flowRate} L/min
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">Tank: {b.tankLevel}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Map Grid */}
          <div className="mt-4 p-3 rounded bg-[#07111F] border border-[#243B53] text-center font-mono">
            <div className="text-[10px] text-[#22D3EE] uppercase tracking-wider mb-2 flex items-center justify-center space-x-1 font-bold">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Campus Node Matrix</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 p-2">
              {buildings.map((b) => (
                <div 
                  key={b.id}
                  onClick={() => setSelectedBuildingId(b.id)}
                  className={`p-2 rounded border cursor-pointer text-center text-xs font-bold transition-all ${
                    b.id === selectedBuildingId ? 'border-[#22D3EE] bg-[#13263A]' : 'bg-[#0D1B2A] border-[#243B53]'
                  } ${
                    b.status === 'Critical' ? 'text-[#EF4444]' : 'text-[#F1F5F9]'
                  }`}
                >
                  <div>{b.name}</div>
                  <div className="text-[10px] text-[#94A3B8]">
                    {b.id === 'block-b' ? latestTelemetry.actualFlow : b.flowRate} L/m
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Gauges */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="bg-[#0D1B2A] rounded-lg p-5 border border-[#243B53] space-y-4">
            <div className="flex items-center justify-between border-b border-[#243B53] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#F1F5F9]">
                  {selectedBuilding.name} — Sensor Readings
                </h2>
                <p className="text-xs text-[#94A3B8]">{selectedBuilding.locationDescription}</p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#13263A] text-[#22D3EE] border border-[#243B53]">
                NODE #SN-{selectedBuilding.id.toUpperCase()}
              </span>
            </div>

            {/* Gauges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
              
              <div className="bg-[#07111F] p-4 rounded border border-[#243B53]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[#94A3B8] uppercase">Flow Rate</span>
                  <Activity className="w-3.5 h-3.5 text-[#22D3EE]" />
                </div>
                <div className="text-2xl font-bold text-[#22D3EE]">
                  {selectedBuilding.id === 'block-b' ? latestTelemetry.actualFlow : selectedBuilding.flowRate}
                  <span className="text-xs text-[#94A3B8] font-normal ml-1">L/min</span>
                </div>
                <div className="text-[10px] text-[#94A3B8] mt-1">
                  Expected Baseline: {selectedBuilding.expectedFlow} L/min
                </div>
              </div>

              <div className="bg-[#07111F] p-4 rounded border border-[#243B53]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[#94A3B8] uppercase">Line Pressure</span>
                  <Gauge className="w-3.5 h-3.5 text-[#0EA5E9]" />
                </div>
                <div className="text-2xl font-bold text-[#F1F5F9]">
                  {selectedBuilding.id === 'block-b' ? latestTelemetry.pressure : selectedBuilding.pressure}
                  <span className="text-xs text-[#94A3B8] font-normal ml-1">bar</span>
                </div>
                <div className="text-[10px] text-[#94A3B8] mt-1">
                  Window: 2.5 - 3.2 bar
                </div>
              </div>

              <div className="bg-[#07111F] p-4 rounded border border-[#243B53]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[#94A3B8] uppercase">Tank Level</span>
                  <Droplet className="w-3.5 h-3.5 text-[#0EA5E9]" />
                </div>
                <div className="text-2xl font-bold text-[#F1F5F9]">
                  {selectedBuilding.id === 'block-b' ? latestTelemetry.tankLevel : selectedBuilding.tankLevel}%
                </div>
                <div className="w-full bg-[#13263A] h-1.5 rounded overflow-hidden mt-2">
                  <div 
                    className="bg-[#22D3EE] h-full transition-all"
                    style={{ width: `${selectedBuilding.id === 'block-b' ? latestTelemetry.tankLevel : selectedBuilding.tankLevel}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-[#07111F] p-4 rounded border border-[#243B53]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-[#94A3B8] uppercase">Temperature</span>
                  <Thermometer className="w-3.5 h-3.5 text-[#F59E0B]" />
                </div>
                <div className="text-2xl font-bold text-[#F1F5F9]">
                  {latestTelemetry.temperature}°C
                </div>
                <div className="text-[10px] text-[#94A3B8] mt-1">
                  Thermal Sensor Active
                </div>
              </div>

            </div>

          </div>

          {/* Node Health Log */}
          <div className="bg-[#0D1B2A] rounded-lg p-4 border border-[#243B53]">
            <h3 className="text-xs font-mono font-bold text-[#F1F5F9] mb-2 uppercase text-[#94A3B8]">Sensor Diagnostic Log</h3>
            <div className="space-y-1.5 text-xs font-mono text-[#F1F5F9]">
              <div className="p-2 rounded bg-[#07111F] border border-[#243B53] flex justify-between">
                <span>[15:55:00] Telemetry Packet Received</span>
                <span className="text-[#22C55E]">CRC VALID</span>
              </div>
              <div className="p-2 rounded bg-[#07111F] border border-[#243B53] flex justify-between">
                <span>[15:54:30] Flow Meter Calibration Ping</span>
                <span className="text-[#22D3EE]">STATUS 200 OK</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
