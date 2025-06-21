"use client"

import { useState } from "react"
import Header from "./components/Header"
import HeroSection from "./components/HeroSection"
import CategoryNav from "./components/CategoryNav"
import ProductGrid from "./components/ProductGrid"
import Footer from "./components/Footer"
import SEOHead from "./components/SEOHead"
import { SEO_CONFIGS } from "../lib/seo"
import { createCategorySEO } from "../hooks/use-seo"

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All Products")
  const [searchQuery, setSearchQuery] = useState("")

  // Generate SEO config based on active category
  const getSEOConfig = () => {
    if (activeCategory === "All Products") {
      return {
        title: SEO_CONFIGS.homepage.title,
        description: SEO_CONFIGS.homepage.description,
        keywords: SEO_CONFIGS.homepage.keywords,
        structuredData: SEO_CONFIGS.homepage.structuredData
      }
    } else {
      const categorySEO = createCategorySEO(activeCategory)
      return categorySEO
    }
  }

  const seoConfig = getSEOConfig()

  return (
    <>
      <SEOHead
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords}
        canonical={seoConfig.canonical || "https://splendidsupplies.shop/"}
        structuredData={seoConfig.structuredData}
      />
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
    </>
  )
}
