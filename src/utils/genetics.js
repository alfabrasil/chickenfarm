/**
 * Lógica de Genética e Cruzamento
 */

import { MUTATION_SETS } from '../data/mutationConfig';

export const calculateBreedingResult = (parent1Type, parent2Type) => {
  // Rola o dado do destino (0.0 a 1.0)
  const roll = Math.random();
  let newType = 'GRANJA'; // Fallback
  let subtype = null;

  // 0. Mítico / Divino (Extremamente Raro: 1%)
  // "Divine" form
  if (roll < 0.01) {
    newType = 'DIVINA';
  }
  // 1. Mutações Especiais (Prioridade Alta)
  // "Alien" e "Robot" forms
  else if (roll < 0.12) {
    // 12% de chance de uma mutação espontânea
    // 50% chance de ser Alien (Mutante), 50% Robot (Cyber)
    newType = Math.random() > 0.5 ? 'alien' : 'robot';
  } 
  // 2. Herança Cyber (Se um dos pais for Cyber/Robot)
  else if (roll < 0.25 && (parent1Type === 'robot' || parent2Type === 'robot')) {
    newType = 'robot'; // Aumenta chance de Robot
  } 
  // 3. Hibridismo (Se pais forem de espécies diferentes)
  // "Griffin" / "Winged" forms
  else if (parent1Type !== parent2Type && roll < 0.60) {
    newType = 'griffin'; // ~35% chance de Híbrida (Grifo)
  } 
  // 4. Herança Mendeliania Simples (50/50)
  else {
    newType = Math.random() > 0.5 ? parent1Type : parent2Type;
  }

  // Se o novo tipo tem subtipos definidos, sorteia um
  if (MUTATION_SETS[newType]) {
    const subtypes = Object.keys(MUTATION_SETS[newType]);
    subtype = subtypes[Math.floor(Math.random() * subtypes.length)];
  }

  return { newType, subtype, roll };
};
