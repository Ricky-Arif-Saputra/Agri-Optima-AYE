import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Sprout, 
  Store, 
  Settings as SettingsIcon,
  HelpCircle
} from 'lucide-react';
import { CartItem } from './types';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import FarmView from './components/FarmView';
import MarketView from './components/MarketView';
import SettingsView from './components/SettingsView';
import AiAdvisor from './components/AiAdvisor';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Logged in by default so the user immediately sees the rich screens
  const [userEmail, setUserEmail] = useState<string>('rickysaputra12345168@gmail.com');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Unified global parameters state (highly interactive telemetry indicators)
  const [yieldVal, setYieldVal] = useState<number>(42.8);
  const [roiVal, setRoiVal] = useState<number>(24.5);
  const [efficiencyVal, setEfficiencyVal] = useState<number>(88);
  const [marketIndex, setMarketIndex] = useState<'High' | 'Moderate' | 'Volatile'>('High');

  // Unified Cart logic shared between views
  const [cart, setCart] = useState<CartItem[]>([]);

  // Navigation handlers
  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCart([]);
  };

  const handleNavigateToTab = (tab: string) => {
    setActiveTab(tab);
  };

  if (!isLoggedIn) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#f2f4f1] text-[#191c1b] relative">
      
      {/* Dynamic Tab Renderer */}
      <div className="fade-in-container pb-8">
        {activeTab === 'dashboard' && (
          <DashboardView 
            onLogout={handleLogout}
            onNavigateToTab={handleNavigateToTab}
            yieldVal={yieldVal}
            setYieldVal={setYieldVal}
            roiVal={roiVal}
            setRoiVal={setRoiVal}
            efficiencyVal={efficiencyVal}
            setEfficiencyVal={setEfficiencyVal}
            marketIndex={marketIndex}
            setMarketIndex={setMarketIndex}
          />
        )}
        {activeTab === 'farm' && (
          <FarmView 
            onNavigateToTab={handleNavigateToTab}
            efficiencyVal={efficiencyVal}
            setEfficiencyVal={setEfficiencyVal}
          />
        )}
        {activeTab === 'market' && (
          <MarketView 
            onNavigateToTab={handleNavigateToTab}
            cart={cart}
            setCart={setCart}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsView 
            userEmail={userEmail}
            onLogout={handleLogout}
            yieldVal={yieldVal}
            roiVal={roiVal}
          />
        )}
      </div>

      {/* Floating AI Agronomist Advisor bubble */}
      <AiAdvisor efficiencyVal={efficiencyVal} />

      {/* Bottom Navigation Web Bar - custom grounded styling */}
      <nav className="fixed bottom-0 left-0 w-full z-40 bg-white border-t border-gray-300 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] flex justify-around items-center py-2.5 px-4 pb-safe">
        
        {/* Dashboard button */}
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1.5 px-4 text-xs font-sans font-bold uppercase transition-all duration-300 scale-100 cursor-pointer ${
            activeTab === 'dashboard' 
              ? 'bg-[#cdead0] text-[#1a432f] rounded-full px-5 py-2 font-bold' 
              : 'text-gray-500 hover:text-emerald-950 hover:bg-gray-100/30 rounded-xl px-4 py-2'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Dashboard</span>
        </button>

        {/* Farm button */}
        <button 
          onClick={() => setActiveTab('farm')}
          className={`flex flex-col items-center justify-center py-1.5 px-4 text-xs font-sans font-bold uppercase transition-all duration-300 scale-100 cursor-pointer ${
            activeTab === 'farm' 
              ? 'bg-[#cdead0] text-[#1a432f] rounded-full px-5 py-2 font-bold' 
              : 'text-gray-500 hover:text-emerald-950 hover:bg-gray-100/30 rounded-xl px-4 py-2'
          }`}
        >
          <Sprout className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Farm</span>
        </button>

        {/* Market button */}
        <button 
          onClick={() => setActiveTab('market')}
          className={`flex flex-col items-center justify-center py-1.5 px-4 text-xs font-sans font-bold uppercase transition-all duration-300 scale-100 cursor-pointer ${
            activeTab === 'market' 
              ? 'bg-[#cdead0] text-[#1a432f] rounded-full px-5 py-2 font-bold' 
              : 'text-gray-500 hover:text-emerald-950 hover:bg-gray-100/30 rounded-xl px-4 py-2'
          }`}
        >
          <Store className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Market</span>
        </button>

        {/* Settings button */}
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center py-1.5 px-4 text-xs font-sans font-bold uppercase transition-all duration-300 scale-100 cursor-pointer ${
            activeTab === 'settings' 
              ? 'bg-[#cdead0] text-[#1a432f] rounded-full px-5 py-2 font-bold' 
              : 'text-gray-500 hover:text-emerald-950 hover:bg-gray-100/30 rounded-xl px-4 py-2'
          }`}
        >
          <SettingsIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Settings</span>
        </button>

      </nav>

    </div>
  );
}
