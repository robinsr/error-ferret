import type { FeedbackItem, LLMResponseItem, CodeReference, PromptConfig } from '@/types';
import { LLM_MODELS, MAX_TOKENS, SNIPPET_LINES_BEFORE, SNIPPET_LINES_AFTER } from '@errorferret/constants';
import { env } from '@errorferret/env-node';

import OpenAI from '@openai/openai';

import { generateSystemPrompt, generateUserPrompt } from '@/utils/prompts';
import { mockChoices } from '@/utils/mocks';


const getContextLines = (code: string, line: string, lineNumber: number): CodeReference[] => {
  const lines = code.split('\n');

  let foundLine = lineNumber;

  if (line && line.length > 5) {
    const occurrences = lines.filter(l => l === line).length;

    // LLM's line counting is error-prone, so first check if the
    // line is unique. If it is, we can return the line itself.
    if (occurrences === 1) {
      foundLine = lines.indexOf(line);
    }
  }

  const start = Math.max(0, foundLine - SNIPPET_LINES_BEFORE);
  const end = Math.min(lines.length, foundLine + SNIPPET_LINES_AFTER);

  return lines.slice(start, end).map((line, index) => ({
    lineNum: start + index + 1,
    code: line
  }));
}


const getLLMResponse = async (systemPrompt: string, userPrompt: string): Promise<string> => {
  if (env.DEV) {
    console.debug('Using mock choices');
    return mockChoices[0]?.message?.content || '';
  }

  const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY
  });

  const response = await client.chat.completions.create({
    model: LLM_MODELS.GPT_5,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    max_completion_tokens: MAX_TOKENS,
  });

  const review = response.choices[0]?.message?.content

  if (!review) {
    console.error('No review generated', review)
    throw Error('No review generated');
  }

  return review;
}


export const generateFeedback = async (code: string, config: PromptConfig): Promise<FeedbackItem[]> => {

  const systemPrompt = generateSystemPrompt(config);
  const userPrompt = generateUserPrompt(code);

  const review = await getLLMResponse(systemPrompt, userPrompt);

  const jsonReview = review.replace(/```json/g, '').replace(/```/g, '');
  const parsedReview = JSON.parse(jsonReview);

  const feedbackItems: FeedbackItem[] = parsedReview.map((item: LLMResponseItem) => ({
    code: item.line,
    lineNum: item.lineNumber,
    columnNum: 0,
    contextLines: getContextLines(code, item.line, item.lineNumber),
    feedback: item.feedback
  }));

  return feedbackItems;
}
