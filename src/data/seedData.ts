import {
  User,
  Subject,
  AttendanceRecord,
  ExamResult,
  TimetableSlot,
  Announcement,
  Complaint,
  InAppNotification
} from '../types';

export const SEED_USERS: User[] = [
  {
    id: 'usr_student_aarav',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@campussphere.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    department: 'Computer Science & Engineering',
    idNumber: 'CS-2023-041',
    semester: 4,
    batch: '2023-2027',
    phone: '+91 98765 43210'
  },
  {
    id: 'usr_student_priya',
    name: 'Priya Patel',
    email: 'priya.patel@campussphere.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    department: 'Computer Science & Engineering',
    idNumber: 'CS-2023-042',
    semester: 4,
    batch: '2023-2027',
    phone: '+91 98765 43211'
  },
  {
    id: 'usr_student_rohan',
    name: 'Rohan Das',
    email: 'rohan.das@campussphere.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    department: 'Computer Science & Engineering',
    idNumber: 'CS-2023-043',
    semester: 4,
    batch: '2023-2027',
    phone: '+91 98765 43212'
  },
  {
    id: 'usr_student_ananya',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@campussphere.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    department: 'Computer Science & Engineering',
    idNumber: 'CS-2023-044',
    semester: 4,
    batch: '2023-2027',
    phone: '+91 98765 43213'
  },
  {
    id: 'usr_student_vikram',
    name: 'Vikram Singh',
    email: 'vikram.singh@campussphere.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    department: 'Computer Science & Engineering',
    idNumber: 'CS-2023-045',
    semester: 4,
    batch: '2023-2027',
    phone: '+91 98765 43214'
  },
  {
    id: 'usr_faculty_rajesh',
    name: 'Prof. Rajesh Verma',
    email: 'rajesh.verma@campussphere.edu',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    department: 'Electrical Maintenance',
    designation: 'Associate Professor & Maintenance Lead',
    idNumber: 'EMP-FAC-102',
    phone: '+91 94123 45678'
  },
  {
    id: 'usr_faculty_sanjay',
    name: 'Dr. Sanjay Gupta',
    email: 'sanjay.gupta@campussphere.edu',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    department: 'Computer Science & Engineering',
    designation: 'Professor & Department Head',
    idNumber: 'EMP-FAC-105',
    phone: '+91 94123 78901'
  },
  {
    id: 'usr_faculty_anita',
    name: 'Prof. Anita Sen',
    email: 'anita.sen@campussphere.edu',
    role: 'faculty',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    department: 'Mathematics & Computing',
    designation: 'Assistant Professor',
    idNumber: 'EMP-FAC-108',
    phone: '+91 94123 11223'
  },
  {
    id: 'usr_admin_meera',
    name: 'Dr. Meera Rao',
    email: 'dean.rao@campussphere.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    department: 'Office of Campus Administration',
    designation: 'Dean of Academic & Campus Operations',
    idNumber: 'EMP-ADM-001',
    phone: '+91 98111 22334'
  }
];

export const SEED_SUBJECTS: Subject[] = [
  {
    id: 'sub_cs401',
    code: 'CS401',
    name: 'Database Management Systems',
    department: 'Computer Science & Engineering',
    semester: 4,
    credits: 4,
    facultyId: 'usr_faculty_sanjay',
    facultyName: 'Dr. Sanjay Gupta'
  },
  {
    id: 'sub_cs402',
    code: 'CS402',
    name: 'Design & Analysis of Algorithms',
    department: 'Computer Science & Engineering',
    semester: 4,
    credits: 4,
    facultyId: 'usr_faculty_sanjay',
    facultyName: 'Dr. Sanjay Gupta'
  },
  {
    id: 'sub_cs403',
    code: 'CS403',
    name: 'Computer Networks',
    department: 'Computer Science & Engineering',
    semester: 4,
    credits: 3,
    facultyId: 'usr_faculty_rajesh',
    facultyName: 'Prof. Rajesh Verma'
  },
  {
    id: 'sub_cs404',
    code: 'CS404',
    name: 'Operating Systems & Architecture',
    department: 'Computer Science & Engineering',
    semester: 4,
    credits: 4,
    facultyId: 'usr_faculty_anita',
    facultyName: 'Prof. Anita Sen'
  },
  {
    id: 'sub_cs405',
    code: 'CS405',
    name: 'Software Engineering Principles',
    department: 'Computer Science & Engineering',
    semester: 4,
    credits: 3,
    facultyId: 'usr_faculty_sanjay',
    facultyName: 'Dr. Sanjay Gupta'
  }
];

