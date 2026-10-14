import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Mail,
  Phone,
  GraduationCap,
  Building,
  CheckCircle,
  X,
  Plus
} from 'lucide-react';
import { UserRole } from '../../types';

export const AdminDirectories: React.FC = () => {
  const { users, addStudent, addStaff } = useApp();

  const [activeTab, setActiveTab] = useState<'students' | 'staff'>('students');
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDepartment, setNewDepartment] = useState('Computer Science & Engineering');
  const [newIdNumber, setNewIdNumber] = useState('');
  const [newSemester, setNewSemester] = useState(4);
  const [newDesignation, setNewDesignation] = useState('Assistant Professor');
  const [newPhone, setNewPhone] = useState('+91 98765 00000');
  const [modalErrors, setModalErrors] = useState<{ [key: string]: string }>({});

  const students = users.filter((u) => u.role === 'student');
  const staff = users.filter((u) => u.role === 'faculty');

  const activeList = activeTab === 'students' ? students : staff;

  const departments = [
    'All',
    'Computer Science & Engineering',
    'Electrical Maintenance',
    'Mathematics & Computing',
    'Estate & Facilities',
    'Plumbing & Water Works'
  ];

  const filtered = activeList.filter((item) => {
    const matchesDept = departmentFilter === 'All' || item.department === departmentFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.idNumber.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { [key: string]: string } = {};
    if (!newName.trim()) errs.name = 'Full name is required';
    if (!newEmail.trim() || !newEmail.includes('@')) errs.email = 'Valid campus email required';
    if (!newIdNumber.trim()) errs.idNumber = 'Roll Number / Employee ID is required';

    if (Object.keys(errs).length > 0) {
      setModalErrors(errs);
      return;
    }

    if (activeTab === 'students') {
      addStudent({
        name: newName,
        email: newEmail,
        department: newDepartment,
        idNumber: newIdNumber,
        semester: newSemester,
        phone: newPhone
      });
    } else {
      addStaff({
        name: newName,
        email: newEmail,
        department: newDepartment,
        idNumber: newIdNumber,
        designation: newDesignation,
        phone: newPhone
      });
    }

    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewIdNumber('');
    setModalErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Campus Directory & Personnel Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse and manage registered students, faculty members, and campus administrative staff.
          </p>
        </div>

        <button
          onClick={() => {
            setModalErrors({});
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-transform hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New {activeTab === 'students' ? 'Student' : 'Staff Member'}</span>
        </button>
      </div>

      {/* Directory Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('students')}
          className={`py-3 px-6 text-xs font-bold border-b-2 flex items-center space-x-2 transition-colors cursor-pointer ${
            activeTab === 'students'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Student Body ({students.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`py-3 px-6 text-xs font-bold border-b-2 flex items-center space-x-2 transition-colors cursor-pointer ${
            activeTab === 'staff'
              ? 'border-indigo-600 text-indigo-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Faculty & Operational Staff ({staff.length})</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((person) => (
          <div
            key={person.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3"
          >
            <div className="flex items-start space-x-3.5">
              <img
                src={person.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                alt={person.name}
                className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 flex-shrink-0"
              />
              <div className="truncate flex-1">
                <h4 className="text-sm font-bold text-slate-900 truncate">{person.name}</h4>
                <div className="text-xs font-mono font-semibold text-indigo-700">
                  {person.idNumber}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {activeTab === 'students'
                    ? `${person.department} • Sem ${person.semester || 4}`
                    : `${person.designation || 'Staff'} • ${person.department}`}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center space-x-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{person.email}</span>
              </div>
              <div className="flex items-center space-x-2 truncate">
                <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{person.phone || '+91 98000 00000'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold">
                Add New {activeTab === 'students' ? 'Student' : 'Faculty / Staff'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Maya Krishnan"
                  className="w-full px-3 py-2 text-xs rounded border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                />
                {modalErrors.name && (
                  <p className="text-[11px] text-red-500 mt-1">{modalErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Campus Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. maya.krishnan@campussphere.edu"
                  className="w-full px-3 py-2 text-xs rounded border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                />
                {modalErrors.email && (
                  <p className="text-[11px] text-red-500 mt-1">{modalErrors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {activeTab === 'students' ? 'Roll Number' : 'Employee ID'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newIdNumber}
                    onChange={(e) => setNewIdNumber(e.target.value)}
                    placeholder={activeTab === 'students' ? 'CS-2023-046' : 'EMP-FAC-110'}
                    className="w-full px-3 py-2 text-xs rounded border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                  />
                  {modalErrors.idNumber && (
                    <p className="text-[11px] text-red-500 mt-1">{modalErrors.idNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    {activeTab === 'students' ? 'Semester' : 'Designation'}
                  </label>
                  {activeTab === 'students' ? (
                    <input
                      type="number"
                      value={newSemester}
                      onChange={(e) => setNewSemester(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                    />
                  ) : (
                    <input
                      type="text"
                      value={newDesignation}
                      onChange={(e) => setNewDesignation(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Department
                </label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-white"
                >
                  <option value="Computer Science & Engineering">
                    Computer Science & Engineering
                  </option>
                  <option value="Electrical Maintenance">Electrical Maintenance</option>
                  <option value="Mathematics & Computing">Mathematics & Computing</option>
                  <option value="Estate & Facilities">Estate & Facilities</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
