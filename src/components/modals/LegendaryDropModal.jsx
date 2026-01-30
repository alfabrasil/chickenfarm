import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const LegendaryDropModal = ({ type, onClose }) => {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6 animate-in zoom-in duration-300" onClick={onClose}>
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 p-1 rounded-[40px] shadow-[0_0_100px_rgba(255,215,0,0.5)]">
        <div className="bg-slate-900 rounded-[36px] p-8 text-center border border-white/10 relative overflow-hidden max-w-sm">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-spin-slow"></div>
           <div className="relative z-10">
             <div className="text-8xl mb-6 animate-[pulse_2s_infinite] filter drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
               {type === 'LEGENDARY' ? '🌟' : '✨'}
             </div>
             <h2 className={`text-3xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r ${type === 'LEGENDARY' ? 'from-yellow-300 via-amber-500 to-yellow-300' : 'from-orange-300 to-red-500'}`}>
               {type === 'LEGENDARY' ? t('legendary_modal_title') : t('rare_modal_title')}
             </h2>
             <p className="text-slate-400 font-medium mb-8">
               {type === 'LEGENDARY' ? t('legendary_modal_desc') : t('rare_modal_desc')}
             </p>
             <button onClick={onClose} className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900 py-4 rounded-2xl font-black text-lg shadow-lg border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1">
               {t('legendary_modal_collect')}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LegendaryDropModal;
