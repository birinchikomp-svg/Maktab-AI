
import { Teacher, UserRole, User } from './types';

export const ADMIN_CREDENTIALS = {
  login: 'rrg',
  password: '2Maktabim'
};

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: '1',
    fullName: 'Anvar Toshmatov',
    subject: 'Matematika',
    avatar: 'https://picsum.photos/seed/t1/200',
    // Fix: Added missing votesByClass to satisfy TeacherRating interface
    ratings: { teacherId: '1', excellent: 85, satisfied: 10, unsatisfied: 5, votesByClass: [] }
  },
  {
    id: '2',
    fullName: 'Dilnoza Karimova',
    subject: 'Ingliz tili',
    avatar: 'https://picsum.photos/seed/t2/200',
    // Fix: Added missing votesByClass to satisfy TeacherRating interface
    ratings: { teacherId: '2', excellent: 70, satisfied: 25, unsatisfied: 5, votesByClass: [] }
  },
  {
    id: '3',
    fullName: 'Jasur Bekmirzayev',
    subject: 'Fizika',
    avatar: 'https://picsum.photos/seed/t3/200',
    // Fix: Added missing votesByClass to satisfy TeacherRating interface
    ratings: { teacherId: '3', excellent: 45, satisfied: 40, unsatisfied: 15, votesByClass: [] }
  },
  {
    id: '4',
    fullName: 'Malika Ergasheva',
    subject: 'Ona tili',
    avatar: 'https://picsum.photos/seed/t4/200',
    // Fix: Added missing votesByClass to satisfy TeacherRating interface
    ratings: { teacherId: '4', excellent: 92, satisfied: 6, unsatisfied: 2, votesByClass: [] }
  }
];

export const MOCK_STUDENT: User = {
  id: 's1',
  login: 'student1',
  fullName: 'Bobur Mirzo',
  role: UserRole.STUDENT,
  className: '9-A'
};

export const MOCK_TEACHER_USER: User = {
  id: 't1',
  login: 'teacher1',
  fullName: 'Anvar Toshmatov',
  role: UserRole.TEACHER,
  subject: 'Matematika'
};

export const MOCK_ADMIN_USER: User = {
  id: 'a1',
  login: 'rrg',
  fullName: 'Maktab Ma\'muriyati',
  role: UserRole.ADMIN
};

export const DOPPI_SVG = (
  <svg viewBox="0 0 100 60" className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-10 drop-shadow-md z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 50 Q50 10 90 50 L90 60 L10 60 Z" fill="#1e293b" />
    <path d="M20 50 Q50 25 80 50" stroke="white" strokeWidth="2" strokeDasharray="4 2" />
    <circle cx="50" cy="30" r="4" fill="white" />
    <path d="M40 30 Q50 20 60 30" stroke="white" strokeWidth="1" />
  </svg>
);
