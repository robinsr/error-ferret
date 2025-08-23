import { OpenAI } from "openai";
import { buildChatFunctions } from "ts-prompt/openai.ts";

const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
});

const { initChatPromptBuilder, respondWithJson } = buildChatFunctions<OpenAI>(openai);


export interface PromptConfig {
  language?: string;
  focus?: string;
  // Add more configuration options as needed in the future
}

export function generateSystemPrompt(config: PromptConfig = {}): string {
  // For now, return the static system prompt as it currently exists
  // This can be expanded later to generate different prompts based on language, focus, etc.
  return `You are an expert code reviewer. Analyze the provided code and provide detailed, constructive feedback. Focus on:
- Code quality and best practices
- Potential bugs or issues
- Performance considerations
- Security concerns
- Readability and maintainability
- Suggestions for improvement

Provide specific line-by-line feedback where appropriate.`;
}


export function generateUserPrompt(config: PromptConfig = {}, code: string): string {
  return [
    `Please review the following ${config.language ? config.language : 'code'}:`,
    `${config.focus ? `Focus area: ${config.focus}` : ''}`,
    `Code:`,
    `\`\`\``,
    code,
    `\`\`\``,
    `Please provide a comprehensive code review with specific feedback.`,
  ].join('\n');
}