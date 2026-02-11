import React, { useState } from 'react';
import { X, Wrench, CircleDashed, CheckCircle2 } from 'lucide-react';
import { ADDONS_CONFIG } from '../../data/mutationConfig';
import { playSound } from '../../utils/audioSystem';
import { useLanguage } from '../../contexts/LanguageContext';

const ChickenCustomizer = ({ chicken, onClose, onUpdateChicken }) => {
  const { t } = useLanguage();
  const [selectedSlot, setSelectedSlot] = useState('HEAD');
  
  if (!chicken || !ADDONS_CONFIG[chicken.type]) return null;

  const config = ADDONS_CONFIG[chicken.type];
  const equipped = chicken.equippedAddons || [];

  const handleToggleAddon = (addonId) => {
    playSound('click');
    let newEquipped = [...equipped];
    
    // Verifica se já está equipado
    if (newEquipped.includes(addonId)) {
      newEquipped = newEquipped.filter(id => id !== addonId);
    } else {
      // Remove outros addons do mesmo slot (só pode 1 por slot)
      const slotItems = config[selectedSlot].map(i => i.id);
      newEquipped = newEquipped.filter(id => !slotItems.includes(id));
      // Adiciona o novo
      newEquipped.push(addonId);
    }

    onUpdateChicken(chicken.id, { equippedAddons: newEquipped });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-slate-900 w-full max-w-md rounded-3xl border-2 border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 p-2 rounded-xl">
              <Wrench className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-white font-black text-lg">{t('customizer_title', 'Bio-Lab Mods')}</h2>
              <p className="text-slate-400 text-xs font-bold uppercase">{chicken.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="bg-slate-700 p-2 rounded-full hover:bg-slate-600 text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Visual Preview (Simplificado - Apenas Ícone/Texto por enquanto) */}
        <div className="p-6 bg-slate-950 flex justify-center items-center border-b border-slate-800">
          <div className="text-center">
            <div className="text-6xl mb-2 animate-bounce">🧬</div>
            <p className="text-slate-500 text-xs">{t('customizer_preview_note', 'Changes apply immediately')}</p>
          </div>
        </div>

        {/* Slots Selector */}
        <div className="flex p-2 gap-2 bg-slate-900 border-b border-slate-800">
          {Object.keys(config).map(slot => (
            <button
              key={slot}
              onClick={() => { setSelectedSlot(slot); playSound('pop'); }}
              className={`flex-1 py-2 px-4 rounded-xl font-bold text-sm transition-all ${
                selectedSlot === slot 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="p-4 overflow-y-auto flex-1 bg-slate-900">
          <div className="grid grid-cols-2 gap-3">
            {config[selectedSlot].map(item => {
              const isEquipped = equipped.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleToggleAddon(item.id)}
                  className={`relative group p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    isEquipped 
                      ? 'bg-blue-500/10 border-blue-500' 
                      : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800">
                    {/* Aqui idealmente renderizaria o SVG do addon, mas usaremos um placeholder genérico */}
                    <div className="w-8 h-8 bg-current opacity-50 rounded-full" />
                  </div>
                  
                  <span className={`text-xs font-bold text-center ${isEquipped ? 'text-blue-400' : 'text-slate-400'}`}>
                    {item.name}
                  </span>

                  <div className="absolute top-2 right-2">
                    {isEquipped ? (
                      <CheckCircle2 size={16} className="text-blue-500 fill-blue-500/20" />
                    ) : (
                      <CircleDashed size={16} className="text-slate-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChickenCustomizer;