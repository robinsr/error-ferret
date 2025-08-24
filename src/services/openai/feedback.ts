import type { FeedbackItem, LLMResponseItem } from '@/types';
import { generateSystemPrompt, generateUserPrompt } from '../../utils/prompts';
import OpenAI from '@openai/openai';
import { mockFeedbackItems } from '@/utils/mocks';


const MAX_TOKENS = 2000;
const TEMPERATURE = 0.3;

// Configures how many lines of code around the feedback item to include in the snippet
const SNIPPET_LINES_BEFORE = 3;
const SNIPPET_LINES_AFTER = 1;


const getSnippet = (
  code: string,
  line: number,
  before: number = SNIPPET_LINES_BEFORE,
  after: number = SNIPPET_LINES_AFTER
) => {
  const lines = code.split('\n');
  const start = Math.max(0, line - before);
  const end = Math.min(lines.length, line + after);
  return lines.slice(start, end).join('\n');
}


export const generateFeedback = async (code: string, language: string, focus: string): Promise<FeedbackItem[]> => {

  // Use mocks if in development
  if (import.meta.env.DEV) {
    return mockFeedbackItems;
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
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
    });

    const review = response.choices[0]?.message?.content

    if (!review) {
      throw Error('No review generated');
    }

    const jsonReview = review.replace(/```json/g, '').replace(/```/g, '');
    const parsedReview = JSON.parse(jsonReview);

    const feedbackItems: FeedbackItem[] = parsedReview.map((item: LLMResponseItem) => ({
      line: item.line,
      column: item.column,
      snippet: getSnippet(code, item.line),
      feedback: item.feedback
    }));

    console.log('Fetched feedback items from openAI:', feedbackItems);

    return feedbackItems;
}
