import React from 'react';
import { Trophy, Coins, RotateCcw, Home, Share2, Zap, Skull } from 'lucide-react';
import { playSound } from '../../../utils/audioSystem';
import { useLanguage } from '../../../contexts/LanguageContext';

const HarvestResult = ({ result, config, onRetry, onLobby }) => {
  const { t } = useLanguage();
  const isWinner = result.winner === 'PLAYER';
  const isDraw = result.winner === 'DRAW';

  const prize = isWinner 
    ? (config.opponent?.isBot ? config.bet * 2 : Math.floor(config.bet * 1.8))
    : (isDraw ? config.bet : 0);

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-8 shadow-2xl relative overflow-hidden text-center animate-in zoom-in duration-300">
        {/* Shine Effect */}
        <div className={`absolute -top-24 -left-24 w-64 h-64 opacity-20 rounded-full blur-3xl ${isWinner ? 'bg-green-400' : 'bg-red-400'}`} />
        
        {/* Icon/Emoji */}
        <div className="relative mb-6">
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-7xl shadow-2xl border-8 ${
            isWinner ? 'bg-green-100 border-green-500 animate-bounce' : isDraw ? 'bg-amber-100 border-amber-500' : 'bg-red-100 border-red-500'
          }`}>
            {isWinner ? '🏆' : isDraw ? '🤝' : '💀'}
          </div>
          {isWinner && (
            <div className="absolute top-0 right-1/4 animate-ping">✨</div>
          )}
        </div>

        <h2 className={`text-4xl font-black mb-2 tracking-tight ${
          isWinner ? 'text-green-600' : isDraw ? 'text-amber-600' : 'text-red-600'
        }`}>
          {isWinner ? t('harvest_victory') : isDraw ? t('harvest_draw') : t('harvest_defeat')}
        </h2>
        
        <p className="text-slate-500 font-bold mb-8 uppercase tracking-widest text-xs">
          {isWinner ? t('harvest_victory_desc') : isDraw ? t('harvest_draw_desc') : t('harvest_defeat_desc')}
        </p>

        {/* Score Board */}
        <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase mb-1">{t('cockfight_you')}</div>
            <div className="text-3xl font-black text-slate-800">{result.playerScore}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">{t('harvest_points')}</div>
          </div>
          <div className="border-l border-slate-200">
            <div className="text-[10px] font-black text-slate-400 uppercase mb-1">{config.opponent.name}</div>
            <div className="text-3xl font-black text-slate-800">{result.oppScore}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">{t('harvest_points')}</div>
          </div>
        </div>

        {/* Prize Box */}
        <div className={`mb-8 p-6 rounded-[2rem] border-b-8 transition-all ${
          prize > 0 ? 'bg-green-600 border-green-800 shadow-lg scale-105' : 'bg-slate-800 border-slate-900 opacity-50'
        }`}>
          <div className="text-white/70 font-black text-[10px] uppercase tracking-widest mb-1">{t('harvest_prize_received')}</div>
          <div className="text-white text-4xl font-black flex items-center justify-center gap-2">
            <Coins size={32} className="text-yellow-400" />
            {prize}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { playSound('click'); onRetry(); }}
            className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all"
          >
            <RotateCcw size={20} /> {t('harvest_btn_rematch')}
          </button>
          <button
            onClick={() => { playSound('click'); onLobby(); }}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-md border-b-4 border-slate-400 active:border-b-0 active:translate-y-1 transition-all"
          >
            <Home size={20} /> {t('harvest_btn_lobby')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HarvestResult;
