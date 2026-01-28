// CONFIGURAÇÃO E DADOS GLOBAIS

export const TYPE_CONFIG = {
  GRANJA: { color: "bg-yellow-100", border: "border-yellow-500", label: "Granja Comum", icon: "🐓", feedConsumption: 1, collectChance: { common: 0.9, rare: 0.1, legendary: 0 } },
  CAIPIRA: { color: "bg-orange-100", border: "border-orange-600", label: "Caipira Raiz", icon: "🐔", feedConsumption: 1, collectChance: { common: 0.5, rare: 0.45, legendary: 0.05 } },
  GIGANTE: { color: "bg-purple-100", border: "border-purple-600", label: "Galinha-Rex", icon: "🦖", feedConsumption: 2, collectChance: { common: 0.2, rare: 0.5, legendary: 0.3 } },
  HIBRIDA: { color: "bg-pink-100", border: "border-pink-500", label: "Unicórnio Ágil", icon: "🦄", feedConsumption: 1, collectChance: { common: 0.3, rare: 0.6, legendary: 0.1 } },
  MUTANTE: { color: "bg-green-900", border: "border-green-400", label: "ET Bilu", icon: "👽", feedConsumption: 0, collectChance: { common: 0, rare: 0.2, legendary: 0.8 }, textColor: "text-green-400" },
  CYBER:   { color: "bg-slate-800", border: "border-cyan-400", label: "Robo-Chicken", icon: "🤖", feedConsumption: 3, collectChance: { common: 0, rare: 0, legendary: 1.0 }, textColor: "text-cyan-300" }
};

export const SKINS_CONFIG = {
  DEFAULT: { id: 'DEFAULT', name: 'Campo Clássico', price: 0, groundFrom: 'from-green-800', groundTo: 'to-green-500', skyDay: 'from-sky-400', skyNight: 'from-slate-900' },
  DESERT:  { id: 'DESERT', name: 'Deserto Árido', price: 2000, groundFrom: 'from-orange-800', groundTo: 'to-amber-500', skyDay: 'from-orange-300', skyNight: 'from-slate-900' },
  SNOW:    { id: 'SNOW', name: 'Polo Norte', price: 3500, groundFrom: 'from-slate-300', groundTo: 'to-white', skyDay: 'from-blue-200', skyNight: 'from-slate-800' },
  CYBER:   { id: 'CYBER', name: 'Neo-Tokyo', price: 8000, groundFrom: 'from-purple-900', groundTo: 'to-fuchsia-900', skyDay: 'from-indigo-900', skyNight: 'from-black' },
};

export const BASE_PRICES = { EGG_COMMON: 10, EGG_RARE: 25, EGG_LEGENDARY: 100 };

export const MARKET_NEWS = [
  { id: 'NORMAL', title: 'Mercado Estável', desc: 'Preços seguem a média normal.', multiplier: 1.0, color: 'text-slate-600', icon: '📊' },
  { id: 'FESTIVAL', title: 'Festival do Omelete', desc: 'Alta demanda na cidade! Preços +50%!', multiplier: 1.5, color: 'text-green-600', icon: '🍳' },
  { id: 'SURPLUS', title: 'Superprodução', desc: 'Muitos ovos no mercado. Preços -20%.', multiplier: 0.8, color: 'text-red-500', icon: '📉' },
  { id: 'HEALTH', title: 'Vida Saudável', desc: 'Nutricionistas recomendam ovos. Preços +20%.', multiplier: 1.2, color: 'text-blue-600', icon: '💪' },
  { id: 'RAINY_LOGISTICS', title: 'Chuvas Fortes', desc: 'Dificuldade no transporte. Preços -10%.', multiplier: 0.9, color: 'text-slate-500', icon: '🌧️' },
  { id: 'CRASH', title: 'Colapso Aviário', desc: 'Rumores de gripe derrubam mercado. -40%.', multiplier: 0.6, color: 'text-red-700', icon: '📉' },
  { id: 'BOOM', title: 'Ovo de Ouro', desc: 'Investidores correm para ovos. +80%!', multiplier: 1.8, color: 'text-yellow-600', icon: '🚀' },
];

