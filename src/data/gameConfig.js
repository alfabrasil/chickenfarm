// CONFIGURAÇÃO E DADOS GLOBAIS

export const TYPE_CONFIG = {
  GRANJA: { labelKey: "type_GRANJA_label", color: "bg-yellow-100", border: "border-yellow-500", label: "Granja Comum", icon: "🐓", feedConsumption: 1, collectChance: { common: 0.9, rare: 0.1, legendary: 0 } },
  CAIPIRA: { labelKey: "type_CAIPIRA_label", color: "bg-orange-100", border: "border-orange-600", label: "Caipira Raiz", icon: "🐔", feedConsumption: 1, collectChance: { common: 0.5, rare: 0.45, legendary: 0.05 } },
  GIGANTE: { labelKey: "type_GIGANTE_label", color: "bg-purple-100", border: "border-purple-600", label: "Galinha-Rex", icon: "🦖", feedConsumption: 2, collectChance: { common: 0.2, rare: 0.5, legendary: 0.3 } },
  griffin: { labelKey: "type_griffin_label", color: "bg-pink-100", border: "border-pink-500", label: "Grifo", icon: "🦄", feedConsumption: 1, collectChance: { common: 0.3, rare: 0.6, legendary: 0.1 } },
  IMPERIAL: { labelKey: "type_IMPERIAL_label", color: "bg-amber-100", border: "border-amber-500", label: "Imperial", icon: "👑", feedConsumption: 2, collectChance: { common: 0.1, rare: 0.4, legendary: 0.5 }, textColor: "text-amber-600" },
  DIVINA: { labelKey: "type_DIVINA_label", color: "bg-rose-100", border: "border-rose-500", label: "Divina", icon: "🔮", feedConsumption: 3, collectChance: { common: 0, rare: 0.1, legendary: 0.9 }, textColor: "text-rose-600" },
  alien: { labelKey: "type_alien_label", color: "bg-green-900", border: "border-green-400", label: "Alien", icon: "👽", feedConsumption: 0, collectChance: { common: 0, rare: 0.2, legendary: 0.8 }, textColor: "text-green-400" },
  robot:   { labelKey: "type_robot_label", color: "bg-slate-800", border: "border-cyan-400", label: "Robot", icon: "🤖", feedConsumption: 3, collectChance: { common: 0, rare: 0, legendary: 1.0 }, textColor: "text-cyan-300" }
};

export const SKINS_CONFIG = {
  DEFAULT: { id: 'DEFAULT', nameKey: "skin_DEFAULT_name", name: 'Campo Clássico', price: 0, groundFrom: 'from-green-800', groundTo: 'to-green-500', skyDay: 'from-sky-400', skyNight: 'from-slate-900' },
  DESERT:  { id: 'DESERT', nameKey: "skin_DESERT_name", name: 'Deserto Árido', price: 2000, groundFrom: 'from-orange-800', groundTo: 'to-amber-500', skyDay: 'from-orange-300', skyNight: 'from-slate-900' },
  SNOW:    { id: 'SNOW', nameKey: "skin_SNOW_name", name: 'Polo Norte', price: 3500, groundFrom: 'from-slate-300', groundTo: 'to-white', skyDay: 'from-blue-200', skyNight: 'from-slate-800' },
  CYBER:   { id: 'CYBER', nameKey: "skin_CYBER_name", name: 'Neo-Tokyo', price: 8000, groundFrom: 'from-purple-900', groundTo: 'to-fuchsia-900', skyDay: 'from-indigo-900', skyNight: 'from-black' },
};

export const BASE_PRICES = { EGG_COMMON: 10, EGG_RARE: 25, EGG_LEGENDARY: 100 };

