import React, { useState } from 'react';
import { TicketItem, TicketStatus, TicketPriority } from '../types';
import { Wrench, Plus, CheckCircle2, Clock, AlertTriangle, User, MapPin, X, ArrowRight, ShieldAlert } from 'lucide-react';

interface TicketsPageProps {
  tickets: TicketItem[];
  onCreateTicket: (ticket: TicketItem) => void;
  onUpdateStatus: (ticketId: string, status: TicketStatus) => void;
}

export const TicketsPage: React.FC<TicketsPageProps> = ({ tickets, onCreateTicket, onUpdateStatus }) => {
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New ticket form state
  const [newLocation, setNewLocation] = useState<string>('Block B — Floor 2');
  const [newIssue, setNewIssue] = useState<string>('Possible continuous pipe leak detected');
  const [newPriority, setNewPriority] = useState<TicketPriority>('HIGH');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: TicketItem = {
      id: `t-${Date.now().toString().slice(-4)}`,
      ticketNumber: `Ticket #${Math.floor(106 + Math.random() * 900)}`,
      location: newLocation,
      issue: newIssue,
      priority: newPriority,
      status: 'OPEN',
      estimatedLoss: '18,360 L / 6 hours',
      createdAt: 'Just now',
      assignee: 'Unassigned',
      description: 'Manually created maintenance work order via AquaSentinel management portal.',
      buildingId: 'block-b',
    };
    onCreateTicket(created);
    setShowCreateModal(false);
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">LOW</span>;
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Open</span>;
      case 'ASSIGNED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">Assigned</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">In Progress</span>;
      case 'RESOLVED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Resolved</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
            <Wrench className="w-7 h-7 text-cyan-400" />
            <span>Maintenance Ticket Dispatch</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Automated plumbing work orders triggered by AI anomaly detection.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-md transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Create Manual Ticket</span>
        </button>
      </div>

      {/* TICKETS BOARD / TABLE */}
      {tickets.length === 0 ? (
        <div className="bg-slate-900/60 rounded-xl p-12 text-center border border-slate-800 text-slate-400">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-200">No maintenance tickets created yet</p>
          <p className="text-xs text-slate-500 mt-1">Trigger a leak simulation on the Dashboard to auto-generate a ticket.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((t) => (
            <div 
              key={t.id}
              className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all shadow-md"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-base font-extrabold text-cyan-400">{t.ticketNumber}</span>
                    {getPriorityBadge(t.priority)}
                  </div>
                  {getStatusBadge(t.status)}
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center space-x-2 text-slate-200">
                    <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span className="font-bold">{t.location}</span>
                  </div>

                  <p className="text-slate-300 text-xs font-medium">{t.issue}</p>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                    <div className="text-slate-400 text-[11px] uppercase font-semibold">Diagnostic Summary</div>
                    <p className="text-slate-300 text-xs leading-relaxed">{t.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Projected Loss</span>
                      <span className="font-mono font-bold text-rose-400 text-xs">{t.estimatedLoss}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">Technician Assigned</span>
                      <span className="font-semibold text-slate-200 text-xs truncate block">{t.assignee || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">Created: {t.createdAt}</span>
                <button
                  onClick={() => setSelectedTicket(t)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-semibold text-xs border border-slate-700"
                >
                  Manage Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TICKET DETAIL MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 relative shadow-2xl">
            <button 
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <span className="font-mono text-lg font-extrabold text-cyan-400">{selectedTicket.ticketNumber}</span>
              {getStatusBadge(selectedTicket.status)}
              {getPriorityBadge(selectedTicket.priority)}
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 text-xs block uppercase">Location</span>
                <span className="font-bold text-white text-base">{selectedTicket.location}</span>
              </div>

              <div>
                <span className="text-slate-400 text-xs block uppercase">Issue</span>
                <span className="text-slate-200">{selectedTicket.issue}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-xs block uppercase mb-1">AI Diagnostic Description</span>
                <p className="text-slate-300 text-xs leading-relaxed">{selectedTicket.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400 block">Projected Water Loss</span>
                  <span className="font-mono font-bold text-rose-400">{selectedTicket.estimatedLoss}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400 block">Assigned Technician</span>
                  <span className="font-semibold text-slate-200">{selectedTicket.assignee || 'Unassigned'}</span>
                </div>
              </div>

              {/* Status Updater */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-400 block mb-2 font-semibold">Update Ticket Status:</span>
                <div className="flex flex-wrap gap-2">
                  {(['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateStatus(selectedTicket.id, st);
                        setSelectedTicket({ ...selectedTicket, status: st });
                      }}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                        selectedTicket.status === st
                          ? 'bg-cyan-500 text-white font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CREATE MANUAL TICKET MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <form onSubmit={handleCreateSubmit} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 relative shadow-2xl">
            <button 
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
              Create Maintenance Work Order
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1">Facility Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1">Issue Description</label>
                <input
                  type="text"
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as TicketPriority)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-cyan-500"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-white shadow-md shadow-cyan-500/20"
                >
                  Create Work Order
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
