import Link from "next/link"
import Image from "next/image"

const footerLinks = {
  about: {
    title: "About",
    links: [
      { label: "About Calendly", href: "#" },
      { label: "Contact Sales", href: "#" },
      { label: "Newsroom", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
  solutions: {
    title: "Solutions",
    links: [
      { label: "Customer Success", href: "#" },
      { label: "Sales", href: "#" },
      { label: "Recruiting", href: "#" },
      { label: "Education", href: "#" },
      { label: "Marketing", href: "#" },
    ],
  },
  features: {
    title: "Popular Features",
    links: [
      { label: "Embed Calendly", href: "#" },
      { label: "Availability", href: "#" },
      { label: "Sending Notifications", href: "#" },
      { label: "Using Calendly Mobile", href: "#" },
      { label: "Integrations", href: "#" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Video Tutorials", href: "#" },
      { label: "Cookie Settings", href: "#" },
      { label: "Status", href: "#" },
      { label: "Sitemap", href: "#" },
    ],
  },
}

const socialLinks = [
  { label: "Twitter", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Instagram", href: "#" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        {/* Footer Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/calendly-icon.png"
                alt="Calendly"
                width={40}
                height={40}
                className="h-10 w-10"
              />
            </Link>
            <p className="mt-4 text-sm text-[#476482]">
              Easy scheduling ahead
            </p>
            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-sm text-[#476482] transition-colors hover:text-primary"
                  aria-label={social.label}
                >
                  {social.label[0]}
                </Link>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold text-[#03233F]">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#476482] transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 md:flex-row">
          <p className="text-sm text-[#667085]">
            © {new Date().getFullYear()} Calendly, LLC. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-[#667085] transition-colors hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-[#667085] transition-colors hover:text-primary"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-[#667085] transition-colors hover:text-primary"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
