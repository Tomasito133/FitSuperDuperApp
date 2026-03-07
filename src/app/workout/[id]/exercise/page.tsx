"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Play,
  Pause,
  Check,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  Clock,
  Trash2,
} from "lucide-react";

interface Set {
  id: number;
  weight: number;
  reps: number;
  restTime: number;
}

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: Set[];
}

// Мок-данные упражнения
const mockExercise: Exercise = {
  id: "e2",
  name: "Тяга верхнего блока узким хватом",
  muscleGroup: "ШИРОЧАЙШИЕ",
  sets: [
    { id: 1, weight: 52, reps: 12, restTime: 120 },
    { id: 2, weight: 52, reps: 10, restTime: 120 },
    { id: 3, weight: 52, reps: 10, restTime: 120 },
  ],
};

export default function ExerciseSetsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const workoutId = params.id as string;
  const exerciseId = searchParams.get("exercise") || "e2";

  const [isActive, setIsActive] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isSetActive, setIsSetActive] = useState(false);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
  const [editingTimer, setEditingTimer] = useState<number | null>(null);
  const [exercise, setExercise] = useState<Exercise>(mockExercise);

  const currentSet = exercise.sets[currentSetIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isResting) {
      interval = setInterval(() => {
        setWorkoutTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isResting]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTime > 0) {
      interval = setInterval(() => {
        setRestTime((t) => {
          if (t <= 1) {
            setIsResting(false);
            setIsSetActive(false);
            if (currentSetIndex < exercise.sets.length - 1) {
              setCurrentSetIndex((i) => i + 1);
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTime, currentSetIndex, exercise.sets.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTimeShort = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMainButton = () => {
    if (isResting) {
      setIsResting(false);
      setRestTime(0);
      setIsSetActive(false);
      if (currentSetIndex < exercise.sets.length - 1) {
        setCurrentSetIndex((i) => i + 1);
      }
    } else if (isSetActive) {
      setCompletedSets([...completedSets, currentSet.id]);
      setIsSetActive(false);
      setIsResting(true);
      setRestTime(currentSet.restTime);
    } else {
      setIsSetActive(true);
      setIsActive(true);
    }
  };

  const isSetCompleted = (setId: number) => completedSets.includes(setId);

  const deleteSet = (setId: number) => {
    setExercise((prev) => ({
      ...prev,
      sets: prev.sets.filter((s) => s.id !== setId),
    }));
    if (currentSetIndex >= exercise.sets.length - 1) {
      setCurrentSetIndex(Math.max(0, exercise.sets.length - 2));
    }
  };

  const updateSet = (setId: number, field: "weight" | "reps" | "restTime", value: number) => {
    setExercise((prev) => ({
      ...prev,
      sets: prev.sets.map((s) =>
        s.id === setId ? { ...s, [field]: Math.max(0, value) } : s
      ),
    }));
  };

  const addSet = () => {
    setExercise((prev) => {
      const lastSet = prev.sets[prev.sets.length - 1];
      return {
        ...prev,
        sets: [
          ...prev.sets,
          {
            id: Date.now(),
            weight: lastSet?.weight ?? 0,
            reps: lastSet?.reps ?? 0,
            restTime: lastSet?.restTime ?? 120,
          },
        ],
      };
    });
  };

  return (
    <div className="max-w-md mx-auto bg-gray-950 min-h-screen shadow-xl flex flex-col text-white">
      {/* Header */}
      <header className={`px-6 py-4 text-center transition-colors ${
        isResting ? "bg-red-600" : "bg-orange-500"
      }`}>
        <div className="flex items-center justify-between mb-2">
          <Link 
            href={`/workout/${workoutId}`} 
            className="p-2 rounded-full hover:bg-white/10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="text-sm opacity-80">
            {isResting ? "ОТДЫХ" : `${currentSetIndex + 1} / ${exercise.sets.length}`}
          </span>
          <button
            onClick={() => setIsActive(!isActive)}
            className="p-2 rounded-full hover:bg-white/10"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>
        <div className="text-5xl font-bold">
          {isResting ? formatTime(restTime) : formatTime(workoutTime)}
        </div>
        <div className="text-sm uppercase tracking-wider mt-1 opacity-80">
          {isResting ? formatTimeShort(currentSet.restTime) + " отдых" : isSetActive ? "В работе" : "Готов"}
        </div>
      </header>

      {/* Exercise Info */}
      <div className="px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-bold text-orange-500 text-center">{exercise.name}</h2>
        <p className="text-sm text-gray-400 text-center mt-1 uppercase">{exercise.muscleGroup}</p>
      </div>

      {/* Sets List */}
      <div className="flex-1 px-6 py-4 space-y-3 overflow-y-auto">
        {exercise.sets.map((set, index) => {
          const isCurrent = index === currentSetIndex;
          const isCompleted = isSetCompleted(set.id);
          
          return (
            <div
              key={set.id}
              className={`rounded-2xl p-4 ${
                isCurrent 
                  ? "bg-gray-800" 
                  : isCompleted 
                    ? "bg-gray-800/50 opacity-60" 
                    : "bg-gray-800/30"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                  isCurrent ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-400"
                }`}>
                  {index + 1}
                </span>

                <div className="flex-1 flex items-center justify-center gap-2">
                  <input
                    type="number"
                    value={set.weight}
                    onChange={(e) => updateSet(set.id, "weight", parseInt(e.target.value) || 0)}
                    disabled={isCompleted}
                    className={`w-16 text-4xl font-bold text-center bg-transparent focus:outline-none ${
                      isCurrent ? "text-orange-500" : "text-white"
                    } ${isCompleted ? "opacity-50" : ""}`}
                  />
                  <span className="text-gray-500 text-lg">кг ×</span>
                  
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => updateSet(set.id, "reps", parseInt(e.target.value) || 0)}
                    disabled={isCompleted}
                    className={`w-14 text-4xl font-bold text-center bg-transparent focus:outline-none ${
                      isCurrent ? "text-orange-500" : "text-white"
                    } ${isCompleted ? "opacity-50" : ""}`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => !isCompleted && setEditingTimer(set.id)}
                    disabled={isCompleted}
                    className={`text-center text-sm rounded-lg px-3 py-2 min-w-[60px] transition-colors ${
                      isCompleted 
                        ? "text-gray-600 bg-gray-700" 
                        : "text-gray-400 hover:text-orange-500 bg-gray-700"
                    }`}
                  >
                    {editingTimer === set.id ? (
                      <input
                        type="number"
                        value={Math.floor(set.restTime / 60)}
                        onChange={(e) => {
                          const mins = parseInt(e.target.value) || 0;
                          updateSet(set.id, "restTime", mins * 60);
                        }}
                        onBlur={() => setEditingTimer(null)}
                        autoFocus
                        className="w-10 text-center bg-transparent"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      formatTimeShort(set.restTime)
                    )}
                  </button>

                  {!isCompleted && (
                    <button
                      onClick={() => deleteSet(set.id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-800 px-6 py-4 bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="w-12" />

          <button
            onClick={addSet}
            className="p-3 text-gray-500 hover:text-white"
          >
            <Plus className="w-6 h-6" />
          </button>

          <button
            onClick={handleMainButton}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              isResting 
                ? "bg-red-500 hover:bg-red-600 shadow-red-500/30" 
                : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30"
            }`}
          >
            {isResting ? (
              <span className="text-sm font-bold">Пропуск</span>
            ) : isSetActive ? (
              <Check className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>

          <button className="p-3 text-gray-500 hover:text-white"
          >
            <Clock className="w-6 h-6" />
          </button>

          <div className="w-12" />
        </div>
      </div>
    </div>
  );
}
