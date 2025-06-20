"use client"

import { useState } from "react"
import Header from "./components/Header"
import CategoryNav from "./components/CategoryNav"
import ProductGrid from "./components/ProductGrid"
import Footer from "./components/Footer"

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All Products")

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CategoryNav activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      <ProductGrid activeCategory={activeCategory} />
      <Footer />
    </div>
  )
}
