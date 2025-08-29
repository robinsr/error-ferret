import type { Review, ModelFindings } from "@errorferret/schemas"
import { ModelFindingsSchema } from "@errorferret/schemas"
import { LLM_MODELS, MAX_TOKENS, SNIPPET_LINES_BEFORE, SNIPPET_LINES_AFTER } from '@errorferret/constants';
import { env } from '@errorferret/env-node';
import { generateSystemPrompt } from '@prompt/system';
import { generateUserPrompt } from '@prompt/user';
import { translateSystemPrompt, translationUserPrompt } from '@prompt/translation';
import OpenAI from '@openai/openai';
import { cleanModelResponse } from "@/utils/model-response";

import { mockGtp5Response } from "@/utils/mocks";


type CompletionConfig = OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming

async function getLLMResponse(config: CompletionConfig) {
  const messages = config.messages
  const sys = messages.find(msg => msg.role == 'system')
  const user = messages.find(msg => msg.role == 'user')

  const client = new OpenAI({
    apiKey: env.OPENAI_API_KEY
  });

  try {
    const response = await client.chat.completions.create(config);
    const content = response.choices[0]?.message?.content

    if (!content) {
      console.error('No content generated for prompts:', { system: sys?.content, user: user?.content })
      throw Error('No content generated for prompts');
    }

    return content
  } catch (error) {
    console.error('Error getting LLM response:', error)
    throw error
  }
}


async function getGtp5Response(systemPrompt: string, userPrompt: string): Promise<string> {
  const config: CompletionConfig = {
    model: LLM_MODELS.GPT_5,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    max_completion_tokens: MAX_TOKENS,
  }

  return await getLLMResponse(config)
}

async function getGpt4Response(systemPrompt: string, userPrompt: string): Promise<string> {
  const config: CompletionConfig = {
    model: LLM_MODELS.GPT_4O_MINI,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    max_completion_tokens: MAX_TOKENS,
  }

  return await getLLMResponse(config)
}

export async function generateInitialFindings(review: Review): Promise<ModelFindings> {

  // Uncomment to use mock data (review must use "performance" and "clarity" focus)
  // return mockGtp5Response as ModelFindings

  const systemPrompt = generateSystemPrompt(review);
  const userPrompt = generateUserPrompt(review);
  const responseText = await getGtp5Response(systemPrompt, userPrompt)
  const response = cleanModelResponse(responseText)
  const initialFindings = ModelFindingsSchema.safeParse(response)

  if (!initialFindings.success) {
    console.error('Invalid model response:', initialFindings.error)
    throw Error('Invalid model response');
  }

  return initialFindings.data;
}

export async function generateStyledFeedback(review: Review, findings: ModelFindings): Promise<ModelFindings> {
  const systemPrompt = translateSystemPrompt();
  const userPrompt = translationUserPrompt(review, findings);
  const response = await getGpt4Response(systemPrompt, userPrompt)
  const lines = response.split('\n')

  return findings
    .map((finding, index) => ({
      ...finding,
      message: lines[index] || finding.message
    }))
}