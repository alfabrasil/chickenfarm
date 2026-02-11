import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { X, Dna } from 'lucide-react';
import { TYPE_CONFIG, BREEDING_COST } from '../../data/gameConfig';
import { playSound } from '../../utils/audioSystem';
import { calculateBreedingResult } from '../../utils/genetics';
import { useLanguage } from '../../contexts/LanguageContext';
import ChickenVisual from '../game/ChickenVisual';

const GeneticsLabScreen = ({ onBack, chickens, balance, setBalance, setChickens, maxCapacity, showToast, dayCount }) => {
  const { t } = useLanguage();
  const [parent1, setParent1] = useState(null);
  const [parent2, setParent2] = useState(null);
  const [breeding, setBreeding] = useState(false);
  const [showDivineEffect, setShowDivineEffect] = useState(false);
  const cost = BREEDING_COST;

  const handleBreed = () => {
    if (!parent1 || !parent2) return;
    if (balance < cost) {
      showToast(t('genetics_insufficient_funds'), 'error');
      return;
    }
    if (chickens.length >= maxCapacity) { 
      showToast(t('genetics_barn_full'), 'error');
      return; 
    }

    setBreeding(true);
    setBalance(prev => prev - cost);
    playSound('dna');

    setTimeout(() => {
      // Algoritmo de Cruzamento (via utility)
      const { newType } = calculateBreedingResult(parent1.type, parent2.type);

      // --- ENGENHARIA DE VARIANTES AVANÇADA (Engenheiro de Software Sênior) ---
      const VARIANT_MAP = {
        HIBRIDA: [
          { nameKey: 'variant_UNICORNIO_name', icon: '🦄', color: 'bg-pink-100', border: 'border-pink-500', textColor: 'text-pink-700' },
          { nameKey: 'variant_GRIFO_name', icon: '🦅', color: 'bg-amber-100', border: 'border-amber-500', textColor: 'text-amber-700' },
          { nameKey: 'variant_QUIMERA_name', icon: '🐲', color: 'bg-indigo-100', border: 'border-indigo-500', textColor: 'text-indigo-700' },
          { nameKey: 'variant_FENIX_name', icon: '🔥', color: 'bg-red-100', border: 'border-red-500', textColor: 'text-red-700' },
          { nameKey: 'variant_PEGASUS_name', icon: '🐎', color: 'bg-sky-100', border: 'border-sky-500', textColor: 'text-sky-700' }
        ],
        MUTANTE: [
          { nameKey: 'variant_ET_BILU_name', icon: '👽', color: 'bg-green-900', border: 'border-green-400', textColor: 'text-green-400' },
          { nameKey: 'variant_ALIEN_name', icon: '👾', color: 'bg-purple-900', border: 'border-purple-400', textColor: 'text-purple-400' },
          { nameKey: 'variant_VARGINHA_name', icon: '🛸', color: 'bg-slate-900', border: 'border-slate-400', textColor: 'text-slate-400' },
          { nameKey: 'variant_PREDADOR_name', icon: '👹', color: 'bg-red-900', border: 'border-orange-500', textColor: 'text-orange-500' },
          { nameKey: 'variant_XENOMORFO_name', icon: '🦂', color: 'bg-black', border: 'border-green-600', textColor: 'text-green-500' }
        ],
        CYBER: [
          { nameKey: 'variant_ROBO_name', icon: '🤖', color: 'bg-slate-800', border: 'border-cyan-400', textColor: 'text-cyan-300' },
          { nameKey: 'variant_MECHA_name', icon: '🦾', color: 'bg-zinc-800', border: 'border-zinc-400', textColor: 'text-zinc-300' },
          { nameKey: 'variant_T1000_name', icon: '🧊', color: 'bg-blue-900', border: 'border-blue-300', textColor: 'text-blue-200' },
          { nameKey: 'variant_NEO_name', icon: '🕶️', color: 'bg-emerald-950', border: 'border-emerald-500', textColor: 'text-emerald-400' },
          { nameKey: 'variant_CYBERPUNK_name', icon: '🌆', color: 'bg-fuchsia-950', border: 'border-fuchsia-500', textColor: 'text-fuchsia-400' }
        ]
      };
      
      let variant = null;
      let specialName = `Exp. #${Math.floor(Math.random()*999)}`;
      let isSpecial = false;
      let nameKey = null;
      let nameParams = null;

      if (VARIANT_MAP[newType]) {
        const variants = VARIANT_MAP[newType];
        variant = variants[Math.floor(Math.random() * variants.length)];
        nameKey = variant.nameKey;
        specialName = t(nameKey);
        isSpecial = true;
      } else if (parent1.type !== parent2.type && Math.random() < 0.5) {
         nameKey = 'genetics_variant_mestic';
         nameParams = [`${parent1.type.substring(0,3)}${parent2.type.substring(0,3)}`];
         specialName = t(nameKey, nameParams);
      } else {
         nameKey = `chicken_name_${newType}`;
         specialName = t(nameKey);
      }

      const baby = { 
        id: uuidv4(), 
        type: newType, 
        nameKey,
        nameParams,
        name: specialName, 
        variant: variant, // Armazena o objeto completo da variante
        age_days: 0, 
        last_fed_day: dayCount, 
        is_sick: false, 
        has_poop: false, 
        last_collected_day: 0,
        is_lab_created: true,
        immune: true, 
        adult_threshold: 15 
      };

      setChickens(prev => [...prev, baby]);
      setBreeding(false);
      setParent1(null);
      setParent2(null);

      // EFEITO VISUAL DIVINO (Engenharia de Jogos)
      if (newType === 'DIVINA') {
        setShowDivineEffect(true);
        // Desliga o efeito após 4 segundos
        setTimeout(() => setShowDivineEffect(false), 4000);
        // Som extra celestial se possível (reusando 'prestige' que é longo e solene)
        playSound('prestige'); 
      } else {
        playSound(isSpecial ? 'achievement' : 'success');
      }

      showToast(t('genetics_success_msg', [specialName]), 'success');
    }, 2000);
  };

  return (
    <div className="animate-in slide-in-from-bottom-10 fade-in pb-24 md:pb-0 relative">
      {/* EFEITO DE PARTICULAS DIVINAS (Overlay) */}
      {showDivineEffect && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden rounded-3xl">
          {/* Fundo escuro dramático */}
          <div className="absolute inset-0 bg-black/60 animate-in fade-in duration-1000"></div>
          
          {/* Raios (Flash Global) */}
          <div className="absolute inset-0 bg-yellow-100/20 animate-pulse duration-75"></div>
          
          {/* Raios Específicos (Beams) */}
          <div className="absolute top-0 left-1/2 w-2 h-[150%] bg-yellow-400 blur-md -translate-x-1/2 rotate-12 animate-[spin_3s_linear_infinite] origin-bottom"></div>
          <div className="absolute top-0 left-1/2 w-4 h-[150%] bg-white blur-lg -translate-x-1/2 -rotate-12 animate-[spin_2s_linear_infinite_reverse] origin-bottom opacity-70"></div>
          
          {/* Fumaça (Smoke Clouds) */}
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-slate-300 rounded-full blur-3xl opacity-60 animate-bounce duration-[3000ms]"></div>
          <div className="absolute bottom-0 right-10 w-64 h-64 bg-slate-100 rounded-full blur-3xl opacity-50 animate-bounce duration-[2500ms] delay-100"></div>
          
          {/* Ícone Central subindo */}
          <div className="z-50 animate-in slide-in-from-bottom-20 fade-in duration-1000 scale-150 flex flex-col items-center">
             <div className="text-9xl drop-shadow-[0_0_50px_rgba(255,215,0,1)] animate-pulse">👑</div>
             <div className="text-white font-black text-2xl mt-4 drop-shadow-md tracking-widest uppercase">Divine Creation</div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4"><button onClick={onBack} className="bg-white p-2 rounded-full shadow-md"><X size={24}/></button><h1 className="text-2xl font-black text-slate-800 bg-white/50 px-3 py-1 rounded-xl">{t('genetics_title')}</h1></div>
      
      <div className="bg-slate-800 text-white p-6 rounded-3xl shadow-xl mb-6 relative overflow-hidden border-b-8 border-slate-950">
        <div className="relative z-10 flex justify-between items-center">
          <div className={`w-24 h-24 rounded-2xl border-4 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden ${parent1 ? 'bg-white border-white' : 'bg-white/10 border-white/30 hover:bg-white/20'}`} onClick={() => setParent1(null)}>
            {parent1 ? <div className="w-full h-full"><ChickenVisual chicken={parent1} className="w-full h-full scale-125 translate-y-4" /></div> : <span className="text-xs font-bold text-white/50">{t('genetics_parent_a')}</span>}
          </div>
          <div className="text-2xl font-black text-pink-500 animate-pulse">+</div>
          <div className={`w-24 h-24 rounded-2xl border-4 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden ${parent2 ? 'bg-white border-white' : 'bg-white/10 border-white/30 hover:bg-white/20'}`} onClick={() => setParent2(null)}>
             {parent2 ? <div className="w-full h-full"><ChickenVisual chicken={parent2} className="w-full h-full scale-125 translate-y-4" /></div> : <span className="text-xs font-bold text-white/50">{t('genetics_parent_b')}</span>}
          </div>
        </div>
        <div className="mt-6">
          <button 
            disabled={!parent1 || !parent2 || balance < cost || breeding} 
            onClick={handleBreed}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-slate-600 text-white py-3 rounded-xl font-black shadow-lg border-b-4 border-pink-700 disabled:border-slate-800 transition-all flex items-center justify-center gap-2"
          >
             {breeding ? t('genetics_processing') : <><Dna size={20}/> {t('genetics_btn_breed', [cost])}</>}
          </button>
        </div>
      </div>

      <div className="bg-white/90 p-4 rounded-3xl border-b-4 border-slate-200">
        <h3 className="font-black text-slate-800 mb-3">{t('genetics_select_parents')}</h3>
        <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
          {chickens.filter(c => c.age_days >= (c.adult_threshold || 30)).map(c => (
            <button 
              key={c.id} 
              disabled={parent1?.id === c.id || parent2?.id === c.id}
              onClick={() => !parent1 ? setParent1(c) : setParent2(c)}
              className={`aspect-square rounded-xl border-2 relative bg-slate-50 hover:bg-green-50 disabled:opacity-50 disabled:grayscale overflow-hidden ${parent1?.id === c.id || parent2?.id === c.id ? 'border-green-500 bg-green-100' : 'border-slate-200'}`}
            >
              <div className="absolute inset-0 flex items-center justify-center pb-5">
                 <ChickenVisual chicken={c} className="w-16 h-16 scale-125" />
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-white/95 border-t border-slate-200 py-1 px-0.5 z-10 flex items-center justify-center min-h-[24px]">
                  <p className="text-[9px] font-black text-slate-800 truncate w-full text-center uppercase tracking-tight leading-none">{c.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneticsLabScreen;
