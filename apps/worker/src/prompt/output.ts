import type { Review } from '@errorferret/schemas';


export function getOutputBlock(review: Review): string {
  return `
OUTPUT FORMAT
- Return strict JSON conforming to the schema below. No explanations or prose.
- All references MUST use the provided line id values.
- When referencing multiple lines, return the list of ids in the same order they appear in the input.
- If unsure of an exact span, choose a smaller unambiguous subset of lines or a single line.
- Each finding must include a "focus" field whose value is exactly one of FOCUS_AREAS.

SCHEMA
FerretFinding = {
  "file": string,                // must match an input file
  "lineIds": string[],           // 1..k ids from the provided lines of that file
  "severity": "low"|"medium"|"high", // severity of the finding
  "focus": Focus,                // EXACTLY one from FOCUS_AREAS
  "message": string,             // concise guidance
  "codeQuote": string            // short exact excerpt; must be substring of the concatenated selected lines
}

Return: FerretFinding[]
`
}