import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { playSound } from '../../utils/audioSystem';
import { useLanguage } from '../../contexts/LanguageContext';

const UnboxingScreen = ({ onFinish }) => {
  const { t } = useLanguage();
  const [stage, setStage] = useState('closed');
  const handleOpen = () => { playSound('pop'); setStage('shaking'); setTimeout(() => setStage('opened'), 1000); };
  return (
    <div className="min-h-screen flex items-center justify-center p-6 z-50 relative bg-black/40 backdrop-blur-sm">
      <div className="text-center">
        {stage !== 'opened' ? (
          <div className="animate-in zoom-in duration-300 cursor-pointer" onClick={handleOpen}>
            <div className={`w-48 h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl border-4 border-white shadow-[0_0_50px_rgba(255,200,0,0.5)] flex items-center justify-center ${stage === 'shaking' ? 'animate-[spin_0.5s_ease-in-out_infinite]' : 'animate-bounce'}`}>
              <Gift size={80} className="text-white" />
            </div>
            <p className="mt-8 text-white font-black text-2xl drop-shadow-md">{t('unboxing_tap_to_open')}</p>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm animate-in zoom-in-50 border-b-8 border-slate-200">
            <div className="text-6xl mb-4 animate-bounce">🐣</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">{t('unboxing_chicken_received')}</h2>
            <p className="text-slate-500 text-sm mb-6" dangerouslySetInnerHTML={{ __html: t('unboxing_chicken_desc') }}></p>
            <button onClick={() => { playSound('success'); onFinish(); }} className="w-full bg-blue-500 text-white py-3 rounded-xl font-black shadow-md border-b-4 border-blue-700 active:border-b-0 active:translate-y-1">
              {t('unboxing_go_to_farm')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnboxingScreen;
