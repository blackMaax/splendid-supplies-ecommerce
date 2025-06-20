"use client"

import { useState, useEffect } from "react"
import { products } from "../data/products"
import type { Product } from "../types"
import ProductCard from "./ProductCard"

interface ProductGridProps {
  activeCategory: string
}

export default function ProductGrid({ activeCategory }: ProductGridProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

  useEffect(() => {
    if (activeCategory === "All Products") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((product) => product.category === activeCategory))
    }
  }, [activeCategory])

  return (
    <section className="py-6 sm:py-8">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  )
}
