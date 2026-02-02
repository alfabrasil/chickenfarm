import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Swords, Target, Flame, Droplets, Wind, Mountain, TrendingUp, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { RINHA_CONFIG } from '../../../data/gameConfig';
import { playSound } from '../../../utils/audioSystem';
import RoosterSprite from './RoosterSprite';

const BattleVisualizer = ({ matchData, playerRooster, onComplete }) => {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState('ANALYSIS'); // ANALYSIS, BATTLING, FINISHED
  const [currentRound, setCurrentRound] = useState(0);
  const [playerHP, setPlayerHP] = useState(100);
  const [cpuHP, setCpuHP] = useState(100);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [shake, setShake] = useState(0);

  // Lógica de Vantagens para Análise
  const analysis = useMemo(() => {
    const hasArenaBonus = matchData.arena.advantage === playerRooster.element;
    const cpuHasArenaBonus = matchData.arena.advantage === matchData.cpu.element;
    
    const colorWin = RINHA_CONFIG.COLORS[playerRooster.color].beats === matchData.cpu.color;
    const cpuColorWin = RINHA_CONFIG.COLORS[matchData.cpu.color].beats === playerRooster.color;

    return {
      player: {
        arenaBonus: hasArenaBonus,
        colorAdvantage: colorWin
      },
      cpu: {
        arenaBonus: cpuHasArenaBonus,
        colorAdvantage: cpuColorWin
      }
    };
  }, [matchData, playerRooster]);

  const rounds = useMemo(() => {
    const totalRounds = Math.floor(Math.random() * (RINHA_CONFIG.MAX_ROUNDS - RINHA_CONFIG.MIN_ROUNDS + 1)) + RINHA_CONFIG.MIN_ROUNDS;
    const roundList = [];
    
    let pRemaining = 100;
    let cRemaining = 100;

    // Determina o dano total baseado no resultado
    const finalPlayerHP = matchData.result === 'WIN' ? Math.random() * 30 + 10 : (matchData.result === 'DRAW' ? 0 : 0);
    const finalCpuHP = matchData.result === 'LOSS' ? Math.random() * 30 + 10 : (matchData.result === 'DRAW' ? 0 : 0);
    
    // Na verdade, para ficar mais emocionante, se for empate ambos chegam a 0 juntos ou perto.
    // Se vitória, CPU chega a 0. Se derrota, Player chega a 0.
    
    const pTarget = matchData.result === 'LOSS' ? 0 : (matchData.result === 'DRAW' ? 0 : Math.random() * 20 + 5);
    const cTarget = matchData.result === 'WIN' ? 0 : (matchData.result === 'DRAW' ? 0 : Math.random() * 20 + 5);

    for (let i = 0; i < totalRounds; i++) {
      const isLast = i === totalRounds - 1;
      
      let pDamage, cDamage;
      
      if (isLast) {
        pDamage = pRemaining - pTarget;
        cDamage = cRemaining - cTarget;
      } else {
        // Dano aleatório, mas garantindo que não chegue a 0 antes da hora
        pDamage = Math.min(pRemaining - 10, Math.random() * (100 / totalRounds) * 1.5);
        cDamage = Math.min(cRemaining - 10, Math.random() * (100 / totalRounds) * 1.5);
      }

      roundList.push({
        pDamage: Math.max(0, pDamage),
        cDamage: Math.max(0, cDamage),
        isCritical: Math.random() > 0.7,
        isWeak: Math.random() > 0.8
      });

      pRemaining -= pDamage;
      cRemaining -= cDamage;
    }
    return roundList;
  }, [matchData]);

  useEffect(() => {
    if (gameState === 'ANALYSIS') {
      const timer = setTimeout(() => {
        setGameState('BATTLING');
        playSound('battle_start');
      }, 3500); // 3.5s para o jogador ler as vantagens
      return () => clearTimeout(timer);
    }

    if (gameState === 'BATTLING' && currentRound < rounds.length) {
      const timer = setTimeout(() => {
        const round = rounds[currentRound];
        
        setPlayerHP(prev => Math.max(0, prev - round.pDamage));
        setCpuHP(prev => Math.max(0, prev - round.cDamage));
        
        if (round.pDamage > 0) {
           addFloatingText('PLAYER', Math.round(round.pDamage), round.isCritical, round.isWeak);
           setShake(10);
           playSound('hit');
        }
        if (round.cDamage > 0) {
           addFloatingText('CPU', Math.round(round.cDamage), round.isCritical, round.isWeak);
           setShake(10);
           playSound('hit');
        }

        setTimeout(() => setShake(0), 100);
        setCurrentRound(prev => prev + 1);
      }, RINHA_CONFIG.BATTLE_DURATION / rounds.length);

      return () => clearTimeout(timer);
    } else if (gameState === 'BATTLING' && currentRound >= rounds.length) {
      setTimeout(() => {
        setGameState('FINISHED');
        onComplete();
      }, 1000);
    }
  }, [currentRound, rounds, gameState]);

  const addFloatingText = (target, damage, isCritical, isWeak) => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, target, damage, isCritical, isWeak }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1000);
  };

  const ArenaIcon = () => {
    const arena = matchData.arena;
    switch (arena.advantage) {
      case 'FOGO': return <Flame className="text-red-500" size={48} />;
      case 'AGUA': return <Droplets className="text-blue-500" size={48} />;
      case 'AR': return <Wind className="text-slate-300" size={48} />;
      case 'TERRA': return <Mountain className="text-amber-700" size={48} />;
      default: return <Swords className="text-white" size={48} />;
    }
  };

  return (
    <div className="relative w-full h-auto aspect-[3/5] md:aspect-video md:h-[500px] max-h-[75vh] bg-slate-950 rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl flex flex-col mx-auto max-w-4xl">
      {/* Background Arena Efeito */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-black`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Analysis Overlay */}
      <AnimatePresence>
        {gameState === 'ANALYSIS' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="space-y-8 w-full max-w-lg"
            >
              <h2 className="text-white font-black text-3xl uppercase italic tracking-tighter flex items-center justify-center gap-3">
                <Target className="text-red-500 animate-pulse" /> {t('cockfight_analysis_title')}
              </h2>

              <div className="grid grid-cols-2 gap-8">
                {/* Player Analysis */}
                <div className="space-y-4">
                  <div className="text-blue-400 font-black text-sm uppercase">{t('cockfight_you')}</div>
                  <div className="flex flex-col gap-2">
                    {analysis.player.arenaBonus && (
                      <div className="bg-blue-500/20 text-blue-300 p-2 rounded-lg border border-blue-500/30 text-[10px] font-black uppercase flex items-center gap-2">
                        <Mountain size={14} /> {t('cockfight_arena_match')} +25%
                      </div>
                    )}
                    {analysis.player.colorAdvantage && (
                      <div className="bg-yellow-500/20 text-yellow-300 p-2 rounded-lg border border-yellow-500/30 text-[10px] font-black uppercase flex items-center gap-2">
                        <TrendingUp size={14} /> {t('cockfight_color_dominance')} +30%
                      </div>
                    )}
                    {!analysis.player.arenaBonus && !analysis.player.colorAdvantage && (
                      <div className="text-white/20 text-[10px] font-bold italic uppercase">{t('cockfight_no_bonuses')}</div>
                    )}
                  </div>
                </div>

                {/* CPU Analysis */}
                <div className="space-y-4">
                  <div className="text-red-400 font-black text-sm uppercase">{t('cockfight_opponent')}</div>
                  <div className="flex flex-col gap-2">
                    {analysis.cpu.arenaBonus && (
                      <div className="bg-red-500/20 text-red-300 p-2 rounded-lg border border-red-500/30 text-[10px] font-black uppercase flex items-center gap-2">
                        <Mountain size={14} /> {t('cockfight_arena_match')} +25%
                      </div>
                    )}
                    {analysis.cpu.colorAdvantage && (
                      <div className="bg-yellow-500/20 text-yellow-300 p-2 rounded-lg border border-yellow-500/30 text-[10px] font-black uppercase flex items-center gap-2">
                        <TrendingUp size={14} /> {t('cockfight_color_dominance')} +30%
                      </div>
                    )}
                    {!analysis.cpu.arenaBonus && !analysis.cpu.colorAdvantage && (
                      <div className="text-white/20 text-[10px] font-bold italic uppercase">{t('cockfight_no_bonuses')}</div>
                    )}
                  </div>
                </div>
              </div>

              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-white/40 text-xs font-black uppercase tracking-widest pt-4"
              >
                {t('cockfight_loading_battle')}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header: Arena & Round */}
      <div className="relative z-10 p-4 md:p-6 flex justify-between items-center bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-white/10 p-1.5 md:p-2 rounded-xl">
            <ArenaIcon />
          </div>
          <div>
            <h3 className="text-white font-black text-sm md:text-xl leading-none">{t(matchData.arena.nameKey)}</h3>
            <span className="text-yellow-400 text-[9px] md:text-[10px] font-bold uppercase">{t(matchData.arena.descKey)}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-red-500 font-black text-xl md:text-2xl italic animate-pulse">
            {t('cockfight_battle_round', [currentRound + 1])}
          </div>
          <div className="text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-widest">{t('cockfight_frenzy')}</div>
        </div>
      </div>

      {/* Health Bars */}
      <div className="relative z-10 px-4 md:px-6 py-2 md:py-4 grid grid-cols-2 gap-4 md:gap-8">
        {/* Player HP */}
        <div className="space-y-1">
          <div className="flex justify-between items-end">
            <span className="text-white font-black text-[10px] md:text-xs uppercase">{t('cockfight_you')}</span>
            <span className="text-white font-black text-sm md:text-lg">{Math.ceil(playerHP)}%</span>
          </div>
          <div className="h-3 md:h-4 bg-slate-800 rounded-full overflow-hidden border border-white/10 shadow-inner">
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: `${playerHP}%` }}
              transition={{ type: 'spring', stiffness: 50 }}
              className={`h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]`}
            />
          </div>
        </div>

        {/* CPU HP */}
        <div className="space-y-1">
          <div className="flex justify-between items-end">
            <span className="text-white font-black text-sm md:text-lg">{Math.ceil(cpuHP)}%</span>
            <span className="text-white font-black text-[10px] md:text-xs uppercase">{t('cockfight_opponent')}</span>
          </div>
          <div className="h-3 md:h-4 bg-slate-800 rounded-full overflow-hidden border border-white/10 shadow-inner">
            <motion.div 
              initial={{ width: '100%' }}
              animate={{ width: `${cpuHP}%` }}
              transition={{ type: 'spring', stiffness: 50 }}
              className={`h-full bg-gradient-to-l from-red-600 to-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]`}
            />
          </div>
        </div>
      </div>

      {/* Battle Field */}
      <div className="relative flex-1 flex items-center justify-around px-4 md:px-10 overflow-hidden">
        {/* Player Rooster */}
        <motion.div 
          animate={{ 
            x: shake > 0 ? [0, -shake, shake, 0] : 0,
            scale: currentRound % 2 === 0 ? [1, 1.1, 1] : 1
          }}
          className="relative flex flex-col items-center w-1/3"
        >
          <RoosterSprite 
            color={RINHA_CONFIG.COLORS[playerRooster.color].hex} 
            element={playerRooster.element}
            size={window.innerWidth < 768 ? 80 : 120}
          />
          <div className="mt-2 bg-blue-600/20 px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-blue-500/30">
            <span className="text-blue-400 font-black text-[9px] md:text-[10px] uppercase whitespace-nowrap">LVL {playerRooster.level}</span>
          </div>
          
          {/* Floating Damage Texts for Player */}
          <AnimatePresence>
            {floatingTexts.filter(t => t.target === 'PLAYER').map(text => (
              <motion.div
                key={text.id}
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -60, scale: text.isCritical ? 1.5 : 1 }}
                exit={{ opacity: 0 }}
                className={`absolute top-0 font-black text-xl md:text-2xl ${text.isCritical ? 'text-yellow-400' : 'text-red-500'} italic drop-shadow-md z-20 whitespace-nowrap`}
              >
                -{text.damage}
                {text.isCritical && <div className="text-[8px] md:text-[10px] uppercase not-italic">{t('cockfight_hit_critical')}</div>}
                {text.isWeak && <div className="text-[8px] md:text-[10px] text-slate-400 uppercase not-italic">{t('cockfight_hit_weak')}</div>}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* VS Center */}
        <div className="flex flex-col items-center w-1/4">
           <div className="w-10 h-10 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 animate-pulse transition-all duration-300">
              <Swords className="text-white/20 w-5 h-5 md:w-8 md:h-8" />
           </div>
        </div>

        {/* CPU Rooster */}
        <motion.div 
          animate={{ 
            x: shake > 0 ? [0, shake, -shake, 0] : 0,
            scale: currentRound % 2 !== 0 ? [1, 1.1, 1] : 1
          }}
          className="relative flex flex-col items-center w-1/3"
        >
          <RoosterSprite 
            color={RINHA_CONFIG.COLORS[matchData.cpu.color].hex} 
            element={matchData.cpu.element}
            size={window.innerWidth < 768 ? 80 : 120}
            isOpponent
          />
          <div className="mt-2 bg-red-600/20 px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-red-500/30">
            <span className="text-red-400 font-black text-[9px] md:text-[10px] uppercase whitespace-nowrap">{t('cockfight_opponent')}</span>
          </div>

          {/* Floating Damage Texts for CPU */}
          <AnimatePresence>
            {floatingTexts.filter(t => t.target === 'CPU').map(text => (
              <motion.div
                key={text.id}
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -60, scale: text.isCritical ? 1.5 : 1 }}
                exit={{ opacity: 0 }}
                className={`absolute top-0 font-black text-xl md:text-2xl ${text.isCritical ? 'text-yellow-400' : 'text-red-500'} italic drop-shadow-md z-20 whitespace-nowrap`}
              >
                -{text.damage}
                {text.isCritical && <div className="text-[8px] md:text-[10px] uppercase not-italic">{t('cockfight_hit_critical')}</div>}
                {text.isWeak && <div className="text-[8px] md:text-[10px] text-slate-400 uppercase not-italic">{t('cockfight_hit_weak')}</div>}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 p-3 md:p-6 bg-black/40 flex justify-around border-t border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Zap className="text-yellow-400 w-3 h-3 md:w-4 md:h-4" />
          <span className="text-white/60 text-[9px] md:text-[10px] font-black uppercase tracking-tighter">{t('cockfight_base_strength')}: {RINHA_CONFIG.ELEMENTS[playerRooster.element].base}</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="text-blue-400 w-3 h-3 md:w-4 md:h-4" />
          <span className="text-white/60 text-[9px] md:text-[10px] font-black uppercase tracking-tighter">{t('cockfight_base_color')}: {t(RINHA_CONFIG.COLORS[playerRooster.color].nameKey)}</span>
        </div>
      </div>
    </div>
  );
};

export default BattleVisualizer;
