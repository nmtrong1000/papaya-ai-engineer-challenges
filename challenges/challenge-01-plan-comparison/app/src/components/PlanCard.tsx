import { BenefitType } from '../data/plans'
import type { Plan } from '../data/plans'
import { formatBenefit } from '../utils/formatBenefit'
import type { RowKey, Rank } from '../utils/bestValue'

const BENEFIT_LABELS: Record<BenefitType, string> = {
  [BenefitType.Outpatient]: 'Outpatient',
  [BenefitType.Inpatient]: 'Inpatient',
  [BenefitType.Dental]: 'Dental',
  [BenefitType.Maternity]: 'Maternity',
}

const ROW_CLS: Record<Rank, string> = {
  1: 'bg-emerald-50 rounded px-2 -mx-2',
  2: 'bg-amber-50 rounded px-2 -mx-2',
  3: 'bg-rose-50 rounded px-2 -mx-2',
}

const VAL_CLS: Record<Rank, string> = {
  1: 'font-medium text-emerald-500',
  2: 'font-medium text-amber-700',
  3: 'font-medium text-rose-600',
}

type Props = {
  plan: Plan
  ranks: Record<RowKey, Rank> | null
  recommended?: boolean
}

export function PlanCard({ plan, ranks, recommended = false }: Props) {
  const rowCls = (row: RowKey) => ranks ? ROW_CLS[ranks[row]] : ''
  const valCls = (row: RowKey) => ranks ? VAL_CLS[ranks[row]] : 'font-medium text-gray-900'

  return (
    <div className="flex-1 min-w-0 border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
        {recommended && (
          <span className="bg-green-500 text-white text-xs font-medium rounded-full px-2 py-0.5">
            Recommended
          </span>
        )}
      </div>

      <dl className="space-y-3 text-sm">
        <div className={`flex justify-between ${rowCls('monthly_premium')}`}>
          <dt className="text-gray-500">Monthly Premium</dt>
          <dd className={valCls('monthly_premium')}>
            {plan.monthly_premium.toLocaleString()}
          </dd>
        </div>

        <div className={`flex justify-between ${rowCls('annual_limit')}`}>
          <dt className="text-gray-500">Annual Limit</dt>
          <dd className={valCls('annual_limit')}>
            {plan.annual_limit.toLocaleString()}
          </dd>
        </div>

        <div className={`flex justify-between ${rowCls('copay_percentage')}`}>
          <dt className="text-gray-500">Copay</dt>
          <dd className={valCls('copay_percentage')}>
            {plan.copay_percentage}%
          </dd>
        </div>

        <div className={`flex justify-between ${rowCls('waiting_period_days')}`}>
          <dt className="text-gray-500">Waiting Period</dt>
          <dd className={valCls('waiting_period_days')}>
            {plan.waiting_period_days === 0 ? 'Immediate' : `${plan.waiting_period_days} days`}
          </dd>
        </div>
      </dl>

      <hr className="my-4 border-gray-100" />

      <dl className="space-y-3 text-sm">
        {(Object.values(BenefitType) as BenefitType[]).map((type) => (
          <div key={type} className={`flex justify-between items-start gap-4 ${rowCls(type)}`}>
            <dt className="text-gray-500 shrink-0">{BENEFIT_LABELS[type]}</dt>
            <dd className={`text-right ${valCls(type)}`}>
              {formatBenefit(plan.benefits[type], type)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
