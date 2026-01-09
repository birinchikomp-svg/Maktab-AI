
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export type TaskType = 'BSB' | 'CHSB' | 'ODDIY';

export interface User {
  id: string;
  login: string;
  password?: string;
  fullName: string;
  role: UserRole;
  subject?: string;
  className?: string;
  avatar?: string;
}

export interface ClassVote {
  className: string;
  excellent: number;
  satisfied: number;
  unsatisfied: number;
}

export interface TeacherRating {
  teacherId: string;
  excellent: number;
  satisfied: number;
  unsatisfied: number;
  votesByClass: ClassVote[];
}

export interface Teacher {
  id: string;
  fullName: string;
  subject: string;
  avatar: string;
  ratings: TeacherRating;
}

export interface Task {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  className: string;
  type: TaskType;
  title: string;
  description: string;
  deadline: string;
  pdfUrl?: string; // BSB/CHSB PDF fayli
}

export interface Submission {
  id: string;
  taskId: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  fileUrl: string;
  fileType: string;
  accuracy: number;
  aiComment: string;
  // Added missing alternatives property to satisfy the assignment in StudentPanel.tsx
  alternatives: string[];
  teacherComment?: string; // O'qituvchi izohi
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
