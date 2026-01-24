import React from 'react';
import { Sun, Moon, CloudRain, Cloud } from 'lucide-react';
import { SKINS_CONFIG } from '../../data/gameConfig';

const FarmBackground = ({ isNight, weather, skinId = 'DEFAULT' }) => {
  const skin = SKINS_CONFIG[skinId] || SKINS_CONFIG.DEFAULT;
  
  return (
    <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden font-sans transition-colors duration-1000 ${isNight ? 'bg-slate-900' : weather === 'RAINY' ? 'bg-slate-400' : ''}`}>
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isNight ? 'opacity-0' : 'opacity-100'} ${weather === 'RAINY' ? 'bg-gradient-to-b from-slate-600 via-slate-400 to-slate-300' : `bg-gradient-to-b ${skin.skyDay} to-white`}`}></div>
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isNight ? 'opacity-100' : 'opacity-0'} bg-gradient-to-b ${skin.skyNight} via-slate-800 to-black`}></div>
      <div className={`absolute top-10 right-10 transition-transform duration-1000 ${isNight ? 'translate-y-96 opacity-0' : 'translate-y-0 opacity-100'} ${weather === 'RAINY' ? 'opacity-0' : 'opacity-100'} text-yellow-400 animate-pulse`}><Sun size={80} fill="currentColor" className="opacity-80" /></div>
      <div className={`absolute top-10 right-10 transition-transform duration-1000 ${isNight ? 'translate-y-0 opacity-100' : '-translate-y-32 opacity-0'} text-slate-200`}><Moon size={60} fill="currentColor" /></div>
      {!isNight && weather === 'RAINY' && (<><div className="absolute top-10 left-10 text-slate-600 opacity-80 animate-[float_10s_linear_infinite]"><CloudRain size={80} fill="currentColor" /></div><div className="absolute top-20 right-1/3 text-slate-600 opacity-80 animate-[float_12s_linear_infinite_reverse]"><CloudRain size={60} fill="currentColor" /></div></>)}
      {!isNight && weather === 'SUNNY' && (<><div className="absolute top-20 left-10 text-white opacity-60 animate-[bounce_8s_infinite]"><Cloud size={64} fill="currentColor" /></div><div className="absolute top-40 right-1/3 text-white opacity-40 animate-[bounce_12s_infinite_reverse]"><Cloud size={48} fill="currentColor" /></div></>)}
      
      {/* Solo Customizável */}
      <div className={`absolute bottom-0 w-full h-1/3 rounded-t-[50%_20%] scale-110 transition-colors duration-1000 bg-gradient-to-t ${skin.groundFrom} ${skin.groundTo} ${isNight ? 'brightness-50' : ''}`}></div>
      
      <div className="absolute bottom-[28%] w-full flex justify-between px-10 opacity-80 text-4xl">
         {skin.id === 'DESERT' ? <><span className="transform -scale-x-100">🌵</span><span>🚜</span><span className="hidden md:inline">⛺</span><span>🌵</span></> :
          skin.id === 'SNOW' ? <><span className="transform -scale-x-100">🌲</span><span>❄️</span><span className="hidden md:inline">🏠</span><span>⛄</span></> :
          skin.id === 'CYBER' ? <><span className="transform -scale-x-100">🏙️</span><span>🏎️</span><span className="hidden md:inline">🏢</span><span>📡</span></> :
          <><span className="transform -scale-x-100">🌲</span><span>🚜</span><span className="hidden md:inline">🏡</span><span>🌲</span></>}
      </div>
    </div>
  );
};

export default FarmBackground;
