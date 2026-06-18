# Challenge Workflow

This document defines the repeatable process for tackling each challenge in `docs/`. Follow every phase in order. Do not skip phases or merge them.

---

## Directory Structure

Each challenge lives in its own directory at the repo root. The structure is fixed:

```
<challenge-slug>/          # e.g. challenge-01-plan-comparison/
├── CLAUDE.md              # challenge-specific instructions & context for the agent
└── plans/
    ├── 1.REQUIREMENT_ANALYSIS.md
    ├── 2.INFRASTRUCTURE.md
    ├── 3.ERD.md
    ├── 4.TASK_DECOMPOSITION.md
    └── tasks/
        ├── [TICKET-ID].md   # e.g. PC-01.md, PC-02.md
        └── ...
```

---

## Git & Branching Workflow

### Branch naming

Each challenge gets its own branch: `challenge-01`, `challenge-02`, etc.

### Branch lifecycle

| Stage | Action |
|-------|--------|
| Start of Phase 1 | `git checkout main && git checkout -b challenge-XX` |
| Each ticket (start + done) | Commit to `challenge-XX` |
| Phase 7 complete | `git checkout main && git merge --no-ff challenge-XX` |

### Routing: what goes where

| Content | Branch |
|---------|--------|
| Challenge app code, plans, task files | `challenge-XX` |
| `WORKFLOW.md`, `CLAUDE.md`, `DECOMPOSITION_STRATEGY.md`, `docs/` | `main` directly |

Workflow and documentation changes are committed to `main` immediately — they are not challenge-specific and must be available to all future challenges without waiting for a merge.

---

## Phase 1 — Requirement Analysis

**File:** `plans/1.REQUIREMENT_ANALYSIS.md`

### Branch setup

Before writing any file, ensure the challenge branch exists and is checked out:

```bash
git checkout main
git checkout -b challenge-XX   # e.g. challenge-01
```

If resuming an existing challenge: `git checkout challenge-XX`.

Read the challenge doc in `docs/` cover to cover before writing a single line. The goal of this phase is to restate the problem in your own words and define what "done" looks like precisely.

### Sections

#### 1.1 Problem Statement

Describe the problem being solved: who has the problem, what the pain is, and why it matters in the insurance domain. Keep it to 3–5 sentences. Do not copy the brief verbatim.

#### 1.2 Functional Requirements

List every functional requirement extracted from the brief. Use checkboxes so they double as a completion checklist.

```markdown
- [ ] FR-01: ...
- [ ] FR-02: ...
```

Include requirements that are implied but not stated (e.g. if the brief shows a table, responsiveness is implied).

#### 1.3 Non-Functional Requirements

Capture performance, accessibility, security, browser support, and any other quality constraints relevant to the challenge difficulty level.

#### 1.4 Out of Scope

Explicitly list anything that might seem related but is not required. This prevents scope creep during execution.

#### 1.5 Definition of Done

A precise, verifiable checklist. The challenge is complete only when every item is checked.

```markdown
- [ ] All functional requirements are implemented and tested
- [ ] All 3 test cases pass (for agent challenges)
- [ ] App is deployed and live URL is accessible
- [ ] GitHub repo is public with a clear README
- [ ] No console errors on the golden path
- [ ] ...
```

### Confirmation

> Agent stops here and asks: **"Phase 1 complete. Please review `plans/1.REQUIREMENT_ANALYSIS.md`. Reply 'ok' to continue to Phase 2, or provide feedback to revise."**
>
> Do not proceed to Phase 2 until the user replies.

---

## Phase 2 — Infrastructure

**File:** `plans/2.INFRASTRUCTURE.md`

Select the tech stack. Every technology choice must be deliberate and documented. No "I just like this" selections.

### Format

Each section is split into **sub-categories** — one per technology dimension within that layer (e.g. Framework, Styling, State Management). Each sub-category contains a checkbox list. The agent reads every checked `[x]` item as part of the selected stack when entering Phase 4.

**Rules:**
- Exactly one option per sub-category must be checked before proceeding to Phase 3.
- Leave all boxes empty while evaluating; check your pick when decided.
- No technology may appear in the Conclusion or in any task file unless its sub-category has a checked `[x]` entry.

```markdown
## 2.1 Frontend

### Framework
- [ ] **React + Vite** — Description. **Why consider:** ... **Trade-offs:** ...
- [x] **Next.js** — Description. **Why consider:** ... **Trade-offs:** ...
- [ ] **Plain HTML/CSS/JS** — Description. **Why consider:** ... **Trade-offs:** ...

### Styling
- [ ] **Tailwind CSS** — Description. **Why consider:** ... **Trade-offs:** ...
- [ ] **CSS Modules** — Description. **Why consider:** ... **Trade-offs:** ...
- [ ] **Plain CSS** — Description. **Why consider:** ... **Trade-offs:** ...
```

### Sections

#### 2.1 Frontend

Split into sub-categories as needed (e.g. Framework, Styling, State Management). Include at least 3 options per sub-category. Consider: framework overhead vs. challenge complexity, deployment target, time available.

