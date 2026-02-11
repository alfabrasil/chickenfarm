import React from 'react';
import { motion } from 'framer-motion';

const RoosterSprite = ({ color = '#ef4444', size = 120, className = '', isOpponent = false, element = 'FOGO' }) => {
  // Cores secundárias baseadas na cor principal
  const getSecondaryColor = (hex) => {
    // Escurece um pouco para as asas/detalhes
    return hex + 'CC'; 
  };

  const renderTail = () => {
    const tailProps = {
      initial: { y: 0, rotate: 0 },
      animate: { 
        y: [0, -3, 0],
        rotate: [0, 2, 0],
      },
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    };

    switch (element) {
      case 'FOGO':
        return (
          <motion.g {...tailProps}>
            <path d="M25 65C15 60 5 40 15 25C20 15 30 20 28 35C35 25 45 30 40 45C50 40 55 55 45 65" fill="url(#grad-fire)" stroke="#991b1b" strokeWidth="0.5" />
            <path d="M20 60C12 55 8 45 15 35C18 30 25 32 23 40C28 35 35 38 32 48C38 45 42 55 35 60" fill="#f59e0b" opacity="0.6" />
          </motion.g>
        );
      case 'AGUA':
        return (
          <motion.g {...tailProps}>
            <path d="M28 65C18 65 10 55 10 45C10 35 20 20 30 15C32 25 25 35 35 40C40 45 35 55 28 65Z" fill="url(#grad-water)" stroke="#1e40af" strokeWidth="0.5" />
            <circle cx="15" cy="40" r="3" fill="white" opacity="0.4" />
            <circle cx="22" cy="25" r="2" fill="white" opacity="0.3" />
          </motion.g>
        );
      case 'TERRA':
        return (
          <motion.g {...tailProps}>
            <path d="M30 65C20 65 12 55 12 40C12 25 25 15 35 25C40 35 35 55 30 65Z" fill="url(#grad-earth)" stroke="#166534" strokeWidth="1" />
            <path d="M30 65L20 40M30 65L35 25" stroke="#065f46" strokeWidth="1" strokeLinecap="round" />
          </motion.g>
        );
      case 'AR':
        return (
          <motion.g {...tailProps}>
            <path d="M30 65C15 65 5 55 10 40C15 25 30 20 40 30C35 35 30 45 35 55C38 60 35 65 30 65Z" fill="url(#grad-air)" stroke="#475569" strokeWidth="0.5" />
            <path d="M15 50C10 45 15 35 25 35M18 55C15 52 18 48 22 48" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          </motion.g>
        );
      default:
        return null;
    }
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
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <linearGradient id="grad-fire" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="grad-water" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <linearGradient id="grad-earth" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="grad-air" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>

          <filter id="innerShadow">
            <feOffset dx="0" dy="2" />
            <feGaussianBlur stdDeviation="1.5" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="black" floodOpacity="0.2" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* Aura de Elemento (mais sutil) */}
        <circle cx="55" cy="55" r="30" fill={
          element === 'FOGO' ? '#ef4444' : 
          element === 'AGUA' ? '#3b82f6' : 
          element === 'TERRA' ? '#22c55e' : '#94a3b8'
        } fillOpacity="0.15" className="animate-pulse" filter="url(#glow)" />

        {/* Cauda Elemental Animada */}
        {renderTail()}

        {/* Pernas */}
        <path d="M50 75L48 88M60 75L62 88M44 88H52M58 88H66" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />

        {/* Corpo Principal (Mais arredondado) */}
        <path 
          d="M35 55C35 38 50 28 65 32C80 36 85 55 75 72C65 85 45 85 35 72C32 68 32 62 35 55Z" 
          fill={color} 
          stroke="rgba(0,0,0,0.2)" 
          strokeWidth="1"
          filter="url(#innerShadow)"
        />

        {/* Asa */}
        <path 
          d="M50 55C50 50 65 48 70 55C75 65 65 72 50 65Z" 
          fill={getSecondaryColor(color)} 
          stroke="rgba(0,0,0,0.1)" 
          strokeWidth="1"
        />

        {/* Pescoço e Cabeça */}
        <path d="M42 60C38 50 35 40 40 30C45 20 55 20 60 30" stroke={color} strokeWidth="14" strokeLinecap="round" />
        <circle cx="50" cy="25" r="9" fill={color} filter="url(#innerShadow)" />
        
        {/* Crista */}
        <path d="M46 18C46 12 50 8 55 10C60 8 64 12 64 18" fill="#dc2626" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />

        {/* Bico */}
        <path d="M57 25L66 28L57 31Z" fill="#f59e0b" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />

        {/* Olho Bravo */}
        <g transform="translate(53, 23)">
          <circle cx="0" cy="0" r="2.5" fill="white" />
          <circle cx="0.5" cy="0" r="1.2" fill="black" />
          <path d="M-3 -2L3 -0.5" stroke="black" strokeWidth="1" strokeLinecap="round" />
        </g>
      </svg>
    </motion.div>
  );
};

export default RoosterSprite;
