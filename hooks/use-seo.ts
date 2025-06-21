import { useEffect } from 'react'
import { SEOConfig, generateSEOMetadata, BRAND_INFO } from '../lib/seo'

export function useSEO(config: SEOConfig, path: string) {
  const seoData = generateSEOMetadata(config, path)
  
  useEffect(() => {
    // Update document title
    if (seoData.title) {
      document.title = seoData.title
    }
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription && seoData.description) {
      metaDescription.setAttribute('content', seoData.description)
    }
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', seoData.canonical)
    
    // Update Open Graph meta tags
    const updateMetaProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }
    
    updateMetaProperty('og:title', seoData.title)
    updateMetaProperty('og:description', seoData.description)
    updateMetaProperty('og:url', seoData.canonical)
    updateMetaProperty('og:image', seoData.ogImage)
    
    // Update Twitter Card meta tags
    const updateTwitterMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }
    
    updateTwitterMeta('twitter:title', seoData.title)
    updateTwitterMeta('twitter:description', seoData.description)
    updateTwitterMeta('twitter:image', seoData.ogImage)
    
    // Add structured data
    if (seoData.structuredData && seoData.structuredData.length > 0) {
      // Remove existing structured data scripts
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]')
      existingScripts.forEach(script => script.remove())
      
      // Add new structured data
      seoData.structuredData.forEach((schema: any) => {
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.textContent = JSON.stringify(schema)
        document.head.appendChild(script)
      })
    }
  }, [seoData])
  
  return seoData
}

// Helper function to generate page-specific SEO config
export function createPageSEO(
  title: string,
  description: string,
  keywords?: string,
  structuredData?: any[],
  path?: string
): SEOConfig {
  return {
    title: title.includes(BRAND_INFO.name) ? title : `${title} | ${BRAND_INFO.name}`,
    description,
    keywords,
    structuredData,
    canonical: path ? `https://${BRAND_INFO.domain}${path}` : undefined
  }
}

// Generate product page SEO
export function createProductSEO(
  productName: string,
  productDescription: string,
  category: string,
  price: number,
  image?: string,
  slug?: string
): SEOConfig {
  const title = `${productName} | ${category} | ${BRAND_INFO.name}`
  const description = `${productDescription.substring(0, 120)}... Professional-grade ${category.toLowerCase()} for construction and industrial use.`
  const keywords = `${productName.toLowerCase()}, ${category.toLowerCase()}, construction tools, building supplies`
  
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "description": productDescription,
    "category": category,
    "brand": {
      "@type": "Brand",
      "name": BRAND_INFO.name
    },
    "offers": {
      "@type": "Offer",
      "price": price.toString(),
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": BRAND_INFO.name
      }
    },
    "image": image ? `https://${BRAND_INFO.domain}${image}` : undefined
  }
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `https://${BRAND_INFO.domain}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": category,
        "item": `https://${BRAND_INFO.domain}/?category=${encodeURIComponent(category)}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": productName,
        "item": `https://${BRAND_INFO.domain}/product/${slug || productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
      }
    ]
  }
  
  return {
    title,
    description,
    keywords,
    structuredData: [productSchema, breadcrumbSchema],
    canonical: slug ? `https://${BRAND_INFO.domain}/product/${slug}` : undefined
  }
}

// Generate category page SEO
export function createCategorySEO(category: string): SEOConfig {
  const categoryConfig = {
    'Tools & Workwear': {
      title: 'Work Tools & Safety Equipment',
      description: 'Professional work tools, power tools, hand tools, safety boots, work gloves and workwear for construction and industrial use.',
      keywords: 'work tools, construction tools, power tools, hand tools, safety equipment, workwear, safety boots, work gloves'
    },
    'Building Supplies': {
      title: 'Building Materials & Construction Supplies',
      description: 'Quality building materials including lumber, concrete supplies, construction materials for professional builders and DIY projects.',
      keywords: 'building materials, construction supplies, lumber, concrete supplies, professional work boots, industrial cleaning products'
    },
    'Roofing Supplies': {
      title: 'Roofing Materials & Supplies',
      description: 'Professional roofing supplies, materials and tools for residential and commercial roofing projects.',
      keywords: 'roofing supplies, roofing materials, construction supplies'
    },
    'Cleaning Supplies': {
      title: 'Industrial & Janitorial Cleaning Supplies',
      description: 'Industrial cleaning supplies, janitorial products and professional cleaning equipment for commercial and industrial use.',
      keywords: 'cleaning supplies, industrial cleaning supplies, janitorial supplies, professional work boots, industrial cleaning products'
    }
  }
  
  const config = categoryConfig[category as keyof typeof categoryConfig]
  if (!config) {
    return {
      title: `${category} | ${BRAND_INFO.name}`,
      description: `Browse our selection of ${category.toLowerCase()} for professional and DIY projects.`,
      keywords: `${category.toLowerCase()}, building supplies, construction tools`
    }
  }
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `https://${BRAND_INFO.domain}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": category,
        "item": `https://${BRAND_INFO.domain}/?category=${encodeURIComponent(category)}`
      }
    ]
  }
  
  return {
    title: `${config.title} | ${BRAND_INFO.name}`,
    description: config.description,
    keywords: config.keywords,
    structuredData: [breadcrumbSchema],
    canonical: `https://${BRAND_INFO.domain}/?category=${encodeURIComponent(category)}`
  }
} 