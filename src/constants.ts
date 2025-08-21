export const CODE_PLACEHOLDER = `// Paste your code here...
// Example:
function calculateSum(a, b) {
    return a + b;
}

// The AI will review this code and provide feedback`;

export const SUPPORTED_LANGUAGES = [
    { value: '', label: 'Auto-detect' },
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
    { value: '', label: 'General review' },
    { value: 'security', label: 'Security' },
    { value: 'performance', label: 'Performance' },
    { value: 'readability', label: 'Readability' },
    { value: 'best-practices', label: 'Best Practices' },
    { value: 'testing', label: 'Testing' }
];
