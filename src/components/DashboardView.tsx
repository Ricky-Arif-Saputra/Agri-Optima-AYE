import React, { useState } from 'react';
import { 
  Calculator,
  Plus,
  Trash2,
  TrendingUp,
  Settings,
  LogOut,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
// @ts-ignore
import solver from 'javascript-lp-solver';

interface Variable {
  id: string;
  name: string;
  profit: number;
}

interface Constraint {
  id: string;
  name: string;
  coefficients: Record<string, number>;
  operator: '<=' | '>=' | '=';
  rhs: number;
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
    { id: 'v1', name: 'Jagung (Ha)', profit: 5000000 },
    { id: 'v2', name: 'Kedelai (Ha)', profit: 4000000 }
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

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const addVariable = () => {
    const newId = `v${Date.now()}`;
    setVariables([...variables, { id: newId, name: `Tanaman Baru`, profit: 0 }]);
    
    // Update existing constraints with new variable (default coefficient 0)
    setConstraints(constraints.map(c => ({
      ...c,
      coefficients: { ...c.coefficients, [newId]: 0 }
    })));
  };

  const removeVariable = (id: string) => {
    if (variables.length <= 1) {
      setError("Minimal harus ada 1 fungsi tujuan.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setVariables(variables.filter(v => v.id !== id));
    
    // Remove from constraints
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

  const calculateOptimization = () => {
    try {
      // Build the model for javascript-lp-solver
      const model: any = {
        optimize: "profit",
        opType: "max",
        constraints: {},
        variables: {},
      };

      // 1. Setup Constraints in model
      constraints.forEach(c => {
        let maxObj: any = {};
        if (c.operator === '<=') {
          maxObj = { max: c.rhs };
        } else if (c.operator === '>=') {
          maxObj = { min: c.rhs };
        } else if (c.operator === '=') {
          maxObj = { equal: c.rhs };
        }
        model.constraints[c.id] = maxObj;
      });

      // 2. Setup Variables in model
      variables.forEach(v => {
        const varData: any = { profit: Number(v.profit) };
        constraints.forEach(c => {
          varData[c.id] = Number(c.coefficients[v.id] || 0);
        });
        model.variables[v.id] = varData;
      });

      // 3. Solve
      const solution = solver.Solve(model);
      setResult(solution);
      setError(null);
      
    } catch (err: any) {
      console.error(err);
      setError("Gagal melakukan kalkulasi. Periksa input Anda.");
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f4f1] pb-28">
      {/* TopAppBar */}
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
          <button onClick={onLogout} className="text-white hover:text-emerald-200 transition-colors p-2" title="Sign out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-20 px-4 md:px-12 max-w-7xl mx-auto">
        <section className="mt-8 mb-6">
          <h2 className="font-serif text-3xl md:text-4xl text-[#002d1a] font-bold">Optimasi Laba</h2>
          <p className="text-sm text-gray-600 mt-2">Kalkulator program linear (Simplex) untuk memaksimalkan keuntungan berdasarkan kendala sumber daya pertanian Anda.</p>
        </section>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mb-6 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5" />
            <span className="font-bold text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Fungsi Tujuan (Objective Function) */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#c1c8c1] p-6">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <h3 className="font-serif text-xl font-bold text-[#002d1a] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Fungsi Tujuan (Maksimalkan Z)
                </h3>
                <button 
                  onClick={addVariable}
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-emerald-200"
                >
                  <Plus className="w-4 h-4" /> Tambah Variabel
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Tentukan variabel apa saja yang ingin dimaksimalkan beserta nilai keuntungannya (Z = c₁X₁ + c₂X₂ ...)</p>
              
              <div className="space-y-4">
                {variables.map((v, i) => (
                  <div key={v.id} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex-1 w-full">
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Nama Variabel (X{i+1})</label>
                      <input 
                        type="text"
                        value={v.name}
                        onChange={(e) => updateVariable(v.id, 'name', e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm text-[#002d1a] focus:ring-2 focus:ring-emerald-500 outline-none transition"
                        placeholder="Contoh: Jagung"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Nilai / Koefisien Profit (c{i+1})</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">Rp</span>
                        <input 
                          type="number"
                          value={v.profit}
                          onChange={(e) => updateVariable(v.id, 'profit', Number(e.target.value))}
                          className="w-full bg-white border border-gray-300 rounded-lg p-2 pl-9 text-sm text-[#002d1a] font-mono focus:ring-2 focus:ring-emerald-500 outline-none transition"
                          placeholder="5000000"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => removeVariable(v.id)}
                      className="mt-5 md:mt-0 p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Hapus variabel"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Fungsi Kendala (Constraints) */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#c1c8c1] p-6">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                <h3 className="font-serif text-xl font-bold text-[#002d1a] flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-600" />
                  Fungsi Kendala
                </h3>
                <button 
                  onClick={addConstraint}
                  className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-amber-200"
                >
                  <Plus className="w-4 h-4" /> Tambah Kendala
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">Tentukan batasan sumber daya. Masukkan koefisien untuk masing-masing variabel, pilih operator, dan tentukan nilai maksimal/minimal (Konstanta Kanan).</p>
              
              <div className="space-y-6">
                {constraints.map((c, i) => (
                  <div key={c.id} className="bg-[#fcfdfc] p-4 rounded-xl border border-gray-200 shadow-sm relative">
                    <div className="flex justify-between items-center mb-3">
                      <input 
                        type="text"
                        value={c.name}
                        onChange={(e) => updateConstraint(c.id, 'name', e.target.value)}
                        className="bg-transparent border-b border-dashed border-gray-400 text-sm font-bold text-[#002d1a] focus:outline-none focus:border-emerald-600 px-1"
                        placeholder="Nama Kendala..."
                      />
                      <button onClick={() => removeConstraint(c.id)} className="text-red-400 hover:text-red-600 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      {variables.map((v, vIndex) => (
                        <React.Fragment key={v.id}>
                          <div className="flex items-center gap-1">
                            <input 
                              type="number"
                              value={c.coefficients[v.id] === undefined ? '' : c.coefficients[v.id]}
                              onChange={(e) => updateConstraintCoef(c.id, v.id, Number(e.target.value))}
                              className="w-20 border border-gray-300 rounded p-1.5 text-center font-mono text-[#002d1a] focus:ring-2 focus:ring-emerald-500 outline-none"
                              placeholder="0"
                            />
                            <span className="font-bold text-gray-600 text-xs uppercase" title={v.name}>(X{vIndex+1})</span>
                          </div>
                          {vIndex < variables.length - 1 && <span className="text-gray-400 font-bold">+</span>}
                        </React.Fragment>
                      ))}
                      
                      <select 
                        value={c.operator}
                        onChange={(e) => updateConstraint(c.id, 'operator', e.target.value)}
                        className="border border-gray-300 rounded p-1.5 font-bold text-[#002d1a] bg-gray-50 mx-2 outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="<=">&le; (Kurang dari)</option>
                        <option value=">=">&ge; (Lebih dari)</option>
                        <option value="=">= (Sama dengan)</option>
                      </select>

                      <input 
                        type="number"
                        value={c.rhs}
                        onChange={(e) => updateConstraint(c.id, 'rhs', Number(e.target.value))}
                        className="w-28 border border-gray-300 rounded p-1.5 text-center font-mono font-bold text-[#002d1a] focus:ring-2 focus:ring-emerald-500 outline-none bg-emerald-50"
                        placeholder="Nilai Kanan"
                      />
                    </div>
                  </div>
                ))}
                
                {constraints.length === 0 && (
                  <div className="text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 text-sm">
                    Belum ada kendala. Silakan tambah kendala.
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={calculateOptimization}
              className="w-full bg-[#1a432f] hover:bg-[#002d1a] text-emerald-200 font-bold text-lg py-4 rounded-2xl shadow-lg transition-all flex justify-center items-center gap-3 border border-emerald-900 group"
            >
              <Calculator className="w-6 h-6 group-hover:scale-110 transition-transform" />
              HITUNG OPTIMASI
            </button>
          </div>

          {/* Right Column: Results */}
          <div>
            <div className="bg-[#002d1a] text-white rounded-2xl shadow-xl border border-[#1a432f] overflow-hidden sticky top-24">
              <div className="p-6 border-b border-[#1a432f] bg-gradient-to-br from-[#002d1a] to-[#0a4025]">
                <h3 className="font-serif text-xl font-bold flex items-center gap-2 mb-1">
                  <Calculator className="w-5 h-5 text-emerald-400" />
                  Hasil Optimasi
                </h3>
                <p className="text-emerald-200/70 text-xs">Simplex Algorithm Result</p>
              </div>
              
              <div className="p-6">
                {!result ? (
                  <div className="text-center py-12 opacity-50">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-emerald-300" />
                    <p className="text-sm">Klik Hitung Optimasi untuk melihat hasil program linear.</p>
                  </div>
                ) : !result.feasible ? (
                  <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-xl text-center">
                    <h4 className="text-red-400 font-bold mb-1">Tidak Layak (Infeasible)</h4>
                    <p className="text-xs text-red-200/80">Kendala yang Anda berikan saling bertentangan sehingga tidak ditemukan solusi.</p>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-emerald-300/80 mb-1 font-bold">Laba Maksimal (Z)</h4>
                      <div className="text-3xl font-serif font-extrabold text-emerald-300 drop-shadow-md">
                        Rp {result.result?.toLocaleString('id-ID')}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-[10px] uppercase tracking-widest text-emerald-300/80 font-bold border-b border-[#1a432f] pb-2">Nilai Keputusan (X)</h4>
                      {variables.map((v, i) => {
                        const val = result[v.id] || 0;
                        return (
                          <div key={v.id} className="flex justify-between items-center bg-[#1a432f]/50 p-3 rounded-lg border border-[#1a432f]">
                            <div>
                              <div className="text-sm font-bold text-white">{v.name}</div>
                              <div className="text-[10px] text-emerald-200/60">X{i+1}</div>
                            </div>
                            <div className="font-mono text-xl font-bold text-white">{val}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
              {result && result.feasible && (
                <div className="bg-[#1a432f] p-4 text-xs text-emerald-100/70 leading-relaxed border-t border-[#002d1a]">
                  <strong className="text-emerald-300 block mb-1">Kesimpulan:</strong>
                  Untuk mencapai laba maksimal sebesar <strong>Rp {result.result?.toLocaleString('id-ID')}</strong>, 
                  Anda harus memproduksi {variables.filter(v => result[v.id]).map(v => ` ${result[v.id] || 0} unit ${v.name}`).join(' dan ')}.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
