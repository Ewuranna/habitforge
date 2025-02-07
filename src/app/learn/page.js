import React from 'react';
import Link from 'next/link';

export default function LearnPage() {
  const learningTopics = [
    {
      title: 'The Science of Habit Formation',
      description: 'Understand the psychological principles behind building lasting habits.',
      link: '#habit-science'
    },
    {
      title: 'Tracking Your Progress',
      description: 'Learn how to effectively monitor and improve your habit-building journey.',
      link: '#progress-tracking'
    },
    {
      title: 'Overcoming Common Challenges',
      description: 'Strategies to stay motivated and overcome obstacles in habit development.',
      link: '#habit-challenges'
    }
  ];

  return (
    <div className="min-h-screen bg-white font-[--font-poppins] py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Master Your Habits, Transform Your Life
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the art and science of building life-changing habits with HabitForge.
          </p>
        </header>

        <section className="grid md:grid-cols-3 gap-8">
          {learningTopics.map((topic, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border border-gray-100 hover:border-indigo-100 transition-all group"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
                {topic.title}
              </h3>
              <p className="text-gray-600 mb-4">{topic.description}</p>
              <Link 
                href={topic.link} 
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Learn More →
              </Link>
            </div>
          ))}
        </section>

        <div className="text-center mt-12">
          <Link 
            href="/signup" 
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
          >
            Start Your Habit Journey
          </Link>
        </div>
      </div>
    </div>
  );
}