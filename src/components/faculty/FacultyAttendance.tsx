import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  Users,
  Check,
  RotateCcw,
  BookOpen,
  Calendar,
  Sparkles
} from 'lucide-react';
import { AttendanceStatus } from '../../types';

export const FacultyAttendance: React.FC = () => {
  const { subjects, users, attendance, saveAttendanceForClass, currentUser } = useApp();

  const enrolledStudents = users.filter((u) => u.role === 'student');

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0]?.id || 'sub_cs401'
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [studentStatusMap, setStudentStatusMap] = useState<{
    [studentId: string]: AttendanceStatus;
  }>({});
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);

  // Load existing attendance for this subject & date if already recorded
  useEffect(() => {
    const existingForDate = attendance.filter(
      (a) => a.subjectId === selectedSubjectId && a.date === selectedDate
    );

    const initialMap: { [studentId: string]: AttendanceStatus } = {};
    enrolledStudents.forEach((st) => {
      const match = existingForDate.find((e) => e.studentId === st.id);
      initialMap[st.id] = match ? match.status : 'present'; // default present
    });
    setStudentStatusMap(initialMap);
    setSavedSuccessMessage(null);
  }, [selectedSubjectId, selectedDate, attendance]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudentStatusMap((prev) => ({
      ...prev,
      [studentId]: status
    }));
    setSavedSuccessMessage(null);
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const nextMap: { [studentId: string]: AttendanceStatus } = {};
    enrolledStudents.forEach((st) => {
      nextMap[st.id] = status;
    });
    setStudentStatusMap(nextMap);
    setSavedSuccessMessage(null);
  };

  const handleSave = () => {
    const records = Object.entries(studentStatusMap).map(([studentId, status]) => ({
      studentId,
      status
    }));

    saveAttendanceForClass(selectedSubjectId, selectedDate, records);
    const presentCount = records.filter((r) => r.status === 'present' || r.status === 'late').length;
    setSavedSuccessMessage(
      `Saved! ${presentCount} of ${records.length} students marked present for ${selectedDate}. Shared database and student attendance portals updated immediately.`
    );
  };

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);

  // Summary counts for current form
  const total = enrolledStudents.length;
  const present = Object.values(studentStatusMap).filter((s) => s === 'present').length;
  const late = Object.values(studentStatusMap).filter((s) => s === 'late').length;
  const absent = Object.values(studentStatusMap).filter((s) => s === 'absent').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Class Attendance Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Mark daily attendance. Updates are persistent across the college ERP and immediately reflect in student portals.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition-transform hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Attendance Record</span>
        </button>
      </div>

      {savedSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-200 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{savedSuccessMessage}</span>
        </div>
      )}

      {/* Selectors Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Select Course / Subject
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} — {s.name} (Sem {s.semester})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Lecture Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex flex-col justify-end">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Quick Batch Actions
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => handleMarkAll('present')}
                className="flex-1 px-3 py-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-300 transition-colors"
              >
                All Present
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('absent')}
                className="flex-1 px-3 py-2 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-800 rounded-lg border border-red-300 transition-colors"
              >
                All Absent
              </button>
            </div>
          </div>
        </div>

        {/* Live session statistics */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
          <div>
            Total Roster: <strong className="text-slate-900">{total}</strong>
          </div>
          <div>
            Present: <strong className="text-emerald-700">{present}</strong>
          </div>
          <div>
            Late: <strong className="text-amber-700">{late}</strong>
          </div>
          <div>
            Absent: <strong className="text-red-700">{absent}</strong>
          </div>
          <div>
            Session Attendance Rate:{' '}
            <strong className="text-blue-700 font-bold">
              {total > 0 ? Math.round(((present + late) / total) * 100) : 0}%
            </strong>
          </div>
        </div>
      </div>

      {/* Student Attendance Marking Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Class Roster: {currentSubject?.name} ({currentSubject?.code})
            </h3>
          </div>
          <span className="text-xs text-slate-500">{selectedDate}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Department & Sem</th>
                <th className="py-3 px-6 text-center">Status Toggle (Present / Late / Absent)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {enrolledStudents.map((st) => {
                const currentStatus = studentStatusMap[st.id] || 'present';
                return (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{st.idNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{st.name}</div>
                      <div className="text-[11px] text-slate-500">{st.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {st.department} • Sem {st.semester || 4}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'present')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Present
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'late')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentStatus === 'late'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Late
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'absent')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentStatus === 'absent'
                              ? 'bg-red-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save & Propagate Records to Student Portals</span>
          </button>
        </div>
      </div>
    </div>
  );
};
