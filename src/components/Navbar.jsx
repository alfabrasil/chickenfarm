import React from 'react';
import { 
  Sparkles, CloudRain, Sun, Bot, Trash2, Landmark, Dna, Settings as SettingsIcon, Dices, 
  Users2, ClipboardList, Warehouse, ShoppingBag, Gamepad2, AlertCircle, HelpCircle, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/audioSystem';
import { useLanguage } from '../contexts/LanguageContext';
import { useTutorial } from '../contexts/TutorialContext';

const Navbar = ({ balance, dayCount, onViewChange, currentView, level, xp, xpToNextLevel, weather, openQuests, goldenEggs, pendingRewards, automations, upgrades }) => {
  const { t } = useLanguage();
  const { crisisStep, setIsDismissed, restartTutorial } = useTutorial();

  const isStoreCrisis = crisisStep === 'CRISIS_VACCINE_STORE' || crisisStep === 'CRISIS_FEED_STORE';
  const isCoopCrisis = crisisStep === 'CRISIS_VACCINE_COOP' || crisisStep === 'CRISIS_FEED_COOP';
  const hasCrisis = !!crisisStep;

  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white/90 backdrop-blur-md p-3 rounded-2xl border-b-4 border-slate-200 shadow-xl z-50 relative transition-all gap-4 md:gap-0 sticky top-0 md:static">
      <div className="flex justify-between w-full md:w-auto items-center">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { playSound('pop'); onViewChange('PROFILE'); }}>
           <div id="tut-nav-profile" className="relative">
             <div className="w-10 h-10 bg-yellow-300 rounded-full border-2 border-orange-500 flex items-center justify-center text-xl shadow-sm">👨‍🌾</div>
             <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white">{level}</div>
             {goldenEggs > 0 && <div className="absolute -top-2 -right-2 text-yellow-500 animate-pulse drop-shadow-md"><Sparkles size={16} fill="currentColor"/></div>}
           </div>
           <div id="tut-nav-coop" className={`relative ${isCoopCrisis ? 'animate-pulse' : ''}`}>
           <h2 className="font-black text-slate-800 text-sm leading-tight flex items-center gap-1">
             {t('day')} {dayCount} 
             {weather === 'RAINY' ? <CloudRain size={14} className="text-blue-500"/> : <Sun size={14} className="text-orange-500"/>}
           </h2>
           <div className="w-16 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden border border-slate-300 relative">
             <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(xp / xpToNextLevel) * 100}%` }}></div>
           </div>
           {isCoopCrisis && <div className="absolute -top-1 -right-4 text-red-500"><AlertCircle size={14} fill="currentColor" className="text-white"/></div>}
        </div>
        </div>
        
        <div className="flex gap-1 ml-4 md:hidden">
          <AnimatePresence>
            {hasCrisis && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { playSound('pop'); setIsDismissed(false); }}
                className="bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50 relative overflow-hidden"
              >
                <motion.div
                   animate={{ opacity: [0.4, 1, 0.4] }}
                   transition={{ repeat: Infinity, duration: 1.5 }}
                   className="absolute inset-0 bg-white/20"
                 />
                  <AlertCircle size={14} className="relative z-10" />
                </motion.button>
             )}
           </AnimatePresence>

           <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { playSound('pop'); restartTutorial(); }}
            className="w-7 h-7 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 rounded-full flex items-center justify-center border border-blue-200 transition-colors"
            title={t('settings_tutorial_btn')}
           >
             <Info size={14} />
           </motion.button>

            {automations?.NUTRIBOT?.active && <div className="text-lg animate-bounce" title={t('tech_NUTRIBOT_name')}>🤖</div>}
          {automations?.CLEANSWEEP?.active && <div className="text-lg animate-bounce delay-100" title={t('tech_CLEANSWEEP_name')}>🧹</div>}
        </div>

        <div onClick={() => { playSound('pop'); onViewChange('WALLET'); }} className="md:hidden flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md border bg-white text-slate-700 border-slate-200 cursor-pointer hover:scale-105 transition-transform">
          <span className="text-yellow-500">💰</span> {balance}
        </div>
      </div>

      {/* Oculto no Mobile (md:flex), pois usaremos a BottomNav */}
      <div className="hidden md:flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide no-scrollbar">
        <div className="hidden md:flex gap-1 mr-2">
           {automations?.NUTRIBOT?.active && <div className="bg-blue-100 text-blue-600 p-1 rounded-lg text-xs font-bold border border-blue-200 flex items-center gap-1 animate-pulse"><Bot size={14}/> {t('store_active')}</div>}
           {automations?.CLEANSWEEP?.active && <div className="bg-green-100 text-green-600 p-1 rounded-lg text-xs font-bold border border-green-200 flex items-center gap-1 animate-pulse"><Trash2 size={14}/> {t('store_active')}</div>}
        </div>

        <div onClick={() => { playSound('pop'); onViewChange('BANK'); }} className={`p-2 rounded-full border-b-4 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-sm shrink-0 ${currentView === 'BANK' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-white text-slate-400 border-slate-200 hover:text-green-600'}`} title={t('view_bank')}><Landmark size={20} /></div>
        
        {/* GENETICA (LAB) - Visível apenas se comprado */}
        {upgrades?.LAB && (
          <div onClick={() => { playSound('pop'); onViewChange('LAB'); }} className={`p-2 rounded-full border-b-4 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-sm shrink-0 ${currentView === 'LAB' ? 'bg-pink-100 text-pink-600 border-pink-300' : 'bg-white text-slate-400 border-slate-200 hover:text-pink-500'}`} title={t('view_genetics')}><Dna size={20} /></div>
        )}

        <div onClick={() => { playSound('pop'); onViewChange('SETTINGS'); }} className={`p-2 rounded-full border-b-4 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-sm shrink-0 ${currentView === 'SETTINGS' ? 'bg-slate-200 text-slate-600 border-slate-400' : 'bg-white text-slate-400 border-slate-200 hover:text-slate-600'}`} title={t('settings')}><SettingsIcon size={20} /></div>
        <div onClick={() => { playSound('pop'); onViewChange('CHASE'); }} className={`p-2 rounded-full border-b-4 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-sm shrink-0 ${currentView === 'CHASE' ? 'bg-purple-100 text-purple-600 border-purple-300' : 'bg-white text-slate-400 border-slate-200 hover:text-purple-500'}`} title={t('view_chase')}><Gamepad2 size={20} /></div>
        <div id="tut-nav-wheel" onClick={() => { playSound('pop'); onViewChange('WHEEL'); }} className={`p-2 rounded-full border-b-4 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-sm shrink-0 ${currentView === 'WHEEL' ? 'bg-purple-50 text-purple-400 border-purple-200' : 'bg-white text-slate-400 border-slate-200 hover:text-purple-400'}`} title={t('wheel_title')}><Dices size={20} /></div>
        <div onClick={() => { playSound('pop'); onViewChange('COMMUNITY'); }} className={`p-2 rounded-full border-b-4 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-sm shrink-0 ${currentView === 'COMMUNITY' ? 'bg-blue-100 text-blue-600 border-blue-300' : 'bg-white text-slate-400 border-slate-200 hover:text-blue-500'}`} title={t('view_community')}><Users2 size={20} /></div>
        <div onClick={() => { playSound('pop'); openQuests(); }} className="relative p-2 rounded-full border-b-4 bg-white text-slate-400 border-slate-200 hover:text-blue-500 cursor-pointer shadow-sm active:border-b-0 active:translate-y-1 shrink-0" title={t('quests')}>
          <ClipboardList size={20} />
          {pendingRewards && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { playSound('pop'); restartTutorial(); }}
          className="hidden md:flex bg-blue-50 text-blue-600 p-2 rounded-full border-b-4 border-blue-200 hover:bg-blue-100 transition-all items-center justify-center shadow-sm active:border-b-0 active:translate-y-1 shrink-0"
          title={t('settings_tutorial_btn')}
        >
          <Info size={20} />
        </motion.button>

        <AnimatePresence>
          {hasCrisis && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="overflow-hidden flex items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { playSound('pop'); setIsDismissed(false); }}
                className="bg-red-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all"
              >
                <AlertCircle size={16} />
                <span className="text-[10px] font-black uppercase tracking-wider">{t('support_title')}</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <div id="tut-nav-barn" onClick={() => { playSound('pop'); onViewChange('BARN'); }} className={`p-2 rounded-full border-b-4 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-sm shrink-0 ${currentView === 'BARN' ? 'bg-orange-100 text-orange-600 border-orange-300' : 'bg-white text-slate-400 border-slate-200 hover:text-orange-500'}`} title={t('view_barn')}><Warehouse size={20} /></div>
        <div id="tut-nav-store" onClick={() => { playSound('pop'); onViewChange('STORE'); }} className={`flex items-center gap-1 px-3 py-1.5 rounded-full border-b-4 active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-sm shrink-0 relative ${isStoreCrisis ? 'bg-red-500 text-white border-red-700 animate-pulse' : currentView === 'STORE' ? 'bg-yellow-100 text-yellow-700 border-yellow-400' : 'bg-yellow-400 text-yellow-900 border-yellow-600'}`} title={t('view_store')}>
          <ShoppingBag size={16} />
          <span className="font-black text-sm hidden sm:inline uppercase">{t('view_store')}</span>
          {isStoreCrisis && <div className="absolute -top-1 -right-1 bg-white text-red-500 rounded-full"><AlertCircle size={12} fill="currentColor"/></div>}
        </div>
        
        <div className="h-8 w-[2px] bg-slate-300 mx-1 hidden md:block"></div>
        <div onClick={() => { playSound('pop'); onViewChange('WALLET'); }} className="hidden md:flex flex-col items-end gap-0.5 cursor-pointer hover:scale-105 transition-transform"><div className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md border min-w-[80px] justify-end bg-white text-slate-700 border-slate-200"><span className="text-yellow-500">💰</span> {balance}</div></div>
      </div>
    </header>
  );
};

export default Navbar;
