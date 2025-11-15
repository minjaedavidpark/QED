import type { NextApiRequest, NextApiResponse } from 'next';
import { callClaude } from '@/lib/anthropicClient';
import { getAgentPrompt } from '@/lib/prompts';

interface CritiqueRequest {
  problem: string;
  solution: string;
}

interface CritiqueResponse {
  critique: string;
  parsed?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CritiqueResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      critique: 'Method not allowed',
      error: 'Only POST requests are allowed'
    });
  }

  try {
    const { problem, solution }: CritiqueRequest = req.body;

    if (!problem || !solution) {
      return res.status(400).json({
        critique: 'Invalid request',
        error: 'Both problem and solution are required'
      });
    }

    const criticPrompt = getAgentPrompt('critic');
    const critiqueRequest = `Problem Statement:
${problem}

Student's Solution:
${solution}

Please analyze this solution and provide detailed feedback.`;

    const critiqueResponse = await callClaude(
      criticPrompt,
      [{ role: 'user', content: critiqueRequest }]
    );

    // Try to parse as JSON if it's structured
    let parsed;
    try {
      parsed = JSON.parse(critiqueResponse);
    } catch {
      // If not JSON, return as plain text
      parsed = null;
    }

    return res.status(200).json({
      critique: critiqueResponse,
      parsed
    });

  } catch (error) {
    console.error('Error in critique API:', error);
    return res.status(500).json({
      critique: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
