import React from 'react';

interface WeekSchedule {
  week: number;
  topics: string[];
  hours: Record<string, number>;
  goals: string;
  checkpointQuestions: string[];
}

interface StudyPlan {
  summary: {
    totalWeeks: number;
    totalHours: number;
    topicsCovered: number;
  };
  schedule: WeekSchedule[];
  tips: string[];
}

interface StudyPlanViewProps {
  plan: StudyPlan;
}

export default function StudyPlanView({ plan }: StudyPlanViewProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Study Plan Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{plan.summary.totalWeeks}</div>
            <div className="text-sm text-gray-600">Weeks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{plan.summary.totalHours}</div>
            <div className="text-sm text-gray-600">Total Hours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{plan.summary.topicsCovered}</div>
            <div className="text-sm text-gray-600">Topics</div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Weekly Breakdown</h3>
        <div className="space-y-4">
          {plan.schedule.map((week) => (
            <div key={week.week} className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">Week {week.week}</h4>
                <span className="text-sm text-gray-500">
                  {Object.values(week.hours).reduce((a, b) => a + b, 0)} hours
                </span>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Topics:</p>
                <div className="flex flex-wrap gap-2">
                  {week.topics.map((topic, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {topic}
                      {week.hours[topic] && (
                        <span className="ml-2 text-xs text-blue-600">({week.hours[topic]}h)</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Goals:</p>
                <p className="text-sm text-gray-600">{week.goals}</p>
              </div>

              {week.checkpointQuestions.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Checkpoint Questions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {week.checkpointQuestions.map((question, idx) => (
                      <li key={idx} className="text-sm text-gray-600">
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Study Tips */}
      {plan.tips.length > 0 && (
        <div className="bg-amber-50 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Study Tips</h3>
          <ul className="space-y-2">
            {plan.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-amber-600 mr-2">💡</span>
                <span className="text-sm text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
