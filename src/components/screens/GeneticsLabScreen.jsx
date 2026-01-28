import React, { useState } from 'react';
import { X, Dna } from 'lucide-react';
import { TYPE_CONFIG, BREEDING_COST } from '../../data/gameConfig';
import { playSound } from '../../utils/audioSystem';
import { calculateBreedingResult } from '../../utils/genetics';

const GeneticsLabScreen = ({ onBack, chickens, balance, setBalance, setChickens, maxCapacity, showToast, dayCount }) => {
  const [parent1, setParent1] = useState(null);
  const [parent2, setParent2] = useState(null);
  const [breeding, setBreeding] = useState(false);
  const cost = BREEDING_COST;

  const handleBreed = () => {
    if (!parent1 || !parent2) return;
    if (balance < cost) {
      showToast("Saldo insuficiente para o cruzamento!", 'error');
      return;
    }
    if (chickens.length >= maxCapacity) { 
      showToast("Expandir Celeiro", 'error');
      return; 
    }

    setBreeding(true);
    setBalance(prev => prev - cost);
    playSound('dna');

    setTimeout(() => {
      // Algoritmo de Cruzamento (via utility)
      const { newType } = calculateBreedingResult(parent1.type, parent2.type);

      // Nomes Especiais e Divertidos (Engenharia de Humor)
      const HYBRID_NAMES = ['Unicórnio', 'Grifo', 'Quimera', 'Pegasus', 'Basilisco', 'Fênix', 'Hidra', 'Manticora'];
      const MUTANT_NAMES = ['ET', 'Alien', 'Predador', 'Xenomorfo', 'Cthulhu', 'Goo', 'Marciano', 'Varginha'];
      const CYBER_NAMES = ['Robocop', 'T-800', 'Matrix', 'Cyberpunk', 'Android 18', 'Mecha', 'Bot', 'Terminator'];
      
      let specialName = `Exp. #${Math.floor(Math.random()*999)}`;
      let isSpecial = false;

      if (newType === 'HIBRIDA') {
        specialName = `HÍBRIDO ÁGIL: ${HYBRID_NAMES[Math.floor(Math.random() * HYBRID_NAMES.length)]}`;
        isSpecial = true;
      } else if (newType === 'MUTANTE') {
        specialName = `MUTANTE: ${MUTANT_NAMES[Math.floor(Math.random() * MUTANT_NAMES.length)]}`;
        isSpecial = true;
      } else if (newType === 'CYBER') {
        specialName = `CYBER: ${CYBER_NAMES[Math.floor(Math.random() * CYBER_NAMES.length)]}`;
        isSpecial = true;
      } else if (parent1.type !== parent2.type && Math.random() < 0.5) {
         // Mesmo se não for Híbrida (falha genética), pode ter nome engraçado se pais forem diferentes
         specialName = `Mestiça: ${parent1.type.substring(0,3)}${parent2.type.substring(0,3)}`;
      }

      const baby = { 
        id: Date.now(), 
        type: newType, 
        name: specialName, 
        age_days: 0, 
        last_fed_day: dayCount, // Nasce alimentada no dia atual
        is_sick: false, 
        has_poop: false, 
        last_collected_day: 0,
        is_lab_created: true,
        immune: true, // Garante imunidade genética
        adult_threshold: 15 // Crescimento Acelerado (15 dias)
      };

      setChickens(prev => [...prev, baby]);
      setBreeding(false);
      setParent1(null);
      setParent2(null);
      playSound(isSpecial ? 'achievement' : 'success');
      showToast(`Cruzamento Sucesso! Nasceu: ${specialName}`, 'success');
    }, 2000);
  };

  return (
    <div className="animate-in slide-in-from-bottom-10 fade-in pb-24 md:pb-0">
      <div className="flex items-center gap-2 mb-4"><button onClick={onBack} className="bg-white p-2 rounded-full shadow-md"><X size={24}/></button><h1 className="text-2xl font-black text-slate-800 bg-white/50 px-3 py-1 rounded-xl">BioLab Genético</h1></div>
      
      <div className="bg-slate-800 text-white p-6 rounded-3xl shadow-xl mb-6 relative overflow-hidden border-b-8 border-slate-950">
        <div className="relative z-10 flex justify-between items-center">
          <div className={`w-24 h-24 rounded-2xl border-4 border-dashed flex items-center justify-center cursor-pointer transition-all ${parent1 ? 'bg-white border-white' : 'bg-white/10 border-white/30 hover:bg-white/20'}`} onClick={() => setParent1(null)}>
            {parent1 ? <div className="text-4xl">{TYPE_CONFIG[parent1.type].icon}</div> : <span className="text-xs font-bold text-white/50">PAI A</span>}
          </div>
          <div className="text-2xl font-black text-pink-500 animate-pulse">+</div>
          <div className={`w-24 h-24 rounded-2xl border-4 border-dashed flex items-center justify-center cursor-pointer transition-all ${parent2 ? 'bg-white border-white' : 'bg-white/10 border-white/30 hover:bg-white/20'}`} onClick={() => setParent2(null)}>
             {parent2 ? <div className="text-4xl">{TYPE_CONFIG[parent2.type].icon}</div> : <span className="text-xs font-bold text-white/50">PAI B</span>}
          </div>
        </div>
        <div className="mt-6">
          <button 
            disabled={!parent1 || !parent2 || balance < cost || breeding} 
            onClick={handleBreed}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-slate-600 text-white py-3 rounded-xl font-black shadow-lg border-b-4 border-pink-700 disabled:border-slate-800 transition-all flex items-center justify-center gap-2"
          >
             {breeding ? 'PROCESSANDO DNA...' : <><Dna size={20}/> CRUZAR GENÉTICA ({cost} 💰)</>}
          </button>
        </div>
      </div>

      <div className="bg-white/90 p-4 rounded-3xl border-b-4 border-slate-200">
        <h3 className="font-black text-slate-800 mb-3">Selecione os Pais (Adultos)</h3>
        <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
          {chickens.filter(c => c.age_days >= (c.adult_threshold || 30)).map(c => (
            <button 
              key={c.id} 
              disabled={parent1?.id === c.id || parent2?.id === c.id}
              onClick={() => !parent1 ? setParent1(c) : setParent2(c)}
              className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center bg-slate-50 hover:bg-green-50 disabled:opacity-50 disabled:grayscale ${parent1?.id === c.id || parent2?.id === c.id ? 'border-green-500 bg-green-100' : 'border-slate-200'}`}
            >
              <span className="text-2xl">{TYPE_CONFIG[c.type].icon}</span>
              <span className="text-[8px] font-bold text-slate-500 truncate w-full text-center px-1">{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneticsLabScreen;
