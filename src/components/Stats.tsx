// src/components/Stats.tsx
import { useState, FormEvent } from 'react';
import { UserProfile, LogEntry } from '../types';
import { getSimulatedWeeklyStats } from '../data/initialData';
import { TrendingUp, User, Activity, Flame, ShieldAlert, Award, ChevronRight, Save, Weight, Ruler, Sparkles } from 'lucide-react';

interface StatsProps {
  profile: UserProfile;
  logs: LogEntry[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export default function Stats({ profile, logs, onUpdateProfile }: StatsProps) {
  // Form profile state
  const [age, setAge] = useState(profile.age.toString());
  const [weight, setWeight] = useState(profile.weight.toString());
  const [height, setHeight] = useState(profile.height.toString());
  const [getdBase, setGetdBase] = useState(profile.getdBase.toString());
  const [targetCalories, setTargetCalories] = useState(profile.targetCalories.toString());
  const [profileMsg, setProfileMsg] = useState('');

  // 1. Time range toggle for history view (7 vs 15 days)
  const [timeRange, setTimeRange] = useState<7 | 15>(15);

  const daysOfWeekShort = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const today = new Date();
  
  // Base history data structure calculated over 7 or 15 days
  const historyData = Array.from({ length: timeRange }, (_, index) => {
    const d = new Date();
    d.setDate(today.getDate() - ((timeRange - 1) - index));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = daysOfWeekShort[d.getDay()];
    
    // Label choice: 15-day shows numeric day component, 7-day shows short day string
    const displayLabel = timeRange === 15 ? `${d.getDate()}` : dayName;
    
    // Calculate actual logged calories for this date
    const dayLogs = logs.filter(log => log.date === dateStr);
    const actualConsumed = dayLogs.reduce((sum, entry) => sum + entry.calories, 0);
    
    // Stable wave pattern fallback representing prior baseline behavior
    const seedModifiers = [25, -90, 110, -180, 50, 130, -70, 15, -135, 75, -50, 105, 120, -15, -75];
    const modifier = seedModifiers[index % seedModifiers.length];
    const defaultVal = Math.round(profile.targetCalories + modifier);
    const finalConsumed = actualConsumed > 0 ? actualConsumed : defaultVal;
    
    return {
      dateStr,
      label: displayLabel,
      fullLabel: `${dayName} ${d.getDate()}`,
      consumed: finalConsumed,
      target: profile.targetCalories,
      isReal: actualConsumed > 0,
    };
  });

  // Calculate Average dynamically based on selected range
  const averageConsumed = Math.round(historyData.reduce((sum, d) => sum + d.consumed, 0) / timeRange);
  
  // IMC (BMI) Calculation: Peso (kg) / Altura^2 (m)
  const heightMeters = profile.height / 100;
  const bmi = heightMeters > 0 ? (profile.weight / (heightMeters * heightMeters)).toFixed(1) : '0';
  const bmiNum = parseFloat(bmi);
  
  let bmiCategory = 'Normal';
  let bmiColor = 'text-emerald-400';
  if (bmiNum < 18.5) {
    bmiCategory = 'Bajo Peso';
    bmiColor = 'text-sky-400';
  } else if (bmiNum >= 25 && bmiNum < 30) {
    bmiCategory = 'Sobrepeso';
    bmiColor = 'text-amber-400';
  } else if (bmiNum >= 30) {
    bmiCategory = 'Obesidad';
    bmiColor = 'text-rose-400';
  }

  // Handle profile update click
  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const getdNum = parseInt(getdBase);
    const targetNum = parseInt(targetCalories);

    if (
      isNaN(ageNum) || ageNum <= 0 ||
      isNaN(weightNum) || weightNum <= 0 ||
      isNaN(heightNum) || heightNum <= 0 ||
      isNaN(getdNum) || getdNum <= 0 ||
      isNaN(targetNum) || targetNum <= 0
    ) {
      setProfileMsg('⚠️ Ingresa valores numéricos válidos');
      return;
    }

    onUpdateProfile({
      age: ageNum,
      weight: weightNum,
      height: heightNum,
      getdBase: getdNum,
      targetCalories: targetNum
    });

    setProfileMsg('✅ Perfil guardado correctamente.');
    setTimeout(() => setProfileMsg(''), 2500);
  };

  // Find the max calorie count in historyData to scale chart height
  const maxCalValueInChart = Math.max(...historyData.map(d => Math.max(d.consumed, profile.targetCalories, 2200)));

  return (
    <div className="space-y-6">
      {/* 1. Bar Chart Card */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 text-emerald-400" />
              Historial de Consumo
            </h3>
            <span className="text-[10px] text-slate-500 font-sans block">Promedio: {averageConsumed} kcal/día</span>
          </div>

          {/* Time range switcher capsules */}
          <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setTimeRange(7)}
              className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                timeRange === 7 
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Días
            </button>
            <button
              onClick={() => setTimeRange(15)}
              className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                timeRange === 15 
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              15 Días
            </button>
          </div>
        </div>

        {/* The Vertical CSS Chart */}
        <div className="h-44 flex items-end justify-between pt-6 px-1 relative">
          {/* Target guidelines */}
          <div className="absolute left-0 right-0 border-t border-slate-700/40 border-dashed" style={{ bottom: `${(profile.targetCalories / maxCalValueInChart) * 100}%` }}>
            <span className="absolute -top-4 right-0 text-[8px] text-slate-400 bg-slate-950 px-1 border border-slate-800 rounded font-mono">
              Meta: {profile.targetCalories} kcal
            </span>
          </div>

          <div className="absolute left-0 right-0 border-t border-rose-500/20" style={{ bottom: `${(2200 / maxCalValueInChart) * 100}%` }}>
            <span className="absolute -top-4 left-0 text-[8px] text-rose-400/80 bg-slate-950 px-1 border border-slate-900 rounded font-mono">
              Mantenimiento
            </span>
          </div>

          {/* Bar loops */}
          {historyData.map((day, idx) => {
            const hPct = `${(day.consumed / maxCalValueInChart) * 100}%`;
            const isOver = day.consumed > profile.targetCalories;
            
            return (
              <div key={idx} className="flex-1 flex flex-col items-center group relative mx-0.5">
                {/* Floating details on hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 border border-slate-850 px-2 py-1 rounded-lg shadow-xl z-25 text-center pointer-events-none min-w-[70px]">
                  <p className="text-[9px] font-bold text-white font-mono">{day.consumed} kcal</p>
                  <p className="text-[7px] text-slate-500">{day.isReal ? 'Registrado' : 'Simulado'}</p>
                </div>

                {/* Vertical Bar */}
                <div className="w-full max-w-[16px] bg-slate-800/60 rounded-t-md relative flex items-end overflow-hidden" style={{ height: '120px' }}>
                  <div
                    className={`w-full rounded-t-sm transition-all duration-1000 ${
                      isOver 
                        ? 'bg-gradient-to-t from-rose-600 to-amber-500' 
                        : 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                    }`}
                    style={{ height: hPct }}
                  />
                </div>

                {/* Day label */}
                <span className="text-[9px] text-slate-400 mt-2 font-mono">
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Visual Indicators widget */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/15 rounded-xl text-emerald-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">Déficit Diario</p>
            <p className="text-sm font-extrabold text-white">
              -{profile.getdBase - profile.targetCalories} <span className="text-xs font-normal text-slate-400">kcal</span>
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center space-x-3">
          <div className="p-2.5 bg-sky-500/15 rounded-xl text-sky-450">
            <Activity className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <p className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">IMC Corporal</p>
            <p className="text-sm font-extrabold text-white">
              {bmi} <span className={`text-[9px] font-bold ${bmiColor}`}>({bmiCategory})</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Parameter Customizer Profile Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Métricas Corporales y Límites
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[9px] text-slate-400 font-mono uppercase tracking-wider mb-1 flex items-center">
                <Weight className="w-3 h-3 mr-0.5 text-slate-500" />
                Peso (kg)
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                id="edit-weight"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-2.5 py-1.5 text-xs text-white text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[9px] text-slate-400 font-mono uppercase tracking-wider mb-1 flex items-center">
                <Ruler className="w-3 h-3 mr-0.5 text-slate-500" />
                Altura (cm)
              </label>
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
                id="edit-height"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-2.5 py-1.5 text-xs text-white text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[9px] text-slate-400 font-mono uppercase tracking-wider mb-1">Edad</label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                id="edit-age"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-2.5 py-1.5 text-xs text-white text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] text-slate-400 font-mono uppercase tracking-wider mb-1">Gasto Base (GETD)</label>
              <input
                type="text"
                value={getdBase}
                onChange={(e) => setGetdBase(e.target.value)}
                required
                id="edit-getd"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[9px] text-slate-400 font-mono uppercase tracking-wider mb-1">Meta Déficit</label>
              <input
                type="text"
                value={targetCalories}
                onChange={(e) => setTargetCalories(e.target.value)}
                required
                id="edit-target"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-emerald-400 text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono font-bold"
              />
            </div>
          </div>

          {profileMsg && (
            <p className="text-center text-xs font-semibold text-emerald-400 font-sans border border-emerald-500/20 bg-emerald-500/5 py-1.5 rounded-xl select-none animate-pulse">
              {profileMsg}
            </p>
          )}

          <button
            type="submit"
            id="profile-save-submit"
            className="w-full bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer border border-slate-700"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Ajustes Corporales</span>
          </button>
        </form>
      </div>
    </div>
  );
}
