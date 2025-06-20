"use client"

import { categories } from "../data/products"

interface CategoryNavProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
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
