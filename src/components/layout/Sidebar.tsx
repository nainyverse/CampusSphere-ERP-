import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Award,
  Calendar,
  Megaphone,
  LifeBuoy,
  Users,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  AlertCircle,
  Building2,
  GraduationCap
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile
}) => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    complaints,
    getStudentAttendanceSummary
  } = useApp();

  const role = currentUser?.role || 'student';

  // Badges calculation
  let complaintBadge = 0;
  let attendanceWarning = false;

  if (role === 'student' && currentUser) {
    complaintBadge = complaints.filter(
      (c) => c.reporterId === currentUser.id && c.status !== 'Closed'
    ).length;
    const summary = getStudentAttendanceSummary(currentUser.id);
    attendanceWarning = summary.lowAttendanceCount > 0;
  } else if (role === 'faculty' && currentUser) {
    complaintBadge = complaints.filter(
      (c) =>
        (c.assignedStaffId === currentUser.id ||
          c.assignedDepartment.toLowerCase().includes('electrical')) &&
        c.status !== 'Closed'
    ).length;
  } else if (role === 'admin') {
    complaintBadge = complaints.filter((c) => c.status !== 'Closed').length;
  }

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: CalendarCheck,
      badge: attendanceWarning ? 'Warning (<75%)' : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    { id: 'results', label: 'Examination Results', icon: Award },
    { id: 'timetable', label: 'Weekly Timetable', icon: Calendar },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    {
      id: 'complaints',
      label: 'My Complaints',
      icon: LifeBuoy,
      badge: complaintBadge > 0 ? String(complaintBadge) : undefined,
      badgeColor: 'bg-blue-100 text-blue-800'
    }
  ];

  const facultyNavItems = [
    { id: 'dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
    { id: 'faculty-attendance', label: 'Attendance Management', icon: CalendarCheck },
    { id: 'faculty-results', label: 'Results & Marks Entry', icon: Award },
    {
      id: 'complaints',
      label: 'Assigned Work Orders',
      icon: LifeBuoy,
      badge: complaintBadge > 0 ? String(complaintBadge) : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    { id: 'timetable', label: 'Class Schedule', icon: Calendar },
    { id: 'announcements', label: 'Campus Notices', icon: Megaphone }
  ];

  const adminNavItems = [
    { id: 'dashboard', label: 'Institutional KPIs', icon: LayoutDashboard },
    { id: 'directory', label: 'Student & Staff Directory', icon: Users },
    {
      id: 'complaints',
      label: 'Complaint Administration',
      icon: LifeBuoy,
      badge: complaintBadge > 0 ? String(complaintBadge) : undefined,
      badgeColor: 'bg-red-100 text-red-800'
    },
    { id: 'reports', label: 'Analytics & CSV Reports', icon: FileSpreadsheet },
    { id: 'announcements', label: 'Announcements Console', icon: Megaphone }
  ];

  const navItems =
    role === 'student'
      ? studentNavItems
      : role === 'faculty'
      ? facultyNavItems
      : adminNavItems;

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      {/* Role Pill in sidebar header */}
      <div className={`p-4 border-b border-slate-100 ${collapsed ? 'text-center' : ''}`}>
        {!collapsed ? (
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {role} portal
              </span>
            </div>
            <div className="mt-1 font-semibold text-slate-800 text-sm truncate">
              {currentUser?.name}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {role === 'student' && `${currentUser?.department} • Sem ${currentUser?.semester}`}
              {role === 'faculty' && `${currentUser?.designation || 'Faculty Member'}`}
              {role === 'admin' && `${currentUser?.designation || 'Dean of Administration'}`}
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title={currentUser?.name}>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              {currentUser?.name.charAt(0)}
            </div>
          </div>
        )}
      </div>

      {/* Nav Link Items */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'complaints' && activeTab === 'complaints');

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center ${
                collapsed ? 'justify-center px-2' : 'justify-between px-3'
              } py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActive ? 'text-blue-300' : 'text-slate-400'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ml-2 ${
                    isActive ? 'bg-blue-800 text-white' : item.badgeColor || 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Collapse Button (Desktop) */}
      <div className="hidden lg:flex p-3 border-t border-slate-100 justify-end">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block transition-all duration-200 z-30 flex-shrink-0 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="sticky top-16 h-[calc(100vh-4rem)]">{sidebarContent}</div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
