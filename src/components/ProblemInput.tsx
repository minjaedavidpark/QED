import React, { useState } from 'react';

interface ProblemInputProps {
  onSubmit?: (problem: string) => void;
  placeholder?: string;
  buttonText?: string;
  loading?: boolean;
  showSolutionInput?: boolean;
  onSolutionSubmit?: (problem: string, solution: string) => void;
}

export default function ProblemInput({
  onSubmit,
  placeholder = "Paste your problem here...",
  buttonText = "Start",
  loading = false,
  showSolutionInput = false,
  onSolutionSubmit
}: ProblemInputProps) {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (problem.trim()) {
      if (showSolutionInput && onSolutionSubmit) {
        onSolutionSubmit(problem.trim(), solution.trim());
      } else if (onSubmit) {
        onSubmit(problem.trim());
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">
          Problem Statement
        </label>
        <textarea
          id="problem"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder={placeholder}
          className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={loading}
        />
      </div>

      {showSolutionInput && (
        <div>
          <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-2">
            Your Solution/Attempt
          </label>
          <textarea
            id="solution"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Paste your solution or attempted work here..."
            className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            disabled={loading}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !problem.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          buttonText
        )}
      </button>
    </form>
  );
}
