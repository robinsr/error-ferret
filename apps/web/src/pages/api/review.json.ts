import type { APIContext, APIRoute } from 'astro';
import { generateFeedback } from '@/services/openai/feedback';
import { respondErr, respondOK } from '../../utils/request';


/**
 * @deprecated - This is no longer used, but kept for reference.
 * A POST handler that generates feedback for a given code snippet, returning a JSON response.
 *
 * @param context - The Astro API context.
 * @returns A JSON response containing the feedback items, language, focus, and timestamp.
 */
export const POST: APIRoute = async (context: APIContext) => {

  const { request } = context;

  try {
    const payload = await request.json();
    const code = payload.code as string;
    const language = payload.language as string || 'auto-detected';
    const focus = payload.focus as string || 'general';

    if (!code || code.trim() === '') {
      return respondErr('No code submitted', 400)
    }

    const feedbackItems = await generateFeedback(code, language, focus);
    const timestamp = new Date().toISOString();

    return respondOK({ feedbackItems, language, focus, timestamp });
  } catch (error) {
    console.error('Code review error:', error);
    return respondErr(error);
  }
};
