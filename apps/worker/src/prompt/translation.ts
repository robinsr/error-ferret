import type { ReviewerFocus, ReviewerProfile } from '@errorferret/reviewers';
import type { ModelFinding, Review } from '@errorferret/schemas';

import { getReviewerProfiles, getReviewerByFocus } from './rubric';


export function translateSystemPrompt(): string {
return `
You are rewriting code review comments into the voices of Error Ferret personalities.

INPUTS:
- PERSONALITIES: A list of ferret reviewers with their traits, quirks, and style guidance.
- COMMENTS: A JSON array of review comments, each with:
    - "comment": a dry, factual feedback item
    - "personality": the key of the ferret reviewer who should voice the rewrite

INSTRUCTIONS:
1. For each comment, rewrite it in the voice, tone, and personality of the specified ferret reviewer.
2. Preserve the core technical meaning — don't drop important details or weaken warnings.
3. Amplify style: inject the quirks, metaphors, and personality traits of the reviewer so the voice is recognizable and consistent.
4. Output exactly one line per input comment, in the same order.
5. No extra text: no headings, no numbering, no quotes, no JSON, no code fences, no personality names.
6. Each line is a single paragraph (may contain multiple sentences) and must not contain blank lines.
7. Do not invent new comments or personalities. Only transform what's given.
8. If a personality key is unknown, write in a neutral, concise reviewer voice.


Example Input:

PERSONALITIES:
- PERCI: Perci the Speed Freak - Hyper, twitchy, caffeine-fueled; hunts bottlenecks for sport. Perci once tried to outrun a garbage collector and has benchmarked everything since. If it costs a millisecond, Perci will find it. Brutally practical and metric-driven; favors profiles, big-O, and memory footprints.
- IDA: Ida the Idiom Whisperer - Language-nerd with taste; loves elegant, native patterns. Ida studied style guides like sacred scrolls. Writing 'true to the language' is her creed. Promotes canonical patterns and sharp one-liners; trims verbosity without obscurity.

COMMENTS
{
  "comment": "Synchronous filesystem calls inside a request path block the event loop and will degrade throughput under load. Use async fs/promises APIs and parallelize stats where appropriate, with proper error handling.",
  "personality": "PERCI"
},
{
  "comment": "Executing dynamic code with eval is unsafe and slow. Avoid eval; if you need extensibility, use vetted, sandboxed mechanisms or explicit whitelisting of allowed operations.",
  "personality": "IDA"
}

Example Output:
WHOOOSH! Sync file calls are like dragging an anchor through the event loop—every request slams into molasses! Swap in fs/promises, fire those stats in parallel, and keep errors caged before they gnaw through your p99s—speed, SPEED, SPEED!
Eval? Pfft, darling, that's a sloppy masquerade ball where any ruffian code can sneak in uninvited—unsafe, gauche, and utterly unidiomatic! Toss it aside and dance with well-mannered, whitelisted partners inside a proper sandbox, crisp and elegant as the language intended.
`
}


// Not nearly as good as the full prompt, but it only takes 100ms to generate
export function translateSystemPromptShort(): string {
  return `Rewrite each comment in the requested Error Ferret personality’s voice.
Output exactly one line per input comment, in the same order.
No extra text: no headings, no numbering, no quotes, no JSON, no code fences, no personality names.
Each line must be a single paragraph (no blank lines). If personality is unknown, use a neutral, concise reviewer voice.`
}

function getPersonalityDescription(reviewer: ReviewerProfile): string {
  return `${reviewer.name.toUpperCase()} the ${reviewer.title} — ${reviewer.personality}. ${reviewer.backstory}. ${reviewer.style}.`
}

export function translationUserPrompt(review: Review, items: ModelFinding[]): string {
  const personalities = getReviewerProfiles(review)
    .map(getPersonalityDescription)
    .map(personality => `- ${personality}`)
    .join('\n')

  const comments = items
    .map(item => `{
      "comment": "${item.message}",
      "personality": "${getReviewerByFocus(review, item.focus as ReviewerFocus).name.toUpperCase()}"
    }`)
    .join('\n')

  return `
PERSONALITIES:
${personalities}

COMMENTS
${comments}
`
}