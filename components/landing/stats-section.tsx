import { ArrowRight } from "lucide-react"

const caseStudies = [
  {
    company: "Bitly",
    stat: "169%",
    label: "return on investment",
    color: "#EE6123",
  },
  {
    company: "Vancity",
    stat: "160%",
    label: "more booked meetings",
    color: "#00A651",
  },
  {
    company: "CallRail",
    stat: "20%",
    label: "increase in connections",
    color: "#0079FF",
  },
]

export function StatsSection() {
  return (
    <section className="bg-[#F8F9FA] py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-[#03233F] lg:text-5xl">
            Discover how businesses grow with Calendly
          </h2>
          <p className="mt-4 text-lg text-[#476482]">
            Real results from companies just like yours.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {caseStudies.map((study) => (
            <div
              key={study.company}
              className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Company Logo Placeholder */}
              <div
                className="mb-6 inline-flex items-center justify-center rounded-lg px-4 py-2"
                style={{ backgroundColor: `${study.color}15` }}
              >
                <span
                  className="text-lg font-bold"
                  style={{ color: study.color }}
                >
                  {study.company}
                </span>
              </div>

              {/* Stat */}
              <p className="mb-2 text-5xl font-bold text-[#03233F]">
                {study.stat}
              </p>
              <p className="mb-6 text-lg text-[#476482]">{study.label}</p>

              {/* CTA */}
              <div className="flex items-center gap-2 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                <span>Read case study</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
