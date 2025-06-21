"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "../context/CartContext"
import Link from "next/link"
import Image from "next/image"

export default function Header() {
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  return (
    <header className="premium-header text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1"></div>

          <Link href="/" className="flex-1 flex justify-center items-center">
            <div className="premium-logo-container transition-all duration-500 transform hover:scale-105">
              <Image
                src="/Splendid Supplies logo.webp"
                alt="Splendid Supplies Logo"
                width={280}
                height={80}
                className="h-12 md:h-16 w-auto drop-shadow-2xl"
                priority
              />
            </div>
          </Link>

          <div className="flex-1 flex justify-end">
            <Link
              href="/cart"
              className="cart-icon-premium relative p-3 hover:bg-white/10 rounded-xl transition-all duration-300 backdrop-blur-sm"
            >
              <ShoppingCart className="w-7 h-7 drop-shadow-lg" />
              {totalItems > 0 && (
                <span className="cart-badge absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
