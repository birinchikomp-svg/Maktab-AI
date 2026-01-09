
import React, { useState } from 'react';
import { Teacher } from '../types';
import { DOPPI_SVG } from '../constants';

interface VoteModalProps {
  teacher: Teacher;
  onClose: () => void;
  onVoteSubmit: (rating: 'EXC' | 'SAT' | 'UNS') => void;
}

const VoteModal: React.FC<VoteModalProps> = ({ teacher, onClose, onVoteSubmit }) => {
  const [selected, setSelected] = useState<'EXC' | 'SAT' | 'UNS' | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 font-poppins mb-2">O'qituvchini baholang</h2>
          <p className="text-slate-500">{teacher.fullName} ({teacher.subject})</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-10">
          {/* A'lo */}
          <button 
            onClick={() => setSelected('EXC')}
            className={`flex flex-col items-center group ${selected === 'EXC' ? 'scale-110' : ''} transition-all duration-300`}
          >
            <div className="relative mb-4">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-4xl group-hover:bg-green-100 transition-colors">
                 {DOPPI_SVG}
                 😃
              </div>
            </div>
            <span className={`font-bold text-sm ${selected === 'EXC' ? 'text-green-600' : 'text-slate-500'}`}>A'lo</span>
          </button>

          {/* Qoniqarli */}
          <button 
            onClick={() => setSelected('SAT')}
            className={`flex flex-col items-center group ${selected === 'SAT' ? 'scale-110' : ''} transition-all duration-300`}
          >
            <div className="relative mb-4">
              <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center text-4xl group-hover:bg-yellow-100 transition-colors">
                 {DOPPI_SVG}
                 🙂
              </div>
            </div>
            <span className={`font-bold text-sm ${selected === 'SAT' ? 'text-yellow-600' : 'text-slate-500'}`}>Qoniqarli</span>
          </button>

          {/* Qoniqarsiz */}
          <button 
            onClick={() => setSelected('UNS')}
            className={`flex flex-col items-center group ${selected === 'UNS' ? 'scale-110' : ''} transition-all duration-300`}
          >
            <div className="relative mb-4">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-4xl group-hover:bg-red-100 transition-colors">
                 {DOPPI_SVG}
                 😕
              </div>
            </div>
            <span className={`font-bold text-sm ${selected === 'UNS' ? 'text-red-600' : 'text-slate-500'}`}>Qoniqarsiz</span>
          </button>
        </div>

        <button 
          disabled={!selected}
          onClick={() => selected && onVoteSubmit(selected)}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
            selected 
            ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700' 
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          Tasdiqlash
        </button>
        <p className="text-center text-xs text-slate-400 mt-4 italic">
          * Ovoz berish anonim tarzda amalga oshiriladi.
        </p>
      </div>
    </div>
  );
};

export default VoteModal;
