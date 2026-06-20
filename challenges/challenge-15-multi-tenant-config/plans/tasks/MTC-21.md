# MTC-21. Fix responsive design for mobile and tablet

## Requirement

All 5 pages (`/tenants`, `/tenants/new`, `/tenants/[id]/edit`, `/preview`, `/diff`) are fully usable on mobile (≥ 375px) and tablet (≥ 768px) viewports with no horizontal overflow, no broken layouts, and no overlapping elements.

## Approach

The main layout issues are: the sidebar is always visible and takes fixed width, pushing content off-screen on small viewports; tables in `/tenants` and `/diff` overflow horizontally; the multi-column form grids collapse poorly; and the version history modal is too wide on mobile. Fix by: making the sidebar collapsible on mobile (hamburger toggle), adding horizontal scroll containers to tables, collapsing grid layouts to single column below `md:`, and constraining the review modal to full-screen on mobile.

## Execution Steps

- [ ] Make the root layout responsive — add a hamburger button (`☰`) in a top bar visible only on mobile (`md:hidden`); toggle sidebar open/closed via `useState`; overlay sidebar on mobile with a backdrop that closes it on click; sidebar is always visible on `md+`
- [ ] Fix `/tenants` table — wrap in `overflow-x-auto` so it scrolls horizontally on small screens; ensure action buttons don't wrap awkwardly
- [ ] Fix `TenantForm` grid sections — change any multi-column grids (`grid-cols-2`, `grid-cols-3`) to `grid-cols-1 sm:grid-cols-2` or `sm:grid-cols-3`; ensure the claim form on `/preview` collapses similarly
- [ ] Fix `/diff` table — wrap in `overflow-x-auto`; the three-column layout stays but scrolls horizontally on mobile
- [ ] Fix version history modal — change `max-w-3xl` to `max-w-3xl w-full` with `mx-4` on mobile so it doesn't overflow; form inside already scrolls via `overflow-y-auto`
- [ ] Smoke test all 5 pages at 375px (iPhone SE), 768px (iPad), and 1280px (desktop) using browser DevTools device emulation

## How to Test

In Chrome DevTools → Toggle device toolbar:

**375px (iPhone SE):**
- Sidebar hidden; hamburger button visible in top bar; tap to open sidebar → overlay appears; tap backdrop to close
- `/tenants` table scrolls horizontally; no content cut off
- `/tenants/new` form fields stack in a single column
- `/preview` claim form fields stack; result renders without overflow
- `/diff` dropdowns stack to full width; table scrolls horizontally

**768px (iPad):**
- Sidebar visible and pinned; no hamburger shown
- All pages render without horizontal overflow

Expected result: No horizontal overflow on any page at 375px. Sidebar is collapsible on mobile. Tables scroll horizontally rather than clipping content.

## Time

- **In:** _(YYYY-MM-DD HH:mm:ss — filled by agent at start)_
- **Out:** _(YYYY-MM-DD HH:mm:ss — filled by agent at completion)_
- **Estimate:** 40 min
