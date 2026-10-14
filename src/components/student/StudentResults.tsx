import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Download, BookOpen, CheckCircle, Info, Sparkles } from 'lucide-react';

export const StudentResults: React.FC = () => {
  const { currentUser, getStudentResults, exportResultsCSV } = useApp();

  if (!currentUser) return null;

  const { results, cgpa, percentage, totalCredits, earnedCredits } = getStudentResults(currentUser.id);

  return (
    <div className="space-y-6">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Academic Grade Transcript</h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              Semester 4
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official demonstration grade sheet • Mid-Term and Continuous Internal Assessments
          </p>
        </div>

        <button
          onClick={exportResultsCSV}
          className="inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Download Results CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Cumulative Grade Point (CGPA)
          </span>
          <div className="text-3xl font-extrabold text-blue-700 mt-1">{cgpa}</div>
          <span className="text-xs text-slate-500">Scale of 10.00 Point</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Overall Percentage
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">{percentage}%</div>
          <span className="text-xs text-emerald-600 font-semibold">First Class with Distinction</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Credits Earned
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">
            {earnedCredits} / {totalCredits}
          </div>
          <span className="text-xs text-slate-500">All registered credits cleared</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Academic Status
          </span>
          <div className="text-sm font-bold text-emerald-600 mt-2 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> Good Standing
          </div>
          <span className="text-xs text-slate-500">Zero backlogs</span>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Course Examination Marks</h3>
          </div>
          <span className="text-xs text-slate-500">Academic Year 2026-2027</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Subject Code & Course</th>
                <th className="py-3 px-4">Evaluation Type</th>
                <th className="py-3 px-4 text-center">Marks Obtained</th>
                <th className="py-3 px-4 text-center">Max Marks</th>
                <th className="py-3 px-4 text-center">Score %</th>
                <th className="py-3 px-4 text-center">Letter Grade</th>
                <th className="py-3 px-6 text-right">Result Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {results.map((res) => {
                const pct = Math.round((res.marksObtained / res.maxMarks) * 100);
                return (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900">{res.subjectCode}</span>
                      <div className="text-slate-600 font-medium">{res.subjectName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {res.examType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900 font-mono text-sm">
                      {res.marksObtained}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-500 font-mono">
                      {res.maxMarks}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold font-mono">
                      {pct}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block w-7 h-7 rounded-lg bg-blue-50 text-blue-800 font-bold font-mono text-xs leading-7 border border-blue-200">
                        {res.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Passed
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grading Scheme Reference Banner */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start space-x-2.5">
        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-800">Grading System Standard: </span>
          <span>
            O (90-100%, 10 pts) • A+ (80-89%, 9 pts) • A (70-79%, 8 pts) • B+ (60-69%, 7 pts) • B (50-59%, 6 pts) • C (40-49%, 5 pts) • F (&lt;40%, Reappear)
          </span>
        </div>
      </div>
    </div>
  );
};
