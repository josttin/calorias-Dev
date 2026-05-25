// src/components/Catalog.tsx
import { useState, FormEvent, MouseEvent } from 'react';
import { FoodItem, FoodCategory } from '../types';
import { Search, Plus, Sparkles, Filter, Edit, Trash2, Calendar, Check, X, FolderPlus } from 'lucide-react';

interface CatalogProps {
  catalog: FoodItem[];
  onAddToToday: (item: FoodItem, mealType?: 'breakfast' | 'lunch' | 'dinner' | 'extra') => void;
  onAddItem: (item: Omit<FoodItem, 'id'>) => void;
  onEditItem: (id: string, item: Partial<FoodItem>) => void;
  onDeleteItem: (id: string) => void;
  onResetCatalog: () => void;
}

export default function Catalog({
  catalog,
  onAddToToday,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onResetCatalog
}: CatalogProps) {
  // Navigation categories
  const [selectedCategory, setSelectedCategory] = useState<'all' | FoodCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states for creating/editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  
  // Active catalog item selected for quick moment logging
  const [activeLogItem, setActiveLogItem] = useState<FoodItem | null>(null);
  
  // New item form state
  const [formName, setFormName] = useState('');
  const [formCalories, setFormCalories] = useState('');
  const [formCategory, setFormCategory] = useState<FoodCategory>('basic');
  const [formPortion, setFormPortion] = useState('');

  // Toast alert
  const [logToast, setLogToast] = useState<{show: boolean, name: string} | null>(null);

  // Filter items
  const filteredCatalog = catalog.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.portionInfo && item.portionInfo.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Handle Log click trigger
  const handleLogClick = (item: FoodItem) => {
    setActiveLogItem(item);
  };

  const handleConfirmLog = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'extra') => {
    if (!activeLogItem) return;
    onAddToToday(activeLogItem, mealType);
    setLogToast({ show: true, name: activeLogItem.name });
    setActiveLogItem(null);
    setTimeout(() => setLogToast(null), 1500);
  };

  // Open modal in Create mode
  const openCreateModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCalories('');
    setFormCategory('basic');
    setFormPortion('');
    setIsModalOpen(true);
  };

  // Open modal in Edit mode
  const openEditModal = (item: FoodItem, e: MouseEvent) => {
    e.stopPropagation(); // Prevent logging when editing
    setEditingItem(item);
    setFormName(item.name);
    setFormCalories(item.calories.toString());
    setFormCategory(item.category);
    setFormPortion(item.portionInfo || '');
    setIsModalOpen(true);
  };

  // Handle Form Submit
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const caloriesNum = parseInt(formCalories);
    if (!formName.trim() || isNaN(caloriesNum) || caloriesNum < 0) return;

    const itemData = {
      name: formName.trim(),
      calories: caloriesNum,
      category: formCategory,
      portionInfo: formPortion.trim() || undefined
    };

    if (editingItem) {
      onEditItem(editingItem.id, itemData);
    } else {
      onAddItem(itemData);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Header and Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center">
            <Sparkles className="w-4 h-4 text-emerald-400 mr-2" />
            Catálogo de Alimentos
          </h2>
          <p className="text-[10px] text-slate-500 font-sans mt-0.5">Define ingredientes, recetas y comidas rápidas</p>
        </div>
        <button
          onClick={openCreateModal}
          id="btn-open-create-modal"
          className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors shadow-lg shadow-emerald-500/10"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3px]" />
          <span>Nuevo</span>
        </button>
      </div>

      {/* Toast Alert */}
      {logToast?.show && (
        <div className="fixed top-18 right-4 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-full shadow-lg z-50 flex items-center space-x-2 text-xs border border-emerald-300 transition-all animate-bounce">
          <Calendar className="w-4 h-4" />
          <span>Registrado: {logToast.name} ✔️</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar tortilla, pechuga, papa, etc..."
          id="catalog-search"
          className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-2.5 text-xs text-slate-500 hover:text-white"
          >
            ×
          </button>
        )}
      </div>

      {/* Horizonal Category Filters */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'basic', label: 'Básicos' },
          { id: 'dessert', label: 'Postres' },
          { id: 'recipe', label: 'Recetas' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id as any)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all flex-shrink-0 cursor-pointer border ${
              (selectedCategory === tab.id)
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items Scrollable List */}
      <div className="space-y-2">
        {filteredCatalog.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/60 border-dashed rounded-3xl py-12 px-6 text-center space-y-2">
            <p className="text-xs text-slate-500">No se encontraron alimentos en esta categoría.</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs text-emerald-400 hover:underline"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-2">
            {filteredCatalog.map((item) => (
              <div
                key={item.id}
                id={`catalog-card-${item.id}`}
                className="bg-slate-900/90 border border-slate-850 hover:border-slate-800 p-3 rounded-2xl flex items-center justify-between transition-all"
              >
                <div className="flex flex-col min-w-0 pr-3">
                  <span className="text-xs font-semibold text-white truncate max-w-[210px] sm:max-w-xs">
                    {item.name}
                  </span>
                  <div className="flex items-center space-x-2 mt-1 text-[10px] text-slate-500 font-mono">
                    <span className="bg-slate-950 text-slate-400 px-1.5 py-0.25 rounded-md text-[9px]">
                      {item.portionInfo || '1 porción'}
                    </span>
                    <span>•</span>
                    <span className="capitalize text-[9px] text-slate-400">
                      {item.category === 'basic' ? 'Básicos' : item.category === 'dessert' ? 'Postres' : 'Recetas'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  <div className="flex flex-col items-end mr-1.5">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {item.calories} kcal
                    </span>
                  </div>
                  
                  {/* Register to Today button - Tap targets must be accessible */}
                  <button
                    onClick={() => handleLogClick(item)}
                    id={`btn-log-item-${item.id}`}
                    className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 rounded-xl transition-all cursor-pointer"
                    title="Añadir al consumo de hoy"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5px]" />
                  </button>

                  {/* Edit catalog item details */}
                  <button
                    onClick={(e) => openEditModal(item, e)}
                    className="p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    title="Editar alimento"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete from Catalog database */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`¿Estás seguro de que quieres eliminar "${item.name}" del catálogo?`)) {
                        onDeleteItem(item.id);
                      }
                    }}
                    className="p-1.5 bg-slate-800/80 hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 rounded-xl transition-all cursor-pointer"
                    title="Eliminar del catálogo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Restablecer catálogo si el usuario hizo un estrago o quiere restaurar por defecto */}
      <div className="text-center pt-2">
        <button
          onClick={onResetCatalog}
          className="text-[10px] text-slate-500 hover:text-slate-400 font-mono tracking-wider underline cursor-pointer"
        >
          🔄 Restablecer base de datos inicial
        </button>
      </div>

      {/* Native Modal Drawer overlay for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end justify-center">
          {/* Box Container */}
          <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl w-full max-w-md p-5 pb-safe space-y-4 animate-slide-up relative">
            
            {/* Handle visual hook */}
            <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto -mt-2 mb-2" />

            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center">
                <FolderPlus className="w-4 h-4 mr-1.5 text-emerald-400" />
                {editingItem ? 'Editar Alimento' : 'Crear Nuevo Alimento'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-500 hover:text-white rounded-full bg-slate-850"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {/* Name */}
              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">Nombre</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Tortilla Pizza Express"
                  required
                  id="modal-food-name"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {/* Calories */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">Calorías (kcal)</label>
                  <input
                    type="number"
                    value={formCalories}
                    onChange={(e) => setFormCalories(e.target.value)}
                    placeholder="340"
                    required
                    min="0"
                    id="modal-food-calories"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>

                {/* Portions */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">Porción / Detalle</label>
                  <input
                    type="text"
                    value={formPortion}
                    onChange={(e) => setFormPortion(e.target.value)}
                    placeholder="200g, 1 und, taza..."
                    id="modal-food-portion"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 text-center focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">Categoría</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'basic', label: 'Básico' },
                    { id: 'dessert', label: 'Postre' },
                    { id: 'recipe', label: 'Receta' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormCategory(cat.id as FoodCategory)}
                      className={`py-2 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                        formCategory === cat.id
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 block w-full'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 block w-full'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="modal-food-submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold py-2.5 rounded-xl text-xs font-sans transition-colors cursor-pointer shadow-lg hover:shadow-emerald-500/10"
                >
                  {editingItem ? 'Guardar Cambios' : 'Añadir al Catálogo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Meal Selector Modal */}
      {activeLogItem && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-5 space-y-4 animate-fade-in shadow-2xl relative">
            
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-white">¿Para qué comida de hoy?</h3>
              <p className="text-[11px] text-slate-400">
                Registrarás <span className="font-semibold text-emerald-400">{activeLogItem.name}</span> ({activeLogItem.calories} kcal)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'breakfast', label: 'Desayuno', icon: '🍳', desc: 'Por la mañana' },
                { id: 'lunch', label: 'Almuerzo', icon: '🍲', desc: 'Mediodía' },
                { id: 'dinner', label: 'Cena', icon: '🥗', desc: 'Por la noche' },
                { id: 'extra', label: 'Snack / Extra', icon: '🧁', desc: 'Entredía / Postre' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleConfirmLog(m.id as any)}
                  className="bg-slate-950/50 border border-slate-800 hover:border-emerald-500/50 active:bg-slate-950 p-3 rounded-2xl text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 focus:outline-none hover:scale-[1.02]"
                >
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-white">{m.label}</p>
                    <p className="text-[9px] text-slate-500 font-sans">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveLogItem(null)}
              className="w-full bg-slate-800/80 hover:bg-slate-850 text-slate-400 hover:text-white py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
