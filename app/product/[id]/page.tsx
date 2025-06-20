"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { products } from "../../data/products"
import { useCart } from "../../context/CartContext"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import ProductCard from "../../components/ProductCard"

export default function ProductPage() {
  const params = useParams()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)


  const product = products.find((p) => p.id === params.id)

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 6)
  const productImages = product.images || [product.image]

  const handleAddToCart = async () => {
    setIsAdding(true)
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }

    // Add cart bounce effect
    const cartIcon = document.querySelector(".cart-icon-premium")
    if (cartIcon) {
      cartIcon.classList.add("cart-premium-bounce")
      setTimeout(() => {
        cartIcon.classList.remove("cart-premium-bounce")
      }, 800)
    }

    setTimeout(() => {
      setIsAdding(false)
    }, 1500)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
      // Add count animation
      const input = document.querySelector(".quantity-input")
      if (input) {
        input.classList.add("count-animation")
        setTimeout(() => input.classList.remove("count-animation"), 300)
      }
    }
  }

  const toggleAccordion = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }



  const accordionSections = [
    {
      id: "specifications",
      title: "Product Specifications",
      icon: <Shield className="w-5 h-5" />,
      content: "Detailed product specifications and technical information will be displayed here.",
    },
    {
      id: "shipping",
      title: "Shipping Information",
      icon: <Truck className="w-5 h-5" />,
      content: "Free UK delivery on orders over £50. Standard delivery takes 2-3 business days.",
    },
    {
      id: "warranty",
      title: "Warranty & Returns",
      icon: <CheckCircle className="w-5 h-5" />,
      content: "12-month warranty included. 30-day return policy for unused items in original packaging.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-all duration-300 hover:translate-x-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 mb-16">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="product-image-main h-[500px] flex items-center justify-center p-12">
              <Image
                src={productImages[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={400}
                height={400}
                className="w-full h-full object-contain transition-all duration-500"
              />
            </div>

            {productImages.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`thumbnail-card flex-shrink-0 w-24 h-24 p-2 ${selectedImage === index ? "active" : ""}`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">{product.name}</h1>
              <div className="premium-price mb-6">
                <span className="currency">£</span>
                {product.price.toFixed(2)}
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="trust-badge">
                <CheckCircle className="w-4 h-4" />
                In Stock
              </div>
              <div className="trust-badge">
                <Truck className="w-4 h-4" />
                Free Delivery
              </div>
              <div className="trust-badge">
                <Shield className="w-4 h-4" />
                Warranty Included
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <label className="font-semibold text-gray-700 text-lg">Quantity:</label>
                <div className="quantity-selector">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="quantity-btn"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                    className="quantity-input"
                    min="1"
                  />
                  <button onClick={() => handleQuantityChange(quantity + 1)} className="quantity-btn">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`add-to-cart-btn flex-1 ${isAdding ? "success" : ""}`}
                >
                  {isAdding ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add {quantity} to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`floating-action-btn ${isWishlisted ? "text-red-500" : "text-gray-600"}`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>

                <button className="floating-action-btn text-gray-600">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Accordion Sections */}
            <div className="space-y-4">
              {accordionSections.map((section) => (
                <div key={section.id} className="accordion-section">
                  <div className="accordion-header" onClick={() => toggleAccordion(section.id)}>
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="text-blue-600">{section.icon}</div>
                      <h3 className="font-semibold text-gray-800">{section.title}</h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                        expandedSection === section.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <div className={`accordion-content ${expandedSection === section.id ? "open" : ""}`}>
                    <div className="px-20 pb-6 text-gray-600 slide-in-left">{section.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 text-center">You might also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 6).map((relatedProduct, index) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
