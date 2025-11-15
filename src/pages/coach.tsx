import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProblemInput from '@/components/ProblemInput';
import ChatPanel, { ChatMessage } from '@/components/ChatPanel';

export default function CoachPage() {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentProblem, setCurrentProblem] = useState('');

  const handleStartCoaching = async (problem: string) => {
    setCurrentProblem(problem);
    setLoading(true);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start coaching');
      }

      setMessages([
        {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }
      ]);
      setStarted(true);
    } catch (error) {
      console.error('Error starting coaching:', error);
      alert(error instanceof Error ? error.message : 'Failed to start coaching session');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (userMessage: string) => {
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newUserMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSolution = async () => {
    const confirmRequest = window.confirm(
      'Are you sure you want to see the full solution? It&apos;s better to keep trying and learn through the process.'
    );

    if (!confirmRequest) return;

    setLoading(true);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          requestSolution: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get solution');
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error requesting solution:', error);
      alert(error instanceof Error ? error.message : 'Failed to get solution');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStarted(false);
    setMessages([]);
    setCurrentProblem('');
  };

  return (
    <Layout title="🧩 Guided Problem Solving">
      <div className="max-w-4xl mx-auto">
        {/* Description */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            How it works
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">1.</span>
              Paste a challenging problem (math, CS, theory, etc.)
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">2.</span>
              The coach will break it down and guide you step-by-step
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">3.</span>
              Answer questions and work through each step
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">4.</span>
              Get hints if you&apos;re stuck (not direct answers!)
            </li>
          </ul>
        </div>

        {/* Main Content */}
        {!started ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ProblemInput
              onSubmit={handleStartCoaching}
              placeholder="Paste your problem here... (e.g., a calculus problem, algorithm question, proof, etc.)"
              buttonText="Start Coaching Session"
              loading={loading}
            />
          </div>
        ) : (
          <div>
            {/* Current Problem Display */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Problem:</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{currentProblem}</p>
                </div>
                <button
                  onClick={handleReset}
                  className="ml-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  New Problem
                </button>
              </div>
            </div>

            {/* Chat Interface */}
            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              loading={loading}
              placeholder="Type your answer or ask for a hint..."
              showSolutionButton={messages.length >= 4}
              onRequestSolution={handleRequestSolution}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
