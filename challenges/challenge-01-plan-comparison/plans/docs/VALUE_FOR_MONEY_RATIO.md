# Value-for-Money Ratio

The challenge requires a "Recommended" badge assigned to one plan based on its **value-for-money ratio** — a score that answers: *how much coverage do you get per baht you spend?*

Three candidate formulas are described below, in order of increasing complexity.

---

## Formula 1 — Pure Coverage Ratio

```
score = annual_limit / monthly_premium
```

**What it is:** The most literal interpretation of value-for-money. Divides the maximum annual payout by the monthly cost to produce a coverage-per-baht figure.

**Why consider it:** Transparent and immediately explainable to a non-technical user. No hidden assumptions. The number has a concrete meaning: "for every 1 baht I pay per month, I get X baht of annual coverage."

**Trade-offs:**
- Ignores copay — a plan with a high annual limit but 30% copay gives far less real-world value than the ratio suggests.
- Ignores waiting periods — a plan you cannot use for 60 days is worth less than one you can use immediately.
- Best suited when plans differ mainly in their premium-to-limit relationship and other factors are similar.

---

## Formula 2 — Effective Payout Ratio

```
score = (annual_limit × (1 − copay_percentage / 100)) / monthly_premium
```

**What it is:** Adjusts the annual limit by the proportion the insurer actually pays after copay, then divides by premium. The numerator represents the realistic maximum payout the member can expect.

**Why consider it:** Copay directly reduces the financial value of a plan. A plan with 5,000,000 annual limit and 50% copay effectively pays out only 2,500,000 — identical in real value to a 2,500,000 limit with 0% copay. This formula captures that reality while remaining a true ratio (value ÷ cost).

**Trade-offs:**
- Still ignores waiting periods.
- Assumes the full annual limit is reached, which overstates value for members with low expected usage.
- More honest than Formula 1 for plans that differ significantly in copay.

---

## Formula 3 — Quality-Adjusted Coverage Ratio (current implementation)

```
score = (annual_limit / monthly_premium)
      × (1 − copay_percentage / 100)
      × (1 / (waiting_period_days + 1))
```

**What it is:** Extends the effective payout ratio with a waiting period multiplier. Each factor is expressed as a ratio; multiplying them together compounds their effects. Equivalent to Formula 2 with an additional accessibility penalty.

**Why consider it:** Waiting periods matter to new members — a plan you cannot claim against for 30 days has diminished value at the point of purchase. This formula penalises that delay relative to plans with immediate coverage.

**Trade-offs:**
- The waiting period term `1 / (days + 1)` is a reciprocal and drops sharply near zero: 30 days → ×0.032, 15 days → ×0.063, 0 days → ×1.0. A plan with any waiting period is aggressively penalised, which can overshadow large differences in coverage or copay.
- Sensitive to how waiting period data is distributed across plans. Works well when one plan clearly has a lower wait; less meaningful when all plans have similar waiting periods.
- More complex to explain to end users than a single ratio.

---

## Which formula is used

**Formula 3** is implemented in `getRecommendedIndex`. It was chosen because it incorporates all three factors that determine a plan's value at the point of purchase: how much it covers, how much of that the insurer pays, and how soon the member can use it.