export const MARKET_NEWS = [
  { id: 'NORMAL', titleKey: "news_NORMAL_title", descKey: "news_NORMAL_desc", title: 'Mercado Estável', desc: 'Preços seguem a média normal.', multiplier: 1.0, color: 'text-slate-600', icon: '📊' },
  { id: 'FESTIVAL', titleKey: "news_FESTIVAL_title", descKey: "news_FESTIVAL_desc", title: 'Festival do Omelete', desc: 'Alta demanda na cidade! Preços +50%!', multiplier: 1.5, color: 'text-green-600', icon: '🍳' },
  { id: 'SURPLUS', titleKey: "news_SURPLUS_title", descKey: "news_SURPLUS_desc", title: 'Superprodução', desc: 'Muitos ovos no mercado. Preços -20%.', multiplier: 0.8, color: 'text-red-500', icon: '📉' },
  { id: 'HEALTH', titleKey: "news_HEALTH_title", descKey: "news_HEALTH_desc", title: 'Vida Saudável', desc: 'Nutricionistas recomendam ovos. Preços +20%.', multiplier: 1.2, color: 'text-blue-600', icon: '💪' },
  { id: 'RAINY_LOGISTICS', titleKey: "news_RAINY_LOGISTICS_title", descKey: "news_RAINY_LOGISTICS_desc", title: 'Chuvas Fortes', desc: 'Dificuldade no transporte. Preços -10%.', multiplier: 0.9, color: 'text-slate-500', icon: '🌧️' },
  { id: 'CRASH', titleKey: "news_CRASH_title", descKey: "news_CRASH_desc", title: 'Colapso Aviário', desc: 'Rumores de gripe derrubam mercado. -40%.', multiplier: 0.6, color: 'text-red-700', icon: '📉' },
  { id: 'BOOM', titleKey: "news_BOOM_title", descKey: "news_BOOM_desc", title: 'Ovo de Ouro', desc: 'Investidores correm para ovos. +80%!', multiplier: 1.8, color: 'text-yellow-600', icon: '🚀' },
];

export const BREEDING_COST = 500;

export const MINIGAME_CONFIG = {
  SOLO_BET: 10,
  SOLO_REWARD_MULTIPLIER: 1.5, // 50% profit
  SOLO_ATTEMPTS: 6,
  PVP_BURN_FEE: 0.20, // 20% burned from loser's bet
  DOOR_COUNT: 12,
  HARVEST: {
    PASSIVES: {
      GRANJA: { labelKey: 'passive_GRANJA_label', descKey: 'passive_GRANJA_desc', label: 'Resistência', icon: '🛡️', desc: 'Imune a 1 Ovo Podre', bonus: 'SHIELD_ONCE' },
      CAIPIRA: { labelKey: 'passive_CAIPIRA_label', descKey: 'passive_CAIPIRA_desc', label: 'Instinto', icon: '🔍', desc: 'Detecta itens próximos', bonus: 'VISION' },
      GIGANTE: { labelKey: 'passive_GIGANTE_label', descKey: 'passive_GIGANTE_desc', label: 'Peso Pesado', icon: '💪', desc: 'Empurra oponente 2x mais longe', bonus: 'PUSH_FORCE' },
      IMPERIAL: { labelKey: 'passive_IMPERIAL_label', descKey: 'passive_IMPERIAL_desc', label: 'Majestade', icon: '👑', desc: 'Pontos de Ouro valem 3x', bonus: 'GOLD_BOOST', value: 3.0 },
      DIVINA: { labelKey: 'passive_DIVINA_label', descKey: 'passive_DIVINA_desc', label: 'Milagre', icon: '✨', desc: 'Começa com 100 pontos', bonus: 'START_POINTS', value: 100 },
      griffin: { labelKey: 'passive_griffin_label', descKey: 'passive_griffin_desc', label: 'Velocidade', icon: '⚡', desc: 'Velocidade base +10%', bonus: 'SPEED_BASE', value: 0.1 },
      alien: { labelKey: 'passive_alien_label', descKey: 'passive_alien_desc', label: 'Teletransporte', icon: '🌌', desc: 'Atravessa bordas do mapa', bonus: 'TELEPORT' },
      robot: { labelKey: 'passive_robot_label', descKey: 'passive_robot_desc', label: 'Overclock', icon: '🤖', desc: 'Power-ups duram 50% mais', bonus: 'BUFF_EXTEND', value: 0.5 }
    }
  }
};

