// SISTEMA DE ÁUDIO

let IS_MUTED_GLOBAL = false;

export const setGlobalMute = (isMuted) => {
  IS_MUTED_GLOBAL = isMuted;
};

let audioCtx = null;

// Detecta iOS (iPhone/iPad e iPadOS em Safari)
const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
let IOS_UNLOCKED = false;

// Silêncio curto em MP3 (data URI) para destravar áudio em iOS
// Fonte: bloco mínimo de silêncio compatível com Safari
const SILENT_MP3_DATA_URI = 'data:audio/mpeg;base64,//uQZAAAAAAAAAAAAAAAAAAAAAExBTUUzLjk4LjIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

export const unlockIOSAudio = async () => {
  if (!IS_IOS || IOS_UNLOCKED) return;
  try {
    const a = new Audio();
    a.src = SILENT_MP3_DATA_URI;
    a.preload = 'auto';
    a.muted = true;
    a.setAttribute('playsinline', 'true');
    await a.play().catch(() => {});
    a.pause();
    IOS_UNLOCKED = true;
  } catch (e) {
    // Falha de desbloqueio não é crítica; tentaremos novamente em próximas interações
  }
};

export const attachAudioUnlockListeners = () => {
  const handler = async () => {
    await unlockIOSAudio();
    initAudio();
    window.removeEventListener('click', handler);
    window.removeEventListener('touchstart', handler);
    window.removeEventListener('touchend', handler);
  };
  window.addEventListener('click', handler, { passive: true });
  window.addEventListener('touchstart', handler, { passive: true });
  window.addEventListener('touchend', handler, { passive: true });
};

export const initAudio = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  
  if (audioCtx) {
    // No iOS, o resume deve ser chamado explicitamente em um evento de clique
    if (audioCtx.state === 'suspended' || audioCtx.state === 'interrupted') {
      audioCtx.resume().then(() => {
        console.log("AudioContext resumed successfully");
        warmUp(audioCtx);
      }).catch(e => console.error("Audio resume failed", e));
    } else {
      warmUp(audioCtx);
    }
  }
  return audioCtx;
};

const warmUp = (ctx) => {
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

const getAudioContext = () => {
  if (!audioCtx) {
     return initAudio();
  }
  // Tentar resume agressivo se estiver suspenso (comum no iOS após inatividade)
  if (audioCtx && (audioCtx.state === 'suspended' || audioCtx.state === 'interrupted')) {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

export const playSound = (type) => {
  if (IS_MUTED_GLOBAL) return; 

  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
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
  } else if (type === 'neutral') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
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
  }
};
