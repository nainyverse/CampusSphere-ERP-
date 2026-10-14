import React from 'react';
import { ComplaintPriority, ComplaintStatus } from '../../types';
import { AlertTriangle, Clock, CheckCircle, ShieldAlert, XCircle, RotateCcw } from 'lucide-react';

export const PriorityBadge: React.FC<{
  priority: ComplaintPriority;
  isSafetyHazard?: boolean;
  size?: 'sm' | 'md';
}> = ({ priority, isSafetyHazard, size = 'sm' }) => {
  const isSmall = size === 'sm';

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-300';
  if (priority === 'Critical') {
    colorClasses = 'bg-red-50 text-red-700 border-red-300 ring-1 ring-red-400/20';
  } else if (priority === 'High') {
    colorClasses = 'bg-orange-50 text-orange-700 border-orange-300';
  } else if (priority === 'Medium') {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-300';
  } else if (priority === 'Low') {
    colorClasses = 'bg-blue-50 text-blue-700 border-blue-300';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${
        isSmall ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      } ${colorClasses}`}
    >
      {isSafetyHazard && <ShieldAlert className="w-3 h-3 text-red-600 animate-pulse" />}
      <span>{priority}</span>
    </span>
  );
};

export const StatusBadge: React.FC<{ status: ComplaintStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'sm'
}) => {
  const isSmall = size === 'sm';

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = Clock;

  switch (status) {
    case 'Submitted':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      Icon = Clock;
      break;
    case 'Under Review':
      colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      Icon = Clock;
      break;
    case 'Assigned':
      colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
      Icon = Clock;
      break;
    case 'In Progress':
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-300';
      Icon = Clock;
      break;
    case 'Resolved':
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
      Icon = CheckCircle;
      break;
    case 'Closed':
      colorClasses = 'bg-slate-100 text-slate-800 border-slate-300';
      Icon = CheckCircle;
      break;
    case 'Reopened':
      colorClasses = 'bg-red-50 text-red-700 border-red-300 animate-pulse font-bold';
      Icon = RotateCcw;
      break;
    case 'Blocked':
      colorClasses = 'bg-rose-50 text-rose-800 border-rose-300';
      Icon = AlertTriangle;
      break;
    case 'Rejected':
      colorClasses = 'bg-gray-100 text-gray-700 border-gray-300 line-through';
      Icon = XCircle;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${
        isSmall ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      } ${colorClasses}`}
    >
      <Icon className="w-3 h-3" />
      <span>{status}</span>
    </span>
  );
};
