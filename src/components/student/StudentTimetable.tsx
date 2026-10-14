import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, MapPin, User, BookOpen } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

export const StudentTimetable: React.FC = () => {
  const { timetable } = useApp();
  const [selectedDay, setSelectedDay] = useState<(typeof DAYS)[number]>('Monday');

  const daySlots = timetable.filter((t) => t.day === selectedDay);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Weekly Lecture Schedule</h2>
          <p className="text-xs text-slate-500 mt-1">
            Computer Science & Engineering • Semester 4 Class Timetable
          </p>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex p-1 bg-slate-200/80 rounded-xl space-x-1 self-start sm:self-auto">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedDay === day
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">{selectedDay} Classes</h3>
          </div>
          <span className="text-xs text-slate-500">{daySlots.length} sessions scheduled</span>
        </div>

        <div className="divide-y divide-slate-100 p-2">
          {daySlots.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              No classes scheduled for {selectedDay}.
            </div>
          ) : (
            daySlots.map((slot) => (
              <div
                key={slot.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="px-3 py-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 flex flex-col items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 mb-0.5 text-blue-600" />
                    <span>{slot.timeSlot.split(' - ')[0]}</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-blue-700 font-mono">
                        {slot.subjectCode}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{slot.subjectName}</h4>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-slate-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{slot.room}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{slot.facultyName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="self-end sm:self-center">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {slot.timeSlot}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
