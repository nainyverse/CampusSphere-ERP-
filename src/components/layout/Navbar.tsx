import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Bell,
  RotateCcw,
  LogOut,
  ChevronDown,
  UserCheck,
  Check,
  ExternalLink,
  Menu,
  X,
  AlertTriangle,
  Info
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, sidebarOpen }) => {
  const {
    currentUser,
    users,
    loginAsRole,
    switchUser,
    logout,
    resetDemoData,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
    setSelectedComplaintId
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Filter notifications relevant to current user
  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser?.id || n.userId === 'all'
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const handleRoleSelect = (role: UserRole) => {
    loginAsRole(role);
    setRoleMenuOpen(false);
  };

  const handleNotificationClick = (notif: (typeof notifications)[0]) => {
    markNotificationRead(notif.id);
    if (notif.complaintId) {
      setSelectedComplaintId(notif.complaintId);
      setActiveTab('complaints');
    }
    setNotifMenuOpen(false);
  };

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Mobile hamburger & Brand */}
            <div className="flex items-center space-x-3">
              {onToggleSidebar && (
                <button
                  onClick={onToggleSidebar}
                  className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Toggle navigation menu"
                >
                  {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}

              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-900/30">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-base tracking-tight text-white">CampusSphere</span>
                    <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-blue-600/30 text-blue-400 border border-blue-500/30">
                      ERP
                    </span>
                  </div>
                  <p className="hidden md:block text-[11px] text-slate-400 tracking-wide font-normal">
                    One Campus. One System. Smarter Management.
                  </p>
                </div>
              </div>
            </div>

            {/* Middle: Active Portal Indicator */}
            <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60 text-xs">
              <span className="text-slate-400">Current View:</span>
              <span
                className={`font-semibold capitalize px-2 py-0.5 rounded-full text-xs ${
                  currentUser?.role === 'student'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : currentUser?.role === 'faculty'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}
              >
                {currentUser?.role === 'student' && 'Student Portal'}
                {currentUser?.role === 'faculty' && 'Faculty & Staff Portal'}
                {currentUser?.role === 'admin' && 'Dean & Administrator Console'}
              </span>
            </div>

            {/* Right: Quick Role Switcher, Notifications, User Menu, Reset */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Quick 1-Click Role Jump dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setRoleMenuOpen(!roleMenuOpen);
                    setNotifMenuOpen(false);
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors shadow-sm"
                  title="Switch Role for Presentation Demo"
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Role:</span>
                  <span className="font-semibold text-white capitalize">{currentUser?.role}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Demo Persona Switcher
                    </div>

                    <button
                      onClick={() => handleRoleSelect('student')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                        currentUser?.role === 'student' ? 'text-emerald-400 font-semibold bg-slate-800/50' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>Aarav Sharma</span>
                        <span className="text-[10px] text-slate-400">Student • Sem 4 CSE (Roll: 041)</span>
                      </div>
                      {currentUser?.role === 'student' && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>

                    <button
                      onClick={() => handleRoleSelect('faculty')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                        currentUser?.role === 'faculty' ? 'text-amber-400 font-semibold bg-slate-800/50' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>Prof. Rajesh Verma</span>
                        <span className="text-[10px] text-slate-400">Faculty • Electrical Maintenance Lead</span>
                      </div>
                      {currentUser?.role === 'faculty' && <Check className="w-4 h-4 text-amber-400" />}
                    </button>

                    <button
                      onClick={() => handleRoleSelect('admin')}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                        currentUser?.role === 'admin' ? 'text-indigo-400 font-semibold bg-slate-800/50' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>Dr. Meera Rao</span>
                        <span className="text-[10px] text-slate-400">Dean of Administration & Operations</span>
                      </div>
                      {currentUser?.role === 'admin' && <Check className="w-4 h-4 text-indigo-400" />}
                    </button>
                  </div>
                )}
              </div>

              {/* In-app Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifMenuOpen(!notifMenuOpen);
                    setRoleMenuOpen(false);
                  }}
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 relative transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-white tracking-wide">Campus Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                            {unreadCount} unread
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
                      {userNotifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">
                          No notifications yet.
                        </div>
                      ) : (
                        userNotifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-3 text-left hover:bg-slate-800/80 cursor-pointer transition-colors ${
                              !notif.read ? 'bg-blue-950/20' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <span className="text-xs font-semibold text-slate-200">{notif.title}</span>
                              <span className="text-[10px] text-slate-400">
                                {new Date(notif.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Reset Demo Data Button */}
              <button
                onClick={() => setResetModalOpen(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                title="Reset Demo Data to Initial State"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* User Profile Pill & Logout */}
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                  alt={currentUser?.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                />
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-semibold text-white leading-tight">{currentUser?.name}</div>
                  <div className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px]">
                    {currentUser?.idNumber}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Reset Demo Data Confirmation Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-150">
            <div className="flex items-center space-x-3 text-amber-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Reset Demo Data?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              This will restore all students, faculty members, subjects, attendance records, exam marks, and complaints
              (including <strong>CMP-1042</strong>) to their clean baseline state. Any changes made during the session will be reset.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setResetModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setResetModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-sm transition-colors"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
