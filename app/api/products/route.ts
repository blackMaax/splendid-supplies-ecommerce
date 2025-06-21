import { NextRequest, NextResponse } from 'next/server'
import { getProducts, addProduct } from '../../../lib/database'
import { requireAdmin, getClientIP, rateLimit } from '../../../lib/auth'
import type { Product } from '../../types'

export async function GET() {
  try {
    const data = await getProducts()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication for admin operations
    const authCheck = await requireAdmin(request)
    if (!authCheck.isAuthorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 })
    }

    // Rate limiting for admin operations
    const clientIP = getClientIP(request)
    if (!rateLimit(`admin-create-${clientIP}`, 5, 60000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = await request.json()
    
    // Validate required fields
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json({ error: 'Missing required fields: name, price, category' }, { status: 400 })
    }

    // Sanitize input data
    const sanitizedData = {
      ...productData,
      name: productData.name.trim(),
      description: productData.description?.trim() || '',
      category: productData.category.trim(),
      price: Math.max(0, Number(productData.price)),
      stock: Math.max(0, Number(productData.stock || 0)),
    }
    
    // Generate new product with ID and timestamps
    const newProduct: Product = {
      ...sanitizedData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      inStock: sanitizedData.stock > 0,
    }
    
    const success = await addProduct(newProduct)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to save product' }, { status: 500 })
    }
    
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
} 