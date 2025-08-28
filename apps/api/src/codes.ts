import type { FastifyReply } from 'fastify';

export const serverError = (reply: FastifyReply, err: unknown) => {
  reply.log.error(err);

  return reply
    .code(500)
    .send({ error: 'internal_server_error' });
}

export const notFound = (reply: FastifyReply) => {
  return reply
    .code(404)
    .send({ error: 'not_found' });
}

export const badRequest = (reply: FastifyReply, details: string) => {
  return reply
    .code(400)
    .send({ details, error: 'invalid_request' });
}

export const okContent = (reply: FastifyReply, content: unknown) => {
  return reply
    .code(200)
    .send(content);
}

export const okCreated = (reply: FastifyReply, content: unknown) => {
  return reply
    .code(201)
    .send(content);
}

export const okAccepted = (reply: FastifyReply, content: unknown) => {
  return reply
    .code(202)
    .send(content);
}

export const okEmpty = (reply: FastifyReply) => {
  return reply
    .code(204)
    .send();
}