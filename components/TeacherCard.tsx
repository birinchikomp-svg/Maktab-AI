
import React from 'react';
import { Teacher, UserRole } from '../types';
import { DOPPI_SVG } from '../constants';

interface TeacherCardProps {
  teacher: Teacher;
  onVote: (id: string) => void;
  userRole?: UserRole;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onVote, userRole }) => {
  const total = teacher.ratings.excellent + teacher.ratings.satisfied + teacher.ratings.unsatisfied;
  
  const getPercent = (val: number) => {
    if (total === 0) return 0;
    return Math.round((val / total) * 100);
  };

  const excPer = getPercent(teacher.ratings.excellent);
  const satPer = getPercent(teacher.ratings.satisfied);
  const unsPer = getPercent(teacher.ratings.unsatisfied);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative border border-slate-100">
      <div className="flex flex-col items-center mb-6">
        <div className="relative mb-4">
          {DOPPI_SVG}
          <div className="w-24 h-24 rounded-full border-4 border-blue-50 overflow-hidden shadow-inner">
            <img src={teacher.avatar} alt={teacher.fullName} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white shadow-sm"></div>
        </div>
        <h3 className="text-xl font-bold text-slate-800 font-poppins">{teacher.fullName}</h3>
        <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mt-1">{teacher.subject}</p>
      </div>

      <div className="space-y-4 mb-6">
        {/* Excellent */}
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
            <span className="flex items-center gap-1"><i className="fas fa-star text-green-500"></i> A'lo</span>
            <span>{excPer}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${excPer}%` }}></div>
          </div>
        </div>

        {/* Satisfied */}
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
            <span className="flex items-center gap-1"><i className="fas fa-smile text-yellow-500"></i> Qoniqarli</span>
            <span>{satPer}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 rounded-full transition-all duration-1000" style={{ width: `${satPer}%` }}></div>
          </div>
        </div>

        {/* Unsatisfied */}
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
            <span className="flex items-center gap-1"><i className="fas fa-frown text-red-500"></i> Qoniqarsiz</span>
            <span>{unsPer}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full transition-all duration-1000" style={{ width: `${unsPer}%` }}></div>
          </div>
        </div>
      </div>

      {userRole === UserRole.STUDENT && (
        <button 
          onClick={() => onVote(teacher.id)}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-1 active:translate-y-0 transition-all duration-200"
        >
          Ovoz berish
        </button>
      )}

      {userRole !== UserRole.STUDENT && (
        <div className="text-center py-2 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Baholash faqat o'quvchilar uchun</p>
        </div>
      )}
    </div>
  );
};

export default TeacherCard;
