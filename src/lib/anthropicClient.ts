import Anthropic from '@anthropic-ai/sdk';

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamCallback {
  onToken?: (token: string) => void;
  onComplete?: (fullResponse: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Call Claude API with a system prompt and conversation history
 */
export async function callClaude(
  systemPrompt: string,
  messages: Message[],
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: options?.model || 'claude-sonnet-4-20250514',
      max_tokens: options?.maxTokens || 4096,
      temperature: options?.temperature || 1,
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in response');
    }

    return textContent.text;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw error;
  }
}

/**
 * Stream responses from Claude API
 */
export async function streamClaude(
  systemPrompt: string,
  messages: Message[],
  callback: StreamCallback,
  options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }
): Promise<void> {
  try {
    const stream = await anthropic.messages.stream({
      model: options?.model || 'claude-sonnet-4-20250514',
      max_tokens: options?.maxTokens || 4096,
      temperature: options?.temperature || 1,
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    stream.on('text', (text) => {
      callback.onToken?.(text);
    });

    const finalMessage = await stream.finalMessage();
    const textContent = finalMessage.content.find((block) => block.type === 'text');
    if (textContent && textContent.type === 'text') {
      callback.onComplete?.(textContent.text);
    }
  } catch (error) {
    console.error('Error streaming from Claude API:', error);
    callback.onError?.(error as Error);
    throw error;
  }
}

export default anthropic;