export const BREEDING_COST = 500;

export const MINIGAME_CONFIG = {
  SOLO_BET: 10,
  SOLO_REWARD_MULTIPLIER: 1.5, // 50% profit
  SOLO_ATTEMPTS: 6,
  PVP_BURN_FEE: 0.20, // 20% burned from loser's bet
  DOOR_COUNT: 12
};

export const RINHA_CONFIG = {
  ROOSTER_PRICE: 1000,
  SYSTEM_FEE: 0.10, // 10% fee (Player gets 100% bet + 80% of opponent)
  ELEMENTS: {
    FOGO: { id: 'FOGO', name: 'Fogo', base: 100, icon: '🔥', color: 'text-red-500' },
    TERRA: { id: 'TERRA', name: 'Terra', base: 95, icon: '🌱', color: 'text-amber-700' },
    AGUA: { id: 'AGUA', name: 'Água', base: 90, icon: '💧', color: 'text-blue-500' },
    AR: { id: 'AR', name: 'Ar', base: 85, icon: '💨', color: 'text-slate-400' }
  },
  COLORS: {
    VERMELHO: { id: 'VERMELHO', name: 'Vermelho', hex: '#ef4444', beats: 'AZUL' },
    AZUL: { id: 'AZUL', name: 'Azul', hex: '#3b82f6', beats: 'VERDE' },
    VERDE: { id: 'VERDE', name: 'Verde', hex: '#22c55e', beats: 'AMARELO' },
    AMARELO: { id: 'AMARELO', name: 'Amarelo', hex: '#eab308', beats: 'VERMELHO' }
  },
  ARENAS: [
    { id: 1, name: 'Arena de Terra', advantage: 'TERRA', bonus: 0.25, icon: '⛰️', desc: 'Favorece galos terrestres' },
    { id: 2, name: 'Arena Aquática', advantage: 'AGUA', bonus: 0.25, icon: '🌊', desc: 'Favorece galos aquáticos' },
    { id: 3, name: 'Arena Aérea', advantage: 'AR', bonus: 0.25, icon: '🌪️', desc: 'Favorece galos aéreos' },
    { id: 4, name: 'Arena Vulcânica', advantage: 'FOGO', bonus: 0.25, icon: '🌋', desc: 'Favorece galos de fogo' }
  ],
  OPPONENTS: [
    { id: 'op1', name: 'Galo de Briga', element: 'FOGO', color: 'VERMELHO', avatar: '🐓' },
    { id: 'op2', name: 'Galo d\'Oeste', element: 'TERRA', color: 'AMARELO', avatar: '🤠' },
    { id: 'op3', name: 'Galo Tsunami', element: 'AGUA', color: 'AZUL', avatar: '🌊' },
    { id: 'op4', name: 'Galo Furacão', element: 'AR', color: 'VERDE', avatar: '🌀' },
    { id: 'op5', name: 'Galo Infernal', element: 'FOGO', color: 'AMARELO', avatar: '🔥' },
    { id: 'op6', name: 'Galo de Pedra', element: 'TERRA', color: 'VERDE', avatar: '💎' },
  ]
};

export const ITEMS_CONFIG = {
  EGG_COMMON: { name: 'Ovo Comum', basePrice: 10, icon: '🥚', color: 'text-slate-600' },
  EGG_RARE: { name: 'Ovo Raro', basePrice: 25, icon: '✨', color: 'text-orange-500' },
  EGG_LEGENDARY: { name: 'Ovo Lendário', basePrice: 100, icon: '🌟', color: 'text-yellow-500 animate-pulse' },
  FEED: { name: 'Saco de Ração', price: 20, quantity: 10, icon: '🌽' }, 
  VACCINE: { name: 'Vacina', price: 50, quantity: 1, icon: '💉' },
  EXPANSION: { name: 'Expansão de Cerca', price: 500, quantity: 4, icon: '🚧', desc: '+4 Vagas no Galinheiro' }
};

