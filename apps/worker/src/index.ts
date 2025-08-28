import { connect, StringCodec } from 'nats';
import { setTimeout as delay } from 'node:timers/promises';
import type { Review,ReviewFeedbackItem, ReviewStatus } from '@errorferret/types';

import { FERRET_REVIEWERS } from '@errorferret/reviewers';

const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222';
const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const sc = StringCodec();


const fakeFeedbackItems: ReviewFeedbackItem[] = FERRET_REVIEWERS.map(reviewer => ({
  comment: "Do logging throughout the code, remove debug logging",
  severity: "high",
  reviewer: reviewer,
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
}))

async function fakeLLM(review: Review): Promise<ReviewFeedbackItem[]> {
  // MVP: generate deterministic, obviously-fake items
  return fakeFeedbackItems
}

async function onPendingReview(review: Review): Promise<Review> {
  console.log('processing', review.id);

  // simulate processing
  await delay(2000);

  const items = await fakeLLM(review);

  review.feedback = items;
  review.status = 'complete';

  return review;
}

async function run() {
  const nc = await connect({ servers: NATS_URL });
  const sub = nc.subscribe('reviews.pending', { queue: 'worker' });
  console.log('worker subscribed to reviews.pending');

  for await (const m of sub) {
    try {
      const review = JSON.parse(sc.decode(m.data)) as Review
      const result = await onPendingReview(review);

      const res = await fetch(`${API_BASE}/internal/reviews/${review.id}/complete`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(result)
      });

      if (!res.ok) {
        throw new Error(`callback failed: ${res.status}`);
      }
      console.log('completed', review.id);
    } catch (e) {
      console.error('worker error', e);
    }
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});