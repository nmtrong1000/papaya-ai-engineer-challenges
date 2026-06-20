# MTC-01. Scaffold frontend project and shared package

## Requirement

The npm workspace root at `app/` is initialised, `app/shared` exists as a bare TypeScript package with an empty barrel export, and `app/frontend` is a working Next.js App Router project with Tailwind CSS — with the `@mtc/shared` path alias configured so shared types can be imported from the frontend.

## Approach

Create the workspace root `app/package.json` first, then scaffold the `app/shared` skeleton (package.json + tsconfig + empty `src/index.ts`) so the workspace is coherent before running `npm install`. Scaffold `app/frontend` with `create-next-app`. Add `@mtc/shared` as a workspace dependency in the frontend and add a `paths` alias in `app/frontend/tsconfig.json` pointing to `../shared/src/index.ts`. The backend is set up independently as a separate task. `app/shared` gets its actual Zod schema content in a later task — only the skeleton is needed here.

The frontend follows a **layer-based architecture**:
- `app/` — Next.js App Router pages; thin — compose hooks and components only, no inline fetch calls
- `components/` — pure UI components; receive data via props and emit events via callbacks; no direct API calls
- `hooks/` — custom React hooks; own all data fetching, loading state, and error state; return plain data to pages
- `lib/` — typed API client (`apiFetch`) and utilities

This task only creates the scaffold; the `hooks/` and `components/` directories are populated in subsequent tasks.

## Execution Steps

- [ ] Create `app/` directory and `app/package.json` as the npm workspace root with `workspaces: ["frontend", "backend", "shared"]`
- [ ] Create `app/shared/` skeleton — `package.json` (name: `@mtc/shared`), `tsconfig.json` (strict, CommonJS, ES2020), and an empty `src/index.ts` barrel export
- [ ] Scaffold `app/frontend` with `create-next-app` (TypeScript, Tailwind, App Router, import alias `@/*`, no ESLint)
- [ ] Add `"@mtc/shared": "*"` to `app/frontend/package.json` dependencies
- [ ] Add `"@mtc/shared": ["../shared/src/index.ts"]` path alias to `app/frontend/tsconfig.json` under `compilerOptions.paths`
- [ ] Run `npm install` from `app/` root to link workspaces
- [ ] Remove Next.js boilerplate from `app/frontend/app/globals.css` — keep only the three Tailwind directives
- [ ] Replace `app/frontend/app/page.tsx` with a minimal "MTC Admin" placeholder component
- [ ] Verify `http://localhost:3000` renders without errors: `npm run dev` in `app/frontend`
- [ ] Verify `@mtc/shared` resolves — add a temporary import, run `npx tsc --noEmit` in `app/frontend`, remove the import

## How to Test

```bash
cd challenges/challenge-15-multi-tenant-config/app
npm install

cd frontend && npm run dev
# Open http://localhost:3000 — renders "MTC Admin" with no errors
```

```bash
npx tsc --noEmit
# Expected: no "Cannot find module '@mtc/shared'" error
```

Expected result: `http://localhost:3000` renders without errors. `@mtc/shared` resolves via the path alias. TypeScript compiles cleanly in `app/frontend`.

## Time

- **In:** 2026-06-20 09:35:45
- **Out:** _(YYYY-MM-DD HH:mm:ss — filled by agent at completion)_
- **Estimate:** 20 min
