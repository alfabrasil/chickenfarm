import React from 'react';

const Confetti = () => (
  <div className="fixed inset-0 pointer-events-none z-[150] overflow-hidden">
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="absolute w-3 h-3 bg-red-500 rounded-sm animate-[confetti_3s_ease-out_forwards]"
        style={{
          left: '50%',
          top: '50%',
          backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][i % 5],
          transform: `rotate(${Math.random() * 360}deg)`,
          '--tx': `${(Math.random() - 0.5) * 100}vw`,
          '--ty': `${(Math.random() - 0.5) * 100}vh`,
          animationDelay: `${Math.random() * 0.2}s`
        }}
      ></div>
    ))}
    <style>{`
      @keyframes confetti {
        0% { transform: translate(0, 0) scale(0); opacity: 1; }
        50% { opacity: 1; }
        100% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(720deg); opacity: 0; }
      }
    `}</style>
  </div>
);

export default Confetti;
