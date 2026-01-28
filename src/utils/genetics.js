/**
 * Lógica de Genética e Cruzamento
 */

export const calculateBreedingResult = (parent1Type, parent2Type) => {
  // Rola o dado do destino (0.0 a 1.0)
  const roll = Math.random();
  let newType = 'GRANJA'; // Fallback

  // 1. Mutações Especiais (Prioridade Máxima)
  if (roll < 0.05) {
    newType = 'MUTANTE'; // 5% chance de Mutante Puro (Global)
  } 
  // 2. Herança Cyber (Se um dos pais for Cyber)
  else if (roll < 0.10 && (parent1Type === 'CYBER' || parent2Type === 'CYBER')) {
    newType = 'CYBER'; // 5% chance extra se tiver pai Cyber
  } 
  // 3. Hibridismo (Se pais forem de espécies diferentes)
  else if (parent1Type !== parent2Type && roll < 0.40) {
    newType = 'HIBRIDA'; // ~30-35% chance de Híbrida
  } 
  // 4. Herança Mendeliania Simples (50/50)
  else {
    newType = Math.random() > 0.5 ? parent1Type : parent2Type;
  }

  return { newType, roll };
};
