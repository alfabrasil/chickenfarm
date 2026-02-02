import React, { useState, useEffect } from 'react';
import { 
  ArrowUpCircle, Lock, Moon, Gamepad2, Dna, Zap
} from 'lucide-react';

// Dados e Configuração
import { 
  TYPE_CONFIG, SKINS_CONFIG, BASE_PRICES, MARKET_NEWS, 
  ITEMS_CONFIG, TECH_CONFIG, UPGRADE_CONFIG, AUCTION_MOCK_INITIAL, 
  QUEST_POOL, ACHIEVEMENTS_LIST, WHEEL_PRIZES 
} from './data/gameConfig';

// Utilitários
import { playSound, setGlobalMute, initAudio, attachAudioUnlockListeners } from './utils/audioSystem';

// Componentes UI
import FoxComponent from './components/ui/Fox';
import FloatingText from './components/ui/FloatingText';
import FarmBackground from './components/ui/FarmBackground';

// Modais
import AchievementModal from './components/modals/AchievementModal';
import QuestsModal from './components/modals/QuestsModal';
import LevelUpModal from './components/modals/LevelUpModal';
import LegendaryDropModal from './components/modals/LegendaryDropModal';

// Componentes Principais
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import ChickenCard from './components/ChickenCard';

// Telas
import AuthScreen from './components/screens/AuthScreen';
import UnboxingScreen from './components/screens/UnboxingScreen';
import BarnScreen from './components/screens/BarnScreen';
import GeneticsLabScreen from './components/screens/GeneticsLabScreen';
import StoreScreen from './components/screens/StoreScreen';
import BankScreen from './components/screens/BankScreen';
import RankingScreen from './components/screens/RankingScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import CommunityScreen from './components/screens/CommunityScreen';
import WheelScreen from './components/screens/WheelScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import WalletScreen from './components/screens/WalletScreen';
import ChickenChaseScreen from './components/screens/ChickenChaseScreen';
import CockfightScreen from './components/screens/CockfightScreen';
import HarvestGameScreen from './components/screens/harvest/HarvestGameScreen';
import { useLanguage } from './contexts/LanguageContext';

