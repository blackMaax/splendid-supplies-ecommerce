import { BRAND_INFO } from './seo'

export interface SitemapEntry {
  url: string
  lastModified?: string
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

// Static pages configuration
export const STATIC_PAGES: SitemapEntry[] = [
  {
    url: '/',
    changeFrequency: 'daily',
    priority: 1.0
  },
  {
    url: '/contact',
    changeFrequency: 'monthly',
    priority: 0.8
  },
  {
    url: '/about',
    changeFrequency: 'monthly', 
    priority: 0.7
  },
  {
    url: '/shipping',
    changeFrequency: 'monthly',
    priority: 0.6
  },
  {
    url: '/returns',
    changeFrequency: 'monthly',
    priority: 0.6
  },
  {
    url: '/privacy',
    changeFrequency: 'yearly',
    priority: 0.5
  },
  {
    url: '/terms',
    changeFrequency: 'yearly',
    priority: 0.5
  },
  {
    url: '/cookies',
    changeFrequency: 'yearly',
    priority: 0.5
  },
  {
    url: '/cookie-settings',
    changeFrequency: 'yearly',
    priority: 0.4
  },
  {
    url: '/faq',
    changeFrequency: 'monthly',
    priority: 0.7
  },
  {
    url: '/cart',
    changeFrequency: 'never',
    priority: 0.3
  },
  {
    url: '/success',
    changeFrequency: 'never',
    priority: 0.1
  }
]

// Generate sitemap entries for products
export async function getProductSitemapEntries(): Promise<SitemapEntry[]> {
  try {
    // This would typically fetch from your database
    // For now, we'll use the static products data
    const { products } = await import('../app/data/products')
    
    return products.map(product => {
      // Create slug from product name
      const slug = product.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      return {
        url: `/product/${slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.8
      }
    })
  } catch (error) {
    console.error('Error fetching products for sitemap:', error)
    return []
  }
}

// Generate sitemap entries for categories
export async function getCategorySitemapEntries(): Promise<SitemapEntry[]> {
  const categories = [
    'All Products',
    'Tools & Workwear', 
    'Building Supplies',
    'Roofing Supplies',
    'Cleaning Supplies'
  ]
  
  return categories
    .filter(cat => cat !== 'All Products') // Exclude "All Products" as it's the main page
    .map(category => ({
      url: `/?category=${encodeURIComponent(category)}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.9
    }))
}

// Generate complete sitemap
export async function generateSitemap(): Promise<SitemapEntry[]> {
  const [productEntries, categoryEntries] = await Promise.all([
    getProductSitemapEntries(),
    getCategorySitemapEntries()
  ])
  
  return [
    ...STATIC_PAGES,
    ...categoryEntries,
    ...productEntries
  ]
}

// Convert sitemap entries to XML
export function generateSitemapXML(entries: SitemapEntry[]): string {
  const urls = entries.map(entry => {
    const url = entry.url.startsWith('http') ? entry.url : `https://${BRAND_INFO.domain}${entry.url}`
    
    return `  <url>
    <loc>${url}</loc>
    ${entry.lastModified ? `<lastmod>${entry.lastModified}</lastmod>` : ''}
    ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`
  }).join('\n')
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

// Generate sitemap index for large sites (if needed in future)
export function generateSitemapIndex(sitemaps: string[]): string {
  const sitemapEntries = sitemaps.map(sitemap => `  <sitemap>
    <loc>https://${BRAND_INFO.domain}/${sitemap}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('\n')
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`
} 