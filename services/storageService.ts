
import { Task, Submission, Teacher, ClassVote } from '../types';
import { MOCK_TEACHERS } from '../constants';

const TASKS_KEY = 'maktab_ai_tasks';
const SUBMISSIONS_KEY = 'maktab_ai_submissions';
const TEACHERS_KEY = 'maktab_ai_teachers_data';

export const storageService = {
  init() {
    if (!localStorage.getItem(TASKS_KEY)) localStorage.setItem(TASKS_KEY, JSON.stringify([]));
    if (!localStorage.getItem(SUBMISSIONS_KEY)) localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([]));
    if (!localStorage.getItem(TEACHERS_KEY)) {
      localStorage.setItem(TEACHERS_KEY, JSON.stringify(MOCK_TEACHERS));
    }
  },

  // --- TEACHERS & RATINGS ---
  getTeachers(): Teacher[] {
    const data = localStorage.getItem(TEACHERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  submitVote(teacherId: string, className: string, type: 'EXC' | 'SAT' | 'UNS') {
    const teachers = this.getTeachers();
    const idx = teachers.findIndex(t => t.id === teacherId);
    if (idx === -1) return;

    const teacher = teachers[idx];
    if (type === 'EXC') teacher.ratings.excellent++;
    else if (type === 'SAT') teacher.ratings.satisfied++;
    else teacher.ratings.unsatisfied++;

    if (!teacher.ratings.votesByClass) teacher.ratings.votesByClass = [];
    let classVote = teacher.ratings.votesByClass.find(v => v.className === className);
    if (!classVote) {
      classVote = { className, excellent: 0, satisfied: 0, unsatisfied: 0 };
      teacher.ratings.votesByClass.push(classVote);
    }
    
    if (type === 'EXC') classVote.excellent++;
    else if (type === 'SAT') classVote.satisfied++;
    else classVote.unsatisfied++;

    localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
  },

  // --- VAZIFALAR ---
  getTasks(): Task[] {
    return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
  },

  getTasksByClass(className: string): Task[] {
    return this.getTasks().filter(t => t.className === className);
  },

  addTask(task: Task) {
    const tasks = this.getTasks();
    tasks.unshift(task);
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  // --- TOPSHIRILGAN ISHLAR ---
  getSubmissions(): Submission[] {
    return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
  },

  addSubmission(sub: Submission) {
    const subs = this.getSubmissions();
    subs.unshift(sub);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(subs));
  },

  updateSubmissionStatus(submissionId: string, status: 'APPROVED' | 'REJECTED', teacherComment?: string) {
    const subs = this.getSubmissions();
    const idx = subs.findIndex(s => s.id === submissionId);
    if (idx > -1) {
      subs[idx].status = status;
      if (teacherComment) {
        subs[idx].teacherComment = teacherComment;
      }
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(subs));
    }
  }
};
