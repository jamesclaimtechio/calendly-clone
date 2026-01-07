import {
  Navbar,
  HeroSection,
  SocialProof,
  WorkflowSection,
  IntegrationsSection,
  FeaturesSection,
  PricingSection,
  StatsSection,
  FooterCta,
  SiteFooter,
} from "@/components/landing"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <SocialProof />
      <WorkflowSection />
      <IntegrationsSection />
      <FeaturesSection />
      <PricingSection />
      <StatsSection />
      <FooterCta />
      <SiteFooter />
    </main>
  )
}
