import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { MealVisionService, MealScanResult } from '../services/MealVisionService';
import { 
  Utensils, 
  Plus, 
  Sparkles, 
  Scale, 
  Trash2, 
  Minus, 
  Droplet, 
  Flame, 
  ChevronRight, 
  Activity, 
  PlusCircle, 
  X, 
  Apple, 
  Clock, 
  Target, 
  AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageTransition } from '../components/PageTransition';
import { Link } from 'react-router-dom';

export const Nutrition: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [meals, setMeals] = useState<MealScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [waterIntake, setWaterIntake] = useState(1.2); // Liters

  // Form state for logging custom meals
  const [formData, setFormData] = useState({
    mealName: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    servingSize: '1 plate',
    mealType: 'Lunch' as 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
  });

  // Target goals
  const DAILY_GOALS = {
    calories: 2200,
    protein: 140, // g
    carbs: 240,   // g
    fat: 75       // g
  };

  const todayStr = useMemo(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const waterKey = useMemo(() => {
    return `aura_mock_water_${user?.id || 'demo'}_${todayStr}`;
  }, [user?.id, todayStr]);

  // Load meals and water intake on mount
  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await MealVisionService.getHistory(user?.id);
      setMeals(data);
    } catch (err) {
      console.error("Error loading nutrition history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();

    // Hydrate water intake from localStorage
    const savedWater = localStorage.getItem(waterKey);
    if (savedWater) {
      setWaterIntake(Number(savedWater));
    } else {
      setWaterIntake(1.2); // Default
    }
  }, [user?.id, waterKey]);

  // Helper to check if a meal belongs to today
  const isToday = (meal: MealScanResult) => {
    if (meal.id && (meal.id.startsWith("scan_") || meal.id.startsWith("manual_"))) {
      const tsStr = meal.id.replace("scan_", "").replace("manual_", "");
      const ts = Number(tsStr);
      if (!isNaN(ts)) {
        const mealDate = new Date(ts);
        const today = new Date();
        return mealDate.getDate() === today.getDate() &&
               mealDate.getMonth() === today.getMonth() &&
               mealDate.getFullYear() === today.getFullYear();
      }
    }
    
    // Fallback to parsing scanDate text
    try {
      const mealDate = new Date(meal.scanDate);
      const today = new Date();
      return mealDate.getDate() === today.getDate() &&
             mealDate.getMonth() === today.getMonth() &&
             mealDate.getFullYear() === today.getFullYear();
    } catch (_) {
      // If it doesn't parse, check if it contains today's short formatted date
      const todayString = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      return meal.scanDate?.includes(todayString);
    }
  };

  // Compute today's meals
  const todayMeals = useMemo(() => {
    return meals.filter(isToday);
  }, [meals]);

  // Compute totals
  const totals = useMemo(() => {
    return todayMeals.reduce((acc, meal) => {
      return {
        calories: acc.calories + (Number(meal.calories) || 0),
        protein: acc.protein + (Number(meal.protein) || 0),
        carbs: acc.carbs + (Number(meal.carbs) || 0),
        fat: acc.fat + (Number(meal.fat) || 0)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [todayMeals]);

  // Hydration change
  const handleUpdateWater = (amount: number) => {
    const newWater = Math.max(0, Math.round((waterIntake + amount) * 10) / 10);
    setWaterIntake(newWater);
    localStorage.setItem(waterKey, String(newWater));
    showToast(`Hydration updated: ${newWater} Liters`, "info");
  };

  // Handle manual log submission
  const handleAddManualMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mealName) {
      showToast("Please enter a meal or food name.", "error");
      return;
    }
    if (!formData.calories) {
      showToast("Please enter estimated calorie values.", "error");
      return;
    }

    const cals = Number(formData.calories);
    const prot = Number(formData.protein) || 0;
    const carb = Number(formData.carbs) || 0;
    const fats = Number(formData.fat) || 0;

    const manualResult: MealScanResult = {
      id: "scan_manual_" + Date.now(),
      mealName: formData.mealName,
      calories: cals,
      protein: prot,
      carbs: carb,
      fat: fats,
      fiber: Math.round(carb * 0.1),
      sugar: Math.round(carb * 0.15),
      sodium: Math.round(cals * 0.8),
      servingSize: formData.servingSize || "1 serving",
      confidenceScore: 100,
      healthScore: prot > 20 ? 88 : 72,
      imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&auto=format&fit=crop&q=60", // dynamic generic bento representation
      scanDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      detectedFoods: [
        { name: formData.mealName, calories: cals, protein: prot, carbs: carb, fat: fats, confidence: 100 }
      ],
      insights: [
        {
          id: "ins_man_" + Date.now(),
          type: "success",
          title: "Manual Food Log Entry",
          description: `Logged under ${formData.mealType} timeline segment.`
        }
      ],
      recommendations: [
        {
          id: "rec_man_" + Date.now(),
          title: "Caloric Tracking Consistency",
          description: "Tracking meal segments keeps active metabolism rates stable.",
          tag: "Tracking"
        }
      ]
    };

    try {
      await MealVisionService.saveToHistory(manualResult, user?.id);
      showToast(`${formData.mealName} logged successfully!`, "success");
      setShowLogModal(false);
      setFormData({
        mealName: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        servingSize: '1 plate',
        mealType: 'Lunch'
      });
      loadHistory();
    } catch (err) {
      console.error(err);
      showToast("Error saving manual food log.", "error");
    }
  };

  // Handle delete log
  const handleDeleteMeal = async (id: string) => {
    try {
      const updated = await MealVisionService.deleteFromHistory(id, user?.id);
      setMeals(updated);
      showToast("Meal log removed.", "success");
    } catch (err) {
      console.error(err);
      showToast("Could not delete log.", "error");
    }
  };

  // Percentages
  const caloriePercent = Math.min(100, Math.round((totals.calories / DAILY_GOALS.calories) * 100));
  const proteinPercent = Math.min(100, Math.round((totals.protein / DAILY_GOALS.protein) * 100));
  const carbsPercent = Math.min(100, Math.round((totals.carbs / DAILY_GOALS.carbs) * 100));
  const fatPercent = Math.min(100, Math.round((totals.fat / DAILY_GOALS.fat) * 100));

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Upper Header */}
      <header className="fixed top-0 left-0 right-0 h-16 glass-panel border-b border-white/5 z-30 flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px]">
            <div className="w-full h-full rounded-lg bg-[#050505] flex items-center justify-center">
              <Apple className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <span className="font-display font-bold text-sm tracking-wide">AURA NUTRITION LOGS</span>
        </div>
        <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-mono">
          Dietary Balance Sheets
        </span>
      </header>

      <div className="flex pt-16 flex-1">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        
        <main className={`flex-1 p-6 sm:p-10 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-72'}`}>
          <PageTransition>
            <div className="max-w-6xl mx-auto space-y-10">
            
              {/* Page Title */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-1">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
                    Thermodynamic Balance
                  </span>
                  <h1 className="text-3xl font-display font-bold text-white tracking-tight mt-0.5">
                    Dietary Sheets & Calorie Logs
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">
                    Manage calorie intakes, macronutrient quotas, and hydration balance to sustain athletic outputs.
                  </p>
                </div>
                <button 
                  onClick={() => setShowLogModal(true)}
                  className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/10 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log Food Log</span>
                </button>
              </div>

              {/* Vision Scanner Quick-Ad Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-emerald-600/15 via-teal-500/5 to-transparent border border-emerald-500/20 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-lg shadow-emerald-500/5">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">Vision Meal Scanner</span>
                  </div>
                  <h3 className="text-base font-display font-bold text-white mt-1">Want instant automated macro estimations?</h3>
                  <p className="text-xs text-gray-400 max-w-xl">
                    Take a snapshot or upload an image of your plate in the Aura Meal Vision Scanner. The cognitive engine decomposes ingredients, weights, and indexes instantly.
                  </p>
                </div>
                <Link 
                  to="/scanner"
                  className="flex-shrink-0 flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  <span>Try Food Scanner</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Nutrition Tracker dashboard grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT COLUMN: Calorie Progress & Macros Ring (Cols: 8) */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {/* Caloric Intake Status & Ring */}
                  <div className="glass-panel border border-white/5 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Ring score */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 pb-6 md:pb-0">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle className="stroke-white/5" fill="transparent" strokeWidth="10" r="58" cx="72" cy="72" />
                          <circle 
                            className="stroke-emerald-500 transition-all duration-1000 ease-out" 
                            fill="transparent" 
                            strokeWidth="10" 
                            strokeDasharray="364" 
                            strokeDashoffset={364 - (caloriePercent / 100) * 364}
                            strokeLinecap="round" 
                            r="58" 
                            cx="72" 
                            cy="72" 
                          />
                        </svg>
                        <div className="absolute text-center flex flex-col">
                          <span className="text-3xl font-display font-black text-white">{totals.calories}</span>
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest font-mono">kcal consumed</span>
                        </div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="md:col-span-8 space-y-4">
                      <div>
                        <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider font-bold">Intake Assessment</span>
                        <div className="flex items-baseline justify-between mt-1">
                          <h3 className="text-xl font-display font-bold text-white">Daily Thermodynamic Quota</h3>
                          <span className="text-xs font-mono text-gray-400">Target: {DAILY_GOALS.calories} kcal</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5">
                          <span className="text-[9px] text-gray-500 font-mono uppercase block">Budget Consumed</span>
                          <span className="text-lg font-display font-bold text-emerald-400">{caloriePercent}%</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/5">
                          <span className="text-[9px] text-gray-500 font-mono uppercase block">Calorie Deficit / Surplus</span>
                          <span className={`text-lg font-display font-bold ${
                            totals.calories <= DAILY_GOALS.calories ? 'text-indigo-400' : 'text-amber-400'
                          }`}>
                            {DAILY_GOALS.calories - totals.calories > 0 
                              ? `${DAILY_GOALS.calories - totals.calories} kcal remaining`
                              : `${Math.abs(DAILY_GOALS.calories - totals.calories)} kcal over`
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Macros Meters Progress Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Protein */}
                    <div className="glass-panel border border-white/5 rounded-3xl p-5 space-y-4 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase font-mono tracking-widest">Protein Quota</span>
                        <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">Lean Mass</span>
                      </div>
                      <div>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-2xl font-display font-black text-white">{totals.protein}g</span>
                          <span className="text-xs text-gray-500">/ {DAILY_GOALS.protein}g</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${proteinPercent}%` }}
                            className="h-full bg-blue-500 rounded-full"
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono mt-2 block">{proteinPercent}% of daily budget reached</span>
                      </div>
                    </div>

                    {/* Carbs */}
                    <div className="glass-panel border border-white/5 rounded-3xl p-5 space-y-4 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase font-mono tracking-widest">Carbs Quota</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">Glycogen</span>
                      </div>
                      <div>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-2xl font-display font-black text-white">{totals.carbs}g</span>
                          <span className="text-xs text-gray-500">/ {DAILY_GOALS.carbs}g</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${carbsPercent}%` }}
                            className="h-full bg-emerald-500 rounded-full"
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono mt-2 block">{carbsPercent}% of daily budget reached</span>
                      </div>
                    </div>

                    {/* Fats */}
                    <div className="glass-panel border border-white/5 rounded-3xl p-5 space-y-4 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase font-mono tracking-widest">Fats Quota</span>
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">Hormonal</span>
                      </div>
                      <div>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-2xl font-display font-black text-white">{totals.fat}g</span>
                          <span className="text-xs text-gray-500">/ {DAILY_GOALS.fat}g</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${fatPercent}%` }}
                            className="h-full bg-amber-500 rounded-full"
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono mt-2 block">{fatPercent}% of daily budget reached</span>
                      </div>
                    </div>

                  </div>

                  {/* List of today's logged meals */}
                  <div className="glass-panel border border-white/5 rounded-3xl p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Utensils className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-base font-display font-bold text-white">Logged Intake Log</h3>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">{todayMeals.length} records registered today</span>
                    </div>

                    {loading ? (
                      <div className="h-44 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : todayMeals.length === 0 ? (
                      <div className="p-10 text-center border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-500">
                          <Utensils className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">No food logs found for today</p>
                          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                            Add meals manually above, or scan meals in the visual vision scanner to automatically build calorie records.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {todayMeals.map((meal) => (
                          <div 
                            key={meal.id} 
                            className="flex items-center justify-between p-4 rounded-2xl bg-[#08080c]/60 border border-white/5 hover:border-white/10 transition-all group"
                          >
                            <div className="flex items-center space-x-4 min-w-0">
                              <img 
                                src={meal.imageUrl} 
                                alt={meal.mealName} 
                                className="w-12 h-12 object-cover rounded-xl border border-white/5 flex-shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0">
                                <h4 className="text-sm font-bold text-white truncate leading-snug">{meal.mealName}</h4>
                                <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 mt-1 text-[10px] font-mono text-gray-500">
                                  <span className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5 text-gray-300">
                                    {meal.servingSize}
                                  </span>
                                  <span>•</span>
                                  <span>P: <strong className="text-blue-400">{meal.protein}g</strong></span>
                                  <span>C: <strong className="text-emerald-400">{meal.carbs}g</strong></span>
                                  <span>F: <strong className="text-amber-400">{meal.fat}g</strong></span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 flex-shrink-0">
                              <div className="text-right">
                                <span className="text-sm font-display font-black text-white">{meal.calories} kcal</span>
                                <span className="text-[9px] text-gray-500 font-mono block mt-0.5">{meal.scanDate?.split(',')[1] || 'Logged'}</span>
                              </div>
                              <button 
                                onClick={() => handleDeleteMeal(meal.id)}
                                className="p-2 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-xl transition-colors cursor-pointer"
                                title="Delete meal log"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                </div>

                {/* RIGHT COLUMN: Hydration Tracker & Advice (Cols: 4) */}
                <div className="lg:col-span-4 space-y-8">
                  
                  {/* Hydration tracker */}
                  <div className="glass-panel border border-white/5 rounded-3xl p-6 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Droplet className="w-4 h-4 text-blue-400 animate-pulse" />
                        <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">Hydration Tracker</h3>
                      </div>
                      <span className="text-xs text-gray-500 font-mono">Goal: 3.0 L</span>
                    </div>

                    <div className="text-center py-4 space-y-2">
                      <div className="text-5xl font-display font-black text-white">
                        {waterIntake} <span className="text-base font-sans font-normal text-gray-400">Liters</span>
                      </div>
                      <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                        Keeping hydrated helps maintain performance outputs and cellular electrolytic balance.
                      </p>
                    </div>

                    {/* Quick increment buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button 
                        onClick={() => handleUpdateWater(-0.25)}
                        className="flex items-center justify-center space-x-1.5 py-3 border border-white/5 hover:border-white/10 bg-white/5 rounded-xl text-xs font-bold text-gray-300 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                        <span>- 250ml</span>
                      </button>
                      <button 
                        onClick={() => handleUpdateWater(0.25)}
                        className="flex items-center justify-center space-x-1.5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ 250ml</span>
                      </button>
                    </div>
                  </div>

                  {/* Clinically sound dietary tips */}
                  <div className="glass-panel border border-white/5 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Aura Dietary Principles</h4>
                    </div>
                    <ul className="text-xs text-gray-400 space-y-3.5 leading-relaxed">
                      <li className="flex items-start space-x-2.5">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span><strong>Hypertrophic splits:</strong> Target a minimum of 1.6g of protein per kg of total body mass.</span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span><strong>Carbohydrate timing:</strong> Consume dense glycogen carbs within 2 hours pre/post workouts.</span>
                      </li>
                      <li className="flex items-start space-x-2.5">
                        <span className="text-emerald-400 mt-0.5">•</span>
                        <span><strong>Salt control:</strong> Keep sodium accumulations below 2300mg to avoid vascular stiffness.</span>
                      </li>
                    </ul>
                  </div>

                </div>

              </div>

            </div>
          </PageTransition>
        </main>
      </div>

      {/* MODAL: Log custom manual foods */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg rounded-3xl bg-[#09090d] border border-white/10 overflow-hidden shadow-2xl"
            >
              {/* Modal Title bar */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <PlusCircle className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-display font-bold text-white tracking-tight">Log Meal Intake</h3>
                </div>
                <button 
                  onClick={() => setShowLogModal(false)}
                  className="p-1 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={handleAddManualMeal} className="p-6 space-y-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block">Food / Meal Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Scrambled Eggs & Toast"
                    value={formData.mealName}
                    onChange={(e) => setFormData({...formData, mealName: e.target.value})}
                    className="w-full bg-[#121217] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-gray-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block">Estimated Calories (kcal)</label>
                    <input 
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 350"
                      value={formData.calories}
                      onChange={(e) => setFormData({...formData, calories: e.target.value})}
                      className="w-full bg-[#121217] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-gray-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block">Serving size</label>
                    <input 
                      type="text"
                      placeholder="e.g. 2 eggs, 2 bread"
                      value={formData.servingSize}
                      onChange={(e) => setFormData({...formData, servingSize: e.target.value})}
                      className="w-full bg-[#121217] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block">Protein (g)</label>
                    <input 
                      type="number"
                      min="0"
                      placeholder="e.g. 18"
                      value={formData.protein}
                      onChange={(e) => setFormData({...formData, protein: e.target.value})}
                      className="w-full bg-[#121217] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-gray-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block">Carbs (g)</label>
                    <input 
                      type="number"
                      min="0"
                      placeholder="e.g. 30"
                      value={formData.carbs}
                      onChange={(e) => setFormData({...formData, carbs: e.target.value})}
                      className="w-full bg-[#121217] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-gray-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block">Fat (g)</label>
                    <input 
                      type="number"
                      min="0"
                      placeholder="e.g. 12"
                      value={formData.fat}
                      onChange={(e) => setFormData({...formData, fat: e.target.value})}
                      className="w-full bg-[#121217] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block">Meal Segment</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({...formData, mealType: type})}
                        className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          formData.mealType === type
                            ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400'
                            : 'bg-white/[0.01] border-white/5 hover:border-white/10 text-gray-400'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="flex-1 py-3 border border-white/5 hover:bg-white/5 text-gray-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/10 cursor-pointer"
                  >
                    Register Log
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
