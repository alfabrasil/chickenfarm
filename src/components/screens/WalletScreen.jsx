import React from 'react';
import { X } from 'lucide-react';

const WalletScreen = ({ onBack, balance }) => (
  <div className="animate-in slide-in-from-right-10 fade-in pb-24 md:pb-0">
    <div className="flex items-center gap-2 mb-4"><button onClick={onBack} className="bg-white p-2 rounded-full shadow-md"><X size={24}/></button><h1 className="text-2xl font-black text-slate-800 bg-white/50 px-3 py-1 rounded-xl">Carteira</h1></div>
    <div className="bg-white/90 p-8 rounded-3xl border-b-4 border-slate-200 text-center shadow-xl">
      <p className="text-slate-500 font-bold uppercase text-xs mb-2">Saldo Atual</p>
      <div className="text-5xl font-black text-slate-800 mb-6">{balance} <span className="text-yellow-500">💰</span></div>
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
        <h3 className="font-bold text-blue-800 mb-1">Dica Financeira</h3>
        <p className="text-xs text-blue-600">Invista em galinhas Gigantes para maximizar seus lucros a longo prazo!</p>
      </div>
      <button onClick={onBack} className="w-full bg-slate-200 hover:bg-slate-300 text-slate-600 py-3 rounded-xl font-bold border-b-4 border-slate-300 active:border-b-0 active:translate-y-1">Voltar</button>
    </div>
  </div>
);

export default WalletScreen;
