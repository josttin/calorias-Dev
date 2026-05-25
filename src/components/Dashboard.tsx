// src/components/Dashboard.tsx
import { useState, FormEvent } from 'react';
import { LogEntry, UserProfile, FoodItem } from '../types';
import { Flame, Plus, Trash2, Sparkles, Activity, PlusCircle, Check, HelpCircle } from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  logs: LogEntry[];
  onAddExpress: (calories: number, name?: string, mealType?: 'breakfast' | 'lunch' | 'dinner' | 'extra') => void;
  onDeleteLog: (id: string) => void;
  onNavigateToCatalog: () => void;
}

const getCurrentMealTypeByHour = (): 'breakfast' | 'lunch' | 'dinner' | 'extra' => {
  const hr = new Date().getHours();
  if (hr >= 4 && hr < 12) return 'breakfast';
  if (hr >= 12 && hr < 16) return 'lunch';
  if (hr >= 16 && hr < 21) return 'dinner';
  return 'extra';
};

export default function Dashboard({
  profile,
  logs,
  onAddExpress,
  onDeleteLog,
  onNavigateToCatalog
}: DashboardProps) {
  const [expressCal, setExpressCal] = useState<string>('');
  const [expressName, setExpressName] = useState<string>('');
  const [expressMealType, setExpressMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'extra'>(getCurrentMealTypeByHour());
  const [successAnim, setSuccessAnim] = useState(false);

  // Today string YYYY-MM-DD
  const todayStr = new Date().toLocaleDateString('sv-SE');
  
  // Filter logs for today
  const todayLogs = logs.filter((log) => log.date === todayStr);

  // Calculate total consumed
  const totalConsumed = todayLogs.reduce((sum, entry) => sum + entry.calories, 0);

  // Remaining calories
  const remaining = profile.targetCalories - totalConsumed;
  const percentage = Math.min((totalConsumed / profile.targetCalories) * 100, 100);

  // Circular calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleQuickAdd = (cals: number, label: string) => {
    onAddExpress(cals, label, getCurrentMealTypeByHour());
    triggerSuccess();
  };

  const handleExpressSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cals = parseInt(expressCal);
    if (isNaN(cals) || cals <= 0) return;
    
    onAddExpress(cals, expressName.trim() || 'Comida Express', expressMealType);
    setExpressCal('');
    setExpressName('');
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSuccessAnim(true);
    setTimeout(() => setSuccessAnim(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Target Progress Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Decorative ambient background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

        {/* Circular Progress Meter */}
        <div className="relative flex items-center justify-center w-52 h-52 my-3">
          {/* SVG ring */}
          <svg className="w-full h-full transform -rotate-90">
            {/* Background track */}
            <circle
              cx="104"
              cy="104"
              r={radius}
              className="stroke-slate-800 fill-none"
              strokeWidth="11"
            />
            {/* Glowing active progress bar */}
            <circle
              cx="104"
              cy="104"
              r={radius}
              className="stroke-emerald-500 fill-none transition-all duration-700 ease-out"
              strokeWidth="11"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Central content */}
          <div className="absolute flex flex-col items-center text-center">
            <Flame className={`w-8 h-8 ${remaining < 0 ? 'text-rose-500 animate-bounce' : 'text-emerald-400'}`} />
            <span className="text-3xl font-bold tracking-tight mt-1 text-white">
              {totalConsumed}
            </span>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
              de {profile.targetCalories} kcal
            </span>
          </div>
        </div>

        {/* Micro status badges */}
        <div className="w-full grid grid-cols-2 gap-3 mt-2 border-t border-slate-800/60 pt-4">
          <div className="text-center border-r border-slate-800/60">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Restantes</p>
            <p className={`text-lg font-bold ${remaining < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {remaining < 0 ? 0 : remaining} <span className="text-xs font-normal">kcal</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Gasto GETD</p>
            <p className="text-lg font-bold text-slate-300">
              {profile.getdBase} <span className="text-xs font-normal">kcal</span>
            </p>
          </div>
        </div>

        {/* Progress Alert */}
        {remaining < 0 && (
          <div className="mt-4 px-3 py-1.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-center w-full">
            <p className="text-xs text-rose-300 font-medium">
              ⚠️ ¡Has superado tu meta por {Math.abs(remaining)} kcal!
            </p>
          </div>
        )}
        {remaining >= 0 && remaining <= 200 && (
          <div className="mt-4 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-center w-full">
            <p className="text-xs text-emerald-300 font-medium font-sans">
              🎯 ¡Excelente control! Estás a {remaining} kcal de la meta.
            </p>
          </div>
        )}
      </div>

      {/* Success alert micro-interaction */}
      {successAnim && (
        <div className="fixed top-18 right-4 bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-full shadow-lg z-50 flex items-center space-x-1.5 text-xs animate-bounce border border-emerald-300">
          <Check className="w-4 h-4" />
          <span>¡Calorías añadidas!</span>
        </div>
      )}

      {/* Quick Add Buttons */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 flex items-center px-1">
          <PlusCircle className="w-3.5 h-3.5 mr-1 text-emerald-500" />
          Registro Rápido
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleQuickAdd(100, 'Café / Snack ligero')}
            id="quick-add-100"
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 active:bg-slate-800 text-slate-200 py-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            <span className="text-sm font-bold text-white">+100</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Snack</span>
          </button>
          <button
            onClick={() => handleQuickAdd(250, 'Proteína / Postre')}
            id="quick-add-250"
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 active:bg-slate-800 text-slate-200 py-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            <span className="text-sm font-bold text-white">+250</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Comida Med</span>
          </button>
          <button
            onClick={() => handleQuickAdd(500, 'Almuerzo / Cena Completa')}
            id="quick-add-500"
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 active:bg-slate-800 text-slate-200 py-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            <span className="text-sm font-bold text-white">+500</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Plato Completo</span>
          </button>
        </div>
      </div>

      {/* Express Log Custom Form */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 shadow-lg">
        <form onSubmit={handleExpressSubmit} className="space-y-3">
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="text"
                value={expressName}
                onChange={(e) => setExpressName(e.target.value)}
                placeholder="Nombre comida exprés..."
                id="express-food-name"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-xs rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
              />
            </div>
            <div className="w-24">
              <input
                type="number"
                value={expressCal}
                onChange={(e) => setExpressCal(e.target.value)}
                placeholder="kcal"
                id="express-calories"
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-xs rounded-xl px-3 py-2 text-white placeholder-slate-500 text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Momento del Día select capsules */}
          <div className="space-y-1.5">
            <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider px-0.5">Momento del Día</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'breakfast', label: 'Desayuno', icon: '🍳' },
                { id: 'lunch', label: 'Almuerzo', icon: '🍲' },
                { id: 'dinner', label: 'Cena', icon: '🥗' },
                { id: 'extra', label: 'Extra', icon: '🧁' }
              ].map((meal) => (
                <button
                  key={meal.id}
                  type="button"
                  onClick={() => setExpressMealType(meal.id as any)}
                  className={`py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer flex flex-col items-center justify-center ${
                    expressMealType === meal.id
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-extrabold shadow-md'
                      : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                  }`}
                >
                  <span className="text-sm mb-0.5">{meal.icon}</span>
                  <span>{meal.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            id="express-submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer hover:shadow-lg shadow-emerald-500/10"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3px]" />
            <span>Registrar Entrada Exprés</span>
          </button>
        </form>
      </div>

      {/* Today's Food Logs Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center">
            <Activity className="w-3.5 h-3.5 mr-1 text-emerald-500" />
            Consumo de Hoy
          </h3>
          <span className="text-[10px] bg-slate-800/80 text-slate-300 font-mono px-2 py-0.5 rounded-full border border-slate-700/60">
            {todayLogs.length} {todayLogs.length === 1 ? 'ítem' : 'ítems'}
          </span>
        </div>

        {todayLogs.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/50 border-dashed rounded-3xl py-12 px-6 text-center space-y-3">
            <p className="text-xs text-slate-500">
              No has registrado comidas hoy. ¡Escoge alimentos del catálogo o regístralos de forma exprés!
            </p>
            <button
              onClick={onNavigateToCatalog}
              className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full hover:border-emerald-500 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explorar Catálogo</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {todayLogs.map((entry) => {
              const mealType = entry.mealType || 'extra';
              const mealMeta: Record<string, { label: string; icon: string }> = {
                breakfast: { label: 'Desayuno', icon: '🍳' },
                lunch: { label: 'Almuerzo', icon: '🍲' },
                dinner: { label: 'Cena', icon: '🥗' },
                extra: { label: 'Extra', icon: '🧁' }
              };
              const meta = mealMeta[mealType] || { label: 'Extra', icon: '🧁' };
              const categoryLabel = entry.category === 'basic' ? 'Básicos' : entry.category === 'dessert' ? 'Postre' : 'Receta';

              return (
                <div
                  key={entry.id}
                  id={`today-log-entry-${entry.id}`}
                  className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between transition-all hover:bg-slate-900/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-805 rounded-lg flex items-center justify-center text-xl shadow-inner border border-slate-800/60">
                      {meta.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white max-w-[180px] truncate">
                        {entry.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {meta.label} <span className="text-slate-750">•</span> {categoryLabel} <span className="text-slate-750">•</span> {entry.time || '08:30'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5">
                    <p className="font-mono text-emerald-400 font-bold text-sm">{entry.calories} kcal</p>
                    <button
                      onClick={() => onDeleteLog(entry.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-450 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
