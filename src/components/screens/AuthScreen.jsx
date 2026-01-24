import React, { useState } from 'react';
import { playSound } from '../../utils/audioSystem';

const AuthScreen = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const handleRegister = (e) => { e.preventDefault(); setLoading(true); setTimeout(() => onLogin(), 1500); };
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-50">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border-b-8 border-slate-200 animate-in zoom-in-50">
        <div className="text-center mb-8"><div className="w-20 h-20 bg-yellow-400 rounded-full border-4 border-yellow-600 flex items-center justify-center text-4xl shadow-lg mx-auto mb-4 animate-bounce">🐔</div><h1 className="text-3xl font-black text-slate-800 mb-2">FarmTycoon</h1><p className="text-slate-500 font-medium">Cadastre-se e ganhe 1 Pintinho Grátis!</p></div>
        <form onSubmit={handleRegister} className="space-y-4"><input required type="email" placeholder="E-mail" className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold" /><input required type="password" placeholder="Senha" className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-200 font-bold" /><button disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-black text-lg shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all">{loading ? 'Entrando...' : 'JOGAR AGORA 🚀'}</button></form>
      </div>
    </div>
  );
};

export default AuthScreen;
