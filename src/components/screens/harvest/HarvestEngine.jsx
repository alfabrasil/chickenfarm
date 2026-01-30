import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Timer, Trophy, Zap, Shield, Skull, Coins, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { playSound } from '../../../utils/audioSystem';
import { MINIGAME_CONFIG } from '../../../data/gameConfig';

const GRID_SIZE = 6;
const CELL_SIZE = 100; // Porcentagem para o CSS grid

const ITEMS = {
  CORN: { id: 'CORN', name: 'Milho', icon: '🌽', points: 1, chance: 0.40 },
  WORM: { id: 'WORM', name: 'Minhoca', icon: '🐛', points: 2, chance: 0.25 },
  GOLDEN_EGG: { id: 'GOLDEN_EGG', name: 'Ovo Dourado', icon: '🥚', points: 5, chance: 0.05 },
  PEPPER: { id: 'PEPPER', name: 'Pimenta', icon: '🌶️', effect: 'SPEED', duration: 3, chance: 0.15 },
  ROTTEN_EGG: { id: 'ROTTEN_EGG', name: 'Ovo Podre', icon: '💩', points: -2, chance: 0.10 },
  SHIELD: { id: 'SHIELD', name: 'Escudo', icon: '🛡️', effect: 'SHIELD', duration: 2, chance: 0.05 }
};