export const RINHA_CONFIG = {
  ROOSTER_PRICE: 1000,
  SYSTEM_FEE: 0.10, // 10% fee (Player gets 1.8x on win)
  BATTLE_DURATION: 15000, // 15 seconds
  MIN_ROUNDS: 6,
  MAX_ROUNDS: 8,
  CONVERSION_RATE: 100, // $1 = 100 RC
  ELEMENTS: {
    FOGO: { id: 'FOGO', nameKey: "element_FOGO_name", name: 'Fogo', base: 100, icon: '🔥', color: 'text-red-500', glow: 'shadow-red-500/50' },
    TERRA: { id: 'TERRA', nameKey: "element_TERRA_name", name: 'Terra', base: 95, icon: '🌱', color: 'text-amber-700', glow: 'shadow-amber-700/50' },
    AGUA: { id: 'AGUA', nameKey: "element_AGUA_name", name: 'Água', base: 90, icon: '💧', color: 'text-blue-500', glow: 'shadow-blue-500/50' },
    AR: { id: 'AR', nameKey: "element_AR_name", name: 'Ar', base: 85, icon: '💨', color: 'text-slate-400', glow: 'shadow-slate-400/50' }
  },
  COLORS: {
    VERMELHO: { id: 'VERMELHO', nameKey: "color_VERMELHO_name", name: 'Vermelho', hex: '#ef4444', beats: 'AZUL', secondary: '#991b1b' },
    AZUL: { id: 'AZUL', nameKey: "color_AZUL_name", name: 'Azul', hex: '#3b82f6', beats: 'VERDE', secondary: '#1e40af' },
    VERDE: { id: 'VERDE', nameKey: "color_VERDE_name", name: 'Verde', hex: '#22c55e', beats: 'AMARELO', secondary: '#166534' },
    AMARELO: { id: 'AMARELO', nameKey: "color_AMARELO_name", name: 'Amarelo', hex: '#eab308', beats: 'VERMELHO', secondary: '#854d0e' }
  },
  ARENAS: [
    { id: 1, nameKey: "arena_1_name", descKey: "arena_1_desc", name: 'Arena de Terra', advantage: 'TERRA', bonus: 0.25, icon: '⛰️', desc: 'Favorece galos terrestres' },
    { id: 2, nameKey: "arena_2_name", descKey: "arena_2_desc", name: 'Arena Aquática', advantage: 'AGUA', bonus: 0.25, icon: '🌊', desc: 'Favorece galos aquáticos' },
    { id: 3, nameKey: "arena_3_name", descKey: "arena_3_desc", name: 'Arena Aérea', advantage: 'AR', bonus: 0.25, icon: '🌪️', desc: 'Favorece galos aéreos' },
    { id: 4, nameKey: "arena_4_name", descKey: "arena_4_desc", name: 'Arena Vulcânica', advantage: 'FOGO', bonus: 0.25, icon: '🌋', desc: 'Favorece galos de fogo' }
  ],
  OPPONENTS: [
    { id: 'op1', nameKey: "opponent_op1_name", name: 'Galo de Briga', element: 'FOGO', color: 'VERMELHO', avatar: '🐓' },
    { id: 'op2', nameKey: "opponent_op2_name", name: 'Galo d\'Oeste', element: 'TERRA', color: 'AMARELO', avatar: '🤠' },
    { id: 'op3', nameKey: "opponent_op3_name", name: 'Galo Tsunami', element: 'AGUA', color: 'AZUL', avatar: '🌊' },
    { id: 'op4', nameKey: "opponent_op4_name", name: 'Galo Furacão', element: 'AR', color: 'VERDE', avatar: '🌀' },
    { id: 'op5', nameKey: "opponent_op5_name", name: 'Galo Infernal', element: 'FOGO', color: 'AMARELO', avatar: '🔥' },
    { id: 'op6', nameKey: "opponent_op6_name", name: 'Galo de Pedra', element: 'TERRA', color: 'VERDE', avatar: '💎' },
  ]
};

