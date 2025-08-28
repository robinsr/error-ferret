
import type { Review, ModelFindings } from "@errorferret/schemas"
import { ModelFindingsSchema } from "@errorferret/schemas"

import { LLM_MODELS, MAX_TOKENS, SNIPPET_LINES_BEFORE, SNIPPET_LINES_AFTER } from '@errorferret/constants';

import { env } from '@errorferret/env-node';

import OpenAI from '@openai/openai';

import { generateSystemPrompt } from '@prompt/system';
import { generateUserPrompt } from '@prompt/user';

import { mockChoices } from '@/utils/mocks';
import { cleanModelResponse } from '@/utils/model-response';


// const getContextLines = (code: string, line: string, lineNumber: number): CodeReference[] => {
//   const lines = code.split('\n');

//   let foundLine = lineNumber;

//   if (line && line.length > 5) {
//     const occurrences = lines.filter(l => l === line).length;

//     // LLM's line counting is error-prone, so first check if the
//     // line is unique. If it is, we can return the line itself.
//     if (occurrences === 1) {
//       foundLine = lines.indexOf(line);
//     }
//   }

//   const start = Math.max(0, foundLine - SNIPPET_LINES_BEFORE);
//   const end = Math.min(lines.length, foundLine + SNIPPET_LINES_AFTER);

//   return lines.slice(start, end).map((line, index) => ({
//     lineNum: start + index + 1,
//     code: line
//   }));
// }


async function getLLMResponse<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  // if (env.DEV) {
  //   console.debug('Using mock choices');
  //   return mockChoices[0]?.message?.content || '';
  // }

  console.debug('GETTING LLM RESPONSE', systemPrompt, userPrompt)

  const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY
  });

  try {
    const response = await client.chat.completions.create({
      model: LLM_MODELS.GPT_5,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_completion_tokens: MAX_TOKENS,
    });

    const content = response.choices[0]?.message?.content

    if (!content) {
      console.error('No content generated for prompts:', { systemPrompt, userPrompt })
      throw Error('No content generated for prompts');
    }

    return cleanModelResponse<T>(content);
  } catch (error) {
    console.error('Error getting LLM response:', error)
    console.log("OPEN_AI_KEY:", env.OPENAI_API_KEY)
    throw error
  }
}


export async function generateInitialFindings(review: Review): Promise<ModelFindings> {

  const systemPrompt = generateSystemPrompt(review);
  const userPrompt = generateUserPrompt(review);

  const response = await getLLMResponse<ModelFindings>(systemPrompt, userPrompt)
  const initialFindings = ModelFindingsSchema.safeParse(response)

  if (!initialFindings.success) {
    console.error('Invalid model response:', initialFindings.error)
    throw Error('Invalid model response');
  }

  return initialFindings.data;
}
