/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useCalorieStore } from './hooks/useCalorieStore';
import Dashboard from './components/Dashboard';
import Catalog from './components/Catalog';
import Stats from './components/Stats';
import { Flame, LayoutDashboard, Utensils, TrendingUp, Sparkles, Activity } from 'lucide-react';

export default function App() {
  const {
    profile,
    catalog,
    logs,
    addCatalogItem,
    editCatalogItem,
    deleteCatalogItem,
    deleteLogEntry,
    logFromCatalog,
    logExpress,
    updateProfile,
    resetAllData
  } = useCalorieStore();

  // Active View State Routing
  const [activeView, setActiveView] = useState<'dashboard' | 'catalog' | 'stats'>('dashboard');

  return (
    <div className="h-screen w-screen bg-slate-950 font-sans flex items-center justify-center text-slate-100 overflow-hidden select-none">
      {/* Container simulating native phone wrapper */}
      <div className="flex flex-col h-full w-full max-w-md bg-slate-950 border-x border-slate-800 relative shadow-2xl">
        
        {/* Header - Fixed, No Scroll */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md z-40 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-slate-950">
              <Flame className="w-5 h-5 fill-slate-950 stroke-[2.5px]" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Calorias<span className="text-emerald-400">Dev</span>
            </h1>
          </div>

          {/* Target and telemetry info */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Meta Diaria</p>
              <p className="text-xs font-mono font-bold text-emerald-400">{profile.targetCalories} kcal</p>
            </div>
            
            <div className="flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700/60 px-2.5 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[9px] font-mono text-slate-300 font-bold uppercase tracking-wider">
                Móvil
              </span>
            </div>
          </div>
        </header>

        {/* Floating Accent Background Glow to represent the modern minimal craft */}
        <div className="absolute top-16 left-6 w-36 h-36 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Content Box - scrollable container */}
        <main className="flex-1 overflow-y-auto px-4 py-5 scrollbar-none">
          {activeView === 'dashboard' && (
            <div className="animate-fade-in">
              <Dashboard
                profile={profile}
                logs={logs}
                onAddExpress={(cals, name, mealType) => logExpress(cals, name, mealType)}
                onDeleteLog={deleteLogEntry}
                onNavigateToCatalog={() => setActiveView('catalog')}
              />
            </div>
          )}

          {activeView === 'catalog' && (
            <div className="animate-fade-in">
              <Catalog
                catalog={catalog}
                onAddToToday={logFromCatalog}
                onAddItem={addCatalogItem}
                onEditItem={editCatalogItem}
                onDeleteItem={deleteCatalogItem}
                onResetCatalog={resetAllData}
              />
            </div>
          )}

          {activeView === 'stats' && (
            <div className="animate-fade-in">
              <Stats
                profile={profile}
                logs={logs}
                onUpdateProfile={updateProfile}
              />
            </div>
          )}
        </main>

        {/* Footer/Navigation Bar - Fixed, No Scroll */}
        <nav className="h-16 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md pb-safe shrink-0 z-40 flex items-center justify-around">
          
          {/* Tab 1: Dashboard */}
          <button
            onClick={() => setActiveView('dashboard')}
            id="tab-dashboard"
            className={`flex flex-col items-center justify-center w-20 h-full transition-all cursor-pointer ${
              activeView === 'dashboard' 
                ? 'text-emerald-400 font-bold scale-102' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 mb-1 transition-transform ${activeView === 'dashboard' ? 'scale-110' : ''}`} />
            <span className="text-[9px] uppercase tracking-wider font-mono">Inicio</span>
          </button>

          {/* Tab 2: Catalog */}
          <button
            onClick={() => setActiveView('catalog')}
            id="tab-catalog"
            className={`flex flex-col items-center justify-center w-20 h-full transition-all cursor-pointer ${
              activeView === 'catalog' 
                ? 'text-emerald-400 font-bold scale-102' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Utensils className={`w-4 h-4 mb-1 transition-transform ${activeView === 'catalog' ? 'scale-110' : ''}`} />
            <span className="text-[9px] uppercase tracking-wider font-mono">Alimentos</span>
          </button>

          {/* Tab 3: Stats */}
          <button
            onClick={() => setActiveView('stats')}
            id="tab-stats"
            className={`flex flex-col items-center justify-center w-20 h-full transition-all cursor-pointer ${
              activeView === 'stats' 
                ? 'text-emerald-400 font-bold scale-102' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <TrendingUp className={`w-4 h-4 mb-1 transition-transform ${activeView === 'stats' ? 'scale-110' : ''}`} />
            <span className="text-[9px] uppercase tracking-wider font-mono">Métricas</span>
          </button>

        </nav>

      </div>
    </div>
  );
}