export const TECH_CONFIG = {
  NUTRIBOT: { id: 'NUTRIBOT', name: 'NutriBot 3000', price: 300, duration: 7, icon: '🤖', desc: 'Alimenta as galinhas automaticamente por 7 dias.', color: 'bg-blue-100 border-blue-400 text-blue-700' },
  CLEANSWEEP: { id: 'CLEANSWEEP', name: 'CleanSweep X', price: 450, duration: 7, icon: '🧹', desc: 'Remove sujeira automaticamente por 7 dias.', color: 'bg-green-100 border-green-400 text-green-700' }
};

export const UPGRADE_CONFIG = {
  FENCE: { id: 'FENCE', name: 'Cerca Elétrica', price: 1500, icon: '⚡', desc: 'Bloqueia 100% dos ataques da Raposa.', color: 'bg-yellow-100 border-yellow-400 text-yellow-700' },
  SILO: { id: 'SILO', name: 'Silo Grande', price: 800, icon: '🏭', desc: 'Aumenta capacidade de ração para 100.', color: 'bg-slate-100 border-slate-400 text-slate-700' },
  WASHER: { id: 'WASHER', name: 'Lavadora de Ovos', price: 2000, icon: '✨', desc: '+10% no valor de venda dos ovos.', color: 'bg-cyan-100 border-cyan-400 text-cyan-700' },
  PACKER: { id: 'PACKER', name: 'Embaladora Auto', price: 3500, icon: '📦', desc: '+15% no valor (Acumula com Lavadora).', color: 'bg-indigo-100 border-indigo-400 text-indigo-700' },
  CLIMATE: { id: 'CLIMATE', name: 'Climatizador', price: 2500, icon: '❄️', desc: 'Previne doenças causadas pela chuva.', color: 'bg-teal-100 border-teal-400 text-teal-700' },
  LAB: { id: 'LAB', name: 'Laboratório Genético', price: 5000, icon: '🧬', desc: 'Permite cruzar galinhas e criar mutações.', color: 'bg-pink-100 border-pink-400 text-pink-700' }
};

export const STORE_ANIMALS = [
  { type: 'GRANJA', name: 'Galinha de Granja', priceCoins: 50, desc: 'Já vem adulta! Produção imediata.', minLevel: 1 },
  { type: 'CAIPIRA', name: 'Galinha Caipira', priceCoins: 250, desc: 'Alta chance de ovos raros.', minLevel: 3 },
  { type: 'GIGANTE', name: 'Galinha Gigante', priceCoins: 1000, desc: 'A rainha! Ovos dourados.', minLevel: 5 }
];

export const AUCTION_MOCK_INITIAL = [
  { id: 'auc1', seller: 'FazendaX', type: 'GIGANTE', age: 12, price: 850, expires: '2h' },
  { id: 'auc2', seller: 'ReiDoOvo', type: 'CAIPIRA', age: 45, price: 300, expires: '5h' },
  { id: 'auc3', seller: 'MariaFarm', type: 'GIGANTE', age: 5, price: 900, expires: '30m' },
];

export const LEADERBOARD_MOCK = [
  { id: 'top1', name: 'ReiDoOvo', coins: 950000, avatar: '👑' },
  { id: 'top2', name: 'FazendaX', coins: 540000, avatar: '🚜' },
  { id: 'top3', name: 'CryptoChicken', coins: 210000, avatar: '🚀' },
  { id: 'top4', name: 'MariaFarm', coins: 150000, avatar: '👩‍🌾' },
  { id: 'top5', name: 'João33', coins: 88000, avatar: '🤠' },
];

