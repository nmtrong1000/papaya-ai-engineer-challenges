# MTC-19. Deploy backend to Fly.io

## Requirement

The Express backend is deployed to Fly.io and publicly accessible at a `*.fly.dev` URL, with the Neon database connection and CORS origin configured via Fly.io secrets, and all 10 API endpoints responding correctly against the seeded data.

## Approach

Add a multi-stage `Dockerfile` to `app/backend` — the builder stage copies `prisma/` and `src/`, runs `prisma generate`, and compiles TypeScript; the runtime stage only copies `dist/` and `node_modules/`. Run `fly launch` to generate `fly.toml`, set secrets for `DATABASE_URL` and `CORS_ORIGIN`, then `fly deploy`. Update `app/backend/src/app.ts` to read `CORS_ORIGIN` from env so the live Vercel frontend is accepted alongside `http://localhost:3000`.

## Execution Steps

- [ ] Verify TypeScript builds cleanly: run `npm run build` in `app/backend` and fix any errors
- [ ] Ensure `"start": "node dist/index.js"` exists in `app/backend/package.json` scripts
- [ ] Update `app/backend/src/app.ts` to allow multiple CORS origins — `['http://localhost:3000', process.env.CORS_ORIGIN].filter(Boolean)`
- [ ] Create `app/backend/Dockerfile` — multi-stage: builder installs deps, copies prisma + src, runs `prisma generate` + `npm run build`; runtime copies dist and node_modules, exposes port 4000, runs `node dist/index.js`
- [ ] Create `app/backend/.dockerignore` — exclude node_modules, .env, src, *.md
- [ ] Install the Fly CLI if not already installed: `brew install flyctl`
- [ ] Log in to Fly: `fly auth login`
- [ ] Run `fly launch` from `app/backend` — choose app name and region, select NO when asked to deploy now
- [ ] Set `internal_port = 4000` in `fly.toml` under `[http_service]`
- [ ] Set Fly secrets: `fly secrets set DATABASE_URL="<neon-url>" CORS_ORIGIN="<placeholder>"`
- [ ] Deploy: `fly deploy` from `app/backend` and note the `*.fly.dev` URL
- [ ] Smoke test `GET /health` and `GET /tenants` against the live URL

## How to Test

```bash
curl https://<fly-url>/health
# Expected: { "status": "ok" }

curl https://<fly-url>/tenants
# Expected: JSON array with SafeGuard Insurance, HealthFirst, GovHealth
```

Open `https://<fly-url>/api-docs` in a browser — Swagger UI loads with all 10 endpoints.

Expected result: Backend is live. All 3 seeded tenants returned by `GET /tenants`. Swagger UI accessible. Health check returns `{ "status": "ok" }`.

## Time

- **In:** _(YYYY-MM-DD HH:mm:ss — filled by agent at start)_
- **Out:** _(YYYY-MM-DD HH:mm:ss — filled by agent at completion)_
- **Estimate:** 30 min
