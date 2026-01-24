import React from 'react';
import { X, Sparkles, Egg, Trash2, DollarSign, Clock, Trophy, Lock, CheckCircle } from 'lucide-react';
import { ACHIEVEMENTS_LIST } from '../../data/gameConfig';

const ProfileScreen = ({ onBack, stats, achievements, level, xp, xpToNextLevel, goldenEggs }) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  return (
    <div className="animate-in slide-in-from-bottom-10 fade-in duration-300 pb-24 md:pb-0">
      <div className="flex items-center gap-2 mb-4"><button onClick={onBack} className="bg-white p-2 rounded-full shadow-md"><X size={24}/></button><h1 className="text-2xl font-black text-slate-800 bg-white/50 px-3 py-1 rounded-xl">Meu Perfil</h1></div>
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border-b-4 border-slate-200 shadow-xl mb-6 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-400 to-blue-200 z-0"></div>
        <div className="w-24 h-24 bg-yellow-300 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-5xl relative z-10 mt-8 mb-4">👨‍🌾<div className="absolute -bottom-2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white">Lvl {level}</div></div>
        <h2 className="text-2xl font-black text-slate-800 relative z-10">Fazendeiro Mestre</h2>
        {goldenEggs > 0 && (<div className="relative z-10 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 mt-2 border border-yellow-200 animate-pulse"><Sparkles size={12}/> {goldenEggs} Ovos Dourados (+{goldenEggs * 10}% Lucro)</div>)}
        <div className="w-full max-w-xs mt-4 relative z-10"><div className="flex justify-between text-xs font-bold text-slate-500 mb-1"><span>XP Atual</span><span>{xp} / {xpToNextLevel}</span></div><div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200"><div className="h-full bg-blue-500" style={{ width: `${(xp / xpToNextLevel) * 100}%` }}></div></div></div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white/80 p-4 rounded-2xl border-b-4 border-slate-200"><div className="text-slate-400 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Egg size={12}/> Ovos Coletados</div><div className="text-2xl font-black text-slate-700">{stats.total_eggs}</div></div>
        <div className="bg-white/80 p-4 rounded-2xl border-b-4 border-slate-200"><div className="text-slate-400 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Trash2 size={12}/> Sujeira Limpa</div><div className="text-2xl font-black text-slate-700">{stats.total_cleaned}</div></div>
        <div className="bg-white/80 p-4 rounded-2xl border-b-4 border-slate-200"><div className="text-slate-400 text-xs font-bold uppercase mb-1 flex items-center gap-1"><DollarSign size={12}/> Total Ganho</div><div className="text-2xl font-black text-slate-700">{stats.total_earned}</div></div>
        <div className="bg-white/80 p-4 rounded-2xl border-b-4 border-slate-200"><div className="text-slate-400 text-xs font-bold uppercase mb-1 flex items-center gap-1"><Clock size={12}/> Dias Jogados</div><div className="text-2xl font-black text-slate-700">{stats.days_played}</div></div>
      </div>
      <div className="bg-white/90 backdrop-blur-sm p-5 rounded-3xl border-b-4 border-slate-200 shadow-xl pb-20">
        <div className="flex justify-between items-center mb-4"><h3 className="font-black text-slate-800 flex items-center gap-2"><Trophy className="text-yellow-500"/> Galeria de Troféus</h3><span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">{unlockedCount}/{ACHIEVEMENTS_LIST.length}</span></div>
        <div className="space-y-3">
          {ACHIEVEMENTS_LIST.map(achievement => {
            const isUnlocked = achievements.find(a => a.id === achievement.id)?.unlocked;
            return (
              <div key={achievement.id} className={`flex items-center gap-4 p-3 rounded-2xl border-2 transition-all ${isUnlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-100 grayscale opacity-60'}`}>
                <div className={`w-12 h-12 flex items-center justify-center text-2xl bg-white rounded-xl shadow-sm border ${isUnlocked ? 'border-yellow-200' : 'border-slate-200'}`}>{isUnlocked ? achievement.icon : <Lock size={20} className="text-slate-300"/>}</div>
                <div className="flex-1"><h4 className={`font-black text-sm ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>{achievement.title}</h4><p className="text-xs text-slate-400 leading-tight">{achievement.desc}</p></div>{isUnlocked && <CheckCircle size={20} className="text-green-500"/>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
