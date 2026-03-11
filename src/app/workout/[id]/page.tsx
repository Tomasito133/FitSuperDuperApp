"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Plus, 
  Play, 
  Pause,
  Clock,
  Search,
  Trash2
} from "lucide-react";

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

// Мок-данные тренировки
const mockWorkout: WorkoutDetail = {
  id: "1",
  name: "Верх",
  duration: "1:18:32",
  volume: "9 882",
  exercises: [
    {
      id: "e1",
      name: "Подтягивания с резиной",
      sets: [
        { weight: 0, reps: 12 },
        { weight: 0, reps: 12 },
        { weight: 0, reps: 12 },
      ],
    },
    {
      id: "e2",
      name: "Тяга верхнего блока узким хватом",
      sets: [
        { weight: 52, reps: 12 },
        { weight: 52, reps: 10 },
        { weight: 52, reps: 10 },
      ],
    },
    {
      id: "e3",
      name: "Сведения в Бабочке",
      sets: [
        { weight: 45, reps: 12 },
        { weight: 45, reps: 10 },
        { weight: 45, reps: 10 },
      ],
    },
    {
      id: "e4",
      name: "Подъём гантелей перед собой сидя параллельным хватом",
      sets: [
        { weight: 15, reps: 15 },
        { weight: 15, reps: 15 },
      ],
    },
    {
      id: "e5",
      name: "Махи с гантелями стоя",
      sets: [
        { weight: 32, reps: 17 },
        { weight: 32, reps: 17 },
        { weight: 32, reps: 17 },
      ],
    },
    {
      id: "e6",
      name: "Махи с гантелями лежа на наклонной скамье",
      sets: [
        { weight: 18, reps: 15 },
        { weight: 18, reps: 12 },
        { weight: 18, reps: 12 },
      ],
    },
    {
      id: "e7",
      name: "Тяга косички к лицу сидя с нижнего блока",
      sets: [
        { weight: 15, reps: 20 },
        { weight: 15, reps: 20 },
        { weight: 15, reps: 20 },
      ],
    },
    {
      id: "e8",
      name: "Паучьи сгибания с EZ-штангой",
      sets: [
        { weight: 20, reps: 16 },
        { weight: 20, reps: 12 },
        { weight: 20, reps: 10 },
      ],
    },
    {
      id: "e9",
      name: "Французский жим гантелей по 1 руке на наклонной лавке",
      sets: [
        { weight: 0, reps: 16 },
        { weight: 0, reps: 12 },
        { weight: 0, reps: 10 },
      ],
    },
  ],
};

// Доступные упражнения из библиотеки с мышечными группами
const availableExercises = [
  { name: "Подтягивания", muscleGroup: "Спина" },
  { name: "Тяга верхнего блока", muscleGroup: "Спина" },
  { name: "Тяга штанги в наклоне", muscleGroup: "Спина" },
  { name: "Тяга одной рукой в наклоне", muscleGroup: "Спина" },
  { name: "Жим штанги лёжа", muscleGroup: "Грудь" },
  { name: "Жим гантелей лёжа", muscleGroup: "Грудь" },
  { name: "Сведение рук в кроссовере", muscleGroup: "Грудь" },
  { name: "Махи с гантелями стоя", muscleGroup: "Средние дельты" },
  { name: "Махи в кроссовере", muscleGroup: "Средние дельты" },
  { name: "Подъём гантелей перед собой", muscleGroup: "Передние дельты" },
  { name: "Махи с гантелями лежа", muscleGroup: "Задние дельты" },
  { name: "Обратная бабочка", muscleGroup: "Задние дельты" },
  { name: "Сгибания на бицепс", muscleGroup: "Бицепс" },
  { name: "Молотки", muscleGroup: "Бицепс" },
  { name: "Разгибания на трицепс", muscleGroup: "Трицепс" },
  { name: "Французский жим", muscleGroup: "Трицепс" },
  { name: "Приседания", muscleGroup: "Квадрицепс" },
  { name: "Выпады", muscleGroup: "Квадрицепс" },
  { name: "Становая тяга", muscleGroup: "Спина" },
  { name: "Подъём на носки", muscleGroup: "Икры" },
  { name: "Гиперэкстензия", muscleGroup: "Спина" },
  { name: "Скручивания", muscleGroup: "Пресс" },
  { name: "Планка", muscleGroup: "Пресс" },
];

function formatSets(sets: Set[]) {
  if (sets.every(s => s.weight === 0)) {
    return sets.map(s => s.reps).join(", ");
  }
  return sets.map(s => `${s.weight} кг × ${s.reps}`).join(", ");
}

// Расчёт объёма упражнения (вес × повторения)
function calculateExerciseVolume(sets: Set[]): number {
  return sets.reduce((total, set) => total + (set.weight * set.reps), 0);
}

// Расчёт общего объёма тренировки
function calculateWorkoutVolume(exercises: ExerciseInWorkout[]): number {
  return exercises.reduce((total, ex) => total + calculateExerciseVolume(ex.sets), 0);
}

// Форматирование объёма для отображения
function formatVolume(volume: number): string {
  return volume.toLocaleString("ru-RU");
}

// Ключ для localStorage тренировки
function getWorkoutKey(workoutId: string): string {
  return `workout_${workoutId}`;
}

// Ключ для localStorage упражнения
function getExerciseKey(workoutId: string, exerciseId: string): string {
  return `workout_${workoutId}_exercise_${exerciseId}`;
}

