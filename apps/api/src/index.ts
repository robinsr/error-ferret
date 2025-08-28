import type { CreateReviewRequest, CreateReviewResponse, Review } from '@errorferret/types';

import Fastify from 'fastify';
import cors from '@fastify/cors'
import { connect, StringCodec } from 'nats';
import { randomUUID } from 'node:crypto';


// The port the API server is running on (3000)
const PORT = Number(process.env.PORT || 3000);

// The URL for the NATS server (messaging later)
const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222';

// naive in-memory store for MVP.
const reviews = new Map<string, Review>();

const start = async () => {

  // Create the fastify server
  const server = Fastify({
    logger: true
  });

  // Register CORS to allow local dev
  await server.register(cors, {
    origin: ['http://localhost:4321', 'http://localhost:4322'],
    methods: ['GET','POST','PUT','OPTIONS']
  });


  // NATS is the messaging layer
  const nc = await connect({
    servers: NATS_URL
  });

  const sc = StringCodec();

  const createReview = async (request: CreateReviewRequest): Promise<CreateReviewResponse> => {
    const id = randomUUID();
    const review: Review = {
      id,
      status: 'creating',
      submission: request,
      feedback: []
    }

    await nc.publish('reviews.pending', sc.encode(JSON.stringify(review)));

    reviews.set(id, review);

    return { reviewId:id };
  }

  const getReview = async (reviewId: string): Promise<Review> => {
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

  const updateReview = async (reviewId: string, review: Review) => {
    reviews.set(reviewId, review);
  }

  server.get('/healthz', async () => ({ ok: true }));

  // Create a review → enqueue message
  server.post('/api/reviews', async (req, reply) => {
    try {
      const response = await createReview(req.body as CreateReviewRequest);
      return reply.code(201).send(response);
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: 'internal_server_error' });
    }
  });

  // Submit (placeholder for when files exist)
  server.put('/api/reviews/:id/submit', async (req, reply) => {
    const id = (req.params as any).id as string;
    if (!reviews.has(id)) return reply.code(404).send({ error: 'not_found' });
    // For MVP we don’t need to do anything extra.
    return reply.code(202).send({ ok: true, reviewId: id });
  });

  // Poll status
  server.get('/api/reviews/:id', async (req, reply) => {
    const id = (req.params as any).id as string;

    try {
      const review = await getReview(id);
      return reply.send(review);
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: 'internal_server_error' });
    }
  });

  // allow worker to write back results (MVP, trust local)
  server.post('/internal/reviews/:id/complete', async (req, reply) => {
    const id = (req.params as any).id as string;

    if (!reviews.has(id)) {
      return reply.code(404).send({ error: 'not_found' });
    }

    const updatedReview = (req.body ?? {}) as Review

    await updateReview(id, { ...updatedReview, id });

    return reply.send({ ok: true });
  });

  server.listen({ port: PORT, host: '0.0.0.0' });
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});