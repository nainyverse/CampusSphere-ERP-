import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Subject,
  AttendanceRecord,
  SubjectAttendanceSummary,
  ExamResult,
  TimetableSlot,
  Announcement,
  Complaint,
  ComplaintPriority,
  ComplaintStatus,
  InAppNotification
} from '../types';
import {
  SEED_USERS,
  SEED_SUBJECTS,
  SEED_ATTENDANCE,
  SEED_RESULTS,
  SEED_TIMETABLE,
  SEED_ANNOUNCEMENTS,
  SEED_COMPLAINTS,
  SEED_NOTIFICATIONS
} from '../data/seedData';
import { evaluateComplaintPriority, calculateDueDate } from '../utils/priorityEngine';

const STORAGE_KEY = 'campussphere_erp_v1_store';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  subjects: Subject[];
  attendance: AttendanceRecord[];
  results: ExamResult[];
  timetable: TimetableSlot[];
  announcements: Announcement[];
  complaints: Complaint[];
  notifications: InAppNotification[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedComplaintId: string | null;
  setSelectedComplaintId: (id: string | null) => void;
  demoGuideOpen: boolean;
  setDemoGuideOpen: (open: boolean) => void;
  demoStep: number;
  setDemoStep: (step: number) => void;

  // Auth / Role controls
  loginAsRole: (role: UserRole) => void;
  loginWithEmail: (email: string, role: UserRole) => boolean;
  switchUser: (userId: string) => void;
  logout: () => void;
  resetDemoData: () => void;

  // Complaint operations
  submitComplaint: (data: {
    title: string;
    description: string;
    category: any;
    location: string;
    priority?: ComplaintPriority;
    photoUrl?: string;
  }) => Complaint;
  assignComplaint: (
    complaintId: string,
    department: string,
    staffId?: string,
    dueDate?: string,
    priorityOverride?: ComplaintPriority,
    adminNote?: string
  ) => void;
  updateComplaintStatus: (
    complaintId: string,
    newStatus: ComplaintStatus,
    note?: string,
    actionTaken?: string,
    evidenceDetails?: string,
    resolutionNotes?: string
  ) => void;
  updateComplaintPriority: (complaintId: string, priority: ComplaintPriority, note?: string) => void;
  addComplaintComment: (complaintId: string, text: string) => void;
  verifyComplaintResolution: (complaintId: string, confirmed: boolean, feedback?: string) => void;
  reopenComplaint: (complaintId: string, reason: string) => void;

  // Attendance operations
  getStudentAttendanceSummary: (studentId: string) => {
    summaries: SubjectAttendanceSummary[];
    overallPercentage: number;
    totalClasses: number;
    totalAttended: number;
    lowAttendanceCount: number;
  };
  saveAttendanceForClass: (
    subjectId: string,
    date: string,
    records: { studentId: string; status: 'present' | 'absent' | 'late' }[]
  ) => void;

  // Results operations
  getStudentResults: (studentId: string) => {
    results: ExamResult[];
    cgpa: number;
    percentage: number;
    totalCredits: number;
    earnedCredits: number;
  };
  saveExamMarks: (
    records: {
      studentId: string;
      subjectId: string;
      examType: 'Mid-Term' | 'End-Term' | 'Internal' | 'Practical';
      marksObtained: number;
      maxMarks: number;
    }[]
  ) => void;

  // Directory & announcements
  addStudent: (data: Partial<User>) => void;
  addStaff: (data: Partial<User>) => void;
  addAnnouncement: (data: Omit<Announcement, 'id' | 'date'>) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Export
  exportComplaintsCSV: (filteredComplaints?: Complaint[]) => void;
  exportAttendanceCSV: (studentId?: string) => void;
  exportResultsCSV: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initialize with seed data
  const [isInitialized, setIsInitialized] = useState(false);
  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(SEED_USERS[0]); // default Aarav Sharma
  const [subjects, setSubjects] = useState<Subject[]>(SEED_SUBJECTS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(SEED_ATTENDANCE);
  const [results, setResults] = useState<ExamResult[]>(SEED_RESULTS);
  const [timetable, setTimetable] = useState<TimetableSlot[]>(SEED_TIMETABLE);
  const [announcements, setAnnouncements] = useState<Announcement[]>(SEED_ANNOUNCEMENTS);
  const [complaints, setComplaints] = useState<Complaint[]>(SEED_COMPLAINTS);
  const [notifications, setNotifications] = useState<InAppNotification[]>(SEED_NOTIFICATIONS);

  // UI Navigation & Guided Tour
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [demoGuideOpen, setDemoGuideOpen] = useState<boolean>(true);
  const [demoStep, setDemoStep] = useState<number>(1);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.subjects) setSubjects(parsed.subjects);
        if (parsed.attendance) setAttendance(parsed.attendance);
        if (parsed.results) setResults(parsed.results);
        if (parsed.timetable) setTimetable(parsed.timetable);
        if (parsed.announcements) setAnnouncements(parsed.announcements);
        if (parsed.complaints) setComplaints(parsed.complaints);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.currentUserId) {
          const u = (parsed.users || SEED_USERS).find((x: User) => x.id === parsed.currentUserId);
          if (u) setCurrentUser(u);
        }
      }
    } catch (e) {
      console.error('Failed to load CampusSphere data from localStorage:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync to LocalStorage on updates
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const dataToSave = {
        users,
        currentUserId: currentUser?.id,
        subjects,
        attendance,
        results,
        timetable,
        announcements,
        complaints,
        notifications
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Failed to save CampusSphere data to localStorage:', e);
    }
  }, [
    isInitialized,
    users,
    currentUser,
    subjects,
    attendance,
    results,
    timetable,
    announcements,
    complaints,
    notifications
  ]);

  // Reset demo data
  const resetDemoData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setUsers(SEED_USERS);
      setCurrentUser(SEED_USERS[0]);
      setSubjects(SEED_SUBJECTS);
      setAttendance(SEED_ATTENDANCE);
      setResults(SEED_RESULTS);
      setTimetable(SEED_TIMETABLE);
      setAnnouncements(SEED_ANNOUNCEMENTS);
      setComplaints(SEED_COMPLAINTS);
      setNotifications(SEED_NOTIFICATIONS);
      setActiveTab('dashboard');
      setSelectedComplaintId(null);
      setDemoStep(1);
    } catch (e) {
      console.error('Error resetting demo data:', e);
    }
  };

  // Auth / Role switches
  const loginAsRole = (role: UserRole) => {
    let targetUser: User | undefined;
    if (role === 'student') {
      targetUser = users.find((u) => u.id === 'usr_student_aarav') || users.find((u) => u.role === 'student');
    } else if (role === 'faculty') {
      targetUser = users.find((u) => u.id === 'usr_faculty_rajesh') || users.find((u) => u.role === 'faculty');
    } else if (role === 'admin') {
      targetUser = users.find((u) => u.id === 'usr_admin_meera') || users.find((u) => u.role === 'admin');
    }
    if (targetUser) {
      setCurrentUser(targetUser);
      setActiveTab('dashboard');
    }
  };

  const loginWithEmail = (email: string, role: UserRole): boolean => {
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.role === role);
    if (found) {
      setCurrentUser(found);
      setActiveTab('dashboard');
      return true;
    }
    // Fallback: match by role if email doesn't match exactly
    const roleDefault = users.find((u) => u.role === role);
    if (roleDefault) {
      setCurrentUser(roleDefault);
      setActiveTab('dashboard');
      return true;
    }
    return false;
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setActiveTab('dashboard');
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Complaint Management Operations
  const submitComplaint = (data: {
    title: string;
    description: string;
    category: any;
    location: string;
    priority?: ComplaintPriority;
    photoUrl?: string;
  }): Complaint => {
    if (!currentUser) throw new Error('Must be logged in to submit a complaint');

    // Rule-based priority evaluation
    const evaluation = evaluateComplaintPriority(data.category, data.title, data.description);
    const chosenPriority = data.priority || evaluation.priority;
    const dueDate = calculateDueDate(chosenPriority);

    // Generate unique ID like CMP-1043
    const nextNumber = 1043 + complaints.length;
    const newId = `CMP-${nextNumber}`;
    const timestamp = new Date().toISOString();

    const newComplaint: Complaint = {
      id: newId,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      location: data.location.trim(),
      priority: chosenPriority,
      suggestedPriority: evaluation.priority,
      isSafetyHazard: evaluation.isSafetyHazard,
      status: 'Submitted',
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reporterRole: currentUser.role,
      reporterEmail: currentUser.email,
      reporterPhone: currentUser.phone,
      assignedDepartment: evaluation.departmentSuggestion,
      createdAt: timestamp,
      updatedAt: timestamp,
      dueDate,
      photoUrl: data.photoUrl,
      comments: [],
      statusHistory: [
        {
          id: `hist_${newId}_1`,
          fromStatus: 'Submitted',
          toStatus: 'Submitted',
          changedBy: currentUser.name,
          changerRole: currentUser.role,
          timestamp,
          note: `Complaint created. Priority assessed as ${chosenPriority}${
            evaluation.isSafetyHazard ? ' [SAFETY HAZARD FLAGGED]' : ''
          }.`
        }
      ]
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // Send notifications to Admin and Reporter
    const adminNotification: InAppNotification = {
      id: `notif_${Date.now()}_admin`,
      userId: 'usr_admin_meera',
      title: `New Complaint: ${newComplaint.id}`,
      message: `${newComplaint.title} at ${newComplaint.location} (${newComplaint.priority} Priority)`,
      timestamp,
      read: false,
      type: 'complaint',
      complaintId: newComplaint.id
    };

    const reporterNotification: InAppNotification = {
      id: `notif_${Date.now()}_reporter`,
      userId: currentUser.id,
      title: `Complaint Submitted: ${newComplaint.id}`,
      message: `Your issue "${newComplaint.title}" has been registered and scheduled for triage.`,
      timestamp,
      read: false,
      type: 'complaint',
      complaintId: newComplaint.id
    };

    setNotifications((prev) => [adminNotification, reporterNotification, ...prev]);

    return newComplaint;
  };

  const assignComplaint = (
    complaintId: string,
    department: string,
    staffId?: string,
    dueDate?: string,
    priorityOverride?: ComplaintPriority,
    adminNote?: string
  ) => {
    const timestamp = new Date().toISOString();
    const assignedStaff = staffId ? users.find((u) => u.id === staffId) : undefined;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const newPriority = priorityOverride || c.priority;
        const newDueDate = dueDate || c.dueDate;
        const nextStatus: ComplaintStatus = 'Assigned';

        const historyItem = {
          id: `hist_${Date.now()}`,
          fromStatus: c.status,
          toStatus: nextStatus,
          changedBy: currentUser?.name || 'Administrator',
          changerRole: (currentUser?.role || 'admin') as UserRole,
          timestamp,
          note: `Assigned to ${department}${
            assignedStaff ? ` (${assignedStaff.name})` : ''
          }.${adminNote ? ` Note: ${adminNote}` : ''}${
            priorityOverride && priorityOverride !== c.priority
              ? ` Priority updated from ${c.priority} to ${priorityOverride}.`
              : ''
          }`
        };

        return {
          ...c,
          status: nextStatus,
          assignedDepartment: department,
          assignedStaffId: staffId || c.assignedStaffId,
          assignedStaffName: assignedStaff ? assignedStaff.name : c.assignedStaffName,
          priority: newPriority,
          dueDate: newDueDate,
          updatedAt: timestamp,
          adminNotes: adminNote ? `${c.adminNotes ? `${c.adminNotes}\n` : ''}${adminNote}` : c.adminNotes,
          statusHistory: [...c.statusHistory, historyItem]
        };
      })
    );

    // Notify assigned staff
    if (assignedStaff) {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}_staff`,
          userId: assignedStaff.id,
          title: `Assignment: ${complaintId}`,
          message: `You were assigned complaint "${complaintId}". Priority: ${priorityOverride || 'High'}.`,
          timestamp,
          read: false,
          type: 'complaint',
          complaintId
        },
        ...prev
      ]);
    }
  };

  const updateComplaintStatus = (
    complaintId: string,
    newStatus: ComplaintStatus,
    note?: string,
    actionTaken?: string,
    evidenceDetails?: string,
    resolutionNotes?: string
  ) => {
    const timestamp = new Date().toISOString();

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const historyItem = {
          id: `hist_${Date.now()}`,
          fromStatus: c.status,
          toStatus: newStatus,
          changedBy: currentUser?.name || 'Staff Member',
          changerRole: (currentUser?.role || 'faculty') as UserRole,
          timestamp,
          note: note || `Status transitioned to ${newStatus}.`
        };

        const updated: Complaint = {
          ...c,
          status: newStatus,
          updatedAt: timestamp,
          actionTaken: actionTaken || c.actionTaken,
          evidenceDetails: evidenceDetails || c.evidenceDetails,
          resolutionNotes: resolutionNotes || c.resolutionNotes,
          statusHistory: [...c.statusHistory, historyItem]
        };

        if (newStatus === 'Resolved') {
          updated.resolvedBy = currentUser?.name || 'Staff Specialist';
          updated.resolvedAt = timestamp;
          if (resolutionNotes) updated.resolutionNotes = resolutionNotes;
        }

        return updated;
      })
    );

    // Notify the reporter if resolved
    const targetComplaint = complaints.find((c) => c.id === complaintId);
    if (targetComplaint && newStatus === 'Resolved') {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}_res`,
          userId: targetComplaint.reporterId,
          title: `Complaint Resolved: ${complaintId}`,
          message: `Your issue "${targetComplaint.title}" has been marked Resolved. Please review and confirm or reopen.`,
          timestamp,
          read: false,
          type: 'complaint',
          complaintId
        },
        ...prev
      ]);
    }
  };

  const updateComplaintPriority = (complaintId: string, priority: ComplaintPriority, note?: string) => {
    const timestamp = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          priority,
          updatedAt: timestamp,
          statusHistory: [
            ...c.statusHistory,
            {
              id: `hist_${Date.now()}`,
              fromStatus: c.status,
              toStatus: c.status,
              changedBy: currentUser?.name || 'Administrator',
              changerRole: (currentUser?.role || 'admin') as UserRole,
              timestamp,
              note: note || `Priority updated to ${priority}.`
            }
          ]
        };
      })
    );
  };

  const addComplaintComment = (complaintId: string, text: string) => {
    if (!currentUser || !text.trim()) return;
    const timestamp = new Date().toISOString();
    const comment = {
      id: `cmt_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      text: text.trim(),
      timestamp
    };

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          comments: [...c.comments, comment],
          updatedAt: timestamp
        };
      })
    );
  };

  const verifyComplaintResolution = (complaintId: string, confirmed: boolean, feedback?: string) => {
    const timestamp = new Date().toISOString();
    if (confirmed) {
      // Mark as Closed
      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id !== complaintId) return c;
          return {
            ...c,
            status: 'Closed',
            updatedAt: timestamp,
            statusHistory: [
              ...c.statusHistory,
              {
                id: `hist_${Date.now()}`,
                fromStatus: c.status,
                toStatus: 'Closed',
                changedBy: currentUser?.name || 'Reporter',
                changerRole: (currentUser?.role || 'student') as UserRole,
                timestamp,
                note: feedback
                  ? `Reporter confirmed resolution: "${feedback}"`
                  : 'Reporter confirmed resolution. Ticket closed successfully.'
              }
            ]
          };
        })
      );
    } else {
      // Reopen
      reopenComplaint(complaintId, feedback || 'Problem persists or was not satisfactorily resolved.');
    }
  };

  const reopenComplaint = (complaintId: string, reason: string) => {
    const timestamp = new Date().toISOString();
    const target = complaints.find((c) => c.id === complaintId);

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          status: 'Reopened',
          reopenReason: reason,
          updatedAt: timestamp,
          statusHistory: [
            ...c.statusHistory,
            {
              id: `hist_${Date.now()}`,
              fromStatus: c.status,
              toStatus: 'Reopened',
              changedBy: currentUser?.name || 'Reporter',
              changerRole: (currentUser?.role || 'student') as UserRole,
              timestamp,
              note: `Ticket reopened by reporter. Reason: "${reason}"`
            }
          ]
        };
      })
    );

    // Notify Admin and Assigned Staff that complaint was reopened
    if (target) {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}_reopen_adm`,
          userId: 'usr_admin_meera',
          title: `Complaint Reopened: ${complaintId}`,
          message: `Student reopened "${target.title}". Reason: ${reason}`,
          timestamp,
          read: false,
          type: 'complaint',
          complaintId
        },
        ...(target.assignedStaffId
          ? [
              {
                id: `notif_${Date.now()}_reopen_staff`,
                userId: target.assignedStaffId,
                title: `Complaint Reopened: ${complaintId}`,
                message: `Work on "${target.title}" was rejected by reporter. Reason: ${reason}`,
                timestamp,
                read: false,
                type: 'complaint' as const,
                complaintId
              }
            ]
          : []),
        ...prev
      ]);
    }
  };

  // Student Attendance Summary calculation
  const getStudentAttendanceSummary = (studentId: string) => {
    const studentRecords = attendance.filter((a) => a.studentId === studentId);

    const summaries: SubjectAttendanceSummary[] = subjects.map((sub) => {
      const recordsForSub = studentRecords.filter((a) => a.subjectId === sub.id);
      const totalClasses = recordsForSub.length;
      const attendedClasses = recordsForSub.filter((a) => a.status === 'present' || a.status === 'late').length;
      const percentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 1000) / 10 : 0;

      return {
        subjectId: sub.id,
        subjectName: sub.name,
        subjectCode: sub.code,
        totalClasses,
        attendedClasses,
        percentage,
        isLowAttendance: totalClasses > 0 && percentage < 75.0,
        facultyName: sub.facultyName
      };
    });

    const totalClasses = summaries.reduce((acc, s) => acc + s.totalClasses, 0);
    const totalAttended = summaries.reduce((acc, s) => acc + s.attendedClasses, 0);
    const overallPercentage =
      totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 1000) / 10 : 0;
    const lowAttendanceCount = summaries.filter((s) => s.isLowAttendance).length;

    return {
      summaries,
      overallPercentage,
      totalClasses,
      totalAttended,
      lowAttendanceCount
    };
  };

  const saveAttendanceForClass = (
    subjectId: string,
    date: string,
    records: { studentId: string; status: 'present' | 'absent' | 'late' }[]
  ) => {
    setAttendance((prev) => {
      // Remove any existing records for this subject and date
      const filtered = prev.filter((r) => !(r.subjectId === subjectId && r.date === date));
      const newRecords: AttendanceRecord[] = records.map((rec, idx) => {
        const student = users.find((u) => u.id === rec.studentId);
        return {
          id: `att_${Date.now()}_${idx}`,
          studentId: rec.studentId,
          studentName: student?.name || 'Student',
          rollNumber: student?.idNumber || 'CS-2023-000',
          subjectId,
          date,
          status: rec.status
        };
      });
      return [...filtered, ...newRecords];
    });
  };

  // Student Results calculation
  const getStudentResults = (studentId: string) => {
    const studentRes = results.filter((r) => r.studentId === studentId);
    let totalScore = 0;
    let totalMax = 0;
    let earnedCredits = 0;
    let totalCredits = 0;
    let qualityPoints = 0;

    studentRes.forEach((res) => {
      totalScore += res.marksObtained;
      totalMax += res.maxMarks;
      const sub = subjects.find((s) => s.id === res.subjectId);
      const credits = sub ? sub.credits : 3;
      totalCredits += credits;

      // Grade point calculation
      let gp = 0;
      switch (res.grade) {
        case 'O':
          gp = 10;
          break;
        case 'A+':
          gp = 9;
          break;
        case 'A':
          gp = 8;
          break;
        case 'B+':
          gp = 7;
          break;
        case 'B':
          gp = 6;
          break;
        case 'C':
          gp = 5;
          break;
        default:
          gp = 0;
      }
      if (res.grade !== 'F') {
        earnedCredits += credits;
      }
      qualityPoints += gp * credits;
    });

    const percentage = totalMax > 0 ? Math.round((totalScore / totalMax) * 1000) / 10 : 0;
    const cgpa = totalCredits > 0 ? Math.round((qualityPoints / totalCredits) * 100) / 100 : 0;

    return {
      results: studentRes,
      cgpa,
      percentage,
      totalCredits,
      earnedCredits
    };
  };

  const saveExamMarks = (
    records: {
      studentId: string;
      subjectId: string;
      examType: 'Mid-Term' | 'End-Term' | 'Internal' | 'Practical';
      marksObtained: number;
      maxMarks: number;
    }[]
  ) => {
    setResults((prev) => {
      const next = [...prev];
      records.forEach((rec) => {
        const student = users.find((u) => u.id === rec.studentId);
        const sub = subjects.find((s) => s.id === rec.subjectId);
        const pct = (rec.marksObtained / rec.maxMarks) * 100;
        let grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F' = 'C';
        if (pct >= 90) grade = 'O';
        else if (pct >= 80) grade = 'A+';
        else if (pct >= 70) grade = 'A';
        else if (pct >= 60) grade = 'B+';
        else if (pct >= 50) grade = 'B';
        else if (pct >= 40) grade = 'C';
        else grade = 'F';

        const existingIdx = next.findIndex(
          (r) =>
            r.studentId === rec.studentId &&
            r.subjectId === rec.subjectId &&
            r.examType === rec.examType
        );

        const newResult: ExamResult = {
          id: existingIdx >= 0 ? next[existingIdx].id : `res_${Date.now()}_${rec.studentId}`,
          studentId: rec.studentId,
          studentName: student?.name || 'Student',
          rollNumber: student?.idNumber || 'CS-2023-000',
          subjectId: rec.subjectId,
          subjectCode: sub?.code || 'CS401',
          subjectName: sub?.name || 'Course',
          examType: rec.examType,
          marksObtained: rec.marksObtained,
          maxMarks: rec.maxMarks,
          grade,
          semester: sub?.semester || 4,
          academicYear: '2026-2027'
        };

        if (existingIdx >= 0) {
          next[existingIdx] = newResult;
        } else {
          next.push(newResult);
        }
      });
      return next;
    });
  };

  // Directories & Announcements
  const addStudent = (data: Partial<User>) => {
    const newStudent: User = {
      id: `usr_student_${Date.now()}`,
      name: data.name || 'New Student',
      email: data.email || 'student@campussphere.edu',
      role: 'student',
      department: data.department || 'Computer Science & Engineering',
      idNumber: data.idNumber || `CS-2023-${Math.floor(100 + Math.random() * 900)}`,
      semester: data.semester || 4,
      batch: data.batch || '2023-2027',
      phone: data.phone || '+91 98000 00000',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
    };
    setUsers((prev) => [...prev, newStudent]);
  };

  const addStaff = (data: Partial<User>) => {
    const newStaff: User = {
      id: `usr_staff_${Date.now()}`,
      name: data.name || 'New Faculty',
      email: data.email || 'faculty@campussphere.edu',
      role: 'faculty',
      department: data.department || 'Electrical Maintenance',
      designation: data.designation || 'Lecturer',
      idNumber: data.idNumber || `EMP-FAC-${Math.floor(200 + Math.random() * 800)}`,
      phone: data.phone || '+91 94000 00000',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200'
    };
    setUsers((prev) => [...prev, newStaff]);
  };

  const addAnnouncement = (data: Omit<Announcement, 'id' | 'date'>) => {
    const newAnc: Announcement = {
      ...data,
      id: `anc_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements((prev) => [newAnc, ...prev]);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // CSV Export utilities
  const exportComplaintsCSV = (filteredComplaints?: Complaint[]) => {
    const list = filteredComplaints || complaints;
    const headers = [
      'Complaint ID',
      'Title',
      'Category',
      'Location',
      'Priority',
      'Status',
      'Reporter',
      'Assigned Department',
      'Assigned Staff',
      'Due Date',
      'Created At',
      'Resolved At'
    ];
    const rows = list.map((c) => [
      `"${c.id}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.category}"`,
      `"${c.location.replace(/"/g, '""')}"`,
      `"${c.priority}"`,
      `"${c.status}"`,
      `"${c.reporterName}"`,
      `"${c.assignedDepartment}"`,
      `"${c.assignedStaffName || 'Unassigned'}"`,
      `"${c.dueDate}"`,
      `"${c.createdAt.split('T')[0]}"`,
      `"${c.resolvedAt ? c.resolvedAt.split('T')[0] : 'N/A'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CampusSphere_Complaints_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAttendanceCSV = (studentId?: string) => {
    const records = studentId ? attendance.filter((a) => a.studentId === studentId) : attendance;
    const headers = ['Record ID', 'Student Roll', 'Student Name', 'Subject ID', 'Date', 'Status'];
    const rows = records.map((r) => [
      `"${r.id}"`,
      `"${r.rollNumber}"`,
      `"${r.studentName}"`,
      `"${r.subjectId}"`,
      `"${r.date}"`,
      `"${r.status.toUpperCase()}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CampusSphere_Attendance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportResultsCSV = () => {
    const headers = [
      'Roll Number',
      'Student Name',
      'Subject Code',
      'Subject Name',
      'Exam Type',
      'Marks Obtained',
      'Max Marks',
      'Percentage',
      'Grade'
    ];
    const rows = results.map((r) => [
      `"${r.rollNumber}"`,
      `"${r.studentName}"`,
      `"${r.subjectCode}"`,
      `"${r.subjectName}"`,
      `"${r.examType}"`,
      r.marksObtained,
      r.maxMarks,
      `${Math.round((r.marksObtained / r.maxMarks) * 100)}%`,
      `"${r.grade}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CampusSphere_Results_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        subjects,
        attendance,
        results,
        timetable,
        announcements,
        complaints,
        notifications,
        activeTab,
        setActiveTab,
        selectedComplaintId,
        setSelectedComplaintId,
        demoGuideOpen,
        setDemoGuideOpen,
        demoStep,
        setDemoStep,
        loginAsRole,
        loginWithEmail,
        switchUser,
        logout,
        resetDemoData,
        submitComplaint,
        assignComplaint,
        updateComplaintStatus,
        updateComplaintPriority,
        addComplaintComment,
        verifyComplaintResolution,
        reopenComplaint,
        getStudentAttendanceSummary,
        saveAttendanceForClass,
        getStudentResults,
        saveExamMarks,
        addStudent,
        addStaff,
        addAnnouncement,
        markNotificationRead,
        markAllNotificationsRead,
        exportComplaintsCSV,
        exportAttendanceCSV,
        exportResultsCSV
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
