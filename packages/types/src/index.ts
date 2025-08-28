import type { ReviewerProfile, ReviewerFocus } from '@errorferret/reviewers';

//
// Data Models - Code Reviews
//

export type Review = {
  id: string;
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
  code: string;
}

// User submits code via the text editor, we get the raw code as a string
export type ReviewArtifactRaw = {
  type: 'raw';
  code: string;
}


//
// Data Models - Feedback
//

/* {
  comment: "Do logging throughout the code, remove debug logging",
  severity: "high",
  reviewer: {
    name: "Gen",
    title: "Generalist",
    focus: "general",
    imageUrl: "images/ferret_gen_avatar_4.jpg"
  },
  location: {
    filename: "app/controllers/users_controller.rb",
    lineNumber: 10
  },
  context: {
    filename: "app/controllers/users_controller.rb",
    lines: [
      { lineNumber: 6, code: "class ApplicationController < ActionController::Base" },
      { lineNumber: 7, code: "class ApplicationController < ActionController::Base" },
      { lineNumber: 8, code: "class UsersController < ApplicationController" },
      { lineNumber: 9, code: "def index" },
      { lineNumber: 10, code: "def index" },
      { lineNumber: 11, code: "def show" },
      { lineNumber: 12, code: "def create" }
    ]
  }
} */

export type ReviewFeedbackSource = Pick<ReviewerProfile, 'name' | 'title' | 'focus' | 'imageUrl'>

export type ReviewFeedbackItem = {
  comment: string;
  severity: ReviewItemSeverity
  reviewer: ReviewFeedbackSource;
  location: TextFileLocation;
  context: FeedbackContext;
}

export type ReviewItemSeverity = 'low' | 'medium' | 'high';

export type FeedbackContext = {
  filename?: string;
  lines: FeedbackContextLine[]
}

export type FeedbackContextLine = {
  lineNumber: number;
  code: string;
}

export type TextFileLocation = {
  lineNumber: number;
  columnNumber?: number;
  filename?: string;
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
export type LLMFeedbackItem = {
  lineNum: number;
  columnNum: number;
  code: string;
  contextLines: LLMCodeReference[];
  feedback: string;
}

/**
 * Defines the structure of the response from the feedback service
 */
// export type LLMFeedbackResponse = {
//   feedbackItems: LLMFeedbackItem[];
//   language: string;
//   focus: string;
//   timestamp: string;
// }

/**
 * Defines a reference to a line of user code, used to display the context of the feedback
 */
export type LLMCodeReference = {
  lineNum: number;
  code: string;
}

/*
// Parse the user's code into identifiable lines
{
  "file": "src/foo.ts",
  "lines": [
    {"id":"L-2c7f","n":41,"text":"const cache = new Map<string, User>();"},
    {"id":"L-88b1","n":42,"text":"export async function getUser(id: string) {"},
    ...
  ]
}
*/

export type CodeFile = {
  filename: string;
  lines: CodeLine[];
}

export type CodeLine = {
  id: string;
  num: number;
  text: string;
}