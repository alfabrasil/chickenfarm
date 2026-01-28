// SISTEMA DE ÁUDIO AVANÇADO (HÍBRIDO: WEBAUDIO + HTML5 AUDIO POOL)
// Solução robusta para iOS que mantém WebAudio como primário, mas usa um Pool de HTMLAudioElements
// como fallback garantido para dispositivos Apple que bloqueiam AudioContext ou requerem User Gesture estrito.

let IS_MUTED_GLOBAL = false;
let USE_FALLBACK_AUDIO = false; // Ativado automaticamente no iOS
const AUDIO_CACHE = {}; // Cache de URLs (Blob) para os sons gerados
const AUDIO_POOL_SIZE = 8; // Número de canais de áudio simultâneos para o fallback
const audioPool = []; // Pool de elementos <audio>
let poolIndex = 0; // Índice rotativo do pool
let isPoolUnlocked = false; // Flag para saber se o pool já foi "abençoado" pelo user gesture

export const setGlobalMute = (isMuted) => {
  IS_MUTED_GLOBAL = isMuted;
  // Se mutar, pausa todos os áudios do pool
  if (isMuted) {
    audioPool.forEach(a => {
        a.pause();
        a.currentTime = 0;
    });
  }
};

// Detecção robusta de iOS
const isIOS = () => {
  if (typeof navigator === 'undefined') return false;
  
  const isPlatformiOS = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform);

  const isMacWithTouch = (navigator.userAgent.includes("Mac") && "ontouchend" in document);
  
  return isPlatformiOS || isMacWithTouch;
};

// --- GERADOR DE WAV (PCM SÍNTESE) ---
const generateSoundBlob = (type, durationSec, frequencyHz, vol = 0.5) => {
  const sampleRate = 44100;
  const numSamples = Math.floor(durationSec * sampleRate);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // RIFF Header
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // PCM Data Generation
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    if (type === 'square') {
      sample = Math.sign(Math.sin(2 * Math.PI * frequencyHz * t));
    } else if (type === 'sawtooth') {
      sample = 2 * (t * frequencyHz - Math.floor(t * frequencyHz + 0.5));
    } else if (type === 'triangle') {
      sample = 2 * Math.abs(2 * (t * frequencyHz - Math.floor(t * frequencyHz + 0.5))) - 1;
    } else if (type === 'noise') {
      sample = Math.random() * 2 - 1;
    } else { // sine
      sample = Math.sin(2 * Math.PI * frequencyHz * t);
    }
    
    // Envelope para evitar clicks (Fade Out)
    const envelope = Math.max(0, 1 - (i / numSamples));
    sample *= envelope * vol;

    // 16-bit clamp
    sample = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
};

// Pré-gera os sons e inicializa o Pool
const generateCacheAndPool = () => {
  // 1. Gera os Blobs de som
  if (Object.keys(AUDIO_CACHE).length === 0) {
      const sounds = {
        'coin': { type: 'sine', freq: 1600, dur: 0.1 },
        'pop': { type: 'sine', freq: 600, dur: 0.05 },
        'squish': { type: 'sawtooth', freq: 100, dur: 0.1 },
        'success': { type: 'triangle', freq: 500, dur: 0.3 },
        'achievement': { type: 'square', freq: 600, dur: 0.6 },
        'fox': { type: 'sawtooth', freq: 300, dur: 0.2 },
        'wheel': { type: 'noise', freq: 200, dur: 0.05 },
        'drone': { type: 'sine', freq: 400, dur: 0.3 },
        'upgrade': { type: 'square', freq: 150, dur: 0.2 },
        'sold': { type: 'square', freq: 1000, dur: 0.15 },
        'prestige': { type: 'triangle', freq: 400, dur: 1.5 },
        'cash': { type: 'sine', freq: 1000, dur: 0.2 },
        'dna': { type: 'triangle', freq: 450, dur: 0.8 },
        'neutral': { type: 'sine', freq: 300, dur: 0.3 },
        'error': { type: 'sawtooth', freq: 100, dur: 0.3 }
      };

      Object.entries(sounds).forEach(([key, config]) => {
        try {
          const blob = generateSoundBlob(config.type, config.dur, config.freq);
          AUDIO_CACHE[key] = URL.createObjectURL(blob);
        } catch (e) {
          console.error(`Erro ao gerar som ${key}:`, e);
        }
      });
      console.log("Sons Fallback Gerados:", Object.keys(AUDIO_CACHE).length);
  }

  // 2. Inicializa o Pool de Elementos de Áudio
  if (audioPool.length === 0) {
      for (let i = 0; i < AUDIO_POOL_SIZE; i++) {
          const audio = new Audio();
          // Preload e configurações para mobile
          audio.preload = 'auto'; 
          audio.playsInline = true; // Ajuda no iOS
          audio.setAttribute('x-webkit-airplay', 'allow'); 
          
          // Carrega um som padrão (pop) para deixar pronto
          if (AUDIO_CACHE['pop']) {
              audio.src = AUDIO_CACHE['pop'];
          }
          
          audioPool.push(audio);
      }
      console.log(`Audio Pool inicializado com ${AUDIO_POOL_SIZE} elementos.`);
  }
};

let audioCtx = null;

const warmUpWebAudio = (ctx) => {
  try {
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
    source.onended = () => source.disconnect();
  } catch (e) {
    console.error("Audio warm-up failed", e);
  }
};

