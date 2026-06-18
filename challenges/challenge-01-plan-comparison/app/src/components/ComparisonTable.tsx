import type { Plans } from '../data/plans'
import { PlanCard } from './PlanCard'
import { getPlanRanks, ALL_ROWS } from '../utils/bestValue'
import type { RowKey, Rank } from '../utils/bestValue'
import { getRecommendedIndex } from '../utils/recommended'

type Props = {
  plans: Plans
  compareMode: boolean
}

export function ComparisonTable({ plans, compareMode }: Props) {
  const recommendedIndex = getRecommendedIndex(plans)

  const ranksByPlan: (Record<RowKey, Rank> | null)[] = compareMode
    ? plans.map((_, i) =>
        Object.fromEntries(
          ALL_ROWS.map(row => [row, getPlanRanks(row, plans)[i]])
        ) as Record<RowKey, Rank>
      )
    : plans.map(() => null)

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {plans.map((plan, i) => (
        <PlanCard
          key={plan.name}
          plan={plan}
          ranks={ranksByPlan[i]}
          recommended={i === recommendedIndex}
        />
      ))}
    </div>
  )
}
