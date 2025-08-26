export const CODE_PLACEHOLDER = `// Paste your code here...
// Example:
function calculateSum(a, b) {
    return a + b;
}

// The AI will review this code and provide feedback`;

export const SUPPORTED_LANGUAGES = [
  {
    value: 'auto-detect',
    ext: '*',
    label: 'Auto-detect'
  },
  {
    value: 'javascript',
    ext: '.js',
    label: 'JavaScript'
  },
  {
    value: 'typescript',
    ext: '.ts',
    label: 'TypeScript'
  },
  {
    value: 'python',
    ext: '.py',
    label: 'Python'
  },
  {
    value: 'java',
    ext: '.java',
    label: 'Java'
  },
  {
    value: 'cpp',
    ext: '.cpp',
    label: 'C++'
  },
  {
    value: 'csharp',
    ext: '.cs',
    label: 'C#'
  },
  {
    value: 'go',
    ext: '.go',
    label: 'Go'
  },
  {
    value: 'rust',
    ext: '.rs',
    label: 'Rust'
  },
  {
    value: 'php',
    ext: '.php',
    label: 'PHP'
  },
  {
    value: 'ruby',
    ext: '.rb',
    label: 'Ruby'
  },
  {
    value: 'swift',
    ext: '.swift',
    label: 'Swift'
  },
  {
    value: 'kotlin',
    ext: '.kt',
    label: 'Kotlin'
    }
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