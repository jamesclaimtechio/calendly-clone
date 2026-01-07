import { ArrowUpRight } from "lucide-react"

// Integration logos as simple colored boxes with brand names
const integrations = [
  { name: "Zoom", color: "#2D8CFF", icon: "📹" },
  { name: "Salesforce", color: "#00A1E0", icon: "☁️" },
  { name: "Google Calendar", color: "#4285F4", icon: "📅" },
  { name: "Slack", color: "#4A154B", icon: "💬" },
  { name: "Teams", color: "#6264A7", icon: "👥" },
  { name: "Gmail", color: "#EA4335", icon: "✉️" },
  { name: "Outlook", color: "#0078D4", icon: "📧" },
  { name: "Chrome", color: "#4285F4", icon: "🌐" },
  { name: "Webex", color: "#00BCF2", icon: "📞" },
  { name: "HubSpot", color: "#FF7A59", icon: "🧲" },
  { name: "Notion", color: "#000000", icon: "📝" },
  { name: "Figma", color: "#F24E1E", icon: "🎨" },
  { name: "LinkedIn", color: "#0A66C2", icon: "💼" },
  { name: "Stripe", color: "#635BFF", icon: "💳" },
  { name: "Intercom", color: "#1F8DED", icon: "💭" },
  { name: "Zapier", color: "#FF4A00", icon: "⚡" },
  { name: "PayPal", color: "#003087", icon: "💰" },
  { name: "Calendly", color: "#006BFF", icon: "📆" },
]

const suiteCards = [
  {
    name: "Google suite",
    description:
      "Get your job done faster by connecting Calendly to Google Calendar, Meet, Analytics, and more.",
    logo: (
      <svg className="h-8 w-8" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
  },
  {
    name: "Microsoft suite",
    description:
      "Make your day easier with Calendly integrations for Microsoft Teams, Outlook, Azure SSO, and more.",
    logo: (
      <svg className="h-8 w-8" viewBox="0 0 24 24">
        <path fill="#F25022" d="M0 0h11.4v11.4H0z" />
        <path fill="#00A4EF" d="M0 12.6h11.4V24H0z" />
        <path fill="#7FBA00" d="M12.6 0H24v11.4H12.6z" />
        <path fill="#FFB900" d="M12.6 12.6H24V24H12.6z" />
      </svg>
    ),
  },
]

export function IntegrationsSection() {
  return (
    <section className="bg-[#F8FAFC] py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <h2 className="text-3xl font-bold text-[#0B3558] lg:text-5xl">
            Connect Calendly to the
            <br />
            tools you already use
          </h2>
          <div className="text-right">
            <p className="mb-2 text-lg text-[#476482]">
              Boost productivity with 100+ integrations
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-1 font-medium text-[#0B3558] hover:underline"
            >
              View all integrations
              <span className="text-lg">→</span>
            </a>
          </div>
        </div>

        {/* Integration Icons Grid */}
        <div className="mb-12 grid grid-cols-5 gap-4 sm:grid-cols-6 md:grid-cols-9">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="group flex aspect-square cursor-pointer items-center justify-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              title={integration.name}
            >
              <span className="text-2xl">{integration.icon}</span>
            </div>
          ))}
        </div>

        {/* Suite Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {suiteCards.map((card) => (
            <div
              key={card.name}
              className="group relative cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <ArrowUpRight className="absolute right-6 top-6 h-5 w-5 text-gray-400 transition-colors group-hover:text-[#0B3558]" />
              <div className="mb-4">{card.logo}</div>
              <h3 className="mb-2 text-xl font-semibold text-[#0B3558]">
                {card.name}
              </h3>
              <p className="text-[#476482]">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
