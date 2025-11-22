import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProblemInput from '@/components/ProblemInput';
import ChatPanel, { ChatMessage } from '@/components/ChatPanel';
import VisualizationPanel from '@/components/VisualizationPanel';

export default function CoachPage() {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentProblem, setCurrentProblem] = useState('');
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  const readStream = async (response: Response, onComplete: (data: any) => void) => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Failed to initialize stream reader');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'progress') {
              setProgressMessage(data.message);
              if (data.totalSteps) {
                setProgressPercentage(Math.round((data.step / data.totalSteps) * 100));
              }
            } else if (data.type === 'complete') {
              onComplete(data);
            } else if (data.type === 'error') {
              throw new Error(data.error || 'An error occurred');
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }
  };

  const handleStartCoaching = async (problem: string, image?: string) => {
    setCurrentProblem(problem);
    setCurrentImage(image || null);
    setLoading(true);
    setProgressMessage('Starting session...');
    setProgressPercentage(0);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, image }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to start coaching');
      }

      await readStream(response, (data) => {
        setMessages([
          {
            role: 'assistant',
            content: data.message,
            timestamp: new Date(),
          },
        ]);
        setStarted(true);
      });
    } catch (error) {
      console.error('Error starting coaching:', error);
      alert(error instanceof Error ? error.message : 'Failed to start coaching session');
    } finally {
      setLoading(false);
      setProgressMessage(null);
      setProgressPercentage(0);
    }
  };

  const handleSendMessage = async (userMessage: string) => {
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);
    setProgressMessage('Thinking...');
    setProgressPercentage(0);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newUserMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get response');
      }

      await readStream(response, (data) => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.message,
            timestamp: new Date(),
          },
        ]);
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setLoading(false);
      setProgressMessage(null);
      setProgressPercentage(0);
    }
  };

  const handleRequestSolution = async () => {
    const confirmRequest = window.confirm(
      'Are you sure you want to see the full solution? It&apos;s better to keep trying and learn through the process.'
    );

    if (!confirmRequest) return;

    setLoading(true);
    setProgressMessage('Generating solution...');
    setProgressPercentage(0);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          requestSolution: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get solution');
      }

      await readStream(response, (data) => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.message,
            timestamp: new Date(),
          },
        ]);
      });
    } catch (error) {
      console.error('Error requesting solution:', error);
      alert(error instanceof Error ? error.message : 'Failed to get solution');
    } finally {
      setLoading(false);
      setProgressMessage(null);
      setProgressPercentage(0);
    }
  };

  const handleReset = () => {
    setStarted(false);
    setMessages([]);
    setCurrentProblem('');
    setCurrentImage(null);
  };

  return (
    <Layout title="🧩 Guided Problem Solving">
      <div className="max-w-4xl mx-auto">
        {/* Description */}
        <div className="rounded-2xl p-8 mb-8 border-2 border-blue-300/50 dark:border-blue-700/50 bg-gradient-to-br from-blue-50 via-cyan-50/80 to-blue-100/50 dark:from-blue-900/30 dark:via-cyan-900/30 dark:to-blue-800/30">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How it works</h2>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs font-bold mr-3 mt-0.5">
                1
              </span>
              <span>Paste a challenging problem (math, CS, theory, etc.)</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs font-bold mr-3 mt-0.5">
                2
              </span>
              <span>The coach will break it down and guide you step-by-step</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs font-bold mr-3 mt-0.5">
                3
              </span>
              <span>Answer questions and work through each step</span>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs font-bold mr-3 mt-0.5">
                4
              </span>
              <span>Get hints if you&apos;re stuck (not direct answers!)</span>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        {!started ? (
          <div className="rounded-3xl p-8 border-2 border-blue-200/50 dark:border-blue-700/50 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/40 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
            <ProblemInput
              onSubmit={handleStartCoaching}
              placeholder="Paste your problem here... (e.g., a calculus problem, algorithm question, proof, etc.)"
              buttonText="Start Coaching Session"
              loading={loading}
            />
            {loading && progressMessage && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex items-center justify-center gap-3 animate-pulse">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  {progressMessage} {progressPercentage > 0 && `(${progressPercentage}%)`}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Current Problem Display */}
            <div className="rounded-2xl p-6 mb-6 border-2 border-blue-200/50 dark:border-blue-700/50 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-3 uppercase tracking-wide">
                    Current Problem
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {currentProblem}
                  </p>
                  {currentImage && (
                    <div className="mt-4 rounded-xl overflow-hidden border-2 border-blue-200 dark:border-blue-700 max-w-md">
                      <img
                        src={currentImage}
                        alt="Problem"
                        className="w-full h-auto bg-gray-100 dark:bg-gray-800"
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={handleReset}
                  className="ml-4 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
                >
                  New Problem
                </button>
              </div>
            </div>

            {/* Visualization Panel */}
            <VisualizationPanel problem={currentProblem} image={currentImage || undefined} />

            {/* Chat Interface */}
            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              loading={loading}
              placeholder="Type your answer or ask for a hint..."
              showSolutionButton={messages.length >= 4}
              onRequestSolution={handleRequestSolution}
            />
            {loading && progressMessage && started && (
              <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-xl border border-blue-100 dark:border-gray-700 flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {progressMessage}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
