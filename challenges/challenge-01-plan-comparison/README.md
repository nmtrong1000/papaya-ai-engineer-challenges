# Challenge 01 — Insurance Plan Comparison Page

A responsive side-by-side insurance plan comparison page built for the Papaya AI Engineering Challenge series.

**Live URL:** https://challenge-01-plan-comparison.vercel.app

## What was built

- Three insurance plan cards (Bronze, Silver, Gold) displayed side-by-side on desktop and stacked on mobile
- All benefit fields rendered: outpatient, inpatient, dental, maternity — with `✕ Not included` for null benefits and `Unlimited` for `-1` values
- **Compare** toggle button that activates per-row ranking (1st / 2nd / 3rd) using green / amber / rose colour coding across all plans
- **Recommended** badge on the best-value plan, calculated using a Quality-Adjusted Coverage Ratio (see `plans/docs/VALUE_FOR_MONEY_RATIO.md`)
- Plan highlights list at the bottom of each card
- Responsive layout — stacks vertically on mobile (375px), side-by-side on desktop

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| Language | TypeScript 6 (erasableSyntaxOnly) |
| Styling | Tailwind CSS v4 |
| Linting | ESLint 10 + typescript-eslint |
| Deployment | Vercel |

## Running locally

```bash
cd app
npm install
npm run dev       # http://localhost:5173
npm run build     # production build
npm run lint      # lint check
```

## Project structure

```
app/
├── src/
│   ├── components/
│   │   ├── ComparisonTable.tsx   # layout + ranking logic
│   │   └── PlanCard.tsx          # individual plan card
│   ├── data/
│   │   └── plans.ts              # plan data + types
│   └── utils/
│       ├── bestValue.ts          # per-row ranking (SAW/WPM)
│       ├── formatBenefit.tsx     # benefit field formatter
│       └── recommended.ts        # recommended plan scorer
plans/
├── docs/
│   └── VALUE_FOR_MONEY_RATIO.md  # recommendation formula rationale
└── tasks/                        # PC-01 through PC-09 task files
```
