import React, { useState } from 'react';
import { TicketItem, TicketStatus, TicketPriority } from '../types';
import { Wrench, Plus, CheckCircle2, MapPin, X } from 'lucide-react';

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
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#13263A] text-[#94A3B8] border border-[#243B53]">LOW</span>;
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40">Open</span>;
      case 'ASSIGNED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/40">Assigned</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40">In Progress</span>;
      case 'RESOLVED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40">Resolved</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D1B2A] p-5 rounded-lg border border-[#243B53]">
        <div>
          <div className="flex items-center space-x-2 text-[#22D3EE] font-mono text-xs font-semibold uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4 text-[#22D3EE]" />
            <span>Field Dispatch Engine</span>
          </div>
          <h1 className="text-xl font-bold text-[#F1F5F9]">Maintenance Work Orders</h1>
          <p className="text-[#94A3B8] text-xs mt-0.5">
            Automated plumbing work order dispatch triggered by AI anomaly detection.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-1.5 bg-[#13263A] hover:bg-[#1f3650] text-[#22D3EE] font-mono text-xs font-bold px-3.5 py-2 rounded border border-[#22D3EE]/40 transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Create Work Order</span>
        </button>
      </div>

      {/* Tickets Board */}
      {tickets.length === 0 ? (
        <div className="bg-[#0D1B2A] rounded-lg p-10 text-center border border-[#243B53] text-[#94A3B8]">
          <CheckCircle2 className="w-10 h-10 text-[#22C55E] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#F1F5F9]">No active work orders</p>
          <p className="text-xs text-[#94A3B8] font-mono mt-1">Trigger a leak simulation on the Dashboard to auto-generate a ticket.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((t) => (
            <div 
              key={t.id}
              className="bg-[#0D1B2A] rounded-lg p-4 border border-[#243B53] flex flex-col justify-between space-y-3 hover:border-[#0EA5E9]/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#243B53] pb-2.5 mb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-[#22D3EE]">{t.ticketNumber}</span>
                    {getPriorityBadge(t.priority)}
                  </div>
                  {getStatusBadge(t.status)}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-[#F1F5F9]">
                    <MapPin className="w-3.5 h-3.5 text-[#22D3EE]" />
                    <span className="font-bold">{t.location}</span>
                  </div>

                  <p className="text-[#94A3B8] text-xs">{t.issue}</p>

                  <div className="bg-[#07111F] p-2.5 rounded border border-[#243B53] text-xs space-y-1">
                    <div className="text-[#94A3B8] text-[10px] uppercase font-mono">Diagnostic Description</div>
                    <p className="text-[#F1F5F9] text-xs leading-relaxed">{t.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <div className="bg-[#07111F] p-2 rounded border border-[#243B53]">
                      <span className="text-[#94A3B8] text-[10px] block">Est. Loss</span>
                      <span className="font-bold text-[#EF4444] text-xs">{t.estimatedLoss}</span>
                    </div>
                    <div className="bg-[#07111F] p-2 rounded border border-[#243B53]">
                      <span className="text-[#94A3B8] text-[10px] block">Assignee</span>
                      <span className="font-bold text-[#F1F5F9] text-xs truncate block">{t.assignee || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#243B53] flex items-center justify-between font-mono">
                <span className="text-[10px] text-[#94A3B8]">Created: {t.createdAt}</span>
                <button
                  onClick={() => setSelectedTicket(t)}
                  className="px-2.5 py-1 rounded bg-[#13263A] hover:bg-[#1f3650] text-[#22D3EE] font-bold text-xs border border-[#243B53]"
                >
                  Manage Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0D1B2A] border border-[#243B53] rounded-lg max-w-lg w-full p-5 space-y-3 relative shadow-2xl">
            <button 
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F1F5F9] p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 border-b border-[#243B53] pb-3">
              <span className="font-mono text-base font-bold text-[#22D3EE]">{selectedTicket.ticketNumber}</span>
              {getStatusBadge(selectedTicket.status)}
              {getPriorityBadge(selectedTicket.priority)}
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#94A3B8] text-[10px] block font-mono uppercase">Location</span>
                <span className="font-bold text-[#F1F5F9] text-sm">{selectedTicket.location}</span>
              </div>

              <div>
                <span className="text-[#94A3B8] text-[10px] block font-mono uppercase">Issue</span>
                <span className="text-[#F1F5F9]">{selectedTicket.issue}</span>
              </div>

              <div className="bg-[#07111F] p-3 rounded border border-[#243B53]">
                <span className="text-[#94A3B8] text-[10px] block font-mono uppercase mb-1">AI Diagnostic Description</span>
                <p className="text-[#F1F5F9] text-xs leading-relaxed">{selectedTicket.description}</p>
              </div>

              {/* Status Updater */}
              <div className="pt-2 border-t border-[#243B53]">
                <span className="text-xs text-[#94A3B8] font-mono block mb-1.5">Update Ticket Status:</span>
                <div className="flex flex-wrap gap-1.5 font-mono">
                  {(['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateStatus(selectedTicket.id, st);
                        setSelectedTicket({ ...selectedTicket, status: st });
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                        selectedTicket.status === st
                          ? 'bg-[#22D3EE] text-[#07111F]'
                          : 'bg-[#13263A] text-[#94A3B8] border border-[#243B53] hover:text-[#F1F5F9]'
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

    </div>
  );
};
