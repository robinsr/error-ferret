export const CODE_PLACEHOLDER = `// Paste your code here...
// Example:
function calculateSum(a, b) {
    return a + b;
}

// The AI will review this code and provide feedback`;

export const SUPPORTED_LANGUAGES = [
    { value: 'auto-detect', label: 'Auto-detect' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' }
];

export const REVIEW_FOCUS_OPTIONS = [
    { value: 'general', label: 'General review' },
    { value: 'performance', label: 'Performance' },
    { value: 'maintainability', label: 'Maintainability' },
    { value: 'clarity', label: 'Clarity' },
    { value: 'idiomatic_usage', label: 'Idiomatic Usage' },
    { value: 'security', label: 'Security' },
];

export const EXPERIENCE_LEVEL_OPTIONS = [
    { value: 'novice', label: 'Novice' },
    { value: 'apprentice', label: 'Apprentice' },
    { value: 'experienced', label: 'Experienced' },
    { value: 'professional', label: 'Professional' },
    { value: 'expert', label: 'Expert' },
]


export const MAX_FEEDBACK_ITEMS = 8;

export const MAX_TOKENS = 10000;
export const TEMPERATURE = 0.3;

// Configures how many lines of code around the feedback item to include in the snippet
export const SNIPPET_LINES_BEFORE = 4;
export const SNIPPET_LINES_AFTER = 6;

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