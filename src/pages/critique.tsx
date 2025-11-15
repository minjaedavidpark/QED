import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProblemInput from '@/components/ProblemInput';

interface CritiqueData {
  overallAssessment?: string;
  strengths?: string[];
  issues?: Array<{
    location: string;
    type: string;
    description: string;
    severity: string;
  }>;
  suggestions?: string[];
  score?: string;
  correctness?: string;
}

export default function CritiquePage() {
  const [loading, setLoading] = useState(false);
  const [critique, setCritique] = useState<string | null>(null);
  const [parsedCritique, setParsedCritique] = useState<CritiqueData | null>(null);

  const handleAnalyzeSolution = async (problem: string, solution: string) => {
    setLoading(true);
    setCritique(null);
    setParsedCritique(null);

    try {
      const response = await fetch('/api/critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, solution }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze solution');
      }

      setCritique(data.critique);
      setParsedCritique(data.parsed);
    } catch (error) {
      console.error('Error analyzing solution:', error);
      alert(error instanceof Error ? error.message : 'Failed to analyze solution');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCritique(null);
    setParsedCritique(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'minor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Layout title="🔍 Solution Critique">
      <div className="max-w-4xl mx-auto">
        {/* Description */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Get TA-Style Feedback</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">1.</span>
              Paste the problem statement
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">2.</span>
              Paste your attempted solution or work
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">3.</span>
              Receive detailed feedback on correctness and reasoning
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">4.</span>
              Learn what you did well and how to improve
            </li>
          </ul>
        </div>

        {/* Input or Results */}
        {!critique ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ProblemInput
              onSolutionSubmit={handleAnalyzeSolution}
              showSolutionInput
              buttonText="Analyze My Solution"
              loading={loading}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Reset Button */}
            <div className="flex justify-end">
              <button
                onClick={handleReset}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Analyze Another Solution
              </button>
            </div>

            {/* Structured Critique */}
            {parsedCritique ? (
              <div className="space-y-6">
                {/* Overall Assessment */}
                {parsedCritique.overallAssessment && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900">Overall Assessment</h3>
                      {parsedCritique.score && (
                        <span className="text-2xl font-bold text-purple-600">
                          {parsedCritique.score}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700">{parsedCritique.overallAssessment}</p>
                    {parsedCritique.correctness && (
                      <div className="mt-3">
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {parsedCritique.correctness}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Strengths */}
                {parsedCritique.strengths && parsedCritique.strengths.length > 0 && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      What You Did Well
                    </h3>
                    <ul className="space-y-2">
                      {parsedCritique.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">•</span>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Issues */}
                {parsedCritique.issues && parsedCritique.issues.length > 0 && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Issues to Address</h3>
                    <div className="space-y-4">
                      {parsedCritique.issues.map((issue, idx) => (
                        <div
                          key={idx}
                          className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{issue.location}</h4>
                            <span className="text-xs font-medium uppercase px-2 py-1 rounded">
                              {issue.severity}
                            </span>
                          </div>
                          <p className="text-sm mb-2">
                            <span className="font-medium">Type:</span> {issue.type}
                          </p>
                          <p className="text-sm">{issue.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {parsedCritique.suggestions && parsedCritique.suggestions.length > 0 && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="text-blue-500 mr-2">💡</span>
                      How to Improve
                    </h3>
                    <ul className="space-y-2">
                      {parsedCritique.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-1">→</span>
                          <span className="text-gray-700">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              // Fallback to plain text critique
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Feedback</h3>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans">{critique}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
