'use server';

import { createClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  SparklesIcon, 
  ClockIcon, 
  TrophyIcon 
} from '@heroicons/react/24/solid';

export default async function Home() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const transformationSteps = [
    {
      icon: <SparklesIcon className="w-16 h-16 text-darkforge" />,
      title: 'Discover Your Potential',
      description: 'Identify the habits that will unlock your true capabilities.'
    },
    {
      icon: <ClockIcon className="w-16 h-16 text-darkforge" />,
      title: 'Build Consistency',
      description: 'Create a sustainable path to personal growth through daily practice.'
    },
    {
      icon: <TrophyIcon className="w-16 h-16 text-darkforge" />,
      title: 'Achieve Greatness',
      description: 'Transform your life by mastering the habits that matter most.'
    }
  ];

  return (
    <div className="bg-forge-blue min-h-screen flex flex-col ">
      {/* Custom Navigation */}
      <nav className="w-full bg-forge-blue backdrop-blur-md shadow-sm py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="flex items-center space-x-3">
          <Image 
            src="/Habitforgelogo.png" 
            width={50} 
            height={50} 
            alt="Habitforge Logo"  
            className="object-contain rounded-lg"
          />
          <span className="text-xl font-bold text-black tracking-tight">HabitForge</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link 
            href="/login" 
            className="text-gray-700 hover:text-black transition-colors font-medium text-sm group flex items-center"
          >
            <span className="group-hover:underline">Login</span>
          </Link>

          <Link 
            href="/signup" 
            className="bg-black text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <span>Get Started</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </nav>
      {/* Hero Section */}
      <main className="container mx-auto px-4 flex-grow flex flex-col justify-center items-center text-center">
        <div className="max-w-4xl px-4 pt-8">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-6 leading-tight">
            Your Journey to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-darkforge to-black">
              Personal Transformation
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            HabitForge is more than an app. It's your personal guide to building life-changing habits, 
            one day at a time.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            <Link 
              href="/signup" 
              className="bg-black text-forge-blue px-8 py-4 rounded-md text-lg font-semibold hover:bg-darkforge hover:text-black transition-colors shadow-lg"
            >
              Start Your Transformation
            </Link>
            <Link 
              href="/learn" 
              className="bg-white text-black px-8 py-4 rounded-md text-lg font-semibold hover:bg-forge-blue transition-colors border border-black"
            >
              How It Works
            </Link>
          </div>
        </div>
      </main>

      {/* Transformation Journey Section */}
      <section className="container mx-auto px-4 py-16 bg-gray-50">
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Your Path to Success
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Transform your life through a proven, step-by-step approach to habit formation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
          {transformationSteps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white p-6 md:p-8 text-center rounded-lg shadow-md hover:shadow-lg transition-all border border-purple-100"
            >
              <div className="flex justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-black mb-4">
                {step.title}
              </h3>
              <p className="text-gray-700 mb-4">
                {step.description}
              </p>
              <div className="mt-4 pt-4 border-t border-purple-100 text-sm text-gray-500">
                Step {index + 1}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center text-gray-700">
          2025 HabitForge. Empowering Personal Growth.
        </div>
      </footer>
    </div>
  );
}