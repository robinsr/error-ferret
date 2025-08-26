export type Severity = 'info' | 'warn' | 'error';

export interface FeedbackItem {
  line: number;
  column: number;
  code_snippet: string;
  issue: string;
  suggestion: string;
  severity: Severity;
  persona?: string;
}

export interface CreateReviewRequest {
  // later: selected reviewers, etc.
  filenames?: string[];
}

export interface CreateReviewResponse {
  reviewId: string;
}

export interface SubmitReviewRequest {
  reviewId: string;
  // later: file keys, etc.
}

export interface ReviewStatus {
  reviewId: string;
  status: 'pending' | 'processing' | 'complete' | 'failed';
  items?: FeedbackItem[];
  error?: string;
}