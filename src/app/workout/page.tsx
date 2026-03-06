"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  Plus,
  Clock,
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

export default function WorkoutPage() {
  const [isActive, setIsActive] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [editingTimer, setEditingTimer] = useState<number | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: "1",
      name: "Тяга верхнего блока узким хватом",
      muscleGroup: "ШИРОЧАЙШИЕ",
      sets: [
        { id: 1, weight: 52, reps: 12, restTime: 120 },
        { id: 2, weight: 52, reps: 10, restTime: 120 },
        { id: 3, weight: 52, reps: 10, restTime: 120 },
      ],
    },
  ]);

  const currentExercise = exercises[currentExerciseIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setWorkoutTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

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

  const updateSet = (setId: number, field: "weight" | "reps" | "restTime", value: number) => {
    setExercises((prev) => {
      const newExercises = [...prev];
      const set = newExercises[currentExerciseIndex].sets.find(
        (s) => s.id === setId
      );
      if (set) {
        set[field] = Math.max(0, value);
      }
      return newExercises;
    });
  };

  const addSet = () => {
    setExercises((prev) => {
      const newExercises = [...prev];
      const sets = newExercises[currentExerciseIndex].sets;
      const lastSet = sets[sets.length - 1];
      
      sets.push({
        id: Date.now(),
        weight: lastSet?.weight ?? 0,
        reps: lastSet?.reps ?? 0,
        restTime: lastSet?.restTime ?? 120,
      });
      return newExercises;
    });
  };

  return (
    <div className="max-w-md mx-auto bg-zinc-900 min-h-screen shadow-xl flex flex-col text-white">
      {/* Header */}
      <header className="bg-red-700 px-6 py-4 text-center">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-80">{currentExerciseIndex + 1} / {exercises.length}</span>
          <button
            onClick={() => setIsActive(!isActive)}
            className="p-2 rounded-full hover:bg-white/10"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>
        <div className="text-4xl font-bold">{formatTime(workoutTime)}</div>
        <div className="text-sm uppercase tracking-wider mt-1 opacity-80">
          {isActive ? "Тренировка" : "Пауза"}
        </div>
      </header>

      {/* Exercise Info */}
      <div className="px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 hover:bg-zinc-800 rounded-full">
            <ChevronLeft className="w-5 h-5 text-zinc-500" />
          </button>
          <button className="p-2 hover:bg-zinc-800 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-zinc-500" />
          </button>
        </div>
        <h2 className="text-xl font-bold text-orange-500 text-center">{currentExercise.name}</h2>
        <p className="text-sm text-zinc-400 text-center mt-1 uppercase">{currentExercise.muscleGroup}</p>
      </div>

      {/* Sets List */}
      <div className="flex-1 px-6 py-4 space-y-2">
        {currentExercise.sets.map((set, index) => (
          <Card
            key={set.id}
            className="bg-zinc-800 border-zinc-700 hover:border-zinc-600"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center text-sm font-medium text-zinc-300">
                  {index + 1}
                </span>

                <div className="flex-1 flex items-center justify-center gap-2">
                  <div className="text-center">
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSet(set.id, "weight", parseInt(e.target.value) || 0)}
                      className="w-16 text-3xl font-bold text-center bg-transparent border-b-2 border-transparent hover:border-zinc-600 focus:border-orange-500 focus:outline-none text-white"
                    />
                  </div>
                  <span className="text-zinc-500 text-lg">кг ×</span>
                  <div className="text-center">
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(set.id, "reps", parseInt(e.target.value) || 0)}
                      className="w-14 text-3xl font-bold text-center bg-transparent border-b-2 border-transparent hover:border-zinc-600 focus:border-orange-500 focus:outline-none text-white"
                    />
                  </div>
                </div>

                <div className="w-16">
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
                      className="w-full text-center text-sm bg-zinc-700 rounded px-2 py-1 text-white"
                      placeholder="мин"
                    />
                  ) : (
                    <button
                      onClick={() => setEditingTimer(set.id)}
                      className="w-full text-center text-sm text-zinc-400 hover:text-orange-500 bg-zinc-700/50 rounded px-2 py-2 transition-colors"
                    >
                      {formatTimeShort(set.restTime)}
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-zinc-800 px-6 py-4 bg-zinc-900">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
            disabled={currentExerciseIndex === 0}
            className="p-3 text-zinc-500 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={addSet}
            className="p-3 text-zinc-500 hover:text-white"
          >
            <Plus className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            className="w-16 h-16 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30"
          >
            {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          <button className="p-3 text-zinc-500 hover:text-white">
            <Clock className="w-6 h-6" />
          </button>

          <button
            onClick={() =>
              setCurrentExerciseIndex(Math.min(exercises.length - 1, currentExerciseIndex + 1))
            }
            disabled={currentExerciseIndex === exercises.length - 1}
            className="p-3 text-zinc-500 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
