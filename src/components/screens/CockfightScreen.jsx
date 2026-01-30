import React, { useState, useEffect } from 'react';
import { X, Swords, Shield, Zap, Target, Coins, Trophy, Info, AlertTriangle, Play, ChevronRight, RefreshCw } from 'lucide-react';
import { RINHA_CONFIG } from '../../data/gameConfig';
import { playSound } from '../../utils/audioSystem';
import { useLanguage } from '../../contexts/LanguageContext';

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

  const [gameState, setGameState] = useState('MENU'); // MENU, SELECTING_ROOSTER, LOBBY, BATTLING, RESULT
  const [selectedElement, setSelectedElement] = useState('FOGO');
  const [selectedColor, setSelectedColor] = useState('VERMELHO');
  const [bet, setBet] = useState(10);
  const [arena, setArena] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (rooster) {
      localStorage.setItem('farm_rooster', JSON.stringify(rooster));
    }
  }, [rooster]);

  const buyRooster = () => {
    if (balance < RINHA_CONFIG.ROOSTER_PRICE) {
      showToast(t('msg_insufficient_funds'), 'error');
      return;
    }
    setBalance(prev => prev - RINHA_CONFIG.ROOSTER_PRICE);
    setRooster({
      level: 1,
      wins: 0,
      element: 'FOGO',
      color: 'VERMELHO'
    });
    playSound('cash');
    showToast(t('cockfight_rooster_acquired'), 'success');
  };

  const startBattle = () => {
    if (balance < bet) {
      showToast(t('cockfight_insufficient_bet'), 'error');
      return;
    }

    setBalance(prev => prev - bet);
    setIsProcessing(true);
    setGameState('BATTLING');
    setBattleLog([t('cockfight_drawing_arena')]);

    // 1. Sorteia Arena
    const randomArena = RINHA_CONFIG.ARENAS[Math.floor(Math.random() * RINHA_CONFIG.ARENAS.length)];
    
    // 2. Sorteia Oponente
    const randomOpponent = RINHA_CONFIG.OPPONENTS[Math.floor(Math.random() * RINHA_CONFIG.OPPONENTS.length)];
    setOpponent(randomOpponent);

    setTimeout(() => {
      setArena(randomArena);
      setBattleLog(prev => [...prev, `${t('cockfight_arena_selected', [t(randomArena.nameKey)])} ${randomArena.icon}`]);
      
      setTimeout(() => {
        setBattleLog(prev => [...prev, t('cockfight_opponent_appeared', [t(randomOpponent.nameKey)])]);
        calculateResult(randomArena, randomOpponent);
      }, 1000);
    }, 1000);
  };

  const calculateResult = (currentArena, currentOpponent) => {
    const playerElement = RINHA_CONFIG.ELEMENTS[rooster.element];
    const playerColor = RINHA_CONFIG.COLORS[rooster.color];
    const opElement = RINHA_CONFIG.ELEMENTS[currentOpponent.element];
    const opColor = RINHA_CONFIG.COLORS[currentOpponent.color];

    // Cálculo Jogador
    let pStrength = playerElement.base;
    let pArenaBonus = currentArena.advantage === rooster.element ? 0.25 : 0;
    let pColorBonus = playerColor.beats === currentOpponent.color ? 0.30 : 0;
    const playerFinal = pStrength * (1 + pArenaBonus) * (1 + pColorBonus);

    // Cálculo Oponente
    let oStrength = opElement.base;
    let oArenaBonus = currentArena.advantage === currentOpponent.element ? 0.25 : 0;
    let oColorBonus = opColor.beats === rooster.color ? 0.30 : 0;
    const opponentFinal = oStrength * (1 + oArenaBonus) * (1 + oColorBonus);

    setTimeout(() => {
      setBattleLog(prev => [...prev, t('cockfight_calc_forces')]);
      
      setTimeout(() => {
        let result = '';
        if (playerFinal === opponentFinal) {
           result = 'DRAW';
        } else if (playerFinal > opponentFinal) {
           result = 'PLAYER';
        } else {
           result = 'OPPONENT';
        }
        
        setWinner(result);
        
        if (result === 'PLAYER') {
          const reward = Math.floor(bet * 2 * (1 - RINHA_CONFIG.SYSTEM_FEE));
          setBalance(prev => prev + reward);
          setRooster(prev => ({ ...prev, wins: prev.wins + 1, level: Math.floor((prev.wins + 1) / 5) + 1 }));
          playSound('success');
          showToast(t('cockfight_win_msg', [reward]), 'success');
        } else if (result === 'DRAW') {
          setBalance(prev => prev + bet);
          playSound('neutral'); 
          showToast(t('cockfight_draw_msg', [bet]), 'info');
        } else {
          playSound('error');
          showToast(t('cockfight_loss_msg'), 'error');
        }
        
        setGameState('RESULT');
        setIsProcessing(false);
      }, 1500);
    }, 1000);
  };

  const renderRoosterStats = (data, isPlayer = true) => {
    const element = RINHA_CONFIG.ELEMENTS[data.element];
    const color = RINHA_CONFIG.COLORS[data.color];
    
    return (
      <div className={`p-4 rounded-2xl border-2 shadow-lg transition-all ${isPlayer ? 'bg-white border-blue-200' : 'bg-slate-800 border-slate-600 text-white'}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="text-4xl animate-bounce">{isPlayer ? '🐓' : data.avatar || '🐓'}</div>
          <div>
            <div className="font-black text-lg">{isPlayer ? t('cockfight_my_rooster') : t(data.nameKey)}</div>
            <div className="text-xs font-bold opacity-70">{t('cockfight_level_label', [data.level || 1])}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-bold">
            <span className="flex items-center gap-1"><Zap size={14} className="text-yellow-500"/> {t('cockfight_element')}</span>
            <span className={element.color}>{element.icon} {t(element.nameKey)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span className="flex items-center gap-1"><Shield size={14} className="text-blue-500"/> {t('cockfight_base_color')}</span>
            <span style={{ color: color.hex }}>{t(color.nameKey)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold border-t pt-1 mt-1">
            <span className="flex items-center gap-1"><Target size={14} className="text-red-500"/> {t('cockfight_base_strength')}</span>
            <span>{element.base}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in slide-in-from-right-10 fade-in duration-300 min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-b-[3rem] shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
          <Swords size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <button onClick={onBack} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
              <X size={20} />
            </button>
            <h1 className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
              <Swords className="text-yellow-400" /> {t('cockfight_title')}
            </h1>
            <div className="bg-yellow-400 text-red-900 px-4 py-1 rounded-full font-black text-sm shadow-lg">
              💰 {balance}
            </div>
          </div>
          <p className="text-red-100 text-xs font-bold uppercase tracking-widest opacity-80">{t('cockfight_subtitle')}</p>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto">
        {!rooster ? (
          <div className="bg-white rounded-3xl p-8 shadow-xl text-center border-b-8 border-red-100">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl shadow-inner border-2 border-red-100">🐓</div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">{t('cockfight_no_fighter')}</h2>
            <p className="text-slate-500 mb-8 font-medium">{t('cockfight_need_rooster')}</p>
            
            <div className="bg-slate-50 p-6 rounded-2xl mb-8 border-2 border-slate-100 flex items-center justify-between">
              <div className="text-left">
                <span className="block text-xs font-black text-slate-400 uppercase">{t('cockfight_investment')}</span>
                <span className="text-2xl font-black text-slate-800">{RINHA_CONFIG.ROOSTER_PRICE} 💰</span>
              </div>
              <button onClick={buyRooster} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-red-200 active:scale-95 transition-all">
                {t('cockfight_buy_now')}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <Shield size={14} className="text-blue-500" /> {t('cockfight_evolve')}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <Trophy size={14} className="text-yellow-500" /> {t('cockfight_rewards')}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {gameState === 'MENU' && (
              <div className="space-y-6">
                {/* Stats do Galo Atual */}
                <div className="bg-white rounded-3xl p-6 shadow-xl border-b-4 border-slate-200">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-4xl border-2 border-red-100 shadow-sm">🐓</div>
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
                  <button onClick={startBattle} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-200 border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 uppercase">
                    {t('cockfight_find_opponent')} <ChevronRight />
                  </button>
                </div>
              </div>
            )}

            {gameState === 'SELECTING_ROOSTER' && (
              <div className="bg-white rounded-3xl p-6 shadow-xl space-y-6">
                <h3 className="font-black text-slate-800 text-center uppercase">{t('cockfight_customize')}</h3>
                
                <div>
                  <span className="text-xs font-black text-slate-400 uppercase block mb-3">{t('cockfight_choose_element')}</span>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(RINHA_CONFIG.ELEMENTS).map(el => (
                      <button 
                        key={el.id}
                        onClick={() => setSelectedElement(el.id)}
                        className={`p-4 rounded-2xl border-2 font-bold transition-all flex flex-col items-center gap-1 ${selectedElement === el.id ? 'border-red-500 bg-red-50 shadow-md' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <span className="text-2xl">{el.icon}</span>
                        <span className="text-sm">{t(el.nameKey)}</span>
                        <span className="text-[10px] opacity-60 uppercase">{t('cockfight_base_strength')}: {el.base}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-black text-slate-400 uppercase block mb-3">{t('cockfight_choose_color')}</span>
                  <div className="grid grid-cols-4 gap-3">
                    {Object.values(RINHA_CONFIG.COLORS).map(c => (
                      <button 
                        key={c.id}
                        onClick={() => setSelectedColor(c.id)}
                        className={`h-12 rounded-xl border-2 transition-all flex items-center justify-center ${selectedColor === c.id ? 'border-slate-800 scale-110 shadow-lg' : 'border-transparent'}`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {selectedColor === c.id && <Zap size={16} className="text-white fill-white" />}
                      </button>
                    ))}
                  </div>

                  {selectedColor && (
                    <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between animate-in slide-in-from-top-2">
                       <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border border-slate-300" style={{backgroundColor: RINHA_CONFIG.COLORS[selectedColor].hex}}></div>
                          <span className="font-bold text-slate-700 text-sm">{t(RINHA_CONFIG.COLORS[selectedColor].nameKey)}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-green-600 uppercase">{t('cockfight_vence')}</span>
                          <ChevronRight size={14} className="text-slate-400"/>
                          <div className="w-4 h-4 rounded-full border border-slate-300" style={{backgroundColor: RINHA_CONFIG.COLORS[RINHA_CONFIG.COLORS[selectedColor].beats].hex}}></div>
                          <span className="font-bold text-slate-700 text-sm">{t(RINHA_CONFIG.COLORS[RINHA_CONFIG.COLORS[selectedColor].beats].nameKey)}</span>
                       </div>
                    </div>
                  )}
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
              <div className="space-y-6">
                <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500 via-transparent to-transparent animate-pulse"></div>
                  </div>
                  
                  {arena ? (
                    <div className="text-center animate-in zoom-in duration-500 mb-8">
                      <div className="text-6xl mb-2">{arena.icon}</div>
                      <h4 className="text-white font-black text-xl">{t(arena.nameKey)}</h4>
                      <p className="text-red-400 text-xs font-bold uppercase">{t(arena.descKey)}</p>
                    </div>
                  ) : (
                    <div className="text-center animate-pulse">
                      <RefreshCw size={48} className="text-red-500 animate-spin mb-4 mx-auto" />
                      <p className="text-white font-black uppercase">{t('cockfight_drawing_arena')}</p>
                    </div>
                  )}

                  <div className="w-full space-y-2 max-w-xs">
                    {battleLog.map((log, i) => (
                      <div key={i} className="text-white/80 font-bold text-sm text-center animate-in slide-in-from-bottom-2">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {gameState === 'RESULT' && (
              <div className="space-y-6 animate-in zoom-in duration-300">
                <div className={`rounded-3xl p-8 text-center shadow-2xl border-b-8 ${
                  winner === 'PLAYER' ? 'bg-green-500 border-green-700' : 
                  winner === 'DRAW' ? 'bg-slate-500 border-slate-700' : 
                  'bg-red-600 border-red-800'
                }`}>
                  <div className="text-6xl mb-4">
                    {winner === 'PLAYER' ? '👑' : winner === 'DRAW' ? '🤝' : '💀'}
                  </div>
                  <h2 className="text-4xl font-black text-white mb-2 italic">
                    {winner === 'PLAYER' ? t('cockfight_victory') : winner === 'DRAW' ? t('cockfight_draw') : t('cockfight_defeat')}
                  </h2>
                  <p className="text-white/90 font-bold mb-6">
                    {winner === 'PLAYER' ? t('cockfight_win_prize', [Math.floor(bet * 2 * (1 - RINHA_CONFIG.SYSTEM_FEE))]) : 
                     winner === 'DRAW' ? t('cockfight_draw_pity') : 
                     t('cockfight_loss_pity')}
                  </p>
                  
                  {/* Resumo da Arena na Tela de Resultado */}
                  <div className="bg-black/20 p-4 rounded-2xl mb-6 flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{arena?.icon}</div>
                      <div>
                        <div className="text-[10px] text-white/60 font-black uppercase">{t('cockfight_arena_drawn')}</div>
                        <div className="text-sm font-black text-white">{t(arena?.nameKey)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="text-[10px] text-white/60 font-black uppercase">{t('cockfight_effect')}</div>
                       <div className="text-xs font-black text-yellow-300">{t(arena?.descKey)}</div>
                    </div>
                  </div>

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

                <div className="grid grid-cols-2 gap-4">
                  {renderRoosterStats(rooster, true)}
                  {renderRoosterStats(opponent, false)}
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