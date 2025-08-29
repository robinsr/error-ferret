import { z } from "zod";

import { ModelFindingsSchema } from './finding';

//
// Review Status
//

export const ReviewStatusSchema = z.enum([
  'idle',
  'creating',
  'queued',
  'processing',
  'complete',
  'failed'
]);

export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;

//
// Reviewer Focus
//

export const ReviewerFocusSchema = z.enum([
  'general',
  'performance',
  'maintainability',
  'clarity',
  'idiomatic_usage',
  'security',
]);

export type ReviewerFocus = z.infer<typeof ReviewerFocusSchema>;

//
// Review Artifacts
//

export const ReviewFileArtifactSchema = z.object({
  type: z.literal('file'),
  filename: z.string(),
  code: z.string(),
});

export type ReviewFileArtifact = z.infer<typeof ReviewFileArtifactSchema>;

export const ReviewRawArtifactSchema = z.object({
  type: z.literal('raw'),
  code: z.string(),
});

export type ReviewRawArtifact = z.infer<typeof ReviewRawArtifactSchema>;

export const ReviewArtifactSchema = z.discriminatedUnion('type', [
  ReviewFileArtifactSchema,
  ReviewRawArtifactSchema,
]);

export type ReviewArtifact = z.infer<typeof ReviewArtifactSchema>;

//
// Review Feedback
//

export const ReviewFeedbackSourceSchema = z.object({
  name: z.string(),
  title: z.string(),
  focus: ReviewerFocusSchema,
  imageUrl: z.string(),
});

export type ReviewFeedbackSource = z.infer<typeof ReviewFeedbackSourceSchema>;

export const CodeLocationSchema = z.object({
  lineNumber: z.number(),
  columnNumber: z.number().optional(),
  filename: z.string().optional(),
});

export type CodeLocation = z.infer<typeof CodeLocationSchema>;

export const ReviewFeedbackContextLineSchema = z.object({
  lineNumber: z.number(),
  code: z.string(),
});

export type ReviewFeedbackContextLine = z.infer<typeof ReviewFeedbackContextLineSchema>;

export const ReviewFeedbackContextSchema = z.object({
  filename: z.string(),
  lines: z.array(ReviewFeedbackContextLineSchema),
});

export type ReviewFeedbackContext = z.infer<typeof ReviewFeedbackContextSchema>;

export const ReviewFeedbackSchema = z.object({
  reviewer: ReviewFeedbackSourceSchema,
  comment: z.string(),
  severity: z.enum(['low', 'medium', 'high']),
  location: CodeLocationSchema,
  context: ReviewFeedbackContextSchema,
});

export type ReviewFeedback = z.infer<typeof ReviewFeedbackSchema>;

//
// Review Submission
//

export const ReviewSubmissionSchema = z.object({
  reviewers: z.array(ReviewerFocusSchema),
  artifacts: z.array(ReviewArtifactSchema),
});

export type ReviewSubmission = z.infer<typeof ReviewSubmissionSchema>;

//
// Review
//

export const ReviewSchema = z.object({
  id: z.string(),
  status: ReviewStatusSchema,
  submission: ReviewSubmissionSchema,
  feedback: z.array(ReviewFeedbackSchema),
}).strict();

export type Review = z.infer<typeof ReviewSchema>;

//
// API Requests/Responses
//

export const CreateReviewRequestSchema = ReviewSubmissionSchema;

export type CreateReviewRequest = z.infer<typeof CreateReviewRequestSchema>;

export const CreateReviewResponseSchema = z.object({
  reviewId: z.string(),
});

export type CreateReviewResponse = z.infer<typeof CreateReviewResponseSchema>;