export const ITEMS_CONFIG = {
  EGG_COMMON: { nameKey: "item_EGG_COMMON_name", name: 'Ovo Comum', basePrice: 10, icon: '🥚', color: 'text-slate-600' },
  EGG_RARE: { nameKey: "item_EGG_RARE_name", name: 'Ovo Raro', basePrice: 25, icon: '✨', color: 'text-orange-500' },
  EGG_LEGENDARY: { nameKey: "item_EGG_LEGENDARY_name", name: 'Ovo Lendário', basePrice: 100, icon: '🌟', color: 'text-yellow-500 animate-pulse' },
  FEED: { nameKey: "item_FEED_name", name: 'Saco de Ração', price: 20, quantity: 10, icon: '🌽' }, 
  VACCINE: { nameKey: "item_VACCINE_name", name: 'Vacina', price: 50, quantity: 1, icon: '💉' },
  EXPANSION: { nameKey: "item_EXPANSION_name", descKey: "item_EXPANSION_desc", name: 'Expansão de Cerca', price: 500, quantity: 4, icon: '🚧', desc: '+4 Vagas no Galinheiro' }
};

export const TECH_CONFIG = {
  NUTRIBOT: { id: 'NUTRIBOT', nameKey: "tech_NUTRIBOT_name", descKey: "tech_NUTRIBOT_desc", name: 'NutriBot 3000', price: 300, duration: 7, icon: '🤖', desc: 'Alimenta as galinhas automaticamente por 7 dias.', color: 'bg-blue-100 border-blue-400 text-blue-700' },
  CLEANSWEEP: { id: 'CLEANSWEEP', nameKey: "tech_CLEANSWEEP_name", descKey: "tech_CLEANSWEEP_desc", name: 'CleanSweep X', price: 450, duration: 7, icon: '🧹', desc: 'Remove sujeira automaticamente por 7 dias.', color: 'bg-green-100 border-green-400 text-green-700' }
};

export const UPGRADE_CONFIG = {
  FENCE: { id: 'FENCE', nameKey: "upg_FENCE_name", descKey: "upg_FENCE_desc", name: 'Cerca Elétrica', price: 1500, icon: '⚡', desc: 'Bloqueia 100% dos ataques da Raposa.', color: 'bg-yellow-100 border-yellow-400 text-yellow-700' },
  SILO: { id: 'SILO', nameKey: "upg_SILO_name", descKey: "upg_SILO_desc", name: 'Silo Grande', price: 800, icon: '🏭', desc: 'Aumenta capacidade de ração para 100.', color: 'bg-slate-100 border-slate-400 text-slate-700' },
  WASHER: { id: 'WASHER', nameKey: "upg_WASHER_name", descKey: "upg_WASHER_desc", name: 'Lavadora de Ovos', price: 2000, icon: '✨', desc: '+10% no valor de venda dos ovos.', color: 'bg-cyan-100 border-cyan-400 text-cyan-700' },
  PACKER: { id: 'PACKER', nameKey: "upg_PACKER_name", descKey: "upg_PACKER_desc", name: 'Embaladora Auto', price: 3500, icon: '📦', desc: '+15% no valor (Acumula com Lavadora).', color: 'bg-indigo-100 border-indigo-400 text-indigo-700' },
  CLIMATE: { id: 'CLIMATE', nameKey: "upg_CLIMATE_name", descKey: "upg_CLIMATE_desc", name: 'Climatizador', price: 2500, icon: '❄️', desc: 'Previne doenças causadas pela chuva.', color: 'bg-teal-100 border-teal-400 text-teal-700' },
  LAB: { id: 'LAB', nameKey: "upg_LAB_name", descKey: "upg_LAB_desc", name: 'Laboratório Genético', price: 5000, icon: '🧬', desc: 'Permite cruzar galinhas e criar mutações.', color: 'bg-pink-100 border-pink-400 text-pink-700' }
};

