const logos = [
  "Compass",
  "eBay",
  "La-Z-Boy",
  "Twilio",
  "Dropbox",
  "Zendesk",
]

export function SocialProof() {
  return (
    <section className="bg-[#F8F9FA] py-12">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="mb-8 text-center text-sm font-medium text-[#476482] lg:text-base">
          Simplified scheduling for more than{" "}
          <span className="text-[#03233F]">10,000,000</span> users worldwide
        </p>

        {/* Logo Grid */}
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
          {logos.map((logo) => (
            <div
              key={logo}
              className="flex h-8 items-center justify-center opacity-50 grayscale transition-opacity hover:opacity-70"
            >
              <span className="text-lg font-semibold text-[#476482]">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
