import { z } from 'zod';

const schema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  NATS_URL: z.string().default('nats://localhost:4222'),
  API_BASE: z.string().url().default('http://localhost:3000'),
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
});

const parsed = schema.parse(process.env);

export const env = {
  ...parsed,
  // mimic import.meta.env.DEV
  DEV: parsed.NODE_ENV === "development",
  // optionally add PROD/TEST if you like symmetry
  PROD: parsed.NODE_ENV === "production",
  TEST: parsed.NODE_ENV === "test",
};