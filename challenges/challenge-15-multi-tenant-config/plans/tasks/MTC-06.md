# MTC-06. Define API contract as OpenAPI specification

## Requirement

The full OpenAPI 3.0 specification for all 10 backend endpoints is written in `app/backend/src/docs/` and served at `GET /api-docs` via Swagger UI — before any route handler is implemented.

## Approach

Install `swagger-jsdoc` and `swagger-ui-express`. Write all `@swagger` JSDoc annotations in dedicated `*.docs.ts` files (no route logic, spec only). Mount Swagger UI in `app.ts` at `/api-docs` — it serves the complete spec before any route is implemented. The spec is the source of truth: the frontend uses it to know what endpoints exist and what shapes to send/receive; route implementations in later tasks must match it exactly.

**Endpoints to specify (10 total):**
- `GET /health`, `GET /tenants`, `POST /tenants`, `GET /tenants/:id`, `PUT /tenants/:id`, `DELETE /tenants/:id`
- `GET /tenants/:id/versions`, `POST /tenants/:id/rollback/:version`
- `POST /tenants/:id/process-claim`

## Execution Steps

- [x] Install `swagger-jsdoc` and `swagger-ui-express` in `app/backend`, and their `@types` devDependencies
- [x] Create `app/backend/src/docs/swaggerConfig.ts` — swagger-jsdoc options with OpenAPI 3.0 definition (title: MTC Backend API, server: http://localhost:4000) and glob `apis: ['./src/docs/*.docs.ts']`; export `swaggerSpec`
- [x] Create `app/backend/src/docs/tenants.docs.ts` — `@swagger` JSDoc for GET/POST /tenants, GET/PUT/DELETE /tenants/:id, and component schemas: TenantSummary, TenantDetail, TenantConfig, BrandingInput, ClaimTypeConfig, ApprovalTier, Notification, CustomField
- [x] Create `app/backend/src/docs/versions.docs.ts` — `@swagger` JSDoc for GET /tenants/:id/versions and POST /tenants/:id/rollback/:version, and component schema: VersionSummary
- [x] Create `app/backend/src/docs/processClaim.docs.ts` — `@swagger` JSDoc for POST /tenants/:id/process-claim, and component schemas: ClaimData, ProcessClaimResult
- [x] Mount Swagger UI in `app/backend/src/app.ts` at `/api-docs` using `swagger-ui-express` and the exported `swaggerSpec`
- [x] Start the backend and verify `http://localhost:4000/api-docs` loads with all 10 endpoints listed

## How to Test

```bash
cd challenges/challenge-15-multi-tenant-config/app/backend
npm run dev
```

Open `http://localhost:4000/api-docs` in a browser.

Expected result:
- Swagger UI loads without "Failed to load API definition" error
- All 10 endpoints listed under correct paths and methods
- Each endpoint shows correct request body schema and response schemas
- Component schemas visible under "Schemas" section
- `GET /health` returns `{ "status": "ok" }` when tested from Swagger UI

## Time

- **In:** 2026-06-20 11:02:52
- **Out:** 2026-06-20 11:13:49
- **Estimate:** 30 min
