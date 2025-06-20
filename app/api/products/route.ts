import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import type { Product } from '../../types'

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

export async function GET() {
  try {
    const data = await readProductsFile()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = await request.json()
    
    const data = await readProductsFile()
    
    // Generate new ID
    const maxId = Math.max(...data.products.map((p: Product) => parseInt(p.id)), 0)
    const id = (maxId + 1).toString()
    
    // Create product with timestamps
    const product: Product = {
      ...newProduct,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      active: newProduct.active ?? true,
      inStock: newProduct.stock > 0,
    }
    
    data.products.push(product)
    
    const success = await writeProductsFile(data)
    if (!success) {
      return NextResponse.json({ error: 'Failed to save product' }, { status: 500 })
    }
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
} 