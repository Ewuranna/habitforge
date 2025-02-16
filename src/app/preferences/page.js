'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../components/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function PreferencesPage() {
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    dailyReminderTime: '09:00',
    habitCompletionReminders: true
  });

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const savePreferences = async () => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...preferences
        }, { onConflict: 'user_id' });

      if (error) throw error;
      
      alert('Preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-[--font-poppins] p-6">
      <div className="container mx-auto max-w-xl">
        <h1 className="text-4xl font-bold text-[#2C3E50] mb-8">
          User Preferences
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                className="form-checkbox text-darkforge"
              />
              <span>Email Notifications</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.pushNotifications}
                onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                className="form-checkbox text-darkforge"
              />
              <span>Push Notifications</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Daily Reminder Time</label>
            <input
              type="time"
              value={preferences.dailyReminderTime}
              onChange={(e) => handlePreferenceChange('dailyReminderTime', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-darkforge focus:ring focus:ring-darkforge focus:ring-opacity-50"
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.habitCompletionReminders}
                onChange={(e) => handlePreferenceChange('habitCompletionReminders', e.target.checked)}
                className="form-checkbox text-darkforge"
              />
              <span>Habit Completion Reminders</span>
            </label>
          </div>

          <button
            onClick={savePreferences}
            className="w-full bg-darkforge text-white py-2 rounded-md hover:bg-black transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}