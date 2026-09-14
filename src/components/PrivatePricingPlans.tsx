import { EditorialCard } from "@/components/editorial";
import { getFraunces } from "@/lib/fonts";
import {
  formatPriceKr,
  PRIVATE_PLANS,
  type PrivatePlan,
} from "@/content/pricing";

/**
 * The three private subscription tiers with locked monthly kroner.
 * Used on /priser only — the site-wide summary block is prose, not cards.
 */
export function PrivatePricingPlans() {
  return (
    <div className="grid gap-6 md:grid-cols-3 lg:gap-gutter">
      {PRIVATE_PLANS.map((plan) => (
        <PlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}

function PlanCard({ plan }: { plan: PrivatePlan }) {
  return (
    <EditorialCard className="h-full">
      <div className="p-2 lg:p-6">
        <h3
          className="font-serif text-2xl lg:text-3xl text-ink mb-1"
          style={{
            fontVariationSettings: getFraunces("sub"),
            letterSpacing: "-0.015em",
          }}
        >
          {plan.name} — {formatPriceKr(plan.priceKr)}
        </h3>
        <p className="text-base text-ink-soft mb-4">{plan.venues}</p>
        <p className="text-base text-ink leading-relaxed">{plan.body}</p>
      </div>
    </EditorialCard>
  );
}
