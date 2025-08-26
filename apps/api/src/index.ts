import Fastify from 'fastify';
import cors from '@fastify/cors'
import { connect, StringCodec } from 'nats';
import { randomUUID } from 'node:crypto';
import type { CreateReviewResponse, ReviewStatus } from '@errorferret/types';


// The port the API server is running on (3000)
const PORT = Number(process.env.PORT || 3000);

// The URL for the NATS server (messaging later)
const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222';

// naive in-memory store for MVP.
const reviews = new Map<string, ReviewStatus>();

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

  server.get('/healthz', async () => ({ ok: true }));

  // Create a review → enqueue message
  server.post('/api/reviews', async (req, reply) => {
    const reviewId = randomUUID();
    reviews.set(reviewId, { reviewId, status: 'pending' });

    const payload = { reviewId };
    await nc.publish('reviews.pending', sc.encode(JSON.stringify(payload)));

    const res: CreateReviewResponse = { reviewId };
    return reply.code(201).send(res);
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
    const status = reviews.get(id);
    if (!status) return reply.code(404).send({ error: 'not_found' });
    return reply.send(status);
  });

  // allow worker to write back results (MVP, trust local)
  server.post('/internal/reviews/:id/complete', async (req, reply) => {
    const id = (req.params as any).id as string;
    if (!reviews.has(id)) return reply.code(404).send({ error: 'not_found' });
    const body = (req.body ?? {}) as Omit<ReviewStatus, 'reviewId'>;
    reviews.set(id, { reviewId: id, ...body });
    return reply.send({ ok: true });
  });

  server.listen({ port: PORT, host: '0.0.0.0' });
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});