import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  SparklesIcon, 
  ClockIcon, 
  TrophyIcon 
} from '@heroicons/react/24/solid';

export default function Home() {
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
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/">
        <Image src="/Habitforgelogo.png" width={120} height={120} alt="Habitforge Logo"  />
        </Link>
        <div className="space-x-4 flex items-center">
          <Link 
            href="/login" 
            className="text-black hover:text-darkforge-600 transition-colors font-medium mr-4"
          >
            Login
          </Link>

          <Link 
            href="/signup" 
            className="bg-black text-white px-6 py-2 rounded-md text-md font-semibold hover:bg-darkforge hover:text-black transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 flex-grow flex flex-col justify-center items-center text-center">
        <div className="max-w-4xl px-4">
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