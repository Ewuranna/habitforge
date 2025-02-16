'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  PlusIcon, 
  CheckIcon, 
  FireIcon,
  ArrowRightStartOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [habits, setHabits] = useState([]);
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    title: '',
    schedule: { frequency: 'daily' },
    why: '',
    reminder_interval: 1
  });

  // Fetch habits from Supabase on component mount
  useEffect(() => {
    const fetchHabits = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching habits:', error);
      } else {
        setHabits(data || []);
      }
    };

    fetchHabits();
  }, [user, supabase]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleLogout = async () => {
    await signOut();
  };

  const handleHabitToggle = async (habitId) => {
    const updatedHabits = habits.map(habit => 
      habit.id === habitId 
        ? { ...habit, streak_days: habit.streak_days + 1 }
        : habit
    );
    setHabits(updatedHabits);

    // Update habit in Supabase
    const habitToUpdate = updatedHabits.find(h => h.id === habitId);
    const { error } = await supabase
      .from('habits')
      .update({ 
        streak_days: habitToUpdate.streak_days
      })
      .eq('id', habitId);

    if (error) {
      console.error('Error updating habit:', error);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Mindfulness': 'bg-teal-500',
      'Fitness': 'bg-purple-500',
      'Learning': 'bg-blue-500',
      'Health': 'bg-green-500',
      'Productivity': 'bg-orange-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const addHabit = async () => {
    try {
      // Validate user and session
      if (!user) {
        console.error('No authenticated user');
        alert('Please log in to add a habit');
        return;
      }

      // Validate habit data
      if (!newHabit.title) {
        alert('Please enter a habit title');
        return;
      }

      // Log current authentication state
      console.log('Current User Authentication:', {
        userId: user.id,
        email: user.email,
        userMetadata: user.user_metadata
      });

      // Verify session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Session Error:', sessionError);
        alert('Authentication session expired. Please log in again.');
        return;
      }

      const sessionUserId = session.user.id;

      // Prepare habit data using session user ID
      const habitData = {
        title: newHabit.title,
        schedule: newHabit.schedule,
        why: newHabit.why || null,
        user_id: sessionUserId,  // Ensure this matches session user ID
        streak_days: 0,
        reminder_interval: newHabit.reminder_interval || 1,
        paused_days_remaining: 0
      };

      console.log('Habit Insertion Details:', {
        habitData,
        userEmail: session.user.email,
        sessionUserId
      });

      // Check table structure and permissions
      const { data: tableCheck, error: tableError } = await supabase
        .from('habits')
        .select('*')
        .limit(1);

      if (tableError) {
        console.error('Table Access Error:', tableError);
        alert(`Cannot access habits table: ${tableError.message}`);
        return;
      }

      // Insert new habit into Supabase
      const { data, error } = await supabase
        .from('habits')
        .insert(habitData)
        .select();

      if (error) {
        console.error('Habit Insertion Error:', {
          message: error.message,
          details: error.details,
          code: error.code,
          hint: error.hint
        });
        
        // Provide more specific error messages
        if (error.code === 'PGRST116') {
          alert('Permission denied. Check your authentication and table permissions.');
        } else {
          alert(`Failed to add habit: ${error.message}`);
        }
        return;
      }

      if (!data || data.length === 0) {
        console.error('No data returned from insertion');
        alert('Failed to add habit: No data returned');
        return;
      }

      // Update local state with new habit
      setHabits([...habits, data[0]]);

      // Reset form and close modal
      setNewHabit({
        title: '',
        schedule: { frequency: 'daily' },
        why: '',
        reminder_interval: 1
      });
      setShowHabitModal(false);
    } catch (err) {
      console.error('Unexpected error in addHabit:', err);
      alert(`An unexpected error occurred: ${err.message}`);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-[--font-poppins] p-4 md:p-6 mt-20 md:mt-0">
      {/* Habits Overview */}
      <section className="grid md:grid-cols-[2fr_1fr] gap-8 mb-8">
        {/* Habits List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#2C3E50]">
              Your Habits
            </h2>
            <button 
              onClick={() => setShowHabitModal(true)}
              className="bg-darkforge text-white px-4 py-2 rounded-md hover:bg-black transition-colors"
            >
              + Add Habit
            </button>
          </div>

          {/* Existing habits list rendering logic */}
          {habits.length === 0 ? (
            <div className="text-center text-gray-500">
              <p>No habits yet. Start your journey!</p>
              <button 
                onClick={() => setShowHabitModal(true)}
                className="mt-4 bg-darkforge text-white px-4 py-2 rounded-md hover:bg-black transition-colors"
              >
                Create First Habit
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {habits.map((habit) => (
                <div 
                  key={habit.id} 
                  className="flex justify-between items-center bg-[#F8F9FA] p-4 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className={`mr-4 p-2 rounded-full ${getCategoryColor(habit.schedule.frequency)} text-white`}>
                      <FireIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-medium text-[#2C3E50]">{habit.title}</span>
                      <p className="text-sm text-[#7F8C8D]">{habit.schedule.frequency}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => handleHabitToggle(habit.id)}
                      className={`mr-4 p-2 rounded-full ${
                        habit.streak_days > 0 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <CheckIcon className="w-5 h-5" />
                    </button>
                    <span className="text-[#7F8C8D] font-medium">
                      Streak: {habit.streak_days}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Habits Stats and Insights */}
        <div className="bg-white rounded-lg shadow-md p-6 hidden md:block">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">
            Your Progress
          </h2>
          {/* Existing progress rendering logic */}
          <div className="space-y-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">Total Habits</h3>
              <p className="text-4xl font-bold text-[#3498DB]">{habits.length}</p>
            </div>
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">Completed Today</h3>
              <p className="text-4xl font-bold text-green-600">
                {habits.filter(habit => habit.streak_days > 0).length}
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
              <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">Longest Streak</h3>
              <p className="text-4xl font-bold text-[#9B59B6]">
                {Math.max(...habits.map(habit => habit.streak_days), 0)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Habit Modal */}
      {showHabitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
            <button 
              onClick={() => setShowHabitModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-[#2C3E50]">Add New Habit</h2>
            <form onSubmit={(e) => { e.preventDefault(); addHabit(); }} className="space-y-4">
              <div>
                <label htmlFor="habitTitle" className="block text-sm font-medium text-gray-700">
                  Habit Title
                </label>
                <input
                  type="text"
                  id="habitTitle"
                  value={newHabit.title}
                  onChange={(e) => setNewHabit({...newHabit, title: e.target.value})}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3498DB] focus:ring focus:ring-[#3498DB] focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="habitSchedule" className="block text-sm font-medium text-gray-700">
                  Schedule
                </label>
                <select
                  id="habitSchedule"
                  value={newHabit.schedule.frequency}
                  onChange={(e) => setNewHabit({...newHabit, schedule: { frequency: e.target.value }})}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3498DB] focus:ring focus:ring-[#3498DB] focus:ring-opacity-50"
                >
                  <option value="">Select a Schedule</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label htmlFor="habitWhy" className="block text-sm font-medium text-gray-700">
                  Why
                </label>
                <input
                  type="text"
                  id="habitWhy"
                  value={newHabit.why}
                  onChange={(e) => setNewHabit({...newHabit, why: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3498DB] focus:ring focus:ring-[#3498DB] focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="habitReminderInterval" className="block text-sm font-medium text-gray-700">
                  Reminder Interval
                </label>
                <input
                  type="number"
                  id="habitReminderInterval"
                  value={newHabit.reminder_interval}
                  onChange={(e) => setNewHabit({...newHabit, reminder_interval: parseInt(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#3498DB] focus:ring focus:ring-[#3498DB] focus:ring-opacity-50"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#3498DB] text-white py-2 rounded-lg hover:bg-[#2980B9] transition-colors"
              >
                Create Habit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}