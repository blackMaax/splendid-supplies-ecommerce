import { NextRequest, NextResponse } from 'next/server'
import { getProducts, addProduct } from '../../../lib/database'
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
    const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = await request.json()
    
    // Generate new product with ID and timestamps
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      inStock: productData.stock > 0,
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