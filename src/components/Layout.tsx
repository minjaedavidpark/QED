import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header with glass morphism */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                🧠
              </span>
              <span className="text-xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                QED
              </span>
            </Link>

            <nav className="flex items-center space-x-1">
              <Link
                href="/coach"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200"
              >
                Coach
              </Link>
              <Link
                href="/critique"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200"
              >
                Critique
              </Link>
              <Link
                href="/planner"
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200"
              >
                Planner
              </Link>
              <button
                onClick={toggleTheme}
                className="ml-2 p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200"
                aria-label="Toggle dark mode"
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {title && (
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-12 animate-fade-in transition-colors duration-200">
            {title}
          </h1>
        )}
        <div className="animate-slide-up">{children}</div>
      </main>

      {/* Footer */}
      <footer className="mt-24 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Built for the Anthropic AI Hackathon @ UofT
            </p>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Use for learning and practice. Do not submit AI-generated work as your own.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
