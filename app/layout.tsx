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
  title: "Splendid Supplies - Quality Tools & Building Supplies",
  description:
    "Your trusted supplier for tools, equipment, building supplies, roofing materials, and cleaning supplies. Free UK delivery and expert service.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
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
