import type { Plans } from '../data/plans'
import { PlanCard } from './PlanCard'

type Props = {
  plans: Plans
}

export function ComparisonTable({ plans }: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {plans.map((plan) => (
        <PlanCard key={plan.name} plan={plan} />
      ))}
    </div>
  )
}
