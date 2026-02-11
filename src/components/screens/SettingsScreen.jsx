import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Save, Download, Crown, Globe, RefreshCcw, Music } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTutorial } from '../../contexts/TutorialContext';
import { bgm } from '../../utils/musicSystem';

const SettingsScreen = ({ onBack, onReset, dayCount, isMuted, toggleMute, onPrestige, canPrestige, goldenEggsToGain, onExportSave, onImportSave }) => {
  const { t, language, changeLanguage, languages } = useLanguage();
  const { restartTutorial } = useTutorial();

  // Estado local para controle da música
  const [musicEnabled, setMusicEnabled] = useState(bgm.isEnabledState());
  const [musicVolume, setMusicVolume] = useState(bgm.getVolume());

  // Sincronização com MusicSystem (Observer)
  useEffect(() => {
    const unsubscribe = bgm.subscribe((state) => {
      setMusicEnabled(state.enabled);
      setMusicVolume(state.volume);
    });
    return unsubscribe;
  }, []);

  const handleMusicToggle = () => {
    const newState = !musicEnabled;
    setMusicEnabled(newState);
    bgm.toggle(newState);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setMusicVolume(val);
    bgm.setVolume(val);
  };

  return (
    <div className="animate-in slide-in-from-right-10 fade-in pb-24 md:pb-0">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="bg-white p-2 rounded-full shadow-md">
          <X size={24}/>
        </button>
        <h1 className="text-2xl font-black text-slate-800 bg-white/50 px-3 py-1 rounded-xl">
          {t('settings_title')}
        </h1>
      </div>

      <div className="bg-white/90 p-6 rounded-3xl border-b-4 border-slate-200 space-y-6">
        {/* Tutorial */}
        <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
          <h3 className="font-black text-blue-800 flex items-center gap-2 mb-2">
            <RefreshCcw size={20}/> {t('settings_tutorial_title')}
          </h3>
          <button 
            onClick={() => { restartTutorial(); onBack(); }}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-black shadow-sm text-xs border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all"
          >
            {t('settings_tutorial_btn')}
          </button>
        </div>

        {/* Áudio (SFX + BGM) */}
        <div className="space-y-3">
           {/* SFX */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              {isMuted ? <VolumeX size={24} className="text-slate-400"/> : <Volume2 size={24} className="text-blue-500"/>}
              <span className="font-bold text-slate-700">{isMuted ? t('sound_off') : t('sound_on')}</span>
            </div>
            <button 
              onClick={toggleMute} 
              className={`w-12 h-6 rounded-full transition-all relative ${isMuted ? 'bg-slate-300' : 'bg-blue-500'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isMuted ? 'left-1' : 'left-7'}`}></div>
            </button>
          </div>

          {/* BGM (Música) */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Music size={24} className={musicEnabled ? "text-purple-500" : "text-slate-400"}/>
                <span className="font-bold text-slate-700">Música de Fundo</span>
              </div>
              <button 
                onClick={handleMusicToggle} 
                className={`w-12 h-6 rounded-full transition-all relative ${!musicEnabled ? 'bg-slate-300' : 'bg-purple-500'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${!musicEnabled ? 'left-1' : 'left-7'}`}></div>
              </button>
            </div>
            
            {/* Volume Slider */}
            <div className={`transition-all duration-300 ${!musicEnabled ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400">VOL</span>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05" 
                  value={musicVolume} 
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <span className="text-[10px] font-bold text-slate-500 w-6 text-right">{Math.round(musicVolume * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Idioma */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase px-1">
            <Globe size={14}/> {t('language')}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all ${
                  language === lang.code 
                    ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-[10px] font-black uppercase">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Save/Load */}
        <div className="flex gap-2">
          <button onClick={onExportSave} className="flex-1 bg-blue-100 text-blue-600 py-3 rounded-xl font-bold text-xs border-2 border-blue-200 flex items-center justify-center gap-1">
            <Save size={16}/> {t('btn_save')}
          </button>
          <button onClick={onImportSave} className="flex-1 bg-purple-100 text-purple-600 py-3 rounded-xl font-bold text-xs border-2 border-purple-200 flex items-center justify-center gap-1">
            <Download size={16}/> {t('btn_load')}
          </button>
        </div>

        {/* Prestige */}
        <div className="p-4 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl border-2 border-yellow-300">
          <h3 className="font-black text-yellow-800 flex items-center gap-2">
            <Crown size={20}/> {t('settings_prestige_title')}
          </h3>
          <p className="text-xs text-yellow-700 mb-3">
            {t('settings_prestige_desc')}
          </p>
          <button 
            disabled={!canPrestige}
            onClick={onPrestige}
            className={`w-full py-3 rounded-xl font-black shadow-sm text-xs border-b-4 transition-all ${
              canPrestige 
                ? 'bg-yellow-500 border-yellow-700 text-white hover:bg-yellow-400' 
                : 'bg-slate-200 border-slate-300 text-slate-400 grayscale'
            }`}
          >
            {t('settings_prestige_btn', [goldenEggsToGain])}
          </button>
        </div>

        <button onClick={onReset} className="w-full bg-red-100 text-red-600 border-2 border-red-200 py-3 rounded-xl font-bold shadow-sm text-xs">
          {t('btn_reset')}
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;
