import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DemoWalkthroughBanner } from './components/layout/DemoWalkthroughBanner';

// Student Portal Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentAttendance } from './components/student/StudentAttendance';
import { StudentResults } from './components/student/StudentResults';
import { StudentTimetable } from './components/student/StudentTimetable';
import { StudentAnnouncements } from './components/student/StudentAnnouncements';
import { StudentComplaints } from './components/student/StudentComplaints';

// Faculty Portal Views
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { FacultyAttendance } from './components/faculty/FacultyAttendance';
import { FacultyResults } from './components/faculty/FacultyResults';
import { FacultyComplaints } from './components/faculty/FacultyComplaints';

// Admin Portal Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminDirectories } from './components/admin/AdminDirectories';
import { AdminComplaints } from './components/admin/AdminComplaints';
import { AdminReports } from './components/admin/AdminReports';

const MainAppContent: React.FC = () => {
  const { currentUser, activeTab } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!currentUser) {
    return <LoginPage />;
  }

  const role = currentUser.role;

  // Render role-specific view
  const renderCurrentView = () => {
    if (role === 'student') {
      switch (activeTab) {
        case 'dashboard':
          return <StudentDashboard />;
        case 'attendance':
          return <StudentAttendance />;
        case 'results':
          return <StudentResults />;
        case 'timetable':
          return <StudentTimetable />;
        case 'announcements':
          return <StudentAnnouncements />;
        case 'complaints':
          return <StudentComplaints />;
        default:
          return <StudentDashboard />;
      }
    }

    if (role === 'faculty') {
      switch (activeTab) {
        case 'dashboard':
          return <FacultyDashboard />;
        case 'faculty-attendance':
          return <FacultyAttendance />;
        case 'faculty-results':
          return <FacultyResults />;
        case 'complaints':
          return <FacultyComplaints />;
        case 'timetable':
          return <StudentTimetable />;
        case 'announcements':
          return <StudentAnnouncements />;
        default:
          return <FacultyDashboard />;
      }
    }

    // Admin role
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'directory':
        return <AdminDirectories />;
      case 'complaints':
        return <AdminComplaints />;
      case 'reports':
        return <AdminReports />;
      case 'announcements':
        return <StudentAnnouncements />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800">
      {/* Top Guided Demo Banner for seamless presentation demonstration */}
      <DemoWalkthroughBanner />

      {/* Main Navbar */}
      <Navbar
        onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        sidebarOpen={mobileSidebarOpen}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Collapsible Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Primary Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderCurrentView()}</div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