export const REFERRAL_LEVELS = [
  { level: 1, percent: 0.10, label: '1º Nível (Direto)' },
  { level: 2, percent: 0.05, label: '2º Nível' },
  { level: 3, percent: 0.02, label: '3º Nível' },
  { level: 4, percent: 0.02, label: '4º Nível' },
  { level: 5, percent: 0.01, label: '5º Nível' },
];

export const QUEST_POOL = [
  { id: 'feed_3', type: 'FEED', target: 3, desc: 'Alimentar 3 vezes', reward: 15 },
  { id: 'feed_5', type: 'FEED', target: 5, desc: 'Alimentar 5 vezes', reward: 30 },
  { id: 'collect_common', type: 'COLLECT_COMMON', target: 3, desc: 'Coletar 3 Ovos Comuns', reward: 20 },
  { id: 'collect_rare', type: 'COLLECT_RARE', target: 1, desc: 'Coletar 1 Ovo Raro', reward: 50 },
  { id: 'clean_poop', type: 'CLEAN', target: 2, desc: 'Limpar 2 sujeiras', reward: 25 },
  { id: 'buy_supply', type: 'BUY_ITEM', target: 1, desc: 'Comprar suprimentos', reward: 10 },
];

export const ACHIEVEMENTS_LIST = [
  { id: 'FIRST_EGG', title: 'Primeiros Passos', desc: 'Colete seu primeiro ovo.', reward: 50, icon: '🥚', condition: (stats) => stats.total_eggs >= 1 },
  { id: 'EGG_MASTER_1', title: 'Oveiro Iniciante', desc: 'Colete 50 ovos no total.', reward: 200, icon: '🧺', condition: (stats) => stats.total_eggs >= 50 },
  { id: 'RICH_FARMER', title: 'Primeiro Milhão', desc: 'Acumule 1.000 moedas ganhas.', reward: 500, icon: '💰', condition: (stats) => stats.total_earned >= 1000 },
  { id: 'CLEAN_FREAK', title: 'Faxineiro', desc: 'Limpe 10 sujeiras.', reward: 100, icon: '🧹', condition: (stats) => stats.total_cleaned >= 10 },
  { id: 'VETERINARIAN', title: 'Veterinário', desc: 'Cure 5 galinhas doentes.', reward: 150, icon: '💉', condition: (stats) => stats.total_healed >= 5 },
  { id: 'DEDICATED', title: 'Dedicado', desc: 'Jogue por 7 dias (no jogo).', reward: 300, icon: '📅', condition: (stats) => stats.days_played >= 7 },
  { id: 'LEGENDARY_FIND', title: 'Sorte Grande', desc: 'Encontre 1 Ovo Lendário.', reward: 1000, icon: '🌟', condition: (stats) => stats.legendary_eggs >= 1 },
];

export const WHEEL_PRIZES = [
  { id: 'coin_50', label: '50 Moedas', type: 'COIN', val: 50, color: '#fbbf24' },
  { id: 'feed_5', label: '5 Rações', type: 'ITEM', item: 'feed', val: 5, color: '#3b82f6' },
  { id: 'coin_200', label: '200 Moedas', type: 'COIN', val: 200, color: '#fbbf24' },
  { id: 'egg_common', label: '2 Ovos', type: 'ITEM', item: 'eggs_common', val: 2, color: '#94a3b8' },
  { id: 'coin_10', label: '10 Moedas', type: 'COIN', val: 10, color: '#fbbf24' },
  { id: 'vaccine_1', label: '1 Vacina', type: 'ITEM', item: 'vaccine', val: 1, color: '#ef4444' },
  { id: 'jackpot', label: 'JACKPOT!', type: 'COIN', val: 1000, color: '#8b5cf6', special: true },
  { id: 'egg_rare', label: 'Ovo Raro', type: 'ITEM', item: 'eggs_rare', val: 1, color: '#f97316' },
];
