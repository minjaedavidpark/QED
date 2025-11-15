import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Home() {
  const modes = [
    {
      title: 'Guided Problem Solving',
      emoji: '🧩',
      description: 'Get Socratic coaching through complex problems step-by-step',
      features: [
        'Break down tough questions into smaller steps',
        'Receive hints and guiding questions',
        'Build your reasoning muscles',
        'Only see solutions after genuine effort'
      ],
      href: '/coach',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      title: 'Solution Critique',
      emoji: '🔍',
      description: 'Get TA-style feedback on your attempted solutions',
      features: [
        'Identify logical gaps and unjustified steps',
        'Discover missing edge cases',
        'Understand what you did well',
        'Get actionable improvement suggestions'
      ],
      href: '/critique',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      title: 'Study Planner',
      emoji: '📅',
      description: 'Generate realistic study schedules for your exams',
      features: [
        'Day-by-day study plans',
        'Spaced repetition built-in',
        'Checkpoint questions for self-testing',
        'Emphasize high-value topics'
      ],
      href: '/planner',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Reasoning Gym
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Train Your Mind, Don&apos;t Just Get Answers
        </p>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          A multi-agent study coach powered by Claude that helps you <em>think</em> through hard problems
          instead of just handing you the solution.
        </p>
      </div>

      {/* Mode Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {modes.map((mode) => (
          <Link
            key={mode.title}
            href={mode.href}
            className="block group"
          >
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 h-full border border-gray-200 overflow-hidden">
              <div className={`bg-gradient-to-r ${mode.color} p-6 text-white`}>
                <div className="text-4xl mb-3">{mode.emoji}</div>
                <h2 className="text-2xl font-bold">{mode.title}</h2>
              </div>

              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {mode.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {mode.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className={`bg-gradient-to-r ${mode.color} ${mode.hoverColor} text-white font-semibold py-2 px-4 rounded-lg text-center transition-all`}>
                  Get Started →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-xl p-8 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Why Reasoning Gym?
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-3">
            <div className="text-2xl">🧠</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Build Real Understanding</h3>
              <p className="text-sm text-gray-600">
                Learn through guided discovery, not passive consumption. Develop problem-solving skills that last.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="text-2xl">🎯</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Multi-Agent Intelligence</h3>
              <p className="text-sm text-gray-600">
                Specialized Claude agents work together: decomposer, coach, critic, and planner.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="text-2xl">✅</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Academic Integrity First</h3>
              <p className="text-sm text-gray-600">
                Designed for learning, not cheating. Hints before answers. Reflection encouraged.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="text-2xl">📈</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Evidence-Based Learning</h3>
              <p className="text-sm text-gray-600">
                Spaced repetition, active recall, and structured feedback based on learning science.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ethics Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
        <div className="text-2xl mb-2">⚠️</div>
        <h3 className="font-semibold text-gray-900 mb-2">Academic Integrity Notice</h3>
        <p className="text-sm text-gray-700">
          Reasoning Gym is designed to help you <strong>learn and practice</strong>.
          Do not use it to complete graded assignments or take-home exams.
          Always follow your institution&apos;s academic integrity policies.
        </p>
      </div>
    </Layout>
  );
}
