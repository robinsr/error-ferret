# Error Ferret

_Error Ferret_ is an AI-powered code review tool.
Paste your code, pick a few ferret reviewers, and get line-by-line feedback in seconds.

Behind the whiskers: this project demonstrates a modern, multi-component JavaScript stack (React SPA, Fastify API, NATS worker pipeline) integrated with OpenAI’s GPT models. The repository is organized as a **pnpm monorepo** with shared packages and multiple apps.

---

## Monorepo Layout

```
apps/
  api/      # Fastify API (review creation, enqueue to NATS)
  app/      # React SPA (code submission + feedback UI)
  web/      # Astro site (landing, team page, serves SPA at /app)
  worker/   # NATS consumer, runs LLM calls, posts results back
packages/
  branding/   # shared UI strings, slogans
  constants/  # general constants (routes, limits, etc.)
  reviewers/  # ferret reviewer definitions
  types/      # shared TypeScript types & schemas
  env-node/   # server-side env loader/validator (zod)
  ui-react/   # shared React UI components (ported from Astro)
```

Shared packages are imported with `@errorferret/*` and linked via `workspace:*` in package.json.

---

## Features

- 🦦 **AI-Powered Reviews** – Feedback from OpenAI GPT models, structured as line-by-line issues and suggestions.
- 🎯 **Focused Perspectives** – Choose from different ferret “reviewers” (security, performance, clarity, etc.).
- 🗂 **Multi-File Support** – Upload multiple code files; results are aggregated into a single review.
- ⚡ **Queue-Backed Processing** – Reviews are enqueued and processed by workers for reliability and scalability.
- 🌐 **Hybrid Frontend** – React SPA mounted under Astro site for UI; shared React components across both.

---

## Development

### Requirements
- Node.js 20+
- pnpm 10+
- Docker (for local NATS)

### Install & Run

```bash
# install all deps
pnpm install

# start NATS locally
docker compose up -d nats

# dev mode: run api, worker, web (Astro), app (React) together
pnpm dev

# or run individually
pnpm dev:api
pnpm dev:worker
pnpm dev:web
pnpm dev:app
```

- Astro site → [http://localhost:4321](http://localhost:4321)
- React SPA → served under [http://localhost:4321/app](http://localhost:4321/app) (proxy in dev, static in prod)
- API → [http://localhost:3000](http://localhost:3000)

### Build

```bash
pnpm build
pnpm build:site   # builds SPA and copies to web/public/app for serving under /app
```

---

## System Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                               Client (Browser)                              │
│   Astro site (/ , /team)                        React SPA (/app, /app/*)    │
│   @errorferret/web                              @errorferret/app            │
└───────────────▲───────────────────────────────────────────────▲─────────────┘
                │                                               │
                │ 1) Create review (POST /api/reviews)          │ 2) Poll status (GET /api/reviews/:id)
                │                                               │
                │                                               │
        ┌───────┴───────────────────────────────────────────────┴───────┐
        │                       Fastify API (3000)                       │
        │                        @errorferret/api                         │
        │  - Validates request                                           │
        │  - Creates in-mem/DB review record (pending)                   │
        │  - Enqueues to NATS JetStream: subject `reviews.pending`       │
        │  - Exposes:                                                    │
        │      POST  /api/reviews                                        │
        │      GET   /api/reviews/:id                                    │
        │      POST  /internal/reviews/:id/complete  (worker callback)   │
        └───────────┬────────────────────────────────────────────────────┘
                    │ 3) Publish (enqueue)
                    ▼
            ┌──────────────────────┐
            │    NATS JetStream    │
            │  subject: reviews.*  │
            │  stream/retention    │
            └───────────┬──────────┘
                        │ 4) Consume next job
                        ▼
            ┌────────────────────────────┐
            │  Worker (long-lived)       │
            │  @errorferret/worker       │
            │  - Subscribes queue group  │
            │    to `reviews.pending`    │
            │  - env via @errorferret/   │
            │    env-node (OPENAI key)   │
            │  - Runs LLM pipeline:      │
            │      1) fetch plain fbk    │
            │      2) add ferret voice   │
            └───────────┬────────────────┘
                        │ 5) Callback with results
                        ▼
        ┌─────────────────────────────────────────────────────────────────┐
        │                 Fastify API (internal callback)                 │
        │     POST /internal/reviews/:id/complete → status: complete      │
        │     (writes results to in-mem → later Postgres/Prisma)          │
        └───────────────────▲─────────────────────────────────────────────┘
                            │ 6) GET /api/reviews/:id
                            │    returns { status, items[] }
                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                               Client (Browser)                              │
│     SPA updates UI when status === "complete" and renders feedback items    │
└─────────────────────────────────────────────────────────────────────────────┘


[Future / Optional Integrations]

  • Object Storage (S3/R2)
      - API issues presigned URLs for uploads
      - Worker reads from object storage
  • Database (Postgres + Prisma)
      - API persists reviews & feedback
      - SPA can fetch historical reviews
  • KEDA (Kubernetes)
      - Scales workers based on JetStream lag
  • Observability
      - Logs/metrics from API & worker
```

---

## Status

This is an active portfolio project. Current goals:
- ✅ Split into monorepo with pnpm workspaces
- ✅ Migrate UI components to React and share via `@errorferret/ui-react`
- ✅ Serve SPA bundle via Astro site at `/app`
- ✅ Extract env handling to `@errorferret/env-node`
- ⏳ Add DB persistence (Postgres/Prisma)
- ⏳ Kubernetes manifests (NATS JetStream, KEDA, autoscaling)
- ⏳ More ferret personalities

---

## License

MIT. Built for fun, learning, and ferret-approved code quality.
