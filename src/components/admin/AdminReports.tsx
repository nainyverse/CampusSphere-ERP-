import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Download,
  CalendarCheck,
  Award,
  LifeBuoy,
  Clock,
  Building,
  AlertTriangle,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const {
    users,
    subjects,
    attendance,
    results,
    complaints,
    exportComplaintsCSV,
    exportAttendanceCSV,
    exportResultsCSV
  } = useApp();

  const students = users.filter((u) => u.role === 'student');

  // Course attendance rates
  const courseAttendanceStats = subjects.map((sub) => {
    const subRecords = attendance.filter((a) => a.subjectId === sub.id);
    const total = subRecords.length;
    const attended = subRecords.filter((a) => a.status === 'present' || a.status === 'late').length;
    const rate = total > 0 ? Math.round((attended / total) * 1000) / 10 : 0;
    return {
      code: sub.code,
      name: sub.name,
      faculty: sub.facultyName,
      total,
      attended,
      rate
    };
  });

  // Open complaints by department
  const deptMap: { [dept: string]: { open: number; resolved: number; total: number } } = {};
  complaints.forEach((c) => {
    if (!deptMap[c.assignedDepartment]) {
      deptMap[c.assignedDepartment] = { open: 0, resolved: 0, total: 0 };
    }
    deptMap[c.assignedDepartment].total += 1;
    if (c.status === 'Resolved' || c.status === 'Closed') {
      deptMap[c.assignedDepartment].resolved += 1;
    } else {
      deptMap[c.assignedDepartment].open += 1;
    }
  });

  // Repeat issue locations
  const locationCounts: { [loc: string]: number } = {};
  complaints.forEach((c) => {
    locationCounts[c.location] = (locationCounts[c.location] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Institutional Analytics & Exportable Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Data aggregated from live academic rosters, examination submissions, and campus maintenance tickets.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => exportComplaintsCSV()}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Complaints CSV</span>
          </button>
          <button
            onClick={() => exportAttendanceCSV()}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Attendance CSV</span>
          </button>
          <button
            onClick={exportResultsCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Results CSV</span>
          </button>
        </div>
      </div>

      {/* Grid: Course Attendance & Open Complaints by Dept */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course-Wise Attendance Report */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Course Attendance Aggregate Compliance
              </h3>
            </div>
            <button
              onClick={() => exportAttendanceCSV()}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Export
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {courseAttendanceStats.map((item) => (
              <div key={item.code} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 font-mono">{item.code}</span>
                  <div className="text-slate-500 text-[11px]">{item.name}</div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-bold font-mono text-sm ${
                      item.rate < 75 ? 'text-red-600' : 'text-slate-900'
                    }`}
                  >
                    {item.rate}%
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {item.attended}/{item.total} logged
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Complaints by Department */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Departmental Maintenance Load & Resolution
              </h3>
            </div>
            <button
              onClick={() => exportComplaintsCSV()}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              Export
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {Object.entries(deptMap).map(([dept, data]) => {
              const resRate =
                data.total > 0 ? Math.round((data.resolved / data.total) * 100) : 0;
              return (
                <div key={dept} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{dept}</span>
                    <div className="text-slate-500 text-[11px]">
                      {data.open} open • {data.resolved} resolved
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 font-mono text-sm">
                      {resRate}%
                    </span>
                    <div className="text-[10px] text-slate-400">Resolution rate</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Repeated Campus Hotspots & SLA Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Repeated Hotspots */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Campus Facility Hotspots (Multiple Incidents)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Locations where recurring complaints have been registered by students or faculty.
          </p>

          <div className="space-y-2 pt-1 text-xs">
            {Object.entries(locationCounts).map(([loc, count]) => (
              <div
                key={loc}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <span className="font-semibold text-slate-800">{loc}</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                  {count} {count === 1 ? 'ticket' : 'tickets'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Metrics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Mean Time to Resolution (MTTR) by Priority
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-red-900">Critical (Safety Hazards)</span>
                <p className="text-[11px] text-red-700">Target SLA: 4 hours</p>
              </div>
              <span className="text-sm font-bold text-red-800 font-mono">Avg: 3.2 hrs</span>
            </div>

            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-orange-900">High (Classroom Disruptions)</span>
                <p className="text-[11px] text-orange-700">Target SLA: 24 hours</p>
              </div>
              <span className="text-sm font-bold text-orange-800 font-mono">Avg: 18.5 hrs</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-900">Medium (Routine Maintenance)</span>
                <p className="text-[11px] text-amber-700">Target SLA: 72 hours</p>
              </div>
              <span className="text-sm font-bold text-amber-800 font-mono">Avg: 41.0 hrs</span>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-blue-900">Low (Cosmetic & Requests)</span>
                <p className="text-[11px] text-blue-700">Target SLA: 168 hours</p>
              </div>
              <span className="text-sm font-bold text-blue-800 font-mono">Avg: 92.4 hrs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
