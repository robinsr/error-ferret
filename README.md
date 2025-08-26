# Error Ferret

_Error Ferret_ is an AI-powered code review tool.  
Paste your code, pick a few ferret reviewers, and get line-by-line feedback in seconds.

Behind the whiskers: this project demonstrates a modern, multi-component JavaScript stack (React SPA, Fastify API, NATS worker pipeline) integrated with OpenAI’s GPT models.

---

## Features

- 🦦 **AI-Powered Reviews** – Feedback from OpenAI GPT models, structured as line-by-line issues and suggestions.
- 🎯 **Focused Perspectives** – Choose from different ferret “reviewers” (security, performance, clarity, etc.).
- 🗂 **Multi-File Support** – Upload multiple code files; results are aggregated into a single review.
- ⚡ **Queue-Backed Processing** – Reviews are enqueued and processed by workers for reliability and scalability.
- 🌐 **Modern Web UI** – React SPA served via Astro, with fast, responsive components.

---

## Architecture

Error Ferret is built as a small constellation of services:

- **apps/web** → Frontend (Astro + React). Renders the UI and calls the API.
- **apps/api** → Fastify service. Handles review creation, presigned uploads, and enqueues jobs to NATS JetStream.
- **apps/worker** → NATS consumer. Processes queued reviews, runs LLM prompts, posts results back.
- **packages/types** → Shared TypeScript interfaces and schemas.

Infrastructure notes:
- NATS JetStream + KEDA (for worker autoscaling).
- Postgres (planned) for persistent reviews.
- Object storage (R2/S3) for uploaded files.

---

## Development

Requirements:
- Node.js 20+
- pnpm 10+
- Docker (for local NATS)

```bash
# install dependencies
pnpm install

# start NATS locally
docker compose up -d nats

# run everything in parallel
pnpm dev

# or run one app at a time
pnpm --filter @errorferret/web dev
pnpm --filter @errorferret/api dev
pnpm --filter @errorferret/worker dev
```

By default:
- Web runs at [http://localhost:4321](http://localhost:4321)
- API runs at [http://localhost:3000](http://localhost:3000)

---

## Status

This is an active portfolio project. Current goals:
- ✅ Monorepo with pnpm workspaces
- ✅ API + worker queue round-trip (MVP)
- ⏳ Add database persistence
- ⏳ Expand persona-based reviewer prompts
- ⏳ Kubernetes deployment manifests

---

## License

MIT. Built for fun, learning, and ferret-approved code quality.
