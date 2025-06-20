import { promises as fs } from 'fs'
import path from 'path'
import type { Product } from '../app/types'

const PRODUCTS_FILE = path.join(process.cwd(), 'app/data/products.json')

interface ProductData {
  products: Product[]
  categories: string[]
}

// Local file operations
async function readProductsFile(): Promise<ProductData> {
  try {
    const fileContents = await fs.readFile(PRODUCTS_FILE, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Error reading products file:', error)
    return { products: [], categories: [] }
  }
}

async function writeProductsFile(data: ProductData): Promise<boolean> {
  try {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing products file:', error)
    return false
  }
}

// KV operations (for production) - will be added later when needed
async function readProductsKV(): Promise<ProductData> {
  // This will use Vercel KV when environment variables are available
  // For now, fallback to file system
  return await readProductsFile()
}

async function writeProductsKV(data: ProductData): Promise<boolean> {
  // This will use Vercel KV when environment variables are available
  // For now, fallback to file system
  return await writeProductsFile(data)
}

// Check if we should use KV (when KV environment variables are available)
const shouldUseKV = () => {
  return process.env.NODE_ENV === 'production' && 
         process.env.KV_REST_API_URL && 
         process.env.KV_REST_API_TOKEN
}

// Public API - automatically chooses the right storage method
export async function getProducts(): Promise<ProductData> {
  if (shouldUseKV()) {
    return await readProductsKV()
  } else {
    return await readProductsFile()
  }
}

export async function saveProducts(data: ProductData): Promise<boolean> {
  if (shouldUseKV()) {
    return await writeProductsKV(data)
  } else {
    return await writeProductsFile(data)
  }
}

// Helper functions for individual operations
export async function getProduct(id: string): Promise<Product | null> {
  const data = await getProducts()
  return data.products.find(p => p.id === id || p.productUrl === id) || null
}

export async function addProduct(product: Product): Promise<boolean> {
  const data = await getProducts()
  data.products.push(product)
  
  // Update categories if new one is added
  if (product.category && !data.categories.includes(product.category)) {
    data.categories.push(product.category)
  }
  
  return await saveProducts(data)
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
  const data = await getProducts()
  const index = data.products.findIndex(p => p.id === id)
  
  if (index === -1) return false
  
  data.products[index] = { ...data.products[index], ...updates, updatedAt: new Date().toISOString() }
  
  // Update categories if new one is added
  if (updates.category && !data.categories.includes(updates.category)) {
    data.categories.push(updates.category)
  }
  
  return await saveProducts(data)
}

export async function deleteProduct(id: string): Promise<boolean> {
  const data = await getProducts()
  const index = data.products.findIndex(p => p.id === id)
  
  if (index === -1) return false
  
  data.products.splice(index, 1)
  return await saveProducts(data)
}

export async function getCategories(): Promise<string[]> {
  const data = await getProducts()
  return data.categories
}

// Migration function - can be used later when KV is set up
export async function migrateToKV(): Promise<boolean> {
  if (!shouldUseKV()) {
    console.log('KV not available, migration skipped')
    return false
  }
  
  // This will be implemented when KV is properly set up
  console.log('KV migration will be implemented when needed')
  return true
} 