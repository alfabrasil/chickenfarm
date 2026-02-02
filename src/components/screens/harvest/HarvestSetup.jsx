import React, { useState } from 'react';
import { Coins, Bot, Users2, Timer, Zap, Shield, ChevronRight, CheckCircle2 } from 'lucide-react';
import { playSound } from '../../../utils/audioSystem';
import { MINIGAME_CONFIG } from '../../../data/gameConfig';
import { useLanguage } from '../../../contexts/LanguageContext';

const HarvestSetup = ({ onBack, onConfirm, balance, chickens = [] }) => {
  const { t } = useLanguage();
  const [bet, setBet] = useState(50);
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [time, setTime] = useState(120);
  const [mode, setMode] = useState('BOT'); // BOT, PVP_MOCK
  const [selectedChicken, setSelectedChicken] = useState((chickens && chickens.length > 0) ? chickens[0] : null);

  const bets = [10, 50, 100, 250, 500];
  const difficulties = [
    { id: 'EASY', label: t('harvest_difficulty_EASY'), color: 'bg-green-500', icon: '🐣' },
    { id: 'MEDIUM', label: t('harvest_difficulty_MEDIUM'), color: 'bg-amber-500', icon: '🐔' },
    { id: 'HARD', label: t('harvest_difficulty_HARD'), color: 'bg-red-500', icon: '🦅' }
  ];
  const times = [60, 120, 180];

  const bots = [
    { id: 'bot1', name: t('harvest_bot_1'), avatar: '🤖', difficulty: 'EASY' },
    { id: 'bot2', name: t('harvest_bot_2'), avatar: '🚀', difficulty: 'MEDIUM' },
    { id: 'bot3', name: t('harvest_bot_3'), avatar: '👑', difficulty: 'HARD' }
  ];

  const pvpMocks = [
    { id: 'p1', name: t('harvest_pvp_mock_1'), avatar: '🤴', bet: 50 },
    { id: 'p2', name: t('harvest_pvp_mock_2'), avatar: '👨‍🌾', bet: 100 },
    { id: 'p3', name: t('harvest_pvp_mock_3'), avatar: '🥷', bet: 250 }
  ];

  const handleConfirm = () => {
    const opponent = mode === 'BOT' 
      ? bots.find(b => b.difficulty === difficulty) 
      : pvpMocks.find(p => p.bet === bet) || pvpMocks[0];

    onConfirm({
      bet,
      difficulty,
      time,
      opponent: { ...opponent, isBot: mode === 'BOT' },
      selectedChicken
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto animate-in fade-in duration-500">
      <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <Zap className="text-amber-500 fill-amber-500" />
        {t('harvest_setup_title')}
      </h2>

      {/* Mode Selection */}
      <div className="flex p-1 bg-slate-200 rounded-2xl mb-8">
        <button 
          onClick={() => { setMode('BOT'); playSound('click'); }}
          className={`flex-1 py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${mode === 'BOT' ? 'bg-white text-slate-800 shadow-md' : 'text-slate-500 hover:text-slate-600'}`}
        >
          <Bot size={18} /> {t('harvest_vs_bot')}
        </button>
        <button 
          onClick={() => { setMode('PVP_MOCK'); playSound('click'); }}
          className={`flex-1 py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${mode === 'PVP_MOCK' ? 'bg-white text-slate-800 shadow-md' : 'text-slate-500 hover:text-slate-600'}`}
        >
          <Users2 size={18} /> {t('harvest_pvp_simulated')}
        </button>
      </div>

      <div className="space-y-8">
        {/* Chicken Selection - NOVO: Habilidades Passivas */}
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">{t('harvest_choose_chicken')}</label>
          <div className="flex gap-3 overflow-x-auto pb-4 px-1 scrollbar-hide">
            {chickens.map(chicken => {
              const passive = MINIGAME_CONFIG.HARVEST.PASSIVES[chicken.type];
              const isSelected = selectedChicken?.id === chicken.id;
              
              return (
                <button
                  key={chicken.id}
                  onClick={() => { setSelectedChicken(chicken); playSound('pop'); }}
                  className={`min-w-[140px] p-4 rounded-3xl border-4 transition-all relative ${
                    isSelected ? 'bg-white border-green-500 shadow-xl scale-105' : 'bg-slate-50 border-transparent opacity-60'
                  }`}
                >
                  {isSelected && <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-lg"><CheckCircle2 size={16} /></div>}
                  <div className="text-3xl mb-2">{chicken.icon || '🐔'}</div>
                  <div className="font-black text-slate-800 text-xs truncate mb-1">
                    {chicken.nameKey ? t(chicken.nameKey, chicken.nameParams) : chicken.name}
                  </div>
                  {passive && (
                    <div className="bg-slate-100 rounded-xl p-2 mt-2">
                      <div className="flex items-center gap-1 text-[8px] font-black text-green-600 uppercase">
                        {passive.icon} {t(passive.labelKey)}
                      </div>
                      <div className="text-[8px] text-slate-500 font-bold leading-tight mt-0.5">
                        {t(passive.descKey)}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bet Selection */}
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">{t('harvest_setup_bet')}</label>
          <div className="grid grid-cols-5 gap-2">
            {bets.map(b => (
              <button
                key={b}
                onClick={() => { setBet(b); playSound('pop'); }}
                className={`py-3 rounded-xl font-black text-sm transition-all border-2 ${bet === b ? 'bg-amber-500 border-amber-600 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-600 hover:border-amber-200'}`}
              >
                {b}
              </button>
            ))}
          </div>
          {balance < bet && (
            <p className="text-red-500 text-[10px] font-bold mt-2 animate-pulse">{t('cockfight_insufficient_bet')}</p>
          )}
        </div>

        {/* Difficulty Selection (Only for BOT) */}
        {mode === 'BOT' && (
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">{t('harvest_ai_difficulty')}</label>
            <div className="grid grid-cols-3 gap-3">
              {difficulties.map(d => (
                <button
                  key={d.id}
                  onClick={() => { setDifficulty(d.id); playSound('pop'); }}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-4 ${difficulty === d.id ? `${d.color} border-white shadow-xl scale-105 text-white` : 'bg-white border-slate-50 text-slate-600'}`}
                >
                  <span className="text-2xl">{d.icon}</span>
                  <span className="font-black text-[10px] uppercase">{d.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Time Selection */}
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">{t('harvest_game_time')}</label>
          <div className="grid grid-cols-3 gap-3">
            {times.map(t => (
              <button
                key={t}
                onClick={() => { setTime(t); playSound('pop'); }}
                className={`py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 border-2 ${time === t ? 'bg-indigo-500 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600'}`}
              >
                <Timer size={16} /> {t}s
              </button>
            ))}
          </div>
        </div>

        {/* Economic Preview */}
        <div className="bg-slate-800 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10"><Zap size={120} /></div>
          <div className="relative z-10">
            <h3 className="text-amber-400 font-black text-xs uppercase tracking-widest mb-4">{t('harvest_setup_summary')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-bold">{t('harvest_your_bet')}</span>
                <span className="font-black">{bet} 💰</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-bold">{t('harvest_opp_bet')}</span>
                <span className="font-black">{bet} 💰</span>
              </div>
              <div className="h-px bg-slate-700 my-2" />
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-slate-400 font-bold text-xs">{t('harvest_winner_prize', [mode === 'BOT' ? 200 : 180])}</span>
                  <div className="text-3xl font-black text-green-400">
                    {mode === 'BOT' ? bet * 2 : Math.floor(bet * 1.8)} <span className="text-xs">💰</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-bold text-[10px] uppercase">{t('harvest_system_fee')}</span>
                  <div className="font-black text-red-400">-{mode === 'BOT' ? 0 : Math.floor(bet * 0.2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={balance < bet}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white py-5 rounded-3xl font-black text-xl shadow-xl shadow-green-200 border-b-8 border-green-700 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3 mt-4"
        >
          {t('harvest_confirm_play')}
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default HarvestSetup;
