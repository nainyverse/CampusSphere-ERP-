import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Complaint, ComplaintPriority, ComplaintStatus } from '../../types';
import {
  X,
  Clock,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Send,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Tag,
  Wrench,
  Check,
  Building,
  MessageSquare,
  History,
  FileText
} from 'lucide-react';
import { PriorityBadge, StatusBadge } from './Badges';

const DEPARTMENTS = [
  'Electrical Maintenance',
  'Campus IT & Networks',
  'Estate & Facilities',
  'Housekeeping & Sanitation',
  'Plumbing & Water Works',
  'Lab Technical Operations',
  'Central Library Services',
  'Campus Transport Desk',
  'Academic Affairs & Registry'
];

interface ComplaintDetailModalProps {
  complaintId: string | null;
  onClose: () => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaintId,
  onClose
}) => {
  const {
    complaints,
    currentUser,
    users,
    assignComplaint,
    updateComplaintStatus,
    updateComplaintPriority,
    addComplaintComment,
    verifyComplaintResolution,
    reopenComplaint
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'details' | 'history' | 'comments'>('details');

  // Admin action state
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [overridePriority, setOverridePriority] = useState<ComplaintPriority | ''>('');
  const [customDueDate, setCustomDueDate] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [showAdminAssignForm, setShowAdminAssignForm] = useState(false);

  // Staff action state
  const [staffNextStatus, setStaffNextStatus] = useState<ComplaintStatus>('In Progress');
  const [actionTaken, setActionTaken] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [evidenceDetails, setEvidenceDetails] = useState('');
  const [staffNote, setStaffNote] = useState('');
  const [showStaffActionForm, setShowStaffActionForm] = useState(false);

  // Student verification / reopen state
  const [showReopenInput, setShowReopenInput] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [studentFeedback, setStudentFeedback] = useState('');

  // Comment input
  const [newComment, setNewComment] = useState('');

  const complaint = complaints.find((c) => c.id === complaintId);
  if (!complaint) return null;

  const role = currentUser?.role || 'student';
  const isReporter = currentUser?.id === complaint.reporterId;
  const isOverdue =
    new Date(complaint.dueDate).getTime() < new Date().setHours(0, 0, 0, 0) &&
    complaint.status !== 'Resolved' &&
    complaint.status !== 'Closed';

  const facultyStaffMembers = users.filter((u) => u.role === 'faculty');

  // Handle Admin Assign
  const handleAdminAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = selectedDept || complaint.assignedDepartment;
    assignComplaint(
      complaint.id,
      dept,
      selectedStaff || undefined,
      customDueDate || undefined,
      overridePriority ? (overridePriority as ComplaintPriority) : undefined,
      adminNote || undefined
    );
    setShowAdminAssignForm(false);
  };

  // Handle Staff Status Transition
  const handleStaffStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateComplaintStatus(
      complaint.id,
      staffNextStatus,
      staffNote || `Status updated to ${staffNextStatus}`,
      actionTaken,
      evidenceDetails,
      resolutionNotes
    );
    setShowStaffActionForm(false);
  };

  // Handle Comment
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComplaintComment(complaint.id, newComment);
    setNewComment('');
  };

  // Lifecycle steps progression
  const lifecycleSteps = ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
  const getCurrentStepIndex = () => {
    switch (complaint.status) {
      case 'Submitted':
      case 'Under Review':
        return 0;
      case 'Assigned':
        return 1;
      case 'In Progress':
        return 2;
      case 'Resolved':
        return 3;
      case 'Closed':
        return 4;
      default:
        return 1;
    }
  };
  const activeStepIdx = getCurrentStepIndex();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in duration-150 my-auto">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-base font-extrabold tracking-wider text-blue-400 font-mono">
              {complaint.id}
            </span>
            <PriorityBadge priority={complaint.priority} isSafetyHazard={complaint.isSafetyHazard} />
            <StatusBadge status={complaint.status} />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Lifecycle Progress Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {lifecycleSteps.map((step, idx) => {
              const isPastOrCurrent = idx <= activeStepIdx;
              const isExact = idx === activeStepIdx;
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isExact
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : isPastOrCurrent
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
                        isExact
                          ? 'text-blue-700 font-bold'
                          : isPastOrCurrent
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {idx < lifecycleSteps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        idx < activeStepIdx ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Reopened Alert Banner if applicable */}
        {complaint.status === 'Reopened' && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 text-xs text-red-800 flex items-center space-x-2">
            <RotateCcw className="w-4 h-4 text-red-600 flex-shrink-0 animate-spin" />
            <div>
              <strong>Ticket Reopened by Reporter:</strong>{' '}
              {complaint.reopenReason || 'Issue was not fixed properly.'}
            </div>
          </div>
        )}

        {/* Safety Alert Banner */}
        {complaint.isSafetyHazard && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 text-xs text-amber-900 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>URGENT SAFETY HAZARD:</strong> Immediate physical inspection and campus safety compliance
              monitoring required.
            </span>
          </div>
        )}

        {/* Sub-tabs: Details / Audit History / Comments */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-white text-xs font-semibold text-slate-600 flex-shrink-0">
          <button
            onClick={() => setActiveSubTab('details')}
            className={`py-3 mr-6 border-b-2 flex items-center space-x-1.5 transition-colors ${
              activeSubTab === 'details'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Ticket Details & Actions</span>
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`py-3 mr-6 border-b-2 flex items-center space-x-1.5 transition-colors ${
              activeSubTab === 'history'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit History ({complaint.statusHistory.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('comments')}
            className={`py-3 border-b-2 flex items-center space-x-1.5 transition-colors ${
              activeSubTab === 'comments'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discussion & Notes ({complaint.comments.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeSubTab === 'details' && (
            <>
              {/* Title & Core Meta */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{complaint.title}</h2>
                <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-xs text-slate-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-800">{complaint.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span>{complaint.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Reported by <strong>{complaint.reporterName}</strong> ({complaint.reporterRole})
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Created: {new Date(complaint.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Issue Description
                </h4>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {complaint.description}
                </p>
              </div>

              {/* Assignment & SLA Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Responsible Department
                  </span>
                  <div className="text-sm font-bold text-slate-800 mt-1 flex items-center space-x-1.5">
                    <Building className="w-4 h-4 text-blue-600" />
                    <span>{complaint.assignedDepartment}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Assigned Specialist:{' '}
                    <strong className="text-slate-700">
                      {complaint.assignedStaffName || 'Pending specific staff allocation'}
                    </strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Resolution SLA Due Date
                  </span>
                  <div className="text-sm font-bold text-slate-800 mt-1 flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>{complaint.dueDate}</span>
                    {isOverdue && (
                      <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold border border-red-300">
                        OVERDUE
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Last updated: {new Date(complaint.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Resolution Notes section (if resolved/closed) */}
              {complaint.resolutionNotes && (
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                  <div className="flex items-center space-x-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Official Resolution Summary
                    </h4>
                  </div>
                  <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                    {complaint.resolutionNotes}
                  </p>
                  <div className="mt-2 text-[11px] text-emerald-700">
                    Resolved by <strong>{complaint.resolvedBy}</strong> on{' '}
                    {complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleString() : 'N/A'}
                  </div>
                  {complaint.evidenceDetails && (
                    <div className="mt-1 text-[11px] text-emerald-700 italic">
                      Evidence/Work Order: {complaint.evidenceDetails}
                    </div>
                  )}
                </div>
              )}

              {/* ACTION SECTIONS: ROLE-SPECIFIC WORKFLOW */}

              {/* 1. STUDENT REPORTER VERIFICATION (When status is Resolved) */}
              {isReporter && complaint.status === 'Resolved' && (
                <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-300 space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-700" />
                    <h4 className="text-sm font-bold text-blue-900">
                      Action Required: Verify Resolution
                    </h4>
                  </div>
                  <p className="text-xs text-blue-800">
                    Staff has marked this issue as repaired. Please inspect the location ({complaint.location})
                    and confirm whether the problem is fixed or if it persists.
                  </p>

                  {!showReopenInput ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={() => verifyComplaintResolution(complaint.id, true)}
                        className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm flex items-center space-x-1.5 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span>Confirm Fixed (Close Ticket)</span>
                      </button>
                      <button
                        onClick={() => setShowReopenInput(true)}
                        className="px-4 py-2 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 border border-red-300 rounded-lg flex items-center space-x-1.5 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Issue Persists (Reopen Ticket)</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-semibold text-red-900">
                        Reason for reopening:
                      </label>
                      <input
                        type="text"
                        value={reopenReason}
                        onChange={(e) => setReopenReason(e.target.value)}
                        placeholder="e.g. Fans still turn off unexpectedly after 10 minutes..."
                        className="w-full px-3 py-1.5 text-xs rounded border border-red-300 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            if (!reopenReason.trim()) return;
                            verifyComplaintResolution(complaint.id, false, reopenReason);
                            setShowReopenInput(false);
                          }}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded"
                        >
                          Submit Reopen Request
                        </button>
                        <button
                          onClick={() => setShowReopenInput(false)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. FACULTY / STAFF ACTION PANEL */}
              {role === 'faculty' && complaint.status !== 'Closed' && (
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                      <Wrench className="w-4 h-4 text-amber-700" />
                      <span>Maintenance Staff Work Order Actions</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowStaffActionForm(!showStaffActionForm)}
                      className="text-xs font-semibold text-amber-800 hover:text-amber-900 underline"
                    >
                      {showStaffActionForm ? 'Hide Action Form' : 'Update Ticket Status / Log Progress'}
                    </button>
                  </div>

                  {showStaffActionForm && (
                    <form onSubmit={handleStaffStatusSubmit} className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-amber-900 mb-1">
                            Transition Status To:
                          </label>
                          <select
                            value={staffNextStatus}
                            onChange={(e) => setStaffNextStatus(e.target.value as ComplaintStatus)}
                            className="w-full px-3 py-1.5 text-xs rounded border border-amber-300 bg-white"
                          >
                            <option value="In Progress">In Progress (Work started)</option>
                            <option value="Resolved">Resolved (Repairs completed)</option>
                            <option value="Blocked">Blocked (Parts / Vendor required)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-amber-900 mb-1">
                            Action Taken / Technician Log:
                          </label>
                          <input
                            type="text"
                            value={actionTaken}
                            onChange={(e) => setActionTaken(e.target.value)}
                            placeholder="e.g. Rewired junction box, replaced 60W relay switch"
                            className="w-full px-3 py-1.5 text-xs rounded border border-amber-300 bg-white"
                          />
                        </div>
                      </div>

                      {staffNextStatus === 'Resolved' && (
                        <div>
                          <label className="block text-xs font-semibold text-emerald-900 mb-1">
                            Resolution Notes (Required for Resolution Verification) <span className="text-red-600">*</span>
                          </label>
                          <textarea
                            rows={2}
                            required
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            placeholder="Detailed explanation of what was fixed, testing performed, and safety sign-off..."
                            className="w-full px-3 py-1.5 text-xs rounded border border-emerald-300 bg-white"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-amber-900 mb-1">
                          Evidence / Work Order ID (Optional):
                        </label>
                        <input
                          type="text"
                          value={evidenceDetails}
                          onChange={(e) => setEvidenceDetails(e.target.value)}
                          placeholder="e.g. Work Order #EL-4912, Parts inventory code #F-02"
                          className="w-full px-3 py-1.5 text-xs rounded border border-amber-300 bg-white"
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowStaffActionForm(false)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded shadow-xs"
                        >
                          Save Update & Notify
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* 3. ADMINISTRATOR TRIAGE & ASSIGN PANEL */}
              {role === 'admin' && (
                <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-purple-950 font-bold text-sm">
                      <Building className="w-4 h-4 text-purple-700" />
                      <span>Administrative Triage & Department Assignment</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAdminAssignForm(!showAdminAssignForm)}
                      className="text-xs font-semibold text-purple-800 hover:text-purple-900 underline"
                    >
                      {showAdminAssignForm ? 'Close Assignment Tool' : 'Assign / Override Priority & SLA'}
                    </button>
                  </div>

                  {showAdminAssignForm && (
                    <form onSubmit={handleAdminAssignSubmit} className="space-y-3 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-purple-950 mb-1">
                            Responsible Department:
                          </label>
                          <select
                            value={selectedDept || complaint.assignedDepartment}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded border border-purple-300 bg-white"
                          >
                            {DEPARTMENTS.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-purple-950 mb-1">
                            Assign Specific Specialist / Staff:
                          </label>
                          <select
                            value={selectedStaff || complaint.assignedStaffId || ''}
                            onChange={(e) => setSelectedStaff(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded border border-purple-300 bg-white"
                          >
                            <option value="">-- Auto-dispatch to Dept In-Charge --</option>
                            {facultyStaffMembers.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name} ({f.department})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-purple-950 mb-1">
                            Priority Override:
                          </label>
                          <select
                            value={overridePriority || complaint.priority}
                            onChange={(e) => setOverridePriority(e.target.value as ComplaintPriority)}
                            className="w-full px-3 py-1.5 text-xs rounded border border-purple-300 bg-white"
                          >
                            <option value="Critical">Critical (Immediate safety / disruption)</option>
                            <option value="High">High (Major class / facility impact)</option>
                            <option value="Medium">Medium (Standard campus maintenance)</option>
                            <option value="Low">Low (General improvement)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-purple-950 mb-1">
                            SLA Due Date:
                          </label>
                          <input
                            type="date"
                            value={customDueDate || complaint.dueDate}
                            onChange={(e) => setCustomDueDate(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded border border-purple-300 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-purple-950 mb-1">
                          Internal Administrative Directives / Notes:
                        </label>
                        <input
                          type="text"
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                          placeholder="e.g. High exam traffic area. Coordinate repairs before 2 PM."
                          className="w-full px-3 py-1.5 text-xs rounded border border-purple-300 bg-white"
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAdminAssignForm(false)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-600 rounded shadow-xs"
                        >
                          Update Assignment & Dispatch
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </>
          )}

          {/* Audit History Tab */}
          {activeSubTab === 'history' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Complete Chronological Audit Trail
              </h4>
              <div className="relative border-l-2 border-slate-200 ml-3 space-y-6">
                {complaint.statusHistory.map((item, idx) => (
                  <div key={item.id || idx} className="relative pl-6">
                    <div className="absolute -left-2 top-0.5 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-100" />
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-800">
                        {item.fromStatus} → {item.toStatus}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Updated by <strong className="text-slate-700">{item.changedBy}</strong> (
                      <span className="capitalize">{item.changerRole}</span>)
                    </div>
                    {item.note && (
                      <p className="text-xs text-slate-700 mt-1 bg-slate-50 p-2 rounded border border-slate-200/80">
                        {item.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments & Discussion Tab */}
          {activeSubTab === 'comments' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {complaint.comments.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-400">
                    No comments or field notes added yet.
                  </div>
                ) : (
                  complaint.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                          <span>{comment.authorName}</span>
                          <span className="text-[10px] font-normal text-slate-500 capitalize">
                            ({comment.authorRole})
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-700 whitespace-pre-line">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment input */}
              <form onSubmit={handleCommentSubmit} className="pt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add an inquiry, progress update, or clarification note..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <span className="text-[11px] text-slate-500">
            Complaint Tracking System • CampusSphere ERP
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
