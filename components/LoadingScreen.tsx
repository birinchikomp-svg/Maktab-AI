
import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onFinish: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(onFinish, 800);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-1000 ${fade ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative">
        <img 
          src="https://buxedu.uz/static/images/logo.png" 
          alt="Buxedu Logo" 
          className="w-48 h-auto animate-pulse-logo mb-8"
        />
      </div>
      <div className="flex flex-col items-center">
        <p className="text-xl font-medium text-slate-700 font-poppins animate-pulse">
          Yuklanmoqda...
        </p>
        <div className="mt-4 w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 animate-[loading_2s_ease-in-out_infinite] w-full origin-left"></div>
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.5); }
          100% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
