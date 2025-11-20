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
        'Only see solutions after genuine effort',
      ],
      href: '/coach',
      gradient: 'from-blue-500 via-blue-600 to-cyan-500',
      bodyGradient: 'from-blue-50 via-cyan-50/80 to-blue-100/60',
    },
    {
      title: 'Solution Critique',
      emoji: '🔍',
      description: 'Get TA-style feedback on your attempted solutions',
      features: [
        'Identify logical gaps and unjustified steps',
        'Discover missing edge cases',
        'Understand what you did well',
        'Get actionable improvement suggestions',
      ],
      href: '/critique',
      gradient: 'from-purple-500 via-purple-600 to-pink-500',
      bodyGradient: 'from-purple-50 via-pink-50/80 to-purple-100/60',
    },
    {
      title: 'Study Planner',
      emoji: '📅',
      description: 'Generate realistic study schedules for your exams',
      features: [
        'Day-by-day study plans',
        'Spaced repetition built-in',
        'Checkpoint questions for self-testing',
        'Emphasize high-value topics',
      ],
      href: '/planner',
      gradient: 'from-green-500 via-emerald-600 to-teal-500',
      bodyGradient: 'from-green-50 via-emerald-50/80 to-green-100/60',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="text-center mb-24 pt-12">
        <h1 className="text-7xl sm:text-8xl font-bold tracking-tight mb-6 animate-scale-in">
          <span className="text-gradient">QED</span>
        </h1>
        <p className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4 tracking-tight animate-fade-in">
          Train Your Mind, Don&apos;t Just Get Answers
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed animate-slide-up">
          A multi-agent study coach powered by Claude that helps you <em>think</em> through hard
          problems instead of just handing you the solution.
        </p>
      </div>

      {/* Mode Cards */}
      <div className="grid lg:grid-cols-3 gap-8 mb-24">
        {modes.map((mode, index) => (
          <Link
            key={mode.title}
            href={mode.href}
            className="block group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col rounded-3xl overflow-hidden hover-lift h-full border-2 border-gray-200/30 dark:border-gray-700/30">
              {/* Card Header with Gradient */}
              <div className={`bg-gradient-to-br ${mode.gradient} p-8 text-white relative`}>
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {mode.emoji}
                </div>
                <h2 className="text-3xl font-bold tracking-tight">{mode.title}</h2>
              </div>

              {/* Card Body */}
              <div
                className={`flex-1 p-8 bg-gradient-to-br ${mode.bodyGradient} dark:from-gray-800 dark:via-gray-800 dark:to-gray-800`}
              >
                <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed">
                  {mode.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {mode.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-700 dark:text-gray-300">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  <span>Get Started</span>
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Features Section */}
      <div className="rounded-3xl p-12 mb-24 border-2 border-blue-200/50 dark:border-gray-700/50 bg-gradient-to-br from-blue-50 via-purple-50/80 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-12 text-center">
          Why QED?
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="flex items-start space-x-4">
            <div className="text-4xl flex-shrink-0">🧠</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Build Real Understanding
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Learn through guided discovery, not passive consumption. Develop problem-solving
                skills that last.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="text-4xl flex-shrink-0">🎯</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Multi-Agent Intelligence
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Specialized Claude agents work together: decomposer, coach, critic, and planner.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="text-4xl flex-shrink-0">✅</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Academic Integrity First
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Designed for learning, not cheating. Hints before answers. Reflection encouraged.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="text-4xl flex-shrink-0">📈</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Evidence-Based Learning
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Spaced repetition, active recall, and structured feedback based on learning science.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ethics Notice */}
      <div className="rounded-2xl p-10 text-center border-2 border-amber-300/50 dark:border-amber-700/50 bg-gradient-to-br from-amber-50 via-yellow-50/80 to-orange-50/50 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-orange-900/30">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          Academic Integrity Notice
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
          QED is designed to help you <strong>learn and practice</strong>. Do not use it to complete
          graded assignments or take-home exams. Always follow your institution&apos;s academic
          integrity policies.
        </p>
      </div>
    </Layout>
  );
}
