import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Free",
    price: "Always free",
    description: "For individuals just getting started",
    features: [
      "1 calendar connection",
      "1 active event type",
      "Unlimited 1-on-1 meetings",
      "Calendly mobile app",
    ],
    cta: "Get started",
    ctaVariant: "outline" as const,
    href: "/signup",
  },
  {
    name: "Standard",
    price: "$10",
    priceDetail: "/seat/mo",
    description: "For individuals and small teams",
    features: [
      "Everything in Free, plus:",
      "Unlimited event types",
      "Unlimited integrations",
      "Remove Calendly branding",
      "Email & meeting reminders",
    ],
    cta: "Get standard",
    ctaVariant: "default" as const,
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Teams",
    price: "$16",
    priceDetail: "/seat/mo",
    description: "For teams that need to collaborate",
    features: [
      "Everything in Standard, plus:",
      "Round-robin scheduling",
      "Team event types",
      "Salesforce integration",
      "Admin management",
    ],
    cta: "Try for free",
    ctaVariant: "outline" as const,
    href: "/signup",
  },
  {
    name: "Enterprise",
    price: "Contact Us",
    description: "For large organizations",
    features: [
      "Everything in Teams, plus:",
      "SAML SSO",
      "Advanced admin controls",
      "Dedicated success manager",
      "Custom legal & security",
    ],
    cta: "Contact sales",
    ctaVariant: "outline" as const,
    href: "/signup",
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="bg-[#F8F9FA] py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-[#03233F] lg:text-5xl">
            Pick the perfect plan for your team
          </h2>
          <p className="mt-4 text-lg text-[#476482]">
            Start for free, upgrade as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-lg border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                plan.highlighted
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-gray-200"
              }`}
            >
              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#03233F]">
                  {plan.name}
                </h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold text-[#03233F]">
                    {plan.price}
                  </span>
                  {plan.priceDetail && (
                    <span className="ml-1 text-sm text-[#667085]">
                      {plan.priceDetail}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-[#476482]">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-sm text-[#476482]">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                asChild
                variant={plan.ctaVariant}
                className={`w-full ${
                  plan.ctaVariant === "outline"
                    ? "border-primary text-primary hover:bg-primary/5"
                    : ""
                }`}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
