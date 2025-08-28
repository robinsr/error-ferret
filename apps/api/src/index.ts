import { ReviewSchema, ReviewSubmissionSchema } from '@errorferret/schemas';

import Fastify from 'fastify';
import cors from '@fastify/cors'

import { serverError, notFound, badRequest, okCreated, okAccepted, okContent, okEmpty } from './codes';
import { createReview, getReview, isReviewExists, updateReview } from './reviews';

// The port the API server is running on (3000)
const PORT = Number(process.env.PORT || 3000);

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

  server.get('/healthz', async () => ({ ok: true }));

  // Create a review → enqueue message
  server.post('/api/reviews', async (req, reply) => {
    try {

      const parsed = ReviewSubmissionSchema.safeParse(req.body)

      if (!parsed.success) {
        return badRequest(reply, parsed.error.message);
      }

      const response = await createReview(parsed.data);

      return okCreated(reply, response);
    } catch (err) {
      return serverError(reply, err);
    }
  });

  // Submit (placeholder for when files exist)
  server.put('/api/reviews/:id/submit', async (req, reply) => {
    const id = (req.params as any).id as string;

    if (!isReviewExists(id)) {
      return notFound(reply);
    }

    // For MVP we don’t need to do anything extra.
    return okAccepted(reply, { ok: true, reviewId: id });
  });

  // Poll status
  server.get('/api/reviews/:id', async (req, reply) => {
    try {
      const id = (req.params as any).id as string;
      const review = await getReview(id);

      if (!review) {
        return notFound(reply);
      }

      return okContent(reply, review);
    } catch (err) {
      return serverError(reply, err);
    }
  });

  // allow worker to write back results (MVP, trust local)
  server.post('/internal/reviews/:id/complete', async (req, reply) => {
    try {
      const id = (req.params as any).id as string;

      if (!isReviewExists(id)) {
        return notFound(reply);
      }

      const parsed = ReviewSchema.safeParse(req.body)

      if (!parsed.success) {
        return badRequest(reply, parsed.error.message);
      }

      await updateReview(id, { ...parsed.data, id });

      return okEmpty(reply);
    } catch (err) {
      return serverError(reply, err);
    }
  });

  server.listen({ port: PORT, host: '0.0.0.0' });
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});