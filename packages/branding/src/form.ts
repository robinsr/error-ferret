const CODE_PLACEHOLDER = `// Paste your code here...
// Example:
function calculateSum(a, b) {
    return a + b;
}`;


export const FORM = {
  CODE: {
    PASTE: {
      LABEL: "Code to Review",
      HELP: "Our trained ferrets accept code in all major languages. Paste your work below and they'll return detailed findings.",
      PLACEHOLDER: CODE_PLACEHOLDER,
    },
    UPLOAD: {
      LABEL: "Upload your code collection",
      HELP: "Upload your code collection. Our ferrets work in teams, covering every file and comparing notes.",
    }
  },
  REVIEWERS: {
    HELP: "Click to enlist ferrets for duty. Each one contributes its own sharp nose and perspective",
  }
}

export default FORM