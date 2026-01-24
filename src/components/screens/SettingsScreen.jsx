import React from 'react';
import { X, Volume2, VolumeX, Save, Download, Crown, Egg } from 'lucide-react';

const SettingsScreen = ({ onBack, onReset, dayCount, isMuted, toggleMute, onPrestige, canPrestige, goldenEggsToGain, onExportSave, onImportSave }) => (
  <div className="animate-in slide-in-from-right-10 fade-in pb-24 md:pb-0">
    <div className="flex items-center gap-2 mb-4"><button onClick={onBack} className="bg-white p-2 rounded-full shadow-md"><X size={24}/></button><h1 className="text-2xl font-black text-slate-800 bg-white/50 px-3 py-1 rounded-xl">Config</h1></div>
    <div className="bg-white/90 p-6 rounded-3xl border-b-4 border-slate-200 space-y-4">
      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200"><div className="flex items-center gap-3">{isMuted ? <VolumeX size={24} className="text-slate-400"/> : <Volume2 size={24} className="text-blue-500"/>}<span className="font-bold text-slate-700">Sons do Jogo</span></div><button onClick={toggleMute} className={`w-14 h-8 rounded-full transition-colors relative ${isMuted ? 'bg-slate-300' : 'bg-green-500'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${isMuted ? 'left-1' : 'right-1'}`}></div></button></div>
      <div className="flex gap-2"><button onClick={onExportSave} className="flex-1 bg-blue-100 text-blue-600 py-3 rounded-xl font-bold text-xs border-2 border-blue-200 flex items-center justify-center gap-1"><Save size={16}/> SALVAR (COPIAR)</button><button onClick={onImportSave} className="flex-1 bg-blue-100 text-blue-600 py-3 rounded-xl font-bold text-xs border-2 border-blue-200 flex items-center justify-center gap-1"><Download size={16}/> CARREGAR</button></div>
      <div className="p-4 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl border-2 border-yellow-300 mt-4"><h3 className="font-black text-yellow-800 flex items-center gap-2"><Crown size={20}/> Ascensão (Rebirth)</h3><p className="text-xs text-yellow-700 mb-3">Venda sua fazenda para ganhar Ovos Dourados e recomeçar com bônus permanentes.</p><div className="flex justify-between items-center bg-white/50 p-2 rounded-lg mb-3"><span className="text-xs font-bold text-slate-600">Recompensa:</span><span className="text-sm font-black text-yellow-600 flex items-center gap-1">+{goldenEggsToGain} <Egg size={12}/></span></div><button disabled={!canPrestige} onClick={onPrestige} className={`w-full py-3 rounded-xl font-black shadow-md border-b-4 text-xs flex items-center justify-center gap-2 transition-all ${canPrestige ? 'bg-yellow-500 border-yellow-700 text-white hover:bg-yellow-600 active:border-b-0 active:translate-y-1' : 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed'}`}>{canPrestige ? 'ASCENDER AGORA' : 'MÍNIMO: 5.000 MOEDAS'}</button></div>
      <button onClick={onReset} className="w-full bg-red-100 text-red-600 border-2 border-red-200 py-3 rounded-xl font-bold shadow-sm text-xs mt-4">APAGAR DADOS (RESET TOTAL)</button>
    </div>
  </div>
);

export default SettingsScreen;
