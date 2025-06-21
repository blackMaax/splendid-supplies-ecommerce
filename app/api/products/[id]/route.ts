import { NextRequest, NextResponse } from 'next/server'
import { getProduct, updateProduct, deleteProduct } from '../../../../lib/database'
import { requireAdmin, getClientIP, rateLimit } from '../../../../lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('GET request for product ID:', id)
    
    const product = await getProduct(id)
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check authentication for admin operations
    const authCheck = await requireAdmin(request)
    if (!authCheck.isAuthorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 })
    }

    // Rate limiting for admin operations
    const clientIP = getClientIP(request)
    if (!rateLimit(`admin-update-${clientIP}`, 10, 60000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    console.log('PUT request for product ID:', id)
    
    const updatedProductData = await request.json()
    console.log('Updated product data:', updatedProductData)

    // Validate required fields
    if (!updatedProductData.name || !updatedProductData.price || !updatedProductData.category) {
      return NextResponse.json({ error: 'Missing required fields: name, price, category' }, { status: 400 })
    }

    // Sanitize input data
    const sanitizedData = {
      ...updatedProductData,
      name: updatedProductData.name.trim(),
      description: updatedProductData.description?.trim() || '',
      category: updatedProductData.category.trim(),
      price: Math.max(0, Number(updatedProductData.price)),
      stock: Math.max(0, Number(updatedProductData.stock || 0)),
      updatedAt: new Date().toISOString(),
    }
    
    const updatedProduct = await updateProduct(id, sanitizedData)
    
    if (!updatedProduct) {
      console.log('Product not found with ID:', id)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    console.log('Product updated successfully:', updatedProduct)
    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      error: 'Failed to update product',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check authentication for admin operations
    const authCheck = await requireAdmin(request)
    if (!authCheck.isAuthorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 })
    }

    // Rate limiting for admin operations
    const clientIP = getClientIP(request)
    if (!rateLimit(`admin-delete-${clientIP}`, 5, 60000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    
    const deletedProduct = await deleteProduct(id)
    
    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Product deleted successfully', product: deletedProduct })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
} 