# Papaya AI Engineering Challenges

## Project Overview

This repository contains solutions to the Papaya AI Engineering Challenge series — a set of timed frontend and full-stack challenges in the insurance domain. Each challenge is an independent deployable app that lives under `challenges/`. The same workflow and planning process is applied to every challenge to produce consistent, reviewable output.

## Structure

```
papaya-coding-challenge/
├── .claude/
│   └── settings.json          # Project-level Claude Code permissions (committed)
├── challenges/
│   └── challenge-NN-<slug>/   # One directory per challenge
│       ├── CLAUDE.md          # Challenge-specific context (if any)
│       ├── app/               # The deployable application
│       └── plans/             # Planning artefacts
│           ├── 1.REQUIREMENT_ANALYSIS.md
│           ├── 2.INFRASTRUCTURE.md
│           ├── 3.ERD.md
│           ├── 4.TASK_DECOMPOSITION.md
│           └── tasks/
│               └── [TICKET-ID].md
├── docs/                      # Challenge briefs & reference docs
├── WORKFLOW.md                # The phase-by-phase process (source of truth)
├── DECOMPOSITION_STRATEGY.md  # Task decomposition strategy reference (in docs/)
└── CLAUDE.md                  # This file
```

## Workflow

Every challenge follows the same seven-phase process defined in [`WORKFLOW.md`](./WORKFLOW.md). Read it before starting or resuming any challenge. The phases are:

| Phase | What happens | Gate |
|-------|-------------|------|
| 1 | Requirement Analysis | Wait for user 'ok' |
| 2 | Infrastructure | Wait for user 'ok' + [x] checks |
| 3 | ERD / Data Shape | Wait for user 'ok' |
| 4 | Task Decomposition | Wait for user 'ok' |
| 5 | Task Files | Wait for user 'ok' |
| 6 | Execution (one task at a time) | Wait for user 'ok' per task |
| 7 | Submission Checklist | — |

## Agent Instructions

### "Go to challenge N" / "Start challenge N"

1. Read [`WORKFLOW.md`](./WORKFLOW.md) in full
2. Read `docs/AI_Challenge_0N.md` for the brief
3. Check whether `challenges/challenge-0N-*/` exists
   - **Does not exist** → create the directory and start from Phase 1
   - **Exists** → inspect the plans directory to find the last completed phase, then resume from the next phase
4. Follow all phase gates — never skip phases, never merge them

### "Continue at [TICKET-ID]" / "Continue PC-03" / "Resume PC-05"

1. Read [`WORKFLOW.md`](./WORKFLOW.md) — specifically Phase 6
2. Find the challenge that owns the ticket (search `challenges/**/plans/tasks/[TICKET-ID].md`)
3. Read that task file
4. Log Time In if it is not already filled
5. Execute from the first unchecked step in order
6. On completion, ask the user to review before logging Time Out and moving on

### "Continue challenge N"

1. Read [`WORKFLOW.md`](./WORKFLOW.md) in full
2. Find `challenges/challenge-0N-*/`
3. Determine the current phase:
   - If all task files in `plans/tasks/` have Time Out filled → proceed to Phase 7
   - If a task file has Time In but no Time Out → resume that task from its first unchecked step
   - If no task is in progress → start the next incomplete task
4. Follow all phase gates

## Conventions

- All task names start with an imperative verb (Set up, Create, Build, Implement, Deploy…)
- Task file titles must match the name in `4.TASK_DECOMPOSITION.md` exactly
- Time In / Time Out format: `YYYY-MM-DD HH:mm:ss`
- No technology may be used unless it has a checked `[x]` entry in `2.INFRASTRUCTURE.md`
- No task may reference another task by ticket ID, name, or number

## References

- [`WORKFLOW.md`](./WORKFLOW.md) — full phase-by-phase process
- [`docs/DECOMPOSITION_STRATEGY.md`](./docs/DECOMPOSITION_STRATEGY.md) — when to use horizontal vs vertical vs risk-first decomposition
- [`challenges/README.md`](./challenges/README.md) — index of all challenges and their status
