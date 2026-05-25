import React, { useState } from 'react';
import { ShieldCheck, Lock, CloudRain, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (email: string) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('grower@agrioptima.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate authentication lag
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between agri-leaf-pattern pt-4">
      {/* Top Header */}
      <header className="py-4 px-6 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              alt="AGRI OPTIMA Logo" 
              className="w-10 h-10 object-contain text-emerald-800"
              src="https://lh3.googleusercontent.com/aida/ADBb0ug7b3-ZpnDqEY-0T6rEkNzKAOrZEKiJ5CSKj5BeNQkqx7iPr0f9eA-t6CnvjMsvy_-RLmo_Jh7p4r6ID39j9_qfArvTzWNZhUZgCJIdvcM8srXfFh20DqhwRdLRFyTt4MjiOzA3gYA6tmWZPoB5WypHuRhyLVxFFRNhAuM8yIC58nXz0JsB4pzbhD3ZXWTvNpwdkPWk6X2iQ4rY2O5vL0_6eJ-kJ2dnkxUDZQH4FLqs2EVz9IqnmmYa6A"
            />
            <span className="font-serif text-2xl font-bold tracking-tight text-emerald-950">AGRI OPTIMA</span>
          </div>
          <div className="hidden md:flex gap-4">
            <span className="text-emerald-800 text-xs font-semibold uppercase tracking-wider">Grounded Precision v2.4</span>
          </div>
        </div>
      </header>

      {/* Main Form Center */}
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px] bg-white border border-gray-300 rounded-xl p-8 shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <img 
              alt="AGRI OPTIMA Logo" 
              className="w-24 h-24 mb-3 object-contain" 
              src="https://lh3.googleusercontent.com/aida/ADBb0ug7b3-ZpnDqEY-0T6rEkNzKAOrZEKiJ5CSKj5BeNQkqx7iPr0f9eA-t6CnvjMsvy_-RLmo_Jh7p4r6ID39j9_qfArvTzWNZhUZgCJIdvcM8srXfFh20DqhwRdLRFyTt4MjiOzA3gYA6tmWZPoB5WypHuRhyLVxFFRNhAuM8yIC58nXz0JsB4pzbhD3ZXWTvNpwdkPWk6X2iQ4rY2O5vL0_6eJ-kJ2dnkxUDZQH4FLqs2EVz9IqnmmYa6A"
            />
            <h1 className="font-serif text-3xl font-bold text-emerald-950 tracking-tight text-center">AGRI OPTIMA</h1>
            <p className="text-xs font-sans text-emerald-800 uppercase tracking-widest mt-1 text-center">Precision Management for Modern Growth</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                {errorMsg}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] tracking-wider text-emerald-900 font-bold block uppercase" htmlFor="email">Email Address</label>
              <input 
                className="w-full py-2 bg-transparent text-emerald-950 font-serif text-lg outline-none border-b border-gray-300 focus:border-emerald-800 transition-colors"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="grower@agrioptima.com" 
                required
                type="email"
                value={email}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] tracking-wider text-emerald-900 font-bold block uppercase" htmlFor="password">Password</label>
                <button 
                  className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 uppercase" 
                  onClick={(e) => { e.preventDefault(); alert("Use standard credentials to test, password: 'password123'"); }}
                  type="button"
                >
                  FORGOT?
                </button>
              </div>
              <input 
                className="w-full py-2 bg-transparent text-emerald-950 font-serif text-lg outline-none border-b border-gray-300 focus:border-emerald-800 transition-colors"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required
                type="password"
                value={password}
              />
            </div>

            <div className="pt-2">
              <button 
                className="w-full bg-emerald-950 text-white py-4 rounded-lg font-serif text-lg transition-transform duration-200 ease-out active:scale-98 hover:bg-emerald-900 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <span className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>Login to Dashboard</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500 font-sans">
              New to the platform? 
              <button onClick={() => alert("Please sign up with external services or request access.")} className="text-emerald-800 font-bold hover:underline ml-1">Sign Up</button>
            </p>
          </div>

          <div className="mt-4 flex justify-center gap-6 text-gray-400">
            <ShieldCheck className="w-5 h-5" />
            <Lock className="w-5 h-5" />
            <CloudRain className="w-5 h-5" />
          </div>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="py-6 px-6 border-t border-gray-200 bg-[#eceeeb] mt-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500">
          <p className="text-[10px] tracking-wider uppercase font-sans font-semibold">© 2026 AGRI OPTIMA DIGITAL. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6 text-[10px] tracking-wider uppercase font-sans font-semibold">
            <a className="hover:text-emerald-900" href="#">PRIVACY POLICY</a>
            <a className="hover:text-emerald-900" href="#">SYSTEM STATUS</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
