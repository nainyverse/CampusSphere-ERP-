import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LifeBuoy,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  AlertTriangle,
  Building,
  Calendar,
  Clock,
  Eye,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  Plus
} from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../complaints/Badges';
import { ComplaintDetailModal } from '../complaints/ComplaintDetailModal';
import { ComplaintModal } from '../complaints/ComplaintModal';
import { ComplaintPriority, ComplaintStatus } from '../../types';

export const AdminComplaints: React.FC = () => {
  const {
    complaints,
    selectedComplaintId,
    setSelectedComplaintId,
    exportComplaintsCSV
  } = useApp();

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority' | 'dueSoonest'>('newest');
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);

  const departments = [
    'All',
    'Electrical Maintenance',
    'Campus IT & Networks',
    'Estate & Facilities',
    'Housekeeping & Sanitation',
    'Plumbing & Water Works',
    'Lab Technical Operations',
    'Central Library Services'
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter & Sort
  const filtered = complaints.filter((c) => {
    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Open'
        ? c.status !== 'Closed' && c.status !== 'Resolved'
        : statusFilter === 'Overdue'
        ? c.dueDate < todayStr && c.status !== 'Resolved' && c.status !== 'Closed'
        : c.status === statusFilter;

    const matchesDept = deptFilter === 'All' || c.assignedDepartment === deptFilter;

    const matchesSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.reporterName.toLowerCase().includes(search.toLowerCase());

    return matchesPriority && matchesStatus && matchesDept && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'dueSoonest') {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortBy === 'priority') {
      const pWeights = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      return (pWeights[b.priority] || 0) - (pWeights[a.priority] || 0);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header & CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Institutional Complaint Administration
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Centralized triage console. Assign departments, allocate technicians, override priority scores, and audit SLA completion times.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={() => setIsNewComplaintOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Ticket</span>
          </button>
          <button
            onClick={() => exportComplaintsCSV(sorted)}
            className="inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, title, room..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Priority */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical Only</option>
              <option value="High">High Only</option>
              <option value="Medium">Medium Only</option>
              <option value="Low">Low Only</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
            >
              <option value="All">All Statuses</option>
              <option value="Open">All Open (Active)</option>
              <option value="Submitted">Submitted (Needs Triage)</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Overdue">Overdue SLA</option>
              <option value="Reopened">Reopened</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white truncate"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="priority">Sort: Highest Priority</option>
              <option value="dueSoonest">Sort: SLA Due Soonest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            Filtered Tickets ({sorted.length} records)
          </span>
          <span className="text-xs text-slate-500">Click any row to triage & reassign</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4 min-w-[200px]">Issue Title & Location</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Responsible Dept</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-slate-400">
                    No complaints match the specified query filters.
                  </td>
                </tr>
              ) : (
                sorted.map((cmp) => {
                  const isOverdue =
                    cmp.dueDate < todayStr &&
                    cmp.status !== 'Resolved' &&
                    cmp.status !== 'Closed';

                  return (
                    <tr
                      key={cmp.id}
                      onClick={() => setSelectedComplaintId(cmp.id)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                        {cmp.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 line-clamp-1">{cmp.title}</div>
                        <div className="text-[11px] text-slate-500">{cmp.location}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{cmp.category}</td>
                      <td className="py-3.5 px-4">
                        <PriorityBadge priority={cmp.priority} isSafetyHazard={cmp.isSafetyHazard} />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={cmp.status} />
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {cmp.assignedDepartment}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className={isOverdue ? 'text-red-600 font-bold' : 'text-slate-700'}>
                          {cmp.dueDate}
                        </span>
                        {isOverdue && (
                          <span className="block text-[10px] text-red-500 font-bold uppercase">
                            Overdue
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedComplaintId(cmp.id);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                        >
                          Manage & Assign
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Complaint Modal */}
      <ComplaintModal
        isOpen={isNewComplaintOpen}
        onClose={() => setIsNewComplaintOpen(false)}
        onSuccess={(id) => setSelectedComplaintId(id)}
      />

      {/* Detail & Action Modal */}
      {selectedComplaintId && (
        <ComplaintDetailModal
          complaintId={selectedComplaintId}
          onClose={() => setSelectedComplaintId(null)}
        />
      )}
    </div>
  );
};
