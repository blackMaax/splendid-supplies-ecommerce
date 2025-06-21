"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, Minus } from "lucide-react"
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
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAdding(true)
    
    // Add the selected quantity to cart
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }

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

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product.stock || 999)) {
      setQuantity(newQuantity)
    }
  }

  const incrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleQuantityChange(quantity + 1)
  }

  const decrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleQuantityChange(quantity - 1)
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

          <div className="p-3 sm:p-6 flex-1 flex flex-col relative z-10">
            <h3 className="font-bold text-white mb-2 sm:mb-3 line-clamp-2 group-hover:text-yellow-300 transition-colors text-sm sm:text-lg leading-tight min-h-[2.5rem] sm:min-h-[3.5rem] drop-shadow-sm mobile-product-title">
              {product.name}
            </h3>
            <div className="flex items-center justify-between mt-auto mobile-product-info">
              <p className="product-price-blue text-xs sm:text-base mobile-price">£{product.price.toFixed(2)}</p>
              {product.stock !== undefined && (
                <div className="text-xs sm:text-sm mobile-stock-status">
                  {product.stock > 10 ? (
                    <span className="text-green-300 font-medium bg-green-900/30 px-2 py-1 rounded-full whitespace-nowrap">In Stock</span>
                  ) : product.stock > 0 ? (
                    <span className="text-orange-300 font-medium bg-orange-900/30 px-2 py-1 rounded-full whitespace-nowrap">Only {product.stock} left</span>
                  ) : (
                    <span className="text-red-300 font-medium bg-red-900/30 px-2 py-1 rounded-full whitespace-nowrap">Out of Stock</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </Link>

        <div className="px-3 pb-3 sm:px-6 sm:pb-6 mt-auto relative z-10">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || (product.stock !== undefined && product.stock <= 0)}
            className={`premium-add-to-cart w-full text-sm sm:text-base py-2 sm:py-3 mb-3 ${isAdding ? "adding" : ""} ${(product.stock !== undefined && product.stock <= 0) ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {(product.stock !== undefined && product.stock <= 0) ? "Out of Stock" : isAdding ? "✓ Added!" : `Add ${quantity > 1 ? `${quantity} ` : ""}to Cart`}
          </button>

          {/* Quantity Selector - Always shown */}
          <div className={`product-card-quantity-selector flex items-center justify-center ${(product.stock !== undefined && product.stock <= 0) ? "out-of-stock" : ""}`}>
            <button
              onClick={decrementQuantity}
              disabled={quantity <= 1 || (product.stock !== undefined && product.stock <= 0)}
              className="quantity-btn-card"
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <span className="quantity-display-card">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              disabled={quantity >= (product.stock || 999) || (product.stock !== undefined && product.stock <= 0)}
              className="quantity-btn-card"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {showNotification && (
        <div className="success-notification">
          <div className="flex items-center space-x-2">
            <span className="text-lg">✓</span>
            <span className="font-semibold">Added {quantity} to cart!</span>
          </div>
          <p className="text-sm opacity-90 mt-1">{product.name}</p>
        </div>
      )}
    </>
  )
}