// Função para desbloquear o Pool no primeiro toque (Critical for iOS)
const unlockAudioPool = () => {
    if (isPoolUnlocked) return;
    
    // Tenta tocar todos os elementos do pool silenciados
    // Isso "marca" os elementos como iniciados por user gesture
    audioPool.forEach(audio => {
        try {
            audio.volume = 0;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                    audio.volume = 0.5; // Restaura volume
                }).catch(e => {
                    // console.warn("Pool unlock play failed (ainda sem gesture?)", e);
                });
            }
        } catch (e) {
            console.warn("Erro ao tentar desbloquear audio pool element", e);
        }
    });
    
    isPoolUnlocked = true;
    console.log("Tentativa de desbloqueio do Audio Pool realizada.");
};

export const initAudio = () => {
  // iOS detection: Force Fallback
  if (isIOS()) {
    console.log("iOS detectado: Forçando modo HTML5 Audio Pool.");
    USE_FALLBACK_AUDIO = true;
    generateCacheAndPool();
  }

  // Tenta WebAudio também (pode funcionar em paralelo ou como backup)
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  
  if (audioCtx) {
      // Resume se necessário
      if (audioCtx.state === 'suspended' || audioCtx.state === 'interrupted') {
          // Não chamamos resume aqui pois precisa de user gesture
          // Será chamado no unlock
      }
  }

  return audioCtx;
};

const getAudioContext = () => {
  if (!audioCtx) initAudio();
  return audioCtx;
};

// Listener global para User Gesture (Desbloqueio)
export const attachAudioUnlockListeners = () => {
  const unlock = () => {
    // 1. WebAudio Unlock
    if (audioCtx) {
        if (audioCtx.state === 'suspended' || audioCtx.state === 'interrupted') {
            audioCtx.resume().then(() => {
                warmUpWebAudio(audioCtx);
                console.log("WebAudio Context Resumed");
            }).catch(e => console.error("WebAudio Resume Failed", e));
        } else {
            warmUpWebAudio(audioCtx);
        }
    }

    // 2. HTML5 Audio Pool Unlock (iOS)
    if (USE_FALLBACK_AUDIO) {
        if (audioPool.length === 0) generateCacheAndPool();
        unlockAudioPool();
    }

    // Remove listeners após sucesso (ou tenta manter se falhar? melhor remover para não spammar)
    // Na verdade, no iOS, é bom tentar em todo click até ter certeza.
    // Mas vamos remover para ser limpo, assumindo que o primeiro click funciona.
    window.removeEventListener('click', unlock);
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('touchend', unlock);
    window.removeEventListener('keydown', unlock);
  };

  window.addEventListener('click', unlock);
  window.addEventListener('touchstart', unlock);
  window.addEventListener('touchend', unlock);
  window.addEventListener('keydown', unlock);
};

// Função Principal de Play
export const playSound = (type) => {
  if (IS_MUTED_GLOBAL) return; 

  // --- ROTA DE FALLBACK (iOS) ---
  if (USE_FALLBACK_AUDIO || !audioCtx) {
    if (!AUDIO_CACHE[type]) {
        generateCacheAndPool();
    }
    
    if (AUDIO_CACHE[type] && audioPool.length > 0) {
        // Pega o próximo elemento do pool (Round Robin)
        const audio = audioPool[poolIndex];
        poolIndex = (poolIndex + 1) % AUDIO_POOL_SIZE;

        // Configura e toca
        audio.src = AUDIO_CACHE[type];
        audio.volume = 0.5;
        
        const p = audio.play();
        if (p !== undefined) {
            p.catch(e => {
                console.warn("Falha ao tocar som fallback (possível bloqueio de autoplay):", e);
            });
        }
        return;
    }
  }

  // --- ROTA WEBAUDIO (Android/Desktop) ---
  const ctx = getAudioContext();
  if (!ctx) return;

  // Criação dos osciladores (igual ao código anterior)
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  
  // Definição dos sons (mantida a mesma lógica de síntese)
  if (type === 'coin') {
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'pop') {
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'squish') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'success') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(554, now + 0.1);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  } else if (type === 'achievement') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.1);
    osc.frequency.setValueAtTime(783.99, now + 0.2);
    osc.frequency.setValueAtTime(1046.50, now + 0.3);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.8);
    osc.start(now);
    osc.stop(now + 0.8);
  } else if (type === 'fox') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(400, now + 0.2);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (type === 'wheel') {
    osc.frequency.setValueAtTime(200, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'drone') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.3);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'upgrade') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.2);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'sold') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.setValueAtTime(1200, now + 0.1);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'prestige') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(800, now + 2);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 2);
    osc.start(now);
    osc.stop(now + 2);
  } else if (type === 'cash') {
     osc.type = 'sine';
     osc.frequency.setValueAtTime(800, now);
     osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
     gain.gain.setValueAtTime(0.2, now);
     gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
     osc.start(now);
     osc.stop(now + 0.3);
  } else if (type === 'dna') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.5);
    osc.frequency.linearRampToValueAtTime(300, now + 1.0);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 1.0);
    osc.start(now);
    osc.stop(now + 1.0);
  } else if (type === 'neutral') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(200, now + 0.3);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'error') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.3);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  }
};
