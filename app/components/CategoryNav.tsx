"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Search, X, ChevronDown } from "lucide-react"

interface CategoryNavProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export default function CategoryNav({ 
  activeCategory, 
  onCategoryChange, 
  searchQuery = "", 
  onSearchChange 
}: CategoryNavProps) {
  const [categories, setCategories] = useState<string[]>(["All Products"])
  const [loading, setLoading] = useState(true)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearchChange?.(query)
    }, 300),
    [onSearchChange]
  )

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setLocalSearchQuery(query)
    debouncedSearch(query)
  }

  // Clear search
  const clearSearch = () => {
    setLocalSearchQuery("")
    onSearchChange?.("")
  }

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    onCategoryChange(category)
    setIsDropdownOpen(false)
  }

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Sync with parent search query
  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

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
          <div className="flex items-center justify-between py-2 sm:py-3 gap-4">
            <div className="flex space-x-1 sm:space-x-4 flex-wrap sm:flex-nowrap gap-y-2">
              {/* Loading skeleton */}
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-8 sm:h-12 w-20 sm:w-32 bg-white/20 rounded-full animate-pulse"
                />
              ))}
            </div>
            <div className="h-8 sm:h-12 w-48 sm:w-64 bg-white/20 rounded-full animate-pulse"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="premium-category-nav text-white">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between py-2 sm:py-3 gap-4">
          
          {/* Desktop Category Buttons - Hidden on mobile */}
          <div className="hidden sm:flex space-x-4 flex-nowrap min-w-0 flex-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`category-btn whitespace-nowrap px-5 rounded-full font-medium transition-all duration-300 text-sm ${
                  activeCategory === category ? "active" : "text-white/90 hover:text-white"
                }`}
              >
                {category === "Tools, Equipment & Workwear" ? "Tools & Workwear" : category}
              </button>
            ))}
          </div>

          {/* Mobile Category Dropdown - Visible on mobile only */}
          <div className="sm:hidden relative flex-1 z-50" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="mobile-category-dropdown w-full flex items-center justify-between px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="truncate">
                {activeCategory === "Tools, Equipment & Workwear" ? "Tools & Workwear" : activeCategory}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="mobile-dropdown-container absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl z-[110] max-h-64 overflow-y-auto transform transition-all duration-200 ease-out backdrop-blur-sm">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`mobile-dropdown-item w-full text-left px-4 py-3 text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                      activeCategory === category 
                        ? "active font-bold shadow-lg transform scale-[1.02]" 
                        : "hover:transform hover:scale-[1.01]"
                    }`}
                  >
                    <span className="relative z-10">
                      {category === "Tools, Equipment & Workwear" ? "Tools & Workwear" : category}
                    </span>
                    {activeCategory === category && (
                      <div className="overlay absolute inset-0 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Bar - Right Side */}
          <div className="relative flex-shrink-0">
            <div className="premium-search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={localSearchQuery}
                onChange={handleSearchChange}
                className="premium-search-input"
                autoComplete="off"
                spellCheck="false"
              />
              {localSearchQuery && (
                <button
                  onClick={clearSearch}
                  className="search-clear-btn"
                  type="button"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
