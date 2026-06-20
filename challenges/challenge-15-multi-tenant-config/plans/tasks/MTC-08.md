# MTC-08. Add config version history and rollback API endpoints

## Requirement

`GET /tenants/:id/versions` returns the full version history for a tenant ordered newest-first, and `POST /tenants/:id/rollback/:version` creates a new version by replaying the target snapshot — both matching the OpenAPI spec, implemented across Repository, Service, Controller, and Route layers.

## Approach

Add a `VersionRepository` for version-specific Prisma queries (list omits the `config` JSON for performance; single fetch includes it). Add a `VersionService` that handles listing and rollback logic — rollback reads the target snapshot, runs `migrateConfig()` for forward compatibility, converts it back to a `TenantConfig`, and delegates to `TenantService.saveTenantConfig()` (the same save flow used by CRUD). Rollback creates a new version and never mutates history.

## Execution Steps

- [ ] Create `app/backend/src/repositories/versionRepository.ts` — `findByTenantId` (select id/version/schemaVersion/note/createdAt, ordered newest-first, omit config) and `findByTenantAndVersion` (include config)
- [ ] Create `app/backend/src/lib/migrateConfig.ts` — `migrateConfig(raw: unknown): VersionConfig` that parses through `VersionConfigSchema`; comment marks where future version migrations would be added
- [ ] Create `app/backend/src/services/versionService.ts` — `listVersions(tenantId)` (verify tenant exists via tenantRepository, return version list) and `rollback(tenantId, targetVersion)` (fetch snapshot, migrateConfig, convert to TenantConfig, call saveTenantConfig with note "Rollback to version N", return `{ newVersion }`)
- [ ] Create `app/backend/src/controllers/versionController.ts` — `list` and `rollback` handlers; parse `req.params.version` as integer; both wrapped in try/catch → next(err)
- [ ] Create `app/backend/src/routes/versions.ts` — Router with `mergeParams: true`; GET /:id/versions and POST /:id/rollback/:version
- [ ] Mount the versions router in `app.ts`: `app.use('/tenants', versionsRouter)`
- [ ] Smoke test: list versions, update a tenant to create a second version, rollback to version 1, verify 3 versions in history and current config reflects original values

## How to Test

```bash
cd challenges/challenge-15-multi-tenant-config/app/backend
npm run dev

curl http://localhost:4000/tenants/<safeguard-id>/versions
# Expected: [{ "version": 1, "createdAt": "...", "note": null }]

# Create a second version by updating (change branding.name)
# Then list again — should show 2 versions newest-first

curl -X POST http://localhost:4000/tenants/<safeguard-id>/rollback/1
# Expected: { "newVersion": 3 }

curl http://localhost:4000/tenants/<safeguard-id>/versions
# Expected: 3 rows

curl http://localhost:4000/tenants/<safeguard-id>
# Expected: branding.name = "SafeGuard Insurance" (original v1 value)

curl -X POST http://localhost:4000/tenants/<safeguard-id>/rollback/999
# Expected: 404
```

Expected result: Version list grows after each save and rollback. Rollback creates a new version whose config matches the target snapshot. History rows are never deleted or mutated. `VersionController` contains no Prisma code; `VersionRepository` contains no business logic.

## Time

- **In:** 2026-06-20 11:47:54
- **Out:** _(YYYY-MM-DD HH:mm:ss — filled by agent at completion)_
- **Estimate:** 25 min