// Seed Attendance Records for Semester 4 students
export const SEED_ATTENDANCE: AttendanceRecord[] = [
  // Aarav Sharma CS401 (DBMS) - 24/28 = 85.7%
  ...Array.from({ length: 28 }, (_, i) => ({
    id: `att_cs401_${i}`,
    studentId: 'usr_student_aarav',
    studentName: 'Aarav Sharma',
    rollNumber: 'CS-2023-041',
    subjectId: 'sub_cs401',
    date: `2026-09-${String((i % 25) + 1).padStart(2, '0')}`,
    status: (i === 3 || i === 9 || i === 18 || i === 22 ? 'absent' : 'present') as any
  })),

  // Aarav Sharma CS402 (Algorithms) - 26/30 = 86.6%
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `att_cs402_${i}`,
    studentId: 'usr_student_aarav',
    studentName: 'Aarav Sharma',
    rollNumber: 'CS-2023-041',
    subjectId: 'sub_cs402',
    date: `2026-09-${String((i % 25) + 1).padStart(2, '0')}`,
    status: (i === 5 || i === 12 || i === 25 || i === 28 ? 'absent' : 'present') as any
  })),

  // Aarav Sharma CS403 (Computer Networks) - 16/24 = 66.6% (< 75% Critical Attendance Alert!)
  ...Array.from({ length: 24 }, (_, i) => ({
    id: `att_cs403_${i}`,
    studentId: 'usr_student_aarav',
    studentName: 'Aarav Sharma',
    rollNumber: 'CS-2023-041',
    subjectId: 'sub_cs403',
    date: `2026-09-${String((i % 25) + 1).padStart(2, '0')}`,
    status: ([2, 4, 7, 10, 13, 16, 19, 21].includes(i) ? 'absent' : 'present') as any
  })),

  // Aarav Sharma CS404 (Operating Systems) - 27/29 = 93.1%
  ...Array.from({ length: 29 }, (_, i) => ({
    id: `att_cs404_${i}`,
    studentId: 'usr_student_aarav',
    studentName: 'Aarav Sharma',
    rollNumber: 'CS-2023-041',
    subjectId: 'sub_cs404',
    date: `2026-09-${String((i % 25) + 1).padStart(2, '0')}`,
    status: (i === 8 || i === 20 ? 'absent' : 'present') as any
  })),

  // Aarav Sharma CS405 (Software Engineering) - 22/25 = 88.0%
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `att_cs405_${i}`,
    studentId: 'usr_student_aarav',
    studentName: 'Aarav Sharma',
    rollNumber: 'CS-2023-041',
    subjectId: 'sub_cs405',
    date: `2026-09-${String((i % 25) + 1).padStart(2, '0')}`,
    status: (i === 4 || i === 14 || i === 23 ? 'absent' : 'present') as any
  })),

  // Priya Patel records
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `att_priya_${i}`,
    studentId: 'usr_student_priya',
    studentName: 'Priya Patel',
    rollNumber: 'CS-2023-042',
    subjectId: 'sub_cs401',
    date: `2026-09-${String((i % 25) + 1).padStart(2, '0')}`,
    status: (i === 10 ? 'absent' : 'present') as any
  }))
];

