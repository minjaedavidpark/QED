import React from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🧠</span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Reasoning Gym
              </span>
            </Link>

            <nav className="flex space-x-6">
              <Link href="/coach" className="text-gray-600 hover:text-blue-600 transition-colors">
                Coach
              </Link>
              <Link
                href="/critique"
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Critique
              </Link>
              <Link
                href="/planner"
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                Planner
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {title && <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>}
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Built for the Anthropic AI Hackathon @ UofT</p>
            <p className="mt-2 text-xs text-gray-500">
              Use for learning and practice. Do not submit AI-generated work as your own.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
