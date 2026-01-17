
import React, { useState, useEffect, useContext } from 'react';
import { UserContext, LanguageContext } from '../App';
import { storageService } from '../services/storageService';
import { Task, Submission, Teacher, TaskType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TeacherPanel: React.FC = () => {
  const { user } = useContext(UserContext);
  const { t } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState<'rating' | 'tasks' | 'submissions' | 'stats'>('tasks');
  const [myData, setMyData] = useState<Teacher | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [gradingComment, setGradingComment] = useState<{[key: string]: string}>({});
  const [previewSub, setPreviewSub] = useState<Submission | null>(null);
  
  const CLASSES: string[] = [];
  for (let i = 5; i <= 11; i++) {
    ['A', 'B', 'V'].forEach(letter => CLASSES.push(`${i}-${letter}`));
  }

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    className: '5-A',
    type: 'ODDIY' as TaskType,
    deadline: '',
    pdfUrl: ''
  });

  useEffect(() => {
    if (user) {
      const allTeachers = storageService.getTeachers();
      setTeachers(allTeachers);
      const found = allTeachers.find(teach => teach.id === user.id || teach.fullName === user.fullName);
      if (found) setMyData(found);

      const myTasks = storageService.getTasks().filter(task => task.teacherId === user.id || task.teacherName === user.fullName);
      const myTaskIds = myTasks.map(task => task.id);
      const allSubs = storageService.getSubmissions();
      setSubmissions(allSubs.filter(s => myTaskIds.includes(s.taskId)));
    }
  }, [user, activeTab]);

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onloadend = () => setNewTask({...newTask, pdfUrl: reader.result as string});
      reader.readAsDataURL(f);
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    storageService.addTask({
      id: Math.random().toString(36).substr(2, 9),
      teacherId: user.id, teacherName: user.fullName, subject: user.subject || 'Unknown',
      ...newTask
    });
    alert("Vazifa muvaffaqiyatli yaratildi!");
    setNewTask({ title: '', description: '', className: '5-A', type: 'ODDIY', deadline: '', pdfUrl: '' });
  };

  const handleGrade = (subId: string, status: 'APPROVED' | 'REJECTED') => {
    const comment = gradingComment[subId] || '';
    storageService.updateSubmissionStatus(subId, status, comment);
    setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status, teacherComment: comment } : s));
    alert(status === 'APPROVED' ? t('approved') : t('rejected'));
    setPreviewSub(null);
  };

  const chartData = teachers.map(teach => ({
    name: teach.fullName.split(' ')[0],
    exc: teach.ratings.excellent,
    sat: teach.ratings.satisfied || 0,
    uns: teach.ratings.unsatisfied
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-900">
      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        <button onClick={() => setActiveTab('tasks')} className={`px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'tasks' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>{t('tasks')}</button>
        <button onClick={() => setActiveTab('submissions')} className={`px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'submissions' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>{t('my_works')} ({submissions.length})</button>
        <button onClick={() => setActiveTab('rating')} className={`px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'rating' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>{t('rating')}</button>
        <button onClick={() => setActiveTab('stats')} className={`px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'stats' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>{t('stats')}</button>
      </div>

      {activeTab === 'tasks' && (
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-4xl mx-auto border border-slate-100 animate-fadeIn">
           <h2 className="text-3xl font-black text-slate-900 mb-8 font-poppins">{t('create_task')}</h2>
           <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-900">
              <div className="md:col-span-2">
                 <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{t('title')}:</label>
                 <input type="text" required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{t('description')}:</label>
                 <textarea rows={4} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
              </div>
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{t('class_name')}:</label>
                 <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold" value={newTask.className} onChange={e => setNewTask({...newTask, className: e.target.value})}>
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
              </div>
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{t('type')}:</label>
                 <select className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold" value={newTask.type} onChange={e => setNewTask({...newTask, type: e.target.value as TaskType})}>
                    <option value="ODDIY">Oddiy</option><option value="BSB">BSB</option><option value="CHSB">CHSB</option>
                 </select>
              </div>
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{t('deadline')}:</label>
                 <input type="date" required className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold" value={newTask.deadline} onChange={e => setNewTask({...newTask, deadline: e.target.value})} />
              </div>
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{t('pdf_attach')}:</label>
                 <input type="file" accept="application/pdf" className="hidden" id="pdf-up" onChange={handlePdfUpload} />
                 <label htmlFor="pdf-up" className="w-full px-5 py-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center font-bold cursor-pointer hover:bg-red-100">
                    <i className="fas fa-file-pdf mr-2 text-xl"></i> {newTask.pdfUrl ? t('confirm') : t('pdf_attach')}
                 </label>
              </div>
              <button type="submit" className="md:col-span-2 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-2xl hover:bg-blue-600 transition-all">
                 {t('confirm')}
              </button>
           </form>
        </div>
      )}

      {activeTab === 'submissions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
          {submissions.length > 0 ? submissions.map(subm => (
            <div key={subm.id} className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col group overflow-hidden">
               <div className="flex justify-between items-center mb-6">
                  <div>
                     <h4 className="font-black text-xl text-slate-900">{subm.studentName}</h4>
                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{subm.studentClass}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider ${subm.status === 'APPROVED' ? 'bg-green-100 text-green-600' : subm.status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {subm.status === 'PENDING' ? `AI: ${subm.accuracy}%` : subm.status}
                  </span>
               </div>
               
               <div className="relative mb-6 rounded-3xl overflow-hidden border border-slate-100 group">
                  {subm.fileUrl.startsWith('data:application/pdf') ? (
                    <div className="h-48 bg-slate-50 flex flex-col items-center justify-center">
                       <i className="fas fa-file-pdf text-4xl text-red-500 mb-2"></i>
                       <span className="text-xs font-bold text-slate-400">PDF Javob</span>
                    </div>
                  ) : (
                    <img src={subm.fileUrl} className="w-full h-48 object-cover" />
                  )}
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => setPreviewSub(subm)} className="px-6 py-2 bg-white text-slate-900 rounded-full font-bold text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        {t('view_task')}
                     </button>
                  </div>
               </div>

               <div className="bg-blue-50/50 p-5 rounded-2xl mb-6 border border-blue-100 text-slate-900">
                  <p className="text-[10px] font-black text-blue-600 uppercase mb-2 tracking-widest">AI {t('ai_result')}:</p>
                  <p className="text-sm font-medium italic">"{subm.aiComment}"</p>
               </div>
               
               <div className="space-y-4 mt-auto">
                  <textarea 
                    placeholder={t('grading_comment')}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold text-sm outline-none"
                    rows={3}
                    value={gradingComment[subm.id] || ''}
                    onChange={(e) => setGradingComment({...gradingComment, [subm.id]: e.target.value})}
                  />
                  <div className="flex gap-4">
                    <button onClick={() => handleGrade(subm.id, 'APPROVED')} className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black text-sm">{t('approved')}</button>
                    <button onClick={() => handleGrade(subm.id, 'REJECTED')} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black text-sm">{t('rejected')}</button>
                  </div>
               </div>
            </div>
          )) : (
            <div className="md:col-span-2 text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-300">
              <i className="fas fa-inbox text-7xl mb-6 opacity-20"></i>
              <p className="text-2xl font-black">Kelib tushgan ishlar yo'q</p>
            </div>
          )}
        </div>
      )}

      {/* Preview Modal for Teacher */}
      {previewSub && (
        <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-4xl h-[85vh] rounded-[3rem] overflow-hidden flex flex-col relative shadow-2xl">
              <button onClick={() => setPreviewSub(null)} className="absolute top-6 right-8 text-slate-400 hover:text-slate-900 transition-colors z-10">
                 <i className="fas fa-times text-2xl"></i>
              </button>
              <div className="p-8 border-b border-slate-100">
                 <h3 className="text-2xl font-black">{previewSub.studentName} yuborgan yechim</h3>
              </div>
              <div className="flex-grow bg-slate-50 p-6 flex items-center justify-center overflow-auto">
                 {previewSub.fileUrl.startsWith('data:application/pdf') ? (
                    <iframe src={`${previewSub.fileUrl}#toolbar=0`} className="w-full h-full rounded-2xl border-none shadow-inner" />
                 ) : (
                    <img src={previewSub.fileUrl} className="max-w-full max-h-full rounded-2xl shadow-lg object-contain" />
                 )}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'rating' && myData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fadeIn text-slate-900">
           <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col items-center">
              <div className="relative mb-6">
                 <img src={myData.avatar} className="w-40 h-40 rounded-full border-8 border-blue-50 shadow-inner object-cover" />
              </div>
              <h2 className="text-3xl font-black mb-2">{myData.fullName}</h2>
              <p className="text-blue-600 font-black uppercase text-xs tracking-[0.2em]">{myData.subject}</p>
              
              <div className="mt-12 w-full space-y-4">
                 <div className="flex justify-between p-6 bg-green-50 rounded-3xl text-green-700 border border-green-100">
                    <span className="font-black flex items-center gap-3 text-lg"><i className="fas fa-star"></i> {t('excellent')}:</span>
                    <span className="text-3xl font-black">{myData.ratings.excellent}</span>
                 </div>
                 <div className="flex justify-between p-6 bg-yellow-50 rounded-3xl text-yellow-700 border border-yellow-100">
                    <span className="font-black flex items-center gap-3 text-lg"><i className="fas fa-smile"></i> {t('satisfied')}:</span>
                    <span className="text-3xl font-black">{myData.ratings.satisfied || 0}</span>
                 </div>
                 <div className="flex justify-between p-6 bg-red-50 rounded-3xl text-red-700 border border-red-100">
                    <span className="font-black flex items-center gap-3 text-lg"><i className="fas fa-frown"></i> {t('unsatisfied')}:</span>
                    <span className="text-3xl font-black">{myData.ratings.unsatisfied}</span>
                 </div>
              </div>
           </div>
           <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
              <h3 className="text-2xl font-black mb-8 border-b border-slate-100 pb-4">{t('stats')} - {t('class_name')}</h3>
              <div className="space-y-4">
                {myData.ratings.votesByClass.length > 0 ? myData.ratings.votesByClass.map((v_class, idx) => (
                  <div key={idx} className="flex flex-col p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <span className="font-black text-slate-900 text-lg mb-4">{v_class.className}</span>
                    <div className="flex justify-between items-center text-slate-900">
                      <div className="flex gap-4">
                         <div className="flex flex-col items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                            <span className="text-[10px] font-black text-green-600 uppercase">EXC</span>
                            <span className="text-xl font-black">{v_class.excellent}</span>
                         </div>
                         <div className="flex flex-col items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                            <span className="text-[10px] font-black text-yellow-600 uppercase">SAT</span>
                            <span className="text-xl font-black">{v_class.satisfied || 0}</span>
                         </div>
                         <div className="flex flex-col items-center bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                            <span className="text-[10px] font-black text-red-600 uppercase">UNS</span>
                            <span className="text-xl font-black">{v_class.unsatisfied}</span>
                         </div>
                      </div>
                    </div>
                  </div>
                )) : <div className="py-20 text-center text-slate-300 font-bold italic">Hali ovoz berilmagan</div>}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-10 animate-fadeIn text-slate-900">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
             <h3 className="text-2xl font-black mb-10 font-poppins">{t('overall_stats')}</h3>
             <div className="h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{fill: '#0f172a', fontSize: 12, fontWeight: 'bold'}} />
                      <YAxis tick={{fill: '#0f172a', fontSize: 12}} />
                      <Tooltip />
                      <Bar dataKey="exc" fill="#10b981" radius={[8, 8, 0, 0]} name={t('excellent')} />
                      <Bar dataKey="sat" fill="#f59e0b" radius={[8, 8, 0, 0]} name={t('satisfied')} />
                      <Bar dataKey="uns" fill="#ef4444" radius={[8, 8, 0, 0]} name={t('unsatisfied')} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherPanel;
