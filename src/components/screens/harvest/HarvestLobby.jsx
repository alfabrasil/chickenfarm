import React from 'react';
import { Play, History, Info, Trophy, Users2, Bot, Landmark, Coins } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

const HarvestLobby = ({ onStart, onViewHistory, onViewTreasury, history = [] }) => {
  const { t } = useLanguage();
  const stats = (Array.isArray(history) ? history : []).reduce((acc, curr) => {
    if (curr.result === 'VITORIA') acc.wins++;
    acc.total++;
    acc.profit += curr.profit;
    return acc;
  }, { wins: 0, total: 0, profit: 0 });

  const winRate = stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto animate-in slide-in-from-bottom-10 duration-500">
      {/* Hero Section */}
      <div className="bg-white rounded-[2rem] p-6 shadow-xl border-b-8 border-green-100 mb-8 overflow-hidden relative group">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-green-50 rounded-full group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-green-200">
              🌽
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 leading-tight">{t('harvest_lobby_title')}</h2>
              <div className="flex gap-2 mt-1">
                <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">{t('harvest_multiplayer_pvp')}</span>
                <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">{t('harvest_prize_percentage', [180])}</span>
              </div>
            </div>
          </div>

          <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
            {t('harvest_lobby_desc')}
          </p>

          <button 
            onClick={() => {
              console.log('HarvestLobby: JOGAR AGORA clicado');
              if (onStart) onStart();
            }}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-green-200 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3 group"
          >
            <Play className="fill-white group-hover:scale-110 transition-transform" />
            {t('harvest_btn_play')}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-3xl shadow-md border border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <Trophy size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('harvest_win_rate')}</span>
          </div>
          <div className="text-2xl font-black text-slate-800">{winRate}%</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-1000" 
              style={{ width: `${winRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-md border border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-slate-400">
            <Coins size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('harvest_total_profit')}</span>
          </div>
          <div className={`text-2xl font-black ${stats.profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {stats.profit >= 0 ? '+' : ''}{stats.profit}
          </div>
          <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{t('harvest_acc_coins')}</div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="space-y-3">
        <button 
          onClick={onViewTreasury}
          className="w-full bg-slate-900 p-4 rounded-2xl shadow-lg border border-slate-800 flex items-center justify-between hover:bg-slate-800 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Landmark size={20} />
            </div>
            <div className="text-left">
              <div className="font-black text-white text-sm">{t('harvest_treasury_title')}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{t('harvest_treasury_desc')}</div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:translate-x-1 transition-transform">
            →
          </div>
        </button>

        <button 
          onClick={onViewHistory}
          className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <History size={20} />
            </div>
            <div className="text-left">
              <div className="font-black text-slate-800 text-sm">{t('harvest_history_title')}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t('harvest_history_desc')}</div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:translate-x-1 transition-transform">
            →
          </div>
        </button>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3">
          <Info className="text-amber-500 shrink-0" size={20} />
          <div>
            <div className="font-black text-amber-800 text-[10px] uppercase tracking-wider mb-1">{t('harvest_how_pvp')}</div>
            <p className="text-amber-700 text-xs font-medium leading-relaxed">
              {t('harvest_how_pvp_desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarvestLobby;
