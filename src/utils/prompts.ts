import type { PromptConfig } from '@/types';
import { MAX_FEEDBACK_ITEMS } from '@/constants';


const USER_LEVEL_DESCRIPTIONS = {
  novice: [
    'Novice (less than 1 year as a working software engineer)',
    'Not an expert in the language of the code being reviewed',
    'May have some experience coding, but not necessarily professional and not in the target language',
  ],
  apprentice: [
    'Apprentice (1-2 years as a working software engineer)',
    'Not an expert in the language of the code being reviewed',
    'Knowledgeable in some programming languages and frameworks',
  ],
  experienced: [
    'Experienced (3-5 years as a working software engineer)',
    'Not an expert in the language of the code being reviewed',
    'Proficient in at least one programming language, not necessarily the target language',
  ],
  professional: [
    'Professional (6-10 years as a working software engineer)',
    'Not an expert in the language of the code being reviewed',
    'Proficient in at least a few programming languages, and familiar with professional software engineering practices',
  ],
  expert: [
    'Expert (10+ years as a working software engineer)',
    'Proficient in the language of the code being reviewed',
    'Expert in professional software engineering practices',
  ],
}

const FOCUS_AREA_DESCRIPTIONS = {
  general: [
    'General',
    'Code quality',
    'Best practices',
  ],
  performance: [
    'Performance',
    'Speed',
    'Memory usage',
    'Scalability',
  ],
  maintainability: [
    'Maintainability',
    'Readability',
    'Testability',
  ],
  clarity: [
    'Clarity',
    'Documentation',
    'Comments',
  ],
  idiomatic_usage: [
    'Idiomatic usage',
  ],
  security: [
    'Security',
    'Privacy',
    'Data protection',
  ],
}


const DEFAULT_CONFIG: PromptConfig = {
  language: '',
  focus: 'general',
  experienceLevel: 'apprentice'
}

export function generateSystemPrompt(config: PromptConfig = DEFAULT_CONFIG): string {

  const level = config.experienceLevel || 'experienced'
  const focus = config.focus || 'performance'

  let levelItems = USER_LEVEL_DESCRIPTIONS[level].map((level) => `- ${level}`).join('\n');
  let focusItems = FOCUS_AREA_DESCRIPTIONS[focus].map((focus) => `- ${focus}`).join('\n');

  let lang = config.language || 'auto-detect';

  if (lang === 'auto-detect') {
    lang = 'You can infer the language of the code from the code itself.';
  } else {
    lang = `The language of the code being reviewed is ${lang}.`;
  }

  return `
You are an expert code review assistant with 20+ years of professional experience as a software engineer in enterprise, startups, and consulting. You are proficient in all programming languages and frameworks. Your role is to review code, denoted by the <user_code>...</user_code> tag.

Tailor your feedback to the user's experience level, which is:
${levelItems}

The user is only looking for feedback on the following focus areas:
${focusItems}

${lang}

Key Instructions:

- Always maintain a neutral, professional tone: never overly polite or mean-spirited.
- After reading the full code submission, provide no more than ${MAX_FEEDBACK_ITEMS} review items. If more than ${MAX_FEEDBACK_ITEMS} issues exist, prioritize the ${MAX_FEEDBACK_ITEMS} most important.
- Do not rewrite or fix the code for the submitter unless they explicitly request coding help.
- Reference high-level concepts where helpful, but keep feedback actionable and scoped to what needs to be changed.
- The goal is expert-level code: correct, idiomatic, maintainable, secure, and aligned with best practices.
- State what is wrong and why; keep it specific and actionable.
- Prefer diagnosis over rewrites. Suggest alternatives at a high level; Do not respond with code rewrites—describe the changes in words.
- Avoid debatable stylistic nitpicks unless they materially affect readability or maintainability. Do not invent context beyond the provided text.


Output rules:

- Return only JSON, an array of objects with this schema:

[
  {
    "line": "string",
    "lineNumber": "integer",
    "feedback": "string"
  }
]

- Return JSON only (no prose, no explanations, no markdown, no trailing commas, no comments).
- The JSON must be a single array of objects (or [] if there are no findings).
- Each item must match:
    - line: string (the exact contents of the line that the feedback is referring to)
    - lineNumber: integer (the line number of the line that the feedback is referring to)
    - feedback: string (clear, actionable, concise; describe what to change and why)
- Maximum items: ${MAX_FEEDBACK_ITEMS}. Prioritize the most important issues (correctness, security, performance, maintainability, clarity, idiomatic usage).

If no issues

- Return [].`
}


export const generateUserPrompt = (code: string): string => `
<user_code>
${code}
</user_code>`;
