import React from 'react';
import { TYPE_CONFIG } from '../data/gameConfig';
import { playSound } from '../utils/audioSystem';
import { 
  Heart, Droplets, Egg, AlertTriangle, Clock, Glasses, 
  CheckSquare, Syringe, Thermometer
} from 'lucide-react';

const ChickenCard = ({ chicken, onFeed, onCollect, onHeal, onClean, inventory, dayCount, addFloatingText }) => {
  const config = TYPE_CONFIG[chicken.type];
  
  // ENGENHARIA: Suporte a Variantes Customizadas (Ícones e Cores Únicas)
  const variant = chicken.variant || null;
  const activeColor = variant ? variant.color : config.color;
  const activeBorder = variant ? variant.border : config.border;
  const activeTextColor = variant ? variant.textColor : (config.textColor || 'text-slate-800');
  const activeIcon = variant ? variant.icon : config.icon;

  const isHungry = chicken.last_fed_day < dayCount;
  const isSick = chicken.is_sick; 
  const isAdult = chicken.age_days >= (chicken.adult_threshold || 30);
  const hasFeed = inventory.feed >= config.feedConsumption;
  const hasVaccine = inventory.vaccine >= 1;
  const hasPoop = chicken.has_poop; 
  const hasLaidToday = chicken.last_collected_day === dayCount;
  
  const renderAvatar = () => {
    if (isSick) return <div className="text-6xl animate-pulse grayscale brightness-50 contrast-125">🤢</div>;
    if (chicken.type === 'GRANJA' && !isAdult) return <div className="text-6xl animate-bounce">🐣</div>;
    
    // Ovo Alienígena (Verde) para Mutantes bebês
    if (chicken.type === 'MUTANTE' && !isAdult) return <div className="animate-pulse drop-shadow-[0_0_10px_rgba(34,197,94,0.8)] text-green-500 flex items-center justify-center h-full w-full"><Egg size={48} fill="currentColor" /></div>;
    
    // Visuais especiais para Mutantes/Cyber/Variantes
    if (variant) {
      return (
        <div className="text-6xl drop-shadow-lg hover:scale-125 transition-transform duration-500 flex flex-col items-center">
          {activeIcon}
          {chicken.type === 'CYBER' && <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-ping opacity-20"></div>}
        </div>
      );
    }

    if (chicken.type === 'CYBER') return <div className="text-6xl drop-shadow-[0_0_15px_rgba(0,255,255,0.8)] filter contrast-150 relative">🤖<div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-ping opacity-20"></div></div>;
    
    if (chicken.age_days >= 90 && chicken.type === 'GRANJA') return <div className="relative text-6xl grayscale-[0.3]">🐔<div className="absolute top-2 left-1 bg-white/80 rounded-full p-1 border border-black rotate-12"><Glasses size={16}/></div><div className="absolute bottom-0 right-0 text-xl">🦯</div></div>;
    
    return <div className="text-6xl drop-shadow-md hover:scale-110 transition-transform">{activeIcon}</div>;
  };

  return (
    <div className={`relative w-full p-3 rounded-3xl border-[4px] ${activeBorder} ${activeColor} shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] flex flex-col gap-2 bg-white/90 backdrop-blur-sm transition-all duration-300 ${isHungry && !isSick ? 'scale-[0.98] opacity-90' : 'hover:-translate-y-1'} ${isSick ? 'border-red-500 bg-red-50' : ''}`}>
      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm border border-white whitespace-nowrap ${chicken.type === 'GIGANTE' ? 'bg-purple-600' : chicken.type === 'CAIPIRA' ? 'bg-orange-600' : chicken.type === 'HIBRIDA' ? 'bg-pink-500' : chicken.type === 'MUTANTE' ? 'bg-green-700' : chicken.type === 'CYBER' ? 'bg-cyan-700' : 'bg-yellow-500'}`}>{config.label}</div>
      {(chicken.is_starter || chicken.immune) && <div className="absolute top-2 right-2 text-[10px] bg-blue-100 text-blue-600 px-1 rounded-md font-bold border border-blue-200">Imune</div>}
      {chicken.is_lab_created && !isAdult && <div className="absolute top-6 right-2 text-[9px] bg-pink-100 text-pink-600 px-1 rounded-md font-bold border border-pink-200 animate-pulse">Crescimento Acelerado</div>}
      <div className="flex justify-between items-start mt-2"><div><h3 className={`font-black text-sm leading-none ${activeTextColor}`}>{chicken.name}</h3><p className="text-[10px] font-bold text-slate-500 mt-1">{isAdult ? 'Adulta' : 'Filhote'} • {chicken.age_days} Dias</p></div><div className="flex flex-col items-end">{isSick ? (<span className="text-red-600 font-black flex items-center gap-1 text-[10px] animate-pulse"><Thermometer size={12}/> DOENTE</span>) : isHungry ? (<span className="text-orange-500 font-bold flex items-center gap-1 text-[10px]"><Clock size={12}/> FOME</span>) : (<span className="text-green-600 font-bold flex items-center gap-1 text-[10px]"><Heart size={12} fill="currentColor"/> FELIZ</span>)}</div></div>
      <div className={`bg-gradient-to-b from-sky-200 to-green-200 rounded-xl h-24 flex items-center justify-center border border-white/50 relative overflow-hidden shadow-inner ${isHungry || isSick ? 'grayscale-[0.5]' : ''}`}>{renderAvatar()}{hasPoop && !isSick && (<button onClick={(e) => { e.stopPropagation(); onClean(chicken, e); playSound('squish'); }} className="absolute bottom-2 right-2 text-2xl hover:scale-125 transition-transform cursor-pointer animate-bounce z-10" title="Limpar sujeira">💩</button>)}{isHungry && !isSick && <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 border border-black shadow-lg animate-bounce"><Droplets size={14} className="text-blue-500" /></div>}{!isAdult && (<div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/20"><div className="h-full bg-green-500" style={{ width: `${Math.min((chicken.age_days / (chicken.adult_threshold || 30)) * 100, 100)}%` }}></div></div>)}</div>
      <div className="grid grid-cols-2 gap-2 mt-1">
        <button onClick={(e) => { onCollect(chicken, e); playSound('pop'); }} disabled={isHungry || !isAdult || isSick || hasLaidToday} className="bg-green-500 hover:bg-green-600 disabled:bg-slate-300 disabled:border-slate-400 disabled:text-slate-500 text-white border-b-4 border-green-700 active:border-b-0 active:translate-y-1 rounded-xl py-2 font-black text-xs flex items-center justify-center gap-1 transition-all">
          {isSick ? <span className="flex items-center gap-1"><AlertTriangle size={12}/> PARADA</span> : hasLaidToday ? <span className="flex items-center gap-1"><CheckSquare size={12}/> JÁ COLETADO</span> : <><Egg size={14}/> COLETAR</>}
        </button>
        {isSick ? (<button onClick={(e) => { onHeal(chicken); playSound('pop'); }} disabled={!hasVaccine} className={`text-white border-b-4 active:border-b-0 active:translate-y-1 rounded-xl py-2 font-black text-xs flex items-center justify-center gap-1 transition-all ${hasVaccine ? 'bg-red-500 hover:bg-red-600 border-red-700 animate-pulse' : 'bg-slate-300 border-slate-400'}`}><Syringe size={14}/> {hasVaccine ? 'USAR (1)' : 'SEM ITEM'}</button>) : (<button onClick={(e) => { onFeed(chicken); playSound('pop'); }} disabled={!hasFeed && !isHungry} className={`text-white border-b-4 active:border-b-0 active:translate-y-1 rounded-xl py-2 font-black text-xs flex items-center justify-center gap-1 transition-all ${!isHungry ? 'bg-slate-300 border-slate-400 cursor-default opacity-50' : hasFeed ? 'bg-blue-400 hover:bg-blue-500 border-blue-700' : 'bg-red-400 border-red-700'}`}><Droplets size={14}/> {hasFeed ? `-${config.feedConsumption} RAÇÃO` : 'COMPRAR'}</button>)}
      </div>
    </div>
  );
};

export default ChickenCard;
