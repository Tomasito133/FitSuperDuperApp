"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trophy, Dumbbell, BarChart3, Settings, MoreHorizontal, Zap, Check, BookOpen } from "lucide-react";

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
  calories: number;
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

// Мок-данные
const weekDays: DayStatus[] = [
  { shortName: "Пн", fullName: "Понедельник", date: 2, status: "rest" },
  { shortName: "Вт", fullName: "Вторник", date: 3, status: "completed" },
  { shortName: "Ср", fullName: "Среда", date: 4, status: "rest" },
  { shortName: "Чт", fullName: "Четверг", date: 5, status: "completed" },
  { shortName: "Пт", fullName: "Пятница", date: 6, status: "planned" },
  { shortName: "Сб", fullName: "Суббота", date: 7, status: "today" },
  { shortName: "Вс", fullName: "Воскресенье", date: 8, status: "rest" },
];

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
        calories: 372,
        muscleGroup: "Тяга",
      },
      {
        id: "2",
        dayName: "Вторник",
        name: "Низ",
        duration: "45 мин",
        volume: "9 732 кг",
        calories: 204,
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
        calories: 320,
        muscleGroup: "Грудь",
      },
      {
        id: "4",
        dayName: "Пятница",
        name: "Спина и бицепс",
        duration: "55 мин",
        volume: "10 150 кг",
        calories: 280,
        muscleGroup: "Спина",
      },
    ],
  },
];

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

export default function JournalPage() {
  const [activeTab, setActiveTab] = useState("journal");
  const [selectedDay, setSelectedDay] = useState("Сб");
  const [weekSections, setWeekSections] = useState<WeekSection[]>(initialWeekSections);

  // Загружаем актуальные данные при монтировании
  useEffect(() => {
    const loadWorkoutData = () => {
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
    };

    loadWorkoutData();

    // Обновляем данные при возврате на страницу
    const handleFocus = () => loadWorkoutData();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

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
          <span className="text-orange-500 font-medium text-base">Шаблоны</span>
          <button className="w-8 h-8 flex items-center justify-center text-orange-500">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-6">Дневник</h1>

        {/* Calendar Strip */}
        <div className="flex justify-between items-center">
          {weekDays.map((day) => (
            <button
              key={day.shortName}
              onClick={() => setSelectedDay(day.shortName)}
              className="flex flex-col items-center gap-1.5"
            >
              <span className={`text-xs font-medium ${
                selectedDay === day.shortName 
                  ? "text-orange-500" 
                  : day.status === "today" 
                    ? "text-orange-500" 
                    : "text-gray-500"
              }`}>
                {day.shortName}
              </span>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  selectedDay === day.shortName
                    ? "bg-orange-500 text-white ring-2 ring-orange-500/50"
                    : getDayCircleStyle(day)
                }`}
              >
                {getDayIndicator(day)}
              </div>
            </button>
          ))}
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
                    <h3 className="text-white font-bold text-base mb-2">{workout.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {workout.duration} · {workout.volume} · {workout.calories} ккал
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
    </div>
  );
}
