"use client"

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, Lock, LogOut } from 'lucide-react'
import type { Product } from '../types'
import ImageUpload from '../components/ImageUpload'

interface ProductFormData extends Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    originalPrice: 0,
    salePrice: 0,
    onSale: false,
    image: '',
    description: '',
    category: '',
    images: [],
    stock: 0,
    inStock: true,
    lowStockThreshold: 5,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [],
    tags: [],
    productUrl: '',
    supplierUrl: '',
    brand: '',
    model: '',
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    featured: false,
    active: true
  })

  // Authentication check
  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (status === 'unauthenticated' || !session?.user?.role || session.user.role !== 'admin') {
      router.push('/admin/login')
      return
    }

    fetchProducts()
  }, [status, session, router])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data.products || [])
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate that we have at least a main image
    if (!formData.image || formData.image.trim() === '') {
      alert('Please upload an image or enter an image URL')
      return
    }

    setLoading(true)

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchProducts()
        resetForm()
      } else {
        const errorData = await response.json()
        alert(`Error saving product: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await fetchProducts()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      salePrice: product.salePrice || 0,
      onSale: product.onSale || false,
      image: product.image,
      description: product.description,
      category: product.category,
      images: product.images || [],
      stock: product.stock,
      inStock: product.inStock,
      lowStockThreshold: product.lowStockThreshold || 5,
      seoTitle: product.seoTitle || '',
      seoDescription: product.seoDescription || '',
      seoKeywords: product.seoKeywords || [],
      tags: product.tags || [],
      productUrl: product.productUrl || '',
      supplierUrl: product.supplierUrl || '',
      brand: product.brand || '',
      model: product.model || '',
      weight: product.weight || 0,
      dimensions: product.dimensions || { length: 0, width: 0, height: 0 },
      featured: product.featured || false,
      active: product.active
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setEditingProduct(null)
    setShowForm(false)
    setFormData({
      name: '',
      price: 0,
      originalPrice: 0,
      salePrice: 0,
      onSale: false,
      image: '',
      description: '',
      category: '',
      images: [],
      stock: 0,
      inStock: true,
      lowStockThreshold: 5,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: [],
      tags: [],
      productUrl: '',
      supplierUrl: '',
      brand: '',
      model: '',
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      featured: false,
      active: true
    })
  }

  const handleArrayInput = (field: 'seoKeywords' | 'tags' | 'images', value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item)
    setFormData(prev => ({ ...prev, [field]: array }))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      // Auto-generate slug if it's empty or if creating a new product
      productUrl: (!prev.productUrl || !editingProduct) ? generateSlug(name) : prev.productUrl
    }))
  }

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show access denied if not authenticated or not admin
  if (status === 'unauthenticated' || !session?.user?.role || session.user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <button
            onClick={() => router.push('/admin/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
            <p className="text-gray-600">Welcome, {session?.user?.name || session?.user?.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.filter(cat => cat !== 'All Products').map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <input
                          type="text"
                          value={formData.brand}
                          onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                        <input
                          type="text"
                          value={formData.model}
                          onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Pricing & Stock */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">Pricing & Stock</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (£)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (£)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price (£)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.salePrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, salePrice: parseFloat(e.target.value) || 0 }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                        <input
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                        <input
                          type="number"
                          value={formData.lowStockThreshold}
                          onChange={(e) => setFormData(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) || 0 }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.weight}
                          onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Images</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Main Product Image</label>
                      <ImageUpload
                        onUpload={(imageUrls) => {
                          if (imageUrls.length > 0) {
                            setFormData(prev => ({ ...prev, image: imageUrls[0] }))
                          }
                        }}
                        currentImages={formData.image ? [formData.image] : []}
                        multiple={false}
                        className="mb-4"
                      />
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Or enter image URL manually"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                      <ImageUpload
                        onUpload={(imageUrls) => {
                          setFormData(prev => ({ ...prev, images: imageUrls }))
                        }}
                        currentImages={formData.images || []}
                        multiple={true}
                        maxFiles={5}
                        className="mb-4"
                      />
                      <input
                        type="text"
                        value={formData.images?.join(', ') || ''}
                        onChange={(e) => handleArrayInput('images', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Or enter comma-separated URLs manually"
                      />
                    </div>
                  </div>

                  {/* SEO */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">SEO & Marketing</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                      <input
                        type="text"
                        value={formData.seoTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={60}
                      />
                      <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                      <textarea
                        value={formData.seoDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={160}
                      />
                      <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords (comma separated)</label>
                      <input
                        type="text"
                        value={formData.seoKeywords?.join(', ') || ''}
                        onChange={(e) => handleArrayInput('seoKeywords', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={formData.tags?.join(', ') || ''}
                        onChange={(e) => handleArrayInput('tags', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="bestseller, featured, new"
                      />
                    </div>
                  </div>

                  {/* External Links */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">External Links</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Slug</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          yourdomain.shop/product/
                        </span>
                        <input
                          type="text"
                          value={formData.productUrl}
                          onChange={(e) => setFormData(prev => ({ ...prev, productUrl: e.target.value }))}
                          className="flex-1 border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="product-slug"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, productUrl: generateSlug(formData.name) }))}
                          className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100 text-sm"
                          title="Generate slug from product name"
                        >
                          ↻
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">URL-friendly slug for this product (e.g., "lead-sealant-310ml")</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Supplier URL</label>
                      <input
                        type="url"
                        value={formData.supplierUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, supplierUrl: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://supplier.com/product"
                      />
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Dimensions (cm)</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.dimensions?.length || 0}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            dimensions: { ...prev.dimensions, length: parseFloat(e.target.value) || 0 }
                          }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.dimensions?.width || 0}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            dimensions: { ...prev.dimensions, width: parseFloat(e.target.value) || 0 }
                          }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.dimensions?.height || 0}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            dimensions: { ...prev.dimensions, height: parseFloat(e.target.value) || 0 }
                          }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Settings</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.onSale}
                          onChange={(e) => setFormData(prev => ({ ...prev, onSale: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">On Sale</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Featured</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.active}
                          onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Active</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.inStock}
                          onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">In Stock</span>
                      </label>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt={product.name} />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.brand} {product.model}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">£{product.price}</div>
                      {product.onSale && product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">£{product.originalPrice}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.stock}</div>
                      <div className={`text-xs ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {product.active ? (
                          <Eye className="w-4 h-4 text-green-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                        {product.featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                        {product.onSale && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Sale
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found. Add your first product to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
} 