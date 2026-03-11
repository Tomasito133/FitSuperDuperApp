"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trophy, Dumbbell, BarChart3, Settings, MoreHorizontal, Zap, Check, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

// Типы данных
interface Set {
  weight: number;
  reps: number;
}

interface ExerciseInWorkout {
  id: string;
  name: string;
  sets: Set[];
}

interface WorkoutDetail {
  id: string;
  name: string;
  duration: string;
  volume: string;
  exercises: ExerciseInWorkout[];
}

interface Workout {
  id: string;
  dayName: string;
  name: string;
  duration: string;
  volume: string;
  muscleGroup: string;
}

interface DayStatus {
  shortName: string;
  fullName: string;
  date: number;
  status: "completed" | "today" | "planned" | "rest";
}

interface WeekSection {
  title: string;
  trophyCount: number;
  workoutsCount: number;
  workouts: Workout[];
}

// Тип для шаблона тренировки
interface WorkoutTemplate {
  id: string;
  name: string;
  muscleGroup: string;
}

// Динамическая генерация дней недели с поддержкой смещения
function getWeekDays(weekOffset: number = 0): DayStatus[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = вс, 1 = пн, ..., 6 = сб
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset + weekOffset * 7);
  
  const days: DayStatus[] = [];
  const dayNames = [
    { short: "Пн", full: "Понедельник" },
    { short: "Вт", full: "Вторник" },
    { short: "Ср", full: "Среда" },
    { short: "Чт", full: "Четверг" },
    { short: "Пт", full: "Пятница" },
    { short: "Сб", full: "Суббота" },
    { short: "Вс", full: "Воскресенье" },
  ];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const isToday = date.toDateString() === today.toDateString();
    
    days.push({
      shortName: dayNames[i].short,
      fullName: dayNames[i].full,
      date: date.getDate(),
      status: isToday ? "today" : "rest",
    });
  }
  
  return days;
}

const currentWorkout = {
  label: "Сейчас",
  name: "Верх",
};

// Мок-данные тренировок
const initialWeekSections: WeekSection[] = [
  {
    title: "На этой неделе",
    trophyCount: 9,
    workoutsCount: 2,
    workouts: [
      {
        id: "1",
        dayName: "Четверг",
        name: "Тяни",
        duration: "1 ч 18 мин",
        volume: "13 836 кг",
        muscleGroup: "Тяга",
      },
      {
        id: "2",
        dayName: "Вторник",
        name: "Низ",
        duration: "45 мин",
        volume: "9 732 кг",
        muscleGroup: "Ноги",
      },
    ],
  },
  {
    title: "23 февраля—1 марта",
    trophyCount: 10,
    workoutsCount: 2,
    workouts: [
      {
        id: "3",
        dayName: "Воскресенье",
        name: "Грудь и трицепс",
        duration: "1 ч 5 мин",
        volume: "11 240 кг",
        muscleGroup: "Грудь",
      },
      {
        id: "4",
        dayName: "Пятница",
        name: "Спина и бицепс",
        duration: "55 мин",
        volume: "10 150 кг",
        muscleGroup: "Спина",
      },
    ],
  },
];

// Ключ для шаблонов (тот же, что и на странице templates)
const TEMPLATES_KEY = "workout_templates";

