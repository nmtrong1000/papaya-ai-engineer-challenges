import { BenefitType } from '../data/plans'
import type { Plans } from '../data/plans'

export type RowKey =
  | 'monthly_premium'
  | 'annual_limit'
  | 'copay_percentage'
  | 'waiting_period_days'
  | BenefitType

export type Rank = 1 | 2 | 3

export const ALL_ROWS: RowKey[] = [
  'monthly_premium',
  'annual_limit',
  'copay_percentage',
  'waiting_period_days',
  ...(Object.values(BenefitType) as BenefitType[]),
]

const LOWER_IS_BETTER = new Set<RowKey>(['monthly_premium', 'copay_percentage', 'waiting_period_days'])

function extractValue(row: RowKey, plan: Plans[number]): number {
  const limit = (n: number | undefined) => (n === -1 ? Infinity : (n ?? 0))
  switch (row) {
    case 'monthly_premium': return plan.monthly_premium
    case 'annual_limit': return plan.annual_limit
    case 'copay_percentage': return plan.copay_percentage
    case 'waiting_period_days': return plan.waiting_period_days
    case BenefitType.Outpatient: {
      const b = plan.benefits[BenefitType.Outpatient]
      return b === null ? -Infinity : limit(b.limit_per_visit)
    }
    case BenefitType.Inpatient: {
      const b = plan.benefits[BenefitType.Inpatient]
      return b === null ? -Infinity : limit(b.limit_per_day)
    }
    case BenefitType.Dental: {
      const b = plan.benefits[BenefitType.Dental]
      return b === null ? -Infinity : limit(b.limit_per_year)
    }
    case BenefitType.Maternity: {
      const b = plan.benefits[BenefitType.Maternity]
      return b === null ? -Infinity : limit(b.limit_per_pregnancy)
    }
    default:
      return ((_: never) => 0)(row)
  }
}

export function getPlanRanks(row: RowKey, plans: Plans): Rank[] {
  const values = plans.map(plan => extractValue(row, plan))
  const lowerIsBetter = LOWER_IS_BETTER.has(row)
  const sorted = [...new Set(values)].sort(lowerIsBetter ? (a, b) => a - b : (a, b) => b - a)
  return values.map(v => (Math.min(sorted.indexOf(v) + 1, 3) as Rank))
}
