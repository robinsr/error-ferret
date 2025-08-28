import type { Review } from '@errorferret/schemas';
import { MAX_FEEDBACK_ITEMS } from '@errorferret/constants';


export function getRulesBlock(review: Review): string {
  return `
RULES
- Do NOT count lines. Do NOT output numeric line numbers.
- Do NOT invent or guess ids. Use only the ids present in the provided lines for that file.
- Keep findings independent; no cross references between findings.
- Never propose edits that require lines not referenced in lineIds.
- Limit to at most ${MAX_FEEDBACK_ITEMS} findings per file (hard cap).
- Prefer precise, local findings over broad file-level comments.
- No markdown, no comments, no trailing commas. JSON array only.
- Choose the single best-fitting focus according to RUBRIC; if ties occur, prefer the more specific non-"general" label.
- If nothing fits, use "general" ONLY if it is present in FOCUS_AREAS; otherwise return [] (do not invent categories).
- Do NOT output any focus values not present in FOCUS_AREAS.
- SELF-CHECK: For every finding, assert focus ∈ FOCUS_AREAS.
`
}