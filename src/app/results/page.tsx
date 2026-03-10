"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  MoreHorizontal,
  Dumbbell,
  BookOpen,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Ruler
} from "lucide-react";

// Типы данных
interface WeightEntry {
  date: string;
  weight: number;
  fatPercent: number | null;
}

interface PhotoEntry {
  id: string;
  date: string;
  url: string;
}

// Мок-данные для истории тренировок по датам
const workoutHistory: Record<string, number> = {
  "2026-03-01": 1,
  "2026-03-03": 1,
  "2026-03-05": 1,
  "2026-03-07": 1,
  "2026-03-08": 1,
  "2026-03-10": 1,
};

// Мок-данные для веса
const weightHistory: WeightEntry[] = [
  { date: "2026-02-24", weight: 85.5, fatPercent: 18 },
  { date: "2026-03-01", weight: 84.8, fatPercent: 17.5 },
  { date: "2026-03-08", weight: 84.2, fatPercent: 17 },
];

// Генерируем календарь на месяц
function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  
  const days: { date: number | null; fullDate: string | null }[] = [];
  
  // Дни из предыдущего месяца
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDay - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    days.push({ 
      date: d, 
      fullDate: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    });
  }
  
  // Дни текущего месяца
  for (let d = 1; d <= daysInMonth; d++) {
    const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({ date: d, fullDate });
  }
  
  // Дни из следующего месяца для заполнения сетки
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    days.push({ 
      date: d, 
      fullDate: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    });
  }
  
  return days;
}

const monthNames = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

