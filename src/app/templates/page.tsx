"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Dumbbell,
  BookOpen,
  BarChart3,
  Settings,
  X
} from "lucide-react";

interface TemplateExercise {
  id: string;
  name: string;
  muscleGroup: string;
}

interface WorkoutTemplate {
  id: string;
  name: string;
  muscleGroup: string;
  exercises: TemplateExercise[];
}

// Дефолтные шаблоны
const defaultTemplates: WorkoutTemplate[] = [
  {
    id: "t1",
    name: "Верх",
    muscleGroup: "Спина, грудь, плечи",
    exercises: [],
  },
  {
    id: "t2",
    name: "Низ",
    muscleGroup: "Ноги, ягодицы",
    exercises: [],
  },
  {
    id: "t3",
    name: "Грудь и трицепс",
    muscleGroup: "Грудь, трицепс",
    exercises: [],
  },
  {
    id: "t4",
    name: "Спина и бицепс",
    muscleGroup: "Спина, бицепс",
    exercises: [],
  },
  {
    id: "t5",
    name: "Плечи",
    muscleGroup: "Дельты",
    exercises: [],
  },
  {
    id: "t6",
    name: "Руки",
    muscleGroup: "Бицепс, трицепс",
    exercises: [],
  },
  {
    id: "t7",
    name: "Ноги",
    muscleGroup: "Квадрицепс, бицепс бедра",
    exercises: [],
  },
];

// Ключ для localStorage
const TEMPLATES_KEY = "workout_templates";

// Загрузка шаблонов
function loadTemplates(): WorkoutTemplate[] {
  if (typeof window === "undefined") return defaultTemplates;
  const saved = localStorage.getItem(TEMPLATES_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultTemplates;
    }
  }
  return defaultTemplates;
}

// Сохранение шаблонов
function saveTemplates(templates: WorkoutTemplate[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateMuscleGroup, setNewTemplateMuscleGroup] = useState("");

  useEffect(() => {
    setTemplates(loadTemplates());
  }, []);

  useEffect(() => {
    saveTemplates(templates);
  }, [templates]);

  const handleAddTemplate = () => {
    if (!newTemplateName.trim()) return;

    const newTemplate: WorkoutTemplate = {
      id: Date.now().toString(),
      name: newTemplateName.trim(),
      muscleGroup: newTemplateMuscleGroup.trim() || "Общая",
      exercises: [],
    };

    setTemplates(prev => [...prev, newTemplate]);
    setNewTemplateName("");
    setNewTemplateMuscleGroup("");
    setIsAddModalOpen(false);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleCreateWorkoutFromTemplate = (template: WorkoutTemplate) => {
    const newWorkoutId = `workout_${Date.now()}`;
    const newWorkout = {
      id: newWorkoutId,
      name: template.name,
      duration: "0:00:00",
      volume: "0",
      exercises: [],
    };

    localStorage.setItem(`workout_${newWorkoutId}`, JSON.stringify(newWorkout));
    router.push(`/workout/${newWorkoutId}`);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-950 min-h-screen shadow-xl">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/" 
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-semibold text-white">Шаблоны</h1>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-orange-500"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Templates List */}
      <main className="px-5 pb-28">
        <div className="space-y-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-gray-900 rounded-2xl p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <button
                    onClick={() => handleCreateWorkoutFromTemplate(template)}
                    className="text-left w-full"
                  >
                    <h3 className="text-white font-bold text-base mb-1">{template.name}</h3>
                    <p className="text-gray-500 text-sm">{template.muscleGroup}</p>
                  </button>
                </div>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-colors"
                  title="Удалить"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Нет шаблонов</p>
            <p className="text-gray-600 text-sm mt-2">Нажмите + чтобы создать</p>
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

      {/* Add Template Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          />
          
          <div className="relative w-full max-w-md mx-auto bg-gray-900 rounded-t-3xl p-6 animate-slide-up">
            <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-6" />
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Новый шаблон</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Название</label>
                <input
                  type="text"
                  placeholder="Например: Моя тренировка"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Группы мышц</label>
                <input
                  type="text"
                  placeholder="Например: Спина, грудь"
                  value={newTemplateMuscleGroup}
                  onChange={(e) => setNewTemplateMuscleGroup(e.target.value)}
                  className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>
            </div>

            <button
              onClick={handleAddTemplate}
              disabled={!newTemplateName.trim()}
              className="w-full bg-orange-500 text-white font-semibold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
            >
              Создать
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
