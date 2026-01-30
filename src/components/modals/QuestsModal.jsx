import React from 'react';
import { X, ClipboardList, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const QuestsModal = ({ quests, onClose, onClaim }) => {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in zoom-in duration-300">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm relative border-b-8 border-slate-200 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={24}/></button>
        <h2 className="text-2xl font-black text-slate-800 mb-1 flex items-center gap-2"><ClipboardList className="text-blue-500"/> {t('quest_title')}</h2>
        <p className="text-slate-500 text-xs mb-6">{t('quest_subtitle')}</p>
        
        <div className="space-y-3">
          {quests.map(q => (
            <div key={q.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-slate-700 text-sm">{t(`quest_${q.id}_desc`)}</span>
                <span className="font-black text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg border border-yellow-200">+{q.reward} 💰</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                  <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${Math.min((q.progress/q.target)*100, 100)}%` }}></div>
                </div>
                <span className="text-xs font-bold text-slate-400">{q.progress}/{q.target}</span>
              </div>
              {q.completed && !q.claimed && (
                <button onClick={() => onClaim(q.id)} className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-black text-xs shadow-sm border-b-4 border-green-700 active:border-b-0 active:translate-y-1">
                  {t('quest_btn_claim')}
                </button>
              )}
               {q.claimed && (
                <div className="w-full mt-2 bg-slate-200 text-slate-400 py-2 rounded-xl font-black text-xs text-center flex items-center justify-center gap-1">
                  <CheckCircle size={14}/> {t('quest_completed')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestsModal;
