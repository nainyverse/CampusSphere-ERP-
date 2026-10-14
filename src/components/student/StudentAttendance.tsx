import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  AlertTriangle,
  Download,
  CheckCircle2,
  Clock,
  BookOpen,
  Info
} from 'lucide-react';

export const StudentAttendance: React.FC = () => {
  const { currentUser, getStudentAttendanceSummary, exportAttendanceCSV } = useApp();

  if (!currentUser) return null;

  const { summaries, overallPercentage, totalClasses, totalAttended, lowAttendanceCount } =
    getStudentAttendanceSummary(currentUser.id);

  return (
    <div className="space-y-6">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Academic Attendance Record</h2>
          <p className="text-xs text-slate-500 mt-1">
            Current Semester 4 • Real-time attendance percentage calculated from classroom session logs.
          </p>
        </div>
        <button
          onClick={() => exportAttendanceCSV(currentUser.id)}
          className="inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Attendance CSV</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Overall Attendance
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{overallPercentage}%</div>
          <span className="text-xs text-slate-500">
            {totalAttended} of {totalClasses} classes attended
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Examination Clearance
          </span>
          <div className="text-sm font-bold mt-1 flex items-center space-x-1">
            {overallPercentage >= 75 ? (
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Eligible for Finals
              </span>
            ) : (
              <span className="text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> Attendance Condonation Req.
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500">Mandatory threshold: 75%</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Courses Below 75%
          </span>
          <div
            className={`text-2xl font-extrabold mt-1 ${
              lowAttendanceCount > 0 ? 'text-red-600' : 'text-emerald-600'
            }`}
          >
            {lowAttendanceCount} {lowAttendanceCount === 1 ? 'Course' : 'Courses'}
          </div>
          <span className="text-xs text-slate-500">
            {lowAttendanceCount > 0 ? 'Action required immediately' : 'All subjects compliant'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Calculation Policy
          </span>
          <div className="text-xs font-semibold text-slate-800 mt-1">
            Dynamic Formula
          </div>
          <span className="text-[11px] text-slate-500">
            (Present + Late) ÷ Total Sessions × 100
          </span>
        </div>
      </div>

      {/* Critical Alert Warning if courses < 75% */}
      {lowAttendanceCount > 0 && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-300 flex items-start space-x-3 text-red-900 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold">
              Attendance Shortage Notice: You have {lowAttendanceCount} subject below the 75% regulatory requirement.
            </h4>
            <p className="text-red-800">
              Per college regulations, students falling below 75% attendance are subject to detention from
              end-semester laboratory and theoretical examinations unless official medical exemption is submitted.
            </p>
          </div>
        </div>
      )}

      {/* Subject-Wise Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Subject-Wise Breakdown</h3>
          </div>
          <span className="text-xs text-slate-500">{summaries.length} registered subjects</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Subject Code & Course</th>
                <th className="py-3 px-4">Faculty In-Charge</th>
                <th className="py-3 px-4 text-center">Total Sessions</th>
                <th className="py-3 px-4 text-center">Attended</th>
                <th className="py-3 px-4 text-right">Attendance %</th>
                <th className="py-3 px-6 min-w-[180px]">Status & Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {summaries.map((sub) => {
                const isShortage = sub.isLowAttendance;
                return (
                  <tr
                    key={sub.subjectId}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isShortage ? 'bg-red-50/40' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 font-mono">{sub.subjectCode}</div>
                      <div className="text-slate-600 font-medium">{sub.subjectName}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{sub.facultyName}</td>
                    <td className="py-3.5 px-4 text-center font-semibold">{sub.totalClasses}</td>
                    <td className="py-3.5 px-4 text-center font-semibold">{sub.attendedClasses}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-sm">
                      <span className={isShortage ? 'text-red-600 font-extrabold' : 'text-slate-900'}>
                        {sub.percentage}%
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          {isShortage ? (
                            <span className="text-red-700 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Below 75%
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Satisfactory
                            </span>
                          )}
                          <span className="text-slate-400 font-mono">{sub.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              isShortage ? 'bg-red-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, sub.percentage)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
