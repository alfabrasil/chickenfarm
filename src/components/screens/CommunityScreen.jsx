import React, { useState } from 'react';
import { X, Share2, Copy, Zap, Target, Gift, Gavel, ShoppingBag, Clock, DollarSign } from 'lucide-react';
import { REFERRAL_LEVELS, TYPE_CONFIG } from '../../data/gameConfig';

const CommunityScreen = ({ onBack, onSimulateReferral, referralHistory, coopProgress, onContributeCoop, onBuyAuction, chickens, onSellAuction, balance, maxCapacity, auctionItems }) => {
  const [tab, setTab] = useState('AUCTION');
  const [selectedSell, setSelectedSell] = useState(null);
  
  return (
    <div className="animate-in slide-in-from-bottom-10 fade-in duration-300 pb-24 md:pb-0">
      <div className="flex items-center gap-2 mb-4"><button onClick={onBack} className="bg-white p-2 rounded-full shadow-md"><X size={24}/></button><h1 className="text-2xl font-black text-slate-800 bg-white/50 px-3 py-1 rounded-xl">Centro Comunitário</h1></div>
      
      <div className="flex gap-2 mb-6 bg-white/80 p-1 rounded-2xl overflow-x-auto">
        <button onClick={()=>setTab('AUCTION')} className={`flex-1 py-2 px-3 rounded-xl font-black text-sm transition-all whitespace-nowrap ${tab==='AUCTION'?'bg-amber-500 text-white shadow-sm':'text-slate-400'}`}>LEILÃO</button>
        <button onClick={()=>setTab('AFFILIATE')} className={`flex-1 py-2 px-3 rounded-xl font-black text-sm transition-all whitespace-nowrap ${tab==='AFFILIATE'?'bg-blue-500 text-white shadow-sm':'text-slate-400'}`}>AFILIADOS</button>
        <button onClick={()=>setTab('COOP')} className={`flex-1 py-2 px-3 rounded-xl font-black text-sm transition-all whitespace-nowrap ${tab==='COOP'?'bg-green-500 text-white shadow-sm':'text-slate-400'}`}>COOPERATIVA</button>
      </div>

      {tab === 'AFFILIATE' ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border-b-8 border-blue-900">
             <div className="absolute top-0 right-0 p-4 opacity-20"><Share2 size={120} /></div><h2 className="text-lg font-bold mb-1 opacity-90">Link de Convite</h2><div className="flex gap-2 items-center bg-black/20 p-3 rounded-xl border border-white/20 backdrop-blur-sm mb-4"><code className="flex-1 font-mono text-sm truncate">farmtycoon.app/ref/fazendeiro01</code><button className="p-2 hover:bg-white/20 rounded-lg transition-colors"><Copy size={18} /></button></div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-5 border-b-4 border-slate-200 shadow-lg">
            <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2"><Zap className="text-yellow-500" size={20}/> Simulador de Ganhos</h3>
            <div className="grid grid-cols-1 gap-2">
              {REFERRAL_LEVELS.map((lvl) => (
                <button key={lvl.level} onClick={(e) => onSimulateReferral(lvl, e)} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-green-50 active:scale-95 transition-all rounded-xl border border-slate-200 hover:border-green-300 group"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-200 group-hover:bg-green-500 group-hover:text-white flex items-center justify-center font-bold text-xs transition-colors">{lvl.level}º</div><span className="font-bold text-slate-600 group-hover:text-green-700">{lvl.label}</span></div><div className="text-right"><span className="text-xs text-slate-400 block">Comissão {(lvl.percent * 100)}%</span><span className="font-black text-green-600 text-lg">+{Math.floor(1000 * lvl.percent)} 💰</span></div></button>
              ))}
            </div>
          </div>
          {referralHistory.length > 0 && (<div className="bg-white/80 p-4 rounded-3xl border-b-4 border-slate-200"><h4 className="font-bold text-slate-700 mb-2">Histórico Recente</h4><div className="space-y-2 max-h-40 overflow-y-auto">{referralHistory.map((item) => (<div key={item.id} className="text-xs flex justify-between text-slate-500 border-b border-slate-100 pb-1"><span>{item.desc}</span><span className="font-bold text-green-600">+{item.amount}</span></div>))}</div></div>)}
        </div>
      ) : tab === 'COOP' ? (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border-b-8 border-green-900">
             <div className="absolute top-0 right-0 p-4 opacity-20"><Target size={120} /></div>
             <h2 className="text-lg font-bold mb-1 opacity-90">Meta da Semana</h2>
             <div className="text-3xl font-black mb-2">Entregar 500 Ovos</div>
             <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-sm">
                <div className="flex justify-between text-xs font-bold mb-1"><span>Progresso Coletivo</span><span>{coopProgress} / 500</span></div>
                <div className="h-4 bg-white/20 rounded-full overflow-hidden border border-white/30"><div className="h-full bg-yellow-400 transition-all duration-1000" style={{ width: `${Math.min((coopProgress/500)*100, 100)}%` }}></div></div>
             </div>
          </div>
          <div className="bg-white/90 p-6 rounded-3xl border-b-4 border-slate-200">
            <h3 className="font-black text-slate-800 mb-4">Contribuir com a Cooperativa</h3>
            <p className="text-slate-500 text-sm mb-4">Doe ovos comuns para ajudar a comunidade. Você ganha 5 XP por ovo doado, mas não recebe moedas.</p>
            <button onClick={onContributeCoop} className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-black text-lg shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2">
              <Gift size={20}/> DOAR 1 OVO COMUM
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border-b-8 border-amber-800">
             <div className="absolute top-0 right-0 p-4 opacity-20"><Gavel size={120} /></div>
             <h2 className="text-2xl font-black mb-1 opacity-90">Casa de Leilões</h2>
             <p className="text-white/80 font-medium text-sm">Compre e venda galinhas raras!</p>
          </div>
          <div>
            <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2"><ShoppingBag size={20}/> Ofertas Ativas</h3>
            {auctionItems.length === 0 ? (
              <div className="text-center py-4 text-slate-400 italic">Nenhum leilão disponível no momento.</div>
            ) : (
              <div className="space-y-3">
                {auctionItems.map(listing => (
                  <div key={listing.id} className="bg-white p-3 rounded-2xl border-b-4 border-slate-200 flex items-center gap-3">
                    <div className={`w-12 h-12 flex items-center justify-center text-2xl rounded-xl border-2 ${TYPE_CONFIG[listing.type].color} ${TYPE_CONFIG[listing.type].border}`}>{TYPE_CONFIG[listing.type].icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="font-black text-slate-700 text-sm">{listing.type} <span className="font-normal text-slate-400">({listing.age} dias)</span></span>
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Clock size={10}/> {listing.expires}</span>
                      </div>
                      <div className="text-xs text-slate-500">Vendedor: {listing.seller}</div>
                    </div>
                    <button disabled={balance < listing.price || chickens.length >= maxCapacity} onClick={() => onBuyAuction(listing)} className="bg-green-500 disabled:bg-slate-300 text-white px-3 py-2 rounded-xl font-black text-xs border-b-4 border-green-700 disabled:border-slate-400 active:border-b-0 active:translate-y-1 transition-all">
                      {listing.price} 💰
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2 mt-6"><DollarSign size={20}/> Vender suas Galinhas</h3>
            {chickens.length === 0 ? <p className="text-xs text-slate-400">Você não tem galinhas para vender.</p> : (
              <div className="grid grid-cols-3 gap-2">
                {chickens.map(chicken => (
                  <div key={chicken.id} onClick={() => setSelectedSell(chicken)} className={`cursor-pointer p-2 rounded-xl border-2 transition-all ${selectedSell?.id === chicken.id ? 'bg-amber-100 border-amber-400' : 'bg-white border-slate-200'}`}>
                    <div className="text-center text-2xl mb-1">{TYPE_CONFIG[chicken.type].icon}</div>
                    <div className="text-[10px] font-bold text-center text-slate-600 truncate">{chicken.name}</div>
                  </div>
                ))}
              </div>
            )}
            {selectedSell && (
              <div className="mt-4 bg-white p-4 rounded-2xl border-b-4 border-slate-200 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-center mb-4"><span className="font-bold text-slate-600">Preço Sugerido:</span><span className="font-black text-xl text-green-600">{Math.floor(TYPE_CONFIG[selectedSell.type].feedConsumption * 100 + selectedSell.age_days * 2)} 💰</span></div>
                <button onClick={() => { onSellAuction(selectedSell); setSelectedSell(null); }} className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-black shadow-lg border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 transition-all">VENDER NO LEILÃO</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunityScreen;
