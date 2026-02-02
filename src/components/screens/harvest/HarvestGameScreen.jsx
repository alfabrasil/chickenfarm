import React, { useState, useEffect } from 'react';
import { X, Trophy, History, Play, Info, Coins, Zap, Shield, Skull, ChevronLeft } from 'lucide-react';
import { playSound } from '../../../utils/audioSystem';
import { useLanguage } from '../../../contexts/LanguageContext';

// Componentes Internos
import HarvestLobby from './HarvestLobby';
import HarvestSetup from './HarvestSetup';
import HarvestEngine from './HarvestEngine';
import HarvestResult from './HarvestResult';
import HarvestHistory from './HarvestHistory';
import HarvestTreasury from './HarvestTreasury';

const HarvestGameScreen = ({ onBack, balance, setBalance, showToast, chickens }) => {
  const { t } = useLanguage();
  const [gameState, setGameState] = useState('LOBBY'); // LOBBY, SETUP, PLAYING, RESULT, HISTORY, TREASURY
  const [gameConfig, setGameConfig] = useState({
    bet: 10,
    difficulty: 'EASY',
    time: 120,
    opponent: null,
    selectedChicken: null
  });
  const [lastResult, setLastResult] = useState(null);

  // ENGENHARIA: Pontuação Semanal para o Jackpot
  const [weeklyPoints, setWeeklyPoints] = useState(() => Number(localStorage.getItem('farm_harvest_weekly_points')) || 0);

  // ENGENHARIA: Persistência de Histórico
  const [history, setHistory] = useState(() => {
    try {
      const s = localStorage.getItem('farm_harvest_history');
      return s ? JSON.parse(s) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('farm_harvest_history', JSON.stringify(history));
  }, [history]);

  const handleStartGame = (config) => {
    if (balance < config.bet) {
      showToast(t('msg_insufficient_funds'), 'error');
      return;
    }

    setBalance(prev => prev - config.bet);
    setGameConfig(config);
    setGameState('PLAYING');
    playSound('game_start');
  };

  const handleFinishGame = (result) => {
    setLastResult(result);
    
    // Sistema Econômico 180%/10%
    // Contra Bot: Sem taxa (conforme solicitado)
    // Se PvP Simulado: Aplicar taxa
    let prize = 0;
    if (result.winner === 'PLAYER') {
      if (gameConfig.opponent?.isBot) {
        prize = gameConfig.bet * 2; // Contra Bot: Dobra o valor (simulação de teste)
      } else {
        // PvP Real/Mock: 180% do valor apostado (90% do pote total)
        prize = Math.floor(gameConfig.bet * 1.8);
        
        // Ganha Pontos para o Jackpot apenas em PvP
        const pointsGained = Math.floor(result.playerScore / 10);
        setWeeklyPoints(prev => {
          const newPoints = prev + pointsGained;
          localStorage.setItem('farm_harvest_weekly_points', newPoints);
          return newPoints;
        });
        showToast(t('harvest_ranking_points', [pointsGained]), 'info');
      }
      setBalance(prev => prev + prize);
      playSound('success');
    } else if (result.winner === 'DRAW') {
      prize = gameConfig.bet; // Devolve aposta
      setBalance(prev => prev + prize);
    } else {
      playSound('error');
    }

    // Salvar no Histórico
    const newHistoryItem = {
      id: Date.now(),
      date: new Date().toISOString(),
      opponent: gameConfig.opponent.name,
      bet: gameConfig.bet,
      score: result.playerScore,
      oppScore: result.oppScore,
      result: result.winner === 'PLAYER' ? 'VITORIA' : result.winner === 'DRAW' ? 'EMPATE' : 'DERROTA',
      profit: result.winner === 'PLAYER' ? prize - gameConfig.bet : result.winner === 'DRAW' ? 0 : -gameConfig.bet,
      isPvP: !gameConfig.opponent.isBot
    };

    setHistory(prev => [newHistoryItem, ...prev].slice(0, 50));
    setGameState('RESULT');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col overflow-hidden animate-in fade-in duration-300">
      {/* Header Estilizado */}
      <div className="bg-gradient-to-b from-green-600 to-green-700 p-4 shadow-lg flex items-center justify-between border-b-4 border-green-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={gameState === 'LOBBY' ? onBack : () => setGameState('LOBBY')}
            className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-all text-white"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-white font-black text-lg md:text-xl flex items-center gap-2 leading-none uppercase">
              <Zap className="text-yellow-300 fill-yellow-300" size={20} />
              {t('harvest_lobby_title')}
            </h1>
            <p className="text-green-100 text-[10px] font-bold tracking-widest uppercase">{t('harvest_arena_pvp')}</p>
          </div>
        </div>

        <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20 backdrop-blur-md flex items-center gap-2">
          <Coins className="text-yellow-400" size={20} />
          <span className="text-white font-black">{balance}</span>
        </div>
      </div>

      {/* Conteúdo Dinâmico */}
      <div className="flex-1 overflow-y-auto bg-slate-100 relative">
        {gameState === 'LOBBY' && (
          <HarvestLobby 
            onStart={() => {
              console.log("HarvestGameScreen: Mudando para SETUP");
              setGameState('SETUP');
            }} 
            onViewHistory={() => setGameState('HISTORY')}
            onViewTreasury={() => setGameState('TREASURY')}
            history={history}
          />
        )}

        {gameState === 'SETUP' && (
          <HarvestSetup 
            onBack={() => setGameState('LOBBY')}
            onConfirm={handleStartGame}
            balance={balance}
            chickens={chickens}
          />
        )}

        {gameState === 'PLAYING' && (
          <HarvestEngine 
            config={gameConfig}
            onFinish={handleFinishGame}
            showToast={showToast}
          />
        )}

        {gameState === 'RESULT' && (
          <HarvestResult 
            result={lastResult}
            config={gameConfig}
            onRetry={() => setGameState('SETUP')}
            onLobby={() => setGameState('LOBBY')}
          />
        )}

        {gameState === 'HISTORY' && (
          <HarvestHistory 
            history={history}
            onBack={() => setGameState('LOBBY')}
          />
        )}

        {gameState === 'TREASURY' && (
          <HarvestTreasury 
            history={history}
            onBack={() => setGameState('LOBBY')}
          />
        )}
      </div>
    </div>
  );
};

export default HarvestGameScreen;