export const SEED_RESULTS: ExamResult[] = [
  {
    id: 'res_01',
    studentId: 'usr_student_aarav',
    studentName: 'Aarav Sharma',
    rollNumber: 'CS-2023-041',
    subjectId: 'sub_cs401',
    subjectCode: 'CS401',
    subjectName: 'Database Management Systems',
    examType: 'Mid-Term',
    marksObtained: 88,
    maxMarks: 100,
    grade: 'A+',
    semester: 4,
    academicYear: '2026-2027'
  },
  {
    id: 'res_02',
    studentId: 'usr_student_aarav',
    studentName: 'Aarav Sharma',
    rollNumber: 'CS-2023-041',
    subjectId: 'sub_cs402',
    subjectCode: 'CS402',
    subjectName: 'Design & Analysis of Algorithms',
    examType: 'Mid-Term',
    marksObtained: 92,
    maxMarks: 100,
    grade: 'O',
    semester: 4,
    academicYear: '2026-2027'
  },
  {
    id: 'res_03',
    studentId: 'usr_student_aarav',
    studentName: 'Aarav Sharma',
    rollNumber: 'CS-2023-041',
    subjectId: 'sub_cs403',
    subjectCode: 'CS403',
    subjectName: 'Computer Networks',
    examType: 'Mid-Term',
    marksObtained: 74,
    maxMarks: 100,
    grade: 'B+',
    semester: 4,
    academicYear: '2026-2027'
  },
  {
    id: 'res_04',
    studentId: 'usr_student_aarav',
    studentName: 'Aarav Sharma',
    rollNumber: 'CS-2023-041',
    subjectId: 'sub_cs404',
    subjectCode: 'CS404',
    subjectName: 'Operating Systems & Architecture',
    examType: 'Mid-Term',
    marksObtained: 85,
    maxMarks: 100,
    grade: 'A',
    semester: 4,
    academicYear: '2026-2027'
  },
  {
    id: 'res_05',
    studentId: 'usr_student_aarav',
    studentName: 'Aarav Sharma',
    rollNumber: 'CS-2023-041',
    subjectId: 'sub_cs405',
    subjectCode: 'CS405',
    subjectName: 'Software Engineering Principles',
    examType: 'Mid-Term',
    marksObtained: 81,
    maxMarks: 100,
    grade: 'A',
    semester: 4,
    academicYear: '2026-2027'
  },
  // Priya Patel
  {
    id: 'res_06',
    studentId: 'usr_student_priya',
    studentName: 'Priya Patel',
    rollNumber: 'CS-2023-042',
    subjectId: 'sub_cs401',
    subjectCode: 'CS401',
    subjectName: 'Database Management Systems',
    examType: 'Mid-Term',
    marksObtained: 94,
    maxMarks: 100,
    grade: 'O',
    semester: 4,
    academicYear: '2026-2027'
  },
  // Rohan Das
  {
    id: 'res_07',
    studentId: 'usr_student_rohan',
    studentName: 'Rohan Das',
    rollNumber: 'CS-2023-043',
    subjectId: 'sub_cs401',
    subjectCode: 'CS401',
    subjectName: 'Database Management Systems',
    examType: 'Mid-Term',
    marksObtained: 76,
    maxMarks: 100,
    grade: 'B+',
    semester: 4,
    academicYear: '2026-2027'
  }
];