export const STORE_ANIMALS = [
  { type: 'GRANJA', nameKey: "animal_GRANJA_name", descKey: "animal_GRANJA_desc", name: 'Galinha de Granja', priceCoins: 50, desc: 'Já vem adulta! Produção imediata.', minLevel: 1 },
  { type: 'CAIPIRA', nameKey: "animal_CAIPIRA_name", descKey: "animal_CAIPIRA_desc", name: 'Galinha Caipira', priceCoins: 250, desc: 'Alta chance de ovos raros.', minLevel: 3 },
  { type: 'GIGANTE', nameKey: "animal_GIGANTE_name", descKey: "animal_GIGANTE_desc", name: 'Galinha Gigante', priceCoins: 1000, desc: 'A rainha! Ovos dourados.', minLevel: 5 },
  { type: 'IMPERIAL', nameKey: "animal_IMPERIAL_name", descKey: "animal_IMPERIAL_desc", name: 'Galinha Imperial', priceCoins: 5000, desc: 'A realeza do galinheiro.', minLevel: 7 },
  { type: 'DIVINA', nameKey: "animal_DIVINA_name", descKey: "animal_DIVINA_desc", name: 'Galinha Divina', priceCoins: 10000, desc: 'Poder místico ancestral.', minLevel: 10 }
];

export const AUCTION_MOCK_INITIAL = [
  { id: 'auc1', seller: 'FazendaX', type: 'GIGANTE', age: 12, price: 850, expiresKey: 'auction_expires_h', expiresVal: 2 },
  { id: 'auc2', seller: 'ReiDoOvo', type: 'CAIPIRA', age: 45, price: 300, expiresKey: 'auction_expires_h', expiresVal: 5 },
  { id: 'auc3', seller: 'MariaFarm', type: 'GIGANTE', age: 5, price: 900, expiresKey: 'auction_expires_m', expiresVal: 30 },
];

export const LEADERBOARD_MOCK = [
  { id: 'p1', name: 'ReiDoOvo', avatar: '👑', coins: 50000, harvestRating: 2100 },
  { id: 'p2', name: 'CryptoFarmer', avatar: '', coins: 42000, harvestRating: 1950 },
  { id: 'p3', name: 'FazendeiroTop', avatar: '👨‍🌾', coins: 38000, harvestRating: 1800 },
  { id: 'p4', name: 'NoobMaster', avatar: '', coins: 25000, harvestRating: 1700 },
  { id: 'p5', name: 'RichDuck', avatar: '🦆', coins: 150000, harvestRating: 1650 },
  { id: 'p6', name: 'LuckyHen', avatar: '', coins: 12000, harvestRating: 1600 },
  { id: 'p7', name: 'EggHunter', avatar: '🏹', coins: 8000, harvestRating: 1550 },
  { id: 'p8', name: 'CluckCluck', avatar: '', coins: 7500, harvestRating: 1500 },
  { id: 'p9', name: 'FarmerJohn', avatar: '🚜', coins: 6800, harvestRating: 1450 },
  { id: 'p10', name: 'ZenChicken', avatar: '', coins: 5000, harvestRating: 1400 },
];

export const REFERRAL_LEVELS = [
  { level: 1, percent: 0.10, labelKey: 'referral_level_1' },
  { level: 2, percent: 0.05, labelKey: 'referral_level_2' },
  { level: 3, percent: 0.02, labelKey: 'referral_level_3' },
  { level: 4, percent: 0.02, labelKey: 'referral_level_4' },
  { level: 5, percent: 0.01, labelKey: 'referral_level_5' },
];

export const QUEST_POOL = [
  { id: 'feed_3', type: 'FEED', target: 3, descKey: "quest_feed_3_desc", desc: 'Alimentar 3 vezes', reward: 15 },
  { id: 'feed_5', type: 'FEED', target: 5, descKey: "quest_feed_5_desc", desc: 'Alimentar 5 vezes', reward: 30 },
  { id: 'collect_common', type: 'COLLECT_COMMON', target: 3, descKey: "quest_collect_common_desc", desc: 'Coletar 3 Ovos Comuns', reward: 20 },
  { id: 'collect_rare', type: 'COLLECT_RARE', target: 1, descKey: "quest_collect_rare_desc", desc: 'Coletar 1 Ovo Raro', reward: 50 },
  { id: 'clean_poop', type: 'CLEAN', target: 2, descKey: "quest_clean_poop_desc", desc: 'Limpar 2 sujeiras', reward: 25 },
  { id: 'buy_supply', type: 'BUY_ITEM', target: 1, descKey: "quest_buy_supply_desc", desc: 'Comprar suprimentos', reward: 10 },
];

