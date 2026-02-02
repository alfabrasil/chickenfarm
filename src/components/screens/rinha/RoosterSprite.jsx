import React from 'react';
import { motion } from 'framer-motion';

const RoosterSprite = ({ color = '#ef4444', size = 120, className = '', isOpponent = false, element = 'FOGO' }) => {
  // Cores secundárias baseadas na cor principal
  const getSecondaryColor = (hex) => {
    // Escurece um pouco para as asas/detalhes
    return hex + 'CC'; // 80% opacidade simulada ou apenas usar o mesmo com filtro
  };

  return (
    <motion.div 
      className={`relative ${className}`}
      style={{ width: size, height: size, transform: isOpponent ? 'scaleX(-1)' : 'none' }}
    >
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
      >
        {/* Sombra de Elemento */}
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <linearGradient id={`grad-${element}`} x1="0%" y1="0%" x2="100%" y2="100%">
             {element === 'FOGO' && <><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#f59e0b" /></>}
             {element === 'AGUA' && <><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#06b6d4" /></>}
             {element === 'TERRA' && <><stop offset="0%" stopColor="#b45309" /><stop offset="100%" stopColor="#78350f" /></>}
             {element === 'AR' && <><stop offset="0%" stopColor="#94a3b8" /><stop offset="100%" stopColor="#f8fafc" /></>}
          </linearGradient>
        </defs>

        {/* Aura de Elemento */}
        <circle cx="50" cy="55" r="35" fill={`url(#grad-${element})`} fillOpacity="0.15" className="animate-pulse" />

        {/* Pernas */}
        <path d="M45 75L42 85M55 75L58 85M38 85H46M54 85H62" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />

        {/* Corpo Principal */}
        <path 
          d="M30 50C30 35 45 25 60 30C75 35 80 55 70 70C60 85 40 85 30 70C25 60 25 55 30 50Z" 
          fill={color} 
          stroke="black" 
          strokeWidth="1.5"
        />

        {/* Asa */}
        <path 
          d="M45 50C45 45 60 42 65 50C70 58 60 65 45 60Z" 
          fill={getSecondaryColor(color)} 
          stroke="black" 
          strokeWidth="1"
        />

        {/* Pescoço e Cabeça */}
        <path d="M35 55C32 45 30 35 35 25C40 15 50 15 55 25" stroke={color} strokeWidth="12" strokeLinecap="round" />
        <circle cx="45" cy="22" r="8" fill={color} stroke="black" strokeWidth="1" />
        
        {/* Crista */}
        <path d="M42 15C42 10 45 5 50 8C55 5 58 10 58 15" fill="#dc2626" stroke="black" strokeWidth="0.5" />

        {/* Bico */}
        <path d="M52 22L60 25L52 28Z" fill="#eab308" stroke="black" strokeWidth="0.5" />

        {/* Olho */}
        <circle cx="48" cy="20" r="1.5" fill="black" />

        {/* Detalhes de Penas (Cauda) */}
        <path d="M25 60C15 55 10 65 20 75M28 50C18 40 12 50 22 60" stroke={color} strokeWidth="4" strokeLinecap="round" />
      </svg>

      {/* Indicador de Elemento flutuante */}
      <div className="absolute -top-2 -right-2 bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-lg">
         {element === 'FOGO' && <span className="text-xs">🔥</span>}
         {element === 'AGUA' && <span className="text-xs">💧</span>}
         {element === 'TERRA' && <span className="text-xs">🌱</span>}
         {element === 'AR' && <span className="text-xs">💨</span>}
      </div>
    </motion.div>
  );
};

export default RoosterSprite;
