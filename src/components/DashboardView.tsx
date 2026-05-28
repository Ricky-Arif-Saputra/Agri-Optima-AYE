import React, { useState, useEffect } from 'react';
import { 
  Calculator,
  Plus,
  Trash2,
  TrendingUp,
  Settings,
  LogOut,
  AlertCircle,
  History,
  Calendar,
  ChevronDown,
  ChevronUp,
  Upload,
  CheckCircle2,
  CreditCard
} from 'lucide-react';
// QRIS image will be loaded from public folder via absolute path

interface Variable {
  id: string;
  name: string;
  profit: number;
}

interface Constraint {
  id: string;
  name: string;
  coefficients: Record<string, number>;
  operator: '<' | '<=' | '=' | '>=' | '>';
  rhs: number;
}

interface OptimizationResult {
  id: string;
  date: string;
  timestamp: number;
  resultData: any;
  variables: Variable[];
}

interface DashboardViewProps {
  onLogout: () => void;
  onNavigateToTab: (tab: string) => void;
  yieldVal: number;
  setYieldVal: (val: number) => void;
  roiVal: number;
  setRoiVal: (val: number) => void;
  efficiencyVal: number;
  setEfficiencyVal: (val: number) => void;
  marketIndex: 'High' | 'Moderate' | 'Volatile';
  setMarketIndex: (val: 'High' | 'Moderate' | 'Volatile') => void;
}

