"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Trophy,
  Flame,
  Clock,
  ChevronRight,
  Plus,
  Dumbbell,
  BarChart3,
  BookOpen,
  Play,
} from "lucide-react";

// Типы данных
interface Workout {
  id: string;
  date: string;
  name: string;
  type: "strength" | "cardio" | "stretching";
  duration: string;
  volume?: string;
  calories?: number;
  heartRate?: number;
  emoji?: string;
  note?: string;
}

interface DayStatus {
  day: string;
  date: number;
  status: "completed" | "planned" | "rest";
}

// Мок-данные
const weekDays: DayStatus[] = [
  { day: "Mon", date: 3, status: "completed" },
  { day: "Tue", date: 4, status: "completed" },
  { day: "Wed", date: 5, status: "rest" },
  { day: "Thu", date: 6, status: "planned" },
  { day: "Fri", date: 7, status: "planned" },
  { day: "Sat", date: 8, status: "rest" },
  { day: "Sun", date: 9, status: "rest" },
];

const workouts: Workout[] = [
  {
    id: "1",
    date: "Wednesday",
    name: "Chest and Triceps",
    type: "strength",
    duration: "45 min",
    volume: "5 780 kg",
    heartRate: 118,
    emoji: "😎",
    note: "Great workout!",
  },
  {
    id: "2",
    date: "Tuesday",
    name: "Stretches",
    type: "stretching",
    duration: "20 min",
  },
  {
    id: "3",
    date: "Monday",
    name: "Cardio HIIT",
    type: "cardio",
    duration: "30 min",
    calories: 440,
    heartRate: 147,
  },
];

const upcomingWorkout = {
  name: "Legs and Abs",
  time: "Friday, 7:00",
};

// Цвета для типов тренировок
const typeColors = {
  strength: "border-l-orange-500",
  cardio: "border-l-yellow-500",
  stretching: "border-l-green-500",
};

const typeBadges = {
  strength: "bg-orange-100 text-orange-700",
  cardio: "bg-yellow-100 text-yellow-700",
  stretching: "bg-green-100 text-green-700",
};

export default function JournalPage() {
  const [activeTab, setActiveTab] = useState("journal");
  const [selectedDay, setSelectedDay] = useState("Thu");

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Journal</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <CalendarDays className="w-5 h-5" />
            </Button>
            <Button size="icon" className="bg-orange-500 hover:bg-orange-600">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Calendar Strip */}
        <div className="flex justify-between items-center mb-6">
          {weekDays.map((day) => (
            <button
              key={day.day}
              onClick={() => setSelectedDay(day.day)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                selectedDay === day.day
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="text-xs font-medium">{day.day}</span>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  day.status === "completed"
                    ? selectedDay === day.day
                      ? "bg-white text-orange-500"
                      : "bg-green-500 text-white"
                    : day.status === "planned"
                    ? selectedDay === day.day
                      ? "bg-white text-orange-500"
                      : "bg-orange-200 text-orange-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {day.status === "completed" ? "✓" : day.date}
              </div>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pb-24">
        {/* Next Workout */}
        <section className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            NEXT WORKOUT
          </p>
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{upcomingWorkout.time}</p>
                  <h3 className="text-lg font-bold text-gray-900">{upcomingWorkout.name}</h3>
                </div>
                <Button
                  size="icon"
                  className="bg-orange-500 hover:bg-orange-600 h-12 w-12 rounded-full"
                >
                  <Play className="w-5 h-5 ml-0.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* This Week Summary */}
        <section className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            THIS WEEK
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">5</span>
            </div>
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">25</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-bold text-gray-900">100 kg</span>
            </div>
          </div>
        </section>

        {/* Recent Workouts */}
        <section>
          <div className="space-y-3">
            {workouts.map((workout) => (
              <Card
                key={workout.id}
                className={`border-l-4 ${typeColors[workout.type]} shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">{workout.date}</p>
                      <h4 className="font-bold text-gray-900 mb-2">{workout.name}</h4>

                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        {workout.volume && (
                          <span className="flex items-center gap-1">
                            <Dumbbell className="w-4 h-4" />
                            {workout.volume}
                          </span>
                        )}
                        {workout.heartRate && (
                          <span className="flex items-center gap-1">
                            <span className="text-red-500">♥</span>
                            {workout.heartRate}
                          </span>
                        )}
                        {workout.calories && (
                          <span className="flex items-center gap-1">
                            <Flame className="w-4 h-4 text-orange-500" />
                            {workout.calories} cal
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {workout.duration}
                        </span>
                      </div>

                      {workout.note && (
                        <p className="mt-2 text-sm text-gray-600">
                          {workout.emoji} {workout.note}
                        </p>
                      )}
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setActiveTab("journal")}
            className={`flex flex-col items-center gap-1 ${
              activeTab === "journal" ? "text-orange-500" : "text-gray-400"
            }`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-xs font-medium">Journal</span>
          </button>

          <button
            onClick={() => setActiveTab("results")}
            className={`flex flex-col items-center gap-1 ${
              activeTab === "results" ? "text-orange-500" : "text-gray-400"
            }`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs font-medium">Results</span>
          </button>

          <button
            onClick={() => setActiveTab("exercises")}
            className={`flex flex-col items-center gap-1 ${
              activeTab === "exercises" ? "text-orange-500" : "text-gray-400"
            }`}
          >
            <Dumbbell className="w-6 h-6" />
            <span className="text-xs font-medium">Exercises</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