export default function ResultsPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  
  const calendarDays = generateCalendarDays(currentYear, currentMonth);
  const monthName = monthNames[currentMonth];
  
  // Подсчёт тренировок за месяц
  const workoutsThisMonth = Object.keys(workoutHistory).filter(date => {
    const [y, m] = date.split('-').map(Number);
    return y === currentYear && m === currentMonth + 1;
  }).length;
  
  // Целевое количество тренировок в месяц
  const targetWorkouts = 12;
  const progressPercent = Math.min((workoutsThisMonth / targetWorkouts) * 100, 100);
  
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button className="w-10 h-10 flex items-center justify-center text-gray-400">
            <MoreHorizontal className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-white">Результаты</h1>
          <button className="w-10 h-10 flex items-center justify-center text-red-500">
            <Plus className="w-6 h-6" />
          </button>
        </div>
        
        {/* Month selector */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={prevMonth}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-medium text-white">
            {monthName} {currentYear}
          </span>
          <button 
            onClick={nextMonth}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      <main className="px-5 pb-28">
        {/* История тренировок */}
        <section className="bg-[#1c1c1e] rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">История</h2>
            <button className="text-gray-400">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex gap-4">
            {/* Календарь */}
            <div className="flex-1">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day, i) => (
                  <div key={i} className="text-center text-xs text-gray-500 py-1">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  const hasWorkout = day.fullDate && workoutHistory[day.fullDate];
                  const isCurrentMonth = day.fullDate && day.fullDate.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`);
                  
                  return (
                    <div 
                      key={i} 
                      className={`
                        aspect-square flex items-center justify-center text-sm
                        ${!isCurrentMonth ? 'text-gray-600' : hasWorkout ? 'text-white' : 'text-gray-400'}
                        ${hasWorkout ? 'bg-red-500 rounded-full' : ''}
                      `}
                    >
                      {day.date}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Статистика */}
            <div className="flex flex-col items-center justify-center w-20">
              <div className="relative w-16 h-16 mb-2">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3a3a3c"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeDasharray={`${progressPercent}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{workoutsThisMonth}</span>
                </div>
              </div>
              <span className="text-gray-400 text-xs">Всего: {workoutsThisMonth}</span>
            </div>
          </div>
        </section>
        
        {/* Весы */}
        <section className="bg-[#1c1c1e] rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">Весы</h2>
            <button className="text-gray-400">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#2c2c2e] rounded-xl p-4">
              <span className="text-gray-400 text-sm">Вес</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-white text-2xl font-bold">
                  {weightHistory[weightHistory.length - 1]?.weight || '--'}
                </span>
                <span className="text-gray-400 text-sm">кг</span>
              </div>
            </div>
            <div className="bg-[#2c2c2e] rounded-xl p-4">
              <span className="text-gray-400 text-sm">Процент жира</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-white text-2xl font-bold">
                  {weightHistory[weightHistory.length - 1]?.fatPercent || '--'}
                </span>
                <span className="text-gray-400 text-sm">%</span>
              </div>
            </div>
          </div>
          
          {/* График веса (упрощённый) */}
          <div className="h-24 flex items-end gap-2 mb-4 px-2">
            {weightHistory.map((entry, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-red-500 rounded-t"
                  style={{ 
                    height: `${((entry.weight - 80) / 10) * 100}%`,
                    minHeight: '8px'
                  }}
                />
                <span className="text-gray-500 text-xs">
                  {entry.date.split('-')[2]}
                </span>
              </div>
            ))}
          </div>
          
          <button className="w-full bg-red-500 text-white font-medium py-3 rounded-xl">
            Записать
          </button>
        </section>
        
        {/* Фотографии */}
        <section className="bg-[#1c1c1e] rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">Фотографии</h2>
            <button className="text-gray-400">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="aspect-square bg-[#2c2c2e] rounded-xl flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-500" />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className="aspect-square bg-[#2c2c2e] rounded-xl"
              />
            ))}
          </div>
        </section>
        
        {/* Замеры */}
        <section className="bg-[#1c1c1e] rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-gray-400" />
              <h2 className="text-white text-lg font-semibold">Замеры</h2>
            </div>
            <button className="text-gray-400">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-0">
            {/* Однозначные замеры */}
            {[
              { label: "Шея", key: "neck" },
              { label: "Плечи", key: "shoulders" },
              { label: "Грудь", key: "chest" },
              { label: "Талия", key: "waist" },
              { label: "Живот", key: "abdomen" },
              { label: "Таз", key: "hips" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-800">
                <span className="text-gray-400 text-base">{item.label}</span>
                <span className="text-white text-base">—</span>
              </div>
            ))}
            
            {/* Парные замеры (лево/право) */}
            {[
              { label: "Предплечье", key: "forearm" },
              { label: "Бицепс", key: "bicep" },
              { label: "Бедро", key: "thigh" },
              { label: "Икры", key: "calves" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-800">
                <span className="text-gray-400 text-base">{item.label}</span>
                <div className="flex gap-4">
                  <span className="text-white text-base">—</span>
                  <span className="text-white text-base">—</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Статистика */}
        <section className="bg-[#1c1c1e] rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-lg font-semibold">Статистика</h2>
            <button className="text-gray-400">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#2c2c2e] rounded-xl p-4">
              <span className="text-gray-400 text-sm">Тренировок</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-white text-2xl font-bold">10</span>
                <span className="text-gray-400 text-sm">/мес</span>
              </div>
            </div>
            <div className="bg-[#2c2c2e] rounded-xl p-4">
              <span className="text-gray-400 text-sm">Общее время</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-white text-2xl font-bold">12</span>
                <span className="text-gray-400 text-sm">ч</span>
              </div>
            </div>
            <div className="bg-[#2c2c2e] rounded-xl p-4">
              <span className="text-gray-400 text-sm">Подходов</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-white text-2xl font-bold">156</span>
              </div>
            </div>
            <div className="bg-[#2c2c2e] rounded-xl p-4">
              <span className="text-gray-400 text-sm">Сожжено</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-white text-2xl font-bold">3 840</span>
                <span className="text-gray-400 text-sm">ккал</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#1c1c1e] border-t border-gray-800 px-2 pt-2 pb-6">
        <div className="flex justify-around items-center">
          <Link href="/" className="flex flex-col items-center gap-1 py-2 px-3 text-gray-500 hover:text-red-500 transition-colors">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs font-medium">Дневник</span>
          </Link>
          <div className="flex flex-col items-center gap-1 py-2 px-3 text-red-500">
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs font-medium">Результаты</span>
          </div>
          <Link href="/exercises" className="flex flex-col items-center gap-1 py-2 px-3 text-gray-500 hover:text-red-500 transition-colors">
            <Dumbbell className="w-6 h-6" />
            <span className="text-xs font-medium">Упражнения</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center gap-1 py-2 px-3 text-gray-500 hover:text-red-500 transition-colors">
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">Настройки</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
