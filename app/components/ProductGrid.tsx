"use client"

import { useState, useEffect } from "react"
import type { Product } from "../types"
import ProductCard from "./ProductCard"

interface ProductGridProps {
  activeCategory: string
  searchQuery?: string
}

export default function ProductGrid({ activeCategory, searchQuery = "" }: ProductGridProps) {
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

  // Comprehensive search function
  const searchProducts = (products: Product[], query: string): Product[] => {
    if (!query.trim()) return products

    const searchTerm = query.toLowerCase().trim()
    
    return products.filter((product) => {
      // Search in product name
      const nameMatch = product.name.toLowerCase().includes(searchTerm)
      
      // Search in product description
      const descriptionMatch = product.description?.toLowerCase().includes(searchTerm) || false
      
      // Search in product category
      const categoryMatch = product.category.toLowerCase().includes(searchTerm)
      
      // Search in product tags/keywords (if they exist)
      const tagsMatch = product.tags?.some(tag => 
        tag.toLowerCase().includes(searchTerm)
      ) || false
      
      // Fuzzy search for common typos and partial matches
      const fuzzyNameMatch = fuzzyMatch(product.name.toLowerCase(), searchTerm)
      const fuzzyDescriptionMatch = product.description ? 
        fuzzyMatch(product.description.toLowerCase(), searchTerm) : false
      
      return nameMatch || descriptionMatch || categoryMatch || tagsMatch || 
             fuzzyNameMatch || fuzzyDescriptionMatch
    })
  }

  // Simple fuzzy matching function
  const fuzzyMatch = (text: string, pattern: string): boolean => {
    // Remove spaces and special characters for fuzzy matching
    const cleanText = text.replace(/[^a-z0-9]/g, '')
    const cleanPattern = pattern.replace(/[^a-z0-9]/g, '')
    
    if (cleanPattern.length === 0) return false
    if (cleanPattern.length > cleanText.length) return false
    
    let patternIndex = 0
    for (let i = 0; i < cleanText.length && patternIndex < cleanPattern.length; i++) {
      if (cleanText[i] === cleanPattern[patternIndex]) {
        patternIndex++
      }
    }
    
    return patternIndex === cleanPattern.length
  }

  // Filter products by category and search query
  useEffect(() => {
    let filtered = products

    // First filter by category
    if (activeCategory !== "All Products") {
      filtered = filtered.filter((product) => product.category === activeCategory)
    }

    // Then apply search filter
    if (searchQuery.trim()) {
      filtered = searchProducts(filtered, searchQuery)
    }

    setFilteredProducts(filtered)
  }, [activeCategory, searchQuery, products])

  if (loading) {
    return (
      <section className="premium-product-section py-6 sm:py-8">
        <div className="container mx-auto px-2 sm:px-4 relative z-10">
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
      <section className="premium-product-section py-6 sm:py-8">
        <div className="container mx-auto px-2 sm:px-4 relative z-10">
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

  // Determine what message to show when no products found
  const getNoResultsMessage = () => {
    if (searchQuery.trim() && activeCategory !== "All Products") {
      return `No products found for "${searchQuery}" in ${activeCategory}.`
    } else if (searchQuery.trim()) {
      return `No products found for "${searchQuery}".`
    } else if (activeCategory !== "All Products") {
      return `No products found in ${activeCategory}.`
    }
    return "No products found."
  }

  return (
    <section className="premium-product-section py-6 sm:py-8">
      <div className="container mx-auto px-2 sm:px-4 relative z-10">
        {/* Results summary */}
        {(searchQuery.trim() || activeCategory !== "All Products") && (
          <div className="mb-6 text-center">
            <p className="text-white/80 text-sm sm:text-base">
              {filteredProducts.length > 0 ? (
                <>
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                  {searchQuery.trim() && ` for "${searchQuery}"`}
                  {activeCategory !== "All Products" && ` in ${activeCategory}`}
                </>
              ) : null}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-white/70 text-lg mb-4">
              {getNoResultsMessage()}
            </div>
            {searchQuery.trim() && (
              <p className="text-white/50 text-sm">
                Try adjusting your search terms or browse our categories above.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
