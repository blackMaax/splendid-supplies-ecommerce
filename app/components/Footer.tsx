import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="premium-footer text-white">
      <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
        {/* Responsive grid: optimized for mobile */}
        <div className="space-y-8">
          {/* Company Info - Full width on all screens */}
          <div className="relative z-10">
            <div className="footer-company-card">
              <div className="relative z-10">
                <div className="mb-4 sm:mb-6">
                  <Image
                    src="/Splendid Supplies logo.webp"
                    alt="Splendid Supplies Logo"
                    width={280}
                    height={80}
                    className="h-12 sm:h-14 w-auto drop-shadow-2xl"
                    priority
                  />
                </div>
                <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Quality tools, building supplies, and professional equipment for trade and DIY.
                </p>
                <div className="text-gray-300 space-y-2 sm:space-y-3 text-sm sm:text-base">
                  <p className="flex items-center">
                    <span className="mr-3 text-[#ffd700]">📞</span>
                    0207 101 3408
                  </p>
                  <p className="flex items-center">
                    <span className="mr-3 text-[#ffd700]">✉️</span>
                    Sales@SplendidCasa.uk
                  </p>
                  <p className="flex items-center">
                    <span className="mr-3 text-[#ffd700]">📍</span>
                    London, UK
                  </p>
                  <p className="flex items-center text-xs text-gray-400">
                    <span className="mr-3 text-[#ffd700]">🕒</span>
                    Mon-Fri: 9AM-6PM | Sat: 10AM-4PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Legal & Customer Service side by side, Desktop: 4 columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
            {/* Legal Links */}
            <div className="relative z-10">
              <h4 className="font-bold text-[#ffd700] mb-3 sm:mb-4 md:mb-6 text-base sm:text-lg md:text-xl">Legal</h4>
              <ul className="space-y-1 sm:space-y-2 md:space-y-4">
                <li>
                  <Link href="/privacy" className="footer-link text-gray-300 text-xs sm:text-sm md:text-base">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="footer-link text-gray-300 text-xs sm:text-sm md:text-base">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="footer-link text-gray-300 text-xs sm:text-sm md:text-base">
                    Returns Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="footer-link text-gray-300 text-xs sm:text-sm md:text-base">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-settings" className="footer-link text-gray-300 text-xs sm:text-sm md:text-base">
                    Cookie Settings
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="relative z-10">
              <h4 className="font-bold text-[#ffd700] mb-3 sm:mb-4 md:mb-6 text-base sm:text-lg md:text-xl">Customer Service</h4>
              <ul className="space-y-1 sm:space-y-2 md:space-y-4">
                <li>
                  <Link href="/contact" className="footer-link text-gray-300 text-xs sm:text-sm md:text-base">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="footer-link text-gray-300 text-xs sm:text-sm md:text-base">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="footer-link text-gray-300 text-xs sm:text-sm md:text-base">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media - Mobile: Full width below, Desktop: Third column */}
            <div className="col-span-2 md:col-span-1 relative z-10">
                             <h4 className="font-bold text-[#ffd700] mb-3 sm:mb-4 md:mb-6 text-base sm:text-lg md:text-xl">Follow Us</h4>
              <div className="grid grid-cols-2 md:block md:space-y-3 gap-2 md:gap-0">
                {/* Twitter */}
                <a 
                  href="https://twitter.com/Splendidcasa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-social-link flex items-center text-gray-300 hover:text-[#ffd700] transition-colors duration-300 text-xs sm:text-sm md:text-base group"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3 flex items-center justify-center">
                    <Twitter className="w-full h-full group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span>@Splendidcasa</span>
                </a>

                {/* Facebook */}
                <a 
                  href="https://www.facebook.com/people/Splendid-Casa/61564633534741/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-social-link flex items-center text-gray-300 hover:text-[#ffd700] transition-colors duration-300 text-xs sm:text-sm md:text-base group"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3 flex items-center justify-center">
                    <Facebook className="w-full h-full group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span>Splendid Casa</span>
                </a>

                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/splendidcasauk/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-social-link flex items-center text-gray-300 hover:text-[#ffd700] transition-colors duration-300 text-xs sm:text-sm md:text-base group"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3 flex items-center justify-center">
                    <Instagram className="w-full h-full group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span>@splendidcasauk</span>
                </a>

                {/* TikTok */}
                <a 
                  href="https://www.tiktok.com/@splendid.casa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-social-link flex items-center text-gray-300 hover:text-[#ffd700] transition-colors duration-300 text-xs sm:text-sm md:text-base group"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3 flex items-center justify-center">
                    <svg className="w-full h-full group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.12 20.5a6.34 6.34 0 0 0 10.86-4.43V7.83a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.16-.26z"/>
                    </svg>
                  </div>
                  <span>@splendid.casa</span>
                </a>
              </div>
            </div>
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