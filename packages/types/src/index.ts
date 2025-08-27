import type { ReviewerProfile, ReviewerFocus } from '@errorferret/reviewers';

//
// Data Models - Code Reviews
//

export type Review = {
  reviewId: string;
  status: ReviewStatus;
  submission: ReviewSubmission;
  feedback: ReviewFeedbackItem[];
}

export type ReviewStatus = 'idle' | 'creating' | 'queued' | 'processing' | 'complete' | 'failed';

export type ReviewSubmission = {
  reviewers: ReviewerFocus[];
  artifacts: ReviewArtifact[];
}

export type ReviewArtifact = ReviewArtifactFile | ReviewArtifactRaw;

// User submits review with file uploads, we get the file metadata
export type ReviewArtifactFile = {
  type: 'file';
  filename: string;
  objectId: string;
  language: string;
}

// User submits code via the text editor, we get the raw code as a string
export type ReviewArtifactRaw = {
  type: 'raw';
  code: string;
}


//
// Data Models - Feedback
//

export type ReviewItemSeverity = 'low' | 'medium' | 'high'

export type ReviewFeedbackSource = Pick<ReviewerProfile, 'name' | 'title' | 'focus' | 'imageUrl'>

export type ReviewFeedbackItem = {
  line: number;
  column: number;
  code_snippet: string;
  comment: string;
  severity: ReviewItemSeverity;
  reviewer: ReviewFeedbackSource;
}

//
// Create Review API
//

// POST /api/reviews
export type CreateReviewRequest = ReviewSubmission;

// POST /api/reviews -> 201 Created
export type CreateReviewResponse = {
  reviewId: string;
}

// GET /api/reviews/{reviewId}
export type GetReviewResponse = {
  review?: Review;
  error?: string;
}


//
// Data Models - LLM Responses
//

/**
 * Defines the structure of the response from the LLM (as described in the system prompt)
 */
export type LLMResponseItem = {
  file: string;
  line: string;
  lineNumber: number;
  reviewer: ReviewerProfile;
  feedback: string;
}

/**
 * Defines a single feedback item, parsed from the LLM response
 */
export type FeedbackItem = {
  lineNum: number;
  columnNum: number;
  code: string;
  contextLines: CodeReference[];
  feedback: string;
}

/**
 * Defines the structure of the response from the feedback service
 */
export type FeedbackResponse = {
  feedbackItems: FeedbackItem[];
  language: string;
  focus: string;
  timestamp: string;
}


/**
 * Defines a reference to a line of user code, used to display the context of the feedback
 */
export type CodeReference = {
  lineNum: number;
  code: string;
}