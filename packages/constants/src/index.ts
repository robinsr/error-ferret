// Isomorphic, safe-to-bundle values only

// Deprecated - For MVP all feedback is at the expert level
export const EXPERIENCE_LEVEL_OPTIONS = [
    { value: 'novice', label: 'Novice' },
    { value: 'apprentice', label: 'Apprentice' },
    { value: 'experienced', label: 'Experienced' },
    { value: 'professional', label: 'Professional' },
    { value: 'expert', label: 'Expert' },
]

//
// Input limits
//
// This is just a demo product, not a real production system! I can't afford to pay for the tokens.
//

// Limiting to 300 lines total per request to avoid consuming too many tokens
export const MAX_UESR_CODE_LINES = 300;

// Limiting to 5 files for now
export const MAX_USER_FILE_COUNT = 5;

// Limiting to 8 reviewer "comments" per review; any more and the UI gets messy
export const MAX_FEEDBACK_ITEMS = 8;

//
// Model configuration
//

// TODO: Add more models
export const LLM_MODELS = {
  GPT_4_TURBO: 'gpt-4-turbo',
  GPT_4O_MINI: 'gpt-4o-mini',
  GPT_4O: 'gpt-4o',
  GPT_41: 'gpt-4.1',
  GPT_41_MINI: 'gpt-4.1-mini',
  GPT_5: 'gpt-5-2025-08-07',
  GPT_5_MINI: 'gpt-5-mini-2025-08-07',
  GPT_5_NANO: 'gpt-5-nano-2025-08-07',
}

// I'm not sure what the max tokens are for each model, but I'm guessing it's around 10k
export const MAX_TOKENS = 10000;

// Doesn't apply to GPT-5, but it's a good default for other models (also I'm not sure what this does...)
export const TEMPERATURE = 0.3;

//
// UI Configuration
//

// Configures how many lines of code around the feedback item to include in the snippet
export const SNIPPET_LINES_BEFORE = 4;
export const SNIPPET_LINES_AFTER = 6;
