import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const Fox = ({ x, y, onClick }) => {
  const { t } = useLanguage();
  return (
    <button
      onClick={onClick}
      className="absolute z-40 w-16 h-16 animate-[bounce_1s_infinite] cursor-pointer hover:scale-110 transition-transform"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="text-6xl drop-shadow-xl filter drop-shadow-[0_0_10px_rgba(255,100,0,0.8)]">🦊</div>
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse whitespace-nowrap">
        {t('fox_label')}
      </div>
    </button>
  );
};

export default Fox;
