import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import type { Product } from '../../../types'

const PRODUCTS_FILE = path.join(process.cwd(), 'app/data/products.json')

async function readProductsFile() {
  try {
    const fileContents = await fs.readFile(PRODUCTS_FILE, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Error reading products file:', error)
    return { products: [], categories: [] }
  }
}

async function writeProductsFile(data: any) {
  try {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error writing products file:', error)
    return false
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await readProductsFile()
    const product = data.products.find((p: Product) => p.id === id)
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updatedProduct: Partial<Product> = await request.json()
    const data = await readProductsFile()
    
    const productIndex = data.products.findIndex((p: Product) => p.id === id)
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    // Update product with new data and timestamp
    data.products[productIndex] = {
      ...data.products[productIndex],
      ...updatedProduct,
      id: id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
      inStock: updatedProduct.stock !== undefined ? updatedProduct.stock > 0 : data.products[productIndex].inStock,
    }
    
    const success = await writeProductsFile(data)
    if (!success) {
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }
    
    return NextResponse.json(data.products[productIndex])
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await readProductsFile()
    
    const productIndex = data.products.findIndex((p: Product) => p.id === id)
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    const deletedProduct = data.products.splice(productIndex, 1)[0]
    
    const success = await writeProductsFile(data)
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Product deleted successfully', product: deletedProduct })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
} 