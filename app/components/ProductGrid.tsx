"use client"

import { useState, useEffect } from "react"
import type { Product } from "../types"
import ProductCard from "./ProductCard"

interface ProductGridProps {
  activeCategory: string
}

export default function ProductGrid({ activeCategory }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        // Only show active products on the frontend
        const activeProducts = data.products.filter((product: Product) => product.active)
        setProducts(activeProducts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products by category
  useEffect(() => {
    if (activeCategory === "All Products") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((product) => product.category === activeCategory))
    }
  }, [activeCategory, products])

  if (loading) {
    return (
      <section className="py-6 sm:py-8">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
            {/* Loading skeleton */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-6 sm:py-8">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-6 sm:py-8">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  )
}
