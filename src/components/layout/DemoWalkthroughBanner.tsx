import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UserCheck,
  ShieldAlert,
  Wrench,
  RotateCcw,
  X
} from 'lucide-react';

export const DemoWalkthroughBanner: React.FC = () => {
  const {
    demoGuideOpen,
    setDemoGuideOpen,
    demoStep,
    setDemoStep,
    loginAsRole,
    setActiveTab,
    setSelectedComplaintId,
    complaints,
    currentUser
  } = useApp();

  const cmp1042 = complaints.find((c) => c.id === 'CMP-1042');

  const steps = [
    {
      step: 1,
      title: 'Student Portal: Inspect or Submit Complaint',
      role: 'student' as const,
      tab: 'complaints',
      desc: 'View or lodge complaint CMP-1042 ("Classroom fans and lights not working", Room 204).',
      actionLabel: 'Act as Student Aarav',
      badge: 'Student View'
    },
    {
      step: 2,
      title: 'Admin Portal: Triage & Assign',
      role: 'admin' as const,
      tab: 'complaints',
      desc: 'Dean reviews CMP-1042, confirms High priority, and assigns to Electrical Maintenance.',
      actionLabel: 'Act as Dean Meera Rao',
      badge: 'Admin Triage'
    },
    {
      step: 3,
      title: 'Faculty/Staff Portal: Take Ownership',
      role: 'faculty' as const,
      tab: 'complaints',
      desc: 'Prof. Rajesh Verma views assigned work orders, updates status to In Progress with field notes.',
      actionLabel: 'Act as Prof. Rajesh Verma',
      badge: 'Staff Action'
    },
    {
      step: 4,
      title: 'Faculty/Staff: Resolve Ticket',
      role: 'faculty' as const,
      tab: 'complaints',
      desc: 'Staff completes electrical repair and marks ticket Resolved with comprehensive resolution details.',
      actionLabel: 'Go to Work Orders',
      badge: 'Resolution'
    },
    {
      step: 5,
      title: 'Student Portal: Verify or Reopen',
      role: 'student' as const,
      tab: 'complaints',
      desc: 'Student Aarav receives resolution alert and confirms the fix (closes ticket) or reopens it.',
      actionLabel: 'Act as Aarav (Verify)',
      badge: 'Verification'
    },
    {
      step: 6,
      title: 'Admin Dashboard: Audit & Dynamic KPIs',
      role: 'admin' as const,
      tab: 'dashboard',
      desc: 'Verify updated resolution rate, live statistics, and full chronological audit trail.',
      actionLabel: 'View Admin Metrics',
      badge: 'KPI Analytics'
    }
  ];

  const handleStepJump = (targetStep: (typeof steps)[0]) => {
    loginAsRole(targetStep.role);
    setActiveTab(targetStep.tab);
    if (cmp1042) {
      setSelectedComplaintId(cmp1042.id);
    }
    setDemoStep(targetStep.step);
  };

  if (!demoGuideOpen) {
    return (
      <div className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2 flex items-center justify-between text-xs transition-all shadow-inner">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Sparkles className="w-3 h-3 mr-1 text-blue-400" />
            PRESENTATION DEMO SCENARIO
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Active Complaint Demo: <strong>CMP-1042</strong> ({cmp1042 ? cmp1042.status : 'Active'})
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setDemoGuideOpen(true)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-sm"
          >
            <span>Open Presentation Stepper</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white border-b border-indigo-900/40 px-4 py-3 transition-all shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-blue-500/20 text-blue-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-sm font-semibold tracking-wide flex items-center gap-2">
                Presentation Guided Scenario
                <span className="text-xs font-normal text-slate-400">
                  (Single-session end-to-end lifecycle demonstration)
                </span>
              </h4>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400 hidden md:inline">
              Target Ticket: <strong className="text-amber-400">CMP-1042</strong> Status:{' '}
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-200 border border-slate-700">
                {cmp1042?.status || 'Submitted'}
              </span>
            </span>
            <button
              onClick={() => setDemoGuideOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
              title="Minimize guide banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 pt-2.5">
          {steps.map((st) => {
            const isCurrent = currentUser?.role === st.role;
            const isStepActive = demoStep === st.step;
            return (
              <div
                key={st.step}
                onClick={() => handleStepJump(st)}
                className={`cursor-pointer rounded-lg p-2.5 transition-all text-left border relative group flex flex-col justify-between ${
                  isStepActive
                    ? 'bg-blue-900/50 border-blue-400/80 shadow-md ring-1 ring-blue-400/50'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Step {st.step}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${
                        st.role === 'student'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : st.role === 'faculty'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-purple-950 text-purple-300 border border-purple-800'
                      }`}
                    >
                      {st.badge}
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-slate-100 line-clamp-1">{st.title}</h5>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-tight">
                    {st.desc}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-blue-300 group-hover:text-blue-200">
                  <span className="font-medium truncate">{st.actionLabel}</span>
                  <ArrowRight className="w-3 h-3 flex-shrink-0 ml-1 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
