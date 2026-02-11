import React from 'react';
import { useTutorial, TUTORIAL_STEPS } from '../../contexts/TutorialContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, SkipForward, Info, AlertCircle } from 'lucide-react';
import TutorialArrow from './TutorialArrow';

const TutorialOverlay = () => {
  const { 
    currentStep, 
    advanceStep, 
    completeTutorial, 
    skipTutorial, 
    isTutorialActive, 
    isDismissed, 
    setIsDismissed,
    targetSelector,
    crisisStep 
  } = useTutorial();
  const { t } = useLanguage();

  if (!isTutorialActive && !crisisStep) {
    return null;
  }

  if (isDismissed || currentStep === TUTORIAL_STEPS.WAIT_FOR_SICKNESS) {
    return null;
  }

  const getContent = () => {
    // Priority 1: Crises
    if (crisisStep) {
      switch (crisisStep) {
        case 'CRISIS_VACCINE_STORE':
          return {
            title: t('crisis_vaccine_store_title'),
            text: t('crisis_vaccine_store_text'),
            icon: '🚑',
            position: 'bottom',
            isUrgent: true,
            isCrisis: true
          };
        case 'CRISIS_FEED_STORE':
          return {
            title: t('crisis_feed_store_title'),
            text: t('crisis_feed_store_text'),
            icon: '🚛',
            position: 'bottom',
            isUrgent: true,
            isCrisis: true
          };
        case 'CRISIS_VACCINE_COOP':
          return {
            title: t('crisis_vaccine_coop_title'),
            text: t('crisis_vaccine_coop_text'),
            icon: '💉',
            position: 'bottom',
            isUrgent: false,
            isCrisis: true
          };
        case 'CRISIS_FEED_COOP':
          return {
            title: t('crisis_feed_coop_title'),
            text: t('crisis_feed_coop_text'),
            icon: '🌽',
            position: 'bottom',
            isUrgent: false,
            isCrisis: true
          };
        case 'CRISIS_CLEAN_COOP':
          return {
            title: t('crisis_clean_title'),
            text: t('crisis_clean_text'),
            icon: '🧹',
            position: 'bottom',
            isUrgent: false,
            isCrisis: true
          };
        case 'CRISIS_DAILY_WHEEL':
          return {
            title: t('tut_daily_spin_title'),
            text: t('tut_daily_spin_text'),
            icon: '🎰',
            position: 'bottom',
            isUrgent: false,
            isCrisis: true
          };
        default: break;
      }
    }

    // Priority 2: Tutorial Steps
    switch (currentStep) {
      case TUTORIAL_STEPS.WELCOME:
        return {
          title: t('tut_welcome_title'),
          text: t('tut_welcome_text'),
          icon: '🐣',
          action: () => advanceStep(TUTORIAL_STEPS.GROWTH_INFO),
          btnText: t('tut_btn_start'),
          position: 'center',
          stepIndex: 1,
          totalSteps: 7
        };
      case TUTORIAL_STEPS.GROWTH_INFO:
        return {
          title: t('tut_growth_title'),
          text: t('tut_growth_text'),
          icon: '⏳',
          action: () => advanceStep(TUTORIAL_STEPS.FEED_CHICK),
          btnText: t('tut_btn_next'),
          position: 'center',
          stepIndex: 2,
          totalSteps: 7
        };
      case TUTORIAL_STEPS.FEED_CHICK:
        return {
          title: t('tut_feed_title'),
          text: t('tut_feed_text'),
          icon: '🌽',
          btnText: null,
          position: 'bottom',
          stepIndex: 3,
          totalSteps: 7
        };
      case TUTORIAL_STEPS.CHECK_BARN:
        return {
          title: t('tut_barn_title'),
          text: t('tut_barn_text'),
          icon: '🏠',
          btnText: null,
          position: 'bottom',
          stepIndex: 4,
          totalSteps: 7
        };
      case TUTORIAL_STEPS.VACCINE_ALERT:
        return {
          title: t('tut_vaccine_alert_title'),
          text: t('tut_vaccine_alert_text'),
          icon: '⚠️',
          action: () => advanceStep(TUTORIAL_STEPS.GO_TO_SHOP_VACCINE),
          btnText: t('tut_btn_understood'),
          position: 'center',
          isUrgent: true,
          stepIndex: 5,
          totalSteps: 7
        };
      case TUTORIAL_STEPS.GO_TO_SHOP_VACCINE:
        return {
          title: t('tut_go_shop_title'),
          text: t('tut_go_shop_text'),
          icon: '💉',
          btnText: null,
          position: 'bottom',
          stepIndex: 5,
          totalSteps: 7
        };
      case TUTORIAL_STEPS.BUY_VACCINE:
        return {
          title: t('tut_buy_vaccine_title'),
          text: t('tut_buy_vaccine_text'),
          icon: '🛒',
          btnText: null,
          position: 'bottom',
          stepIndex: 5,
          totalSteps: 7
        };
      case TUTORIAL_STEPS.DAILY_SPIN:
        return {
          title: t('tut_daily_spin_title'),
          text: t('tut_daily_spin_text'),
          icon: '🎰',
          action: () => advanceStep(TUTORIAL_STEPS.SUPPORT_INFO),
          btnText: t('tut_btn_next'),
          position: 'bottom',
          stepIndex: 6,
          totalSteps: 7
        };
      case TUTORIAL_STEPS.SUPPORT_INFO:
        return {
          title: t('tut_support_title'),
          text: t('tut_support_text'),
          icon: '🛟',
          action: () => completeTutorial(),
          btnText: t('tut_btn_finish'),
          position: 'center',
          stepIndex: 7,
          totalSteps: 7
        };
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  const isCenter = content.position === 'center';

  return (
    <>
      <TutorialArrow targetSelector={targetSelector} />
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[9998] ${
            isCenter ? 'bg-black/60 backdrop-blur-sm' : 'pointer-events-none'
          }`}
          onClick={() => isCenter && setIsDismissed(true)}
        />

        <motion.div
          initial={{ opacity: 0, y: isCenter ? 20 : 50, scale: 0.95, x: isCenter ? "-50%" : 0 }}
          animate={{ opacity: 1, y: isCenter ? "-50%" : 0, scale: 1, x: isCenter ? "-50%" : 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`fixed z-[9999] ${
            isCenter 
              ? 'top-1/2 left-1/2 p-4 w-full max-w-[90%]' 
              : 'bottom-28 left-0 w-full flex justify-center p-3 pointer-events-none'
          }`}
        >
          <div className={`
            bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.3)] 
            border-[3px] ${content.isUrgent ? 'border-red-400' : 'border-white'} 
            p-6 sm:p-10 max-w-md w-full pointer-events-auto relative overflow-hidden group
          `}>
            {/* Glossy Overlay & Patterns */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

            {/* Header: Progress & Actions */}
            <div className="flex justify-between items-center mb-5 relative z-10">
              <div className="flex gap-1.5 items-center">
                {content.totalSteps && [...Array(content.totalSteps)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    initial={false}
                    animate={{ 
                      width: i + 1 === content.stepIndex ? 24 : 6,
                      backgroundColor: i + 1 === content.stepIndex ? '#3b82f6' : '#e2e8f0'
                    }}
                    className="h-1.5 rounded-full" 
                  />
                ))}
                {content.isCrisis && (
                  <span className="ml-2 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider animate-pulse">
                    {t('label_urgent') || 'Emergência'}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {!content.isCrisis && (
                  <button 
                    onClick={skipTutorial}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all"
                    title={t('tut_skip')}
                  >
                    <SkipForward size={14} />
                  </button>
                )}
                <button 
                  onClick={() => setIsDismissed(true)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all"
                  title={t('tut_close')}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 relative z-10">
              <div className="relative shrink-0 self-center sm:self-start">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className={`
                    w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] flex items-center justify-center text-4xl sm:text-5xl
                    ${content.isUrgent ? 'bg-red-100' : 'bg-blue-50'} 
                    border-2 ${content.isUrgent ? 'border-red-200' : 'border-blue-100'}
                    shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)]
                  `}
                >
                  <motion.span
                    animate={content.isUrgent ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {content.icon}
                  </motion.span>
                </motion.div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-lg border border-slate-100">
                  <div className={`rounded-full p-1 ${content.isUrgent ? 'bg-red-500' : 'bg-blue-500'}`}>
                    {content.isUrgent ? <AlertCircle size={12} className="text-white" /> : <Info size={12} className="text-white" />}
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <h3 className={`font-black text-xl sm:text-3xl mb-2 leading-tight ${content.isUrgent ? 'text-red-600' : 'text-slate-800'}`}>
                  {content.title}
                </h3>
                <p className="text-slate-600 font-bold text-sm sm:text-lg leading-snug sm:leading-relaxed mb-6 sm:mb-8">
                  {content.text}
                </p>
                
                {content.btnText && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={content.action}
                    className={`
                      w-full py-4 sm:py-5 rounded-2xl font-black text-base sm:text-xl text-white shadow-2xl
                      flex items-center justify-center gap-3 transition-all
                      ${content.isUrgent 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 border-b-[6px] border-red-800' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 border-b-[6px] border-blue-800'
                      }
                    `}
                  >
                    {content.btnText}
                    <ChevronRight size={24} strokeWidth={4} />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default TutorialOverlay;
