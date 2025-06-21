import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="premium-footer text-white">
      <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
        {/* Responsive grid: stacked on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="footer-company-card">
              <div className="relative z-10">
                <h3 className="logo-font logo-industrial text-3xl sm:text-4xl font-bold text-[#f8c815] mb-4 sm:mb-6">SPLENDID SUPPLIES</h3>
                <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Quality tools, building supplies, and professional equipment for trade and DIY.
                </p>
                <div className="text-gray-300 space-y-2 sm:space-y-3 text-sm sm:text-base">
                  <p className="flex items-center">
                    <span className="mr-3 text-[#f8c815]">📞</span>
                    0207 101 3408
                  </p>
                  <p className="flex items-center">
                    <span className="mr-3 text-[#f8c815]">✉️</span>
                    Sales@SplendidCasa.uk
                  </p>
                  <p className="flex items-center">
                    <span className="mr-3 text-[#f8c815]">📍</span>
                    London, UK
                  </p>
                  <p className="flex items-center text-xs text-gray-400">
                    <span className="mr-3 text-[#f8c815]">🕒</span>
                    Mon-Fri: 9AM-6PM | Sat: 10AM-4PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-1 relative z-10">
            <h4 className="font-bold text-[#f8c815] mb-4 sm:mb-6 text-lg sm:text-xl">Legal</h4>
            <ul className="space-y-2 sm:space-y-4">
              <li>
                <Link href="/privacy" className="footer-link text-gray-300 text-sm sm:text-base">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="footer-link text-gray-300 text-sm sm:text-base">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/returns" className="footer-link text-gray-300 text-sm sm:text-base">
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="footer-link text-gray-300 text-sm sm:text-base">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-settings" className="footer-link text-gray-300 text-sm sm:text-base">
                  Cookie Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="md:col-span-1 relative z-10">
            <h4 className="font-bold text-[#f8c815] mb-4 sm:mb-6 text-lg sm:text-xl">Customer Service</h4>
            <ul className="space-y-2 sm:space-y-4">
              <li>
                <Link href="/contact" className="footer-link text-gray-300 text-sm sm:text-base">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="footer-link text-gray-300 text-sm sm:text-base">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/faq" className="footer-link text-gray-300 text-sm sm:text-base">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="copyright-bar">
        <div className="container mx-auto px-4 py-4 sm:py-6 text-center relative z-10">
          <p className="text-gray-400 text-sm sm:text-base">© {currentYear} Splendid Supplies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}