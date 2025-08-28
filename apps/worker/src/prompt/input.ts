import type { Review } from '@errorferret/schemas';


export function getInputBlock(review: Review): string {
  return `
INPUT FORMAT
- You will receive one or more FILE blocks.
- Each FILE block contains:
  - file: string (path)
  - lines: array of objects in original order, each with:
      { "id": string, "n": number, "text": string }
    - id: stable opaque identifier for this line (e.g., "L-88b1"). Use ONLY this for references.
    - n: advisory display line number. Do NOT use for counting or referencing.
    - text: the exact line content (may be empty).
- Lines are in order and represent the exact snapshot of the file. Never reorder lines.
- You will be given FOCUS_AREAS: a closed set of category labels, e.g. ["general","security","correctness","performance","readability","testing","style"].
- Also optionally a short RUBRIC describing each focus.
`
}