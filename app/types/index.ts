export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  images?: string[]
  
  // Inventory & Stock
  stock: number
  inStock: boolean
  lowStockThreshold?: number
  
  // SEO & Marketing
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  tags?: string[]
  
  // External Links
  productUrl?: string
  supplierUrl?: string
  
  // Product Details
  brand?: string
  model?: string
  weight?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  
  // Pricing & Offers
  originalPrice?: number
  salePrice?: number
  onSale?: boolean
  
  // Status & Visibility
  featured?: boolean
  active: boolean
  
  // Timestamps
  createdAt: string
  updatedAt: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  getTotalItems: () => number
  getTotalPrice: () => number
  clearCart: () => void
}
