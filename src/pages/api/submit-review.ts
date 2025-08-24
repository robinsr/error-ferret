import type { APIContext, APIRoute } from 'astro';
import { generateSystemPrompt, generateUserPrompt } from '../../utils/prompts';
import OpenAI from '@openai/openai';
import { respondErr } from '../../utils/request';

interface ReviewItem {
  line: number;
  column: number;
  snippet: string;
  feedback: string;
}

export const POST: APIRoute = async (context: APIContext) => {
  const { request } = context;

  try {
    const formData = await request.formData();
    const code = formData.get('code') as string;
    const language = formData.get('language') as string;
    const focus = formData.get('focus') as string;

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

    const review = response.choices[0]?.message?.content;

    if (!review) {
      return respondErr('No review generated');
    }

    const jsonReview = review.replace(/```json/g, '').replace(/```/g, '');
    const parsedReview = JSON.parse(jsonReview);
    const codeLines = code.split('\n');

    const reviewItems: ReviewItem[] = parsedReview.map((item: ReviewItem) => ({
      line: item.line,
      column: item.column,
      snippet: codeLines[item.line - 1],
      feedback: item.feedback
    }));

    const reviewData = {
      language: language || 'auto-detected',
      focus: focus || 'general',
      timestamp: new Date().toISOString(),
      reviewItems: reviewItems,
      code: code
    };

    // Store the review data in a temporary way (you might want to use a database or session)
    // For now, we'll encode it in the URL
    const encodedData = encodeURIComponent(JSON.stringify(reviewData));

    // Redirect to the review page with the data
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `/review?data=${encodedData}`
      }
    });

  } catch (error) {
    console.error('Code review error:', error);
    return respondErr(error);
  }
};
