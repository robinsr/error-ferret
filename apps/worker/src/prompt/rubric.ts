import type { ReviewerFocus, ReviewerProfile } from '@errorferret/reviewers';
import { FERRET_REVIEWERS } from '@errorferret/reviewers';
import type { Review } from '@errorferret/schemas';



/**
 * Fetches the full reviewer profiles from an array of focus values (eg: ['general', 'performance'])
 *
 * @param review
 * @returns an array of ReviewerProfile objects
 */
export function getReviewerProfiles(review: Review): ReviewerProfile[] {
  return review.submission.reviewers
    .map(reviewerId => FERRET_REVIEWERS.find(r => r.focus === reviewerId))
    .filter(r => r !== undefined) as ReviewerProfile[];
}

export function getReviewerByFocus(review: Review, focus: ReviewerFocus): ReviewerProfile {
  return getReviewerProfiles(review).find(r => r.focus === focus) as ReviewerProfile;
}

/**
 * Returns a list of focus values requested by the user
 *
 * eg: ["general", "performance", "maintainability"]
 *
 * @param review
 * @returns an array of focus values
 */
export function getFocusValueKeys(review: Review): ReviewerFocus[] {
  return getReviewerProfiles(review)
    .map(r => r.focus as ReviewerFocus);
}


/**
 * Returns a string of the focus values separated by |
 *
 * eg: "general | performance | maintainability"
 *
 * @param review
 * @returns a string of the focus values separated by |
 */
export function getFocusValueSchema(review: Review): string {
  return getFocusValueKeys(review)
    .map(key => `"${key}"`)
    .join(' | ');
}

/**
 * Returns a string of the focus values separated by newlines
 *
 * eg: "- general\n- performance\n- maintainability"
 *
 * @param review
 * @returns a string of the focus values separated by newlines
 */
export function getFocusValueList(review: Review): string {
  return getFocusValueKeys(review)
    .map(key => `- ${key}`)
    .join('\n');
}


/**
 * Descriptions of the focus values
 */
const RUBRIC_DESCRIPTIONS: Record<ReviewerFocus, string> = {
  general: "Broad observations that cut across categories, or guidance that does not clearly fit into a single specialized focus.",
  performance: "Efficiency issues—algorithmic complexity, memory/CPU overhead, unnecessary allocations, excessive I/O, or slow patterns in hot paths.",
  maintainability: "Code health over time—modularity, duplication, dead code, testability, upgrade paths, dependency management, and ease of future change.",
  clarity: "Readability and understandability—naming, structure, comments, formatting choices that affect comprehension, and reducing cognitive load for future readers.",
  idiomatic_usage: "Use of language and framework features—style that aligns with community norms, avoiding anti-patterns, preferring modern constructs, leveraging libraries/APIs as intended.",
  security: "Vulnerabilities or unsafe patterns—input validation, injection risks, secrets handling, cryptographic misuse, authentication/authorization, data exposure, race conditions with security implications.",
}


export function getRubricDescription(focus: ReviewerFocus): string {
  return RUBRIC_DESCRIPTIONS[focus as keyof typeof RUBRIC_DESCRIPTIONS];
}

export function getRubricBlock(review: Review): string {

  const bulletPoints = getFocusValueKeys(review)
    .map((focus) => {
      return `- ${focus}: ${getRubricDescription(focus)}`
    })
    .join('\n')

  return `RUBRIC:
${bulletPoints}
`
}