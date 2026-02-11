import { MUTATION_SETS, ADDONS_CONFIG } from '../data/mutationConfig';

/**
 * Helper para obter o caminho completo do sprite
 * Agora busca os assets da pasta public
 */
const getSpritePath = (category, filename) => {
  // Retorna o caminho absoluto relativo à raiz do site (public folder)
  return `/assets/sprites/${category}/${filename}`;
};

/**
 * Resolve os assets visuais da galinha com base em seu estado e tipo
 * @param {Object} chicken - Objeto da galinha
 * @param {number} dayCount - Dia atual do jogo (para calcular fome)
 * @returns {Object} Objeto contendo as URLs das camadas (legs, wings, body, etc.)
 */
export const getChickenAssets = (chicken, dayCount, overrideStatus = null) => {
  const { type, subtype, equippedAddons, is_sick, last_fed_day, is_sleeping } = chicken;
  
  // Determina status
  const isHungry = last_fed_day < dayCount;
  let status = 'happy'; 

  // Prioridade para override (expressões dinâmicas: greedy, angry, etc)
  if (overrideStatus) {
    status = overrideStatus;
  } 
  // Status base (se não houver override)
  else {
    if (is_sick) {
      status = 'sick';
    } else if (is_sleeping) {
      status = 'sleeping';
    } else if (isHungry) {
      status = 'hungry';
    }
  }

  // --- 1. BODY ---
  let bodyFile = 'body_std.svg';
  if (type === 'griffin') bodyFile = 'body_h_griffin.svg';
  else if (type === 'alien') bodyFile = 'body_h_alien.svg';
  else if (type === 'robot') bodyFile = 'body_h_robot.svg';
  else if (type === 'DIVINA') bodyFile = 'body_divine.svg';
  else if (type === 'IMPERIAL') bodyFile = 'body_fluffy.svg'; // Imperial usa fluffy
  else if (type === 'CAIPIRA') bodyFile = 'body_rustic.svg'; 
  else if (type === 'GIGANTE') bodyFile = 'body_strong.svg';
  // GRANJA usa body_std (padrão)
  
  // --- 2. LEGS & WINGS (Lógica de Mutações) ---
  let legsFile = 'legs_std.svg';
  let wingsFile = 'wings_std.svg';

  // Verifica se existe um conjunto de mutação específico para este tipo e subtipo
  if (subtype && MUTATION_SETS[type] && MUTATION_SETS[type][subtype]) {
    const mutation = MUTATION_SETS[type][subtype];
    legsFile = mutation.legs;
    wingsFile = mutation.wings;
  } else {
    // Fallback para tipos padrão ou se subtipo não existir
    if (type === 'DIVINA') { legsFile = 'legs_divine.svg'; wingsFile = 'wings_divine.svg'; }
    else if (type === 'IMPERIAL') { legsFile = 'legs_fluffy.svg'; wingsFile = 'wings_fluffy.svg'; }
    else if (type === 'GIGANTE') { legsFile = 'legs_strong.svg'; wingsFile = 'wings_strong.svg'; }
    else if (type === 'CAIPIRA') { legsFile = 'legs_rustic.svg'; wingsFile = 'wings_rustic.svg'; }
    
    // Fallback para tipos especiais sem subtipo definido (retrocompatibilidade)
    else if (type === 'griffin') { legsFile = 'legs_h_griffin_lion.svg'; wingsFile = 'wings_h_griffin.svg'; }
    else if (type === 'alien') { legsFile = 'legs_alien_tentacles.svg'; wingsFile = 'wings_alien_slime.svg'; }
    else if (type === 'robot') { legsFile = 'legs_h_robot_heavy.svg'; wingsFile = 'wings_h_robot_gears.svg'; }
  }

  // --- 4. EYES ---
  let eyeType = 'bio';
  if (type === 'robot') eyeType = 'robot';
  else if (type === 'alien') eyeType = 'alien';
  
  const eyesFile = `eyes_${eyeType}_${status}.svg`;

  // --- 5. ADDONS (HEAD & BODY) ---
  // Sistema dinâmico de Addons
  let addonBodyFile = null;
  let addonHeadFile = null;

  if (equippedAddons && Array.isArray(equippedAddons)) {
    // Busca configurações de addons para este tipo
    const config = ADDONS_CONFIG[type];
    if (config) {
      // Procura addon equipado para BODY
      const bodyAddonId = equippedAddons.find(id => config.BODY.some(item => item.id === id));
      if (bodyAddonId) {
        const item = config.BODY.find(i => i.id === bodyAddonId);
        if (item) addonBodyFile = item.file;
      }

      // Procura addon equipado para HEAD
      const headAddonId = equippedAddons.find(id => config.HEAD.some(item => item.id === id));
      if (headAddonId) {
        const item = config.HEAD.find(i => i.id === headAddonId);
        if (item) addonHeadFile = item.file;
      }
    }
  } else {
    // Fallback Legado (apenas se não houver sistema de addons inicializado)
    if (type === 'robot') {
       // Opcional: Manter ou remover padrões forçados. 
       // Removendo para forçar uso do sistema "smart", ou manter para compatibilidade visual imediata
       // Decisão: Manter compatibilidade visual básica se não tiver array
       addonBodyFile = 'addon_robot_body_battery_pack.svg';
       addonHeadFile = 'addon_robot_head_antenna_blue.svg';
    } else if (type === 'alien') {
       addonHeadFile = 'addon_alien_head_alien_antenna.svg';
    }
  }

  // --- 6. FX ---
  let fxFile = null;
  if (is_sick) fxFile = 'fx_status_stink.svg';
  else if (is_sleeping) fxFile = 'fx_status_sleep.svg';

  return {
    legs: getSpritePath('legs', legsFile),
    wings: getSpritePath('wings', wingsFile),
    body: getSpritePath('bodies', bodyFile),
    addonBody: addonBodyFile ? getSpritePath('addon', addonBodyFile) : null,
    eyes: getSpritePath('eyes', eyesFile),
    addonHead: addonHeadFile ? getSpritePath('addon', addonHeadFile) : null,
    fx: fxFile ? getSpritePath('fx', fxFile) : null
  };
};
