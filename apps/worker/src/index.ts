import { connect, StringCodec } from 'nats';
import { setTimeout as delay } from 'node:timers/promises';
import type { FeedbackItem, ReviewStatus } from '@errorferret/types';

const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222';
const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const sc = StringCodec();

async function fakeLLM(reviewId: string): Promise<FeedbackItem[]> {
  // MVP: generate deterministic, obviously-fake items
  return [
    {
      line: 1,
      column: 1,
      code_snippet: "const x = 1;",
      issue: "Example issue",
      suggestion: "Example suggestion",
      severity: "info",
      persona: "plain"
    }
  ];
}

async function run() {
  const nc = await connect({ servers: NATS_URL });
  const sub = nc.subscribe('reviews.pending', { queue: 'worker' });
  console.log('worker subscribed to reviews.pending');

  for await (const m of sub) {
    try {
      const msg = JSON.parse(sc.decode(m.data)) as { reviewId: string };
      const { reviewId } = msg;
      console.log('processing', reviewId);

      // simulate processing
      await delay(200);
      const items = await fakeLLM(reviewId);

      const complete: Omit<ReviewStatus, 'reviewId'> = {
        status: 'complete',
        items
      };

      const res = await fetch(`${API_BASE}/internal/reviews/${reviewId}/complete`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(complete)
      });

      if (!res.ok) throw new Error(`callback failed: ${res.status}`);
      console.log('completed', reviewId);
    } catch (e) {
      console.error('worker error', e);
    }
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});