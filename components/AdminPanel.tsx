
import React, { useState, useEffect, useContext } from 'react';
import { userService } from '../services/userService';
import { storageService } from '../services/storageService';
import { User, UserRole, Teacher, Submission } from '../types';
import { LanguageContext } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminPanel: React.FC = () => {
  const { t } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'students' | 'teachers'>('stats');
  const [users, setUsers] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    setUsers(userService.getUsers());
    setTeachers(storageService.getTeachers());
    setSubmissions(storageService.getSubmissions());
  }, [activeTab]);

  const statsData = teachers.map(teach => ({
    name: teach.fullName.split(' ')[0],
    rating: teach.ratings.excellent + (teach.ratings.satisfied || 0) - teach.ratings.unsatisfied,
    works: storageService.getTasks().filter(task => task.teacherId === teach.id).length
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn">
      <div className="flex flex-wrap gap-4 mb-12 justify-center">
        <button onClick={() => setActiveTab('stats')} className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}>{t('overall_stats')}</button>
        <button onClick={() => setActiveTab('students')} className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'students' ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}>{t('user_report')}</button>
        <button onClick={() => setActiveTab('teachers')} className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'teachers' ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}>{t('rating')}</button>
        <button onClick={() => setActiveTab('users')} className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}>{t('admin_panel')}</button>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-10 animate-fadeIn text-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 text-center">
                <i className="fas fa-users text-4xl text-blue-500 mb-4 opacity-50"></i>
                <p className="text-slate-400 font-black uppercase text-xs mb-2 tracking-[0.2em]">Users</p>
                <h3 className="text-6xl font-black">{users.length}</h3>
             </div>
             <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 text-center">
                <i className="fas fa-tasks text-4xl text-emerald-500 mb-4 opacity-50"></i>
                <p className="text-slate-400 font-black uppercase text-xs mb-2 tracking-[0.2em]">{t('total_submitted')}</p>
                <h3 className="text-6xl font-black">{submissions.length}</h3>
             </div>
             <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 text-center">
                <i className="fas fa-chalkboard-teacher text-4xl text-indigo-500 mb-4 opacity-50"></i>
                <p className="text-slate-400 font-black uppercase text-xs mb-2 tracking-[0.2em]">{t('teacher')}</p>
                <h3 className="text-6xl font-black">{teachers.length}</h3>
             </div>
          </div>
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 h-[500px]">
             <h3 className="text-2xl font-black mb-10">{t('overall_stats')}</h3>
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData} margin={{bottom: 40}}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} dy={15} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                   <Tooltip />
                   <Bar dataKey="rating" fill="#3b82f6" radius={[10, 10, 0, 0]} name="Net Rating" barSize={35} />
                   <Bar dataKey="works" fill="#8b5cf6" radius={[10, 10, 0, 0]} name="Tasks" barSize={35} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn text-slate-900">
           <h3 className="text-2xl font-black mb-8">{t('user_report')}</h3>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b-2 border-slate-50">
                       <th className="py-6 px-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">{t('full_name')}</th>
                       <th className="py-6 px-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">{t('class_name')}</th>
                       <th className="py-6 px-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">{t('total_submitted')}</th>
                       <th className="py-6 px-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {users.filter(u => u.role === UserRole.STUDENT).map((u, i) => {
                       const userSubs = submissions.filter(s => s.studentId === u.id);
                       return (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                             <td className="py-5 px-4 font-black">{u.fullName}</td>
                             <td className="py-5 px-4 text-blue-600 font-black text-sm">{u.className}</td>
                             <td className="py-5 px-4 font-bold">{userSubs.length}</td>
                             <td className="py-5 px-4">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${userSubs.length > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                   {userSubs.length > 0 ? t('active') : t('inactive')}
                                </span>
                             </td>
                          </tr>
                       );
                    })}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'teachers' && (
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn text-slate-900">
           <h3 className="text-2xl font-black mb-8">{t('rating')}</h3>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b-2 border-slate-50">
                       <th className="py-6 px-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">{t('teacher')}</th>
                       <th className="py-6 px-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">{t('subject')}</th>
                       <th className="py-6 px-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">{t('tasks')}</th>
                       <th className="py-6 px-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Score</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {teachers.map((t_teach, i) => (
                       <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-5 px-4 font-black">{t_teach.fullName}</td>
                          <td className="py-5 px-4 font-bold uppercase text-[10px] tracking-widest">{t_teach.subject}</td>
                          <td className="py-5 px-4 text-indigo-600 font-black">{storageService.getTasks().filter(task => task.teacherId === t_teach.id).length}</td>
                          <td className="py-5 px-4">
                             <div className="flex items-center gap-2">
                                <span className="font-black text-blue-600 text-xl">{t_teach.ratings.excellent + (t_teach.ratings.satisfied || 0) - t_teach.ratings.unsatisfied}</span>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 animate-fadeIn text-slate-900">
           <h3 className="text-2xl font-black mb-10 text-center">{t('admin_panel')}</h3>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="border-b-2 border-slate-50">
                       <th className="py-6 px-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">{t('full_name')}</th>
                       <th className="py-6 px-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">{t('username')}</th>
                       <th className="py-6 px-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">{t('role')}</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {users.map((u, i) => (
                       <tr key={i} className="hover:bg-slate-50">
                          <td className="py-5 px-4 font-black">{u.fullName}</td>
                          <td className="py-5 px-4 text-blue-600 font-bold">{u.login}</td>
                          <td className="py-5 px-4">
                             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === UserRole.ADMIN ? 'bg-purple-600 text-white' : u.role === UserRole.TEACHER ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                {u.role}
                             </span>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
