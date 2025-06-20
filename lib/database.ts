// import { kv } from '@vercel/kv'
import { promises as fs } from 'fs'
import path from 'path'
import type { Product } from '../app/types'

const PRODUCTS_FILE = path.join(process.cwd(), 'app/data/products.json')
const PRODUCTS_KEY = 'products'
const CATEGORIES_KEY = 'categories'

// Check if we're in production with KV available
const isProduction = () => process.env.NODE_ENV === 'production' && process.env.KV_REST_API_URL

interface ProductData {
  products: Product[]
  categories: string[]
}

// Local file operations (for development)
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
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(data, null, 2), 'utf8')
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
      kv.get<Product[]>(PRODUCTS_KEY),
      kv.get<string[]>(CATEGORIES_KEY)
    ])
    return { 
      products: products || [], 
      categories: categories || [] 
    }
  } catch (error) {
    console.error('Error reading from KV:', error)
    return { products: [], categories: [] }
  }
}

async function writeProductsKV(data: ProductData): Promise<boolean> {
  try {
    // Dynamically import KV to avoid build issues
    const { kv } = await import('@vercel/kv')
    await Promise.all([
      kv.set(PRODUCTS_KEY, data.products),
      kv.set(CATEGORIES_KEY, data.categories)
    ])
    return true
  } catch (error) {
    console.error('Error writing to KV:', error)
    return false
  }
}

// Public API - automatically chooses the right storage method
export async function getProducts(): Promise<ProductData> {
  if (isProduction()) {
    return await readProductsKV()
  } else {
    return await readProductsFile()
  }
}

export async function saveProducts(data: ProductData): Promise<boolean> {
  if (isProduction()) {
    return await writeProductsKV(data)
  } else {
    return await writeProductsFile(data)
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  const data = await getProducts()
  return data.products.find(p => p.id === id) || null
}

export async function addProduct(product: Product): Promise<boolean> {
  const data = await getProducts()
  data.products.push(product)
  
  // Update categories if new category
  if (product.category && !data.categories.includes(product.category)) {
    data.categories.push(product.category)
  }
  
  return await saveProducts(data)
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const data = await getProducts()
  const productIndex = data.products.findIndex(p => p.id === id)
  
  if (productIndex === -1) {
    return null
  }
  
  // Update product
  data.products[productIndex] = {
    ...data.products[productIndex],
    ...updates,
    id: id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString(),
    inStock: updates.stock !== undefined ? updates.stock > 0 : data.products[productIndex].inStock,
  }
  
  // Update categories if new category
  if (updates.category && !data.categories.includes(updates.category)) {
    data.categories.push(updates.category)
  }
  
  const success = await saveProducts(data)
  return success ? data.products[productIndex] : null
}

export async function deleteProduct(id: string): Promise<Product | null> {
  const data = await getProducts()
  const productIndex = data.products.findIndex(p => p.id === id)
  
  if (productIndex === -1) {
    return null
  }
  
  const deletedProduct = data.products.splice(productIndex, 1)[0]
  const success = await saveProducts(data)
  
  return success ? deletedProduct : null
}

// Initialize KV with existing data (run once to migrate from JSON to KV)
export async function migrateToKV(): Promise<boolean> {
  if (!isProduction()) {
    console.log('Migration only runs in production')
    return false
  }
  
  try {
    // Check if KV already has data
    const { kv } = await import('@vercel/kv')
    const existingProducts = await kv.get<Product[]>(PRODUCTS_KEY)
    if (existingProducts && existingProducts.length > 0) {
      console.log('KV already has data, skipping migration')
      return true
    }
    
    // Read from local file and migrate to KV
    const localData = await readProductsFile()
    if (localData.products.length > 0) {
      await writeProductsKV(localData)
      console.log(`Migrated ${localData.products.length} products to KV`)
      return true
    }
    
    return false
  } catch (error) {
    console.error('Migration error:', error)
    return false
  }
} 