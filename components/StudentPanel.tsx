
import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext, LanguageContext } from '../App';
import { storageService } from '../services/storageService';
import { analyzeHomework, AIAnalysisResult } from '../services/geminiService';
import { Task, Submission, Teacher } from '../types';
import TeacherCard from './TeacherCard';
import VoteModal from './VoteModal';

const StudentPanel: React.FC = () => {
  const { user } = useContext(UserContext);
  const { t } = useContext(LanguageContext);
  const [activeView, setActiveView] = useState<'rating' | 'tasks' | 'my-works'>('my-works');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [votingFor, setVotingFor] = useState<Teacher | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDoingTask, setIsDoingTask] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTeachers(storageService.getTeachers());
    if (user?.className) {
      setTasks(storageService.getTasksByClass(user.className));
    }
    if (user?.id) {
      refreshSubmissions();
    }
  }, [user, activeView]);

  const refreshSubmissions = () => {
    if (user?.id) {
      setMySubmissions(storageService.getSubmissions().filter(s => s.studentId === user.id));
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setFile(base64);
      setAnalyzing(true);
      const res = await analyzeHomework(base64, f.type);
      setAiResult(res);
      setAnalyzing(false);
    };
    reader.readAsDataURL(f);
  };

  const submitToTeacher = () => {
    if (!user || !selectedTask || !aiResult || !file) return;
    const sub: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      taskId: selectedTask.id,
      studentId: user.id,
      studentName: user.fullName,
      studentClass: user.className || '?',
      fileUrl: file,
      fileType: 'image/jpeg',
      accuracy: aiResult.accuracy,
      aiComment: aiResult.explanation,
      alternatives: aiResult.alternatives || [],
      status: 'PENDING'
    };
    storageService.addSubmission(sub);
    alert(t('submit_to_teacher'));
    resetForm();
    setActiveView('my-works');
  };

  const resetForm = () => {
    setSelectedTask(null);
    setIsDoingTask(false);
    setFile(null);
    setAiResult(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        <button onClick={() => { setActiveView('my-works'); resetForm(); }} className={`px-6 py-3 rounded-2xl font-bold transition-all ${activeView === 'my-works' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
          <i className="fas fa-history mr-2"></i> {t('my_panel')}
        </button>
        <button onClick={() => { setActiveView('tasks'); resetForm(); }} className={`px-6 py-3 rounded-2xl font-bold transition-all ${activeView === 'tasks' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
          <i className="fas fa-tasks mr-2"></i> {t('active_tasks')}
        </button>
        <button onClick={() => { setActiveView('rating'); resetForm(); }} className={`px-6 py-3 rounded-2xl font-bold transition-all ${activeView === 'rating' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
          <i className="fas fa-star mr-2"></i> {t('rating')}
        </button>
      </div>

      {activeView === 'my-works' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-3xl font-black text-slate-900 font-poppins">{t('my_works')}</h2>
             <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('total_submitted')}: </span>
                <span className="text-lg font-black text-blue-600">{mySubmissions.length}</span>
             </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mySubmissions.length > 0 ? mySubmissions.map(sub => (
              <div key={sub.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 hover:border-blue-200 transition-all flex flex-col relative overflow-hidden group">
                <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${sub.status === 'APPROVED' ? 'bg-green-500' : sub.status === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                   {sub.status === 'APPROVED' ? t('approved') : sub.status === 'REJECTED' ? t('rejected') : t('pending')}
                </div>

                <div className="mb-6 mt-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">AI {t('accuracy')}</p>
                   <div className="flex items-center gap-4">
                      <div className="text-4xl font-black text-slate-900">{sub.accuracy}%</div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-600 rounded-full" style={{ width: `${sub.accuracy}%` }}></div>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="font-black text-blue-600 text-[10px] uppercase mb-2 tracking-widest">{t('ai_explanation')}:</p>
                      <p className="text-slate-900 font-medium italic text-sm">"{sub.aiComment}"</p>
                   </div>
                   
                   {sub.teacherComment && (
                     <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 animate-fadeIn">
                        <p className="font-black text-emerald-600 text-[10px] uppercase mb-2 tracking-widest">{t('teacher_comment')}:</p>
                        <p className="text-slate-900 font-bold text-sm leading-relaxed">{sub.teacherComment}</p>
                     </div>
                   )}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                         <i className="fas fa-file-alt"></i>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {sub.id}</span>
                   </div>
                   <button onClick={() => window.open(sub.fileUrl)} className="px-6 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-all shadow-md">
                      {t('view_task')}
                   </button>
                </div>
              </div>
            )) : (
              <div className="lg:col-span-2 py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
                 <i className="fas fa-layer-group text-6xl mb-6 opacity-20"></i>
                 <p className="text-xl font-bold">{t('my_works')} hozircha bo'sh</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeView === 'tasks' && !isDoingTask && (
        <div className="animate-fadeIn">
          <h2 className="text-3xl font-black text-slate-900 mb-8 font-poppins">{t('active_tasks')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tasks.map(t_item => (
              <div key={t_item.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 hover:border-blue-200 transition-all group flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${t_item.type === 'BSB' ? 'bg-red-500 text-white' : t_item.type === 'CHSB' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>{t_item.type}</span>
                  <div className="text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{t('deadline')}:</p>
                     <p className="text-xs font-bold text-slate-900">{t_item.deadline}</p>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{t_item.title}</h3>
                <p className="text-sm font-bold text-slate-400 mb-8">{t_item.subject} • {t_item.teacherName}</p>
                
                <div className="mt-auto space-y-3">
                   <button onClick={() => { setSelectedTask(t_item); setIsDoingTask(true); }} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                      {t('start_doing')} <i className="fas fa-arrow-right"></i>
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isDoingTask && selectedTask && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fadeIn">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
             <button onClick={resetForm} className="text-slate-400 font-black text-xs uppercase tracking-widest mb-8 hover:text-blue-600 transition-colors flex items-center gap-2"><i className="fas fa-arrow-left"></i> {t('back')}</button>
             <div className="mb-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${selectedTask.type === 'BSB' ? 'bg-red-500 text-white' : selectedTask.type === 'CHSB' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>{selectedTask.type}</span>
                <h2 className="text-3xl font-black text-slate-900 mt-2">{selectedTask.title}</h2>
             </div>
             <p className="text-slate-600 mb-6 leading-relaxed font-medium">{selectedTask.description}</p>
             
             {selectedTask.pdfUrl && (
               <div className="mb-8 overflow-hidden rounded-2xl border-4 border-slate-100 shadow-inner bg-slate-50 relative aspect-square">
                  <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg">PDF VAZIFA</div>
                  <iframe 
                    src={`${selectedTask.pdfUrl}#toolbar=0&view=FitH`} 
                    className="w-full h-full border-none"
                    title="Task PDF"
                  />
               </div>
             )}

             <div onClick={() => fileInputRef.current?.click()} className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 text-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-300 transition-all bg-slate-50 group">
                <input type="file" ref={fileInputRef} className="hidden" onChange={onFileChange} accept="image/*,application/pdf" />
                {file ? (
                   <div className="animate-bounce">
                      <i className="fas fa-check-circle text-5xl text-green-500 mb-4"></i>
                      <p className="text-green-600 font-black text-lg">Yuklandi!</p>
                   </div>
                ) : (
                   <div className="text-slate-400">
                      <i className="fas fa-cloud-upload-alt text-6xl mb-4 group-hover:text-blue-400 transition-colors"></i>
                      <p className="font-black text-xl mb-2">{t('upload_solution')}</p>
                      <p className="text-xs uppercase tracking-widest text-slate-900">Rasm yoki PDF</p>
                   </div>
                )}
             </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
             {analyzing ? (
               <div className="flex flex-col items-center justify-center h-full space-y-6">
                  <div className="w-20 h-20 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-center">
                     <p className="font-black text-blue-600 text-2xl tracking-tighter mb-2">{t('ai_analysis').toUpperCase()}</p>
                     <p className="text-slate-400 font-bold animate-pulse uppercase text-xs tracking-widest">{t('loading')}</p>
                  </div>
               </div>
             ) : aiResult ? (
               <div className="space-y-8 animate-fadeIn">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('accuracy')}:</p>
                        <h3 className="text-5xl font-black text-slate-900">{aiResult.accuracy}%</h3>
                     </div>
                     <span className="bg-green-100 text-green-700 px-6 py-2 rounded-full font-black text-[10px] uppercase">{t('ai_result')}</span>
                  </div>

                  <div className="space-y-6">
                    <div>
                       <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">{t('ai_explanation')}:</p>
                       <p className="text-slate-900 bg-blue-50/50 p-6 rounded-3xl border border-blue-100 text-sm leading-relaxed font-bold">"{aiResult.explanation}"</p>
                    </div>

                    {aiResult.alternatives && aiResult.alternatives.length > 0 && (
                      <div className="bg-slate-50 p-6 rounded-3xl">
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">{t('ai_alternatives')}:</p>
                         <ul className="space-y-3">
                            {aiResult.alternatives.map((alt, i) => (
                              <li key={i} className="flex gap-3 text-sm text-slate-900 font-bold">
                                 <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold">{i+1}</span>
                                 {alt}
                              </li>
                            ))}
                         </ul>
                      </div>
                    )}

                    {aiResult.advice && (
                       <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-lg">
                          <p className="text-[10px] font-black text-blue-400 uppercase mb-2 tracking-widest"><i className="fas fa-lightbulb mr-2"></i>{t('ai_advice')}:</p>
                          <p className="text-sm font-bold leading-relaxed">{aiResult.advice}</p>
                       </div>
                    )}
                  </div>

                  <button onClick={submitToTeacher} className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-lg shadow-2xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all">
                     {t('submit_to_teacher')}
                  </button>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-center space-y-8 opacity-20">
                  <i className="fas fa-robot text-8xl text-slate-900"></i>
                  <p className="text-2xl font-black text-slate-900 max-w-xs">{t('upload_solution')} & {t('ai_analysis')}</p>
               </div>
             )}
          </div>
        </div>
      )}

      {activeView === 'rating' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fadeIn">
          {teachers.map(teach => <TeacherCard key={teach.id} teacher={teach} onVote={() => setVotingFor(teach)} userRole={user?.role} />)}
        </div>
      )}

      {votingFor && <VoteModal teacher={votingFor} onClose={() => setVotingFor(null)} onVoteSubmit={(rate) => {
        if(user?.className) { storageService.submitVote(votingFor.id, user.className, rate); setTeachers(storageService.getTeachers()); setVotingFor(null); }
      }} />}
    </div>
  );
};

export default StudentPanel;