export const SEED_TIMETABLE: TimetableSlot[] = [
  {
    id: 'tt_1',
    day: 'Monday',
    timeSlot: '09:00 AM - 10:15 AM',
    subjectName: 'Database Management Systems',
    subjectCode: 'CS401',
    room: 'Room 201, Academic Block B',
    facultyName: 'Dr. Sanjay Gupta',
    department: 'Computer Science & Engineering',
    semester: 4
  },
  {
    id: 'tt_2',
    day: 'Monday',
    timeSlot: '10:30 AM - 11:45 AM',
    subjectName: 'Design & Analysis of Algorithms',
    subjectCode: 'CS402',
    room: 'Room 204, Academic Block B',
    facultyName: 'Dr. Sanjay Gupta',
    department: 'Computer Science & Engineering',
    semester: 4
  },
  {
    id: 'tt_3',
    day: 'Monday',
    timeSlot: '01:30 PM - 03:30 PM',
    subjectName: 'Computer Networks Lab',
    subjectCode: 'CS403L',
    room: 'Network Lab 3, Tech Tower',
    facultyName: 'Prof. Rajesh Verma',
    department: 'Computer Science & Engineering',
    semester: 4
  },
  {
    id: 'tt_4',
    day: 'Tuesday',
    timeSlot: '09:00 AM - 10:15 AM',
    subjectName: 'Operating Systems',
    subjectCode: 'CS404',
    room: 'Room 201, Academic Block B',
    facultyName: 'Prof. Anita Sen',
    department: 'Computer Science & Engineering',
    semester: 4
  },
  {
    id: 'tt_5',
    day: 'Tuesday',
    timeSlot: '10:30 AM - 11:45 AM',
    subjectName: 'Computer Networks',
    subjectCode: 'CS403',
    room: 'Room 204, Academic Block B',
    facultyName: 'Prof. Rajesh Verma',
    department: 'Computer Science & Engineering',
    semester: 4
  },
  {
    id: 'tt_6',
    day: 'Wednesday',
    timeSlot: '09:00 AM - 10:15 AM',
    subjectName: 'Software Engineering Principles',
    subjectCode: 'CS405',
    room: 'Seminar Hall 1',
    facultyName: 'Dr. Sanjay Gupta',
    department: 'Computer Science & Engineering',
    semester: 4
  },
  {
    id: 'tt_7',
    day: 'Wednesday',
    timeSlot: '11:00 AM - 12:15 PM',
    subjectName: 'Design & Analysis of Algorithms',
    subjectCode: 'CS402',
    room: 'Room 204, Academic Block B',
    facultyName: 'Dr. Sanjay Gupta',
    department: 'Computer Science & Engineering',
    semester: 4
  },
  {
    id: 'tt_8',
    day: 'Thursday',
    timeSlot: '09:00 AM - 10:15 AM',
    subjectName: 'Database Management Systems',
    subjectCode: 'CS401',
    room: 'Room 201, Academic Block B',
    facultyName: 'Dr. Sanjay Gupta',
    department: 'Computer Science & Engineering',
    semester: 4
  },
  {
    id: 'tt_9',
    day: 'Thursday',
    timeSlot: '02:00 PM - 04:00 PM',
    subjectName: 'DBMS Practical Lab',
    subjectCode: 'CS401L',
    room: 'Computer Lab 2, Tech Tower',
    facultyName: 'Dr. Sanjay Gupta',
    department: 'Computer Science & Engineering',
    semester: 4
  },
  {
    id: 'tt_10',
    day: 'Friday',
    timeSlot: '10:00 AM - 11:15 AM',
    subjectName: 'Operating Systems',
    subjectCode: 'CS404',
    room: 'Room 201, Academic Block B',
    facultyName: 'Prof. Anita Sen',
    department: 'Computer Science & Engineering',
    semester: 4
  },
  {
    id: 'tt_11',
    day: 'Friday',
    timeSlot: '11:30 AM - 12:45 PM',
    subjectName: 'Software Engineering',
    subjectCode: 'CS405',
    room: 'Seminar Hall 1',
    facultyName: 'Dr. Sanjay Gupta',
    department: 'Computer Science & Engineering',
    semester: 4
  }
];

export const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc_1',
    title: 'Mid-Semester Examination Schedule for Semester 4 Released',
    content:
      'The formal schedule for Mid-Semester examinations has been published on the Academic Portal. Hall tickets will be verified at the examination entrance. Please bring valid student ID cards.',
    category: 'Examination',
    authorName: 'Dr. Meera Rao',
    authorRole: 'Dean of Academic Administration',
    date: '2026-10-10',
    priority: 'urgent'
  },
  {
    id: 'anc_2',
    title: 'Smart Campus Wi-Fi 6 Upgrade in Academic Blocks B & C',
    content:
      'Campus IT & Networks is deploying high-density Wi-Fi 6 access points to eliminate connectivity dead zones during peak lecture hours. Work is scheduled from 6:00 PM onwards.',
    category: 'Administrative',
    authorName: 'Campus IT Operations',
    authorRole: 'Technical Cell',
    date: '2026-10-12',
    priority: 'normal'
  },
  {
    id: 'anc_3',
    title: 'HackCampus 2026 Annual Inter-College Hackathon Registration',
    content:
      'Registration is now open for our 36-hour annual hackathon with grand prizes and industry sponsorship from top tech leaders. Teams of 3-4 members are encouraged to submit project abstracts.',
    category: 'Events',
    authorName: 'Prof. Rajesh Verma',
    authorRole: 'Faculty Coordinator',
    date: '2026-10-08',
    priority: 'normal'
  },
  {
    id: 'anc_4',
    title: 'Hostel Water Distribution & Filtration Maintenance Notice',
    content:
      'Preventive sanitation and pressure balancing for Block D & E overhead reservoirs will be conducted on Saturday morning. Adequate alternate supply has been reserved.',
    category: 'Hostel',
    authorName: 'Estate Management',
    authorRole: 'Campus Estate Lead',
    date: '2026-10-06',
    priority: 'low'
  }
];

