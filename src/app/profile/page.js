  'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthProvider';
import Image from 'next/image';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    username: '',
    leaderboard_nickname: '',
    email: '',
    avatar_url: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const supabase = createClientComponentClient();
  const router = useRouter();
  const { user, signOut } = useAuth();

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        console.log('No user found, redirecting to login');
        router.push('/login');
        return;
      }

      console.log('Current user:', user);
      console.log('User ID:', user.id);

      try {
        console.log('Fetching profile for user ID:', user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        console.log('Profile query result:', { profileData, profileError });

        if (profileError) {
          console.error('Profile fetch error details:', profileError);
          throw profileError;
        }

        console.log('Fetched profile data:', profileData);

        setProfile({
          username: profileData?.username || '',
          leaderboard_nickname: profileData?.leaderboard_nickname || '',
          email: user.email,
          avatar_url: profileData?.avatar_url || user.user_metadata?.avatar_url
        });
      } catch (err) {
        console.error('Detailed profile fetch error:', err);
        setError(`Could not load profile: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, supabase, router]);

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      // Update user metadata with avatar URL
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (metadataError) throw metadataError;

      // Also update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update local state
      setProfile(prev => ({
        ...prev,
        avatar_url: publicUrl
      }));

      setSuccess('Avatar uploaded successfully');
    } catch (err) {
      console.error('Avatar upload error:', err);
      setError('Could not upload avatar');
    }
  };

  // Handle profile updates
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Validate username
      if (!profile.username) {
        setError('Username is required');
        return;
      }

      // Update profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          leaderboard_nickname: profile.leaderboard_nickname
        })
        .eq('id', user.id);

      if (error) throw error;

      setSuccess('Profile updated successfully');
    } catch (err) {
      console.error('Profile update error:', err);
      setError('Could not update profile');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-[--font-poppins] p-6">
      <div className="container mx-auto max-w-xl">
        <h1 className="text-4xl font-bold text-[#2C3E50] mb-8">
          Your Profile
        </h1>

        {/* Avatar Section */}
        <div className="mb-6 flex items-center space-x-6">
          <div className="relative">
            <Image 
              src={profile.avatar_url || '/default avatar.jpg'} 
              alt="Profile Avatar" 
              width={120} 
              height={120} 
              className="rounded-full object-cover"
            />
            <input 
              type="file" 
              accept="image/*"
              onChange={handleAvatarUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="absolute bottom-0 right-0 bg-darkforge text-white p-2 rounded-full">
              Edit
            </div>
          </div>
          <div>
            <p className="text-xl font-semibold">{profile.email}</p>
            <p className="text-gray-600">Click avatar to upload new image</p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                username: e.target.value.toLowerCase().replace(/\s+/g, '_')
              }))}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-darkforge focus:ring focus:ring-darkforge focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Leaderboard Nickname
            </label>
            <input
              type="text"
              name="leaderboard_nickname"
              value={profile.leaderboard_nickname}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                leaderboard_nickname: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-darkforge focus:ring focus:ring-darkforge focus:ring-opacity-50"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full bg-darkforge text-white py-2 rounded-md hover:bg-black transition-colors"
            >
              Save Profile
            </button>
            <button
              type="button"
              onClick={() => signOut()}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}