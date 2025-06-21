import type React from "react"
import type { Metadata } from "next"
import { Inter, Bebas_Neue } from "next/font/google"
import "./globals.css"
import { CartProvider } from "./context/CartContext"
import AuthSessionProvider from "./components/SessionProvider"
import CookieConsent from "./components/CookieConsent"
import Analytics from "./components/Analytics"

const logoFont = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-logo",
})

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Building Materials & Construction Supplies | Splendid Supplies",
  description: "Quality building materials, construction tools, workwear & cleaning supplies. Shop online for lumber, safety equipment, power tools & more at competitive prices.",
  keywords: "building materials, construction supplies, work tools, safety equipment, workwear, cleaning supplies, construction tools, building supplies, buy building materials online",
  authors: [{ name: "Splendid Supplies" }],
  creator: "Splendid Supplies",
  publisher: "Splendid Supplies",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://splendidsupplies.shop',
    siteName: 'Splendid Supplies',
    title: 'Building Materials & Construction Supplies | Splendid Supplies',
    description: 'Quality building materials, construction tools, workwear & cleaning supplies. Shop online for lumber, safety equipment, power tools & more at competitive prices.',
    images: [
      {
        url: 'https://splendidsupplies.shop/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Splendid Supplies - Quality Building Materials & Construction Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Splendidcasa',
    creator: '@Splendidcasa',
    title: 'Building Materials & Construction Supplies | Splendid Supplies',
    description: 'Quality building materials, construction tools, workwear & cleaning supplies. Shop online for lumber, safety equipment, power tools & more at competitive prices.',
    images: ['https://splendidsupplies.shop/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://splendidsupplies.shop',
  },
  other: {
    'theme-color': '#ffd700',
    'msapplication-TileColor': '#ffd700',
    'google-site-verification': 'GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE',
    'msvalidate.01': 'BING_VERIFICATION_CODE',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" itemScope itemType="https://schema.org/WebSite">
      <head>
        <link rel="preload" href="/Splendid Supplies logo.webp" as="image" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={`${inter.className} ${logoFont.variable}`}>
        <AuthSessionProvider>
          <CartProvider>
            {children}
            <CookieConsent />
            <Analytics />
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}
