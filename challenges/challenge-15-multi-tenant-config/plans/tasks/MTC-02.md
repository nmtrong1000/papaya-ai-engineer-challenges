# MTC-02. Scaffold backend project

## Requirement

`app/backend` is a working Express + TypeScript project with `ts-node-dev` hot reload, connected to the `app/shared` workspace package via a path alias, and serving a health check response on port 4000.

## Approach

Create `app/backend` as an npm workspace member. Install Express and its type definitions along with TypeScript tooling (`ts-node-dev`, `tsconfig-paths`). Configure `tsconfig.json` with a `paths` alias pointing `@mtc/shared` at `../shared/src/index.ts` — the same alias pattern used by the frontend so both consumers resolve shared types identically. Create a minimal `src/index.ts` that starts the server and a `src/app.ts` that wires the Express app with JSON body parser, CORS (`origin: 'http://localhost:3000'`), and the `/health` route. Verify both that the server starts and that the shared package import resolves cleanly.

The backend uses a **three-layer architecture**: Routes (path definitions only) → Controllers (HTTP request/response) → Services (business logic) → Repositories (Prisma data access). Utilities live in `src/lib/`. This task only creates the app shell; layer directories are populated in subsequent tasks.

## Execution Steps

- [ ] Create `app/backend/package.json` — name: `@mtc/backend`, scripts: `dev` (ts-node-dev with tsconfig-paths), `build` (tsc), `start` (node dist/index.js); deps: express, cors, @mtc/shared; devDeps: TypeScript tooling, ts-node-dev, tsconfig-paths, @types/express, @types/cors, @types/node
- [ ] Create `app/backend/tsconfig.json` — target ES2020, CommonJS, outDir: dist, strict, esModuleInterop, and `"@mtc/shared": ["../shared/src/index.ts"]` in paths
- [ ] Create `app/backend/src/app.ts` — Express app with JSON body parser, CORS (origin: `http://localhost:3000`), and `GET /health` → `{ status: 'ok' }`; export the app
- [ ] Create `app/backend/src/index.ts` — import the app and listen on `PORT` (default 4000)
- [ ] Run `npm install` from `app/` root to link the new workspace member
- [ ] Verify the backend starts and `GET /health` returns `{ "status": "ok" }`
- [ ] Verify `@mtc/shared` resolves — add a temporary import, run `npx tsc --noEmit` in `app/backend`, remove the import

## How to Test

```bash
cd challenges/challenge-15-multi-tenant-config/app
npm install

cd backend && npm run dev
# Expected: "Backend running on port 4000"
```

```bash
curl http://localhost:4000/health
# Expected: { "status": "ok" }
```

```bash
cd challenges/challenge-15-multi-tenant-config/app/backend
npx tsc --noEmit
# Expected: no errors
```

Expected result: Server starts on port 4000. `GET /health` returns `{ "status": "ok" }`. `@mtc/shared` resolves without error. TypeScript compiles cleanly.

## Time

- **In:** _(YYYY-MM-DD HH:mm:ss — filled by agent at start)_
- **Out:** _(YYYY-MM-DD HH:mm:ss — filled by agent at completion)_
- **Estimate:** 20 min
