# MTC-22. Remove shared package — inline types into each app and deploy independently

## Requirement

The `app/shared/` package is eliminated. All types, schemas, and constants it exported are duplicated into `app/frontend/` and `app/backend/` independently. Each app is self-contained, has its own `package.json` with no workspace dependencies, and deploys without needing sibling directories. Vercel no longer clones the backend source; Fly.io no longer needs the frontend source.

## Approach

Copy shared content into each consumer: backend gets the Zod schemas (for runtime validation), all constants, and error codes in `src/schemas/` and `src/constants.ts`; frontend gets the same schemas (for form types), constants (for dropdowns/labels), and error codes in `lib/schemas/` and `lib/constants.ts`. Remove all `@mtc/shared` imports and replace with local paths. Then remove `app/shared/`, flatten `app/package.json` to a simple root with no workspaces, and update the Dockerfile and `vercel.json` to install from each app's own directory.

## Execution Steps

- [x] Copy `app/shared/src/schemas/` into `app/backend/src/schemas/` and `app/shared/src/constants.ts` into `app/backend/src/constants.ts`; update all backend imports from `@mtc/shared` to local relative paths
- [x] Copy `app/shared/src/schemas/` into `app/frontend/lib/schemas/` and `app/shared/src/constants.ts` into `app/frontend/lib/constants.ts`; update all frontend imports from `@mtc/shared` to local relative paths
- [x] Remove `"@mtc/shared": "*"` from `app/backend/package.json` and `app/frontend/package.json` dependencies; remove `zod` from shared (it stays as a direct dep in each app)
- [x] Remove `app/shared/` directory entirely
- [x] Update `app/package.json` — remove `workspaces` field and `shared` entry; or delete `app/package.json` and `app/package-lock.json` entirely and give each app its own lock file
- [x] Update `app/backend/tsconfig.json` — remove `"@mtc/shared"` path alias
- [x] Update `app/frontend/tsconfig.json` — remove `"@mtc/shared"` path alias; add `"@/lib/schemas/*": ["./lib/schemas/*"]` if needed
- [x] Update `app/backend/Dockerfile` — change `COPY package*.json ./` to copy only `backend/package.json`; run `npm install` (not `npm ci` from workspace root); remove all shared-related COPY steps
- [x] Update `app/frontend/vercel.json` — change `installCommand` from `cd .. && npm install` to `npm install`
- [x] Run `npm run build` in `app/backend` and `npm run build` in `app/frontend` — both must compile clean
- [ ] Redeploy backend: `fly deploy --config backend/fly.toml --local-only` from `app/backend/`
- [ ] Redeploy frontend: `vercel --prod` from `app/frontend/`

## How to Test

```bash
cd challenges/challenge-15-multi-tenant-config/app/backend
npm install && npm run build
# Expected: no errors, no @mtc/shared references

cd ../frontend
npm install && npm run build
# Expected: no errors, no @mtc/shared references

grep -r "@mtc/shared" app/
# Expected: no results
```

Expected result: No `app/shared/` directory. No `@mtc/shared` import anywhere. Both apps install and build independently. Both deploy without needing sibling directories. Vercel only clones frontend files.

## Time

- **In:** 2026-06-20 23:20:00
- **Out:** _(YYYY-MM-DD HH:mm:ss — filled by agent at completion)_
- **Estimate:** 60 min
