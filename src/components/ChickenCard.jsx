import React, { useState } from 'react';
import { TYPE_CONFIG } from '../data/gameConfig';
import { ADDONS_CONFIG } from '../data/mutationConfig';
import { playSound } from '../utils/audioSystem';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Heart, Droplets, Egg, AlertTriangle, Clock, Glasses, 
  CheckSquare, Syringe, Thermometer, Settings2
} from 'lucide-react';
import ChickenVisual from './game/ChickenVisual';

const ChickenCard = ({ chicken, onFeed, onCollect, onHeal, onClean, onCustomize, inventory, dayCount, addFloatingText }) => {
  const { t } = useLanguage();
  // Fallback to GRANJA if type is invalid (e.g. old save data with MUTANTE/CYBER)
  const config = TYPE_CONFIG[chicken.type] || TYPE_CONFIG.GRANJA;
  
  // ESTADO: Humor Transiente (Expressões Dinâmicas)
  const [tempMood, setTempMood] = React.useState(null);

  const isHungry = chicken.last_fed_day < dayCount;
  const isSick = chicken.is_sick; 
  const isAdult = chicken.age_days >= (chicken.adult_threshold || 30);
  const hasFeed = inventory.feed >= config.feedConsumption;
  const hasVaccine = inventory.vaccine >= 1;
  const hasPoop = chicken.has_poop; 
  const hasLaidToday = chicken.last_collected_day === dayCount;
  
  const canCustomize = ADDONS_CONFIG[chicken.type] && onCustomize;

  // Lógica "Angry": Se com fome, ocasionalmente faz expressão de raiva
  React.useEffect(() => {
    if (isHungry && !isSick && !chicken.is_sleeping) {
      const interval = setInterval(() => {
        // A cada 8s, tenta ficar irritada (40% de chance)
        if (Math.random() < 0.4) {
          setTempMood('angry');
          playSound('angry'); // Efeito sonoro de cacarejo ríspido
          // Fica irritada por 3 a 5 segundos
          setTimeout(() => setTempMood(null), 3000 + Math.random() * 2000);
        }
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isHungry, isSick, chicken.is_sleeping]);

  // Handler para Coleta com expressão "Greedy"
  const handleCollectWithMood = (e) => {
    onCollect(chicken, e);
    playSound('pop');
    setTempMood('greedy');
    setTimeout(() => setTempMood(null), 4000); // 4s de felicidade gananciosa
  };

  // Handler para "Acordar" a galinha
  const handleWakeUp = (e) => {
    if (chicken.is_sleeping) {
      e.stopPropagation();
      // Sistema Noturno: Ao acordar, seleciona expressão aleatória
      // Se estiver com fome, grande chance de ser "angry"
      let wakeMood = 'happy';
      if (isHungry && Math.random() < 0.7) {
        wakeMood = 'angry';
      } else {
        wakeMood = Math.random() > 0.5 ? 'greedy' : 'happy';
      }
      setTempMood(wakeMood);
      setTimeout(() => setTempMood(null), 3000);
    }
  };
  
  // ENGENHARIA: Suporte a Variantes Customizadas (Ícones e Cores Únicas)
  const variant = chicken.variant || null;
  const activeColor = variant ? variant.color : config.color;
  const activeBorder = variant ? variant.border : config.border;
  const activeTextColor = variant ? variant.textColor : (config.textColor || 'text-slate-800');
  const activeIcon = variant ? variant.icon : config.icon;
  
  const renderAvatar = () => {
    // if (isSick) return <div className="text-6xl animate-pulse grayscale brightness-50 contrast-125">🤢</div>; // REMOVIDO: Usar Sprite Layered
    if (chicken.type === 'GRANJA' && !isAdult) return <div className="text-6xl animate-bounce">🐣</div>;
    
    // Visuais especiais para Mutantes/Cyber/Variantes
    if (variant) {
      return (
        <div className="text-6xl drop-shadow-lg hover:scale-125 transition-transform duration-500 flex flex-col items-center">
          {activeIcon}
          {chicken.type === 'robot' && <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-ping opacity-20"></div>}
        </div>
      );
    }
    
    if (chicken.age_days >= 90 && chicken.type === 'GRANJA') return <div className="relative text-6xl grayscale-[0.3]">🐔<div className="absolute top-2 left-1 bg-white/80 rounded-full p-1 border border-black rotate-12"><Glasses size={16}/></div><div className="absolute bottom-0 right-0 text-xl">🦯</div></div>;
    
    // Novo Sistema de Sprites em Camadas (Layered Sprites)
    return <ChickenVisual chicken={chicken} dayCount={dayCount} overrideStatus={tempMood} className="hover:scale-110 transition-transform duration-300" />;
  };

  return (
    <div className={`relative w-full p-3 rounded-3xl border-[4px] ${activeBorder} ${activeColor} shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] flex flex-col gap-2 bg-white/90 backdrop-blur-sm transition-all duration-300 ${isHungry && !isSick ? 'scale-[0.98] opacity-90' : 'hover:-translate-y-1'} ${isSick ? 'border-red-500 bg-red-50' : ''}`}>
      <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm border border-white whitespace-nowrap ${chicken.type === 'GIGANTE' ? 'bg-purple-600' : chicken.type === 'CAIPIRA' ? 'bg-orange-600' : chicken.type === 'griffin' ? 'bg-pink-500' : chicken.type === 'alien' ? 'bg-green-700' : chicken.type === 'robot' ? 'bg-cyan-700' : 'bg-yellow-500'}`}>{t(config.labelKey)}</div>
      {(chicken.is_starter || chicken.immune) && <div className="absolute top-2 right-2 text-[10px] bg-blue-100 text-blue-600 px-1 rounded-md font-bold border border-blue-200">{t('chicken_status_immune')}</div>}
      {chicken.is_lab_created && !isAdult && <div className="absolute top-6 right-2 text-[9px] bg-pink-100 text-pink-600 px-1 rounded-md font-bold border border-pink-200 animate-pulse">{t('chicken_status_fast_growth')}</div>}
      <div className="flex justify-between items-start mt-2"><div><h3 className={`font-black text-sm leading-none ${activeTextColor}`}>{chicken.nameKey ? t(chicken.nameKey, chicken.nameParams) : chicken.name}</h3><p className="text-[10px] font-bold text-slate-500 mt-1">{isAdult ? t('chicken_age_adult') : t('chicken_age_baby')} • {chicken.age_days} {t('chicken_age_days')}</p></div><div className="flex flex-col items-end">{isSick ? (<span className="text-red-600 font-black flex items-center gap-1 text-[10px] animate-pulse"><Thermometer size={12}/> {t('chicken_state_sick')}</span>) : isHungry ? (<span className="text-orange-500 font-bold flex items-center gap-1 text-[10px]"><Clock size={12}/> {t('chicken_state_hungry')}</span>) : (<span className="text-green-600 font-bold flex items-center gap-1 text-[10px]"><Heart size={12} fill="currentColor"/> {t('chicken_state_happy')}</span>)}</div></div>
      <div onClick={handleWakeUp} className={`bg-gradient-to-b from-sky-200 to-green-200 rounded-xl h-24 flex items-center justify-center border border-white/50 relative overflow-hidden shadow-inner ${isHungry || isSick ? 'grayscale-[0.5]' : ''} ${chicken.is_sleeping ? 'cursor-pointer hover:brightness-110' : ''}`}>
        {renderAvatar()}
        
        {/* Botão de Customização */}
        {canCustomize && (
          <button 
            onClick={(e) => { e.stopPropagation(); onCustomize(chicken); playSound('pop'); }} 
            className="absolute top-2 left-2 bg-white/80 p-1.5 rounded-full border border-black/10 shadow-lg hover:scale-110 transition-transform hover:bg-white z-20"
            title={t('action_customize')}
          >
            <Settings2 size={14} className="text-slate-700" />
          </button>
        )}

        {hasPoop && !isSick && (<button onClick={(e) => { e.stopPropagation(); onClean(chicken, e); playSound('squish'); }} className="absolute bottom-2 right-2 text-2xl hover:scale-125 transition-transform cursor-pointer animate-bounce z-10" title={t('chicken_action_clean')}>💩</button>)}{isHungry && !isSick && <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 border border-black shadow-lg animate-bounce"><Droplets size={14} className="text-blue-500" /></div>}{!isAdult && (<div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/20"><div className="h-full bg-green-500" style={{ width: `${Math.min((chicken.age_days / (chicken.adult_threshold || 30)) * 100, 100)}%` }}></div></div>)}</div>
      <div className="grid grid-cols-2 gap-2 mt-1">
        <button onClick={handleCollectWithMood} disabled={isHungry || !isAdult || isSick || hasLaidToday} className="bg-green-500 hover:bg-green-600 disabled:bg-slate-300 disabled:border-slate-400 disabled:text-slate-500 text-white border-b-4 border-green-700 active:border-b-0 active:translate-y-1 rounded-xl py-2 font-black text-xs flex items-center justify-center gap-1 transition-all">
          {isSick ? <span className="flex items-center gap-1"><AlertTriangle size={12}/> {t('chicken_action_stopped')}</span> : hasLaidToday ? <span className="flex items-center gap-1"><CheckSquare size={12}/> {t('chicken_action_already_collected')}</span> : <><Egg size={14}/> {t('chicken_action_collect')}</>}
        </button>
        {isSick ? (<button onClick={(e) => { onHeal(chicken); playSound('pop'); }} disabled={!hasVaccine} className={`text-white border-b-4 active:border-b-0 active:translate-y-1 rounded-xl py-2 font-black text-xs flex items-center justify-center gap-1 transition-all ${hasVaccine ? 'bg-red-500 hover:bg-red-600 border-red-700 animate-pulse' : 'bg-slate-300 border-slate-400'}`}><Syringe size={14}/> {hasVaccine ? t('chicken_action_use', [1]) : t('chicken_action_no_item')}</button>) : (<button onClick={(e) => { onFeed(chicken); playSound('pop'); }} disabled={!hasFeed && !isHungry} className={`text-white border-b-4 active:border-b-0 active:translate-y-1 rounded-xl py-2 font-black text-xs flex items-center justify-center gap-1 transition-all ${!isHungry ? 'bg-slate-300 border-slate-400 cursor-default opacity-50' : hasFeed ? 'bg-blue-400 hover:bg-blue-500 border-blue-700' : 'bg-red-400 border-red-700'}`}><Droplets size={14}/> {hasFeed ? t('chicken_action_feed_cost', [config.feedConsumption]) : t('chicken_action_buy')}</button>)}
      </div>
    </div>
  );
};

export default ChickenCard;
