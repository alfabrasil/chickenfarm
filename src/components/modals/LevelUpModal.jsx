import React from 'react';
import Confetti from '../ui/Confetti';
import { Lock } from 'lucide-react';

const LevelUpModal = ({ newLevel, onClose }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6 animate-in zoom-in duration-500" onClick={onClose}>
    <Confetti />
    <div className="text-center">
      <div className="text-9xl mb-4 animate-[bounce_2s_infinite]">🆙</div>
      <h1 className="text-5xl font-black text-white mb-2 text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-500 drop-shadow-sm">LEVEL UP!</h1>
      <p className="text-2xl text-white font-bold mb-8">Você alcançou o Nível {newLevel}!</p>
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 max-w-xs mx-auto mb-8">
        <h3 className="text-white font-black mb-2 flex items-center justify-center gap-2"><Lock className="text-red-400" size={20}/> Novos Itens Desbloqueados</h3>
        <p className="text-slate-300 text-sm">Confira a loja para ver as novidades disponíveis para o seu nível.</p>
      </div>
      <button onClick={onClose} className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-xl shadow-xl border-b-8 border-green-700 active:border-b-0 active:translate-y-2 transition-all">
        CONTINUAR JOGANDO
      </button>
    </div>
  </div>
);

export default LevelUpModal;