// Загрузка из localStorage
function loadFromStorage(workoutId: string): WorkoutDetail | null {
  if (typeof window === "undefined") return null;
  const key = getWorkoutKey(workoutId);
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

// Загрузка актуальных данных подходов из localStorage упражнения
function loadExerciseSetsFromStorage(workoutId: string, exerciseId: string): Set[] | null {
  if (typeof window === "undefined") return null;
  const key = getExerciseKey(workoutId, exerciseId);
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      const exercise = JSON.parse(saved);
      return exercise.sets || null;
    } catch {
      return null;
    }
  }
  return null;
}

// Сохранение в localStorage
function saveToStorage(workoutId: string, workout: WorkoutDetail): void {
  if (typeof window === "undefined") return;
  const key = getWorkoutKey(workoutId);
  localStorage.setItem(key, JSON.stringify(workout));
}

export default function WorkoutDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workoutId = (params.id as string) || "1";
  
  const [workout, setWorkout] = useState<WorkoutDetail>(() => {
    const saved = loadFromStorage(workoutId);
    let workoutData = saved || { ...mockWorkout, id: workoutId };
    
    // Подтягиваем актуальные данные подходов из localStorage упражнений
    workoutData.exercises = workoutData.exercises.map(ex => {
      const savedSets = loadExerciseSetsFromStorage(workoutId, ex.id);
      if (savedSets) {
        return { ...ex, sets: savedSets };
      }
      return ex;
    });
    
    return workoutData;
  });

  // Сохраняем при изменении workout + обновляем объём
  useEffect(() => {
    const volume = calculateWorkoutVolume(workout.exercises);
    const workoutWithVolume = { ...workout, volume: formatVolume(volume) };
    saveToStorage(workoutId, workoutWithVolume);
  }, [workout, workoutId]);

  // Обновляем данные при возврате на страницу
  useEffect(() => {
    const handleFocus = () => {
      setWorkout(prev => {
        const updatedExercises = prev.exercises.map(ex => {
          const savedSets = loadExerciseSetsFromStorage(workoutId, ex.id);
          if (savedSets) {
            return { ...ex, sets: savedSets };
          }
          return ex;
        });
        return { ...prev, exercises: updatedExercises };
      });
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [workoutId]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState("1:18:32");
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExercises = searchQuery
    ? availableExercises.filter(ex => {
        const query = searchQuery.toLowerCase();
        return (
          ex.name.toLowerCase().includes(query) ||
          ex.muscleGroup.toLowerCase().includes(query)
        );
      })
    : availableExercises;

  const handleAddExercise = () => {
    if (!selectedExercise) return;

    const newExercise: ExerciseInWorkout = {
      id: Date.now().toString(),
      name: selectedExercise,
      sets: [{ weight: 0, reps: 0 }],
    };

    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));

    setSelectedExercise("");
    setSearchQuery("");
    setIsAddExerciseOpen(false);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId),
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-gray-950 min-h-screen shadow-xl flex flex-col">
      {/* Header */}
      <header className="bg-orange-500 px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <Link 
            href="/" 
            className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <button 
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="flex items-center gap-2 text-white/80 hover:text-white"
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm">{elapsedTime}</span>
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-white/80 hover:text-white">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>

        <h1 className="text-3xl font-bold text-white">{workout.name}</h1>
      </header>

      {/* Volume Stats */}
      <div className="px-5 py-4 border-b border-gray-800">
        <div className="text-center">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Объём</p>
          <p className="text-white text-2xl font-bold">{formatVolume(calculateWorkoutVolume(workout.exercises))} кг</p>
        </div>
      </div>

      {/* Exercises List */}
      <main className="flex-1 px-5 py-4 pb-32 overflow-y-auto">
        <div className="space-y-4">
          {workout.exercises.map((exercise, index) => (
            <div key={exercise.id} className="border-b border-gray-800 last:border-0">
              <Link
                href={`/workout/${workout.id}/exercise?exercise=${exercise.id}`}
                className="block py-3"
              >
                <div className="flex items-start gap-3">
                  <span className="text-orange-500 font-bold text-lg w-6">{index + 1}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-base mb-1">{exercise.name}</h3>
                    <p className="text-gray-500 text-sm">{formatSets(exercise.sets)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteExercise(exercise.id);
                    }}
                    className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto px-5 pb-8 pt-4 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsAddExerciseOpen(true)}
            className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center text-orange-500 hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>

          <button className="flex-1 mx-4 bg-orange-500 text-white font-semibold py-4 rounded-full hover:bg-orange-600 transition-colors">
            Завершить
          </button>

          <div className="w-14" />
        </div>
      </div>

      {/* Add Exercise Modal */}
      {isAddExerciseOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsAddExerciseOpen(false)}
          />
          
          <div className="relative w-full max-w-md mx-auto bg-gray-900 rounded-t-3xl p-6 animate-slide-up">
            <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-6" />
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Добавить упражнение</h2>
              <button 
                onClick={() => setIsAddExerciseOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Поиск"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl py-3 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
            
            <div className="max-h-64 overflow-y-auto space-y-2 mb-6">
              {filteredExercises.map((exercise) => (
                <button
                  key={exercise.name}
                  onClick={() => setSelectedExercise(exercise.name)}
                  className={`w-full py-3 px-4 rounded-xl text-left transition-all flex items-center justify-between ${
                    selectedExercise === exercise.name
                      ? "bg-orange-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <span>{exercise.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedExercise === exercise.name
                      ? "bg-white/20 text-white"
                      : "bg-orange-500/20 text-orange-400"
                  }`}>
                    {exercise.muscleGroup}
                  </span>
                </button>
              ))}
              {filteredExercises.length === 0 && (
                <p className="text-gray-500 text-center py-4">Ничего не найдено</p>
              )}
            </div>

            <button
              onClick={handleAddExercise}
              disabled={!selectedExercise}
              className="w-full bg-orange-500 text-white font-semibold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
            >
              Добавить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
