import React, { useState, useEffect } from 'react';
import { X, Dices, Users2, Trophy, HelpCircle, DoorOpen, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { MINIGAME_CONFIG } from '../../data/gameConfig';
import { playSound } from '../../utils/audioSystem';

const ChickenChaseScreen = ({ onBack, balance, setBalance, showToast }) => {
  const [activeTab, setActiveTab] = useState('SOLO'); // 'SOLO' | 'PVP'
  
  // --- STATE: SOLO MODE ---
  const [soloState, setSoloState] = useState('IDLE'); // IDLE, PLAYING, WON, LOST
  const [soloDoors, setSoloDoors] = useState([]);
  const [soloAttempts, setSoloAttempts] = useState(0);
  const [soloChickenDoor, setSoloChickenDoor] = useState(null);

  // --- STATE: PVP MODE ---
  const [pvpState, setPvpState] = useState('LOBBY'); // LOBBY, PLAYING, WON, LOST
  const [pvpDoors, setPvpDoors] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [pvpTurn, setPvpTurn] = useState(null); // 'PLAYER', 'OPPONENT'
  const [pvpChickenDoor, setPvpChickenDoor] = useState(null);
  
  // Mock Challenges Book
  const [challenges, setChallenges] = useState([
    { id: 'c1', player: 'ReiDoOvo', bet: 50, avatar: '👑' },
    { id: 'c2', player: 'CryptoFarmer', bet: 100, avatar: '🚀' },
    { id: 'c3', player: 'NoobMaster', bet: 10, avatar: '👶' },
    { id: 'c4', player: 'RichDuck', bet: 500, avatar: '🦆' },
    { id: 'c5', player: 'LuckyHen', bet: 20, avatar: '🐔' },
  ]);

  // --- SOLO FUNCTIONS ---
  const startSoloGame = () => {
    if (balance < MINIGAME_CONFIG.SOLO_BET) {
      showToast("Saldo insuficiente!", 'error');
      return;
    }
    
    setBalance(prev => prev - MINIGAME_CONFIG.SOLO_BET);
    setSoloState('PLAYING');
    setSoloAttempts(0);
    
    // Setup Doors
    const doors = Array(MINIGAME_CONFIG.DOOR_COUNT).fill(null).map((_, i) => ({ id: i, status: 'CLOSED' }));
    setSoloDoors(doors);
    
    // Hide Chicken
    const luckyDoor = Math.floor(Math.random() * MINIGAME_CONFIG.DOOR_COUNT);
    setSoloChickenDoor(luckyDoor);
    
    playSound('click');
  };

  const handleSoloDoorClick = (doorId) => {
    if (soloState !== 'PLAYING') return;
    if (soloDoors[doorId].status === 'OPEN') return;

    const isChicken = doorId === soloChickenDoor;
    const newDoors = [...soloDoors];
    newDoors[doorId].status = 'OPEN';
    newDoors[doorId].content = isChicken ? 'CHICKEN' : 'EMPTY';
    setSoloDoors(newDoors);

    if (isChicken) {
      setSoloState('WON');
      const reward = Math.floor(MINIGAME_CONFIG.SOLO_BET * MINIGAME_CONFIG.SOLO_REWARD_MULTIPLIER);
      setBalance(prev => prev + reward);
      playSound('success');
      showToast(`Você achou! Ganhou ${reward} moedas!`, 'success');
    } else {
      const newAttempts = soloAttempts + 1;
      setSoloAttempts(newAttempts);
      if (newAttempts >= MINIGAME_CONFIG.SOLO_ATTEMPTS) {
        setSoloState('LOST');
        playSound('error');
        showToast("Suas tentativas acabaram!", 'error');
        // Reveal chicken
        const revealedDoors = newDoors.map((d, i) => i === soloChickenDoor ? { ...d, status: 'OPEN', content: 'CHICKEN' } : d);
        setSoloDoors(revealedDoors);
      } else {
        playSound('pop');
      }
    }
  };

  // --- PVP FUNCTIONS ---
  const joinChallenge = (challenge) => {
    if (balance < challenge.bet) {
      showToast({ message: "Saldo insuficiente para esta aposta!", type: 'error' });
      return;
    }

    setBalance(prev => prev - challenge.bet);
    setCurrentChallenge(challenge);
    setPvpState('PLAYING');
    setPvpTurn('PLAYER'); // Challenger always starts? Let's say Player starts for better UX
    
    // Setup Doors
    const doors = Array(MINIGAME_CONFIG.DOOR_COUNT).fill(null).map((_, i) => ({ id: i, status: 'CLOSED' }));
    setPvpDoors(doors);
    
    // Hide Chicken
    const luckyDoor = Math.floor(Math.random() * MINIGAME_CONFIG.DOOR_COUNT);
    setPvpChickenDoor(luckyDoor);
    
    playSound('game_start');
  };

  const handlePvpDoorClick = (doorId) => {
    if (pvpState !== 'PLAYING' || pvpTurn !== 'PLAYER') return;
    if (pvpDoors[doorId].status === 'OPEN') return;

    processPvpTurn(doorId, 'PLAYER');
  };

  const processPvpTurn = (doorId, who) => {
    const isChicken = doorId === pvpChickenDoor;
    const newDoors = [...pvpDoors];
    newDoors[doorId].status = 'OPEN';
    newDoors[doorId].content = isChicken ? 'CHICKEN' : 'EMPTY';
    setPvpDoors(newDoors);

    if (isChicken) {
      if (who === 'PLAYER') {
        setPvpState('WON');
        const winAmount = Math.floor(currentChallenge.bet + (currentChallenge.bet * (1 - MINIGAME_CONFIG.PVP_BURN_FEE)));
        setBalance(prev => prev + winAmount);
        playSound('success');
        showToast(`Você venceu! Ganhou ${winAmount} moedas!`, 'success');
      } else {
        setPvpState('LOST');
        playSound('error');
        showToast(`${currentChallenge.player} achou a galinha! Você perdeu.`, 'error');
      }
    } else {
      playSound(who === 'PLAYER' ? 'pop' : 'pop_soft');
      const nextTurn = who === 'PLAYER' ? 'OPPONENT' : 'PLAYER';
      setPvpTurn(nextTurn);
    }
  };

  // Opponent AI Effect
  useEffect(() => {
    if (pvpState === 'PLAYING' && pvpTurn === 'OPPONENT') {
      const timer = setTimeout(() => {
        // AI picks random closed door
        const closedDoors = pvpDoors.filter(d => d.status === 'CLOSED').map(d => d.id);
        if (closedDoors.length > 0) {
          const randomPick = closedDoors[Math.floor(Math.random() * closedDoors.length)];
          processPvpTurn(randomPick, 'OPPONENT');
        }
      }, 1500); // 1.5s delay for "thinking"
      return () => clearTimeout(timer);
    }
  }, [pvpState, pvpTurn, pvpDoors]);


  // --- RENDER HELPERS ---
  const renderDoor = (door, onClick, disabled) => (
    <button
      key={door.id}
      disabled={disabled || door.status === 'OPEN'}
      onClick={() => onClick(door.id)}
      className={`relative aspect-[3/4] rounded-t-full border-4 transition-all transform duration-300 ${
        door.status === 'OPEN' 
          ? (door.content === 'CHICKEN' ? 'bg-yellow-200 border-yellow-500 scale-110 shadow-[0_0_20px_rgba(234,179,8,0.6)] z-10' : 'bg-slate-800 border-slate-600') 
          : 'bg-orange-700 border-orange-900 hover:scale-105 active:scale-95 shadow-lg'
      }`}
    >
      {door.status === 'CLOSED' ? (
        <div className="w-full h-full flex items-center justify-center opacity-50">
          <div className="w-full h-full border-2 border-dashed border-orange-950/30 rounded-t-full m-2"></div>
          {/* Knob */}
          <div className="absolute right-2 top-1/2 w-2 h-2 bg-yellow-600 rounded-full shadow-sm"></div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center animate-in zoom-in duration-500">
          {door.content === 'CHICKEN' ? (
            <div className="relative">
              <span className="text-5xl animate-bounce absolute -top-4 -left-3">🐔</span>
              <span className="text-5xl animate-ping absolute -top-4 -left-3 opacity-30">✨</span>
            </div>
          ) : (
            <span className="text-5xl opacity-80 drop-shadow-md animate-pulse text-slate-400">🕸️</span>
          )}
        </div>
      )}
    </button>
  );

  return (
    <div className="animate-in slide-in-from-bottom-10 fade-in pb-24 md:pb-0 min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 rounded-b-3xl shadow-xl mb-6 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="bg-white/10 p-2 rounded-full hover:bg-white/20"><X size={20}/></button>
          <h1 className="text-xl font-black flex items-center gap-2"><Dices className="text-pink-500"/> CHICKEN CHASE</h1>
          <div className="bg-yellow-500 text-slate-900 px-3 py-1 rounded-full font-bold text-sm">💰 {balance}</div>
        </div>
        
        <div className="flex p-1 bg-slate-800 rounded-xl">
          <button 
            onClick={() => setActiveTab('SOLO')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'SOLO' ? 'bg-pink-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            SOLO (1 Jogador)
          </button>
          <button 
            onClick={() => setActiveTab('PVP')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'PVP' ? 'bg-purple-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            PvP (Apostas)
          </button>
        </div>
      </div>

      <div className="px-4 pb-8">
        {activeTab === 'SOLO' && (
          <div className="flex flex-col gap-6">
            {soloState === 'IDLE' ? (
              <div className="bg-white rounded-3xl p-6 shadow-xl text-center border-b-8 border-pink-100">
                <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-inner">🎯</div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Desafio Solo</h2>
                <p className="text-slate-500 mb-6">Encontre a galinha em {MINIGAME_CONFIG.SOLO_ATTEMPTS} tentativas.</p>
                
                <div className="bg-slate-50 p-4 rounded-xl mb-6 border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-500">Aposta</span>
                    <span className="font-bold text-slate-800">{MINIGAME_CONFIG.SOLO_BET} 💰</span>
                  </div>
                  <div className="flex justify-between items-center text-green-600">
                    <span className="">Prêmio</span>
                    <span className="font-black text-lg">+{Math.floor(MINIGAME_CONFIG.SOLO_BET * MINIGAME_CONFIG.SOLO_REWARD_MULTIPLIER - MINIGAME_CONFIG.SOLO_BET)} (Total {Math.floor(MINIGAME_CONFIG.SOLO_BET * MINIGAME_CONFIG.SOLO_REWARD_MULTIPLIER)}) 💰</span>
                  </div>
                </div>

                <button onClick={startSoloGame} className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-xl font-black shadow-lg border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 transition-all">
                  JOGAR AGORA
                </button>
              </div>
            ) : (
              <div className="animate-in fade-in flex flex-col gap-4">
                <div className="flex justify-between items-center px-2">
                  <div className="text-slate-500 font-bold text-sm">Tentativas: <span className={`${soloAttempts >= MINIGAME_CONFIG.SOLO_ATTEMPTS - 1 ? 'text-red-600 animate-pulse' : 'text-pink-600'} text-lg transition-colors`}>{MINIGAME_CONFIG.SOLO_ATTEMPTS - soloAttempts}</span></div>
                  <div className="text-slate-400 text-xs font-medium">{soloState === 'WON' ? 'VOCÊ VENCEU!' : soloState === 'LOST' ? 'GAME OVER' : 'Ache a galinha!'}</div>
                </div>
                
                <div className="grid grid-cols-4 gap-3">
                  {soloDoors.map(door => renderDoor(door, handleSoloDoorClick, soloState !== 'PLAYING'))}
                </div>

                {(soloState === 'WON' || soloState === 'LOST') && (
                  <div className={`mt-4 p-6 rounded-2xl text-center shadow-xl animate-in slide-in-from-bottom-5 ${soloState === 'WON' ? 'bg-green-100 border-b-4 border-green-300' : 'bg-red-100 border-b-4 border-red-300'}`}>
                    <div className="text-3xl mb-2">{soloState === 'WON' ? '🎉' : '💀'}</div>
                    <h3 className={`text-xl font-black mb-1 ${soloState === 'WON' ? 'text-green-700' : 'text-red-700'}`}>
                      {soloState === 'WON' ? 'Parabéns!' : 'Que pena!'}
                    </h3>
                    <p className={`text-sm mb-4 ${soloState === 'WON' ? 'text-green-600' : 'text-red-600'}`}>
                      {soloState === 'WON' ? `Você ganhou ${Math.floor(MINIGAME_CONFIG.SOLO_BET * MINIGAME_CONFIG.SOLO_REWARD_MULTIPLIER)} moedas!` : 'Tente novamente.'}
                    </p>
                    <button onClick={startSoloGame} className={`w-full py-3 rounded-xl font-bold text-white shadow-md transition-all active:scale-95 ${soloState === 'WON' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>
                      Jogar Novamente
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'PVP' && (
          <div className="flex flex-col gap-6">
            {pvpState === 'LOBBY' ? (
              <>
                <div className="bg-purple-600 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-2xl font-black mb-1">Arena PvP</h2>
                    <p className="text-purple-200 text-sm mb-4">Desafie outros jogadores. O vencedor leva a aposta + 80%!</p>
                    <button className="bg-white text-purple-700 px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-purple-50 transition-all flex items-center gap-2">
                       <Play size={16}/> CRIAR APOSTA
                    </button>
                  </div>
                  <div className="absolute -right-4 -bottom-4 text-purple-800 opacity-50"><Users2 size={120}/></div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-black text-slate-700 ml-2">Livro de Apostas</h3>
                  {challenges.map(c => (
                    <div key={c.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl">{c.avatar}</div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{c.player}</div>
                          <div className="text-xs text-slate-500">Aposta: <span className="font-black text-yellow-600">{c.bet} 💰</span></div>
                        </div>
                      </div>
                      <button onClick={() => joinChallenge(c)} className="bg-purple-500 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md border-b-2 border-purple-700 hover:bg-purple-600 active:border-b-0 active:translate-y-0.5">
                        DESAFIAR
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="animate-in fade-in">
                <div className="bg-white p-4 rounded-2xl shadow-md mb-6 border-b-4 border-purple-100 flex justify-between items-center">
                   <div className="text-center">
                     <div className="text-xs text-slate-400 font-bold">VOCÊ</div>
                     <div className={`font-black ${pvpTurn === 'PLAYER' ? 'text-purple-600 animate-pulse' : 'text-slate-300'}`}>{pvpTurn === 'PLAYER' ? 'Sua Vez' : 'Aguarde'}</div>
                   </div>
                   <div className="font-black text-xl text-yellow-500">VS</div>
                   <div className="text-center">
                     <div className="text-xs text-slate-400 font-bold">{currentChallenge?.player}</div>
                     <div className={`font-black ${pvpTurn === 'OPPONENT' ? 'text-red-500 animate-pulse' : 'text-slate-300'}`}>{pvpTurn === 'OPPONENT' ? 'Jogando...' : 'Aguarde'}</div>
                   </div>
                </div>

                {(pvpState === 'WON' || pvpState === 'LOST') && (
                  <div className={`p-4 rounded-2xl mb-6 text-center text-white font-bold animate-bounce ${pvpState === 'WON' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {pvpState === 'WON' ? 'VOCÊ VENCEU!' : 'VOCÊ PERDEU!'}
                    <button onClick={() => setPvpState('LOBBY')} className="block w-full mt-2 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm">Voltar ao Lobby</button>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-3">
                  {pvpDoors.map(door => renderDoor(door, handlePvpDoorClick, pvpState !== 'PLAYING' || pvpTurn !== 'PLAYER'))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChickenChaseScreen;
