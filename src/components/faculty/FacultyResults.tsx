import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Save, CheckCircle2, AlertTriangle, Users, BookOpen } from 'lucide-react';

export const FacultyResults: React.FC = () => {
  const { subjects, users, results, saveExamMarks } = useApp();

  const enrolledStudents = users.filter((u) => u.role === 'student');

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0]?.id || 'sub_cs401'
  );
  const [selectedExamType, setSelectedExamType] = useState<
    'Mid-Term' | 'End-Term' | 'Internal' | 'Practical'
  >('Mid-Term');
  const [maxMarks, setMaxMarks] = useState<number>(100);

  // Student marks state map
  const [marksMap, setMarksMap] = useState<{ [studentId: string]: number }>({});
  const [validationErrors, setValidationErrors] = useState<{ [studentId: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load existing results for selected course and exam type
  useEffect(() => {
    const existing = results.filter(
      (r) => r.subjectId === selectedSubjectId && r.examType === selectedExamType
    );

    const initialMap: { [studentId: string]: number } = {};
    enrolledStudents.forEach((st) => {
      const match = existing.find((e) => e.studentId === st.id);
      initialMap[st.id] = match ? match.marksObtained : 80;
    });

    setMarksMap(initialMap);
    setValidationErrors({});
    setSuccessMessage(null);
  }, [selectedSubjectId, selectedExamType, results]);

  const handleMarkChange = (studentId: string, val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setMarksMap((prev) => ({ ...prev, [studentId]: 0 }));
      setValidationErrors((prev) => ({ ...prev, [studentId]: 'Invalid number' }));
      return;
    }

    if (num < 0) {
      setValidationErrors((prev) => ({ ...prev, [studentId]: 'Cannot be negative' }));
    } else if (num > maxMarks) {
      setValidationErrors((prev) => ({
        ...prev,
        [studentId]: `Cannot exceed maximum marks (${maxMarks})`
      }));
    } else {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
    }

    setMarksMap((prev) => ({ ...prev, [studentId]: num }));
    setSuccessMessage(null);
  };

  const handleSave = () => {
    // Check if any errors exist
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = enrolledStudents.map((st) => ({
      studentId: st.id,
      subjectId: selectedSubjectId,
      examType: selectedExamType,
      marksObtained: marksMap[st.id] ?? 0,
      maxMarks
    }));

    saveExamMarks(payload);
    setSuccessMessage(
      `Saved! Updated ${payload.length} examination scores for ${selectedExamType}. The Student Results portal has been updated with recalculated grades and CGPA.`
    );
  };

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Academic Grading & Examination Results Entry
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Input subject evaluation scores. System automatically calculates grade points (O, A+, A...) and propagates to student CGPA transcripts.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={Object.keys(validationErrors).length > 0}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30 transition-transform hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save & Publish Grades</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-200 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Selector Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Select Course
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Examination Type
            </label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value as any)}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              <option value="Mid-Term">Mid-Term Examination</option>
              <option value="End-Term">End-Term Final Examination</option>
              <option value="Internal">Continuous Internal Assessment</option>
              <option value="Practical">Laboratory Practical & Viva</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Maximum Marks
            </label>
            <input
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value) || 100)}
              className="w-full px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Marks Entry Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Score Entry: {currentSubject?.name} ({currentSubject?.code})
            </h3>
          </div>
          <span className="text-xs text-slate-500">{selectedExamType} Evaluation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Max Marks</th>
                <th className="py-3 px-4 min-w-[150px]">Marks Obtained</th>
                <th className="py-3 px-4 text-center">Score %</th>
                <th className="py-3 px-6 text-right">Computed Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {enrolledStudents.map((st) => {
                const mark = marksMap[st.id] ?? 0;
                const err = validationErrors[st.id];
                const pct = maxMarks > 0 ? Math.round((mark / maxMarks) * 100) : 0;

                let grade = 'C';
                if (pct >= 90) grade = 'O';
                else if (pct >= 80) grade = 'A+';
                else if (pct >= 70) grade = 'A';
                else if (pct >= 60) grade = 'B+';
                else if (pct >= 50) grade = 'B';
                else if (pct >= 40) grade = 'C';
                else grade = 'F';

                return (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{st.idNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{st.name}</div>
                      <div className="text-[11px] text-slate-500">{st.department}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{maxMarks}</td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <input
                          type="number"
                          step="1"
                          value={mark}
                          onChange={(e) => handleMarkChange(st.id, e.target.value)}
                          className={`w-28 px-3 py-1.5 text-xs font-mono font-bold rounded border ${
                            err ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                          } focus:outline-hidden focus:ring-2 focus:ring-blue-600`}
                        />
                        {err && <div className="text-[10px] text-red-600 font-semibold">{err}</div>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold">
                      {pct}%
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="inline-block w-7 h-7 rounded-lg bg-blue-50 text-blue-800 font-bold font-mono text-xs leading-7 border border-blue-200 text-center">
                        {grade}
                      </span>
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
            disabled={Object.keys(validationErrors).length > 0}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Save Grades to Student Transcripts
          </button>
        </div>
      </div>
    </div>
  );
};
