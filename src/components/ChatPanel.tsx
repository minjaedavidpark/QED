import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  loading?: boolean;
  placeholder?: string;
  showSolutionButton?: boolean;
  onRequestSolution?: () => void;
}

export default function ChatPanel({
  messages,
  onSendMessage,
  loading = false,
  placeholder = 'Type your response...',
  showSolutionButton = false,
  onRequestSolution,
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[650px] rounded-3xl overflow-hidden border-2 border-blue-200/50 dark:border-blue-700/50 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 mt-16">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-xl font-medium text-gray-900 dark:text-gray-100">
              Start your conversation with the coach
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Ask questions, share your thinking...
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                    : 'bg-gradient-to-br from-purple-100 via-blue-50 to-cyan-50 dark:from-purple-900/40 dark:via-blue-900/40 dark:to-cyan-900/40 border-2 border-purple-300/50 dark:border-purple-700/50 text-gray-800 dark:text-gray-200'
                }`}
              >
                <div className="markdown-content leading-relaxed">
                  {message.role === 'user' ? (
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                        ol: ({ children }) => (
                          <ol className="list-decimal ml-4 mb-2">{children}</ol>
                        ),
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        h1: ({ children }) => (
                          <h1 className="text-xl font-bold mb-2 mt-4">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-base font-bold mb-1 mt-2">{children}</h3>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-blue-300 pl-4 italic my-2">
                            {children}
                          </blockquote>
                        ),
                        code: ({ children }) => (
                          <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm font-mono">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
                {message.timestamp && (
                  <div
                    className={`text-xs mt-2 ${
                      message.role === 'user'
                        ? 'text-blue-100'
                        : 'text-purple-800 dark:text-purple-300'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-br from-purple-100 via-blue-50 to-cyan-50 dark:from-purple-900/40 dark:via-blue-900/40 dark:to-cyan-900/40 border-2 border-purple-300/50 dark:border-purple-700/50 rounded-2xl px-6 py-4">
              <div className="flex space-x-2">
                <div
                  className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t-2 border-blue-200/50 dark:border-blue-700/50 p-6 bg-gradient-to-br from-blue-50/30 to-purple-50/20 dark:from-gray-700/30 dark:to-gray-700/30">
        {showSolutionButton && onRequestSolution && (
          <div className="mb-4">
            <button
              onClick={onRequestSolution}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-full hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Show Full Solution
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
            className="flex-1 px-5 py-3 rounded-full border-2 border-blue-200/50 dark:border-blue-700/50 bg-gradient-to-r from-white to-blue-50/30 dark:from-gray-700 dark:to-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 dark:focus:border-blue-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-8 rounded-full hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