// Seed Complaints - Specially prepared with CMP-1042 for the presentation demo!
export const SEED_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-1042',
    title: 'Classroom fans and lights not working',
    description:
      'During afternoon lectures, three ceiling fans and the primary front light fixture in Room 204 are completely unresponsive. Students are experiencing severe heat and low board visibility.',
    category: 'Electrical maintenance',
    location: 'Block B, Room 204',
    priority: 'High',
    suggestedPriority: 'High',
    isSafetyHazard: false,
    status: 'Submitted',
    reporterId: 'usr_student_aarav',
    reporterName: 'Aarav Sharma',
    reporterRole: 'student',
    reporterEmail: 'aarav.sharma@campussphere.edu',
    reporterPhone: '+91 98765 43210',
    assignedDepartment: 'Electrical Maintenance',
    createdAt: '2026-10-13T10:15:00Z',
    updatedAt: '2026-10-13T10:15:00Z',
    dueDate: '2026-10-14',
    comments: [
      {
        id: 'cmt_1042_1',
        authorId: 'usr_student_aarav',
        authorName: 'Aarav Sharma',
        authorRole: 'student',
        text: 'The problem started two days ago during the Algorithms lecture. We tried the main switchboard MCB but it trips again.',
        timestamp: '2026-10-13T10:18:00Z'
      }
    ],
    statusHistory: [
      {
        id: 'hist_1042_1',
        fromStatus: 'Submitted',
        toStatus: 'Submitted',
        changedBy: 'Aarav Sharma',
        changerRole: 'student',
        timestamp: '2026-10-13T10:15:00Z',
        note: 'Complaint registered by student through CampusSphere portal.'
      }
    ]
  },
  {
    id: 'CMP-1039',
    title: 'Wi-Fi access point rebooting repeatedly in Library 2nd Floor',
    description:
      'Students in the digital reading section cannot maintain stable VPN and research portal connections. The AP light flashes amber every 4 minutes.',
    category: 'Internet and Wi-Fi',
    location: 'Central Library, 2nd Floor West Wing',
    priority: 'Medium',
    suggestedPriority: 'Medium',
    isSafetyHazard: false,
    status: 'In Progress',
    reporterId: 'usr_student_priya',
    reporterName: 'Priya Patel',
    reporterRole: 'student',
    reporterEmail: 'priya.patel@campussphere.edu',
    assignedDepartment: 'Campus IT & Networks',
    assignedStaffId: 'usr_faculty_rajesh',
    assignedStaffName: 'Prof. Rajesh Verma',
    createdAt: '2026-10-11T14:20:00Z',
    updatedAt: '2026-10-12T09:30:00Z',
    dueDate: '2026-10-14',
    actionTaken: 'Inspected PoE switch in rack 4B; firmware re-flashing underway.',
    comments: [
      {
        id: 'cmt_1039_1',
        authorId: 'usr_faculty_rajesh',
        authorName: 'Prof. Rajesh Verma',
        authorRole: 'faculty',
        text: 'Diagnosed intermittent PoE power drop from edge switch. Replacing port patch cable and updating AP microcode.',
        timestamp: '2026-10-12T09:35:00Z'
      }
    ],
    statusHistory: [
      {
        id: 'hist_1039_1',
        fromStatus: 'Submitted',
        toStatus: 'Submitted',
        changedBy: 'Priya Patel',
        changerRole: 'student',
        timestamp: '2026-10-11T14:20:00Z',
        note: 'Complaint lodged'
      },
      {
        id: 'hist_1039_2',
        fromStatus: 'Submitted',
        toStatus: 'Assigned',
        changedBy: 'Dr. Meera Rao',
        changerRole: 'admin',
        timestamp: '2026-10-11T16:00:00Z',
        note: 'Assigned to Campus IT team led by Prof. Rajesh Verma.'
      },
      {
        id: 'hist_1039_3',
        fromStatus: 'Assigned',
        toStatus: 'In Progress',
        changedBy: 'Prof. Rajesh Verma',
        changerRole: 'faculty',
        timestamp: '2026-10-12T09:30:00Z',
        note: 'Network technician dispatched with diagnostic equipment.'
      }
    ]
  },
  {
    id: 'CMP-1036',
    title: 'Water cooler filtration unit leaking on ground corridor',
    description:
      'Continuous water seepage from the main dispenser outlet is pooling near the Chemistry lab threshold, causing a slip hazard.',
    category: 'Water supply',
    location: 'Science Block C, Ground Floor Corridor',
    priority: 'Medium',
    suggestedPriority: 'Medium',
    isSafetyHazard: false,
    status: 'Resolved',
    reporterId: 'usr_student_aarav',
    reporterName: 'Aarav Sharma',
    reporterRole: 'student',
    reporterEmail: 'aarav.sharma@campussphere.edu',
    assignedDepartment: 'Plumbing & Water Works',
    assignedStaffId: 'usr_faculty_rajesh',
    assignedStaffName: 'Prof. Rajesh Verma',
    createdAt: '2026-10-09T08:45:00Z',
    updatedAt: '2026-10-10T16:00:00Z',
    dueDate: '2026-10-12',
    resolvedBy: 'Prof. Rajesh Verma',
    resolvedAt: '2026-10-10T16:00:00Z',
    resolutionNotes:
      'Replaced fractured copper coupling on inlet solenoid valve and tested at 4.2 bar pressure. No leakage observed. Spill wiped clean.',
    evidenceDetails: 'Work order #PL-8821 closed. New Teflon seal installed.',
    comments: [
      {
        id: 'cmt_1036_1',
        authorId: 'usr_faculty_rajesh',
        authorName: 'Prof. Rajesh Verma',
        authorRole: 'faculty',
        text: 'The valve was replaced today at 3:30 PM. Please verify and confirm so this ticket can be formally closed.',
        timestamp: '2026-10-10T16:02:00Z'
      }
    ],
    statusHistory: [
      {
        id: 'hist_1036_1',
        fromStatus: 'Submitted',
        toStatus: 'Assigned',
        changedBy: 'Dr. Meera Rao',
        changerRole: 'admin',
        timestamp: '2026-10-09T09:30:00Z',
        note: 'Assigned to plumbing maintenance'
      },
      {
        id: 'hist_1036_2',
        fromStatus: 'Assigned',
        toStatus: 'In Progress',
        changedBy: 'Prof. Rajesh Verma',
        changerRole: 'faculty',
        timestamp: '2026-10-10T10:00:00Z',
        note: 'Parts procured from central warehouse'
      },
      {
        id: 'hist_1036_3',
        fromStatus: 'In Progress',
        toStatus: 'Resolved',
        changedBy: 'Prof. Rajesh Verma',
        changerRole: 'faculty',
        timestamp: '2026-10-10T16:00:00Z',
        note: 'Valve replaced and corridor dried.'
      }
    ]
  },
  {
    id: 'CMP-1031',
    title: 'Bare exposed wire with sparking near main electrical feeder',
    description:
      'Emergency safety hazard: High voltage wire exposed with visible sparking next to walkway near cafeteria substation.',
    category: 'Electrical maintenance',
    location: 'Cafeteria Outer Substation, Pillar 3',
    priority: 'Critical',
    suggestedPriority: 'Critical',
    isSafetyHazard: true,
    status: 'Closed',
    reporterId: 'usr_student_rohan',
    reporterName: 'Rohan Das',
    reporterRole: 'student',
    reporterEmail: 'rohan.das@campussphere.edu',
    assignedDepartment: 'Electrical Maintenance',
    assignedStaffId: 'usr_faculty_rajesh',
    assignedStaffName: 'Prof. Rajesh Verma',
    createdAt: '2026-10-05T09:00:00Z',
    updatedAt: '2026-10-05T13:30:00Z',
    dueDate: '2026-10-05',
    resolvedBy: 'Prof. Rajesh Verma',
    resolvedAt: '2026-10-05T12:00:00Z',
    resolutionNotes: 'Conduit re-sleeved in IP66 rated weatherproof casing. Verified insulation resistance at 100 MegOhms.',
    comments: [],
    statusHistory: [
      {
        id: 'hist_1031_1',
        fromStatus: 'Submitted',
        toStatus: 'Assigned',
        changedBy: 'System Safety Monitor',
        changerRole: 'admin',
        timestamp: '2026-10-05T09:05:00Z',
        note: 'Critical safety auto-flagged. Escalated to electrical in-charge.'
      },
      {
        id: 'hist_1031_2',
        fromStatus: 'Assigned',
        toStatus: 'Resolved',
        changedBy: 'Prof. Rajesh Verma',
        changerRole: 'faculty',
        timestamp: '2026-10-05T12:00:00Z',
        note: 'Immediate isolation and re-sleeving completed.'
      },
      {
        id: 'hist_1031_3',
        fromStatus: 'Resolved',
        toStatus: 'Closed',
        changedBy: 'Dr. Meera Rao',
        changerRole: 'admin',
        timestamp: '2026-10-05T13:30:00Z',
        note: 'Audit approved by Campus Safety Committee.'
      }
    ]
  },
  {
    id: 'CMP-1040',
    title: 'Ceiling projector HDMI input port broken in Seminar Hall 2',
    description:
      'Guest lecture presentations cannot connect via HDMI. Display shows "No Signal" regardless of cable used.',
    category: 'Classroom facilities',
    location: 'Seminar Hall 2, Central Block',
    priority: 'Medium',
    suggestedPriority: 'Medium',
    isSafetyHazard: false,
    status: 'Assigned',
    reporterId: 'usr_faculty_sanjay',
    reporterName: 'Dr. Sanjay Gupta',
    reporterRole: 'faculty',
    reporterEmail: 'sanjay.gupta@campussphere.edu',
    assignedDepartment: 'Estate & Facilities',
    assignedStaffId: 'usr_faculty_rajesh',
    assignedStaffName: 'Prof. Rajesh Verma',
    createdAt: '2026-10-12T11:00:00Z',
    updatedAt: '2026-10-12T14:15:00Z',
    dueDate: '2026-10-15',
    comments: [],
    statusHistory: [
      {
        id: 'hist_1040_1',
        fromStatus: 'Submitted',
        toStatus: 'Assigned',
        changedBy: 'Dr. Meera Rao',
        changerRole: 'admin',
        timestamp: '2026-10-12T14:15:00Z',
        note: 'Assigned to AV tech crew.'
      }
    ]
  }
];

