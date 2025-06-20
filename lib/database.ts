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

// KV operations (for production)
async function readProductsKV(): Promise<ProductData> {
  try {
    // Dynamically import KV to avoid build issues
    const { kv } = await import('@vercel/kv')
    const [products, categories] = await Promise.all([
      kv.get<Product[]>('products'),
      kv.get<string[]>('categories')
    ])
    return { 
      products: products || [], 
      categories: categories || [] 
    }
  } catch (error) {
    console.error('Error reading from KV:', error)
    // Fallback to file system if KV fails
    return await readProductsFile()
  }
}

async function writeProductsKV(data: ProductData): Promise<boolean> {
  try {
    // Dynamically import KV to avoid build issues
    const { kv } = await import('@vercel/kv')
    await Promise.all([
      kv.set('products', data.products),
      kv.set('categories', data.categories)
    ])
    return true
  } catch (error) {
    console.error('Error writing to KV:', error)
    return false
  }
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

// Migration function - transfers data from JSON to KV
export async function migrateToKV(): Promise<boolean> {
  if (!shouldUseKV()) {
    console.log('KV not available, migration skipped')
    return false
  }
  
  try {
    // Read from local file
    const fileData = await readProductsFile()
    
    // Check if KV already has data
    const { kv } = await import('@vercel/kv')
    const existingProducts = await kv.get<Product[]>('products')
    
    if (existingProducts && existingProducts.length > 0) {
      console.log('KV already has data, migration skipped')
      return true
    }
    
    // Write to KV
    const success = await writeProductsKV(fileData)
    
    if (success) {
      console.log(`Migration successful: ${fileData.products.length} products, ${fileData.categories.length} categories`)
    }
    
    return success
  } catch (error) {
    console.error('Migration failed:', error)
    return false
  }
} 