import type { Plan } from '../data/plans'

type Props = {
  plan: Plan
}

export function PlanCard({ plan }: Props) {
  return (
    <div className="flex-1 border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{plan.name}</h2>

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-gray-500">Monthly Premium</dt>
          <dd className="font-medium text-gray-900">
            {plan.monthly_premium.toLocaleString()}
          </dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-gray-500">Annual Limit</dt>
          <dd className="font-medium text-gray-900">
            {plan.annual_limit.toLocaleString()}
          </dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-gray-500">Copay</dt>
          <dd className="font-medium text-gray-900">
            {plan.copay_percentage === 0 ? 'None' : `${plan.copay_percentage}%`}
          </dd>
        </div>

        <div className="flex justify-between">
          <dt className="text-gray-500">Waiting Period</dt>
          <dd className="font-medium text-gray-900">
            {plan.waiting_period_days === 0 ? 'None' : `${plan.waiting_period_days} days`}
          </dd>
        </div>
      </dl>
    </div>
  )
}
