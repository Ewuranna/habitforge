'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Generate a username from name (remove spaces, lowercase)
      const username = name.toLowerCase().replace(/\s+/g, '_');

      // Sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            username: username
          }
        }
      });

      // Extensive logging of signup process
      console.log('Signup Response:', {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email
        } : null,
        error: error
      });

      if (error) {
        setError(error.message);
        return;
      }

      // If signup is successful and user is confirmed, redirect to dashboard
      if (data.user) {
        console.log('Attempting to create profile for user:', {
          userId: data.user.id,
          username: username,
          name: name
        });

        // Upsert profile with username
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            username: username,
            leaderboard_nickname: name
          }, {
            onConflict: 'id',
            returning: 'representation'  // Ensure we get back the inserted/updated data
          });

        console.log('Profile Upsert Result:', {
          profileData,
          profileError
        });

        if (profileError) {
          console.error('Profile Creation Error:', {
            message: profileError.message,
            details: profileError.details
          });
          setError('Could not complete profile setup');
          return;
        }

        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Signup Catch Block Error:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-forge-blue font-[--font-poppins] flex flex-col">
      

      {/* Existing Signup Content */}
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Link href="/" className="block text-center">
              <Image 
                src="/Habitforgelogo.png" 
                width={120} 
                height={120} 
                alt="Habitforge Logo" 
                object-position="center" 
                className="mx-auto"
              />
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create Your Account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-darkforge hover:text-blue">
                Sign in
              </Link>
            </p>
          </div>
          <form onSubmit={handleSignup} className="mt-8 space-y-6">
            {error && (
              <div className="text-red-500 text-center mb-4">
                {error}
              </div>
            )}
            <div className="-space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none rounded-md shadow-sm -space-y-px my-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-darkforge focus:border-darkforge focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-md shadow-sm -space-y-px my-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-darkforge focus:border-darkforge focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-md shadow-sm -space-y-px my-1 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-darkforge focus:border-darkforge focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-darkforge hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-darkforge"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}