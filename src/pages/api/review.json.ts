import type { APIContext, APIRoute } from 'astro';
import { generateSystemPrompt, generateUserPrompt } from '../../utils/prompts';
import OpenAI from '@openai/openai';
import { respondErr, respondOK } from '../../utils/request';

export const POST: APIRoute = async (context: APIContext) => {

  const { request } = context;

  const headers = request.headers;

  console.log('Received review request:', request);

  try {
    const payload = await request.json();
    const code = payload.code as string;
    const language = payload.language as string;
    const focus = payload.focus as string;

    console.log(code, language, focus);

    if (!code || code.trim() === '') {
      return new Response(JSON.stringify({ error: 'Code is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Initialize OpenAI client
    const client = new OpenAI({
      apiKey: import.meta.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: generateSystemPrompt({ language, focus })
        },{
          role: 'user',
          content: generateUserPrompt({ language, focus }, code)
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    console.log(response);

    const review = response.choices[0]?.message?.content || 'No review generated';

    return new Response(JSON.stringify({
      review,
      language: language || 'auto-detected',
      focus: focus || 'general',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Code review error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
