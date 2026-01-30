import React from 'react';
import { X } from 'lucide-react';
import { LEADERBOARD_MOCK } from '../../data/gameConfig';
import { useLanguage } from '../../contexts/LanguageContext';

const RankingScreen = ({ onBack, balance }) => {
  const { t } = useLanguage();
  return (
    <div className="animate-in slide-in-from-right-10 fade-in pb-24 md:pb-0">
      <div className="flex items-center gap-2 mb-4"><button onClick={onBack} className="bg-white p-2 rounded-full shadow-md"><X size={24}/></button><h1 className="text-xl md:text-2xl font-black text-slate-800 bg-white/50 px-3 py-1 rounded-xl">{t('ranking_title')}</h1></div>
      <div className="bg-white/90 p-4 md:p-6 rounded-3xl border-b-4 border-slate-200 shadow-xl space-y-3 md:space-y-4">
        {LEADERBOARD_MOCK.map((p,i)=>(<div key={p.id} className="flex justify-between p-3 md:p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm md:text-base"><div className="flex gap-2 md:gap-4 items-center"><span className="font-black text-slate-400 min-w-[1.5rem]">{i+1}</span> <span className="truncate max-w-[120px] md:max-w-none">{p.avatar} {p.name}</span></div><span className="font-black text-green-600 whitespace-nowrap">{p.coins}</span></div>))}
        <div className="h-px bg-slate-200 my-2"></div><div className="flex justify-between p-3 md:p-4 bg-blue-50 rounded-2xl border-2 border-blue-200 text-sm md:text-base"><div className="flex gap-2 md:gap-4 items-center"><span className="font-black text-blue-600 min-w-[1.5rem]">99+</span> <span>👨‍🌾 {t('ranking_you')}</span></div><span className="font-black text-blue-700 whitespace-nowrap">{balance}</span></div>
      </div>
    </div>
  );
};

export default RankingScreen;
