"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Plus, 
  Play, 
  Pause,
  Check,
  Clock,
  Dumbbell
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

// Текущая активная тренировка
const initialWorkout: WorkoutDetail = {
  id: "current",
  name: "Верх",
  duration: "0:00:00",
  volume: "0",
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
  ],
};

// Доступные упражнения из библиотеки
const availableExercises = [
  "Подтягивания",
  "Тяга верхнего блока",
  "Тяга штанги в наклоне",
  "Жим штанги лёжа",
  "Жим гантелей",
  "Махи с гантелями",
  "Сгибания на бицепс",
  "Разгибания на трицепс",
  "Приседания",
  "Выпады",
  "Становая тяга",
];

function formatSets(sets: Set[]) {
  if (sets.every(s => s.weight === 0)) {
    return sets.map(s => s.reps).join(", ");
  }
  return sets.map(s => `${s.weight} кг × ${s.reps}`).join(", ");
}

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export default function ActiveWorkoutPage() {
  const [workout, setWorkout] = useState(initialWorkout);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

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
    setIsAddExerciseOpen(false);
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
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
            onClick={toggleTimer}
            className="flex items-center gap-2 text-white/80 hover:text-white"
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm">{formatTime(elapsedSeconds)}</span>
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
          <p className="text-white text-2xl font-bold">{workout.volume} кг</p>
        </div>
      </div>

      {/* Exercises List */}
      <main className="flex-1 px-5 py-4 pb-32 overflow-y-auto">
        <div className="space-y-4">
          {workout.exercises.map((exercise, index) => (
            <div key={exercise.id} className="py-3 border-b border-gray-800 last:border-0">
              <div className="flex items-start gap-3">
                <span className="text-orange-500 font-bold text-lg w-6">{index + 1}</span>
                <div className="flex-1">
                  <h3 className="text-white font-medium text-base mb-1">{exercise.name}</h3>
                  <p className="text-gray-500 text-sm">{formatSets(exercise.sets)}</p>
                </div>
              </div>
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

          <Link 
            href="/"
            className="flex-1 mx-4 bg-orange-500 text-white font-semibold py-4 rounded-full hover:bg-orange-600 transition-colors text-center"
          >
            Завершить
          </Link>

          <Link
            href="/workout/active"
            className="w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <Dumbbell className="w-6 h-6" />
          </Link>
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

            <p className="text-gray-400 text-sm mb-3">Выберите из библиотеки</p>
            
            <div className="max-h-64 overflow-y-auto space-y-2 mb-6">
              {availableExercises.map((exercise) => (
                <button
                  key={exercise}
                  onClick={() => setSelectedExercise(exercise)}
                  className={`w-full py-3 px-4 rounded-xl text-left transition-all ${
                    selectedExercise === exercise
                      ? "bg-orange-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {exercise}
                </button>
              ))}
            </div>

            <Link
              href="/exercises"
              className="block w-full py-3 px-4 bg-gray-800 text-orange-500 rounded-xl text-center font-medium hover:bg-gray-700 transition-colors mb-4"
            >
              Открыть библиотеку →
            </Link>

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
