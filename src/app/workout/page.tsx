"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Check,
  ChevronRight,
  ChevronLeft,
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

export default function WorkoutPage() {
  const [isActive, setIsActive] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isSetActive, setIsSetActive] = useState(false);
  const [completedSets, setCompletedSets] = useState<number[]>([]);
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
  const currentSet = currentExercise.sets[currentSetIndex];

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
            if (currentSetIndex < currentExercise.sets.length - 1) {
              setCurrentSetIndex((i) => i + 1);
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTime, currentSetIndex, currentExercise.sets.length]);

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
      if (currentSetIndex < currentExercise.sets.length - 1) {
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
    setExercises((prev) => {
      const newExercises = [...prev];
      const sets = newExercises[currentExerciseIndex].sets;
      const index = sets.findIndex((s) => s.id === setId);
      if (index > -1) {
        sets.splice(index, 1);
        if (index < currentSetIndex) {
          setCurrentSetIndex((i) => Math.max(0, i - 1));
        }
        if (currentSetIndex >= sets.length) {
          setCurrentSetIndex(Math.max(0, sets.length - 1));
        }
      }
      return newExercises;
    });
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
      <header className={`px-6 py-4 text-center transition-colors ${
        isResting ? "bg-red-600" : "bg-red-700"
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-80">
            {isResting ? "ОТДЫХ" : `${currentSetIndex + 1} / ${currentExercise.sets.length}`}
          </span>
          <button
            onClick={() => setIsActive(!isActive)}
            className="p-2 rounded-full hover:bg-white/10"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>
        <div className="text-4xl font-bold">
          {isResting ? formatTime(restTime) : formatTime(workoutTime)}
        </div>
        <div className="text-sm uppercase tracking-wider mt-1 opacity-80">
          {isResting ? formatTimeShort(currentSet.restTime) + " отдых" : isSetActive ? "В работе" : "Готов"}
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
        {currentExercise.sets.map((set, index) => {
          const isCurrent = index === currentSetIndex;
          const isCompleted = isSetCompleted(set.id);
          
          return (
            <Card
              key={set.id}
              className={`border-0 ${
                isCurrent 
                  ? "bg-zinc-700/50" 
                  : isCompleted 
                    ? "bg-zinc-800/50 opacity-60" 
                    : "bg-zinc-800"
              }`}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                    isCurrent ? "bg-orange-500 text-white" : "bg-zinc-700 text-zinc-400"
                  }`}>
                    {index + 1}
                  </span>

                  <div className="flex-1 flex items-center justify-center gap-2">
                    <div className="text-center">
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => updateSet(set.id, "weight", parseInt(e.target.value) || 0)}
                        disabled={isCompleted}
                        className={`w-16 text-3xl font-bold text-center bg-transparent border-b-2 border-transparent focus:border-orange-500 focus:outline-none ${
                          isCurrent ? "text-orange-500" : "text-white"
                        } ${isCompleted ? "opacity-50" : "hover:border-zinc-600"}`}
                      />
                    </div>
                    <span className="text-zinc-500 text-lg">кг ×</span>
                    <div className="text-center">
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateSet(set.id, "reps", parseInt(e.target.value) || 0)}
                        disabled={isCompleted}
                        className={`w-14 text-3xl font-bold text-center bg-transparent border-b-2 border-transparent focus:border-orange-500 focus:outline-none ${
                          isCurrent ? "text-orange-500" : "text-white"
                        } ${isCompleted ? "opacity-50" : "hover:border-zinc-600"}`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => !isCompleted && setEditingTimer(set.id)}
                      disabled={isCompleted}
                      className={`text-center text-xs rounded px-2 py-2 min-w-[50px] transition-colors ${
                        isCompleted 
                          ? "text-zinc-600 bg-zinc-800" 
                          : "text-zinc-400 hover:text-orange-500 bg-zinc-700/50"
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
                        className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
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
            onClick={handleMainButton}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              isResting 
                ? "bg-red-500 hover:bg-red-600 shadow-red-500/30" 
                : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30"
            }`}
          >
            {isResting ? (
              <span className="text-sm font-bold">Skip</span>
            ) : isSetActive ? (
              <Check className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>

          <button className="p-3 text-zinc-500 hover:text-white"
          >
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