const HarvestEngine = ({ config, onFinish, showToast }) => {
  const passive = config.selectedChicken ? MINIGAME_CONFIG.HARVEST.PASSIVES[config.selectedChicken.type] : null;
  const baseSpeed = passive?.bonus === 'SPEED_BASE' ? (1 + passive.value) : 1;

  const [player, setPlayer] = useState({ 
    x: 0, 
    y: 0, 
    score: 0, 
    speed: baseSpeed, 
    shield: passive?.bonus === 'SHIELD_ONCE' ? 1 : 0 
  });
  const [opp, setOpp] = useState({ x: GRID_SIZE - 1, y: GRID_SIZE - 1, score: 0, speed: 1, shield: 0 });
  const [items, setItems] = useState([]);
  const [timeLeft, setTimeLeft] = useState(config.time);
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const gameLoopRef = useRef();
  const lastMoveRef = useRef(0);

  // Ref para acessar estado atual nos intervalos sem reiniciar o timer
  const stateRef = useRef({ player, opp, items, timeLeft });
  useEffect(() => {
    stateRef.current = { player, opp, items, timeLeft };
  }, [player, opp, items, timeLeft]);

  // --- ITEM SPAWN TIMER ---
  useEffect(() => {
    if (!isReady) return;

    const interval = setInterval(() => {
      const { player, opp, items, timeLeft } = stateRef.current;
      if (timeLeft <= 0) return;

      const roll = Math.random();
      let cumulative = 0;
      let selectedItem = ITEMS.CORN;

      for (const key in ITEMS) {
        cumulative += ITEMS[key].chance;
        if (roll <= cumulative) {
          selectedItem = ITEMS[key];
          break;
        }
      }

      // Achar posição vazia
      const occupied = [
        `${player.x}-${player.y}`,
        `${opp.x}-${opp.y}`,
        ...items.map(i => `${i.x}-${i.y}`)
      ];

      const available = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
          if (!occupied.includes(`${x}-${y}`)) {
            available.push({ x, y });
          }
        }
      }

      if (available.length > 0) {
        const pos = available[Math.floor(Math.random() * available.length)];
        setItems(prev => [...prev, { ...pos, ...selectedItem, id: Date.now() }]);
      }
    }, 3000); // Novo item a cada 3s

    return () => clearInterval(interval);
  }, [isReady]);

  // --- GAME START / COUNTDOWN ---
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
      playSound('game_start');
    }
  }, [countdown]);

  // --- GAME TIMER ---
  useEffect(() => {
    if (!isReady || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isReady, timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) {
      const winner = player.score > opp.score ? 'PLAYER' : player.score < opp.score ? 'OPPONENT' : 'DRAW';
      onFinish({ winner, playerScore: player.score, oppScore: opp.score });
    }
  }, [timeLeft, player.score, opp.score, onFinish]);

  // --- PLAYER MOVEMENT ---
  const movePlayer = useCallback((dx, dy) => {
    if (!isReady || timeLeft <= 0) return;

    // Throttle movement
    const now = Date.now();
    const moveDelay = player.speed > 1 ? 100 : 200;
    if (now - lastMoveRef.current < moveDelay) return;
    lastMoveRef.current = now;

    setPlayer(prev => {
      let nx = prev.x + dx;
      let ny = prev.y + dy;

      // Habilidade MUTANTE: Teletransporte (Bordas)
      if (passive?.bonus === 'TELEPORT') {
        if (nx < 0) nx = GRID_SIZE - 1;
        else if (nx >= GRID_SIZE) nx = 0;
        if (ny < 0) ny = GRID_SIZE - 1;
        else if (ny >= GRID_SIZE) ny = 0;
      } else {
        nx = Math.max(0, Math.min(GRID_SIZE - 1, nx));
        ny = Math.max(0, Math.min(GRID_SIZE - 1, ny));
      }

      // Check collision with opponent
      if (nx === opp.x && ny === opp.y) {
        // Pushing mechanic
        const force = passive?.bonus === 'PUSH_FORCE' ? 2 : 1;
        const pushX = opp.x + (dx * force);
        const pushY = opp.y + (dy * force);
        
        const finalPushX = Math.max(0, Math.min(GRID_SIZE - 1, pushX));
        const finalPushY = Math.max(0, Math.min(GRID_SIZE - 1, pushY));

        if (finalPushX !== opp.x || finalPushY !== opp.y) {
          setOpp(o => ({ ...o, x: finalPushX, y: finalPushY }));
          playSound('pop');
        }
        return prev;
      }

      // Check item collection
      const itemAtPos = items.find(i => i.x === nx && i.y === ny);
      if (itemAtPos) {
        setItems(prevItems => prevItems.filter(i => i.id !== itemAtPos.id));
        
        let newScore = prev.score + (itemAtPos.points || 0);
        let newSpeed = prev.speed;
        let newShield = prev.shield;

        // Regra de Escudo Passivo (GRANJA)
        if (itemAtPos.points < 0 && newShield > 0) {
          newShield--;
          newScore = prev.score; // Não perde pontos
          playSound('achievement');
          showToast("Escudo Protegeu!", "info");
          return { ...prev, x: nx, y: ny, score: newScore, shield: newShield };
        }

        if (itemAtPos.effect === 'SPEED') {
          newSpeed = 1.5;
          const duration = passive?.bonus === 'BUFF_EXTEND' ? itemAtPos.duration * (1 + passive.value) : itemAtPos.duration;
          setTimeout(() => setPlayer(p => ({ ...p, speed: baseSpeed })), duration * 1000);
          playSound('success');
        } else if (itemAtPos.effect === 'SHIELD') {
          newShield = 2; 
          playSound('achievement');
        } else if (itemAtPos.points > 0) {
          playSound('pop');
        } else if (itemAtPos.points < 0) {
          playSound('error');
        }

        return { ...prev, x: nx, y: ny, score: newScore, speed: newSpeed, shield: newShield };
      }

      return { ...prev, x: nx, y: ny };
    });
  }, [isReady, timeLeft, opp, items, player.speed]);

  // Keyboard Controls
  useEffect(() => {
    const handleKey = (e) => {
      switch(e.key.toLowerCase()) {
        case 'arrowup': case 'w': movePlayer(0, -1); break;
        case 'arrowdown': case 's': movePlayer(0, 1); break;
        case 'arrowleft': case 'a': movePlayer(-1, 0); break;
        case 'arrowright': case 'd': movePlayer(1, 0); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [movePlayer]);

  // --- BOT AI ---
  useEffect(() => {
    if (!isReady || !config.opponent.isBot) return;

    const botSpeed = config.difficulty === 'EASY' ? 1200 : config.difficulty === 'MEDIUM' ? 800 : 500;
    
    const botInterval = setInterval(() => {
      const { player, items, timeLeft } = stateRef.current;
      if (timeLeft <= 0) return;

      setOpp(prev => {
        // Simple AI: Find nearest high-value item
        let target = null;
        let minDist = Infinity;

        // Prioridade: Ovos dourados > Milho > Longe do player se o player tiver escudo
        const goodItems = items.filter(i => i.points > 0 || i.effect);
        
        if (goodItems.length > 0) {
          goodItems.forEach(item => {
            const dist = Math.abs(item.x - prev.x) + Math.abs(item.y - prev.y);
            if (dist < minDist) {
              minDist = dist;
              target = item;
            }
          });
        }

        if (!target) {
          // Move randomly if no items
          const moves = [[0,1],[0,-1],[1,0],[-1,0]];
          const move = moves[Math.floor(Math.random()*4)];
          target = { x: prev.x + move[0], y: prev.y + move[1] };
        }

        let dx = 0;
        let dy = 0;
        if (target.x > prev.x) dx = 1;
        else if (target.x < prev.x) dx = -1;
        else if (target.y > prev.y) dy = 1;
        else if (target.y < prev.y) dy = -1;

        let nx = Math.max(0, Math.min(GRID_SIZE - 1, prev.x + dx));
        let ny = Math.max(0, Math.min(GRID_SIZE - 1, prev.y + dy));

        // Bot collision with player
        if (nx === player.x && ny === player.y) {
           // Try to push player
           const pushX = player.x + dx;
           const pushY = player.y + dy;
           if (pushX >= 0 && pushX < GRID_SIZE && pushY >= 0 && pushY < GRID_SIZE) {
             setPlayer(p => ({ ...p, x: pushX, y: pushY }));
           }
           return prev;
        }

        // Collect item
        const itemAtPos = items.find(i => i.x === nx && i.y === ny);
        if (itemAtPos) {
          setItems(prevItems => prevItems.filter(i => i.id !== itemAtPos.id));
          return { ...prev, x: nx, y: ny, score: prev.score + (itemAtPos.points || 0) };
        }

        return { ...prev, x: nx, y: ny };
      });
    }, botSpeed);

    return () => clearInterval(botInterval);
  }, [isReady, config.difficulty, config.opponent.isBot]);

  return (
    <div className="flex flex-col h-full bg-slate-900 p-4 select-none">
      {/* HUD Superior */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white/10 p-4 rounded-3xl border border-white/10 backdrop-blur-md flex items-center gap-4">
          <div className="text-center">
            <div className="text-[10px] font-black text-green-400 uppercase tracking-widest">Você</div>
            <div className="text-2xl font-black text-white">{player.score}</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <div className="text-[10px] font-black text-red-400 uppercase tracking-widest">{config.opponent.name}</div>
            <div className="text-2xl font-black text-white">{opp.score}</div>
          </div>
        </div>

        {/* Badge da Habilidade Passiva */}
        {passive && (
          <div className="hidden sm:flex bg-green-500/20 border border-green-500/50 px-4 py-2 rounded-2xl items-center gap-3 animate-in slide-in-from-top-2">
            <div className="text-2xl">{passive.icon}</div>
            <div>
              <div className="text-[8px] font-black text-green-400 uppercase leading-none mb-1">{passive.label} Ativo</div>
              <div className="text-[10px] text-white font-bold leading-none">{passive.desc}</div>
            </div>
          </div>
        )}

        <div className="bg-amber-500 p-4 rounded-3xl shadow-lg shadow-amber-900/50 flex items-center gap-2 border-b-4 border-amber-700">
          <Timer className="text-white animate-pulse" />
          <span className="text-2xl font-black text-white tabular-nums">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Grid de Jogo */}
      <div className="flex-1 flex items-center justify-center relative">
        <div 
          className="grid gap-1 bg-slate-800 p-2 rounded-3xl shadow-2xl border-4 border-slate-700"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(90vw, 400px)',
            height: 'min(90vw, 400px)'
          }}
        >
          {Array(GRID_SIZE * GRID_SIZE).fill(0).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isPlayer = player.x === x && player.y === y;
            const isOpp = opp.x === x && opp.y === y;
            const item = items.find(it => it.x === x && it.y === y);

            // Habilidade CAIPIRA: Detecta itens próximos (distância 1)
            const isNearItem = passive?.bonus === 'VISION' && item && (Math.abs(player.x - x) + Math.abs(player.y - y) <= 1);

            return (
              <div 
                key={i} 
                className={`relative bg-slate-700/50 rounded-lg flex items-center justify-center overflow-hidden transition-all ${isNearItem ? 'ring-2 ring-amber-400/50 bg-amber-900/20' : ''}`}
              >
                {/* Grama/Piso */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="w-full h-full border border-white/5" />
                </div>

                {/* Itens */}
                {item && (
                  <div className="text-3xl animate-in zoom-in duration-300 drop-shadow-lg z-10">
                    {item.icon}
                  </div>
                )}

                {/* Personagens */}
                {isPlayer && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 transition-all duration-150">
                    <div className="relative">
                      <div className="text-4xl animate-bounce">🐔</div>
                      {player.speed > 1 && <div className="absolute -bottom-1 -right-1 text-xl animate-pulse">🌶️</div>}
                      {player.shield > 0 && <div className="absolute -top-1 -left-1 text-xl animate-spin">🛡️</div>}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-white whitespace-nowrap shadow-sm">VOCÊ</div>
                    </div>
                  </div>
                )}

                {isOpp && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 transition-all duration-150">
                    <div className="relative">
                      <div className="text-4xl animate-bounce">🐓</div>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-white whitespace-nowrap shadow-sm truncate max-w-[40px]">{config.opponent.name}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Countdown Overlay */}
        {!isReady && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-[3rem]">
            <div className="text-center">
              <div className="text-9xl font-black text-white animate-ping drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                {countdown}
              </div>
              <div className="text-white font-black mt-8 tracking-[1em] uppercase opacity-50">Prepare-se!</div>
            </div>
          </div>
        )}
      </div>

      {/* Controles Mobile */}
      <div className="mt-8 grid grid-cols-3 gap-2 max-w-[200px] mx-auto md:hidden">
        <div />
        <button onClick={() => movePlayer(0, -1)} className="w-14 h-14 bg-slate-800 text-white rounded-2xl flex items-center justify-center active:bg-slate-700 shadow-lg border-b-4 border-slate-950"><ArrowUp /></button>
        <div />
        <button onClick={() => movePlayer(-1, 0)} className="w-14 h-14 bg-slate-800 text-white rounded-2xl flex items-center justify-center active:bg-slate-700 shadow-lg border-b-4 border-slate-950"><ArrowLeft /></button>
        <button onClick={() => movePlayer(0, 1)} className="w-14 h-14 bg-slate-800 text-white rounded-2xl flex items-center justify-center active:bg-slate-700 shadow-lg border-b-4 border-slate-950"><ArrowDown /></button>
        <button onClick={() => movePlayer(1, 0)} className="w-14 h-14 bg-slate-800 text-white rounded-2xl flex items-center justify-center active:bg-slate-700 shadow-lg border-b-4 border-slate-950"><ArrowRight /></button>
      </div>

      {/* Dica */}
      <div className="text-center mt-6 text-slate-500 font-bold text-[10px] uppercase tracking-widest hidden md:block">
        Use WASD ou Setas para se mover e empurrar o oponente!
      </div>
    </div>
  );
};

export default HarvestEngine;
