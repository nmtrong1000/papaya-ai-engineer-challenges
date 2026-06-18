import type { Benefit } from '../data/plans'
import { BenefitType } from '../data/plans'

const fmt = (n: number) => n === -1 ? 'Unlimited' : n.toLocaleString()

function NotIncluded() {
  return (
    <span className="flex items-center gap-1 text-gray-400">
      <span aria-hidden="true">✕</span>
      <span className="sr-only">Not included</span>
      <span>Not included</span>
    </span>
  )
}

export function formatBenefit(benefit: Benefit, type: BenefitType): React.ReactNode {
  if (benefit === null) return <NotIncluded />

  switch (type) {
    case BenefitType.Outpatient:
      return (
        <ul className="space-y-0.5 text-gray-700">
          <li>Limit/visit: {fmt(benefit.limit_per_visit ?? 0)}</li>
          <li>Visits/year: {fmt(benefit.visits_per_year ?? 0)}</li>
        </ul>
      )
    case BenefitType.Inpatient:
      return (
        <ul className="space-y-0.5 text-gray-700">
          <li>Limit/day: {fmt(benefit.limit_per_day ?? 0)}</li>
          <li>Days/year: {fmt(benefit.days_per_year ?? 0)}</li>
        </ul>
      )
    case BenefitType.Dental:
      return <span className="text-gray-700">Limit/year: {fmt(benefit.limit_per_year ?? 0)}</span>
    case BenefitType.Maternity:
      return <span className="text-gray-700">Limit/pregnancy: {fmt(benefit.limit_per_pregnancy ?? 0)}</span>
  }
}
