import React from 'react';
import Confetti from '../ui/Confetti';
import { Gift, Lock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const AchievementModal = ({ achievement, onClose }) => {
  const { t } = useLanguage();

  return (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in zoom-in duration-300" onClick={onClose}>
    <Confetti />
    <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center border-b-8 border-yellow-400 relative overflow-hidden shadow-[0_0_50px_rgba(250,204,21,0.5)]">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-300 via-orange-500 to-yellow-300"></div>
      <div className="text-8xl mb-4 animate-bounce filter drop-shadow-md">{achievement.icon}</div>
      <h2 className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-1">{t('achievement_unlocked')}</h2>
      <h3 className="text-3xl font-black text-slate-800 mb-2">{t(achievement.titleKey)}</h3>
      <p className="text-slate-500 font-medium mb-6">{t(achievement.descKey)}</p>
      <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl font-black inline-flex items-center gap-2 mb-6"><Gift size={20}/> {t('achievement_reward_label')}{achievement.reward} 💰</div>
      <button onClick={onClose} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-black shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all">{t('btn_collect_continue')}</button>
    </div>
  </div>
  );
};

export default AchievementModal;
