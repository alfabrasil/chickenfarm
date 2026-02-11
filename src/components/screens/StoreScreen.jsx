import React, { useState, useEffect } from 'react';
import { X, Lock, BatteryCharging, ShieldCheck, PaintBucket } from 'lucide-react';
import { STORE_ANIMALS, TYPE_CONFIG, ITEMS_CONFIG, TECH_CONFIG, UPGRADE_CONFIG, SKINS_CONFIG } from '../../data/gameConfig';
import { playSound } from '../../utils/audioSystem';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTutorial, TUTORIAL_STEPS } from '../../contexts/TutorialContext';
import ChickenVisual from '../game/ChickenVisual';

const StoreScreen = ({ onBack, onBuyAnimal, onBuyItem, balance, level, addFloatingText, automations, upgrades, currentSkin, onBuySkin }) => {
  const { t } = useLanguage();
  const { currentStep, advanceStep } = useTutorial();
  const [tab, setTab] = useState('ANIMALS'); 

  // Tutorial Logic: If user enters Store to buy vaccine, switch to ITEMS tab
  useEffect(() => {
    if (currentStep === TUTORIAL_STEPS.GO_TO_SHOP_VACCINE) {
      setTab('ITEMS');
      advanceStep(TUTORIAL_STEPS.BUY_VACCINE);
    }
  }, [currentStep]);

  return (
    <div className="animate-in slide-in-from-bottom-10 fade-in pb-24 md:pb-0">
      <div className="flex items-center gap-2 mb-4"><button onClick={onBack} className="bg-white p-2 rounded-full shadow-md"><X size={24}/></button><h1 className="text-2xl font-black text-slate-800 bg-white/50 px-3 py-1 rounded-xl">{t('store_title')}</h1></div>
      <div className="flex gap-2 mb-4 bg-white/80 p-1 rounded-2xl overflow-x-auto no-scrollbar">
        <button onClick={()=>setTab('ANIMALS')} className={`flex-1 py-2 px-3 rounded-xl font-black text-sm transition-all whitespace-nowrap ${tab==='ANIMALS'?'bg-yellow-400 text-yellow-900 shadow-sm':'text-slate-400'}`}>{t('store_tab_animals')}</button>
        <button onClick={()=>setTab('ITEMS')} className={`flex-1 py-2 px-3 rounded-xl font-black text-sm transition-all whitespace-nowrap ${tab==='ITEMS'?'bg-blue-400 text-white shadow-sm':'text-slate-400'}`}>{t('store_tab_items')}</button>
        <button onClick={()=>setTab('TECH')} className={`flex-1 py-2 px-3 rounded-xl font-black text-sm transition-all whitespace-nowrap ${tab==='TECH'?'bg-purple-500 text-white shadow-sm':'text-slate-400'}`}>{t('store_tab_tech')}</button>
        <button onClick={()=>setTab('STRUCTURE')} className={`flex-1 py-2 px-3 rounded-xl font-black text-sm transition-all whitespace-nowrap ${tab==='STRUCTURE'?'bg-slate-700 text-white shadow-sm':'text-slate-400'}`}>{t('store_tab_structures')}</button>
        <button onClick={()=>setTab('DECOR')} className={`flex-1 py-2 px-3 rounded-xl font-black text-sm transition-all whitespace-nowrap ${tab==='DECOR'?'bg-pink-500 text-white shadow-sm':'text-slate-400'}`}>{t('store_tab_skins')}</button>
      </div>
      
      <div className="space-y-4">
        {tab === 'ANIMALS' ? STORE_ANIMALS.map(p => { 
          const isLocked = level < p.minLevel; 
          const canAfford = balance >= p.priceCoins; 
          // Mock chicken for visual preview (Adult version)
          const previewChicken = { type: p.type, age_days: 30 };
          
          return (
            <div key={p.type} className={`bg-white/90 p-4 rounded-3xl border-b-4 border-slate-200 flex items-center gap-4 relative overflow-hidden ${isLocked ? 'grayscale opacity-80' : ''}`}>
              {isLocked && <div className="absolute inset-0 bg-slate-200/50 backdrop-blur-[1px] z-10 flex items-center justify-center"><div className="bg-slate-800 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg"><Lock size={16} /> {t('store_level_req', [p.minLevel])}</div></div>}
              
              <div className={`w-16 h-16 flex items-center justify-center rounded-2xl ${TYPE_CONFIG[p.type].color} border-2 ${TYPE_CONFIG[p.type].border} overflow-hidden`}>
                <ChickenVisual chicken={previewChicken} className="w-full h-full scale-125 translate-y-2" />
              </div>
              
              <div className="flex-1"><h3 className="font-black text-slate-800">{t(`animal_${p.type}_name`)}</h3><p className="text-xs text-slate-500">{t(`animal_${p.type}_desc`)}</p></div><button disabled={isLocked || !canAfford} onClick={(e)=>{onBuyAnimal(p, e); playSound('coin');}} className="bg-green-500 disabled:bg-slate-300 text-white px-4 py-2 rounded-xl font-black border-b-4 border-green-700 disabled:border-slate-400 whitespace-nowrap">{p.priceCoins} 💰</button></div>); }) 
        : tab === 'ITEMS' ? (<><div className="bg-white/90 p-4 rounded-3xl border-b-4 border-slate-200 flex items-center gap-4"><div className="text-4xl w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-100 border-2 border-blue-400">{ITEMS_CONFIG.FEED.icon}</div><div className="flex-1"><h3 className="font-black text-slate-800">{t('item_FEED_name')}</h3><p className="text-xs text-slate-500 font-bold text-blue-600">x{ITEMS_CONFIG.FEED.quantity}</p></div><button disabled={balance < ITEMS_CONFIG.FEED.price} onClick={(e)=>{onBuyItem('FEED', e); playSound('coin');}} className="bg-green-500 disabled:bg-slate-300 text-white px-4 py-2 rounded-xl font-black border-b-4 border-green-700 disabled:border-slate-400 whitespace-nowrap">{ITEMS_CONFIG.FEED.price} 💰</button></div><div className="bg-white/90 p-4 rounded-3xl border-b-4 border-slate-200 flex items-center gap-4"><div className="text-4xl w-16 h-16 flex items-center justify-center rounded-2xl bg-red-100 border-2 border-red-400">{ITEMS_CONFIG.VACCINE.icon}</div><div className="flex-1"><h3 className="font-black text-slate-800">{t('item_VACCINE_name')}</h3><p className="text-xs text-slate-500 font-bold text-red-600">{t('store_cure')}</p></div><button id="tut-buy-vaccine" disabled={balance < ITEMS_CONFIG.VACCINE.price} onClick={(e)=>{onBuyItem('VACCINE', e); playSound('coin');}} className="bg-green-500 disabled:bg-slate-300 text-white px-4 py-2 rounded-xl font-black border-b-4 border-green-700 disabled:border-slate-400 whitespace-nowrap">{ITEMS_CONFIG.VACCINE.price} 💰</button></div><div className="bg-white/90 p-4 rounded-3xl border-b-4 border-slate-200 flex items-center gap-4"><div className="text-4xl w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-200 border-2 border-slate-400">{ITEMS_CONFIG.EXPANSION.icon}</div><div className="flex-1"><h3 className="font-black text-slate-800">{t('item_EXPANSION_name')}</h3><p className="text-xs text-slate-500 font-bold text-slate-600">{t('item_EXPANSION_desc', [ITEMS_CONFIG.EXPANSION.quantity])}</p></div><button disabled={balance < ITEMS_CONFIG.EXPANSION.price} onClick={(e)=>{onBuyItem('EXPANSION', e); playSound('coin');}} className="bg-green-500 disabled:bg-slate-300 text-white px-4 py-2 rounded-xl font-black border-b-4 border-green-700 disabled:border-slate-400 whitespace-nowrap">{ITEMS_CONFIG.EXPANSION.price} 💰</button></div></>)
        : tab === 'TECH' ? (
          <>
            {Object.values(TECH_CONFIG).map(tech => {
              const isActive = automations[tech.id]?.active;
              const daysLeft = automations[tech.id]?.daysLeft || 0;
              return (
                <div key={tech.id} className={`bg-white/90 p-4 rounded-3xl border-b-4 flex items-center gap-4 ${isActive ? 'border-green-300 bg-green-50' : 'border-purple-200'}`}>
                  <div className={`text-4xl w-16 h-16 flex items-center justify-center rounded-2xl border-2 ${tech.color} bg-white`}>{tech.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-black text-slate-800">{t(`tech_${tech.id}_name`)}</h3>
                    <p className="text-xs text-slate-500">{t(`tech_${tech.id}_desc`, [tech.duration])}</p>
                    {isActive && <span className="text-[10px] font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit mt-1"><BatteryCharging size={10}/> {t('store_active_days', [daysLeft])}</span>}
                  </div>
                  <button 
                    disabled={isActive || balance < tech.price} 
                    onClick={(e)=>{onBuyItem(tech.id, e); playSound('drone');}} 
                    className={`px-4 py-2 rounded-xl font-black border-b-4 whitespace-nowrap text-white ${isActive ? 'bg-slate-300 border-slate-400 cursor-default' : 'bg-purple-500 border-purple-700 hover:bg-purple-600'}`}
                  >
                    {isActive ? t('store_active') : `${tech.price} 💰`}
                  </button>
                </div>
              );
            })}
          </>
        ) : tab === 'STRUCTURE' ? (
          <>
            {Object.values(UPGRADE_CONFIG).map(upg => {
              const isOwned = upgrades[upg.id];
              return (
                <div key={upg.id} className={`bg-white/90 p-4 rounded-3xl border-b-4 flex items-center gap-4 ${isOwned ? 'border-yellow-300 bg-yellow-50' : 'border-slate-200'}`}>
                  <div className={`text-4xl w-16 h-16 flex items-center justify-center rounded-2xl border-2 ${upg.color} bg-white`}>{upg.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-black text-slate-800">{t(`upg_${upg.id}_name`)}</h3>
                    <p className="text-xs text-slate-500">{t(`upg_${upg.id}_desc`)}</p>
                    {isOwned && <span className="text-[10px] font-bold bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit mt-1"><ShieldCheck size={10}/> {t('store_acquired')}</span>}
                  </div>
                  <button 
                    disabled={isOwned || balance < upg.price} 
                    onClick={(e)=>{onBuyItem(upg.id, e); playSound('upgrade');}} 
                    className={`px-4 py-2 rounded-xl font-black border-b-4 whitespace-nowrap text-white ${isOwned ? 'bg-slate-300 border-slate-400 cursor-default' : 'bg-slate-700 border-slate-900 hover:bg-slate-800'}`}
                  >
                    {isOwned ? t('store_owned') : `${upg.price} 💰`}
                  </button>
                </div>
              );
            })}
          </>
        ) : (
          // ABA DECOR (SKINS)
          <>
             <div className="bg-pink-100 p-4 rounded-3xl mb-4 text-center border-2 border-pink-200">
               <h3 className="font-black text-pink-700 flex items-center justify-center gap-2"><PaintBucket size={18}/> {t('store_skin_title')}</h3>
               <p className="text-xs text-pink-600">{t('store_skin_desc')}</p>
             </div>
             {Object.values(SKINS_CONFIG).map(skin => {
               const isActive = currentSkin === skin.id;
               
               return (
                 <div key={skin.id} className={`bg-white/90 p-4 rounded-3xl border-b-4 flex items-center gap-4 ${isActive ? 'border-green-500 bg-green-50' : 'border-slate-200'}`}>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${skin.groundFrom} ${skin.groundTo} border-2 border-white shadow-sm`}></div>
                    <div className="flex-1">
                      <h3 className="font-black text-slate-800">{t(`skin_${skin.id}_name`)}</h3>
                      <p className="text-xs text-slate-500">{t('store_skin_theme')}</p>
                    </div>
                    <button 
                      onClick={(e) => onBuySkin(skin, e)}
                      className={`px-4 py-2 rounded-xl font-black border-b-4 whitespace-nowrap text-white ${isActive ? 'bg-slate-400 border-slate-500 cursor-default' : 'bg-pink-500 border-pink-700 hover:bg-pink-600'}`}
                    >
                      {isActive ? t('store_in_use') : skin.price === 0 ? t('store_use') : `${skin.price} 💰`}
                    </button>
                 </div>
               )
             })}
          </>
        )
        }
      </div>
    </div>
  );
};

export default StoreScreen;
