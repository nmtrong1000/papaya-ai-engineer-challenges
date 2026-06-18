# Task Decomposition Strategies

This document describes the three main strategies for breaking work into tasks, when to use each, and how to choose between them for a given challenge.

---

## Strategy 1 — Horizontal Slicing (by technical layer)

Each task lives entirely within one technical layer. No task crosses layer boundaries.

**Typical layer order:**

```
Infra → Data → UI (structure) → UI (content) → Logic → Polish → Deploy
```

**Example (Plan Comparison challenge):**

| Ticket | Task | Layer |
|--------|------|-------|
| PC-01 | Project scaffolding | Infra |
| PC-02 | Data model & seed file | Data |
| PC-03 | Card & table components | UI |
| PC-04 | Benefit row rendering | UI |
| PC-05 | Best-value highlighting | Logic |
| PC-06 | Recommended badge | Logic |
| PC-07 | Responsive polish | UI |
| PC-08 | Accessibility polish | UI |
| PC-09 | Deploy | Deploy |

**Strengths:**
- Simple to sequence — each layer is stable before the next builds on it
- Low cognitive overhead per task; the agent stays in one context
- Easy to estimate; layers map predictably to time

**Weaknesses:**
- The app is never end-to-end working until late; nothing useful is demo-able mid-way
- A bug discovered in the Logic layer may require reworking multiple prior UI tasks
- Does not surface unknown risks early

**When to use:**
- Requirements are fully specified and stable
- The problem domain is well understood
- The challenge is small enough that late integration is not a risk

---

## Strategy 2 — Vertical Slicing (by user-visible feature)

Each task delivers a thin but complete feature: from data to component to logic. After every task, a new piece of value is visible and testable.

**Typical slice structure:**

```
Scaffold → Feature A (full stack) → Feature B (full stack) → ... → Polish → Deploy
```

**Example (Plan Comparison challenge):**

| Ticket | Task | Delivers |
|--------|------|----------|
| PC-01 | Scaffold | Dev environment |
| PC-02 | Bronze plan card — full | One fully working card |
| PC-03 | Silver & Gold cards | All three cards working |
| PC-04 | Best-value highlighting | Row highlights across all cards |
| PC-05 | Recommended badge | Badge on best-value plan |
| PC-06 | Responsive layout | Works on mobile |
| PC-07 | Deploy | Live URL |

**Strengths:**
- The app is demo-able and testable after every task
- Bugs in shared logic are discovered while building the first feature, not after all UI is done
- Closest to how product teams write Jira stories — maps well to stakeholder reviews

**Weaknesses:**
- Shared infrastructure (data model, utils, layout) either gets duplicated across slices or must be extracted as its own task first
- Harder to sequence cleanly; later slices depend on patterns established in earlier ones
- Estimates are less predictable — feature scope can expand mid-task

**When to use:**
- Requirements may evolve and early feedback matters
- A stakeholder or reviewer needs to see incremental progress
- The challenge has multiple independent features that can each be demoed in isolation

---

## Strategy 3 — Risk-First (spike-driven)

Identify the riskiest or least-understood pieces of work and tackle them first, regardless of layer. Early tasks are exploratory spikes; later tasks build on validated decisions.

**Typical structure:**

```
Spike (riskiest unknown) → Spike (second unknown) → Scaffold → Build on validated decisions → Deploy
```

**Example (Plan Comparison challenge — if scoring logic were uncertain):**

| Ticket | Task | Purpose |
|--------|------|---------|
| PC-01 | Spike: recommended badge scoring formula | Validate math with stakeholder before building UI |
| PC-02 | Spike: best-value highlighting rules | Define "best" per row type; confirm edge cases |
| PC-03 | Scaffold + data model | Now built around confirmed logic |
| PC-04 | Full card UI with logic wired in | No rework needed |
| PC-05 | Responsive + polish | |
| PC-06 | Deploy | |

**Strengths:**
- Surfaces blockers and wrong assumptions before significant UI work is done
- Avoids building a polished interface around logic that turns out to be incorrect
- Forces the hardest decisions to be made explicitly and early

**Weaknesses:**
- Spikes produce incomplete artefacts; harder to demo or hand off mid-way
- Requires discipline to time-box spikes and discard them once validated
- Overkill when the problem is well understood

**When to use:**
- A key algorithm, formula, or integration is unproven or disputed
- There is a domain rule that needs stakeholder sign-off before UI is built
- The challenge involves a third-party API or service whose behaviour is uncertain

---

## Choosing a Strategy

| Signal | Recommended strategy |
|--------|----------------------|
| Requirements are fixed and complete | Horizontal slicing |
| Stakeholders need to see incremental progress | Vertical slicing |
| A key rule or algorithm is unproven | Risk-first |
| Small, bounded challenge (≤ 3 hours) | Horizontal slicing |
| Medium challenge with independent features | Vertical slicing |
| Any unknown that could invalidate prior work | Risk-first spike first, then either of the above |

**Hybrid approach (recommended for most real projects):**

Start with a risk-first spike for any genuinely unknown piece. Once validated, switch to vertical slicing so progress is always demo-able. Use horizontal slicing only within a single feature when the scope is too small to slice vertically.

```
Spike (if needed) → Vertical slices → Polish layer → Deploy
```

---

## Rules that apply to all strategies

These rules from `WORKFLOW.md` apply regardless of which strategy is chosen:

- No task should touch more than one layer at a time
- No forward references — a task must not mention or defer work to a later task
- Each task must have a single, verifiable acceptance criterion
- Infra and scaffolding always come before feature work
- Estimates target 20–60 min per task