// Загрузка шаблонов из localStorage
function loadTemplatesFromStorage() {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(TEMPLATES_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
}

// Загрузка данных тренировки из localStorage
function loadWorkoutFromStorage(workoutId: string): WorkoutDetail | null {
  if (typeof window === "undefined") return null;
  const key = `workout_${workoutId}`;
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}

// Расчёт объёма упражнения
function calculateExerciseVolume(sets: Set[]): number {
  return sets.reduce((total, set) => total + (set.weight * set.reps), 0);
}

// Расчёт общего объёма тренировки
function calculateWorkoutVolume(exercises: ExerciseInWorkout[]): number {
  return exercises.reduce((total, ex) => total + calculateExerciseVolume(ex.sets), 0);
}

// Форматирование объёма
function formatVolume(volume: number): string {
  return volume.toLocaleString("ru-RU");
}

// Получить сегодняшний день недели (Пн-Вс)
function getTodayShortName(): string {
  const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  return dayNames[new Date().getDay()];
}

export default function JournalPage() {
  const [activeTab, setActiveTab] = useState("journal");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(getTodayShortName());
  const [weekSections, setWeekSections] = useState<WeekSection[]>(initialWeekSections);
  
  // Swipe detection state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);
  const minSwipeDistance = 50;
  
  // Получаем дни для текущей недели
  const weekDays = getWeekDays(weekOffset);
  
  // Обработчики свайпа
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setSlideDirection(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      // Свайп влево — будущие недели
      setSlideDirection("left");
      setTimeout(() => {
        setWeekOffset(prev => prev + 1);
        setSlideDirection(null);
      }, 150);
    } else if (isRightSwipe) {
      // Свайп вправо — прошлые недели
      setSlideDirection("right");
      setTimeout(() => {
        setWeekOffset(prev => prev - 1);
        setSlideDirection(null);
      }, 150);
    }
  };
  
  // Навигация по неделям
  const goToPreviousWeek = () => {
    setSlideDirection("right");
    setTimeout(() => {
      setWeekOffset(prev => prev - 1);
      setSlideDirection(null);
    }, 150);
  };
  const goToNextWeek = () => {
    setSlideDirection("left");
    setTimeout(() => {
      setWeekOffset(prev => prev + 1);
      setSlideDirection(null);
    }, 150);
  };
  const goToCurrentWeek = () => {
    setWeekOffset(0);
    setSelectedDay(getTodayShortName());
  };
  
  // Состояние для модалки шаблонов
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [pastWorkouts, setPastWorkouts] = useState<Workout[]>([]);

  // Состояние для редактирования названия тренировки
  const [editingWorkoutId, setEditingWorkoutId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  // Загружаем актуальные данные при монтировании
  useEffect(() => {
    const loadWorkoutData = () => {
      // Загружаем шаблоны
      setTemplates(loadTemplatesFromStorage());
      
      setWeekSections(prevSections => 
        prevSections.map(section => ({
          ...section,
          workouts: section.workouts.map(workout => {
            const savedWorkout = loadWorkoutFromStorage(workout.id);
            if (savedWorkout) {
              const volume = calculateWorkoutVolume(savedWorkout.exercises);
              return {
                ...workout,
                name: savedWorkout.name,
                volume: formatVolume(volume) + " кг",
              };
            }
            return workout;
          })
        }))
      );
      
      // Загружаем все прошедшие тренировки из localStorage (только реальные тренировки, не шаблоны)
      const allPastWorkouts: Workout[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Ищем только ключи вида workout_123 (ID тренировки), исключаем шаблоны и exercise данные
        if (key && key.startsWith("workout_") && !key.includes("_exercise_") && key !== "workout_templates") {
          const workoutId = key.replace("workout_", "");
          // Проверяем что ID - это число (реальная тренировка), а не строка типа "templates"
          if (/^\d+$/.test(workoutId)) {
            const saved = localStorage.getItem(key);
            if (saved) {
              try {
                const workoutData: WorkoutDetail = JSON.parse(saved);
                allPastWorkouts.push({
                  id: workoutId,
                  dayName: "",
                  name: workoutData.name,
                  duration: workoutData.duration,
                  volume: workoutData.volume,
                  muscleGroup: "",
                });
              } catch {}
            }
          }
        }
      }
      // Сортируем по ID (новые первые) и берём последние 5
      allPastWorkouts.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      setPastWorkouts(allPastWorkouts.slice(0, 5));
    };

    loadWorkoutData();

    // Обновляем данные при возврате на страницу
    const handleFocus = () => loadWorkoutData();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);
  
  // Создать тренировку из шаблона
  const handleCreateFromTemplate = (template: WorkoutTemplate) => {
    const newWorkoutId = Date.now().toString();
    const newWorkout: WorkoutDetail = {
      id: newWorkoutId,
      name: template.name,
      duration: "0:00:00",
      volume: "0",
      exercises: [],
    };
    
    localStorage.setItem(`workout_${newWorkoutId}`, JSON.stringify(newWorkout));
    setIsTemplatesOpen(false);
    
    // Переходим на страницу новой тренировки
    window.location.href = `/workout/${newWorkoutId}`;
  };

  // Начать редактирование названия
  const handleStartEditing = (workout: Workout) => {
    setEditingWorkoutId(workout.id);
    setEditingName(workout.name);
  };

  // Сохранить название
  const handleSaveName = (workoutId: string) => {
    // Обновляем в localStorage
    const savedWorkout = loadWorkoutFromStorage(workoutId);
    if (savedWorkout) {
      const updatedWorkout = { ...savedWorkout, name: editingName };
      localStorage.setItem(`workout_${workoutId}`, JSON.stringify(updatedWorkout));
    }
    
    // Обновляем в состоянии
    setWeekSections(prevSections =>
      prevSections.map(section => ({
        ...section,
        workouts: section.workouts.map(workout =>
          workout.id === workoutId ? { ...workout, name: editingName } : workout
        )
      }))
    );
    
    setEditingWorkoutId(null);
  };

  // Отменить редактирование
  const handleCancelEditing = () => {
    setEditingWorkoutId(null);
    setEditingName("");
  };

  const getDayCircleStyle = (day: DayStatus) => {
    switch (day.status) {
      case "completed":
        return "bg-orange-500 text-white";
      case "planned":
        return "bg-orange-500/20 text-orange-500";
      case "today":
        return "bg-gray-800 text-white border border-gray-600";
      default:
        return "bg-gray-800 text-gray-500";
    }
  };

  const getDayIndicator = (day: DayStatus) => {
    switch (day.status) {
      case "completed":
        return <Check className="w-4 h-4" />;
      case "planned":
        return <Zap className="w-4 h-4" />;
      default:
        return <span className="text-sm font-medium">{day.date}</span>;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-950 min-h-screen shadow-xl">
      {/* Header */}
      <header className="px-5 pt-6 pb-2">
        {/* Templates row */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/templates" className="text-orange-500 font-medium text-base hover:text-orange-400 transition-colors">
            Шаблоны
          </Link>
          <button 
            onClick={() => setIsTemplatesOpen(true)}
            className="w-8 h-8 flex items-center justify-center text-orange-500"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-6">Дневник</h1>

        {/* Calendar Strip - Compact, swipe only */}
        <div className="mb-4 flex flex-col items-center">
          {/* Today button row - aligned right with fixed height */}
          <div className="w-full max-w-[360px] flex justify-end mb-2 min-h-[36px]">
            {weekOffset !== 0 && (
              <button
                onClick={goToCurrentWeek}
                className="text-sm font-medium px-3 py-1.5 rounded-full bg-orange-500/20 text-orange-500 hover:bg-orange-500/30 transition-colors"
              >
                Сегодня
              </button>
            )}
          </div>
          
          {/* Days Strip with Swipe - Ultra compact */}
          <div 
            className={`flex items-center select-none transition-transform duration-150 ease-out ${
              slideDirection === "left" ? "-translate-x-4 opacity-70" : ""
            } ${slideDirection === "right" ? "translate-x-4 opacity-70" : ""}`}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {weekDays.map((day) => (
              <button
                key={day.shortName}
                onClick={() => setSelectedDay(day.shortName)}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-full transition-all ${
                  day.status === "today" && weekOffset === 0
                    ? "ring-2 ring-orange-500/50 bg-orange-500/15"
                    : ""
                }`}
              >
                <span className={`text-xs font-medium ${
                  (day.status === "today" && weekOffset === 0) || selectedDay === day.shortName
                    ? "text-orange-500"
                    : "text-gray-500"
                }`}>
                  {day.shortName}
                </span>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    selectedDay === day.shortName
                      ? "bg-orange-500 text-white"
                      : getDayCircleStyle(day)
                  }`}
                >
                  {getDayIndicator(day)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 pb-28 pt-4">
        {/* Current Workout Button */}
        <Link href="/workout/current" className="block mb-6">
          <div className="bg-orange-500 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-1.5 h-12 bg-white/30 rounded-full" />
            <div>
              <p className="text-white/80 text-sm">{currentWorkout.label}</p>
              <p className="text-white font-bold text-lg">{currentWorkout.name}</p>
            </div>
          </div>
        </Link>

        {/* Week Sections */}
        {weekSections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="mb-6">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white text-lg font-semibold">{section.title}</h2>
              <button className="text-gray-500">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-2 mb-4">
              <div className="bg-gray-800 rounded-full px-3 py-1.5 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-gray-400" />
                <span className="text-white text-sm font-medium">{section.trophyCount}</span>
              </div>
              <div className="bg-gray-800 rounded-full px-3 py-1.5">
                <span className="text-white text-sm font-medium">{section.workoutsCount} тренировки</span>
              </div>
            </div>

            {/* Workout Cards */}
            <div className="space-y-3">
              {section.workouts.map((workout) => (
                <Link
                  key={workout.id}
                  href={`/workout/${workout.id}`}
                  className="block bg-gray-900 rounded-2xl p-4 flex items-start gap-3 hover:bg-gray-800 transition-colors"
                >
                  <div className="w-1.5 h-12 bg-orange-500 rounded-full shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-500 text-sm mb-0.5">{workout.dayName}</p>
                    
                    {/* Название тренировки с возможностью редактирования */}
                    {editingWorkoutId === workout.id ? (
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={() => handleSaveName(workout.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveName(workout.id);
                            if (e.key === "Escape") handleCancelEditing();
                          }}
                          autoFocus
                          className="flex-1 bg-gray-800 text-white text-base font-bold px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          onClick={(e) => e.preventDefault()}
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSaveName(workout.id);
                          }}
                          className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg"
                        >
                          ✓
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCancelEditing();
                          }}
                          className="p-2 text-orange-500 hover:bg-orange-500/10 rounded-lg"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <h3 className="text-white font-bold text-base mb-2">
                        <span
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleStartEditing(workout);
                          }}
                          className="cursor-pointer hover:text-orange-400 transition-colors inline-block"
                        >
                          {workout.name}
                        </span>
                      </h3>
                    )}
                    
                    <p className="text-gray-400 text-sm">
                      {workout.duration} · {workout.volume}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-gray-900 border-t border-gray-800 px-2 pt-2 pb-6">
        <div className="flex justify-around items-center">
          <div className="flex flex-col items-center gap-1 py-2 px-3 text-orange-500">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs font-medium">Дневник</span>
          </div>

          <Link href="/results" className="flex flex-col items-center gap-1 py-2 px-3 text-gray-500 hover:text-orange-500 transition-colors">
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs font-medium">Результаты</span>
          </Link>

          <Link href="/exercises" className="flex flex-col items-center gap-1 py-2 px-3 text-gray-500 hover:text-orange-500 transition-colors">
            <Dumbbell className="w-6 h-6" />
            <span className="text-xs font-medium">Упражнения</span>
          </Link>

          <Link href="/settings" className="flex flex-col items-center gap-1 py-2 px-3 text-gray-500 hover:text-orange-500 transition-colors">
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">Настройки</span>
          </Link>
        </div>
      </nav>

      {/* Templates Modal */}
      {isTemplatesOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsTemplatesOpen(false)}
          />
          
          <div className="relative w-full max-w-md mx-auto bg-gray-900 rounded-t-3xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-6" />
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Новая тренировка</h2>
              <button 
                onClick={() => setIsTemplatesOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Шаблоны */}
            <div className="mb-8">
              <h3 className="text-orange-500 text-sm font-medium mb-3 uppercase tracking-wider">Шаблоны</h3>
              <div className="space-y-2">
                {templates.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Нет шаблонов</p>
                ) : (
                  templates.map((template: any) => (
                    <button
                      key={template.id}
                      onClick={() => handleCreateFromTemplate(template)}
                      className="w-full py-4 px-4 bg-gray-800 rounded-xl text-left hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{template.name}</p>
                          <p className="text-gray-500 text-sm">{template.muscleGroup}</p>
                        </div>
                        <span className="text-orange-500">→</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Прошлые тренировки */}
            {pastWorkouts.length > 0 && (
              <div>
                <h3 className="text-orange-500 text-sm font-medium mb-3 uppercase tracking-wider">Недавние</h3>
                <div className="space-y-2">
                  {pastWorkouts.slice(0, 5).map((workout) => (
                    <Link
                      key={workout.id}
                      href={`/workout/${workout.id}`}
                      onClick={() => setIsTemplatesOpen(false)}
                      className="block py-4 px-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-white font-medium">{workout.name}</p>
                        <span className="text-orange-500">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
