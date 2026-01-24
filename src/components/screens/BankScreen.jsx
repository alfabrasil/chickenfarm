import React, { useState } from 'react';
import { X, Landmark, TrendingUp } from 'lucide-react';
import { playSound } from '../../utils/audioSystem';

const BankScreen = ({ onBack, balance, setBalance, bankBalance, setBankBalance }) => {
  const [amount, setAmount] = useState('');
  const handleDeposit = () => { const val = Number(amount); if (val > 0 && val <= balance) { setBalance(prev => prev - val); setBankBalance(prev => prev + val); setAmount(''); playSound('cash'); } };
  const handleWithdraw = () => { const val = Number(amount); if (val > 0 && val <= bankBalance) { setBankBalance(prev => prev - val); setBalance(prev => prev + val); setAmount(''); playSound('cash'); } };
  return (
    <div className="animate-in slide-in-from-bottom-10 fade-in duration-300 pb-24 md:pb-0">
      <div className="flex items-center gap-2 mb-4"><button onClick={onBack} className="bg-white p-2 rounded-full shadow-md"><X size={24}/></button><h1 className="text-2xl font-black text-slate-800 bg-white/50 px-3 py-1 rounded-xl">Banco da Fazenda</h1></div>
      <div className="bg-green-600 text-white p-6 rounded-3xl shadow-xl mb-6 text-center border-b-8 border-green-800">
        <p className="text-xs uppercase font-bold opacity-70 mb-1">Saldo Investido</p>
        <div className="text-4xl font-black mb-2 flex justify-center items-center gap-2"><Landmark size={32}/> {bankBalance}</div>
        <div className="bg-green-800/50 rounded-xl py-1 px-3 text-xs inline-flex items-center gap-1"><TrendingUp size={12}/> Rendimento Diário: +5%</div>
      </div>
      <div className="bg-white/90 p-6 rounded-3xl border-b-4 border-slate-200">
        <div className="flex gap-2 mb-4"><div className="flex-1 text-center"><p className="text-xs text-slate-400 font-bold">Na Carteira</p><p className="font-black text-slate-800 text-lg">{balance} 💰</p></div></div>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Valor..." className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold text-center text-xl mb-4 focus:border-green-500 outline-none" />
        <div className="flex gap-2"><button onClick={handleDeposit} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-black shadow-md border-b-4 border-green-700 active:border-b-0 active:translate-y-1">DEPOSITAR</button><button onClick={handleWithdraw} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-black shadow-md border-b-4 border-red-700 active:border-b-0 active:translate-y-1">SACAR</button></div>
      </div>
    </div>
  );
};

export default BankScreen;
