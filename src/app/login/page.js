'use client';

import React, { useState,useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthProvider';
import { 
  EyeIcon, 
  EyeSlashIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/solid';
import Image from 'next/image';

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  // Ensure component only renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const validateForm = () => {
    const newErrors = { email: '', password: '', general: '' };

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({ email: '', password: '', general: '' });
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);
      // Routing to dashboard is now handled in AuthProvider
    } // In handleSubmit catch block - Improve error handling
    catch (err) {
      const errorCode = err.code; // Use error codes instead of message text
      const newErrors = { email: '', password: '', general: '' };
    
      switch (errorCode) {
        case 'auth/wrong-password':
          newErrors.general = "Incorrect password. Please try again.";
          break;
        case 'auth/user-not-found':
          newErrors.general = "No account found. Please sign up.";
          break;
        case 'auth/too-many-requests':
          newErrors.general = "Too many attempts. Try again later or reset password.";
          break;
        default:
          newErrors.general = 'Login failed. Please try again.';
      }
    
      setErrors(newErrors);
    }
    

    setIsLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Prevent rendering on server
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EAF2F6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center mb-6">
            <Image 
              src="/Habitforgelogo.png"  
              alt="HabitForge Logo" 
              width={128} 
              height={128} 
              className="object-contain"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#2C3E50]">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/signup" className="font-medium text-[#3498DB] hover:text-[#2980B9]">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-[#3498DB] focus:border-[#3498DB]'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: '' }));
                }}
              />
              {errors.email && (
                <div className="text-red-500 text-xs mt-1 flex items-center">
                  <ExclamationCircleIcon className="h-4 w-4 mr-2" />
                  {errors.email}
                </div>
              )}
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-[#3498DB] focus:border-[#3498DB]'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:z-10 sm:text-sm pr-10`}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: '' }));
                }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#3498DB] transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {errors.password && (
                <div className="text-red-500 text-xs mt-1 flex items-center">
                  <ExclamationCircleIcon className="h-4 w-4 mr-2" />
                  {errors.password}
                </div>
              )}
            </div>
          </div>

          {errors.general && (
            <div className="mb-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded relative flex items-center" role="alert">
              <ExclamationCircleIcon className="h-6 w-6 mr-3" />
              <div>
                <span className="block sm:inline">{errors.general}</span>
                {errors.general.includes("No account found") && (
                  <Link 
                    href="/signup" 
                    className="ml-2 underline text-[#3498DB] hover:text-[#2980B9]"
                  >
                    Create Account
                  </Link>
                )}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#3498DB] hover:bg-[#2980B9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3498DB]"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}