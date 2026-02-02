import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Swords, Shield, Zap, Target, Coins, Trophy, Info, AlertTriangle, Play, ChevronRight, RefreshCw, History, DollarSign, TrendingUp } from 'lucide-react';
import { RINHA_CONFIG } from '../../data/gameConfig';
import { playSound } from '../../utils/audioSystem';
import { useLanguage } from '../../contexts/LanguageContext';
import RinhaEngine from '../../services/RinhaEngine';
import BattleVisualizer from './rinha/BattleVisualizer';
import RoosterSprite from './rinha/RoosterSprite';

const CockfightScreen = ({ onBack, balance, setBalance, showToast }) => {
  const { t } = useLanguage();
  const [rooster, setRooster] = useState(() => {
    try {
      const saved = localStorage.getItem('farm_rooster');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Erro ao carregar galo:", e);
      return null;
    }
  });

  const [gameState, setGameState] = useState('MENU'); // MENU, SELECTING_ROOSTER, LOBBY, BATTLING, RESULT, HISTORY
  const [selectedElement, setSelectedElement] = useState('FOGO');
  const [selectedColor, setSelectedColor] = useState('VERMELHO');
  const [bet, setBet] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (rooster) {
      localStorage.setItem('farm_rooster', JSON.stringify(rooster));
    }
  }, [rooster]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await RinhaEngine.getHistory(20);
    setHistory(data);
  };

  const buyRooster = () => {
    if (balance < RINHA_CONFIG.ROOSTER_PRICE) {
      showToast(t('msg_insufficient_funds'), 'error');
      return;
    }
    setBalance(prev => prev - RINHA_CONFIG.ROOSTER_PRICE);
    const newRooster = {
      level: 1,
      wins: 0,
      element: 'FOGO',
      color: 'VERMELHO'
    };
    setRooster(newRooster);
    playSound('cash');
    showToast(t('cockfight_rooster_acquired'), 'success');
  };

  const startBattle = async () => {
    if (balance < bet) {
      showToast(t('cockfight_insufficient_bet'), 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await RinhaEngine.processBattle({
        element: rooster.element,
        color: rooster.color,
        betAmount: bet
      });
      
      setMatchResult(result);
      setBalance(result.financial.newBalance);
      setGameState('BATTLING');
      playSound('game_start');
    } catch (error) {
      showToast(t('cockfight_insufficient_funds'), 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const onBattleComplete = () => {
    setGameState('RESULT');
    if (matchResult.result === 'WIN') {
      setRooster(prev => ({ ...prev, wins: prev.wins + 1, level: Math.floor((prev.wins + 1) / 5) + 1 }));
      playSound('success');
    } else if (matchResult.result === 'DRAW') {
      playSound('neutral');
    } else {
      playSound('error');
    }
    loadHistory();
  };

  const renderFinancialSummary = () => {
    if (!matchResult) return null;
    const { financial } = matchResult;
    
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10 space-y-3 mb-6">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <DollarSign size={12} /> {t('cockfight_financial_summary')}
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-bold">{t('cockfight_financial_bet')}</span>
            <span className="text-sm font-black text-white">{financial.bet} RC</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-bold">{t('cockfight_financial_payout')}</span>
            <span className="text-sm font-black text-green-400">{financial.payout} RC</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-bold">{t('cockfight_financial_profit')}</span>
            <span className={`text-sm font-black ${financial.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {financial.profit > 0 ? '+' : ''}{financial.profit} RC
            </span>
          </div>
          <div className="flex justify-between items-center border-l border-white/10 pl-4">
            <span className="text-xs text-slate-400 font-bold">{t('cockfight_financial_balance')}</span>
            <span className="text-sm font-black text-yellow-400">{financial.newBalance} RC</span>
          </div>
        </div>
      </div>
    );
  };

  const renderHistory = () => (
    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">
          <History className="text-red-600" /> {t('cockfight_history_title')}
        </h3>
        <button onClick={() => setGameState('MENU')} className="text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
      </div>
      
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {history.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-bold">
            {t('harvest_history_empty')}
          </div>
        ) : (
          history.map(match => (
            <div key={match.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                  match.result === 'WIN' ? 'bg-green-100' : match.result === 'DRAW' ? 'bg-slate-100' : 'bg-red-100'
                }`}>
                  {match.result === 'WIN' ? '🏆' : match.result === 'DRAW' ? '🤝' : '💀'}
                </div>
                <div>
                  <div className="font-black text-slate-800 text-sm">
                    {match.result === 'WIN' ? t('cockfight_victory') : match.result === 'DRAW' ? t('cockfight_draw') : t('cockfight_defeat')}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400">
                    {new Date(match.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-black text-sm ${match.payout > match.bet_amount ? 'text-green-600' : match.payout === match.bet_amount ? 'text-slate-600' : 'text-red-600'}`}>
                  {match.payout > match.bet_amount ? '+' : ''}{match.payout - match.bet_amount} RC
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  {match.bet_amount} RC Bet
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <button onClick={() => setGameState('MENU')} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg uppercase">
        {t('chase_back_lobby')}
      </button>
    </div>
  );

  if (!rooster) {
    return (
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
            <X className="text-slate-600" />
          </button>
          <div className="text-right">
            <h2 className="font-black text-slate-800 text-2xl italic flex items-center gap-2 justify-end">
              <Swords className="text-red-600" /> {t('cockfight_title')}
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t('cockfight_subtitle')}</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center text-7xl shadow-inner border-4 border-red-100 animate-bounce">
            🐓
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-slate-800 text-2xl uppercase">{t('cockfight_no_fighter')}</h3>
            <p className="text-slate-500 font-medium max-w-[250px] mx-auto">
              {t('cockfight_need_rooster')}
            </p>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-3xl border-2 border-yellow-100 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="font-black text-slate-700 uppercase flex items-center gap-2">
                <Coins className="text-yellow-500" /> {t('cockfight_investment')}
              </span>
              <span className="bg-yellow-500 text-white font-black px-3 py-1 rounded-full text-sm">
                {RINHA_CONFIG.ROOSTER_PRICE} RC
              </span>
            </div>
            <button onClick={buyRooster} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-200 border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all uppercase">
              {t('cockfight_buy_now')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 h-full flex flex-col max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center mb-4 md:mb-8 shrink-0">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
          <X className="text-slate-600 w-5 h-5 md:w-6 md:h-6" />
        </button>
        <div className="text-right flex items-center gap-2 md:gap-4">
           <button onClick={() => setGameState('HISTORY')} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
              <History className="text-slate-600 w-5 h-5 md:w-6 md:h-6" />
           </button>
           <div>
            <h2 className="font-black text-slate-800 text-xl md:text-2xl italic flex items-center gap-2 justify-end">
              <Swords className="text-red-600 w-5 h-5 md:w-6 md:h-6" /> {t('cockfight_title')}
            </h2>
            <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">{t('cockfight_subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
        {gameState === 'HISTORY' ? renderHistory() : (
          <div className="space-y-6">
            {gameState === 'MENU' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Stats do Galo Atual */}
                <div className="bg-white rounded-3xl p-6 shadow-xl border-b-4 border-slate-200">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-slate-100 shadow-sm overflow-hidden">
                        <RoosterSprite 
                          color={RINHA_CONFIG.COLORS[rooster.color].hex} 
                          element={rooster.element} 
                          size={64} 
                        />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-800 text-xl">{t('cockfight_current_fighter')}</h3>
                        <div className="flex items-center gap-2">
                          <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase">{t('cockfight_level')} {rooster.level}</span>
                          <span className="text-xs font-bold text-slate-400">{t('cockfight_wins_label', [rooster.wins])}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setGameState('SELECTING_ROOSTER')} className="bg-slate-100 hover:bg-slate-200 p-2 rounded-xl transition-colors">
                      <RefreshCw size={20} className="text-slate-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">{t('cockfight_element')}</span>
                      <div className="flex items-center gap-2 font-bold text-slate-700">
                        <span>{RINHA_CONFIG.ELEMENTS[rooster.element].icon}</span>
                        <span>{t(RINHA_CONFIG.ELEMENTS[rooster.element].nameKey)}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">{t('cockfight_base_color')}</span>
                      <div className="flex items-center gap-2 font-bold text-slate-700">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RINHA_CONFIG.COLORS[rooster.color].hex }}></div>
                        <span>{t(RINHA_CONFIG.COLORS[rooster.color].nameKey)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seção de Aposta */}
                <div className="bg-white rounded-3xl p-6 shadow-xl border-b-4 border-slate-200">
                  <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2 uppercase">
                    <Coins className="text-yellow-500" /> {t('cockfight_bet_amount')}
                  </h3>
                  <div className="flex gap-2 mb-6">
                    {[10, 50, 100, 500].map(v => (
                      <button 
                        key={v}
                        onClick={() => setBet(v)}
                        className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${bet === v ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={startBattle} 
                    disabled={isProcessing}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-200 border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 uppercase"
                  >
                    {isProcessing ? <RefreshCw className="animate-spin" /> : <>{t('cockfight_find_opponent')} <ChevronRight /></>}
                  </button>
                </div>
              </div>
            )}

            {gameState === 'SELECTING_ROOSTER' && (
              <div className="bg-white rounded-3xl p-6 shadow-xl space-y-6 animate-in slide-in-from-right-4 duration-300">
                <div className="flex flex-col items-center gap-4 py-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                  <RoosterSprite 
                    color={RINHA_CONFIG.COLORS[selectedColor].hex} 
                    element={selectedElement} 
                    size={120} 
                  />
                  <div className="text-center">
                    <h3 className="font-black text-slate-800 uppercase tracking-tighter">{t('cockfight_customize')}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('cockfight_preview')}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-xs font-black text-slate-400 uppercase block mb-3">{t('cockfight_choose_element')}</span>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(RINHA_CONFIG.ELEMENTS).map(el => (
                      <button 
                        key={el.id}
                        onClick={() => setSelectedElement(el.id)}
                        className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 font-bold ${selectedElement === el.id ? 'border-red-500 bg-red-50 text-red-700 shadow-lg shadow-red-100' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                      >
                        <span className="text-xl">{el.icon}</span>
                        <div className="text-left">
                          <div className="text-xs leading-none uppercase tracking-tighter">{t(el.nameKey)}</div>
                          <div className="text-[10px] opacity-60 font-black">PWR: {el.base}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Strategy Card */}
                <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-3 shadow-xl">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">{t('cockfight_strategy_advantage')}</span>
                      <Shield className="text-blue-400" size={14} />
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex-1 space-y-1">
                         <div className="text-xs font-black text-blue-400 uppercase">{t('cockfight_element_power')}</div>
                         <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(RINHA_CONFIG.ELEMENTS[selectedElement].base / 100) * 100}%` }}
                              className="h-full bg-blue-500"
                            />
                         </div>
                      </div>
                      <div className="flex-1 space-y-1">
                         <div className="text-xs font-black text-yellow-400 uppercase">{t('cockfight_strategy_wins')}</div>
                         <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RINHA_CONFIG.COLORS[selectedColor].hex }}></div>
                            <ChevronRight size={10} className="text-white/40" />
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RINHA_CONFIG.COLORS[RINHA_CONFIG.COLORS[selectedColor].beats].hex }}></div>
                         </div>
                      </div>
                   </div>
                </div>

                <div>
                  <span className="text-xs font-black text-slate-400 uppercase block mb-3">{t('cockfight_choose_color')}</span>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(RINHA_CONFIG.COLORS).map(c => (
                      <button 
                        key={c.id}
                        onClick={() => setSelectedColor(c.id)}
                        className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 font-bold ${selectedColor === c.id ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'}`}
                      >
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.hex }}></div>
                        <div className="text-left">
                          <div className="text-xs leading-none">{t(c.nameKey)}</div>
                          <div className="text-[9px] opacity-60 flex items-center gap-1">
                            <TrendingUp size={10} /> {t('cockfight_vence')} {t(RINHA_CONFIG.COLORS[c.beats].nameKey)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setRooster(prev => ({ ...prev, element: selectedElement, color: selectedColor }));
                    setGameState('MENU');
                    showToast(t('cockfight_config_saved'), 'success');
                  }} 
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black shadow-xl active:scale-95 transition-all uppercase"
                >
                  {t('cockfight_confirm_changes')}
                </button>
              </div>
            )}

            {gameState === 'BATTLING' && (
              <div className="animate-in zoom-in duration-500">
                <BattleVisualizer 
                  matchData={matchResult} 
                  playerRooster={rooster} 
                  onComplete={onBattleComplete} 
                />
              </div>
            )}

            {gameState === 'RESULT' && (
              <div className="space-y-6 animate-in zoom-in duration-300">
                <div className={`rounded-3xl p-8 text-center shadow-2xl border-b-8 ${
                  matchResult.result === 'WIN' ? 'bg-green-500 border-green-700' : 
                  matchResult.result === 'DRAW' ? 'bg-slate-500 border-slate-700' : 
                  'bg-red-600 border-red-800'
                }`}>
                  <div className="text-6xl mb-4">
                    {matchResult.result === 'WIN' ? '👑' : matchResult.result === 'DRAW' ? '🤝' : '💀'}
                  </div>
                  <h2 className="text-4xl font-black text-white mb-2 italic">
                    {matchResult.result === 'WIN' ? t('cockfight_victory') : matchResult.result === 'DRAW' ? t('cockfight_draw') : t('cockfight_defeat')}
                  </h2>
                  
                  {renderFinancialSummary()}

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/20 p-4 rounded-2xl">
                      <span className="text-[10px] font-black text-white/60 uppercase block">{t('cockfight_my_rooster')}</span>
                      <span className="text-2xl font-black text-white">{t('cockfight_level')} {rooster.level}</span>
                    </div>
                    <div className="bg-black/20 p-4 rounded-2xl">
                      <span className="text-[10px] font-black text-white/60 uppercase block">{t('cockfight_total_wins')}</span>
                      <span className="text-2xl font-black text-white">{rooster.wins}</span>
                    </div>
                  </div>

                  <button onClick={() => setGameState('MENU')} className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black shadow-lg hover:bg-slate-100 transition-all active:scale-95 uppercase">
                    {t('cockfight_back_menu')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Informações do Sistema */}
        {gameState === 'MENU' && (
          <div className="mt-8 bg-blue-50 rounded-2xl p-4 border border-blue-100 flex gap-3">
            <Info size={24} className="text-blue-500 shrink-0" />
            <div>
              <h4 className="font-black text-blue-900 text-sm uppercase">{t('cockfight_how_works')}</h4>
              <p className="text-blue-700 text-[10px] font-bold leading-tight mt-1">
                {t('cockfight_how_works_desc')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CockfightScreen;
