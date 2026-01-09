
import { User, UserRole, Teacher } from '../types';
import { MOCK_STUDENT, MOCK_TEACHER_USER, MOCK_ADMIN_USER } from '../constants';
import { storageService } from './storageService';

const USERS_KEY = 'maktab_ai_users';

export const userService = {
  // Boshlang'ich foydalanuvchilarni bazaga yuklash
  init() {
    if (!localStorage.getItem(USERS_KEY)) {
      const initialUsers = [
        { ...MOCK_STUDENT, password: 'student' },
        { ...MOCK_TEACHER_USER, password: 'teacher' },
        { ...MOCK_ADMIN_USER, password: '2Maktabim' }
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    }
  },

  // Barcha foydalanuvchilarni olish
  getUsers(): any[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Yangi foydalanuvchi qo'shish
  register(userData: any): boolean {
    const users = this.getUsers();
    if (users.find(u => u.login === userData.login)) {
      return false; // Login band
    }
    
    const newUserId = Math.random().toString(36).substr(2, 9);
    const newUser = {
      ...userData,
      id: newUserId
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // AGAR O'QITUVCHI BO'LSA, REYTING BAZASIGA QO'SHISH
    if (userData.role === UserRole.TEACHER) {
      const newTeacherEntry: Teacher = {
        id: newUserId,
        fullName: userData.fullName,
        subject: userData.subject || 'Noma\'lum fan',
        avatar: `https://picsum.photos/seed/${newUserId}/200`,
        ratings: {
          teacherId: newUserId,
          excellent: 0,
          satisfied: 0,
          unsatisfied: 0,
          votesByClass: []
        }
      };
      
      const currentTeachers = storageService.getTeachers();
      currentTeachers.push(newTeacherEntry);
      localStorage.setItem('maktab_ai_teachers_data', JSON.stringify(currentTeachers));
    }

    return true;
  },

  // Loginni tekshirish
  login(login: string, password: string): User | null {
    const users = this.getUsers();
    const found = users.find(u => u.login === login && u.password === password);
    if (found) {
      const { password, ...userWithoutPassword } = found;
      return userWithoutPassword as User;
    }
    return null;
  }
};
