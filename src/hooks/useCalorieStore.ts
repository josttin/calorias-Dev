// src/hooks/useCalorieStore.ts
import { useState, useEffect } from 'react';
import { FoodItem, LogEntry, UserProfile, FoodCategory } from '../types';
import { INITIAL_PROFILE, INITIAL_FOOD_CATALOG, getSimulatedWeeklyStats } from '../data/initialData';

export function useCalorieStore() {
  // 1. User Profile Setup (Age, Weight, Height, Calories targets)
  const [profile, setProfile] = useState<UserProfile>(() => {
    const cached = localStorage.getItem('caloriasdev_profile');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { /* ignore */ }
    }
    return INITIAL_PROFILE;
  });

  // 2. Food Catalog Setup
  const [catalog, setCatalog] = useState<FoodItem[]>(() => {
    const cached = localStorage.getItem('caloriasdev_catalog');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { /* ignore */ }
    }
    return INITIAL_FOOD_CATALOG;
  });

  // 3. Log Entries Setup. Let's seed with some realistic today entries if empty, so the user can see items right away!
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const cached = localStorage.getItem('caloriasdev_logs');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { /* ignore */ }
    }
    
    // Seed initial logs for typical items on the current day to avoid a blank, lifeless first screen
    const todayStr = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD
    const initialLogs: LogEntry[] = [
      { id: 'log_seed_1', name: 'Huevo (🍳 Cocido)', calories: 75, date: todayStr, time: '08:00', category: 'basic', mealType: 'breakfast' },
      { id: 'log_seed_2', name: 'Tortilla de Harina Grande D1', calories: 190, date: todayStr, time: '08:05', category: 'basic', mealType: 'breakfast' },
      { id: 'log_seed_3', name: 'Pechuga de Pollo', calories: 340, date: todayStr, time: '13:20', category: 'basic', mealType: 'lunch' },
      { id: 'log_seed_4', name: 'Papa en Air Fryer', calories: 130, date: todayStr, time: '13:30', category: 'basic', mealType: 'lunch' },
      { id: 'log_seed_5', name: 'Nevado Juan Valdez', calories: 420, date: todayStr, time: '16:00', category: 'dessert', mealType: 'extra' },
    ];
    return initialLogs;
  });

  // Save states to local storage on change
  useEffect(() => {
    localStorage.setItem('caloriasdev_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('caloriasdev_catalog', JSON.stringify(catalog));
  }, [catalog]);

  useEffect(() => {
    localStorage.setItem('caloriasdev_logs', JSON.stringify(logs));
  }, [logs]);

  // Actions for catalog
  const addCatalogItem = (item: Omit<FoodItem, 'id'>) => {
    const newItem: FoodItem = {
      ...item,
      id: `food_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    };
    setCatalog((prev) => [newItem, ...prev]);
    return newItem;
  };

  const editCatalogItem = (id: string, updatedData: Partial<FoodItem>) => {
    setCatalog((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const deleteCatalogItem = (id: string) => {
    setCatalog((prev) => prev.filter((item) => item.id !== id));
  };

  // Actions for logs
  const addLogEntry = (name: string, calories: number, category: FoodCategory, dateStr?: string, mealType?: 'breakfast' | 'lunch' | 'dinner' | 'extra') => {
    const dStr = dateStr || new Date().toLocaleDateString('sv-SE');
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newLog: LogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name,
      calories,
      date: dStr,
      time: timeStr,
      category,
      mealType: mealType || 'extra'
    };
    setLogs((prev) => [newLog, ...prev]);
    return newLog;
  };

  const deleteLogEntry = (id: string) => {
    setLogs((prev) => prev.filter((entry) => entry.id !== id));
  };

  // Log from Catalog item directly
  const logFromCatalog = (item: FoodItem, mealType?: 'breakfast' | 'lunch' | 'dinner' | 'extra', dateStr?: string) => {
    const displayName = item.portionInfo ? `${item.name} (${item.portionInfo})` : item.name;
    return addLogEntry(displayName, item.calories, item.category, dateStr, mealType);
  };

  // Log express calorie input
  const logExpress = (calories: number, customName?: string, mealType?: 'breakfast' | 'lunch' | 'dinner' | 'extra', dateStr?: string) => {
    const name = customName?.trim() || 'Comida Express';
    return addLogEntry(name, calories, 'basic', dateStr, mealType);
  };

  // Profile update
  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  // Clear all data & reset to initial
  const resetAllData = () => {
    if (window.confirm('¿Estás seguro de que quieres restablecer todos los datos al catálogo inicial? Se borrarán tus registros actuales.')) {
      setCatalog(INITIAL_FOOD_CATALOG);
      setProfile(INITIAL_PROFILE);
      
      const todayStr = new Date().toLocaleDateString('sv-SE');
      setLogs([
        { id: 'log_seed_1', name: 'Huevo (🍳 Cocido)', calories: 75, date: todayStr, time: '08:00', category: 'basic', mealType: 'breakfast' },
        { id: 'log_seed_2', name: 'Tortilla de Harina Grande D1', calories: 190, date: todayStr, time: '08:05', category: 'basic', mealType: 'breakfast' },
        { id: 'log_seed_3', name: 'Pechuga de Pollo', calories: 340, date: todayStr, time: '13:20', category: 'basic', mealType: 'lunch' },
        { id: 'log_seed_4', name: 'Papa en Air Fryer', calories: 130, date: todayStr, time: '13:30', category: 'basic', mealType: 'lunch' },
      ]);
    }
  };

  return {
    profile,
    catalog,
    logs,
    addCatalogItem,
    editCatalogItem,
    deleteCatalogItem,
    addLogEntry,
    deleteLogEntry,
    logFromCatalog,
    logExpress,
    updateProfile,
    resetAllData
  };
}
