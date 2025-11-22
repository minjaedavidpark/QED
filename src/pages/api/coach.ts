import type { NextApiRequest, NextApiResponse } from 'next';
import { callLLM, Message } from '@/lib/llmClient';
import { getAgentPrompt } from '@/lib/prompts';

interface CoachRequest {
  problem?: string;
  image?: string; // Base64 encoded image
  messages?: Message[];
  requestSolution?: boolean;
}

interface CoachResponse {
  message: string;
  decomposition?: any;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ message: 'Method not allowed', error: 'Only POST requests are allowed' });
  }

  // Enable streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (type: string, data: any) => {
    res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
  };

  try {
    const { problem, image, messages, requestSolution }: CoachRequest = req.body;

    // Initial problem submission - decompose first
    if ((problem || image) && !messages) {
      sendEvent('progress', { message: 'Analyzing problem...', step: 1, totalSteps: 3 });

      const decomposerPrompt = getAgentPrompt('decomposer');

      // Construct user message content
      let userContent: any[] = [];
      if (problem) {
        userContent.push({ type: 'text', text: `Please decompose this problem:\n\n${problem}` });
      } else {
        userContent.push({
          type: 'text',
          text: `Please decompose the problem shown in this image.`,
        });
      }

      if (image) {
        // Extract base64 data and media type
        // Assuming image string is like "data:image/png;base64,..."
        const matches = image.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          userContent.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: matches[1],
              data: matches[2],
            },
          });
        }
      }

      sendEvent('progress', {
        message: 'Decomposing problem structure...',
        step: 2,
        totalSteps: 3,
      });
      const decompositionResponse = await callLLM(decomposerPrompt, [
        { role: 'user', content: userContent as any },
      ]);

      // Parse the decomposition
      let decomposition;
      try {
        decomposition = JSON.parse(decompositionResponse);
      } catch {
        // If not valid JSON, use as-is
        decomposition = { raw: decompositionResponse };
      }

      // Now start the Socratic coaching
      sendEvent('progress', { message: 'Preparing coaching session...', step: 3, totalSteps: 3 });
      const coachPrompt = getAgentPrompt('coach');
      const coachingContext = `Problem: ${problem || 'See image'}\n\nProblem Breakdown:\n${decompositionResponse}\n\nStart coaching the student through this problem step by step. Begin with the first step.`;

      // For coaching, we also want to provide the image context if available
      let coachUserContent: any[] = [{ type: 'text', text: coachingContext }];

      if (image) {
        const matches = image.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          coachUserContent.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: matches[1],
              data: matches[2],
            },
          });
        }
      }

      const coachResponse = await callLLM(coachPrompt, [
        { role: 'user', content: coachUserContent as any },
      ]);

      sendEvent('complete', {
        message: coachResponse,
        decomposition,
      });
      res.end();
      return;
    }

    // Ongoing conversation
    if (messages && messages.length > 0) {
      const coachPrompt = getAgentPrompt('coach');

      // If student requests full solution
      if (requestSolution) {
        sendEvent('progress', { message: 'Generating full solution...', step: 1, totalSteps: 1 });
        const solutionRequest = [
          ...messages,
          {
            role: 'user' as const,
            content:
              'The student has requested to see the full solution. Please provide a complete solution outline now.',
          },
        ];

        const solutionResponse = await callLLM(coachPrompt, solutionRequest);
        sendEvent('complete', { message: solutionResponse });
        res.end();
        return;
      }

      // Continue Socratic coaching
      sendEvent('progress', { message: 'Thinking...', step: 1, totalSteps: 1 });
      const response = await callLLM(coachPrompt, messages);
      sendEvent('complete', { message: response });
      res.end();
      return;
    }

    res.status(400).json({
      message: 'Invalid request',
      error: 'Either problem, image, or messages must be provided',
    });
  } catch (error) {
    console.error('Error in coach API:', error);
    // If headers haven't been sent (unlikely given we set them early), send JSON error
    // Otherwise send error event
    if (!res.headersSent) {
      res.status(500).json({
        message: 'An error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } else {
      sendEvent('error', {
        message: 'An error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      res.end();
    }
  }
}
