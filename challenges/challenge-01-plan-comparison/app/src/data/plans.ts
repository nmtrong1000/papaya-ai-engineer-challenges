export const BenefitType = {
  Outpatient: 'outpatient',
  Inpatient: 'inpatient',
  Dental: 'dental',
  Maternity: 'maternity',
} as const

export type BenefitType = typeof BenefitType[keyof typeof BenefitType]

export type BenefitFields = {
  limit_per_visit?: number
  visits_per_year?: number
  limit_per_day?: number
  days_per_year?: number
  limit_per_year?: number
  limit_per_pregnancy?: number
}

export type Benefit = BenefitFields | null

export type Plan = {
  name: string
  monthly_premium: number
  annual_limit: number
  benefits: Record<BenefitType, Benefit>
  copay_percentage: number
  waiting_period_days: number
  highlights: string[]
}

export type Plans = Plan[]

export const plans: Plans = [
  {
    name: 'Bronze',
    monthly_premium: 150,
    annual_limit: 500000,
    benefits: {
      [BenefitType.Outpatient]: { limit_per_visit: 3000, visits_per_year: 30 },
      [BenefitType.Inpatient]: { limit_per_day: 10000, days_per_year: 60 },
      [BenefitType.Dental]: null,
      [BenefitType.Maternity]: null,
    },
    copay_percentage: 20,
    waiting_period_days: 30,
    highlights: ['Basic coverage', 'No dental or maternity'],
  },
  {
    name: 'Silver',
    monthly_premium: 350,
    annual_limit: 1500000,
    benefits: {
      [BenefitType.Outpatient]: { limit_per_visit: 5000, visits_per_year: 60 },
      [BenefitType.Inpatient]: { limit_per_day: 25000, days_per_year: 120 },
      [BenefitType.Dental]: { limit_per_year: 30000 },
      [BenefitType.Maternity]: null,
    },
    copay_percentage: 10,
    waiting_period_days: 15,
    highlights: ['Includes dental', 'Lower copay', 'Higher limits'],
  },
  {
    name: 'Gold',
    monthly_premium: 700,
    annual_limit: 5000000,
    benefits: {
      [BenefitType.Outpatient]: { limit_per_visit: 10000, visits_per_year: -1 },
      [BenefitType.Inpatient]: { limit_per_day: 50000, days_per_year: -1 },
      [BenefitType.Dental]: { limit_per_year: 100000 },
      [BenefitType.Maternity]: { limit_per_pregnancy: 200000 },
    },
    copay_percentage: 0,
    waiting_period_days: 0,
    highlights: ['Full coverage', 'No copay', 'No waiting period', 'Unlimited visits'],
  },
]
