"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MoreHorizontal, Plus, BookOpen, BarChart3, Dumbbell, Settings } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  hasImage?: boolean;
}

interface MuscleGroup {
  name: string;
  exercises: Exercise[];
}

interface Category {
  title: string;
  muscleGroups: MuscleGroup[];
}

// Мок-данные упражнений
const exerciseData: Category[] = [
  {
    title: "Силовые",
    muscleGroups: [
      {
        name: "Передние дельты",
        exercises: [
          { id: "1", name: "Махи гантелей сидя перед собой, сводя ладони вместе", hasImage: true },
          { id: "2", name: "Подъём гантелей перед собой сидя параллельным хватом", hasImage: true },
        ],
      },
      {
        name: "Средние дельты",
        exercises: [
          { id: "3", name: "Махи в кроссовере стоя", hasImage: true },
          { id: "4", name: "Махи в кроссовере стоя одной рукой", hasImage: true },
          { id: "5", name: "Махи с гантелями стоя", hasImage: true },
        ],
      },
      {
        name: "Задние дельты",
        exercises: [
          { id: "6", name: "Махи с гантелями лежа на наклонной скамье", hasImage: true },
          { id: "7", name: "Обратная бабочка", hasImage: true },
          { id: "8", name: "Тяга Ли-Хейни", hasImage: false },
          { id: "9", name: "Тяга косички к лицу сидя с нижнего", hasImage: false },
        ],
      },
      {
        name: "Грудь",
        exercises: [
          { id: "10", name: "Жим штанги лёжа", hasImage: true },
          { id: "11", name: "Жим гантелей лёжа", hasImage: true },
          { id: "12", name: "Сведение рук в кроссовере", hasImage: true },
          { id: "13", name: "Отжимания на брусьях", hasImage: false },
        ],
      },
      {
        name: "Спина",
        exercises: [
          { id: "14", name: "Тяга верхнего блока к груди", hasImage: true },
          { id: "15", name: "Тяга штанги в наклоне", hasImage: true },
          { id: "16", name: "Тяга одной рукой в наклоне", hasImage: true },
          { id: "17", name: "Подтягивания", hasImage: false },
        ],
      },
    ],
  },
];

// Placeholder для изображения упражнения
function ExerciseImagePlaceholder() {
  return (
    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
      <Dumbbell className="w-6 h-6 text-gray-600" />
    </div>
  );
}

export default function ExercisesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Фильтрация по поиску
  const filteredData = searchQuery
    ? exerciseData.map((category) => ({
        ...category,
        muscleGroups: category.muscleGroups
          .map((mg) => ({
            ...mg,
            exercises: mg.exercises.filter((ex) =>
              ex.name.toLowerCase().includes(searchQuery.toLowerCase())
            ),
          }))
          .filter((mg) => mg.exercises.length > 0),
      })).filter((cat) => cat.muscleGroups.length > 0)
    : exerciseData;

  return (
    <div className="max-w-md mx-auto bg-gray-950 min-h-screen shadow-xl">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white">
            <MoreHorizontal className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-white">Упражнения</h1>
          <button className="w-10 h-10 flex items-center justify-center text-orange-500">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl py-3 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>
      </header>

      {/* Content */}
      <main className="px-5 pb-28">
        {filteredData.map((category) => (
          <section key={category.title} className="mb-8">
            {/* Category Title */}
            <h2 className="text-white text-lg font-semibold mb-4">{category.title}</h2>

            {/* Muscle Groups */}
            <div className="space-y-6">
              {category.muscleGroups.map((muscleGroup) => (
                <div key={muscleGroup.name}>
                  {/* Muscle Group Name */}
                  <h3 className="text-orange-500 text-base font-medium mb-3">
                    {muscleGroup.name}
                  </h3>

                  {/* Exercises List */}
                  <div className="space-y-0">
                    {muscleGroup.exercises.map((exercise, index) => (
                      <div
                        key={exercise.id}
                        className={`flex items-center justify-between py-3 ${
                          index !== muscleGroup.exercises.length - 1
                            ? "border-b border-gray-800"
                            : ""
                        }`}
                      >
                        <span className="text-white text-base pr-4">{exercise.name}</span>
                        {exercise.hasImage && <ExerciseImagePlaceholder />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Ничего не найдено</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-gray-900 border-t border-gray-800 px-2 pt-2 pb-6">
        <div className="flex justify-around items-center">
          <Link href="/" className="flex flex-col items-center gap-1 py-2 px-3 text-gray-500 hover:text-orange-500 transition-colors">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs font-medium">Дневник</span>
          </Link>

          <Link href="/results" className="flex flex-col items-center gap-1 py-2 px-3 text-gray-500 hover:text-orange-500 transition-colors">
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs font-medium">Результаты</span>
          </Link>

          <div className="flex flex-col items-center gap-1 py-2 px-3 text-orange-500">
            <Dumbbell className="w-6 h-6" />
            <span className="text-xs font-medium">Упражнения</span>
          </div>

          <Link href="/settings" className="flex flex-col items-center gap-1 py-2 px-3 text-gray-500 hover:text-orange-500 transition-colors">
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">Настройки</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
