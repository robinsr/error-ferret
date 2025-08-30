import type { Review, ReviewFeedback } from '@errorferret/schemas';
import { ReviewSchema } from '@errorferret/schemas'


import "@errorferret/env-node"

import { generateInitialFindings, generateStyledFeedback } from './services/openai/feedback';
import { toFeedbackItems } from './utils/mapping';
import { timeExecution } from './utils/metrics';
import { connect, StringCodec } from 'nats';


const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222';
const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const sc = StringCodec();


async function onPendingReview(review: Review): Promise<Review> {
  console.log('Processing review', JSON.stringify(review, null, 2));

  console.log("Generating initial findings...")
  const [ feedback, initialMs ] = await timeExecution(generateInitialFindings, review)
  console.log(`generateInitialFindings.durationMs=${initialMs}ms`)

  console.log("Generating styled feedback...")
  const [ styledFeedback, styledMs ] = await timeExecution(generateStyledFeedback, review, feedback)
  console.log(`generateStyledFeedback.durationMs=${styledMs}`)

  const feedbackItems = toFeedbackItems(review, styledFeedback)

  review.feedback = feedbackItems as ReviewFeedback[];
  review.status = 'complete';

  return review;
}

async function updateReview(review: Review): Promise<Review> {
  console.log(`Updating review ${review.id}, status=${review.status}`);

  const apiUrl = `${API_BASE}/internal/reviews/${review.id}`;

  const res = await fetch(apiUrl, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(review)
  });

  if (!res.ok) {
    throw new Error(`callback failed: ${apiUrl} ${res.status}`);
  }

  return review;
}

function decodeReview(data: string): Review {
  const parsed = ReviewSchema.safeParse(JSON.parse(data));

  if (!parsed.success) {
    throw new Error(`invalid review: ${parsed.error.message}`);
  }

  return parsed.data
}


async function run() {
  const nc = await connect({ servers: NATS_URL });
  const sub = nc.subscribe('reviews.pending', { queue: 'worker' });
  console.log('worker subscribed to reviews.pending');

  for await (const m of sub) {
    const review = decodeReview(sc.decode(m.data))

    try {
      await updateReview({ ...review, status: "processing" });

      const [ result, processingMs ] = await timeExecution(onPendingReview, review);

      console.log(`onPendingReview.durationMs=${processingMs}ms`)

      await updateReview({ ...result, status: "complete" });

      console.log('completed', review.id);
    } catch (e) {
      console.log('worker error', e);
      await updateReview({ ...review, status: "failed" });
    }
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});