// --- APP PRINCIPAL ---
export default function App() {
  const { t } = useLanguage();
  const [session, setSession] = useState(() => localStorage.getItem('farm_session') || 'AUTH');
  const [balance, setBalance] = useState(() => {
    const val = Number(localStorage.getItem('farm_balance'));
    return isNaN(val) ? 0 : val;
  });
  const [bankBalance, setBankBalance] = useState(() => {
    const val = Number(localStorage.getItem('farm_bank_balance'));
    return isNaN(val) ? 0 : val;
  });
  const [dayCount, setDayCount] = useState(() => {
    const val = Number(localStorage.getItem('farm_day'));
    return isNaN(val) || val < 1 ? 1 : val;
  });
  const [level, setLevel] = useState(() => {
    const val = Number(localStorage.getItem('farm_level'));
    return isNaN(val) || val < 1 ? 1 : val;
  });
  const [xp, setXp] = useState(() => {
    const val = Number(localStorage.getItem('farm_xp'));
    return isNaN(val) ? 0 : val;
  });
  const [maxCapacity, setMaxCapacity] = useState(() => {
    const val = Number(localStorage.getItem('farm_capacity'));
    return isNaN(val) || val < 4 ? 4 : val;
  }); 
  const [inventory, setInventory] = useState(() => { 
    try {
      const s = localStorage.getItem('farm_inventory'); 
      return s ? JSON.parse(s) : { feed: 5, vaccine: 0, eggs_common: 0, eggs_rare: 0, eggs_legendary: 0 }; 
    } catch (e) {
      console.error("Erro ao carregar inventário:", e);
      return { feed: 5, vaccine: 0, eggs_common: 0, eggs_rare: 0, eggs_legendary: 0 };
    }
  });
  
  const [chickens, setChickens] = useState(() => { 
    try {
      const s = localStorage.getItem('farm_chickens'); 
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) {
          return parsed.map(c => {
            if (c.is_starter || c.name === t('app_starter_name') || c.id === 1) {
               return { ...c, last_collected_day: c.last_collected_day || 0, is_starter: true, immune: true, is_sick: false };
            }
            return { ...c, last_collected_day: c.last_collected_day || 0 };
          });
        }
      }
    } catch (e) {
      console.error("Erro ao carregar galinhas:", e);
    }
    return []; 
  });

  const [automations, setAutomations] = useState(() => {
    try {
      const s = localStorage.getItem('farm_automations');
      return s ? JSON.parse(s) : {};
    } catch (e) {
      return {};
    }
  });

  const [upgrades, setUpgrades] = useState(() => {
    try {
      const s = localStorage.getItem('farm_upgrades');
      return s ? JSON.parse(s) : {};
    } catch (e) {
      return {};
    }
  });

  const [marketNews, setMarketNews] = useState(() => {
    try {
      const s = localStorage.getItem('farm_market_news');
      return s ? JSON.parse(s) : MARKET_NEWS[0];
    } catch (e) {
      return MARKET_NEWS[0];
    }
  });

  const [coopProgress, setCoopProgress] = useState(() => Number(localStorage.getItem('farm_coop_progress')) || 0);

  const [auctionItems, setAuctionItems] = useState(() => {
    try {
      const s = localStorage.getItem('farm_auctions');
      return s ? JSON.parse(s) : AUCTION_MOCK_INITIAL;
    } catch (e) {
      return AUCTION_MOCK_INITIAL;
    }
  });

  const [goldenEggs, setGoldenEggs] = useState(() => {
    const val = Number(localStorage.getItem('farm_golden_eggs'));
    return isNaN(val) ? 0 : val;
  });

  // MIGRAÇÃO DE NOMES (Auto-fix para tradução dinâmica)
  useEffect(() => {
    setChickens(prev => prev.map(c => {
      // Se já tem nameKey, retorna igual
      if (c.nameKey) return c;

      let newKey = null;
      
      if (c.is_starter) {
         newKey = 'starter_chicken_name';
      }
      // Tenta recuperar nameKey da variante salva
      else if (c.variant && c.variant.nameKey) {
        newKey = c.variant.nameKey;
      } 
      // Se não, tenta pelo tipo (se não for mestiço sem variante)
      else if (c.type && !c.name?.includes("Mestiça") && !c.name?.includes("Hybrid")) {
         newKey = `chicken_name_${c.type}`;
      }
      
      // Se encontrou uma chave, atualiza
      if (newKey) {
        return { ...c, nameKey: newKey };
      }
      
      return c;
    }));
  }, []);

  const [referralHistory, setReferralHistory] = useState([]);
  const [weather, setWeather] = useState(() => localStorage.getItem('farm_weather') || 'SUNNY'); 
  const [marketPrices, setMarketPrices] = useState(() => { 
    try {
      const s = localStorage.getItem('farm_prices'); 
      return s ? JSON.parse(s) : { common: 10, rare: 25, legendary: 100 }; 
    } catch (e) {
      return { common: 10, rare: 25, legendary: 100 };
    }
  });
  const [quests, setQuests] = useState(() => { 
    try {
      const s = localStorage.getItem('farm_quests'); 
      return s ? JSON.parse(s) : []; 
    } catch (e) {
      return [];
    }
  });

  const [stats, setStats] = useState(() => {
    try {
      const s = localStorage.getItem('farm_stats');
      return s ? JSON.parse(s) : { total_eggs: 0, total_cleaned: 0, total_earned: 0, total_healed: 0, days_played: 1, legendary_eggs: 0 };
    } catch (e) {
      return { total_eggs: 0, total_cleaned: 0, total_earned: 0, total_healed: 0, days_played: 1, legendary_eggs: 0 };
    }
  });
  const [achievements, setAchievements] = useState(() => {
    try {
      const s = localStorage.getItem('farm_achievements');
      return s ? JSON.parse(s) : ACHIEVEMENTS_LIST;
    } catch (e) {
      return ACHIEVEMENTS_LIST;
    }
  });

  // ENGENHARIA: Desbloqueio confiável de áudio no iOS (primeira interação)
  useEffect(() => {
    attachAudioUnlockListeners();
    // Garantir contexto criado também em navegadores não iOS
    initAudio();
  }, []);
  
  // ENGENHARIA: Novos Estados para os recursos implementados
  const [currentSkin, setCurrentSkin] = useState(() => {
    const saved = localStorage.getItem('farm_skin');
    return (saved && SKINS_CONFIG[saved]) ? saved : 'DEFAULT';
  });
  const [marketHistory, setMarketHistory] = useState(() => {
    try {
      const s = localStorage.getItem('farm_market_history');
      return s ? JSON.parse(s) : Array(7).fill({ common: 10, trend: 'STABLE' }); // Inicia flat
    } catch (e) {
      return Array(7).fill({ common: 10, trend: 'STABLE' });
    }
  });

  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('farm_muted') === 'true');
  const [fox, setFox] = useState(null); 
  const [lastSpinDay, setLastSpinDay] = useState(() => Number(localStorage.getItem('farm_last_spin_day')) || 0);

  const [showQuests, setShowQuests] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null); 
  const [view, setView] = useState('COOP');
  const [isNight, setIsNight] = useState(false);
  const [legendaryDrop, setLegendaryDrop] = useState(null);
  const [toast, setToast] = useState(null);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    setGlobalMute(isMuted);
    localStorage.setItem('farm_muted', isMuted);
  }, [isMuted]);

  useEffect(() => {
    localStorage.setItem('farm_session', session);
    localStorage.setItem('farm_balance', balance);
    localStorage.setItem('farm_bank_balance', bankBalance);
    localStorage.setItem('farm_day', dayCount);
    localStorage.setItem('farm_level', level);
    localStorage.setItem('farm_xp', xp);
    localStorage.setItem('farm_capacity', maxCapacity);
    localStorage.setItem('farm_inventory', JSON.stringify(inventory));
    localStorage.setItem('farm_chickens', JSON.stringify(chickens));
    localStorage.setItem('farm_weather', weather);
    localStorage.setItem('farm_prices', JSON.stringify(marketPrices));
    localStorage.setItem('farm_quests', JSON.stringify(quests));
    localStorage.setItem('farm_stats', JSON.stringify(stats));
    localStorage.setItem('farm_achievements', JSON.stringify(achievements));
    localStorage.setItem('farm_last_spin_day', lastSpinDay);
    localStorage.setItem('farm_automations', JSON.stringify(automations));
    localStorage.setItem('farm_upgrades', JSON.stringify(upgrades));
    localStorage.setItem('farm_market_news', JSON.stringify(marketNews));
    localStorage.setItem('farm_coop_progress', coopProgress);
    localStorage.setItem('farm_auctions', JSON.stringify(auctionItems));
    localStorage.setItem('farm_golden_eggs', goldenEggs);
    // Persistência das Novas Features
    localStorage.setItem('farm_skin', currentSkin);
    localStorage.setItem('farm_market_history', JSON.stringify(marketHistory));
  }, [session, balance, bankBalance, dayCount, level, xp, inventory, chickens, weather, marketPrices, quests, stats, achievements, lastSpinDay, automations, upgrades, marketNews, coopProgress, auctionItems, goldenEggs, currentSkin, marketHistory]);

  const showToast = (arg1, arg2 = 'success') => { 
    const message = typeof arg1 === 'object' ? arg1.message : arg1;
    const type = typeof arg1 === 'object' ? (arg1.type || arg2) : arg2;
    setToast({ message, type }); 
    setTimeout(() => setToast(null), 3000); 
  };
  
  const handleExportSave = () => {
    const saveData = btoa(JSON.stringify(localStorage));
    navigator.clipboard.writeText(saveData);
    showToast(t('save_exported'), "success");
  };

  const handleImportSave = () => {
    const saveData = prompt(t('save_import_prompt'));
    if (saveData) {
      try {
        const data = JSON.parse(atob(saveData));
        Object.keys(data).forEach(key => localStorage.setItem(key, data[key]));
        window.location.reload();
      } catch (e) {
        showToast(t('save_invalid'), "error");
      }
    }
  };

  const handleFoxEscape = () => {
    setInventory(prev => {
      if (prev.eggs_common > 0) {
        showToast(t('fox_stole_egg'), "error");
        return { ...prev, eggs_common: prev.eggs_common - 1 };
      }
      showToast(t('fox_escaped'), "info");
      return prev;
    });
  };

  const handleFoxClick = () => {
    setFox(null);
    setBalance(prev => prev + 50);
    addXp(20);
    playSound('success');
    showToast(t('fox_caught', [50]), "success");
  };

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (upgrades.FENCE) return; 
      if (session === 'GAME' && !fox && !isNight && Math.random() < 0.3) {
        const newFox = { id: Date.now(), x: Math.random() * 80 + 10, y: Math.random() * 60 + 20 };
        setFox(newFox);
        playSound('fox');
        showToast(t('fox_appeared'), "error");
        setTimeout(() => {
          setFox(currentFox => {
            if (currentFox && currentFox.id === newFox.id) {
              handleFoxEscape();
              return null;
            }
            return currentFox;
          });
        }, 4000);
      }
    }, 30000);
    return () => clearInterval(spawnInterval);
  }, [fox, session, isNight, upgrades.FENCE]);

  useEffect(() => {
    if (automations.CLEANSWEEP?.active) {
      const cleanInterval = setInterval(() => {
        setChickens(prev => {
          const hasPoop = prev.some(c => c.has_poop);
          if (hasPoop) {
            return prev.map(c => ({ ...c, has_poop: false }));
          }
          return prev;
        });
      }, 5000); 
      return () => clearInterval(cleanInterval);
    }
  }, [automations.CLEANSWEEP]);

  const checkAchievements = () => {
    let unlockedNow = null;
    const newAchievements = achievements.map(ach => {
      if (ach.unlocked) return ach;
      const config = ACHIEVEMENTS_LIST.find(c => c.id === ach.id);
      if (config && config.condition(stats)) {
        unlockedNow = config;
        return { ...ach, unlocked: true };
      }
      return ach;
    });

    if (unlockedNow) {
      setAchievements(newAchievements);
      setNewAchievement(unlockedNow); 
      playSound('achievement');
    }
  };

  useEffect(() => {
    checkAchievements();
  }, [stats]);

  const addFloatingText = (x, y, text, color) => {
    const id = Date.now();
    setFloatingTexts(prev => [...prev, { id, x, y, text, color }]);
    setTimeout(() => setFloatingTexts(prev => prev.filter(item => item.id !== id)), 1000);
  };

  const generateDailyQuests = () => {
    const shuffled = [...QUEST_POOL].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3).map(q => ({ ...q, progress: 0, completed: false, claimed: false }));
    setQuests(selected);
  };

  const updateQuestProgress = (type, amount = 1) => {
    setQuests(prev => prev.map(q => {
      if (q.type === type && !q.completed) {
        const newProgress = q.progress + amount;
        if (newProgress >= q.target) {
          showToast(t('msg_mission_complete', [t(q.descKey || 'quest_unknown')]), 'success');
          playSound('success');
          return { ...q, progress: newProgress, completed: true };
        }
        return { ...q, progress: newProgress };
      }
      return q;
    }));
  };

  const handleClaimQuest = (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (quest && quest.completed && !quest.claimed) {
      setBalance(prev => prev + quest.reward);
      addXp(10);
      setQuests(prev => prev.map(q => q.id === questId ? { ...q, claimed: true } : q));
      showToast(t('quest_claimed_msg', [quest.reward]), 'success');
      playSound('coin');
    }
  };

  const canSpinWheel = () => {
    return lastSpinDay < dayCount;
  };

  const handleSpinReward = (prize) => {
    setLastSpinDay(dayCount);
    
    if (prize.type === 'COIN') {
      setBalance(prev => prev + prize.val);
      showToast(t('app_won_coins_wheel', [prize.val]), 'success');
    } else if (prize.type === 'ITEM') {
      setInventory(prev => {
        if (prize.item === 'feed') {
          const maxFeed = upgrades.SILO ? 100 : 20;
          if (prev.feed >= maxFeed) {
            showToast(t('app_silo_full_wheel'), "error");
            return prev;
          }
          return { ...prev, feed: Math.min(prev.feed + prize.val, maxFeed) };
        }
        return {
          ...prev,
          [prize.item]: prev[prize.item] + prize.val
        };
      });
      if (prize.item !== 'feed') showToast(t('app_won_item_wheel', [prize.val, t(prize.labelKey)]), 'success');
    }
    
    if (prize.special) {
      playSound('achievement');
      addFloatingText(window.innerWidth / 2, window.innerHeight / 2, "JACKPOT!", "#8b5cf6");
    } else {
      playSound('coin');
    }
  };

  const handleContributeCoop = () => {
    if (inventory.eggs_common > 0) {
      setInventory(prev => ({ ...prev, eggs_common: prev.eggs_common - 1 }));
      setCoopProgress(prev => {
        const next = prev + 1;
        if (next >= 500 && prev < 500) {
          playSound('achievement');
          showToast(t('app_coop_goal_reached'), "success");
          addXp(500);
        }
        return next;
      });
      addXp(5);
      showToast(t('app_coop_donated'), "success");
    } else {
      showToast(t('app_coop_no_eggs'), "error");
    }
  };

  const handleBuyAuction = (listing) => {
    if (balance >= listing.price && chickens.length < maxCapacity) {
      setBalance(prev => prev - listing.price);
      setChickens(prev => [...prev, {
        id: Date.now(),
        type: listing.type,
        name: t('app_auction_prefix', [t(TYPE_CONFIG[listing.type].nameKey)]),
        age_days: listing.age,
        last_fed_day: dayCount,
        is_sick: false,
        has_poop: false,
        last_collected_day: 0
      }]);
      setAuctionItems(prev => prev.filter(item => item.id !== listing.id));
      playSound('sold');
      showToast(t('app_bought_animal', [t(TYPE_CONFIG[listing.type].nameKey)]), 'success');
    } else if (chickens.length >= maxCapacity) {
      showToast(t('app_barn_full'), "error");
    } else {
      showToast(t('msg_insufficient_funds'), "error");
    }
  };

  const handleSellAuction = (chicken) => {
    const price = Math.floor(TYPE_CONFIG[chicken.type].feedConsumption * 100 + chicken.age_days * 2);
    setBalance(prev => prev + price);
    setChickens(prev => prev.filter(c => c.id !== chicken.id));
    playSound('sold');
    showToast(t('app_sold_auction', [price]), 'success');
  };

  const handlePrestige = () => {
    const eggsToGain = Math.floor(balance / 5000); 
    setGoldenEggs(prev => prev + eggsToGain);
    setBalance(0);
    setBankBalance(0);
    setDayCount(1);
    setLevel(1);
    setXp(0);
    setMaxCapacity(4);
    setInventory({ feed: 5, vaccine: 0, eggs_common: 0, eggs_rare: 0, eggs_legendary: 0 });
    setChickens([{ id: Date.now(), type: "GRANJA", name: t('app_rebirth_name'), age_days: 0, last_fed_day: 1, is_sick: false, has_poop: false, last_collected_day: 0 }]);
    setAutomations({});
    setUpgrades({});
    setCoopProgress(0);
    setAuctionItems(AUCTION_MOCK_INITIAL);
    setCurrentSkin('DEFAULT'); // Reset da skin
    setMarketHistory(Array(7).fill({ common: 10, trend: 'STABLE' })); // Reset do mercado
    playSound('prestige');
    showToast(t('app_prestige_msg', [eggsToGain]), 'success');
    setView('COOP');
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleSleep = () => {
    setIsNight(true);
    setTimeout(() => {
      const nextDay = dayCount + 1;
      setDayCount(nextDay);
      setStats(prev => ({ ...prev, days_played: prev.days_played + 1 }));

      if (bankBalance > 0) {
        const interest = Math.floor(bankBalance * 0.05);
        setBankBalance(prev => prev + interest);
        if (interest > 0) showToast(t('app_interest_msg', [interest]), 'success');
      }

      if (automations.NUTRIBOT?.active) {
        let tempFeed = inventory.feed;
        let feedUsed = 0;
        
        const nextChickens = chickens.map(c => {
          if (c.last_fed_day < nextDay) {
             const consumption = TYPE_CONFIG[c.type].feedConsumption;
             if (tempFeed >= consumption) {
               tempFeed -= consumption;
               feedUsed += consumption;
               return { ...c, last_fed_day: nextDay };
             }
          }
          return c;
        });

        if (feedUsed > 0) {
           setChickens(nextChickens);
           setInventory(prev => ({ ...prev, feed: prev.feed - feedUsed }));
           showToast(t('app_nutribot_msg', [feedUsed]), "info");
        } else if (chickens.some(c => c.last_fed_day < nextDay)) {
           showToast(t('app_nutribot_fail'), "error");
        }
      }

      setAutomations(prev => {
        const nextState = { ...prev };
        Object.keys(nextState).forEach(key => {
          if (nextState[key].active) {
            nextState[key].daysLeft -= 1;
            if (nextState[key].daysLeft <= 0) { nextState[key].active = false; showToast(t('tech_expired', [t(TECH_CONFIG[key].nameKey)]), "error"); }
          }
        });
        return nextState;
      });

      // ENGENHARIA: Algoritmo de Mercado Avançado (Random Walk com Tendência)
      const generateNextPrice = (currentPrice, basePrice, newsMultiplier) => {
        const volatility = 0.15; // 15% max swing
        const trendFactor = (basePrice - currentPrice) * 0.1; // Tende a voltar ao preço base (Mean Reversion)
        const randomNoise = (Math.random() - 0.5) * 2 * volatility * currentPrice;
        let newPrice = currentPrice + trendFactor + randomNoise;
        
        // Aplica o multiplicador de notícias (News Shock)
        if (newsMultiplier !== 1.0) {
            newPrice = newPrice * newsMultiplier;
        }

        // Hard limits para evitar preços negativos ou absurdos
        return Math.max(Math.floor(Math.min(newPrice, basePrice * 4)), 1);
      };

      const randomNews = MARKET_NEWS[Math.floor(Math.random() * MARKET_NEWS.length)];
      setMarketNews(randomNews);
      showToast(t('app_newspaper', [t(randomNews.titleKey)]), 'info');

      // Calcula novos preços baseados no anterior
      const nextCommon = generateNextPrice(marketPrices.common, BASE_PRICES.EGG_COMMON, randomNews.multiplier);
      
      setMarketPrices({ 
        common: nextCommon, 
        rare: generateNextPrice(marketPrices.rare, BASE_PRICES.EGG_RARE, randomNews.multiplier),
        legendary: generateNextPrice(marketPrices.legendary, BASE_PRICES.EGG_LEGENDARY, randomNews.multiplier) 
      });

      // Atualiza Histórico do Mercado para o Gráfico
      setMarketHistory(prev => {
         const trend = nextCommon > marketPrices.common ? 'UP' : nextCommon < marketPrices.common ? 'DOWN' : 'STABLE';
         const newEntry = { common: nextCommon, trend };
         const newHistory = [...prev, newEntry];
         return newHistory.slice(-7); // Mantém apenas os últimos 7 dias
      });

      if (Math.random() < 0.5 && auctionItems.length < 5) {
         setAuctionItems(prev => [...prev, { 
           id: Date.now(), 
           seller: 'BotFarm', 
           type: Math.random() > 0.5 ? 'CAIPIRA' : 'GIGANTE', 
           age: Math.floor(Math.random() * 30) + 1, 
           price: Math.floor(Math.random() * 500) + 300, 
           expiresKey: 'auction_expires_h',
           expiresVal: 12
         }]);
      }

      const nextWeather = Math.random() < 0.3 ? 'RAINY' : 'SUNNY';
      setWeather(nextWeather);

      setChickens(prev => prev.map(c => {
        // ENGENHARIA: Mutantes/Cyber podem ter imunidades genéticas
        if (c.type === 'MUTANTE') return { ...c, age_days: c.age_days + 1 }; // Mutante nunca adoece, nem faz coco

        const isHungry = c.last_fed_day < nextDay;
        const baseSickness = (nextWeather === 'RAINY' && !upgrades.CLIMATE) ? 0.30 : 0.05;
        const hasCleanSweep = automations.CLEANSWEEP?.active;
        const chanceOfSickness = c.has_poop && !hasCleanSweep ? 0.8 : (isHungry ? 0.4 : baseSickness);
        
        const gotSick = !c.is_starter && !c.immune && !c.is_sick && Math.random() < chanceOfSickness;
        const madePoop = !c.is_sick && Math.random() < 0.5;
        
        return { ...c, age_days: c.age_days + 1, is_sick: c.is_sick || gotSick, has_poop: hasCleanSweep ? false : (c.has_poop || madePoop) };
      }));
      
      generateDailyQuests();
      setIsNight(false);
    }, 2000);
  };

  const addXp = (amount) => {
    let newXp = xp + amount;
    const nextLevelXp = level * 100;
    if (newXp >= nextLevelXp) { setLevel(prev => prev + 1); setXp(newXp - nextLevelXp); setShowLevelUp(true); playSound('success'); } else { setXp(newXp); }
  };

  const handleCollect = (chicken, e) => {
    if (chicken.last_collected_day === dayCount) { showToast(t('app_collected_today'), "error"); return; }
    const config = TYPE_CONFIG[chicken.type];
    const roll = Math.random();
    let eggType = 'eggs_common';
    let label = t('app_egg_label');
    let color = '#475569';
    let questType = 'COLLECT_COMMON';
    let isLegendary = false;

    if (roll < config.collectChance.legendary + config.collectChance.rare + config.collectChance.common) {
       if (roll < config.collectChance.legendary) { eggType = 'eggs_legendary'; setLegendaryDrop('LEGENDARY'); label = t('app_legendary_label'); playSound('success'); isLegendary = true; }
       else if (roll < config.collectChance.legendary + config.collectChance.rare) { eggType = 'eggs_rare'; setLegendaryDrop('RARE'); label = t('app_rare_label'); playSound('success'); questType = 'COLLECT_RARE'; }
       else { eggType = 'eggs_common'; }
    }
    setInventory(prev => ({ ...prev, [eggType]: prev[eggType] + 1 }));
    setChickens(prev => prev.map(c => c.id === chicken.id ? { ...c, last_collected_day: dayCount } : c));
    setStats(prev => ({ ...prev, total_eggs: prev.total_eggs + 1, legendary_eggs: isLegendary ? prev.legendary_eggs + 1 : prev.legendary_eggs }));
    addXp(15);
    addFloatingText(e.clientX, e.clientY, label, color);
    updateQuestProgress(questType);
  };

  const handleSellEggs = (totalValue) => {
    setBalance(prev => prev + totalValue);
    setInventory(prev => ({ ...prev, eggs_common: 0, eggs_rare: 0, eggs_legendary: 0 }));
    setStats(prev => ({ ...prev, total_earned: prev.total_earned + totalValue }));
    showToast(t('app_sell_all_msg', [totalValue]), 'success');
  };

  const handleBuyAnimal = (product, e) => {
    if (chickens.length >= maxCapacity) { showToast(t('app_barn_full_expand'), "error"); return; }
    if (balance >= product.priceCoins) {
      setBalance(prev => prev - product.priceCoins);
      const nameKey = `chicken_name_${product.type}`;
      setChickens([...chickens, { 
        id: Date.now(), 
        type: product.type, 
        nameKey: nameKey,
        name: t(nameKey), 
        age_days: 30, 
        last_fed_day: dayCount, 
        is_sick: false, 
        has_poop: false, 
        last_collected_day: 0 
      }]);
      showToast(t('app_bought_animal', [t(product.nameKey)]), 'success');
      addFloatingText(e.clientX, e.clientY, `-${product.priceCoins} 💰`, '#ef4444');
    }
  };
  
  const handleBuyItem = (itemId, e) => {
    if (TECH_CONFIG[itemId]) {
      const tech = TECH_CONFIG[itemId];
      if (balance >= tech.price) {
        setBalance(prev => prev - tech.price);
        setAutomations(prev => ({ ...prev, [itemId]: { active: true, daysLeft: tech.duration } }));
        showToast(t('app_rented_tech', [t(tech.nameKey), tech.duration]), 'success');
        addFloatingText(e.clientX, e.clientY, `-${tech.price} 💰`, '#ef4444');
      }
      return;
    }
    if (UPGRADE_CONFIG[itemId]) {
      const upg = UPGRADE_CONFIG[itemId];
      if (balance >= upg.price) {
        setBalance(prev => prev - upg.price);
        setUpgrades(prev => ({ ...prev, [itemId]: true }));
        showToast(t('app_built_upgrade', [t(upg.nameKey)]), 'success');
        addFloatingText(e.clientX, e.clientY, `-${upg.price} 💰`, '#ef4444');
      }
      return;
    }
    const config = ITEMS_CONFIG[itemId];
    if (config && balance >= config.price) {
      if (itemId === 'FEED') {
        const maxFeed = upgrades.SILO ? 100 : 20;
        if (inventory.feed >= maxFeed) { showToast(t('app_silo_full_max', [maxFeed]), "error"); return; }
      }
      setBalance(prev => prev - config.price);
      if (itemId === 'FEED') {
        const maxFeed = upgrades.SILO ? 100 : 20;
        setInventory(prev => ({ ...prev, feed: Math.min(prev.feed + config.quantity, maxFeed) }));
      }
      else if (itemId === 'VACCINE') setInventory(prev => ({ ...prev, vaccine: prev.vaccine + config.quantity }));
      else if (itemId === 'EXPANSION') { 
        setMaxCapacity(prev => prev + config.quantity); 
        showToast(t('app_barn_expanded', [config.quantity]), "success"); 
      }
      if (itemId !== 'EXPANSION') showToast(t('app_bought_item', [t(config.nameKey)]), 'success');
      addFloatingText(e.clientX, e.clientY, `-${config.price} 💰`, '#ef4444');
      updateQuestProgress('BUY_ITEM');
    }
  };

  // ENGENHARIA: Compra de Skins
  const handleBuySkin = (skin, e) => {
    if (currentSkin === skin.id) return;
    
    // Se a skin for paga e ainda não possuída (simplificado aqui como compra direta)
    if (skin.price > 0 && skin.id !== 'DEFAULT') {
       if (balance >= skin.price) {
          setBalance(prev => prev - skin.price);
          setCurrentSkin(skin.id);
          showToast(t('app_theme_applied', [t(skin.nameKey)]), 'success');
          addFloatingText(e.clientX, e.clientY, `-${skin.price} 💰`, '#ef4444');
       } else {
         showToast(t('msg_insufficient_funds'), "error");
       }
    } else {
       setCurrentSkin(skin.id);
       showToast(t('app_theme_applied', [t(skin.nameKey)]), 'success');
    }
  };
  
  const handleFeed = (chicken) => {
    const config = TYPE_CONFIG[chicken.type];
    if (inventory.feed >= config.feedConsumption) {
      setInventory(prev => ({ ...prev, feed: prev.feed - config.feedConsumption }));
      setChickens(prev => prev.map(c => c.id === chicken.id ? { ...c, last_fed_day: dayCount } : c));
      showToast(t('app_fed_msg'), 'info');
      updateQuestProgress('FEED');
    } else { showToast(t('app_no_feed_barn'), "error"); }
  };
  
  const handleHeal = (chicken) => {
    if (inventory.vaccine >= 1) {
      setInventory(prev => ({ ...prev, vaccine: prev.vaccine - 1 }));
      setChickens(prev => prev.map(c => c.id === chicken.id ? { ...c, is_sick: false } : c));
      setStats(prev => ({ ...prev, total_healed: prev.total_healed + 1 }));
      showToast(t('app_healed_msg'), 'success');
    } else { showToast(t('app_no_vaccines'), "error"); }
  };

  const handleClean = (chicken, e) => {
    setChickens(prev => prev.map(c => c.id === chicken.id ? { ...c, has_poop: false } : c));
    addXp(10); 
    setStats(prev => ({ ...prev, total_cleaned: prev.total_cleaned + 1 }));
    addFloatingText(e.clientX, e.clientY, '+10 XP', '#3b82f6');
    showToast(t('app_clean_msg'), 'success');
    updateQuestProgress('CLEAN');
  };

  const handleSimulateReferral = (levelConfig, e) => {
    const purchaseAmount = 1000; 
    const commission = Math.floor(purchaseAmount * levelConfig.percent);
    setBalance(prev => prev + commission);
    setStats(prev => ({ ...prev, total_earned: prev.total_earned + commission }));
    playSound('success');
    addFloatingText(e.clientX, e.clientY, `+${commission} 💰`, '#22c55e');
    showToast(t('app_referral_commission', [levelConfig.label]), 'success');
    setReferralHistory(prev => [{ id: Date.now(), desc: t('app_referral_history_desc', [levelConfig.level, 'Gigante']), amount: commission }, ...prev]);
  };

  const handleCloseAchievement = () => {
    if (newAchievement) {
      setBalance(prev => prev + newAchievement.reward); 
      setNewAchievement(null);
    }
  };
  
  const pendingRewards = quests.some(q => q.completed && !q.claimed);

  return (
    <div className="min-h-screen relative font-sans select-none overflow-hidden bg-slate-100">
      {/* ENGENHARIA: Passando skin ID para o background */}
      <FarmBackground isNight={isNight} weather={weather} skinId={currentSkin} />
      <FloatingText items={floatingTexts} />
      {legendaryDrop && <LegendaryDropModal type={legendaryDrop} onClose={() => setLegendaryDrop(null)} />}
      {showLevelUp && <LevelUpModal newLevel={level} onClose={() => setShowLevelUp(false)} />}
      {showQuests && <QuestsModal quests={quests} onClose={() => setShowQuests(false)} onClaim={handleClaimQuest} />}
      
      {newAchievement && <AchievementModal achievement={newAchievement} onClose={handleCloseAchievement} />}

      {session === 'GAME' && fox && <FoxComponent x={fox.x} y={fox.y} onClick={handleFoxClick} />}

      {session === 'AUTH' && <AuthScreen onLogin={() => setSession('UNBOXING')} />}
      {session === 'UNBOXING' && <UnboxingScreen onFinish={() => {setChickens([{ id: 1, type: "GRANJA", name: t('app_starter_name'), age_days: 0, last_fed_day: 1, is_sick: false, has_poop: false, last_collected_day: 0, is_starter: true, immune: true }]); setBalance(50); setInventory(prev=>({...prev, feed:5})); generateDailyQuests(); setSession('GAME');}} />}
      
      {session === 'GAME' && (
        <div className="relative z-10 h-screen overflow-y-auto">
          {/* Adicionando MobileBottomNav condicionalmente */}
          <MobileBottomNav currentView={view} onViewChange={setView} openQuests={() => setShowQuests(true)} pendingRewards={pendingRewards} />

          <div className="p-4 max-w-4xl mx-auto min-h-full pb-24 md:pb-4">
            <Navbar balance={balance} dayCount={dayCount} onViewChange={setView} currentView={view} level={level} xp={xp} xpToNextLevel={level*100} weather={weather} openQuests={() => setShowQuests(true)} goldenEggs={goldenEggs} pendingRewards={pendingRewards} automations={automations} upgrades={upgrades} />
            {toast && <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[80] px-6 py-3 rounded-2xl shadow-xl font-black text-white animate-in slide-in-from-top-5 fade-in flex items-center gap-2 ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>{toast.message}</div>}

            {view === 'COOP' ? (
              <div className="animate-in slide-in-from-left-10 fade-in duration-300 pb-24 md:pb-0">
                 <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-[70] flex flex-col gap-4">
                   <button onClick={() => setView('CHASE')} className="bg-purple-600 hover:bg-purple-700 text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center border-4 border-purple-400 animate-in zoom-in group relative">
                     <Gamepad2 size={32} fill="currentColor" className="group-hover:rotate-12 transition-transform"/>
                     <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full border-2 border-white animate-pulse">{t('nav_new')}</span>
                   </button>
                   <button onClick={() => setView('HARVEST')} className="bg-green-600 hover:bg-green-700 text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center border-4 border-green-400 animate-in zoom-in group relative">
                     <Zap size={32} fill="currentColor" className="group-hover:scale-110 transition-transform"/>
                   </button>
                   {upgrades.LAB && (
                     <button onClick={() => setView('LAB')} className="bg-pink-500 hover:bg-pink-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center border-4 border-pink-400 animate-in zoom-in">
                       <Dna size={32} fill="currentColor" className="animate-pulse"/>
                     </button>
                   )}
                   <button onClick={handleSleep} disabled={isNight} className="bg-indigo-600 hover:bg-indigo-700 text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center border-4 border-indigo-400 animate-bounce">
                     {isNight ? <span className="animate-spin">⏳</span> : <Moon size={32} fill="currentColor" />}
                   </button>
                 </div>
                 <div className="mb-6 bg-white/60 backdrop-blur-sm p-4 rounded-2xl inline-block border-2 border-white/50 shadow-sm">
                   <h1 className="text-2xl font-black text-slate-800 drop-shadow-sm">{t('app_coop_title')}</h1>
                   <p className="text-slate-700 font-medium text-xs sm:text-sm">{t('app_capacity', [chickens.length, maxCapacity])}</p>
                 </div>
                 {chickens.length === 0 ? <div className="text-center bg-white/50 p-8 rounded-3xl">{t('app_empty_barn')}</div> : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
                    {chickens.map(chicken => (<ChickenCard key={chicken.id} chicken={chicken} onFeed={handleFeed} onCollect={handleCollect} onHeal={handleHeal} onClean={handleClean} inventory={inventory} dayCount={dayCount} addFloatingText={addFloatingText} />))}
                    {chickens.length < maxCapacity ? (
                      <div onClick={() => setView('STORE')} className="w-full min-h-[300px] rounded-3xl border-4 border-dashed border-white/60 bg-white/30 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-white hover:bg-white/50 hover:border-white cursor-pointer transition-all group shadow-lg"><ArrowUpCircle size={48} /><span className="font-black text-lg text-slate-800 drop-shadow-md">{t('app_new_chicken')}</span></div>
                    ) : (
                      <div onClick={() => setView('STORE')} className="w-full min-h-[300px] rounded-3xl border-4 border-dashed border-red-300/60 bg-red-100/30 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-white hover:bg-red-100/50 cursor-pointer transition-all group shadow-lg"><Lock size={48} /><span className="font-black text-lg text-slate-800 drop-shadow-md text-center">{t('app_full')}<br/><span className="text-xs">{t('app_buy_expansion')}</span></span></div>
                    )}
                  </div>
                )}
              </div>
            ) : view === 'STORE' ? (
              <StoreScreen onBack={() => setView('COOP')} onBuyAnimal={handleBuyAnimal} onBuyItem={handleBuyItem} balance={balance} level={level} addFloatingText={addFloatingText} automations={automations} upgrades={upgrades} currentSkin={currentSkin} onBuySkin={handleBuySkin} />
            ) : view === 'BARN' ? (
              <BarnScreen onBack={() => setView('COOP')} inventory={inventory} onSellEggs={handleSellEggs} addFloatingText={addFloatingText} marketPrices={marketPrices} upgrades={upgrades} marketNews={marketNews} goldenEggs={goldenEggs} marketHistory={marketHistory} />
            ) : view === 'LAB' ? (
              <GeneticsLabScreen onBack={() => setView('COOP')} chickens={chickens} balance={balance} setBalance={setBalance} setChickens={setChickens} maxCapacity={maxCapacity} showToast={showToast} dayCount={dayCount} />
            ) : view === 'SETTINGS' ? (
              <SettingsScreen onBack={() => setView('COOP')} onReset={handleReset} dayCount={dayCount} isMuted={isMuted} toggleMute={() => setIsMuted(!isMuted)} onPrestige={handlePrestige} canPrestige={balance >= 5000} goldenEggsToGain={Math.floor(balance/5000)} onExportSave={handleExportSave} onImportSave={handleImportSave} />
            ) : view === 'RANKING' ? (
              <RankingScreen onBack={() => setView('COOP')} balance={balance} />
            ) : view === 'COMMUNITY' ? (
              <CommunityScreen onBack={() => setView('COOP')} onSimulateReferral={handleSimulateReferral} referralHistory={referralHistory} coopProgress={coopProgress} onContributeCoop={handleContributeCoop} onBuyAuction={handleBuyAuction} onSellAuction={handleSellAuction} chickens={chickens} balance={balance} maxCapacity={maxCapacity} auctionItems={auctionItems} />
            ) : view === 'PROFILE' ? (
              <ProfileScreen onBack={() => setView('COOP')} stats={stats} achievements={achievements} level={level} xp={xp} xpToNextLevel={level*100} goldenEggs={goldenEggs} />
            ) : view === 'WHEEL' ? (
              <WheelScreen onBack={() => setView('COOP')} onSpin={handleSpinReward} canSpin={canSpinWheel()} balance={balance} />
            ) : view === 'BANK' ? (
              <BankScreen onBack={() => setView('COOP')} balance={balance} setBalance={setBalance} bankBalance={bankBalance} setBankBalance={setBankBalance} />
            ) : view === 'CHASE' ? (
              <ChickenChaseScreen onBack={() => setView('COOP')} balance={balance} setBalance={setBalance} showToast={showToast} />
            ) : view === 'RINHA' ? (
              <CockfightScreen onBack={() => setView('COOP')} balance={balance} setBalance={setBalance} showToast={showToast} />
            ) : view === 'HARVEST' ? (
              <HarvestGameScreen onBack={() => setView('COOP')} balance={balance} setBalance={setBalance} showToast={showToast} chickens={chickens} />
            ) : (
              <WalletScreen onBack={() => setView('COOP')} balance={balance} setBalance={setBalance} showToast={showToast} addFloatingText={addFloatingText} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
