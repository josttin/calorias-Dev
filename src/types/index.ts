// src/types/index.ts

export type FoodCategory = 'basic' | 'dessert' | 'recipe';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'extra';

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  category: FoodCategory;
  portionInfo?: string; // e.g. "[200g cocida]" or "[1 mediana]"
}

export interface LogEntry {
  id: string;
  name: string;
  calories: number;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  category?: FoodCategory;
  mealType?: MealType;
}

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  getdBase: number; // Daily expenditure
  targetCalories: number; // Diet target (deficit meta)
}
