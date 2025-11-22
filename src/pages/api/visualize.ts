import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface VisualizeRequest {
  problem: string;
  image?: string;
  problemType?: 'equation' | 'graph' | 'geometry' | 'number_line' | 'function' | 'generic';
}

interface VisualizeResponse {
  videoUrl?: string;
  videoId?: string;
  error?: string;
  explanation?: string;
  details?: string;
}

const MANIM_SERVICE_URL = (process.env.MANIM_SERVICE_URL || 'http://127.0.0.1:5001').replace(
  'localhost',
  '127.0.0.1'
);
const LOG_FILE = path.join(process.cwd(), 'debug_log.txt');

function log(message: string) {
  try {
    fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] ${message}\n`);
  } catch (e) {
    // Ignore logging errors
  }
}

import { generateManimCode } from './generate-manim-code';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  log('Handler started');
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (type: string, data: any) => {
    res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
  };

  try {
    const { problem, image }: VisualizeRequest = req.body;

    log(`Received request for problem: ${problem?.substring(0, 100)}`);
    if (image) log('Image provided in request');

    if (!problem && !image) {
      log('ERROR: No problem or image provided');
      // If headers not sent, send JSON error (though we set headers above, so likely need event)
      // But for bad request at start, we might want to just return 400 if we hadn't set headers yet.
      // However, we set headers immediately. So send error event.
      sendEvent('error', { error: 'Problem or image is required' });
      res.end();
      return;
    }

    let currentCode = '';
    let currentExplanation = '';
    let lastError = '';
    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        log(`Attempt ${attempt}/${MAX_RETRIES}`);
        sendEvent('progress', {
          message:
            attempt > 1
              ? `Retrying generation (Attempt ${attempt})...`
              : 'Generating Manim code...',
          step: 1,
          totalSteps: 2,
        });

        // Generate Manim code using AI (with error context if retrying)
        log('Generating Manim code with AI...');
        if (attempt > 1) {
          log(`Retrying with previous error: ${lastError.substring(0, 100)}`);
        }

        const { code, explanation } = await generateManimCode(
          problem,
          image,
          lastError,
          currentCode
        );
        currentCode = code;
        currentExplanation = explanation;

        log(`Generated code length: ${code.length}`);

        // Call Manim service with generated code and narration
        log(`Calling Manim service at: ${MANIM_SERVICE_URL}`);

        try {
          const manimResponse = await fetch(`${MANIM_SERVICE_URL}/generate-dynamic`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code,
              narration: explanation, // Send explanation as TTS narration
            }),
          });

          log(`Manim response status: ${manimResponse.status}`);

          if (!manimResponse.ok) {
            const errorData = await manimResponse.json();
            log(`ERROR from Manim service: ${JSON.stringify(errorData)}`);
            throw new Error(errorData.error || `Manim service error ${manimResponse.status}`);
          }

          if (!manimResponse.body) {
            throw new Error('No response body from Manim service');
          }

          // Read the stream from Manim service
          const reader = manimResponse.body.getReader();
          const decoder = new TextDecoder();
          let completed = false;

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
                    // Forward progress to client
                    sendEvent('progress', {
                      message: data.message,
                      step: 2,
                      totalSteps: 2,
                      percentage: data.percentage,
                    });
                  } else if (data.type === 'complete') {
                    completed = true;
                    log(`SUCCESS! Video ID: ${data.video_id}`);

                    sendEvent('complete', {
                      videoUrl: `${MANIM_SERVICE_URL}${data.video_url}`,
                      videoId: data.video_id,
                      explanation,
                      details: data.has_audio
                        ? undefined
                        : 'Audio generation failed (API key missing or invalid), but video was created successfully.',
                    });
                    res.end();
                    return;
                  } else if (data.type === 'error') {
                    throw new Error(data.error || 'Manim generation failed');
                  } else if (data.type === 'log') {
                    log(`[Manim Log] ${data.message}`);
                  }
                } catch (e) {
                  // Ignore parsing errors for partial chunks
                }
              }
            }
          }

          if (!completed) {
            throw new Error('Stream ended without completion event');
          }
        } catch (error: any) {
          // Check if it's a Manim execution error that we should retry
          // The error might come from the stream as an exception or 'error' event
          // If we caught an error from the stream loop, check if it's retriable

          // For now, let's assume stream errors are retriable if they are about generation failure
          // But we need to distinguish between code errors (retriable) and system errors

          // If we threw "Manim generation failed", it might be code error.
          // Let's capture it.

          log(`Manim service stream error: ${error.message}`);

          if (
            error.message.includes('Manim generation failed') ||
            error.message.includes('Failed to generate')
          ) {
            lastError = error.message;
            if (attempt === MAX_RETRIES) {
              throw error;
            }
            continue;
          }

          throw error;
        }
      } catch (error) {
        log(`Exception in attempt ${attempt}: ${error}`);

        // Don't retry on network errors (fetch failed) or other system errors
        // Only retry if we explicitly 'continue'd from a Manim code error
        if (
          attempt === MAX_RETRIES ||
          !(error instanceof Error && error.message.includes('Manim service failed'))
        ) {
          throw error;
        }
      }
    }

    // Should not reach here if logic is correct, but just in case
    throw new Error(`Failed after ${MAX_RETRIES} attempts. Last error: ${lastError}`);
  } catch (error) {
    log(`EXCEPTION: ${error}`);
    sendEvent('error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'The system attempted to self-correct but failed. Please try a simpler prompt.',
    });
    res.end();
  }
}
