import React from 'react';
import { 
  User, 
  Map, 
  Settings as SettingsIcon, 
  LifeBuoy, 
  History, 
  LogOut, 
  ShieldAlert, 
  HelpCircle,
  Database
} from 'lucide-react';

interface SettingsViewProps {
  userName: string;
  onLogout: () => void;
  yieldVal: number;
  roiVal: number;
}

export default function SettingsView({ userName, onLogout, yieldVal, roiVal }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState('profile');
  return (
    <div className="min-h-screen bg-[#f2f4f1] pb-28">
      {/* Target topbar */}
      <header className="bg-[#002d1a] text-white fixed top-0 w-full z-40 flex justify-between items-center px-4 md:px-12 h-16 shadow-md border-b border-[#1a432f]">
        <div className="flex items-center gap-2">
          <img 
            alt="AGRI OPTIMA Logo" 
            className="w-8 h-8 object-contain brightness-0 invert" 
            src="https://lh3.googleusercontent.com/aida/ADBb0ug7b3-ZpnDqEY-0T6rEkNzKAOrZEKiJ5CSKj5BeNQkqx7iPr0f9eA-t6CnvjMsvy_-RLmo_Jh7p4r6ID39j9_qfArvTzWNZhUZgCJIdvcM8srXfFh20DqhwRdLRFyTt4MjiOzA3gYA6tmWZPoB5WypHuRhyLVxFFRNhAuM8yIC58nXz0JsB4pzbhD3ZXWTvNpwdkPWk6X2iQ4rY2O5vL0_6eJ-kJ2dnkxUDZQH4FLqs2EVz9IqnmmYa6A"
          />
          <h1 className="font-serif text-xl md:text-2xl font-bold tracking-tight text-white">AGRI OPTIMA</h1>
        </div>
        <div className="flex items-center gap-2 text-emerald-200 uppercase font-mono text-[10px] font-bold">
          <span>SETTINGS & CONTROL</span>
        </div>
      </header>

      <main className="pt-20 px-4 md:px-12 max-w-4xl mx-auto">
        
        {/* Title */}
        <section className="mt-8 mb-6">
          <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider block">Grounded Preferences</span>
          <h2 className="font-serif text-3xl font-extrabold text-[#002d1a] mt-1">Platform Settings</h2>
        </section>

        {/* Profile Card */}
        <section className="mb-6 bg-white border border-[#c1c8c1] rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-100 text-[#002d1a] rounded-full flex items-center justify-center font-bold text-xl shadow-inner border border-emerald-200">
              {userName ? userName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <p className="text-[10px] tracking-wider uppercase text-gray-400 font-bold font-sans">ACTIVE GROWER SYSTEM</p>
              <h3 className="font-serif text-lg font-bold text-[#002d1a]">{userName || 'grower@agrioptima.com'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">Authorization Tier: Precise Farm Administrator</p>
            </div>
          </div>
        </section>

        {/* Settings categories */}
        <section className="space-y-4 mb-8">
          
          {/* General telemetry configs */}
          <div className="bg-white border border-[#c1c8c1] rounded-xl divide-y divide-gray-200 overflow-hidden shadow-sm">
            
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <SettingsIcon className="w-5 h-5 text-emerald-800" />
                <div>
                  <h4 className="font-sans font-bold text-sm text-[#002d1a]">Default Metrics System</h4>
                  <p className="text-[10px] text-gray-500">Metric (tons, hectares, Celsius, L/m²)</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-950 px-3 py-1 bg-[#cdead0] rounded-full">METRIC</span>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Map className="w-5 h-5 text-emerald-800" />
                <div>
                  <h4 className="font-sans font-bold text-sm text-[#002d1a]">Mapping Sector Coordinate Bindings</h4>
                  <p className="text-[10px] text-gray-500">Local Area: Sector 04 Active Lands</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#002d1a] font-mono">SECTOR_04_HEALTHY</span>
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-emerald-800" />
                <div className="ml-4">
                  <h3 className="font-serif text-xl font-bold text-[#002d1a]">{userName}</h3>
                  <p className="text-sm text-gray-500">Administrator</p>
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm text-[#002d1a]">Current Indicators Cache</h4>
                  <p className="text-[10px] text-gray-500">Yield: {yieldVal} t/ha, ROI: {roiVal}%</p>
                </div>
              </div>
              <button 
                onClick={() => alert("Indicator specifications resynchronized cleanly.")}
                className="text-xs font-bold text-emerald-800 hover:underline hover:text-emerald-950 font-sans cursor-pointer uppercase tracking-wider"
              >
                SYNC TELEMETRY
              </button>
            </div>

          </div>

          {/* Support and System */}
          <div className="bg-white border border-[#c1c8c1] rounded-xl divide-y divide-gray-200 overflow-hidden shadow-sm">
            
            <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => alert("AgriOptima Client Support desk is online 24/7. Call standard: +1 (800) GROW-OPT.")}>
              <div className="flex items-center gap-3">
                <LifeBuoy className="w-5 h-5 text-emerald-800" />
                <div>
                  <h4 className="font-sans font-bold text-sm text-gray-800">Operational Support Hotline</h4>
                  <p className="text-[10px] text-gray-400">Direct link with agronomical engineers</p>
                </div>
              </div>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </div>

            <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => alert("Platform Logs: Version 2.24 build 2026. Patch notes: Root node optimization added.")}>
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-emerald-800" />
                <div>
                  <h4 className="font-sans font-bold text-sm text-gray-800">Platform Versional Patch logs</h4>
                  <p className="text-[10px] text-gray-400">Firmware precision v2.4.6</p>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-500">v2.4.6</span>
            </div>

          </div>

          {/* Logging Out */}
          <button 
            onClick={onLogout}
            className="w-full bg-white border border-red-300 text-red-600 font-sans font-bold text-xs uppercase tracking-widest py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-50/20 active:scale-98 transition shadow-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out from platform session</span>
          </button>

        </section>

      </main>
    </div>
  );
}
