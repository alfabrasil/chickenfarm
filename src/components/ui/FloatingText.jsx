import React from 'react';

const FloatingText = ({ items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute flex flex-col items-center justify-center font-black text-2xl drop-shadow-md animate-[float-up_1s_ease-out_forwards]"
          style={{ left: item.x, top: item.y, color: item.color || '#22c55e' }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

export default FloatingText;
