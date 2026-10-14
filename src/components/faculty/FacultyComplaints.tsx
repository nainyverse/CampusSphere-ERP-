import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LifeBuoy,
  Search,
  Wrench,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  MapPin,
  Calendar,
  ShieldAlert
} from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../complaints/Badges';
import { ComplaintDetailModal } from '../complaints/ComplaintDetailModal';

export const FacultyComplaints: React.FC = () => {
  const {
    currentUser,
    complaints,
    selectedComplaintId,
    setSelectedComplaintId
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  if (!currentUser) return null;

  // Department or person assigned
  const deptComplaints = complaints.filter(
    (c) =>
      c.assignedStaffId === currentUser.id ||
      c.assignedDepartment.toLowerCase() === currentUser.department.toLowerCase() ||
      c.assignedDepartment.toLowerCase().includes('electrical')
  );

  const filtered = deptComplaints.filter((c) => {
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Pending'
        ? c.status !== 'Closed' && c.status !== 'Resolved'
        : c.status === statusFilter;

    const matchesSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const statuses = ['All', 'Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Blocked', 'Reopened'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Assigned Work Orders & Maintenance Queue
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              {currentUser.department}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Operational service tickets dispatched to your department. Open work orders to log progress, capture work order evidence, and complete resolutions.
          </p>
        </div>
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
                  ? 'bg-amber-600 text-white shadow-xs'
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
            placeholder="Search work orders..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Work Orders List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
            No work orders matching this filter.
          </div>
        ) : (
          filtered.map((cmp) => {
            const isTargetDemo = cmp.id === 'CMP-1042';
            return (
              <div
                key={cmp.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isTargetDemo
                    ? 'border-amber-400 shadow-md ring-2 ring-amber-100'
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="text-sm font-extrabold text-amber-700 font-mono">
                          {cmp.id}
                        </span>
                        <PriorityBadge priority={cmp.priority} isSafetyHazard={cmp.isSafetyHazard} />
                        <StatusBadge status={cmp.status} />
                        <span className="text-xs text-slate-400">• {cmp.category}</span>
                        {isTargetDemo && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                            Presentation Target
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{cmp.title}</h3>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-800">{cmp.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Due Date: <strong>{cmp.dueDate}</strong></span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>Reported by: {cmp.reporterName} ({cmp.reporterRole})</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-start md:self-center">
                      <button
                        onClick={() => setSelectedComplaintId(cmp.id)}
                        className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-500 text-white flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Manage & Resolve</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {cmp.description}
                  </p>

                  {cmp.resolutionNotes && (
                    <div className="mt-3 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                      <strong>Resolution Filed:</strong> {cmp.resolutionNotes}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

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
