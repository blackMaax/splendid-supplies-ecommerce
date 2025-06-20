import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="premium-footer text-white">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        {/* Company Info - Full width on mobile */}
        <div className="mb-8 sm:mb-12">
          <div className="footer-company-card">
            <h3 className="logo-font logo-industrial text-3xl sm:text-4xl font-bold text-[#f8c815] mb-4 sm:mb-6">SPLENDID SUPPLIES</h3>
            <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Your trusted supplier for quality tools, building supplies, and professional equipment.
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
            </div>
          </div>
        </div>

        {/* Legal and Customer Service - Side by side on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-12">
          {/* Legal Links */}
          <div>
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
            </ul>
          </div>

          {/* Customer Service */}
          <div>
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
        <div className="container mx-auto px-4 py-4 sm:py-6 text-center">
          <p className="text-gray-400 text-sm sm:text-base">© {currentYear} Splendid Supplies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
