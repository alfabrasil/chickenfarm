import React, { useState } from 'react';
import { HelpCircle, X, Info, LifeBuoy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

const SupportIcon = ({ tipKey, screenName }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 z-[999]" id="tut-support-btn">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-blue-100 p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 text-blue-600 font-black text-sm">
                <Info size={16} />
                {t('support_title')}
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            </div>
            <p className="text-slate-600 text-xs font-bold leading-relaxed">
              {t(tipKey)}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
              <span className="text-[10px] text-slate-400 font-medium italic">{screenName}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all
          ${isOpen ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}
          border-4 border-white/50
        `}
      >
        {isOpen ? <X size={24} /> : <LifeBuoy size={24} className="animate-pulse" />}
      </motion.button>
    </div>
  );
};

export default SupportIcon;
