import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  Award,
  LifeBuoy,
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  UserCheck
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../complaints/Badges';

export const FacultyDashboard: React.FC = () => {
  const {
    currentUser,
    subjects,
    complaints,
    setActiveTab,
    setSelectedComplaintId
  } = useApp();

  if (!currentUser) return null;

  // Find subjects taught by this faculty member
  const taughtSubjects = subjects.filter(
    (s) => s.facultyId === currentUser.id || s.facultyName === currentUser.name
  );

  // Complaints assigned to this staff member or their department
  const assignedComplaints = complaints.filter(
    (c) =>
      c.assignedStaffId === currentUser.id ||
      c.assignedDepartment.toLowerCase() === currentUser.department.toLowerCase() ||
      c.assignedDepartment.toLowerCase().includes('electrical')
  );

  const pendingComplaints = assignedComplaints.filter(
    (c) => c.status !== 'Closed' && c.status !== 'Resolved'
  );

  return (
    <div className="space-y-6">
      {/* Faculty Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-amber-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight">{currentUser.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Faculty & Departmental Staff
                </span>
              </div>
              <p className="text-xs text-amber-200 mt-1">
                Employee ID: <span className="font-mono font-semibold text-white">{currentUser.idNumber}</span> • {currentUser.designation}
              </p>
              <p className="text-xs text-slate-300">
                Department: {currentUser.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('faculty-attendance')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
            >
              Take Attendance
            </button>
            <button
              onClick={() => setActiveTab('faculty-results')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Grade Exams
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('faculty-attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assigned Courses
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{taughtSubjects.length || 2}</div>
          <p className="text-xs text-slate-500 mt-1">CS403 Computer Networks, CS402</p>
          <p className="text-[11px] text-blue-600 font-semibold mt-3 group-hover:underline flex items-center">
            Mark Session Attendance <ArrowRight className="w-3 h-3 ml-1" />
          </p>
        </div>

        <div
          onClick={() => setActiveTab('complaints')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pending Work Orders
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <LifeBuoy className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-600">{pendingComplaints.length}</div>
          <p className="text-xs text-slate-500 mt-1">
            {assignedComplaints.length} total department tickets
          </p>
          <p className="text-[11px] text-amber-700 font-semibold mt-3 group-hover:underline flex items-center">
            Open Work Order Queue <ArrowRight className="w-3 h-3 ml-1" />
          </p>
        </div>

        <div
          onClick={() => setActiveTab('faculty-results')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Grading Status
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">Mid-Term</div>
          <p className="text-xs text-slate-500 mt-1">Evaluation & Marks Entry Open</p>
          <p className="text-[11px] text-purple-600 font-semibold mt-3 group-hover:underline flex items-center">
            Enter Student Marks <ArrowRight className="w-3 h-3 ml-1" />
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              SLA Compliance
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">94.2%</div>
          <p className="text-xs text-slate-500 mt-1">Repairs completed within target window</p>
        </div>
      </div>

      {/* Assigned Complaints / Work Orders Preview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <LifeBuoy className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">
              High Priority Maintenance Work Orders
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('complaints')}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800"
          >
            View All Assigned ({assignedComplaints.length})
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {assignedComplaints.slice(0, 4).map((cmp) => (
            <div
              key={cmp.id}
              onClick={() => {
                setSelectedComplaintId(cmp.id);
                setActiveTab('complaints');
              }}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 px-3 rounded-xl transition-colors cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-blue-700 font-mono">{cmp.id}</span>
                  <PriorityBadge priority={cmp.priority} isSafetyHazard={cmp.isSafetyHazard} />
                  <StatusBadge status={cmp.status} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">{cmp.title}</h4>
                <p className="text-xs text-slate-500">
                  Location: <strong>{cmp.location}</strong> • Due: {cmp.dueDate} • Reported by {cmp.reporterName}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 whitespace-nowrap">
                  Update Work Order
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
