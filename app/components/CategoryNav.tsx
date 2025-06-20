"use client"

import { useState, useEffect } from "react"

interface CategoryNavProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  const [categories, setCategories] = useState<string[]>(["All Products"])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || ["All Products"])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        // Fallback to default categories
        setCategories(["All Products", "Tools, Equipment & Workwear", "Building Supplies", "Roofing Supplies", "Cleaning Supplies"])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <nav className="premium-category-nav text-white">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex py-4 sm:py-6 space-x-1 sm:space-x-4 justify-center flex-wrap sm:flex-nowrap gap-y-2">
            {/* Loading skeleton */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-8 sm:h-12 w-20 sm:w-32 bg-white/20 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="premium-category-nav text-white">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex py-4 sm:py-6 space-x-1 sm:space-x-4 justify-center flex-wrap sm:flex-nowrap gap-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`category-btn whitespace-nowrap px-2 py-1.5 sm:px-6 sm:py-3 rounded-full font-medium transition-all duration-300 text-xs sm:text-base ${
                activeCategory === category ? "active" : "text-white/90 hover:text-white"
              }`}
            >
              {category === "Tools, Equipment & Workwear" ? "Tools & Workwear" : category}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
