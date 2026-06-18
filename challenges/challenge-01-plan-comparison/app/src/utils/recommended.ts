import type { Plans } from '../data/plans'

// Formula rationale and alternatives: plans/docs/VALUE_FOR_MONEY_RATIO.md
export function getRecommendedIndex(plans: Plans): number {
  const scores = plans.map(p =>
    (p.annual_limit / p.monthly_premium) *
    (1 - p.copay_percentage / 100) *
    (1 / (p.waiting_period_days + 1))
  )
  return scores.indexOf(Math.max(...scores))
}
