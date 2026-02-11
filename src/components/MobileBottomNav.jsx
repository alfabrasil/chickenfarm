import React, { useState } from 'react';
import { Home, ShoppingBag, Warehouse, ClipboardList, Menu, Users2, Dices, Landmark, Settings as SettingsIcon, Gamepad2, Zap, AlertCircle, Dna } from 'lucide-react';
import { playSound } from '../utils/audioSystem';
import { useLanguage } from '../contexts/LanguageContext';
import { useTutorial } from '../contexts/TutorialContext';

const MobileBottomNav = ({ currentView, onViewChange, openQuests, pendingRewards, upgrades }) => {
  const { t } = useLanguage();
  const { crisisStep } = useTutorial();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isStoreCrisis = crisisStep === 'CRISIS_VACCINE_STORE' || crisisStep === 'CRISIS_FEED_STORE';
  const isCoopCrisis = crisisStep === 'CRISIS_VACCINE_COOP' || crisisStep === 'CRISIS_FEED_COOP';

  const navItems = [
    { id: 'COOP', icon: Home, label: t('nav_farm'), hasCrisis: isCoopCrisis },
    { id: 'STORE', icon: ShoppingBag, label: t('nav_store'), hasCrisis: isStoreCrisis },
    { id: 'BARN', icon: Warehouse, label: t('nav_barn') },
    { id: 'QUESTS', icon: ClipboardList, label: t('nav_quests'), isAction: true, hasBadge: pendingRewards },
    { id: 'MENU', icon: Menu, label: t('nav_menu'), isAction: true }
  ];

  return (
    <>
      {/* Menu Overlay para itens secundários no Mobile */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute bottom-24 right-4 bg-white rounded-2xl p-4 shadow-2xl border-b-4 border-slate-200 w-auto min-w-[200px] animate-in slide-in-from-bottom-5 space-y-2">
            <button onClick={() => { playSound('pop'); onViewChange('COMMUNITY'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-bold whitespace-nowrap"><Users2 size={20} className="text-blue-500"/> {t('nav_community')}</button>
            <button onClick={() => { playSound('pop'); onViewChange('CHASE'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-bold whitespace-nowrap"><Gamepad2 size={20} className="text-purple-600"/> {t('nav_minigame')}</button>
            {upgrades?.LAB && (
              <button onClick={() => { playSound('pop'); onViewChange('LAB'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-bold whitespace-nowrap"><Dna size={20} className="text-pink-500"/> {t('genetics_title')}</button>
            )}
            <button onClick={() => { playSound('pop'); onViewChange('HARVEST'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-bold whitespace-nowrap"><Zap size={20} className="text-green-500"/> {t('nav_harvest_pvp')}</button>
            <button onClick={() => { playSound('pop'); onViewChange('WHEEL'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-bold relative whitespace-nowrap"><Dices size={20} className="text-purple-400"/> {t('nav_wheel')} {crisisStep === 'CRISIS_DAILY_WHEEL' && <div className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}</button>
            <button onClick={() => { playSound('pop'); onViewChange('BANK'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-bold whitespace-nowrap"><Landmark size={20} className="text-green-500"/> {t('nav_bank')}</button>
            <button onClick={() => { playSound('pop'); onViewChange('SETTINGS'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-bold whitespace-nowrap"><SettingsIcon size={20} className="text-slate-500"/> {t('nav_settings')}</button>
          </div>
        </div>
      )}

      {/* Barra Inferior Fixa */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-[90] px-4 py-2 pb-safe">
        <div className="flex justify-between items-center">
          {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = currentView === item.id;
             const colorClass = item.hasCrisis ? 'text-red-600' : isActive ? 'text-green-600' : 'text-slate-400';
             
             return (
               <button 
                key={item.id}
                id={`tut-nav-${item.id.toLowerCase()}`}
                onClick={() => {
                  playSound('pop');
                  if (item.id === 'QUESTS') openQuests();
                  else if (item.id === 'MENU') setIsMenuOpen(!isMenuOpen);
                  else onViewChange(item.id);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all relative ${item.hasCrisis ? 'bg-red-50 animate-pulse' : isActive ? 'bg-green-50 translate-y-[-4px]' : 'hover:bg-slate-50'}`}
                style={{ minWidth: '60px' }}
               >
                 <Icon size={24} className={`${colorClass} ${isActive && !item.hasCrisis ? 'fill-current' : ''}`} />
                 <span className={`text-[10px] font-bold mt-1 ${colorClass}`}>{item.label}</span>
                 {item.hasBadge && <div className="absolute top-1 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>}
                 {item.hasCrisis && <div className="absolute top-1 right-2"><AlertCircle size={10} fill="currentColor" className="text-white"/></div>}
               </button>
             )
          })}
        </div>
      </div>
    </>
  );
};

export default MobileBottomNav;
