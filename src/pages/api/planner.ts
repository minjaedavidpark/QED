import type { NextApiRequest, NextApiResponse } from 'next';
import { callClaude } from '@/lib/anthropicClient';
import { getAgentPrompt } from '@/lib/prompts';

interface PlannerRequest {
  courseName: string;
  topics: string;
  examDate: string;
  weeklyHours: number;
  currentLevel?: string;
}

interface PlannerResponse {
  plan: string;
  parsed?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlannerResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      plan: 'Method not allowed',
      error: 'Only POST requests are allowed'
    });
  }

  try {
    const { courseName, topics, examDate, weeklyHours, currentLevel }: PlannerRequest = req.body;

    if (!courseName || !topics || !examDate || !weeklyHours) {
      return res.status(400).json({
        plan: 'Invalid request',
        error: 'All fields (courseName, topics, examDate, weeklyHours) are required'
      });
    }

    // Calculate weeks until exam
    const now = new Date();
    const exam = new Date(examDate);
    const weeksUntilExam = Math.max(1, Math.ceil((exam.getTime() - now.getTime()) / (7 * 24 * 60 * 60 * 1000)));

    const plannerPrompt = getAgentPrompt('planner');
    const planningRequest = `Course: ${courseName}

Topics to Cover:
${topics}

Exam Date: ${examDate}
Weeks Until Exam: ${weeksUntilExam}
Weekly Available Hours: ${weeklyHours}
${currentLevel ? `Current Understanding Level: ${currentLevel}` : ''}

Please create a comprehensive study plan for this student.`;

    const planResponse = await callClaude(
      plannerPrompt,
      [{ role: 'user', content: planningRequest }],
      { maxTokens: 8192 } // Study plans can be longer
    );

    // Try to parse as JSON if it's structured
    let parsed;
    try {
      parsed = JSON.parse(planResponse);
    } catch {
      // If not JSON, return as plain text
      parsed = null;
    }

    return res.status(200).json({
      plan: planResponse,
      parsed
    });

  } catch (error) {
    console.error('Error in planner API:', error);
    return res.status(500).json({
      plan: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
