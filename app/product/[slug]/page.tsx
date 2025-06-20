"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Head from "next/head"
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
  ExternalLink,
  Package,
  Ruler,
  Weight,
  Tag,
  AlertTriangle,
} from "lucide-react"
import type { Product } from "../../types"
import { useCart } from "../../context/CartContext"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import ProductCard from "../../components/ProductCard"

export default function ProductSlugPage() {
  const params = useParams()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProductBySlug = async () => {
      if (!params.slug) return

      try {
        setLoading(true)
        
        // Fetch all products and find by slug
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        const foundProduct = data.products.find((p: Product) => 
          p.productUrl === params.slug || p.id === params.slug // Support both slug and ID for backward compatibility
        )
        
        if (!foundProduct) {
          setError('Product not found')
          return
        }
        
        setProduct(foundProduct)

        // Fetch related products
        const related = data.products
          .filter((p: Product) => p.category === foundProduct.category && p.id !== foundProduct.id && p.active)
          .slice(0, 6)
        setRelatedProducts(related)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product')
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProductBySlug()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-16">
              <div className="space-y-6">
                <div className="h-[500px] bg-gray-200 rounded-lg"></div>
                <div className="flex space-x-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-12 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Product Not Found'}
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const productImages = (product.images && product.images.length > 0) ? product.images : [product.image]
  const currentPrice = product.onSale && product.salePrice ? product.salePrice : product.price
  const isLowStock = product.stock <= (product.lowStockThreshold || 5)

  const handleAddToCart = async () => {
    if (!product.inStock || product.stock === 0) return
    
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
    if (newQuantity >= 1 && newQuantity <= product.stock) {
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
      content: (
        <div className="space-y-4">
          {product.brand && (
            <div className="flex justify-between">
              <span className="font-medium">Brand:</span>
              <span>{product.brand}</span>
            </div>
          )}
          {product.model && (
            <div className="flex justify-between">
              <span className="font-medium">Model:</span>
              <span>{product.model}</span>
            </div>
          )}
          {product.weight && (
            <div className="flex justify-between">
              <span className="font-medium">Weight:</span>
              <span>{product.weight}kg</span>
            </div>
          )}
          {product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height) && (
            <div className="flex justify-between">
              <span className="font-medium">Dimensions (L×W×H):</span>
              <span>
                {product.dimensions.length || 0} × {product.dimensions.width || 0} × {product.dimensions.height || 0} cm
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-medium">Category:</span>
            <span>{product.category}</span>
          </div>
        </div>
      ),
    },
    {
      id: "shipping",
      title: "Shipping Information",
      icon: <Truck className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>Free UK delivery on orders over £50. Standard delivery takes 2-3 business days.</p>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center text-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">This item qualifies for free delivery</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "warranty",
      title: "Warranty & Returns",
      icon: <CheckCircle className="w-5 h-5" />,
      content: (
        <div className="space-y-3">
          <p>12-month warranty included. 30-day return policy for unused items in original packaging.</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Full refund within 30 days</li>
            <li>Free return shipping on defective items</li>
            <li>Manufacturer warranty support</li>
          </ul>
        </div>
      ),
    },
  ]

  return (
    <>
      <Head>
        <title>{product.seoTitle || `${product.name} | Splendid Supplies`}</title>
        <meta name="description" content={product.seoDescription || product.description} />
        {product.seoKeywords && product.seoKeywords.length > 0 && (
          <meta name="keywords" content={product.seoKeywords.join(', ')} />
        )}
        <meta property="og:title" content={product.seoTitle || product.name} />
        <meta property="og:description" content={product.seoDescription || product.description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={currentPrice.toString()} />
        <meta property="product:price:currency" content="GBP" />
        <meta property="product:availability" content={product.inStock ? "in stock" : "out of stock"} />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_DOMAIN}/product/${product.productUrl || product.id}`} />
      </Head>

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
              <div className="product-image-main h-[500px] flex items-center justify-center p-12 relative">
                {product.onSale && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                    Sale
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                    Featured
                  </div>
                )}
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
                {product.brand && (
                  <p className="text-blue-600 font-medium mb-2">{product.brand}</p>
                )}
                <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">{product.name}</h1>
                
                {/* Pricing */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="premium-price">
                    <span className="currency">£</span>
                    {currentPrice.toFixed(2)}
                  </div>
                  {product.onSale && product.originalPrice && (
                    <div className="text-xl text-gray-500 line-through">
                      £{product.originalPrice.toFixed(2)}
                    </div>
                  )}
                  {product.onSale && product.originalPrice && (
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      Save £{(product.originalPrice - currentPrice).toFixed(2)}
                    </div>
                  )}
                </div>

                <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {product.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {product.inStock ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-600 font-medium">
                        In Stock ({product.stock} available)
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span className="text-red-600 font-medium">Out of Stock</span>
                    </>
                  )}
                </div>
                {isLowStock && product.inStock && (
                  <div className="flex items-center space-x-2 text-orange-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm">Only {product.stock} left in stock!</span>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4">
                <div className="trust-badge">
                  <Truck className="w-4 h-4" />
                  Free Delivery
                </div>
                <div className="trust-badge">
                  <Shield className="w-4 h-4" />
                  Warranty Included
                </div>
                {product.weight && (
                  <div className="trust-badge">
                    <Weight className="w-4 h-4" />
                    {product.weight}kg
                  </div>
                )}
              </div>

              {/* External Links */}
              {(product.productUrl || product.supplierUrl) && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">External Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.productUrl && (
                      <a
                        href={product.productUrl.startsWith('http') ? product.productUrl : `https://yourdomain.shop/product/${product.productUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Product Page
                      </a>
                    )}
                    {product.supplierUrl && (
                      <a
                        href={product.supplierUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Supplier
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              {product.inStock && (
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
                        max={product.stock}
                      />
                      <button 
                        onClick={() => handleQuantityChange(quantity + 1)} 
                        className="quantity-btn"
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={isAdding || !product.inStock}
                      className={`add-to-cart-btn flex-1 ${isAdding ? "success" : ""} ${!product.inStock ? "opacity-50 cursor-not-allowed" : ""}`}
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
              )}

              {!product.inStock && (
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="text-gray-600 font-medium">This item is currently out of stock</p>
                  <p className="text-sm text-gray-500 mt-1">Check back soon or contact us for availability</p>
                </div>
              )}

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
    </>
  )
} 