#### 2.2 Backend

Include at least 3 options. If the challenge is frontend-only, state that explicitly and skip this section.

#### 2.3 Database

Include at least 3 options. If the challenge requires no persistence, state that and skip.

#### 2.4 DevOps / Deployment

Include at least 2 options. Free-tier hosting is acceptable (Vercel, Render, Railway, etc.).

#### 2.5 External Services / APIs

List any third-party APIs (LLM providers, email services, etc.) with the same option table format.

### Conclusion

End with a one-paragraph summary of the full stack decision and the single most important reason for each choice.

### Confirmation

> Agent stops here and asks: **"Phase 2 complete. Please review `plans/2.INFRASTRUCTURE.md` and check `[x]` on your chosen option in each section. Reply 'ok' to continue to Phase 3, or provide feedback to revise."**
>
> Do not proceed to Phase 3 until the user replies.

---

## Phase 3 — ERD

**File:** `plans/3.ERD.md`

Design the data model before writing any code. Even frontend-only challenges may have a local data structure worth modeling.

### Format

Use Mermaid `erDiagram` syntax. Only include entities that exist within this challenge's scope — do not model the entire insurance domain.

```markdown
## Entity Relationship Diagram

\`\`\`mermaid
erDiagram
    POLICY {
        string id PK
        string member_id FK
        date start_date
        date end_date
        string status
    }
    CLAIM {
        string id PK
        string policy_id FK
        string type
        decimal amount
        string status
    }
    POLICY ||--o{ CLAIM : "has"
\`\`\`

## Notes

- `POLICY.status` values: active | expired | cancelled
- `CLAIM.type` values: outpatient | inpatient | dental | maternity
```

If the challenge has no persistence layer (e.g. a pure UI challenge with static data), include a **Data Shape** section instead, documenting the JSON structure used.

### Confirmation

> Agent stops here and asks: **"Phase 3 complete. Please review `plans/3.ERD.md`. Reply 'ok' to continue to Phase 4, or provide feedback to revise."**
>
> Do not proceed to Phase 4 until the user replies.

---

## Phase 4 — Task Decomposition

**File:** `plans/4.TASK_DECOMPOSITION.md`

Break the work into discrete, independently testable tasks. Each task must be completable in one focused session (target 20–60 min each). No task should touch more than one layer of the stack at a time.

**Default strategy: Horizontal Slicing.** Tasks are ordered by technical layer — Infra → Data → UI → Logic → Polish → Deploy. See [`DECOMPOSITION_STRATEGY.md`](./docs/DECOMPOSITION_STRATEGY.md) for the full comparison of strategies (horizontal slicing, vertical slicing, risk-first) and guidance on when to switch away from the default.

### Format

The ticket prefix is a short uppercase abbreviation of the challenge name (e.g. `PC` for Plan Comparison). Define it once at the top of the file.

```markdown
**Ticket prefix:** PC

## Task List

| Ticket | Task | Layer | Estimate |
|--------|------|-------|----------|
| PC-01 | Project scaffolding & dependency setup | Infra | 15 min |
| PC-02 | Static plan data model + seed file | Data | 20 min |
| PC-03 | Comparison table component — desktop layout | UI | 45 min |
| PC-04 | Responsive mobile layout | UI | 30 min |
| PC-05 | Best-value highlighting logic | Logic | 25 min |
| PC-06 | Recommended badge calculation | Logic | 20 min |
| PC-07 | Deploy to Vercel + smoke test | Deploy | 15 min |

**Total estimate:** 2h 50min
```

### Rules

- Before decomposing, read `plans/2.INFRASTRUCTURE.md` and extract every checked `[x]` item. All task scaffolding, tooling, and implementation steps must use only the selected technologies.
- Order tasks so each one builds on the last — no task should depend on a later task.
- **No forward references.** A task must not mention, reference, or defer work to any later task. Each task is scoped so that when it is done, every line of code it produces is complete for that scope — no stubs, no placeholders, no "will be replaced in task N." If a feature is not ready yet, exclude it entirely from this task's scope rather than shipping a temporary implementation.
- **Layer order (horizontal slicing default):** Infra → Data → UI → Logic → Polish → Deploy. Infra and scaffolding always come first; UI structure before UI content; logic before polish; polish before deploy.
- **Task names start with a verb.** Write names in the imperative: "Build", "Create", "Implement", "Deploy", "Verify", etc. Never start with a noun phrase (e.g. "Plan data model" → "Create plan data model").
- Each task must have a single, verifiable acceptance criterion (captured in the task file).

### Confirmation

> Agent stops here and asks: **"Phase 4 complete. Please review `plans/4.TASK_DECOMPOSITION.md`. Reply 'ok' to continue to Phase 5, or provide feedback to revise."**
>
> Do not proceed to Phase 5 until the user replies.

---

## Phase 5 — Task Files

**Directory:** `plans/tasks/`  
**Naming:** `[TICKET-ID].md` — e.g. `PC-01.md`, `PC-02.md`. Use the ticket prefix defined in `4.TASK_DECOMPOSITION.md`. No numeric ordering prefix or task name in the filename.

