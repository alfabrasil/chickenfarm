// SISTEMA DE MÚSICA DE FUNDO (BGM)
// Independente do sistema de SFX para controle granular e não-intrusivo.

const STORAGE_KEY_MUSIC_ENABLED = 'farmcoin_bgm_enabled';
const STORAGE_KEY_MUSIC_VOLUME = 'farmcoin_bgm_volume';

class MusicSystem {
  constructor() {
    this.audio = new Audio();
    this.audio.loop = true;
    this.audio.preload = 'auto';
    this.audio.src = '/assets/music/Music_Farm_01.mp3'; // Caminho padrão
    
    this.canPlay = false;
    this.observers = new Set();
    
    // Listeners de Eventos do Audio
    this.audio.addEventListener('canplaythrough', () => {
      this.canPlay = true;
      if (this.isEnabled && this.initialized) {
        this.attemptPlay();
      }
    });

    this.audio.addEventListener('error', (e) => {
      // Fallback para WAV se MP3 falhar
      if (this.audio.src.endsWith('.mp3') && this.audio.error && (this.audio.error.code === 4 || this.audio.error.code === 3)) {
         console.warn("MusicSystem: MP3 falhou, tentando fallback para WAV...");
         this.audio.src = this.audio.src.replace('.mp3', '.wav');
         this.audio.load();
         if (this.isEnabled) {
           this.audio.play().catch(e => console.log("Erro no fallback wav:", e));
         }
         return;
      }

      // Falha silenciosa ou aviso discreto se o arquivo não existir
      // Isso evita erros vermelhos assustadores no console se o usuário ainda não colocou o arquivo
      if (this.audio.error && this.audio.error.code === 4) {
         console.warn("MusicSystem: Arquivo de música não encontrado ou formato não suportado. Aguardando 'Music_Farm_01.mp3' ou '.wav'...");
      }
      this.canPlay = false;
    });

    // Configurações padrão
    this.isEnabled = true;
    this.volume = 0.3; // Volume ambiente padrão (30%)
    
    this.initialized = false;
  }

  // --- Sistema de Observadores para UI Reativa ---
  subscribe(callback) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  notify() {
    this.observers.forEach(cb => cb({ 
      enabled: this.isEnabled, 
      volume: this.volume,
      playing: !this.audio.paused
    }));
  }

  init() {
    if (this.initialized) return;

    // Carregar preferências salvas
    const savedEnabled = localStorage.getItem(STORAGE_KEY_MUSIC_ENABLED);
    const savedVolume = localStorage.getItem(STORAGE_KEY_MUSIC_VOLUME);

    if (savedEnabled !== null) {
      this.isEnabled = savedEnabled === 'true';
    }

    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
    }

    // Aplicar volume
    this.audio.volume = this.volume;
    this.initialized = true;

    // Tentar tocar se habilitado
    if (this.isEnabled) {
      this.attemptPlay();
    }
  }

  async attemptPlay() {
    if (!this.isEnabled) return;

    try {
      await this.audio.play();
      this.notify();
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        // Autoplay bloqueado - comportamento normal
        console.log("MusicSystem: Autoplay bloqueado. Aguardando interação do usuário.");
        this.addUnlockListener();
      } else if (error.name === 'NotSupportedError' || error.message.includes('supported sources')) {
        // Arquivo faltando - já tratado pelo listener 'error', ignorar aqui
      } else {
        // Outros erros
        console.warn("MusicSystem: Erro ao tentar tocar:", error);
      }
    }
  }

  addUnlockListener() {
    const unlock = () => {
      if (this.isEnabled) {
        this.attemptPlay();
      }
      // Remove listeners após a primeira interação
      ['click', 'touchstart', 'keydown'].forEach(evt => 
        window.removeEventListener(evt, unlock)
      );
    };

    ['click', 'touchstart', 'keydown'].forEach(evt => 
      window.addEventListener(evt, unlock, { once: true })
    );
  }

  play() {
    this.isEnabled = true;
    this.attemptPlay();
    this.notify(); // Notifica mudança de intenção
  }

  pause() {
    this.audio.pause();
    this.notify();
  }

  toggle(shouldPlay) {
    this.isEnabled = shouldPlay;
    localStorage.setItem(STORAGE_KEY_MUSIC_ENABLED, shouldPlay);
    
    if (shouldPlay) {
      this.attemptPlay();
    } else {
      this.pause();
    }
    this.notify();
  }

  setVolume(value) {
    // Clamp value between 0 and 1
    const newVolume = Math.max(0, Math.min(1, value));
    this.volume = newVolume;
    this.audio.volume = newVolume;
    localStorage.setItem(STORAGE_KEY_MUSIC_VOLUME, newVolume);
    this.notify();
  }

  getVolume() {
    return this.volume;
  }

  isEnabledState() {
    return this.isEnabled;
  }
}

// Singleton Instance
export const bgm = new MusicSystem();
