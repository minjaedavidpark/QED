import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface VisualizeRequest {
  problem: string;
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VisualizeResponse>
) {
  log('Handler started');
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { problem }: VisualizeRequest = req.body;

    log(`Received request for problem: ${problem?.substring(0, 100)}`);

    if (!problem) {
      log('ERROR: No problem provided');
      return res.status(400).json({ error: 'Problem is required' });
    }

    let currentCode = '';
    let currentExplanation = '';
    let lastError = '';
    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        log(`Attempt ${attempt}/${MAX_RETRIES}`);

        // Generate Manim code using AI (with error context if retrying)
        log('Generating Manim code with AI...');
        if (attempt > 1) {
          log(`Retrying with previous error: ${lastError.substring(0, 100)}`);
        }

        const { code, explanation } = await generateManimCode(problem, lastError, currentCode);
        currentCode = code;
        currentExplanation = explanation;

        log(`Generated code length: ${code.length}`);
        // Removed logging explanation to file to avoid large file writes
        // log(`Explanation: ${explanation}`);

        // Call Manim service with generated code and narration
        log(`Calling Manim service at: ${MANIM_SERVICE_URL}`);
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

          // Capture error for retry
          lastError = errorData.details || errorData.error || 'Unknown Manim error';

          // If it's the last attempt, throw to exit loop
          if (attempt === MAX_RETRIES) {
            throw new Error(`Manim service failed: ${lastError}`);
          }

          // Continue to next iteration (retry)
          continue;
        }

        const result = await manimResponse.json();
        log(`SUCCESS! Video ID: ${result.video_id}`);

        return res.status(200).json({
          videoUrl: `${MANIM_SERVICE_URL}${result.video_url}`,
          videoId: result.video_id,
          explanation,
          details: result.has_audio
            ? undefined
            : 'Audio generation failed (API key missing or invalid), but video was created successfully.',
        });
      } catch (error) {
        log(`Exception in attempt ${attempt}: ${error}`);
        lastError = error instanceof Error ? error.message : String(error);

        if (attempt === MAX_RETRIES) {
          throw error;
        }
      }
    }

    // Should not reach here if logic is correct, but just in case
    throw new Error(`Failed after ${MAX_RETRIES} attempts. Last error: ${lastError}`);
  } catch (error) {
    log(`EXCEPTION: ${error}`);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'The system attempted to self-correct but failed. Please try a simpler prompt.',
    });
  }
}