export const ACHIEVEMENTS_LIST = [
  { id: 'FIRST_EGG', titleKey: "achievement_FIRST_EGG_title", descKey: "achievement_FIRST_EGG_desc", title: 'Primeiros Passos', desc: 'Colete seu primeiro ovo.', reward: 50, icon: '🥚', condition: (stats) => stats.total_eggs >= 1 },
  { id: 'EGG_MASTER_1', titleKey: "achievement_EGG_MASTER_1_title", descKey: "achievement_EGG_MASTER_1_desc", title: 'Oveiro Iniciante', desc: 'Colete 50 ovos no total.', reward: 200, icon: '🧺', condition: (stats) => stats.total_eggs >= 50 },
  { id: 'RICH_FARMER', titleKey: "achievement_RICH_FARMER_title", descKey: "achievement_RICH_FARMER_desc", title: 'Primeiro Milhão', desc: 'Acumule 1.000 moedas ganhas.', reward: 500, icon: '💰', condition: (stats) => stats.total_earned >= 1000 },
  { id: 'CLEAN_FREAK', titleKey: "achievement_CLEAN_FREAK_title", descKey: "achievement_CLEAN_FREAK_desc", title: 'Faxineiro', desc: 'Limpe 10 sujeiras.', reward: 100, icon: '🧹', condition: (stats) => stats.total_cleaned >= 10 },
  { id: 'VETERINARIAN', titleKey: "achievement_VETERINARIAN_title", descKey: "achievement_VETERINARIAN_desc", title: 'Veterinário', desc: 'Cure 5 galinhas doentes.', reward: 150, icon: '💉', condition: (stats) => stats.total_healed >= 5 },
  { id: 'DEDICATED', titleKey: "achievement_DEDICATED_title", descKey: "achievement_DEDICATED_desc", title: 'Dedicado', desc: 'Jogue por 7 dias (no jogo).', reward: 300, icon: '📅', condition: (stats) => stats.days_played >= 7 },
  { id: 'LEGENDARY_FIND', titleKey: "achievement_LEGENDARY_FIND_title", descKey: "achievement_LEGENDARY_FIND_desc", title: 'Sorte Grande', desc: 'Encontre 1 Ovo Lendário.', reward: 1000, icon: '🌟', condition: (stats) => stats.legendary_eggs >= 1 },
];

export const WHEEL_PRIZES = [
  { id: 'coin_50', labelKey: "wheel_coin_50_label", label: '50 Moedas', type: 'COIN', val: 50, color: '#fbbf24' },
  { id: 'feed_5', labelKey: "wheel_feed_5_label", label: '5 Rações', type: 'ITEM', item: 'feed', val: 5, color: '#3b82f6' },
  { id: 'coin_200', labelKey: "wheel_coin_200_label", label: '200 Moedas', type: 'COIN', val: 200, color: '#fbbf24' },
  { id: 'egg_common', labelKey: "wheel_egg_common_label", label: '2 Ovos', type: 'ITEM', item: 'eggs_common', val: 2, color: '#94a3b8' },
  { id: 'coin_10', labelKey: "wheel_coin_10_label", label: '10 Moedas', type: 'COIN', val: 10, color: '#fbbf24' },
  { id: 'vaccine_1', labelKey: "wheel_vaccine_1_label", label: '1 Vacina', type: 'ITEM', item: 'vaccine', val: 1, color: '#ef4444' },
  { id: 'jackpot', labelKey: "wheel_jackpot_label", label: 'JACKPOT!', type: 'COIN', val: 1000, color: '#8b5cf6', special: true },
  { id: 'egg_rare', labelKey: "wheel_egg_rare_label", label: 'Ovo Raro', type: 'ITEM', item: 'eggs_rare', val: 1, color: '#f97316' },
];
