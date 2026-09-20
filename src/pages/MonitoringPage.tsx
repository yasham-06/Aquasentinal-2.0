import React, { useState } from 'react';
import { BuildingInfo, TelemetryPoint } from '../types';
import { Building2, Gauge, Thermometer, Droplet, Activity, CheckCircle2, AlertTriangle, Radio } from 'lucide-react';

interface MonitoringPageProps {
  buildings: BuildingInfo[];
  latestTelemetry: TelemetryPoint;
}

export const MonitoringPage: React.FC<MonitoringPageProps> = ({ buildings, latestTelemetry }) => {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('block-b');

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId) || buildings[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
          <Activity className="w-7 h-7 text-cyan-400" />
          <span>Campus Sensor Network Monitoring</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Detailed node-level telemetry and interactive facility map visualizer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: BUILDING MAP & NODE LIST */}
        <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
          <h2 className="text-base font-bold text-white mb-3 flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span>Select Facility Node</span>
          </h2>

          <div className="space-y-3">
            {buildings.map((b) => {
              const isSelected = b.id === selectedBuildingId;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBuildingId(b.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected 
                      ? 'bg-slate-800 border-cyan-500 shadow-md shadow-cyan-500/10' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-base">{b.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        b.status === 'Elevated' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-emerald-950 text-emerald-300'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{b.locationDescription}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-cyan-400 block font-mono">
                      {b.id === 'block-b' ? latestTelemetry.actualFlow : b.flowRate} L/min
                    </span>
                    <span className="text-[11px] text-slate-500">Tank: {b.tankLevel}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Map Visual Box */}
          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-center space-x-1">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Campus Map View</span>
            </div>
            
            {/* Visual Floor Grid Diagram */}
            <div className="relative h-40 bg-navy-950 rounded-lg border border-slate-800 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <div className="grid grid-cols-2 gap-3 p-4 z-10 w-full">
                {buildings.map((b) => (
                  <div 
                    key={b.id}
                    onClick={() => setSelectedBuildingId(b.id)}
                    className={`p-2 rounded border cursor-pointer text-center text-xs font-bold transition-all ${
                      b.id === selectedBuildingId ? 'ring-2 ring-cyan-400' : ''
                    } ${
                      b.status === 'Critical' ? 'bg-rose-950/80 border-rose-500 text-rose-300' :
                      b.status === 'Elevated' ? 'bg-amber-950/80 border-amber-500 text-amber-300' :
                      'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div>{b.name}</div>
                    <div className="text-[10px] font-normal font-mono opacity-80">
                      {b.id === 'block-b' ? latestTelemetry.actualFlow : b.flowRate} L/m
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Interactive floor block telemetry mapping</p>
          </div>

        </div>

        {/* RIGHT COLUMN: DETAILED TELEMETRY INSTRUMENTS (2 COLS) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {selectedBuilding.name} — Node Telemetry Detail
                </h2>
                <p className="text-xs text-slate-400">{selectedBuilding.locationDescription}</p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                ACTIVE SENSOR NODE #SN-{selectedBuilding.id.toUpperCase()}
              </span>
            </div>

            {/* Gauges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Gauge 1 */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Flow Rate</span>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
                  {selectedBuilding.id === 'block-b' ? latestTelemetry.actualFlow : selectedBuilding.flowRate}
                  <span className="text-sm font-normal text-slate-400 ml-1">L/min</span>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Expected Baseline: <span className="text-slate-200 font-mono">{selectedBuilding.expectedFlow} L/min</span>
                </div>
              </div>

              {/* Gauge 2 */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Pressure</span>
                  <Gauge className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
                  {selectedBuilding.id === 'block-b' ? latestTelemetry.pressure : selectedBuilding.pressure}
                  <span className="text-sm font-normal text-slate-400 ml-1">bar</span>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Optimal Operating Window: 2.5 - 3.2 bar
                </div>
              </div>

              {/* Gauge 3 */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Overhead Tank Level</span>
                  <Droplet className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
                  {selectedBuilding.id === 'block-b' ? latestTelemetry.tankLevel : selectedBuilding.tankLevel}%
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                  <div 
                    className="bg-cyan-500 h-full transition-all duration-300"
                    style={{ width: `${selectedBuilding.id === 'block-b' ? latestTelemetry.tankLevel : selectedBuilding.tankLevel}%` }}
                  ></div>
                </div>
              </div>

              {/* Gauge 4 */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Line Temperature</span>
                  <Thermometer className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
                  {latestTelemetry.temperature}°C
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Ambient thermal drift monitored
                </div>
              </div>

            </div>

          </div>

          {/* Node Health Log */}
          <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3">Sensor Diagnostic Log</h3>
            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span>[15:55:00] Telemetry Packet Received</span>
                <span className="text-emerald-400">CRC VALID</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span>[15:54:30] Flow Meter Calibration Ping</span>
                <span className="text-cyan-400">STATUS 200 OK</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span>[15:54:00] Modbus RS-485 Gateway Connection</span>
                <span className="text-slate-400">LATENCY 12ms</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
