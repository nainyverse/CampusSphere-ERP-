import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Lock,
  Mail,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { loginAsRole, loginWithEmail } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('aarav.sharma@campussphere.edu');
  const [password, setPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'student') {
      setEmail('aarav.sharma@campussphere.edu');
    } else if (role === 'faculty') {
      setEmail('rajesh.verma@campussphere.edu');
    } else {
      setEmail('dean.rao@campussphere.edu');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter an email address.');
      return;
    }
    const success = loginWithEmail(email, selectedRole);
    if (!success) {
      setErrorMessage('Account not found for this role. Use quick demo login below.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Gradient Spheres */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white shadow-xl shadow-blue-900/40 mb-4">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">CampusSphere ERP</h2>
        <p className="mt-1.5 text-sm text-slate-400 font-medium">
          One Campus. One System. Smarter Management.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {/* Role selector tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Portal / Role
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`py-2 text-xs font-medium rounded-lg transition-all ${
                  selectedRole === 'student'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('faculty')}
                className={`py-2 text-xs font-medium rounded-lg transition-all ${
                  selectedRole === 'faculty'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Faculty / Staff
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`py-2 text-xs font-medium rounded-lg transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Administrator
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300">Campus Email</label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="name@campussphere.edu"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">Password</label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-red-400 font-medium bg-red-950/40 p-2 rounded border border-red-900">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Sign In to {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Portal
            </button>
          </form>

          {/* Quick 1-Click Demo Section */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-blue-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Presentation Demo Logins</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => loginAsRole('student')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors group"
              >
                <div className="text-left">
                  <span className="font-semibold text-emerald-400">Student Portal</span>
                  <p className="text-[10px] text-slate-400">Aarav Sharma • Sem 4 CSE</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => loginAsRole('faculty')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors group"
              >
                <div className="text-left">
                  <span className="font-semibold text-amber-400">Faculty & Staff Portal</span>
                  <p className="text-[10px] text-slate-400">Prof. Rajesh Verma • Electrical Lead</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => loginAsRole('admin')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors group"
              >
                <div className="text-left">
                  <span className="font-semibold text-indigo-400">Administrator Console</span>
                  <p className="text-[10px] text-slate-400">Dr. Meera Rao • Dean of Administration</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-start space-x-2 text-[11px] text-slate-400">
            <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
            <span>
              Academic and operational demonstration dataset saved to browser localStorage.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
