import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  Award,
  LifeBuoy,
  Calendar,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  Megaphone,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { ComplaintModal } from '../complaints/ComplaintModal';
import { PriorityBadge, StatusBadge } from '../complaints/Badges';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    getStudentAttendanceSummary,
    getStudentResults,
    complaints,
    announcements,
    timetable,
    setActiveTab,
    setSelectedComplaintId
  } = useApp();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  if (!currentUser) return null;

  const attendanceSummary = getStudentAttendanceSummary(currentUser.id);
  const resultsSummary = getStudentResults(currentUser.id);

  const studentComplaints = complaints.filter((c) => c.reporterId === currentUser.id);
  const activeComplaints = studentComplaints.filter((c) => c.status !== 'Closed');
  const resolvedAwaitingConfirmation = studentComplaints.filter((c) => c.status === 'Resolved');

  // Upcoming classes today (Monday/Tuesday sample)
  const todayClasses = timetable.filter((t) => t.day === 'Monday').slice(0, 3);
  const recentNotices = announcements.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Student Welcome Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-blue-900/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight">{currentUser.name}</h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Enrolled • Active
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-1">
                Student ID: <span className="font-mono font-semibold text-white">{currentUser.idNumber}</span> • {currentUser.department}
              </p>
              <p className="text-xs text-slate-300">
                Semester {currentUser.semester || 4} • Batch {currentUser.batch || '2023-2027'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold tracking-wide shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Campus Issue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Banner if resolved complaints await verification */}
      {resolvedAwaitingConfirmation.length > 0 && (
        <div className="bg-blue-50 border-2 border-blue-400/60 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-900">
                Action Required: {resolvedAwaitingConfirmation.length} Issue(s) Marked Resolved
              </h4>
              <p className="text-xs text-blue-700">
                Staff has completed maintenance work. Please verify the physical fix and confirm closure or reopen ticket.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedComplaintId(resolvedAwaitingConfirmation[0].id);
              setActiveTab('complaints');
            }}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
          >
            Review Fix Now
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance Card */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Overall Attendance
            </span>
            <div
              className={`p-2 rounded-xl ${
                attendanceSummary.overallPercentage < 75
                  ? 'bg-red-50 text-red-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {attendanceSummary.overallPercentage}%
            </span>
            <span className="text-xs text-slate-500">
              ({attendanceSummary.totalAttended}/{attendanceSummary.totalClasses} sessions)
            </span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full ${
                  attendanceSummary.overallPercentage < 75 ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, attendanceSummary.overallPercentage)}%` }}
              />
            </div>
          </div>
          {attendanceSummary.lowAttendanceCount > 0 ? (
            <p className="text-[11px] font-semibold text-red-600 mt-2 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{attendanceSummary.lowAttendanceCount} course below 75% limit</span>
            </p>
          ) : (
            <p className="text-[11px] text-emerald-600 mt-2">Requirement satisfied (&gt;75%)</p>
          )}
        </div>

        {/* CGPA / Examination Results Card */}
        <div
          onClick={() => setActiveTab('results')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cumulative CGPA
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">{resultsSummary.cgpa}</span>
            <span className="text-xs text-slate-500">/ 10.0 scale</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
            <span>Overall Score: <strong>{resultsSummary.percentage}%</strong></span>
            <span className="text-blue-600 font-semibold group-hover:underline flex items-center">
              View Grades <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Credits Earned: {resultsSummary.earnedCredits}/{resultsSummary.totalCredits}
          </p>
        </div>

        {/* Complaints Tracker Card */}
        <div
          onClick={() => setActiveTab('complaints')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              My Complaints
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <LifeBuoy className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {activeComplaints.length}
            </span>
            <span className="text-xs text-slate-500">active open tickets</span>
          </div>
          <div className="mt-3 flex items-center space-x-2 text-xs text-slate-500">
            <span>Total logged: {studentComplaints.length}</span>
            <span>•</span>
            <span className="text-emerald-600 font-medium">
              {studentComplaints.filter((c) => c.status === 'Closed').length} closed
            </span>
          </div>
          <p className="text-[11px] text-purple-600 font-semibold mt-2 group-hover:underline flex items-center">
            Open complaint console <ArrowRight className="w-3 h-3 ml-0.5" />
          </p>
        </div>

        {/* Schedule & Classes */}
        <div
          onClick={() => setActiveTab('timetable')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Today's Schedule
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {todayClasses.length}
            </span>
            <span className="text-xs text-slate-500">scheduled lectures</span>
          </div>
          <p className="text-xs text-slate-600 mt-3 truncate">
            Next: {todayClasses[0]?.subjectName || 'No more lectures today'}
          </p>
          <p className="text-[11px] text-amber-700 font-semibold mt-2 group-hover:underline flex items-center">
            View full weekly timetable <ArrowRight className="w-3 h-3 ml-0.5" />
          </p>
        </div>
      </div>

      {/* Two Column Layout: Active Complaints & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Campus Issues / Complaints */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <LifeBuoy className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">My Maintenance & Campus Tickets</h3>
            </div>
            <button
              onClick={() => setActiveTab('complaints')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View All ({studentComplaints.length})
            </button>
          </div>

          {studentComplaints.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No complaints logged yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {studentComplaints.slice(0, 3).map((cmp) => (
                <div
                  key={cmp.id}
                  onClick={() => {
                    setSelectedComplaintId(cmp.id);
                    setActiveTab('complaints');
                  }}
                  className="py-3 flex items-start justify-between cursor-pointer hover:bg-slate-50 px-2 rounded-lg transition-colors"
                >
                  <div className="pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-blue-600 font-mono">{cmp.id}</span>
                      <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{cmp.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {cmp.location} • {cmp.category}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                    <StatusBadge status={cmp.status} />
                    <span className="text-[10px] text-slate-400">
                      {new Date(cmp.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Campus Announcements */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Megaphone className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Campus Notices & Circulars</h3>
            </div>
            <button
              onClick={() => setActiveTab('announcements')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              All Notices
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentNotices.map((anc) => (
              <div key={anc.id} className="py-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {anc.category}
                  </span>
                  <span className="text-[10px] text-slate-400">{anc.date}</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-800 mt-1">{anc.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{anc.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Complaint Modal */}
      <ComplaintModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSuccess={(newId) => {
          setSelectedComplaintId(newId);
          setActiveTab('complaints');
        }}
      />
    </div>
  );
};
