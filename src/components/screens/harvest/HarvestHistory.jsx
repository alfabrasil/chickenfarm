import React from 'react';
import { Calendar, Trophy, Coins, ChevronLeft, Target } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

const HarvestHistory = ({ history, onBack }) => {
  const { t } = useLanguage();
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto animate-in slide-in-from-right-10 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-black text-slate-800">{t('harvest_history_title')}</h2>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-md border border-slate-100">
          <div className="text-6xl mb-4">🌽</div>
          <h3 className="text-xl font-black text-slate-800 mb-2">{t('harvest_history_empty_title')}</h3>
          <p className="text-slate-500 text-sm">{t('harvest_history_empty_desc')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map(item => (
            <div 
              key={item.id} 
              className={`bg-white p-4 rounded-2xl shadow-sm border-l-8 transition-all hover:scale-[1.02] ${
                item.result === 'VITORIA' ? 'border-green-500' : item.result === 'EMPATE' ? 'border-amber-500' : 'border-red-500'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                      item.result === 'VITORIA' ? 'bg-green-100 text-green-700' : item.result === 'EMPATE' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.result === 'VITORIA' ? t('harvest_victory') : item.result === 'EMPATE' ? t('harvest_draw') : t('harvest_defeat')}
                    </span>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="font-black text-slate-800 flex items-center gap-2">
                    vs {item.opponent}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-black text-lg ${item.profit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {item.profit >= 0 ? '+' : ''}{item.profit} 💰
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">{t('harvest_net_result')}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-xl">
                <div className="text-center">
                  <div className="text-[10px] font-black text-slate-400 uppercase">{t('harvest_your_score')}</div>
                  <div className="font-black text-slate-700">{item.score}</div>
                </div>
                <div className="text-center flex items-center justify-center text-slate-300 font-black">
                  VS
                </div>
                <div className="text-center">
                  <div className="text-[10px] font-black text-slate-400 uppercase">{t('cockfight_opponent')}</div>
                  <div className="font-black text-slate-700">{item.oppScore}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HarvestHistory;