export const SEED_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif_1',
    userId: 'usr_student_aarav',
    title: 'Complaint Resolved — Action Required',
    message: 'Your complaint CMP-1036 (Water cooler leaking) has been marked Resolved. Please verify and confirm.',
    timestamp: '2026-10-10T16:05:00Z',
    read: false,
    type: 'complaint',
    complaintId: 'CMP-1036'
  },
  {
    id: 'notif_2',
    userId: 'usr_student_aarav',
    title: 'Attendance Warning in CS403',
    message: 'Your attendance in Computer Networks has fallen to 66.7%, below the mandatory 75% threshold.',
    timestamp: '2026-10-11T09:00:00Z',
    read: false,
    type: 'attendance'
  },
  {
    id: 'notif_3',
    userId: 'usr_faculty_rajesh',
    title: 'New Complaint Assigned: CMP-1042',
    message: 'Complaint CMP-1042 (Classroom fans and lights not working) requires inspection.',
    timestamp: '2026-10-13T10:20:00Z',
    read: false,
    type: 'complaint',
    complaintId: 'CMP-1042'
  },
  {
    id: 'notif_4',
    userId: 'usr_admin_meera',
    title: 'New Complaint Submitted: CMP-1042',
    message: 'Classroom fans and lights not working submitted by Aarav Sharma in Block B.',
    timestamp: '2026-10-13T10:16:00Z',
    read: false,
    type: 'complaint',
    complaintId: 'CMP-1042'
  }
];
