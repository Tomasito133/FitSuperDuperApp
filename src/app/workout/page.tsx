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
  BookOpen,
  Plus,
  Minus,
  RotateCcw,
  Trash2,
} from "lucide-react";

interface Set {
  id: number;
  weight: number;
  reps: number;
  restTime: number;
  completed: boolean;
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
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: "1",
      name: "Bench Press",
      muscleGroup: "CHEST",
      sets: [
        { id: 1, weight: 70, reps: 10, restTime: 60, completed: true },
        { id: 2, weight: 80, reps: 10, restTime: 60, completed: true },
        { id: 3, weight: 90, reps: 10, restTime: 90, completed: false },
      ],
    },
    {
      id: "2",
      name: "Incline Dumbbell Press",
      muscleGroup: "CHEST",
      sets: [
        { id: 1, weight: 30, reps: 12, restTime: 60, completed: false },
        { id: 2, weight: 30, reps: 12, restTime: 60, completed: false },
      ],
    },
  ]);

  const currentExercise = exercises[currentExerciseIndex];
  const completedSets = currentExercise.sets.filter((s) => s.completed).length;
  const totalSets = currentExercise.sets.length;

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
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleSetComplete = (setId: number) => {
    setExercises((prev) => {
      const newExercises = [...prev];
      const set = newExercises[currentExerciseIndex].sets.find(
        (s) => s.id === setId
      );
      if (set) {
        set.completed = !set.completed;
        if (set.completed && set.restTime > 0) {
          setIsResting(true);
          setRestTime(set.restTime);
        }
      }
      return newExercises;
    });
  };

  const updateSet = (setId: number, field: "weight" | "reps", delta: number) => {
    setExercises((prev) => {
      const newExercises = [...prev];
      const set = newExercises[currentExerciseIndex].sets.find(
        (s) => s.id === setId
      );
      if (set) {
        set[field] = Math.max(0, set[field] + delta);
      }
      return newExercises;
    });
  };

  const setSetValue = (setId: number, field: "weight" | "reps", value: number) => {
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
      const lastSet =
        newExercises[currentExerciseIndex].sets[
          newExercises[currentExerciseIndex].sets.length - 1
        ];
      newExercises[currentExerciseIndex].sets.push({
        id: Date.now(),
        weight: lastSet.weight,
        reps: lastSet.reps,
        restTime: lastSet.restTime,
        completed: false,
      });
      return newExercises;
    });
  };

  const deleteSet = (setId: number) => {
    setExercises((prev) => {
      const newExercises = [...prev];
      newExercises[currentExerciseIndex].sets = newExercises[
        currentExerciseIndex
      ].sets.filter((s) => s.id !== setId);
      newExercises[currentExerciseIndex].sets.forEach((set, idx) => {
        set.id = idx + 1;
      });
      return newExercises;
    });
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTime(0);
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
      <div
        className={`${
          isResting ? "bg-red-500" : "bg-orange-500"
        } text-white px-6 py-3 transition-colors`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              {isResting ? formatTime(restTime) : formatTime(workoutTime)}
            </span>
            {isResting && (
              <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">
                REST
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm">
              {currentExerciseIndex + 1}/{exercises.length}
            </span>
            <button
              onClick={() => setIsActive(!isActive)}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30"
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {isResting && (
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm">Rest time remaining</span>
            <button
              onClick={skipRest}
              className="text-sm underline hover:no-underline"
            >
              Skip
            </button>
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{currentExercise.name}</h2>
              <p className="text-sm text-gray-500">{currentExercise.muscleGroup}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="mt-2 text-center">
          <span className="text-sm text-gray-500">
            {completedSets}/{totalSets} sets completed
          </span>
        </div>
      </div>

      <div className="flex-1 px-6 py-4 space-y-3 overflow-auto">
        {currentExercise.sets.map((set, index) => (
          <Card
            key={set.id}
            className={`${
              set.completed
                ? "bg-gray-50 border-gray-200"
                : "border-orange-200 bg-white"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    set.completed
                      ? "bg-green-500 text-white"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {set.completed ? "✓" : index + 1}
                </span>

                <div className="flex items-center gap-1 flex-1 justify-center">
                  <button
                    onClick={() => updateSet(set.id, "weight", -5)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="text-center w-[60px]">
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) =>
                        setSetValue(set.id, "weight", parseInt(e.target.value) || 0)
                      }
                      className="w-full text-xl font-bold text-center bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-orange-500 focus:outline-none"
                    />
                    <span className="text-xs text-gray-500">kg</span>
                  </div>
                  <button
                    onClick={() => updateSet(set.id, "weight", 5)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <span className="text-gray-400 mx-1">×</span>

                  <button
                    onClick={() => updateSet(set.id, "reps", -1)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="text-center w-[50px]">
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) =>
                        setSetValue(set.id, "reps", parseInt(e.target.value) || 0)
                      }
                      className="w-full text-xl font-bold text-center bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-orange-500 focus:outline-none"
                    />
                    <span className="text-xs text-gray-500">reps</span>
                  </div>
                  <button
                    onClick={() => updateSet(set.id, "reps", 1)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteSet(set.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-colors"
                    title="Delete set"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleSetComplete(set.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      set.completed
                        ? "bg-green-500 text-white"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={addSet}
          variant="outline"
          className="w-full py-5 border-dashed border-2"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Set
        </Button>
      </div>

      <div className="border-t border-gray-200 px-6 py-4 bg-white">
        <div className="flex items-center justify-between">
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">Guide</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))
              }
              disabled={currentExerciseIndex === 0}
              className="p-3 bg-gray-100 rounded-full disabled:opacity-30 hover:bg-gray-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={() =>
                setCurrentExerciseIndex(
                  Math.min(exercises.length - 1, currentExerciseIndex + 1)
                )
              }
              disabled={currentExerciseIndex === exercises.length - 1}
              className="p-3 bg-orange-500 text-white rounded-full disabled:opacity-30 hover:bg-orange-600"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
            <RotateCcw className="w-6 h-6" />
            <span className="text-xs">History</span>
          </button>
        </div>
      </div>
    </div>
  );
}