export default function DashboardView({ onLogout }: DashboardViewProps) {
  const [variables, setVariables] = useState<Variable[]>([
    { id: 'v1', name: 'Jagung', profit: 5000000 },
    { id: 'v2', name: 'Kedelai', profit: 4000000 }
  ]);

  const [constraints, setConstraints] = useState<Constraint[]>([
    {
      id: 'c1',
      name: 'Lahan Maksimal (Ha)',
      coefficients: { v1: 1, v2: 1 },
      operator: '<=',
      rhs: 100
    },
    {
      id: 'c2',
      name: 'Tenaga Kerja (Jam)',
      coefficients: { v1: 30, v2: 20 },
      operator: '<=',
      rhs: 2400
    }
  ]);

  const [history, setHistory] = useState<OptimizationResult[]>([]);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Payment Modal State
  const [showPayment, setShowPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ receiptName: '', transactionId: '' });

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('agri_optima_history');
    if (saved) {
      try {
        const parsed: OptimizationResult[] = JSON.parse(saved);
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        
        // Filter history older than 1 month
        const validHistory = parsed.filter(item => item.timestamp >= thirtyDaysAgo);
        setHistory(validHistory);

        // Resave if some were purged
        if (validHistory.length !== parsed.length) {
          localStorage.setItem('agri_optima_history', JSON.stringify(validHistory));
        }
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  const addVariable = () => {
    const newId = `v${Date.now()}`;
    setVariables([...variables, { id: newId, name: `Tanaman Baru`, profit: 0 }]);
    
    setConstraints(constraints.map(c => ({
      ...c,
      coefficients: { ...c.coefficients, [newId]: 0 }
    })));
  };

  const removeVariable = (id: string) => {
    if (variables.length <= 1) {
      setError("Minimal harus ada 1 tanaman (Fungsi Tujuan).");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setVariables(variables.filter(v => v.id !== id));
    
    setConstraints(constraints.map(c => {
      const newCoefs = { ...c.coefficients };
      delete newCoefs[id];
      return { ...c, coefficients: newCoefs };
    }));
  };

  const updateVariable = (id: string, field: keyof Variable, value: string | number) => {
    setVariables(variables.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const addConstraint = () => {
    const newId = `c${Date.now()}`;
    const initialCoefs: Record<string, number> = {};
    variables.forEach(v => initialCoefs[v.id] = 0);
    
    setConstraints([...constraints, {
      id: newId,
      name: `Kendala Baru`,
      coefficients: initialCoefs,
      operator: '<=',
      rhs: 0
    }]);
  };

  const removeConstraint = (id: string) => {
    setConstraints(constraints.filter(c => c.id !== id));
  };

  const updateConstraint = (id: string, field: keyof Constraint, value: any) => {
    setConstraints(constraints.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const updateConstraintCoef = (constraintId: string, varId: string, value: number) => {
    setConstraints(constraints.map(c => {
      if (c.id === constraintId) {
        return {
          ...c,
          coefficients: { ...c.coefficients, [varId]: value }
        };
      }
      return c;
    }));
  };

  const triggerOptimizationFlow = () => {
    setShowPayment(true);
    setPaymentForm({ receiptName: '', transactionId: '' });
  };

  const confirmPaymentAndSolve = () => {
    if (!paymentForm.receiptName || !paymentForm.transactionId) {
      alert("Harap unggah bukti transfer dan masukkan nomor transaksi.");
      return;
    }

    try {
      const model: any = {
        optimize: "profit",
        opType: "max",
        constraints: {},
        variables: {},
      };

      constraints.forEach(c => {
        let maxObj: any = {};
        // javascript-lp-solver natively supports 'max', 'min', 'equal'
        // For <, we map to max. For >, we map to min. (Linear programming is continuous, so <= and < are identical in LP solver).
        if (c.operator === '<=' || c.operator === '<') {
          maxObj = { max: c.rhs };
        } else if (c.operator === '>=' || c.operator === '>') {
          maxObj = { min: c.rhs };
        } else if (c.operator === '=') {
          maxObj = { equal: c.rhs };
        }
        model.constraints[c.id] = maxObj;
      });

      variables.forEach(v => {
        const varData: any = { profit: Number(v.profit) };
        constraints.forEach(c => {
          varData[c.id] = Number(c.coefficients[v.id] || 0);
        });
        model.variables[v.id] = varData;
      });

      const solution = solver.Solve(model);
      
      const newResult: OptimizationResult = {
        id: `res_${Date.now()}`,
        date: new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }),
        timestamp: Date.now(),
        resultData: solution,
        variables: [...variables] // Save a snapshot of the variables
      };

      const newHistory = [newResult, ...history];
      setHistory(newHistory);
      localStorage.setItem('agri_optima_history', JSON.stringify(newHistory));
      
      // Auto expand the new one
      setExpandedHistoryId(newResult.id);
      
      setShowPayment(false);
      setError(null);
      
    } catch (err: any) {
      console.error(err);
      setShowPayment(false);
      setError("Gagal melakukan kalkulasi. Periksa input variabel/kendala Anda.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f4f1] pb-28 font-sans">
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
        <button onClick={onLogout} className="text-white hover:text-emerald-200 transition-colors p-2" title="Sign out">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="pt-24 px-4 md:px-12 max-w-7xl mx-auto">
        <section className="mb-6">
          <h2 className="font-serif text-3xl md:text-4xl text-[#002d1a] font-bold">Optimasi Laba</h2>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl">Kalkulator program linear untuk memaksimalkan keuntungan berdasarkan kendala sumber daya. Tentukan nama tanaman, profit yang diinginkan, dan batas sumber daya lahan Anda.</p>
        </section>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-6 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5" />
            <span className="font-bold text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Setup */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Fungsi Tujuan */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#c1c8c1] p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#002d1a] flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                    Fungsi Tujuan
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Maksimalkan keuntungan dari tanaman berikut.</p>
                </div>
                <button 
                  onClick={addVariable}
                  className="bg-[#cdead0] text-[#1a432f] hover:bg-[#b0dfb5] px-4 py-2 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Tambah Tanaman
                </button>
              </div>
              
              <div className="space-y-4">
                {variables.map((v) => (
                  <div key={v.id} className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-[#f7f9f7] p-4 rounded-2xl border border-gray-200">
                    <div className="flex-1 w-full">
                      <label className="text-[10px] uppercase font-bold text-emerald-800 block mb-1.5 ml-1">Nama Tanaman</label>
                      <input 
                        type="text"
                        value={v.name}
                        onChange={(e) => updateVariable(v.id, 'name', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm font-semibold text-[#002d1a] focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                        placeholder="Contoh: Jagung"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="text-[10px] uppercase font-bold text-emerald-800 block mb-1.5 ml-1">Nilai Laba / Unit</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">Rp</span>
                        <input 
                          type="number"
                          value={v.profit}
                          onChange={(e) => updateVariable(v.id, 'profit', Number(e.target.value))}
                          className="w-full bg-white border border-gray-300 rounded-xl p-3 pl-10 text-sm font-mono font-bold text-[#002d1a] focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => removeVariable(v.id)}
                      className="mt-6 md:mt-0 p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                      title="Hapus Tanaman"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Fungsi Kendala */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#c1c8c1] p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#002d1a] flex items-center gap-2">
                    <Settings className="w-6 h-6 text-amber-600" />
                    Fungsi Kendala
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Batasan sumber daya yang Anda miliki.</p>
                </div>
                <button 
                  onClick={addConstraint}
                  className="bg-amber-100 text-amber-800 hover:bg-amber-200 px-4 py-2 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Tambah Kendala
                </button>
              </div>
              
              <div className="space-y-6">
                {constraints.map((c) => (
                  <div key={c.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)] relative">
                    <div className="flex justify-between items-center mb-4">
                      <input 
                        type="text"
                        value={c.name}
                        onChange={(e) => updateConstraint(c.id, 'name', e.target.value)}
                        className="bg-transparent border-b-2 border-dashed border-gray-300 text-lg font-serif font-bold text-[#002d1a] focus:outline-none focus:border-emerald-600 px-1 w-2/3"
                        placeholder="Nama Kendala (Contoh: Lahan)"
                      />
                      <button onClick={() => removeConstraint(c.id)} className="text-red-300 hover:text-red-600 bg-red-50 p-2 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm p-4 bg-[#f2f4f1] rounded-xl border border-gray-300/50">
                      {variables.map((v, vIndex) => (
                        <React.Fragment key={v.id}>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-gray-500 px-1 truncate max-w-[100px]">{v.name}</span>
                            <input 
                              type="number"
                              value={c.coefficients[v.id] === undefined ? '' : c.coefficients[v.id]}
                              onChange={(e) => updateConstraintCoef(c.id, v.id, Number(e.target.value))}
                              className="w-24 border border-gray-300 rounded-lg p-2 text-center font-mono font-bold text-[#002d1a] focus:ring-2 focus:ring-emerald-500 outline-none"
                              placeholder="0"
                            />
                          </div>
                          {vIndex < variables.length - 1 && <span className="text-gray-400 font-bold self-end mb-3 text-lg">+</span>}
                        </React.Fragment>
                      ))}
                      
                      <div className="flex flex-col gap-1 mx-2">
                        <span className="text-[10px] uppercase font-bold text-gray-500 px-1 opacity-0">OP</span>
                        <select 
                          value={c.operator}
                          onChange={(e) => updateConstraint(c.id, 'operator', e.target.value)}
                          className="border border-gray-300 rounded-lg p-2 font-bold text-[#002d1a] bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="<">&lt;</option>
                          <option value="<=">&le;</option>
                          <option value="=">=</option>
                          <option value=">=">&ge;</option>
                          <option value=">">&gt;</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-800 px-1">Konstanta (Limit)</span>
                        <input 
                          type="number"
                          value={c.rhs}
                          onChange={(e) => updateConstraint(c.id, 'rhs', Number(e.target.value))}
                          className="w-32 border-2 border-emerald-200 rounded-lg p-2 text-center font-mono font-bold text-[#002d1a] focus:ring-2 focus:ring-emerald-500 outline-none bg-emerald-50"
                          placeholder="Nilai Kanan"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {constraints.length === 0 && (
                  <div className="text-center p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 text-sm">
                    Belum ada kendala. Silakan tambah kendala.
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={triggerOptimizationFlow}
              className="w-full bg-gradient-to-r from-[#1a432f] to-[#002d1a] hover:from-[#002d1a] hover:to-[#000000] text-emerald-100 font-bold text-lg py-5 rounded-3xl shadow-xl transition-all flex justify-center items-center gap-3 border border-emerald-900 group"
            >
              <Calculator className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              HITUNG OPTIMASI
            </button>
          </div>

          {/* Right Column: History Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-lg border border-[#c1c8c1] sticky top-24 overflow-hidden flex flex-col max-h-[85vh]">
              
              <div className="p-6 bg-[#002d1a] text-white">
                <h3 className="font-serif text-xl font-bold flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-400" />
                  Riwayat Optimasi
                </h3>
                <p className="text-emerald-200/70 text-xs mt-1">Daftar perhitungan yang aktif (Berlaku 1 Bulan).</p>
              </div>

              <div className="p-4 flex-1 overflow-y-auto bg-gray-50/50">
                {history.length === 0 ? (
                  <div className="text-center py-16 opacity-40">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-emerald-900" />
                    <p className="text-sm font-semibold">Belum ada hasil optimasi.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((item) => {
                      const isExpanded = expandedHistoryId === item.id;
                      const res = item.resultData;
                      
                      return (
                        <div key={item.id} className={`group border rounded-[1.5rem] overflow-hidden transition-all duration-500 ${isExpanded ? 'bg-white border-emerald-300 shadow-[0_12px_40px_-15px_rgba(16,185,129,0.3)] scale-[1.02] z-10 relative' : 'bg-gradient-to-br from-gray-50 to-white border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200'}`}>
                          
                          {/* Header Accordion */}
                          <button 
                            onClick={() => setExpandedHistoryId(isExpanded ? null : item.id)}
                            className={`w-full p-5 flex justify-between items-center text-left transition-colors relative ${isExpanded ? 'bg-gradient-to-r from-emerald-50/80 to-transparent' : 'hover:bg-emerald-50/30'}`}
                          >
                            {isExpanded && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-[1.5rem]"></div>}
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-2xl transition-all duration-500 flex items-center justify-center ${isExpanded ? 'bg-gradient-to-br from-emerald-400 to-[#1a432f] text-white shadow-lg shadow-emerald-500/40 rotate-12 scale-110' : 'bg-white border border-gray-200 text-gray-400 group-hover:text-emerald-500 group-hover:border-emerald-200 group-hover:bg-emerald-50'}`}>
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                              <div>
                                <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 transition-colors ${isExpanded ? 'text-emerald-600' : 'text-gray-400'}`}>Sesi Optimasi</span>
                                <span className="font-sans font-black text-[#002d1a] text-sm tracking-tight">{item.date}</span>
                              </div>
                            </div>
                            <div className={`p-2 rounded-full transition-all duration-300 ${isExpanded ? 'bg-white shadow-md rotate-180' : 'bg-gray-50 group-hover:bg-emerald-100'}`}>
                              <ChevronDown className={`w-4 h-4 transition-colors ${isExpanded ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-600'}`} />
                            </div>
                          </button>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="p-5 border-t border-emerald-100 bg-white">
                              {!res.feasible ? (
                                <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-sm">
                                  <strong>Tidak Layak (Infeasible)</strong>: Kombinasi kendala tidak memungkinkan untuk dihitung solusinya.
                                </div>
                              ) : (
                                <div className="space-y-6">
                                  <div className="bg-gradient-to-br from-[#002d1a] to-[#1a432f] rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-400/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
                                    
                                    <div className="relative z-10 space-y-8">
                                      {/* Total Profit Box */}
                                      <div className="text-center space-y-3">
                                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-400/20 backdrop-blur-md">
                                          <p className="text-emerald-300 font-bold text-[10px] tracking-widest uppercase">Total Laba Maksimal</p>
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-xl font-serif">
                                          Rp {res.result?.toLocaleString('id-ID')}
                                        </h2>
                                      </div>

                                      {/* Production Details */}
                                      <div className="pt-6 border-t border-emerald-500/20">
                                        <h3 className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.3em] mb-4 text-center">Detail Produksi</h3>
                                        <div className="space-y-3">
                                          {item.variables.map((v) => {
                                            const val = res[v.id] || 0;
                                            return (
                                              <div key={v.id} className="bg-white/5 rounded-2xl p-4 flex justify-between items-center border border-white/5 backdrop-blur-lg hover:bg-white/10 hover:border-emerald-500/30 transition-all shadow-inner">
                                                <p className="text-base font-bold text-slate-200">{v.name}</p>
                                                <p className="text-2xl font-black text-white font-mono">{val} <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest ml-1 font-sans">Unit</span></p>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>

                                      {/* Summary Text */}
                                      <div className="bg-black/20 rounded-[1.5rem] p-5 text-xs text-emerald-100/80 leading-relaxed border border-white/5 backdrop-blur-xl shadow-inner text-center">
                                        Berdasarkan kalkulasi, menanam <strong>{item.variables.filter(v => res[v.id]).map(v => `${res[v.id] || 0} unit ${v.name}`).join(' dan ')}</strong> adalah strategi paling efisien untuk menghasilkan profit <span className="font-black text-yellow-400 font-serif">Rp {res.result?.toLocaleString('id-ID')}</span>.
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Gateway Modal (QRIS) */}
      {showPayment && (
        <div className="fixed inset-0 bg-[#002d1a]/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl animate-fade-in flex flex-col">

            
            <div className="bg-[#1a432f] text-white p-5 text-center relative shrink-0 rounded-t-3xl">
              <h3 className="font-serif text-xl font-bold">Pembayaran Layanan</h3>
              <p className="text-emerald-200 text-xs">Selesaikan pembayaran untuk melihat hasil optimasi</p>
              <button 
                onClick={() => setShowPayment(false)}
                className="absolute top-4 right-4 text-emerald-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest block mb-1">Nominal Pembayaran</span>
                <span className="text-4xl font-serif font-extrabold text-[#002d1a]">Rp 10.000</span>
              </div>

              {/* QRIS Image */}
              <div className="bg-gray-50 border-2 border-dashed border-emerald-200 rounded-2xl p-4 flex flex-col items-center justify-center mb-6">
                <div className="w-full max-w-full bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center justify-center overflow-hidden">
                  <div className="bg-[#002d1a] w-full text-center text-[10px] text-white font-bold py-1">QRIS STANDAR NASIONAL</div>
                                      <img src="/QRIS.jpeg" alt="QRIS" className="w-full h-auto object-cover" />
                </div>
                <p className="text-xs text-gray-400 mt-3 font-medium">Scan menggunakan m-banking atau e-wallet</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Unggah Bukti Transfer (JPEG/PNG)</label>
                  <label className="border border-gray-300 rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition text-sm text-gray-500 font-medium">
                    <Upload className="w-5 h-5 text-emerald-600" />
                    {paymentForm.receiptName || "Pilih File Gambar..."}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => setPaymentForm({...paymentForm, receiptName: e.target.files?.[0]?.name || ''})}
                    />
                  </label>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1.5">Nomor Transaksi / Referensi</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      value={paymentForm.transactionId}
                      onChange={(e) => setPaymentForm({...paymentForm, transactionId: e.target.value})}
                      placeholder="Contoh: TR-99882233"
                      className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-3 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 shrink-0 rounded-b-3xl">
              <button 
                onClick={() => setShowPayment(false)}
                className="flex-1 py-3 text-sm font-bold text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button 
                onClick={confirmPaymentAndSolve}
                className="flex-1 py-3 text-sm font-bold text-emerald-950 bg-[#cdead0] rounded-xl hover:bg-[#b0dfb5] transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" /> Bayar & Lihat Hasil
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
