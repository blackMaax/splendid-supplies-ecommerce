"use client"

import { useState } from "react"
import Header from "./components/Header"
import HeroSection from "./components/HeroSection"
import CategoryNav from "./components/CategoryNav"
import ProductGrid from "./components/ProductGrid"
import Footer from "./components/Footer"

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All Products")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <CategoryNav 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <ProductGrid 
        activeCategory={activeCategory} 
        searchQuery={searchQuery}
      />
      <Footer />
    </div>
  )
}
