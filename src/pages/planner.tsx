import React, { useState } from 'react';
import Layout from '@/components/Layout';
import StudyPlanView from '@/components/StudyPlanView';

interface StudyPlan {
  summary: {
    totalWeeks: number;
    totalHours: number;
    topicsCovered: number;
  };
  schedule: Array<{
    week: number;
    topics: string[];
    hours: Record<string, number>;
    goals: string;
    checkpointQuestions: string[];
  }>;
  tips: string[];
}

export default function PlannerPage() {
  const [loading, setLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [plainTextPlan, setPlainTextPlan] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    courseName: '',
    topics: '',
    examDate: '',
    weeklyHours: 10,
    currentLevel: ''
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weeklyHours' ? parseInt(value) || 0 : value
    }));
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStudyPlan(null);
    setPlainTextPlan(null);

    try {
      const response = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate study plan');
      }

      if (data.parsed) {
        setStudyPlan(data.parsed);
      } else {
        setPlainTextPlan(data.plan);
      }
    } catch (error) {
      console.error('Error generating study plan:', error);
      alert(error instanceof Error ? error.message : 'Failed to generate study plan');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStudyPlan(null);
    setPlainTextPlan(null);
  };

  // Get minimum date (today) for exam date input
  const today = new Date().toISOString().split('T')[0];

  return (
    <Layout title="📅 Study Planner">
      <div className="max-w-4xl mx-auto">
        {/* Description */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Create Your Custom Study Plan
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">1.</span>
              Enter your course name and topics/syllabus
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">2.</span>
              Set your exam date and weekly study hours
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">3.</span>
              Get a day-by-day schedule with spaced repetition
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">4.</span>
              Use checkpoint questions to test yourself
            </li>
          </ul>
        </div>

        {/* Input Form or Results */}
        {!studyPlan && !plainTextPlan ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <form onSubmit={handleGeneratePlan} className="space-y-5">
              {/* Course Name */}
              <div>
                <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name
                </label>
                <input
                  type="text"
                  id="courseName"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  placeholder="e.g., CSC458 - Computer Networks"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>

              {/* Topics */}
              <div>
                <label htmlFor="topics" className="block text-sm font-medium text-gray-700 mb-2">
                  Topics / Syllabus
                </label>
                <textarea
                  id="topics"
                  name="topics"
                  value={formData.topics}
                  onChange={handleInputChange}
                  placeholder="List the topics or paste your syllabus here..."
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  required
                  disabled={loading}
                />
              </div>

              {/* Exam Date and Weekly Hours */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    id="examDate"
                    name="examDate"
                    value={formData.examDate}
                    onChange={handleInputChange}
                    min={today}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="weeklyHours" className="block text-sm font-medium text-gray-700 mb-2">
                    Weekly Study Hours
                  </label>
                  <input
                    type="number"
                    id="weeklyHours"
                    name="weeklyHours"
                    value={formData.weeklyHours}
                    onChange={handleInputChange}
                    min="1"
                    max="40"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Current Level (Optional) */}
              <div>
                <label htmlFor="currentLevel" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Understanding Level (Optional)
                </label>
                <select
                  id="currentLevel"
                  name="currentLevel"
                  value={formData.currentLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="">Select (optional)</option>
                  <option value="beginner">Beginner - Just starting to learn</option>
                  <option value="intermediate">Intermediate - Some familiarity</option>
                  <option value="advanced">Advanced - Good understanding, need review</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating Your Plan...
                  </span>
                ) : (
                  'Generate Study Plan'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Reset Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleReset}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Create Another Plan
              </button>
            </div>

            {/* Display Study Plan */}
            {studyPlan ? (
              <StudyPlanView plan={studyPlan} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Study Plan</h3>
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                    {plainTextPlan}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
