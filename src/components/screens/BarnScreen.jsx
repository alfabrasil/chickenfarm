import React from 'react';
import { TrendingUp, TrendingDown, Activity, CheckCircle, Package, Sparkles, RefreshCcw, Egg, X } from 'lucide-react';
import { ITEMS_CONFIG, BASE_PRICES } from '../../data/gameConfig';
import { playSound } from '../../utils/audioSystem';

const BarnScreen = ({ onBack, inventory, onSellEggs, addFloatingText, marketPrices, upgrades, marketNews, goldenEggs, marketHistory }) => {
  const washerMultiplier = upgrades?.WASHER ? 1.1 : 1.0;
  const packerMultiplier = upgrades?.PACKER ? 1.15 : 1.0;
  const prestigeMultiplier = 1 + (goldenEggs * 0.1);
  const marketMultiplier = marketNews?.multiplier || 1.0;

  const totalValue = Math.floor(
    ((inventory.eggs_common * marketPrices.common) + 
    (inventory.eggs_rare * marketPrices.rare) + 
    (inventory.eggs_legendary * marketPrices.legendary)) * washerMultiplier * packerMultiplier * marketMultiplier * prestigeMultiplier
  );

  const getPriceColor = (current, base) => current > base ? 'text-green-600' : current < base ? 'text-red-500' : 'text-slate-600';
  const getArrow = (current, base) => current > base ? <TrendingUp size={16} className="text-green-600 inline" /> : current < base ? <TrendingDown size={16} className="text-red-500 inline" /> : <span className="text-slate-400">-</span>;
  const totalEggs = inventory.eggs_common + inventory.eggs_rare + inventory.eggs_legendary;

  // ENGENHARIA: Gráfico de Flutuação de Commodities
  const maxPriceInHistory = Math.max(...marketHistory.map(m => m.common), BASE_PRICES.EGG_COMMON * 2);

  return (
    <div className="animate-in slide-in-from-right-10 fade-in pb-24 md:pb-0">
      <div className="flex items-center gap-2 mb-4"><button onClick={onBack} className="bg-white p-2 rounded-full shadow-md"><X size={24}/></button><h1 className="text-2xl font-black text-slate-800 bg-white/50 px-3 py-1 rounded-xl">Celeiro & Mercado</h1></div>
      
      {/* GRÁFICO DE MERCADO (COMMODITIES) */}
      <div className="bg-white/90 p-4 rounded-3xl border-b-4 border-slate-200 mb-4 shadow-sm">
        <h3 className="font-black text-slate-700 flex items-center gap-2 mb-2 text-xs uppercase"><Activity size={14}/> Histórico de Preços (Ovo Comum)</h3>
        <div className="h-24 flex items-end justify-between gap-1 pb-4 px-2 border-b border-slate-200">
           {marketHistory.map((dayData, idx) => {
             const heightPct = Math.min((dayData.common / maxPriceInHistory) * 100, 100);
             return (
               <div key={idx} className="flex-1 flex flex-col items-center group relative">
                  <div 
                    className={`w-full rounded-t-sm transition-all duration-500 ${dayData.trend === 'UP' ? 'bg-green-400' : dayData.trend === 'DOWN' ? 'bg-red-400' : 'bg-slate-300'}`} 
                    style={{ height: `${heightPct}%` }}
                  ></div>
                  <div className="absolute -top-6 text-[8px] bg-slate-800 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ${dayData.common}
                  </div>
               </div>
             )
           })}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-bold">
           <span>7 Dias atrás</span>
           <span>Hoje</span>
        </div>
      </div>

      {marketNews && (<div className={`mb-4 border px-4 py-3 rounded-xl flex items-center gap-3 ${marketNews.multiplier >= 1 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}><div className="text-2xl">{marketNews.icon}</div><div className="flex-1"><h4 className={`font-black text-sm ${marketNews.color}`}>{marketNews.title}</h4><p className="text-xs text-slate-600">{marketNews.desc}</p></div></div>)}
      <div className="flex flex-col gap-2 mb-4">
        {upgrades?.WASHER && (<div className="bg-cyan-50 border border-cyan-200 text-cyan-800 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold"><CheckCircle size={16} /> Lavadora Ativa: +10% Valor</div>)}
        {upgrades?.PACKER && (<div className="bg-indigo-50 border border-indigo-200 text-indigo-800 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold"><Package size={16} /> Embaladora Ativa: +15% Valor (Acumulativo)</div>)}
        {goldenEggs > 0 && (<div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold"><Sparkles size={16} /> Prestígio: +{Math.round((prestigeMultiplier - 1)*100)}% Bônus</div>)}
      </div>
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border-b-8 border-orange-200 shadow-xl mb-6">
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-black text-orange-800 flex items-center gap-2"><Egg /> Estoque & Cotação</h2><span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-md flex items-center gap-1"><RefreshCcw size={10}/> Atualiza ao dormir</span></div>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl border border-orange-100"><div className="flex items-center gap-3"><span className="text-2xl">{ITEMS_CONFIG.EGG_COMMON.icon}</span> <div><span className="font-bold text-slate-700 block text-sm">{ITEMS_CONFIG.EGG_COMMON.name}</span><span className={`text-xs font-bold ${getPriceColor(marketPrices.common, BASE_PRICES.EGG_COMMON)}`}>{getArrow(marketPrices.common, BASE_PRICES.EGG_COMMON)} ${marketPrices.common}</span></div></div><div className="font-black text-lg">x{inventory.eggs_common}</div></div>
          <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl border border-orange-100"><div className="flex items-center gap-3"><span className="text-2xl">{ITEMS_CONFIG.EGG_RARE.icon}</span> <div><span className="font-bold text-slate-700 block text-sm">{ITEMS_CONFIG.EGG_RARE.name}</span><span className={`text-xs font-bold ${getPriceColor(marketPrices.rare, BASE_PRICES.EGG_RARE)}`}>{getArrow(marketPrices.rare, BASE_PRICES.EGG_RARE)} ${marketPrices.rare}</span></div></div><div className="font-black text-lg">x{inventory.eggs_rare}</div></div>
          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl border border-purple-100"><div className="flex items-center gap-3"><span className="text-2xl animate-pulse">{ITEMS_CONFIG.EGG_LEGENDARY.icon}</span> <div><span className="font-bold text-purple-700 block text-sm">{ITEMS_CONFIG.EGG_LEGENDARY.name}</span><span className={`text-xs font-bold ${getPriceColor(marketPrices.legendary, BASE_PRICES.EGG_LEGENDARY)}`}>{getArrow(marketPrices.legendary, BASE_PRICES.EGG_LEGENDARY)} ${marketPrices.legendary}</span></div></div><div className="font-black text-lg text-purple-700">x{inventory.eggs_legendary}</div></div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-4 text-white flex justify-between items-center mb-4"><span className="font-bold text-slate-400 uppercase text-xs">Valor Estimado</span><span className="font-black text-2xl text-yellow-400">💰 {totalValue}</span></div>
        <button onClick={() => { if(totalEggs > 0) { onSellEggs(totalValue); playSound('success'); } }} disabled={totalEggs === 0} className="w-full bg-green-500 hover:bg-green-600 disabled:bg-slate-300 text-white py-3 rounded-xl font-black shadow-md border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all disabled:border-slate-400">VENDER TUDO</button>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6"><div className="bg-white/90 p-4 rounded-3xl border-b-4 border-slate-200 flex flex-col items-center"><span className="text-4xl mb-2">{ITEMS_CONFIG.FEED.icon}</span><span className="font-black text-slate-700">Ração</span><span className="text-sm font-bold text-slate-500">{inventory.feed} / {upgrades?.SILO ? 100 : 20}</span></div><div className="bg-white/90 p-4 rounded-3xl border-b-4 border-slate-200 flex flex-col items-center"><span className="text-4xl mb-2">{ITEMS_CONFIG.VACCINE.icon}</span><span className="font-black text-slate-700">Vacinas</span><span className="text-sm font-bold text-slate-500">{inventory.vaccine} doses</span></div></div>
    </div>
  );
};

export default BarnScreen;
