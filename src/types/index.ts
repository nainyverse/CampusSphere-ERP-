export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
  idNumber: string; // Roll number or Employee ID
  semester?: number;
  batch?: string;
  designation?: string;
  phone?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: number;
  credits: number;
  facultyId: string;
  facultyName: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface SubjectAttendanceSummary {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  isLowAttendance: boolean; // < 75%
  facultyName: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  examType: 'Mid-Term' | 'End-Term' | 'Internal' | 'Practical';
  marksObtained: number;
  maxMarks: number;
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F';
  semester: number;
  academicYear: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlot: string;
  subjectName: string;
  subjectCode: string;
  room: string;
  facultyName: string;
  department: string;
  semester: number;
}

export type AnnouncementCategory = 'Academic' | 'Administrative' | 'Hostel' | 'Examination' | 'Events';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  authorName: string;
  authorRole: string;
  date: string;
  priority: 'low' | 'normal' | 'urgent';
}

export type ComplaintCategory =
  | 'Electrical maintenance'
  | 'Internet and Wi-Fi'
  | 'Classroom facilities'
  | 'Washroom and sanitation'
  | 'Water supply'
  | 'Laboratory equipment'
  | 'Library'
  | 'Transport'
  | 'Academic administration'
  | 'Other';

export type ComplaintPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed'
  | 'Rejected'
  | 'Blocked'
  | 'Reopened';

export interface ComplaintComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  timestamp: string;
}

export interface ComplaintStatusHistoryItem {
  id: string;
  fromStatus: ComplaintStatus;
  toStatus: ComplaintStatus;
  changedBy: string;
  changerRole: UserRole;
  timestamp: string;
  note?: string;
}

export interface Complaint {
  id: string; // e.g. CMP-1042
  title: string;
  description: string;
  category: ComplaintCategory;
  location: string;
  priority: ComplaintPriority;
  suggestedPriority?: ComplaintPriority;
  isSafetyHazard: boolean;
  status: ComplaintStatus;
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  reporterEmail: string;
  reporterPhone?: string;
  assignedDepartment: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string; // ISO or YYYY-MM-DD
  resolutionNotes?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  actionTaken?: string;
  evidenceDetails?: string;
  reopenReason?: string;
  photoUrl?: string;
  comments: ComplaintComment[];
  statusHistory: ComplaintStatusHistoryItem[];
  adminNotes?: string;
}

export interface InAppNotification {
  id: string;
  userId: string; // or 'all'
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'complaint' | 'attendance' | 'academic' | 'general';
  complaintId?: string;
}
