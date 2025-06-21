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
      <div className="min-h-screen premium-product-page-section">
        <Header />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="animate-pulse">
            <div className="h-6 bg-white/20 rounded w-32 mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-16">
              <div className="space-y-6">
                <div className="h-[500px] bg-white/20 rounded-lg backdrop-blur-sm"></div>
                <div className="flex space-x-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-24 h-24 bg-white/20 rounded-lg backdrop-blur-sm"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="h-8 bg-white/20 rounded w-3/4 backdrop-blur-sm"></div>
                  <div className="h-12 bg-white/20 rounded w-1/2 backdrop-blur-sm"></div>
                  <div className="h-20 bg-white/20 rounded backdrop-blur-sm"></div>
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
      <div className="min-h-screen premium-product-page-section">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center relative z-10">
          <h1 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
            {error || 'Product Not Found'}
          </h1>
          <Link href="/" className="premium-back-button text-blue-300 hover:text-yellow-300 bg-blue-900/30 px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300">
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

      <div className="min-h-screen premium-product-page-section">
        <Header />

        <div className="container mx-auto px-4 py-8 relative z-10">
          <Link
            href="/"
            className="premium-back-button inline-flex items-center text-white hover:text-yellow-300 mb-8 transition-all duration-300 hover:translate-x-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>

          {/* Premium Product Info Bar */}
          <div className="premium-product-info-bar text-black mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-6 flex-wrap gap-y-2">
                {/* Stock Status */}
                <div className="flex items-center space-x-2">
                  {product.inStock ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-700" />
                      <span className="font-semibold text-sm">
                        {product.stock > 10 ? 'In Stock' : `Only ${product.stock} Left`}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-700" />
                      <span className="font-semibold text-sm">Out of Stock</span>
                    </>
                  )}
                </div>

                {/* Free Shipping */}
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-green-700" />
                  <span className="font-semibold text-sm">Free UK Delivery</span>
                </div>

                {/* Estimated Delivery */}
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-blue-700" />
                  <span className="font-semibold text-sm">2-3 Days Delivery</span>
                </div>

                {/* Category */}
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-purple-700" />
                  <span className="font-semibold text-sm">{product.category}</span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex items-center space-x-4">
                {product.weight && (
                  <div className="flex items-center space-x-2">
                    <Weight className="w-4 h-4 text-gray-700" />
                    <span className="font-medium text-sm">{product.weight}kg</span>
                  </div>
                )}
                

              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 mb-16">
            {/* Product Images */}
            <div className="space-y-6">
              <div className="premium-product-image-container product-image-main h-[500px] flex items-center justify-center p-12 relative">
                {product.onSale && (
                  <div className="premium-sale-badge absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold z-10 shadow-lg">
                    Sale
                  </div>
                )}
                {product.featured && (
                  <div className="premium-featured-badge absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold z-10 shadow-lg">
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
                      className={`premium-thumbnail-card thumbnail-card flex-shrink-0 w-24 h-24 p-2 ${selectedImage === index ? "active" : ""}`}
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
            <div className="premium-product-details space-y-8">
              <div className="premium-product-header">
                {product.brand && (
                  <p className="text-yellow-300 font-bold mb-2 text-lg drop-shadow-sm">{product.brand}</p>
                )}
                <h1 className="text-4xl font-bold text-white mb-4 leading-tight drop-shadow-lg">{product.name}</h1>
                
                {/* Pricing */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="premium-price">
                    <span className="currency">£</span>
                    {currentPrice.toFixed(2)}
                  </div>
                  {product.onSale && product.originalPrice && (
                    <div className="text-xl text-gray-300 line-through drop-shadow-sm">
                      £{product.originalPrice.toFixed(2)}
                    </div>
                  )}
                  {product.onSale && product.originalPrice && (
                    <div className="premium-savings-badge bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                      Save £{(product.originalPrice - currentPrice).toFixed(2)}
                    </div>
                  )}
                </div>

                <p className="text-gray-200 leading-relaxed text-lg drop-shadow-sm">{product.description}</p>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {product.tags.map((tag, index) => (
                      <span key={index} className="premium-tag inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="premium-stock-container space-y-2">
                <div className="flex items-center space-x-2">
                  {product.inStock ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-green-300 font-medium drop-shadow-sm">
                        In Stock ({product.stock} available)
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span className="text-red-300 font-medium drop-shadow-sm">Out of Stock</span>
                    </>
                  )}
                </div>
                {isLowStock && product.inStock && (
                  <div className="premium-low-stock flex items-center space-x-2 text-orange-300 bg-orange-900/30 px-3 py-2 rounded-lg backdrop-blur-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Only {product.stock} left in stock!</span>
                  </div>
                )}
              </div>

              {/* Product Benefits */}
              <div className="premium-benefits flex flex-wrap gap-4">
                <div className="premium-benefit inline-flex items-center space-x-2 text-green-300 text-sm bg-green-900/30 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Truck className="w-4 h-4" />
                  <span className="font-medium">Free UK Delivery</span>
                </div>
                {product.weight && (
                  <div className="premium-benefit inline-flex items-center space-x-2 text-gray-300 text-sm bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm">
                    <Weight className="w-4 h-4" />
                    <span className="font-medium">{product.weight}kg</span>
                  </div>
                )}
              </div>

              {/* External Links */}
              {(product.productUrl || product.supplierUrl) && (
                <div className="premium-external-links space-y-2">
                  <h3 className="font-semibold text-white drop-shadow-sm">External Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.productUrl && (
                      <a
                        href={product.productUrl.startsWith('http') ? product.productUrl : `https://yourdomain.shop/product/${product.productUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="premium-external-link inline-flex items-center text-blue-300 hover:text-yellow-300 text-sm bg-blue-900/30 px-3 py-2 rounded-full backdrop-blur-sm transition-all duration-300"
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
                        className="premium-external-link inline-flex items-center text-blue-300 hover:text-yellow-300 text-sm bg-blue-900/30 px-3 py-2 rounded-full backdrop-blur-sm transition-all duration-300"
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
                <div className="premium-quantity-cart space-y-6">
                  <div className="flex items-center space-x-6">
                    <label className="font-semibold text-white text-lg drop-shadow-sm">Quantity:</label>
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
                      className={`premium-add-to-cart-page add-to-cart-btn flex-1 ${isAdding ? "success" : ""} ${!product.inStock ? "opacity-50 cursor-not-allowed" : ""}`}
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
                      className={`premium-floating-btn floating-action-btn ${isWishlisted ? "text-red-400" : "text-gray-300"}`}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                    </button>

                    <button className="premium-floating-btn floating-action-btn text-gray-300">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {!product.inStock && (
                <div className="premium-out-of-stock bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm p-6 rounded-xl text-center border border-gray-600/30">
                  <p className="text-gray-300 font-medium text-lg">This item is currently out of stock</p>
                  <p className="text-sm text-gray-400 mt-2">Check back soon or contact us for availability</p>
                </div>
              )}

              {/* Accordion Sections */}
              <div className="premium-accordion space-y-4">
                {accordionSections.map((section) => (
                  <div key={section.id} className="premium-accordion-section accordion-section">
                    <div className="premium-accordion-header accordion-header" onClick={() => toggleAccordion(section.id)}>
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="text-yellow-400">{section.icon}</div>
                        <h3 className="font-semibold text-white drop-shadow-sm">{section.title}</h3>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-300 transition-transform duration-300 ${
                          expandedSection === section.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    <div className={`premium-accordion-content accordion-content ${expandedSection === section.id ? "open" : ""}`}>
                      <div className="px-20 pb-6 text-gray-200 slide-in-left">{section.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="premium-related-products mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center drop-shadow-lg">You might also like</h2>
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