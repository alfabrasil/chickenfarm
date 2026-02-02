import { RINHA_CONFIG } from '../data/gameConfig';
import { v4 as uuidv4 } from 'uuid';

/**
 * RinhaEngine - Simulação de Backend (Fase 1)
 * Engenharia Avançada para processamento atômico de batalhas e economia.
 */
class RinhaEngine {
  constructor() {
    this.STORAGE_KEY_USER = 'farm_user_data';
    this.STORAGE_KEY_MATCHES = 'farm_matches_history';
  }

  // --- PRIVATE UTILS ---

  _getUser() {
    const data = localStorage.getItem(this.STORAGE_KEY_USER);
    if (!data) {
      // Inicializa usuário se não existir
      const newUser = {
        id: uuidv4(),
        username: 'Player',
        balance: 1000,
        created_at: new Date().toISOString()
      };
      this._saveUser(newUser);
      return newUser;
    }
    return JSON.parse(data);
  }

  _saveUser(user) {
    localStorage.setItem(this.STORAGE_KEY_USER, JSON.stringify(user));
  }

  _getMatches() {
    const data = localStorage.getItem(this.STORAGE_KEY_MATCHES);
    return data ? JSON.parse(data) : [];
  }

  _saveMatch(match) {
    const matches = this._getMatches();
    matches.unshift(match);
    localStorage.setItem(this.STORAGE_KEY_MATCHES, JSON.stringify(matches.slice(0, 50))); // Mantém as últimas 50
  }

  _checkColorWin(colorA, colorB) {
    const wins = {
      'VERMELHO': 'AZUL',
      'AZUL': 'VERDE',
      'VERDE': 'AMARELO',
      'AMARELO': 'VERMELHO'
    };
    return wins[colorA] === colorB;
  }

  _calculateScore(element, color, arena, opponentColor) {
    const baseStrength = RINHA_CONFIG.ELEMENTS[element].base;
    let score = baseStrength;

    // Arena Buff (1.25x)
    if (RINHA_CONFIG.ARENAS.find(a => a.id === arena.id).advantage === element) {
      score *= 1.25;
    }

    // Color Buff (1.30x)
    if (this._checkColorWin(color, opponentColor)) {
      score *= 1.30;
    }

    return Math.round(score);
  }

  // --- PUBLIC API (SIMULATED) ---

  async getProfile() {
    // Simula latência de rede
    await new Promise(r => setTimeout(r, 300));
    return this._getUser();
  }

  async getHistory(limit = 20) {
    await new Promise(r => setTimeout(r, 300));
    return this._getMatches().slice(0, limit);
  }

  async processBattle(payload) {
    const { element, color, betAmount } = payload;
    const user = this._getUser();

    // 1. Validação de Saldo
    if (user.balance < betAmount) {
      throw new Error('INSUFFICIENT_BALANCE');
    }

    // 2. Débito imediato (Transação Atômica Simulada)
    user.balance -= betAmount;
    this._saveUser(user);

    // 3. Gerar RNG (Random Number Generation)
    const elements = Object.keys(RINHA_CONFIG.ELEMENTS);
    const colors = Object.keys(RINHA_CONFIG.COLORS);
    const cpuElement = elements[Math.floor(Math.random() * elements.length)];
    const cpuColor = colors[Math.floor(Math.random() * colors.length)];
    const arena = RINHA_CONFIG.ARENAS[Math.floor(Math.random() * RINHA_CONFIG.ARENAS.length)];

    // 4. Cálculo de Scores
    const playerScore = this._calculateScore(element, color, arena, cpuColor);
    const cpuScore = this._calculateScore(cpuElement, cpuColor, arena, color);

    // 5. Determinação do Vencedor
    let result = 'DRAW';
    if (playerScore > cpuScore) result = 'WIN';
    else if (cpuScore > playerScore) result = 'LOSS';

    // 6. Cálculo de Payout
    let payout = 0;
    if (result === 'WIN') payout = Math.floor(betAmount * 1.8);
    else if (result === 'DRAW') payout = betAmount;

    // 7. Crédito de Payout
    if (payout > 0) {
      user.balance += payout;
      this._saveUser(user);
    }

    // 8. Salvar Histórico
    const matchId = uuidv4();
    const matchRecord = {
      id: matchId,
      user_id: user.id,
      bet_amount: betAmount,
      p_element: element,
      p_color: color,
      cpu_element: cpuElement,
      cpu_color: cpuColor,
      arena: arena.id,
      result: result,
      payout: payout,
      scores: { player: playerScore, cpu: cpuScore },
      created_at: new Date().toISOString()
    };
    this._saveMatch(matchRecord);

    // 9. Retornar Resposta formatada conforme solicitado
    return {
      matchId,
      arena: arena,
      cpu: {
        element: cpuElement,
        color: cpuColor
      },
      scores: {
        player: playerScore,
        cpu: cpuScore
      },
      result,
      financial: {
        bet: betAmount,
        payout,
        profit: payout - betAmount,
        newBalance: user.balance
      }
    };
  }

  async deposit(amountUsd) {
    const user = this._getUser();
    const coins = amountUsd * RINHA_CONFIG.CONVERSION_RATE;
    user.balance += coins;
    this._saveUser(user);
    return { newBalance: user.balance };
  }
}

export default new RinhaEngine();
