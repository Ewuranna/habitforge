'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  PlusIcon, 
  CheckIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/solid';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [habits, setHabits] = useState([
    { id: 1, name: 'Morning Meditation', streak: 7, completed: true },
    { id: 2, name: 'Daily Exercise', streak: 5, completed: false },
    { id: 3, name: 'Read 30 Minutes', streak: 12, completed: true }
  ]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = async () => {
    await signOut();
  };

  const handleHabitToggle = (habitId) => {
    setHabits(habits.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: !habit.completed, streak: habit.completed ? habit.streak : habit.streak + 1 }
        : habit
    ));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Welcome, {user.email.split('@')[0]}
            </h1>
            <p className="text-gray-600">Your path to personal growth starts here</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Logout
          </button>
        </header>

        {/* Habits Overview */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-black">Your Habits</h2>
            <button 
              className="flex items-center bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Habit
            </button>
          </div>

          {/* Habit List */}
          <div className="space-y-4">
            {habits.map((habit) => (
              <div 
                key={habit.id} 
                className="flex justify-between items-center bg-gray-50 p-4 rounded-md"
              >
                <div className="flex items-center">
                  <button 
                    onClick={() => handleHabitToggle(habit.id)}
                    className={`mr-4 p-2 rounded-full ${
                      habit.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <CheckIcon className="w-5 h-5" />
                  </button>
                  <span className="font-medium text-black">{habit.name}</span>
                </div>
                <div className="flex items-center">
                  <ChartBarIcon className="w-5 h-5 mr-2 text-purple-600" />
                  <span className="text-gray-600">Streak: {habit.streak}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-black mb-2">Total Habits</h3>
            <p className="text-3xl font-bold text-purple-600">{habits.length}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-black mb-2">Completed Today</h3>
            <p className="text-3xl font-bold text-green-600">
              {habits.filter(habit => habit.completed).length}
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-black mb-2">Longest Streak</h3>
            <p className="text-3xl font-bold text-purple-600">
              {Math.max(...habits.map(habit => habit.streak), 0)}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}