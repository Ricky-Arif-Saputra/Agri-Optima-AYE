import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  LineChart, 
  Cpu, 
  Droplet, 
  Tag, 
  ChevronRight, 
  Settings, 
  Sliders, 
  Bell, 
  LogOut,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface DashboardViewProps {
  onLogout: () => void;
  onNavigateToTab: (tab: string) => void;
  // Shared settings/state that can be updated
  yieldVal: number;
  setYieldVal: (val: number) => void;
  roiVal: number;
  setRoiVal: (val: number) => void;
  efficiencyVal: number;
  setEfficiencyVal: (val: number) => void;
  marketIndex: 'High' | 'Moderate' | 'Volatile';
  setMarketIndex: (val: 'High' | 'Moderate' | 'Volatile') => void;
}

export default function DashboardView({
  onLogout,
  onNavigateToTab,
  yieldVal,
  setYieldVal,
  roiVal,
  setRoiVal,
  efficiencyVal,
  setEfficiencyVal,
  marketIndex,
  setMarketIndex,
}: DashboardViewProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [activePromoModal, setActivePromoModal] = useState<'irrigation' | 'market' | null>(null);
  const [appliedModel, setAppliedModel] = useState(false);

  // Dynamic projection calculation based on variables
  const baselineProfit = yieldVal * 820 * (roiVal / 100);
  
  // Create beautiful points for SVG graph based on Yield & ROI
  const generateGraphPath = () => {
    const scale = (yieldVal / 42.8) * (1 + roiVal / 100);
    const p1 = 85; 
    const p2 = 72 - 5 * scale;
    const p3 = 54 - 12 * scale;
    const p4 = 62 - 8 * scale;
    const p5 = 32 - 18 * scale;
    const p6 = 12 - 5 * scale;
    return `M0,${p1} Q50,${p2} 100,${p3} T200,${p4} T300,${p5} T400,${p6}`;
  };

  const handleApplyIrrigationModel = () => {
    setAppliedModel(true);
    setEfficiencyVal(Math.min(96, efficiencyVal + 8));
    setActivePromoModal('irrigation');
  };

  return (
    <div className="min-h-screen bg-[#f2f4f1] pb-28">
      {/* TopAppBar - Deep Forest */}
      <header className="bg-[#002d1a] text-white fixed top-0 w-full z-40 flex justify-between items-center px-4 md:px-12 h-16 shadow-md border-b border-[#1a432f]">
        <div className="flex items-center gap-2">
          <img 
            alt="AGRI OPTIMA Logo" 
            className="w-8 h-8 object-contain brightness-0 invert" 
            src="https://lh3.googleusercontent.com/aida/ADBb0ug7b3-ZpnDqEY-0T6rEkNzKAOrZEKiJ5CSKj5BeNQkqx7iPr0f9eA-t6CnvjMsvy_-RLmo_Jh7p4r6ID39j9_qfArvTzWNZhUZgCJIdvcM8srXfFh20DqhwRdLRFyTt4MjiOzA3gYA6tmWZPoB5WypHuRhyLVxFFRNhAuM8yIC58nXz0JsB4pzbhD3ZXWTvNpwdkPWk6X2iQ4rY2O5vL0_6eJ-kJ2dnkxUDZQH4FLqs2EVz9IqnmmYa6A"
          />
          <h1 className="font-serif text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            AGRI OPTIMA
          </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setShowConfig(!showConfig)} 
            className="p-2 hover:bg-[#1a432f] rounded-full transition-colors relative text-emerald-200"
            title="Adjust Indicators Simulators"
          >
            <Sliders className="w-5 h-5" />
          </button>
          <button 
            onClick={() => alert("Alert: Heavy Rain Expected Tomorrow morning (15mm). Scheduled fertilization has been paused.")}
            className="p-2 hover:bg-[#1a432f] rounded-full transition-colors text-emerald-200 relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-400 rounded-full"></span>
          </button>
          
          <button 
            onClick={onLogout}
            className="text-white hover:text-emerald-200 transition-colors p-2"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-20 px-4 md:px-12 max-w-7xl mx-auto">
        
        {/* Page Title */}
        <section className="mt-8 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-[#002d1a] font-bold">Profit Optimization</h2>
            <p className="text-sm text-gray-600 mt-1">Maximized returns through data-driven yield analysis.</p>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="bg-[#1a432f] text-emerald-200 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 border border-emerald-800 hover:bg-[#002d1a] transition-all"
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>ADJUST ESTIMATION CONTROLS</span>
          </button>
        </section>

        {/* Adjusting indicator panel */}
        {showConfig && (
          <section className="mb-6 p-6 bg-white border border-[#c1c8c1] rounded-xl shadow-md animate-fade-in">
            <h3 className="font-serif text-lg font-bold text-[#002d1a] mb-4 flex items-center gap-2 border-b pb-2">
              <Sliders className="w-5 h-5 text-emerald-700" />
              <span>Telemetry Estimation Sliders</span>
            </h3>
            <p className="text-xs text-gray-500 mb-6">Drag sliders to immediately view simulated updates across profit margins, dynamic graphs, and optimization thresholds.</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-600 tracking-wider flex justify-between">
                  <span>Est. Yield:</span>
                  <span className="font-bold text-emerald-950 font-mono">{yieldVal} t/ha</span>
                </label>
                <input 
                  type="range"
                  min="20"
                  max="80"
                  step="0.5"
                  value={yieldVal}
                  onChange={(e) => setYieldVal(parseFloat(e.target.value))}
                  className="w-full mt-2 cursor-pointer accent-[#4b6450]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-600 tracking-wider flex justify-between">
                  <span>Current ROI:</span>
                  <span className="font-bold text-emerald-950 font-mono">{roiVal}%</span>
                </label>
                <input 
                  type="range"
                  min="10"
                  max="50"
                  step="0.5"
                  value={roiVal}
                  onChange={(e) => setRoiVal(parseFloat(e.target.value))}
                  className="w-full mt-2 cursor-pointer accent-[#4b6450]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-600 tracking-wider flex justify-between">
                  <span>Efficiency:</span>
                  <span className="font-bold text-emerald-950 font-mono">{efficiencyVal}%</span>
                </label>
                <input 
                  type="range"
                  min="50"
                  max="100"
                  step="1"
                  value={efficiencyVal}
                  onChange={(e) => setEfficiencyVal(parseInt(e.target.value))}
                  className="w-full mt-2 cursor-pointer accent-[#4b6450]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-600 tracking-wider block">
                  Market Trend Index:
                </label>
                <select 
                  value={marketIndex}
                  onChange={(e) => setMarketIndex(e.target.value as any)}
                  className="w-full mt-2 bg-gray-50 border border-gray-300 rounded p-2 text-sm text-[#002d1a] focus:ring-1 focus:ring-emerald-800 font-bold"
                >
                  <option value="High">High (Bullish prices)</option>
                  <option value="Moderate">Moderate (Stable)</option>
                  <option value="Volatile">Volatile (Variable Indexes)</option>
                </select>
              </div>
            </div>
          </section>
        )}

        {/* Bento Grid: Key Metrics */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          
          {/* Estimated Yield Card */}
          <div className="bg-white border border-[#c1c8c1] p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#4b6450]" />
              <span className="text-[10px] font-bold text-[#414943] tracking-widest uppercase">EST. YIELD</span>
            </div>
            <div className="font-serif text-3xl font-extrabold text-[#002d1a] tracking-tight">
              {yieldVal}
              <span className="text-xs font-sans font-normal text-gray-500 ml-1">t/ha</span>
            </div>
            <div className="text-[10px] text-[#516a56] bg-[#cdead0] px-2 py-0.5 rounded-full inline-block mt-2 font-bold whitespace-nowrap">
              +{((yieldVal / 42.8 - 1) * 100 + 12).toFixed(0)}% vs last cycle
            </div>
          </div>

          {/* Current ROI Card */}
          <div className="bg-white border border-[#c1c8c1] p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-[#4b6450]" />
              <span className="text-[10px] font-bold text-[#414943] tracking-widest uppercase">CURRENT ROI</span>
            </div>
            <div className="font-serif text-3xl font-extrabold text-[#002d1a] tracking-tight">
              {roiVal}
              <span className="text-xs font-sans font-normal text-gray-500 ml-1">%</span>
            </div>
            <div className="text-[10px] text-gray-500 mt-2 font-mono">
              Projected: {(roiVal * 1.14).toFixed(1)}%
            </div>
          </div>

          {/* Market Trends Card */}
          <div className="bg-white border border-[#c1c8c1] p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <LineChart className="w-4 h-4 text-[#4b6450]" />
              <span className="text-[10px] font-bold text-[#414943] tracking-widest uppercase">MARKET INDEX</span>
            </div>
            <div className="font-serif text-3xl font-extrabold text-[#002d1a] tracking-tight">
              {marketIndex}
            </div>
            <div className="text-[10px] text-gray-500 mt-2 font-sans font-medium">
              {marketIndex === 'High' ? 'Corn prices up 4.2%' : marketIndex === 'Moderate' ? 'Prices stabilizing' : 'High index variability'}
            </div>
          </div>

          {/* Resource Efficiency Card */}
          <div className="bg-white border border-[#c1c8c1] p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-amber-600" />
              <span className="text-[10px] font-bold text-[#414943] tracking-widest uppercase">EFFICIENCY</span>
            </div>
            <div className="font-serif text-3xl font-extrabold text-[#002d1a] tracking-tight">
              {efficiencyVal}
              <span className="text-xs font-sans font-normal text-gray-500 ml-1">%</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-[#4b6450] h-full rounded-full transition-all duration-500" 
                style={{ width: `${efficiencyVal}%` }}
              ></div>
            </div>
          </div>
        </section>

        {/* Profit Growth Visualization wrapper */}
        <section className="bg-white border border-[#c1c8c1] rounded-xl p-6 mb-8 overflow-hidden shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#002d1a]">Profit Growth Trend</h3>
              <p className="text-xs text-gray-500 mt-1 leading-snug">Calculated cumulative returns: <span className="font-mono font-bold text-[#002d1a]">${baselineProfit.toLocaleString(undefined, {maximumFractionDigits:0})}/ha</span> estimated</p>
            </div>
            <span className="px-3 py-1 bg-[#cdead0] text-[#516a56] rounded-full text-[10px] font-bold tracking-wider font-sans uppercase">
              12 MONTHS
            </span>
          </div>

          <div className="relative h-48 w-full flex flex-col justify-end chart-gradient border-b border-gray-300">
            {/* Dynamic Graph drawing */}
            <svg className="absolute inset-0 w-full h-[85%] overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
              {/* Grid lines */}
              <line x1="0" y1="20" x2="400" y2="20" stroke="#f1f3f0" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="50" x2="400" y2="50" stroke="#f1f3f0" strokeWidth="1" strokeDasharray="4" />
              <line x1="0" y1="80" x2="400" y2="80" stroke="#f1f3f0" strokeWidth="1" strokeDasharray="4" />

              {/* Curve path */}
              <path 
                d={generateGraphPath()} 
                fill="none" 
                stroke="#4b6450" 
                strokeWidth="3.5" 
                className="transition-all duration-300"
              />
              <path 
                d={`${generateGraphPath()} V100 H0 Z`} 
                fill="rgba(75, 100, 80, 0.05)" 
                className="transition-all duration-300"
              />
            </svg>

            {/* Timestamps */}
            <div className="z-10 w-full flex justify-between text-[10px] text-gray-500 pt-2 pb-1 bg-white border-t border-gray-200 px-2 font-mono">
              <span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>NOV</span>
            </div>
          </div>
        </section>

        {/* Optimization Tips Section */}
        <section className="mb-8">
          <h3 className="font-serif text-xl font-bold text-[#002d1a] mb-4">Optimization Strategies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Strategy Card 1 */}
            <div className="flex items-start gap-4 bg-white border border-[#c1c8c1] p-5 rounded-xl hover:border-emerald-800 transition-colors">
              <div className="bg-[#1a432f] p-3 rounded-lg text-emerald-300 flex-shrink-0">
                <Droplet className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <h4 className="font-serif text-[#002d1a] font-bold text-base">Optimize Irrigation Cycles</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Reducing water usage by 15% during pre-dawn hours could save $240/acre without affecting yield quality.
                </p>
                <button 
                  onClick={handleApplyIrrigationModel}
                  className="mt-3 text-[#002d1a] hover:text-emerald-800 font-bold text-xs flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                >
                  APPLY MODEL <ChevronRight className="w-4 h-4 text-emerald-700" />
                </button>
              </div>
            </div>

            {/* Strategy Card 2 */}
            <div className="flex items-start gap-4 bg-white border border-[#c1c8c1] p-5 rounded-xl hover:border-amber-700 transition-colors">
              <div className="bg-amber-100 p-3 rounded-lg text-amber-800 flex-shrink-0">
                <Tag className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <h4 className="font-serif text-[#002d1a] font-bold text-base">Strategic Market Release</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Predictive analysis suggests a 4.5% price spike in early October. Consider holding 30% of inventory for late-stage sale.
                </p>
                <button 
                  onClick={() => setActivePromoModal('market')}
                  className="mt-3 text-[#002d1a] hover:text-amber-800 font-bold text-xs flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                >
                  VIEW PROJECTION <ChevronRight className="w-4 h-4 text-amber-600" />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Bottom Banner Image Section */}
        <section className="mb-4">
          <div className="relative w-full h-48 rounded-xl overflow-hidden group border border-[#c1c8c1] shadow-sm">
            <img 
              alt="Agricultural Field" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd-bigVpqtR3GjPZEMPna13NITxcRFOD_V5yUIv13GkoQDAwp9g9MS2e3iR7EPfqHC9qQ5Tqzw2PpFHRFzqAYlVy6yeWoH7Nc5_i2T-lmUIP628QjaR_Y0rF4FnQtdH8zj-KgWql68nG5fxReZhYtD5DGgiNVOMLDIPdmdL4KlZaQywI66aHXLwL1k_izLrLFKBQz6HBJBYQjUMPA4r_TLuxturTpl6fE1g5hXHEb19Q7f8zMLhzUvP-tubZzLjxR0xXSFrWbZwQ"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002d1a]/95 via-[#002d1a]/40 to-transparent flex flex-col justify-end p-5">
              <span className="text-emerald-300 font-sans text-[10px] font-bold tracking-widest uppercase opacity-90">Live Feed</span>
              <h4 className="text-white text-xl md:text-2xl font-serif font-bold leading-tight">Sector 04 Health Analysis</h4>
            </div>
          </div>
        </section>

      </main>

      {/* Model Popups (Irrigation / Market) */}
      {activePromoModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c1c8c1] p-6 max-w-md w-full shadow-2xl">
            {activePromoModal === 'irrigation' ? (
              <>
                <div className="flex items-center gap-3 text-emerald-950 mb-4">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <Sparkles className="w-6 h-6 text-emerald-800" />
                  </div>
                  <h3 className="font-serif text-lg font-bold">Irrigation Model Applied</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Successfully synchronized pre-dawn pulse sequences. Water pressure calibrated, and cycle start-times adjusted to **4:30 AM**. 
                  Est. savings of **$240/acre** initiated. Efficiency factor bolstered to **{efficiencyVal}%**.
                </p>
                <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-900 font-bold mb-4 flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 text-emerald-800 animate-spin" />
                  <span>Interactive Plot B-12 status set to Healthy!</span>
                </div>
                <button 
                  onClick={() => {
                    setActivePromoModal(null);
                    onNavigateToTab('farm');
                  }}
                  className="w-full bg-[#002d1a] text-white py-2 rounded font-sans font-bold text-xs uppercase tracking-wider hover:bg-emerald-900 transition-colors"
                >
                  Go check Farm Management Overview
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 text-[#002d1a] mb-4">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <LineChart className="w-6 h-6 text-amber-700" />
                  </div>
                  <h3 className="font-serif text-lg font-bold">Strategic Market Release Projections</h3>
                </div>
                
                <div className="space-y-3 mb-6">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Based on machine learning models matching current US corn futures with local soil variables, we suggest locking **30%** of total inventory for early October.
                  </p>
                  
                  <div className="border border-gray-200 rounded p-3 bg-gray-50 text-xs shadow-inner">
                    <div className="flex justify-between border-b pb-1 mb-1 font-semibold text-gray-600">
                      <span>Timeline</span>
                      <span>Target Price Offset</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Immediate Release (JUL)</span>
                      <span className="font-mono text-gray-500 font-bold">$18.20/bu (Baseline)</span>
                    </div>
                    <div className="flex justify-between py-1 font-bold text-emerald-950">
                      <span>Locked Storage (OCT)</span>
                      <span className="font-mono text-emerald-700 font-bold">$19.02/bu (+4.5% Spike)</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      alert("Strategy Lock confirmed. 30% of Sector 4 inventory assigned to strategic warehouse holding.");
                      setActivePromoModal(null);
                    }}
                    className="flex-1 bg-amber-600 text-white py-2 rounded font-sans font-bold text-xs uppercase tracking-wider hover:bg-amber-700 transition"
                  >
                    Lock Strategy (30%)
                  </button>
                  <button 
                    onClick={() => setActivePromoModal(null)}
                    className="flex-1 border border-gray-300 text-gray-600 py-2 rounded font-sans font-bold text-xs uppercase tracking-wider hover:bg-gray-50 transition"
                  >
                    Dismiss
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
