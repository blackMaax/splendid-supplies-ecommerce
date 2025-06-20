"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "../types"
import { useCart } from "../context/CartContext"
import { useState, useEffect } from "react"

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAdding(true)
    addToCart(product)

    // Show success notification
    setShowNotification(true)

    // Add cart bounce effect
    const cartIcon = document.querySelector(".cart-icon")
    if (cartIcon) {
      cartIcon.classList.add("cart-premium-bounce")
      setTimeout(() => {
        cartIcon.classList.remove("cart-premium-bounce")
      }, 800)
    }

    setTimeout(() => {
      setIsAdding(false)
    }, 1200)
  }

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showNotification])

  return (
    <>
      <div className="product-card product-card-animate group h-full flex flex-col" style={{ animationDelay: `${index * 0.1}s` }}>
        <Link href={`/product/${product.productUrl || product.id}`} className="flex-1 flex flex-col">
          <div className="product-image-wrapper h-40 sm:h-72 flex items-center justify-center p-3 sm:p-8">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={240}
              height={240}
              className="product-image w-full h-full object-contain"
            />
          </div>

          <div className="p-3 sm:p-6 flex-1 flex flex-col">
            <h3 className="font-bold text-gray-800 mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-900 transition-colors text-sm sm:text-lg leading-tight min-h-[2.5rem] sm:min-h-[3.5rem]">
              {product.name}
            </h3>
            <div className="flex items-center justify-between mt-auto">
              <p className="product-price text-sm sm:text-base">£{product.price.toFixed(2)}</p>
              {product.stock !== undefined && (
                <div className="text-xs sm:text-sm">
                  {product.stock > 10 ? (
                    <span className="text-green-600 font-medium">In Stock</span>
                  ) : product.stock > 0 ? (
                    <span className="text-orange-600 font-medium">Only {product.stock} left</span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </Link>

        <div className="px-3 pb-3 sm:px-6 sm:pb-6 mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || (product.stock !== undefined && product.stock <= 0)}
            className={`premium-add-to-cart w-full text-sm sm:text-base py-2 sm:py-3 ${isAdding ? "adding" : ""} ${(product.stock !== undefined && product.stock <= 0) ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {(product.stock !== undefined && product.stock <= 0) ? "Out of Stock" : isAdding ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
      </div>

      {showNotification && (
        <div className="success-notification">
          <div className="flex items-center space-x-2">
            <span className="text-lg">✓</span>
            <span className="font-semibold">Added to cart!</span>
          </div>
          <p className="text-sm opacity-90 mt-1">{product.name}</p>
        </div>
      )}
    </>
  )
}