Create one file per task from the decomposition. The file is the agent's instruction set for that task.

**Constraint:** A task file must not reference any other task by ticket ID, name, or number — in any section. The agent executing a task reads only that file; it must contain everything needed to complete the work without looking ahead or behind.

**Title rule:** The `# [TICKET-ID]. Task Name` heading in each task file must be identical to the task name as written in `4.TASK_DECOMPOSITION.md`. The decomposition is the single source of truth for task names.

### Template

```markdown
# [No.] Task Name

## Requirement

One sentence: what must exist when this task is complete.

## Approach

2–4 sentences explaining the technical strategy — which files to create/modify,
which patterns to follow, and any non-obvious decisions.

## Execution Steps

- [ ] Step 1
- [ ] Step 2
- [ ] Step 3
...

## How to Test

Concrete, runnable verification steps. Prefer commands over prose.

\`\`\`bash
# example
npm run dev
# open http://localhost:3000 — table should render 3 columns
\`\`\`

Or for logic/unit tests:
\`\`\`bash
npm test -- --testPathPattern=benefit-calculator
\`\`\`

Expected result: [describe what passing looks like]

## Time

- **In:** _(YYYY-MM-DD HH:mm:ss — filled by agent at start)_
- **Out:** _(YYYY-MM-DD HH:mm:ss — filled by agent at completion)_
- **Estimate:** 30 min
```

### Confirmation

> Agent stops here and asks: **"Phase 5 complete. All task files are created under `plans/tasks/`. Please review them. Reply 'ok' to begin execution in Phase 6, or provide feedback to revise."**
>
> Do not proceed to Phase 6 until the user replies.

---

## Phase 6 — Execution

Once all task files exist, execute the plan task by task. Never jump ahead. Never work on two tasks simultaneously.

### Loop per task

All commits in this loop land on the `challenge-XX` branch.

```
1. Agent opens the next incomplete task file (e.g. plans/tasks/PC-01.md)
2. Agent logs Time In (fills the "In:" field in the task file)
3. Agent commits on challenge-XX: "chore: [TICKET-ID] start — [Task Name]"
4. Agent executes the steps in order, checking off each as it goes
5. Agent runs the "How to Test" steps and confirms expected result
6. Agent stops and asks: "[TICKET-ID] — [Task Name] complete. Please review
   the output. Reply 'ok' to log time and move to the next task, or describe
   what to fix."
7. Agent logs Time Out (fills the "Out:" field in the task file)
8. Agent commits on challenge-XX: "feat: [TICKET-ID] done — [Task Name]"
   (use fix: or chore: instead of feat: where appropriate per the conventions table)
9. Move to the next task
```

### Commit conventions

| Prefix | When to use | Branch |
|--------|-------------|--------|
| `chore:` | Scaffolding, config, dependency setup, task bookkeeping | `challenge-XX` |
| `feat:` | New feature or visible behaviour | `challenge-XX` |
| `fix:` | Correcting something broken | `challenge-XX` |
| `test:` | Adding or fixing tests only | `challenge-XX` |
| `docs:` | `WORKFLOW.md`, `CLAUDE.md`, `DECOMPOSITION_STRATEGY.md`, `docs/` | `main` |

### On failure

If a task's test step fails:
- Do not mark it complete.
- Do not move on.
- Investigate within the task's scope before widening.
- If blocked, note the blocker in the task file under a `## Blocker` section and surface it to the user before continuing.

### Confirmation

> When all tasks are complete, agent asks: **"Phase 6 complete. All tasks are done and time-logged. Reply 'ok' to proceed to the submission checklist in Phase 7, or provide feedback."**
>
> Do not proceed to Phase 7 until the user replies.

---

## Phase 7 — Submission Checklist

Before submitting, verify the Definition of Done from Phase 1 item by item.

```markdown
- [ ] All tasks completed and time-logged
- [ ] All DoD items checked
- [ ] README in the challenge directory explains: what was built, stack, how to run locally, live URL
- [ ] Repository is public
- [ ] Live URL is accessible and renders correctly
- [ ] No unhandled errors on the golden path
- [ ] Brief writeup covers: approach decisions, trade-offs made, anything not implemented and why
```

### Merge to main

Once every checklist item is ticked, merge the challenge branch:

```bash
git checkout main
git merge --no-ff challenge-XX -m "feat: challenge-XX complete"
```

The `--no-ff` flag preserves the branch history as a distinct unit in the log.

---

## Quick Reference

```
Phase 1  →  checkout challenge-XX | understand the problem, write DoD    → wait for user 'ok'
Phase 2  →  choose the stack, document trade-offs                        → wait for user 'ok' + [x] checks
Phase 3  →  design the data model in Mermaid                             → wait for user 'ok'
Phase 4  →  decompose into ordered, estimated tasks                      → wait for user 'ok'
Phase 5  →  write one task file per task                                 → wait for user 'ok'
Phase 6  →  per task on challenge-XX: time-in → commit start → code → test → user 'ok' → time-out → commit done
Phase 7  →  verify DoD → merge challenge-XX into main → submit
```
