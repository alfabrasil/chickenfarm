import React, { createContext, useState, useContext, useEffect } from 'react';

const TutorialContext = createContext();

export const TUTORIAL_STEPS = {
  WELCOME: 'WELCOME',
  GROWTH_INFO: 'GROWTH_INFO',
  FEED_CHICK: 'FEED_CHICK',
  CHECK_BARN: 'CHECK_BARN',
  WAIT_FOR_SICKNESS: 'WAIT_FOR_SICKNESS', // Silent step
  VACCINE_ALERT: 'VACCINE_ALERT',
  GO_TO_SHOP_VACCINE: 'GO_TO_SHOP_VACCINE',
  BUY_VACCINE: 'BUY_VACCINE',
  DAILY_SPIN: 'DAILY_SPIN',
  SUPPORT_INFO: 'SUPPORT_INFO',
  COMPLETED: 'COMPLETED'
};

export const TutorialProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(() => {
    return localStorage.getItem('farm_tutorial_step') || TUTORIAL_STEPS.WELCOME;
  });

  const [isTutorialActive, setIsTutorialActive] = useState(() => {
    return localStorage.getItem('farm_tutorial_skipped') !== 'true' && 
           localStorage.getItem('farm_tutorial_step') !== TUTORIAL_STEPS.COMPLETED;
  });

  const [isDismissed, setIsDismissed] = useState(false);
  const [internalGameState, setInternalGameState] = useState(null);
  const [crisisStep, setCrisisStep] = useState(null);

  useEffect(() => {
    localStorage.setItem('farm_tutorial_step', currentStep);
    if (currentStep === TUTORIAL_STEPS.COMPLETED) {
      setIsTutorialActive(false);
    }
  }, [currentStep]);

  // Step Target Mapping
  const getTargetSelector = (step, crisis) => {
    if (crisis) {
      switch (crisis) {
        case 'CRISIS_VACCINE_STORE': return '#tut-nav-store';
        case 'CRISIS_FEED_STORE': return '#tut-nav-store';
        case 'CRISIS_VACCINE_COOP': return '#tut-nav-coop';
        case 'CRISIS_FEED_COOP': return '#tut-nav-coop';
        case 'CRISIS_CLEAN_COOP': return '#tut-nav-coop';
        case 'CRISIS_DAILY_WHEEL': return '#tut-nav-wheel';
        default: return null;
      }
    }
    switch (step) {
      case TUTORIAL_STEPS.FEED_CHICK: return '#tut-nav-coop';
      case TUTORIAL_STEPS.CHECK_BARN: return '#tut-nav-barn';
      case TUTORIAL_STEPS.GO_TO_SHOP_VACCINE: return '#tut-nav-store';
      case TUTORIAL_STEPS.BUY_VACCINE: return '#tut-buy-vaccine';
      case TUTORIAL_STEPS.DAILY_SPIN: return '#tut-nav-wheel';
      case TUTORIAL_STEPS.SUPPORT_INFO: return '#tut-support-btn';
      default: return null;
    }
  };

  // Monitor Game State for Auto-Progression and Crisis
  useEffect(() => {
    if (!internalGameState) return;
    const { chickens, inventory, currentView } = internalGameState;

    // --- TUTORIAL PROGRESSION ---
    if (isTutorialActive) {
      // Auto-advance: Viewed Barn
      if (currentStep === TUTORIAL_STEPS.CHECK_BARN && currentView === 'BARN') {
        advanceStep(TUTORIAL_STEPS.WAIT_FOR_SICKNESS);
      }

      // Auto-advance: Bought vaccine when needed
      if (currentStep === TUTORIAL_STEPS.BUY_VACCINE && inventory.vaccine > 0) {
        advanceStep(TUTORIAL_STEPS.DAILY_SPIN);
      }

      // Trigger Vaccine Alert
      const hasSickChicken = chickens.some(c => c.is_sick);
      const hasNoVaccine = inventory.vaccine === 0;
      
      if (currentStep === TUTORIAL_STEPS.WAIT_FOR_SICKNESS && hasSickChicken && hasNoVaccine) {
        advanceStep(TUTORIAL_STEPS.VACCINE_ALERT);
      }
    }

    // --- CRISIS DETECTION (Post-Tutorial or during) ---
    const hasSickChicken = chickens.some(c => c.is_sick);
    const hasHungryChicken = chickens.some(c => c.last_fed_day < internalGameState.dayCount);
    const hasNoVaccine = inventory.vaccine === 0;
    const hasNoFeed = inventory.feed === 0;
    const hasPoop = chickens.some(c => c.has_poop);
    const canSpin = internalGameState.canSpin;

    let detectedCrisis = null;

    if (hasSickChicken) {
      if (hasNoVaccine) detectedCrisis = 'CRISIS_VACCINE_STORE';
      else if (currentView !== 'COOP') detectedCrisis = 'CRISIS_VACCINE_COOP';
    } else if (hasHungryChicken) {
      if (hasNoFeed) detectedCrisis = 'CRISIS_FEED_STORE';
      else if (currentView !== 'COOP') detectedCrisis = 'CRISIS_FEED_COOP';
    } else if (hasPoop && currentView !== 'COOP') {
      detectedCrisis = 'CRISIS_CLEAN_COOP';
    } else if (canSpin && currentView !== 'WHEEL') {
      detectedCrisis = 'CRISIS_DAILY_WHEEL';
    }

    setCrisisStep(detectedCrisis);

  }, [internalGameState, currentStep, isTutorialActive]);

  const advanceStep = (nextStep) => {
    console.log(`Tutorial advancing: ${currentStep} -> ${nextStep}`);
    setCurrentStep(nextStep);
    setIsDismissed(false); // Reset dismissal on step change
  };

  const restartTutorial = () => {
    localStorage.removeItem('farm_tutorial_skipped');
    localStorage.setItem('farm_tutorial_step', TUTORIAL_STEPS.WELCOME);
    setCurrentStep(TUTORIAL_STEPS.WELCOME);
    setIsTutorialActive(true);
    setIsDismissed(false);
  };

  const skipTutorial = () => {
    localStorage.setItem('farm_tutorial_skipped', 'true');
    setIsTutorialActive(false);
    setCurrentStep(TUTORIAL_STEPS.COMPLETED);
  };

  const completeTutorial = () => {
    setCurrentStep(TUTORIAL_STEPS.COMPLETED);
    setIsTutorialActive(false);
  };
  
  const updateGameState = (newState) => {
    setInternalGameState(newState);
  };

  return (
    <TutorialContext.Provider value={{ 
      currentStep, 
      crisisStep,
      advanceStep, 
      completeTutorial,
      restartTutorial,
      skipTutorial,
      isTutorialActive,
      isDismissed,
      setIsDismissed,
      steps: TUTORIAL_STEPS,
      updateGameState,
      targetSelector: getTargetSelector(currentStep, crisisStep)
    }}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};
