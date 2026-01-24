import React, { useState } from 'react';
import { X, HelpCircle } from 'lucide-react';
import { WHEEL_PRIZES } from '../../data/gameConfig';
import { playSound } from '../../utils/audioSystem';

const WheelScreen = ({ onBack, onSpin, canSpin, balance }) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleSpinClick = () => {
    if (!canSpin || spinning) return;
    setSpinning(true);
    playSound('wheel');
    const newRotation = rotation + 1800 + Math.random() * 360; 
    setRotation(newRotation);
    setTimeout(() => {
      setSpinning(false);
      const prize = WHEEL_PRIZES[Math.floor(Math.random() * WHEEL_PRIZES.length)];
      onSpin(prize);
    }, 4000);
  };

  return (
    <div className="animate-in slide-in-from-bottom-10 fade-in duration-300 flex flex-col items-center pb-24 md:pb-0">
      <div className="w-full flex items-center gap-2 mb-4"><button onClick={onBack} className="bg-white p-2 rounded-full shadow-md"><X size={24}/></button><h1 className="text-2xl font-black text-slate-800 bg-white/50 px-3 py-1 rounded-xl">Roleta Diária</h1></div>
      <div className="bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-3xl border-b-8 border-purple-300 shadow-2xl flex flex-col items-center w-full max-w-sm">
        <div className="relative mb-8">
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 text-red-500 text-4xl drop-shadow-md">▼</div>
           <div className="w-56 h-56 md:w-64 md:h-64 rounded-full border-[8px] border-white shadow-xl overflow-hidden relative transition-transform duration-[4000ms] cubic-bezier(0.1, 0.7, 1.0, 0.1)" style={{ background: 'conic-gradient(#fbbf24 0deg 45deg, #3b82f6 45deg 90deg, #fbbf24 90deg 135deg, #94a3b8 135deg 180deg, #fbbf24 180deg 225deg, #ef4444 225deg 270deg, #8b5cf6 270deg 315deg, #f97316 315deg 360deg)', transform: `rotate(${rotation}deg)` }}></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-slate-200 z-10 font-black text-purple-600"><HelpCircle size={32} className="text-purple-500" /></div>
        </div>
        <h3 className="text-xl font-black text-slate-700 mb-2">Tente a sorte!</h3>
        <p className="text-slate-500 text-sm mb-6 text-center max-w-[200px]">Gire a roleta diariamente para ganhar prêmios incríveis para sua fazenda.</p>
        <button onClick={handleSpinClick} disabled={!canSpin || spinning} className={`w-full py-3 rounded-xl font-black shadow-lg border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 ${canSpin && !spinning ? 'bg-purple-500 border-purple-700 text-white hover:bg-purple-600' : 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed'}`}>{spinning ? 'GIRANDO...' : canSpin ? 'GIRAR GRÁTIS' : 'VOLTE AMANHÃ'}</button>
      </div>
    </div>
  );
};

export default WheelScreen;
