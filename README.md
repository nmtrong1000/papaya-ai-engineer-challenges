# Papaya AI Engineering Challenges

A personal series of timed, production-grade challenges in the insurance domain. Each challenge ships a deployable application — frontend, full-stack, or API — built from scratch under realistic time pressure.

---

## Challenges

| # | Challenge | Status | Directory | Time Spent | Live URL |
|---|-----------|--------|-----------|-----------|----------|
| 01 | Insurance Plan Comparison Page | Complete | [challenges/challenge-01-plan-comparison](./challenges/challenge-01-plan-comparison/) | ~3 h | [challenge-01-plan-comparison.vercel.app](https://challenge-01-plan-comparison.vercel.app) |
| 15 | Multi-Tenant Configuration Platform | Complete | [challenges/challenge-15-multi-tenant-config](./challenges/challenge-15-multi-tenant-config/) | ~13 h | [challenge-15-multi-tenant-config.vercel.app](https://challenge-15-multi-tenant-config.vercel.app) |

---

## How I Make These

Every challenge follows the same seven-phase process defined in [`WORKFLOW.md`](./WORKFLOW.md). The workflow is designed to produce consistent, reviewable output regardless of challenge complexity.

| Phase | What happens |
|-------|-------------|
| 1 — Requirement Analysis | Break down the brief into functional and non-functional requirements |
| 2 — Infrastructure | Choose the tech stack and lock it as a checklist — nothing may be used unless checked |
| 3 — ERD / Data Shape | Define the data model and relationships |
| 4 — Task Decomposition | Split the work into discrete, independently executable tickets |
| 5 — Task Files | Write a full spec (requirement, approach, steps, test criteria) for every ticket |
| 6 — Execution | Implement one task at a time, in order, with a time log per ticket |
| 7 — Submission Checklist | Verify the definition of done, write the README, deploy, merge to main |

Each phase has a gate — work doesn't proceed until the output of the current phase is reviewed and confirmed. Planning artefacts live in `challenges/<slug>/plans/` alongside the application code so the decision trail is always visible.

---

## Thank You

Thank you to the Papaya team for putting together these challenges. They are genuinely fun to work through, and the insurance domain adds just enough real-world constraint to keep things interesting. I appreciate the opportunity to show not just what I can build, but how I approach building it.
