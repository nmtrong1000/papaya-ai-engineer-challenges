import type { Benefit } from '../data/plans'
import { BenefitType } from '../data/plans'

const fmt = (n: number) => n === -1 ? 'Unlimited' : n.toLocaleString()

const notIncluded = (
  <span className="flex items-center gap-1 text-gray-400">
    <svg aria-hidden="true" className="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none">
      <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    <span className="sr-only">Not included</span>
    <span>Not included</span>
  </span>
)

export function formatBenefit(benefit: Benefit, type: BenefitType): React.ReactNode {
  if (benefit === null) return notIncluded

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
