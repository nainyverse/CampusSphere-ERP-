import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LifeBuoy,
  PlusCircle,
  Search,
  CheckCircle2,
  RotateCcw,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { ComplaintModal } from '../complaints/ComplaintModal';
import { ComplaintDetailModal } from '../complaints/ComplaintDetailModal';
import { PriorityBadge, StatusBadge } from '../complaints/Badges';
import { ComplaintStatus } from '../../types';

export const StudentComplaints: React.FC = () => {
  const {
    currentUser,
    complaints,
    selectedComplaintId,
    setSelectedComplaintId,
    verifyComplaintResolution,
    reopenComplaint
  } = useApp();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [reopenPromptId, setReopenPromptId] = useState<string | null>(null);
  const [reopenReasonText, setReopenReasonText] = useState('');

  if (!currentUser) return null;

  const myComplaints = complaints.filter((c) => c.reporterId === currentUser.id);

  const filtered = myComplaints.filter((c) => {
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Active'
        ? c.status !== 'Closed'
        : c.status === statusFilter;

    const matchesSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const statuses = ['All', 'Active', 'Submitted', 'In Progress', 'Resolved', 'Closed', 'Reopened'];

  return (
    <div className="space-y-6">
      {/* Header & Submit Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            My Campus Maintenance Tickets
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track submitted complaints, inspect technician progress, and verify issue resolution.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 transition-transform hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Lodge New Complaint</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket ID, title, room..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Complaints List Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400 space-y-3">
            <LifeBuoy className="w-8 h-8 mx-auto text-slate-300" />
            <p>No complaints found matching "{statusFilter}".</p>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg"
            >
              Submit Your First Ticket
            </button>
          </div>
        ) : (
          filtered.map((cmp) => {
            const isResolvedWaiting = cmp.status === 'Resolved';
            const isReopenOpen = reopenPromptId === cmp.id;

            return (
              <div
                key={cmp.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isResolvedWaiting
                    ? 'border-blue-400 shadow-md ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="text-sm font-extrabold text-blue-700 font-mono">
                          {cmp.id}
                        </span>
                        <PriorityBadge priority={cmp.priority} isSafetyHazard={cmp.isSafetyHazard} />
                        <StatusBadge status={cmp.status} />
                        <span className="text-xs text-slate-400">• {cmp.category}</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{cmp.title}</h3>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium text-slate-700">{cmp.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Submitted: {new Date(cmp.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>Target SLA: <strong>{cmp.dueDate}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-start md:self-center">
                      <button
                        onClick={() => setSelectedComplaintId(cmp.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Audit & Details</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {cmp.description}
                  </p>

                  {/* Resolution banner & verification action */}
                  {isResolvedWaiting && (
                    <div className="mt-4 p-4 rounded-xl bg-blue-50/90 border border-blue-200 space-y-2">
                      <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        <span>Staff has resolved this ticket:</span>
                      </div>
                      <p className="text-xs text-blue-800 italic">
                        "{cmp.resolutionNotes || 'Repairs finished and verified.'}"
                      </p>

                      {!isReopenOpen ? (
                        <div className="flex items-center space-x-2 pt-1">
                          <button
                            onClick={() => verifyComplaintResolution(cmp.id, true)}
                            className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirm Fixed (Close)</span>
                          </button>

                          <button
                            onClick={() => setReopenPromptId(cmp.id)}
                            className="px-3.5 py-1.5 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 border border-red-300 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Not Fixed (Reopen)</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2 pt-1">
                          <input
                            type="text"
                            value={reopenReasonText}
                            onChange={(e) => setReopenReasonText(e.target.value)}
                            placeholder="State reason why problem remains unresolved..."
                            className="w-full px-3 py-1.5 text-xs bg-white rounded border border-red-300 focus:outline-hidden"
                          />
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                if (!reopenReasonText.trim()) return;
                                reopenComplaint(cmp.id, reopenReasonText);
                                setReopenPromptId(null);
                                setReopenReasonText('');
                              }}
                              className="px-3 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded"
                            >
                              Submit Reopen
                            </button>
                            <button
                              onClick={() => setReopenPromptId(null)}
                              className="px-3 py-1 text-xs text-slate-600 hover:text-slate-800"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submission Modal */}
      <ComplaintModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSuccess={(id) => setSelectedComplaintId(id)}
      />

      {/* Detail Modal */}
      {selectedComplaintId && (
        <ComplaintDetailModal
          complaintId={selectedComplaintId}
          onClose={() => setSelectedComplaintId(null)}
        />
      )}
    </div>
  );
};
