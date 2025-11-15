import type { NextApiRequest, NextApiResponse } from 'next';
import { callClaude, Message } from '@/lib/anthropicClient';
import { getAgentPrompt } from '@/lib/prompts';

interface CoachRequest {
  problem?: string;
  messages?: Message[];
  requestSolution?: boolean;
}

interface CoachResponse {
  message: string;
  decomposition?: any;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CoachResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed', error: 'Only POST requests are allowed' });
  }

  try {
    const { problem, messages, requestSolution }: CoachRequest = req.body;

    // Initial problem submission - decompose first
    if (problem && !messages) {
      const decomposerPrompt = getAgentPrompt('decomposer');
      const decompositionResponse = await callClaude(
        decomposerPrompt,
        [{ role: 'user', content: `Please decompose this problem:\n\n${problem}` }]
      );

      // Parse the decomposition
      let decomposition;
      try {
        decomposition = JSON.parse(decompositionResponse);
      } catch {
        // If not valid JSON, use as-is
        decomposition = { raw: decompositionResponse };
      }

      // Now start the Socratic coaching
      const coachPrompt = getAgentPrompt('coach');
      const coachingContext = `Problem: ${problem}\n\nProblem Breakdown:\n${decompositionResponse}\n\nStart coaching the student through this problem step by step. Begin with the first step.`;

      const coachResponse = await callClaude(
        coachPrompt,
        [{ role: 'user', content: coachingContext }]
      );

      return res.status(200).json({
        message: coachResponse,
        decomposition
      });
    }

    // Ongoing conversation
    if (messages && messages.length > 0) {
      const coachPrompt = getAgentPrompt('coach');

      // If student requests full solution
      if (requestSolution) {
        const solutionRequest = [
          ...messages,
          {
            role: 'user' as const,
            content: 'The student has requested to see the full solution. Please provide a complete solution outline now.'
          }
        ];

        const solutionResponse = await callClaude(coachPrompt, solutionRequest);
        return res.status(200).json({ message: solutionResponse });
      }

      // Continue Socratic coaching
      const response = await callClaude(coachPrompt, messages);
      return res.status(200).json({ message: response });
    }

    return res.status(400).json({
      message: 'Invalid request',
      error: 'Either problem or messages must be provided'
    });

  } catch (error) {
    console.error('Error in coach API:', error);
    return res.status(500).json({
      message: 'An error occurred',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
