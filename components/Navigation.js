'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '../components/AuthProvider';

const Navigation = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { user, signOut } = useAuth();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/habits', label: 'Habits', icon: '🎯' },
    { href: '/progress', label: 'Progress', icon: '📈' }
  ];

  // Default avatar if no profile image
  const avatarUrl = user?.user_metadata?.avatar_url || '/default avatar.jpg';

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const userDropdownItems = [
    { 
      label: 'Profile', 
      href: '/profile', 
      action: () => router.push('/profile') 
    },
    { 
      label: 'Preferences', 
      href: '/preferences', 
      action: () => router.push('/preferences') 
    },
    { 
      label: 'Logout', 
      href: '#', 
      action: handleSignOut 
    }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 md:relative">
      <div className="container mx-auto flex justify-between items-center py-3 px-4 md:px-6">
        {/* HabitForge Logo - Left Side */}
        <Link 
          href="/dashboard" 
          className="flex items-center space-x-2"
        >
          <Image 
            src="/Habitforgelogo.png"
            alt="HabitForge Logo" 
            width={40} 
            height={40} 
            className="object-contain"
          />
          <span className="text-lg font-bold hidden md:block">HabitForge</span>
        </Link>

        {/* Navigation Items - Center */}
        <div className="flex items-center space-x-4">
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                pathname === item.href 
                  ? 'bg-darkforge text-white' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              <span className="hidden md:block">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Avatar/Profile Dropdown - Right Side */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <Image 
              src={avatarUrl}
              alt="User Avatar" 
              width={40} 
              height={40} 
              className="rounded-full object-cover border-2 border-darkforge"
            />
            <span className="text-sm hidden md:block">
              {user?.email?.split('@')[0]}
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              {userDropdownItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;