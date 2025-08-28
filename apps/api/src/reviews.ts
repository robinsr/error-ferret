import type {
  Review,
  ReviewStatus,
  ReviewFeedback,
  ReviewSubmission,
  CreateReviewResponse
} from "@errorferret/schemas";

import { randomUUID } from 'node:crypto';
import { connect, StringCodec } from 'nats';

// The URL for the NATS server (messaging later)
const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222';

// NATS is the messaging layer
const nc = await connect({
  servers: NATS_URL
});

const sc = StringCodec();

function encodeMessage(message: any) {
  return sc.encode(JSON.stringify(message));
}

// naive in-memory store for MVP.
const reviews = new Map<string, Review>();


export async function createReview(submission: ReviewSubmission): Promise<CreateReviewResponse> {
  const id = randomUUID();
  const status: ReviewStatus = 'creating';
  const feedback: ReviewFeedback[] = [];
  const review: Review = { id, status, submission, feedback }

  await nc.publish('reviews.pending', encodeMessage(review));

  reviews.set(id, review);

  return { reviewId:id };
}

export function getReview(reviewId: string): Review {
  if (reviews.has(reviewId)) {
    return reviews.get(reviewId)!
  } else {
    return {
      id: reviewId,
      status: 'idle',
      submission: { reviewers: [], artifacts: [] },
      feedback: []
    }
  }
}

export function isReviewExists(reviewId: string): boolean {
  return reviews.has(reviewId);
}

export function updateReview(reviewId: string, review: Review): void {
  reviews.set(reviewId, review);
}