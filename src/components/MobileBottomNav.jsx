import React, { useState } from 'react';
import { Home, ShoppingBag, Warehouse, ClipboardList, Menu, Users2, Dices, Landmark, Settings as SettingsIcon, Gamepad2, Zap } from 'lucide-react';
import { playSound } from '../utils/audioSystem';
import { useLanguage } from '../contexts/LanguageContext';

const MobileBottomNav = ({ currentView, onViewChange, openQuests, pendingRewards }) => {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'COOP', icon: Home, label: t('nav_farm') },
    { id: 'STORE', icon: ShoppingBag, label: t('nav_store') },
    { id: 'BARN', icon: Warehouse, label: t('nav_barn') },
    { id: 'QUESTS', icon: ClipboardList, label: t('nav_quests'), isAction: true, hasBadge: pendingRewards },
    { id: 'MENU', icon: Menu, label: t('nav_menu'), isAction: true }
  ];

  return (
    <>
      {/* Menu Overlay para itens secundários no Mobile */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute bottom-24 right-4 bg-white rounded-2xl p-4 shadow-2xl border-b-4 border-slate-200 w-48 animate-in slide-in-from-bottom-5 space-y-2">
            <button onClick={() => { playSound('pop'); onViewChange('COMMUNITY'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-bold"><Users2 size={20} className="text-blue-500"/> {t('nav_community')}</button>
            <button onClick={() => { playSound('pop'); onViewChange('CHASE'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-bold"><Gamepad2 size={20} className="text-purple-600"/> {t('nav_minigame')}</button>
            <button onClick={() => { playSound('pop'); onViewChange('HARVEST'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-bold"><Zap size={20} className="text-green-500"/> {t('nav_harvest_pvp')}</button>
            <button onClick={() => { playSound('pop'); onViewChange('WHEEL'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-bold"><Dices size={20} className="text-purple-400"/> {t('nav_wheel')}</button>
            <button onClick={() => { playSound('pop'); onViewChange('BANK'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-bold"><Landmark size={20} className="text-green-500"/> {t('nav_bank')}</button>
            <button onClick={() => { playSound('pop'); onViewChange('SETTINGS'); setIsMenuOpen(false); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 text-slate-700 font-bold"><SettingsIcon size={20} className="text-slate-500"/> {t('nav_settings')}</button>
          </div>
        </div>
      )}

      {/* Barra Inferior Fixa */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-[90] px-4 py-2 pb-safe">
        <div className="flex justify-between items-center">
          {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = currentView === item.id;
             const colorClass = isActive ? 'text-green-600' : 'text-slate-400';
             
             return (
               <button 
                key={item.id}
                onClick={() => {
                  playSound('pop');
                  if (item.id === 'QUESTS') openQuests();
                  else if (item.id === 'MENU') setIsMenuOpen(!isMenuOpen);
                  else onViewChange(item.id);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all relative ${isActive ? 'bg-green-50 translate-y-[-4px]' : 'hover:bg-slate-50'}`}
                style={{ minWidth: '60px' }}
               >
                 <Icon size={24} className={`${colorClass} ${isActive ? 'fill-current' : ''}`} />
                 <span className={`text-[10px] font-bold mt-1 ${colorClass}`}>{item.label}</span>
                 {item.hasBadge && <div className="absolute top-1 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>}
               </button>
             )
          })}
        </div>
      </div>
    </>
  );
};

export default MobileBottomNav;
