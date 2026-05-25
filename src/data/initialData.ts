// src/data/initialData.ts
import { FoodItem, UserProfile } from '../types';

export const INITIAL_PROFILE: UserProfile = {
  age: 23,
  weight: 85,
  height: 174, // cm
  getdBase: 2200,
  targetCalories: 1700,
};

export const INITIAL_FOOD_CATALOG: FoodItem[] = [
  // Básicos (category: 'basic')
  { id: 'b1', name: 'Tortilla de Harina Grande D1', calories: 190, category: 'basic', portionInfo: '1 und' },
  { id: 'b2', name: 'Papa en Air Fryer', calories: 130, category: 'basic', portionInfo: '1 mediana' },
  { id: 'b3', name: 'Huevo', calories: 75, category: 'basic', portionInfo: '1 und' },
  { id: 'b4', name: 'Pechuga de Pollo', calories: 340, category: 'basic', portionInfo: '200g cocida' },
  { id: 'b5', name: 'Filete de Tilapia', calories: 260, category: 'basic', portionInfo: '200g cocido' },
  { id: 'b6', name: 'Carne de Cerdo Lomo', calories: 360, category: 'basic', portionInfo: '200g cocido' },
  { id: 'b7', name: 'Muslos de Pollo sin piel', calories: 210, category: 'basic', portionInfo: '1 und' },
  { id: 'b8', name: 'Manzana', calories: 80, category: 'basic', portionInfo: '1 und' },
  { id: 'b9', name: 'Fresas', calories: 50, category: 'basic', portionInfo: '1 taza' },
  { id: 'b10', name: 'Minichips de Platanitos', calories: 160, category: 'basic', portionInfo: '1 pq' },
  { id: 'b11', name: 'Lonchita de Queso Mozzarella', calories: 80, category: 'basic', portionInfo: '1 loncha' },
  { id: 'b12', name: 'Queso Crema', calories: 60, category: 'basic', portionInfo: '1 cda' },
  { id: 'b13', name: 'Maíz tierno', calories: 45, category: 'basic', portionInfo: '2 cdas' },
  { id: 'b14', name: 'Crema de leche', calories: 50, category: 'basic', portionInfo: '1 cda' },

  // Postres y Salidas (category: 'dessert')
  { id: 'd1', name: 'Nevado Juan Valdez', calories: 420, category: 'dessert', portionInfo: 'grande' },
  { id: 'd2', name: 'Granizado Grande Juan Valdez', calories: 350, category: 'dessert', portionInfo: 'grande' },
  { id: 'd3', name: 'Granizado Cereza Food Company', calories: 380, category: 'dessert', portionInfo: 'grande' },
  { id: 'd4', name: 'Gaseosa Personal', calories: 140, category: 'dessert', portionInfo: '1 und' },
  { id: 'd5', name: 'Cerezada', calories: 250, category: 'dessert', portionInfo: '1 vaso' },
  { id: 'd6', name: 'Limonada Natural Azucarada', calories: 160, category: 'dessert', portionInfo: '1 vaso' },
  { id: 'd7', name: 'Salchipapa Junior', calories: 750, category: 'dessert', portionInfo: '1 porción' },
  { id: 'd8', name: 'Hamburguesa Sencilla con queso', calories: 550, category: 'dessert', portionInfo: '1 und' },
  { id: 'd9', name: 'Porción de Papas Fritas', calories: 380, category: 'dessert', portionInfo: '1 porción' },

  // Recetas (category: 'recipe')
  { id: 'r1', name: 'Plato de Pasta Casera', calories: 310, category: 'recipe', portionInfo: 'plato' },
  { id: 'r2', name: 'Tortilla Especial de Pollo', calories: 765, category: 'recipe', portionInfo: 'Completa' },
  { id: 'r3', name: '1 Libra de Papa con 2 Muslos', calories: 770, category: 'recipe', portionInfo: 'Plato' },
  { id: 'r4', name: '1 Libra de Papa con Alitas BBQ', calories: 830, category: 'recipe', portionInfo: 'Plato' },
  { id: 'r5', name: '1 Libra de Papa con Pechuga', calories: 690, category: 'recipe', portionInfo: 'Plato' },
  { id: 'r6', name: '1 Libra de Papa con 2 Filetes de Tilapia', calories: 870, category: 'recipe', portionInfo: 'Plato' },
  { id: 'r7', name: 'Tortilla con Doble Queso', calories: 350, category: 'recipe', portionInfo: 'Completa' },
  { id: 'r8', name: 'Tortilla con 2 Huevos', calories: 340, category: 'recipe', portionInfo: 'Completa' },
  { id: 'r9', name: 'Tortilla Pizza Express', calories: 300, category: 'recipe', portionInfo: 'Completa' },
  { id: 'r10', name: 'Tortilla Philny', calories: 330, category: 'recipe', portionInfo: 'Completa' }
];

// Generamos datos semanales realistas e históricos para mostrar en las estadísticas
export const getSimulatedWeeklyStats = () => {
  const dates = [];
  const daysOfMin = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    const dayName = daysOfMin[dayOfWeek];
    
    // Calorias consumidas simuladas (en base al déficit de 1700 y gasto de 2200)
    // Algunos días con déficit ideal, otros con un poco más o menos
    const consumed = [1620, 1550, 1840, 1690, 1480, 2100, 1720][6 - i] || 1700;
    
    dates.push({
      dateStr,
      label: dayName,
      consumed,
      target: 1700,
      expenditure: 2200,
    });
  }
  return dates;
};
