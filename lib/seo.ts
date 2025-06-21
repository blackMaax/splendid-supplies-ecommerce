export interface SEOConfig {
  title: string
  description: string
  keywords?: string
  canonical?: string
  ogImage?: string
  noIndex?: boolean
  structuredData?: any
}

export interface ProductSEO {
  name: string
  description: string
  price: number
  category: string
  brand: string
  availability: 'InStock' | 'OutOfStock' | 'PreOrder'
  condition: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition'
  image?: string
  sku?: string
}

// Primary keywords for different page types
export const PRIMARY_KEYWORDS = {
  building_materials: 'building materials, construction supplies, lumber, concrete supplies',
  work_tools: 'work tools, construction tools, power tools, hand tools',
  safety_equipment: 'safety equipment, workwear, safety boots, work gloves',
  cleaning_supplies: 'cleaning supplies, industrial cleaning supplies, janitorial supplies',
  general: 'building materials, construction supplies, work tools, safety equipment, workwear, cleaning supplies'
}

// Long-tail keywords
export const LONG_TAIL_KEYWORDS = {
  online_shopping: 'buy building materials online, construction supplies online',
  local: 'construction supplies near me, building materials near me',
  professional: 'professional work boots, industrial cleaning products',
  quality: 'quality building materials, professional construction tools'
}

// Brand information
export const BRAND_INFO = {
  name: 'Splendid Supplies',
  domain: 'splendidsupplies.shop',
  description: 'Quality building materials, construction tools, workwear & cleaning supplies',
  themeColor: '#ffd700',
  logo: '/Splendid Supplies logo.webp',
  ogImage: '/og-image.jpg'
}

// Generate page title with SEO best practices
export function generateTitle(pageTitle: string, category?: string): string {
  const maxLength = 60
  let title = ''
  
  if (category) {
    title = `${pageTitle} | ${category} | ${BRAND_INFO.name}`
  } else {
    title = `${pageTitle} | ${BRAND_INFO.name}`
  }
  
  // Truncate if too long
  if (title.length > maxLength) {
    title = title.substring(0, maxLength - 3) + '...'
  }
  
  return title
}

// Generate meta description with keywords
export function generateDescription(baseDescription: string, keywords?: string): string {
  const maxLength = 160
  let description = baseDescription
  
  if (keywords && (description.length + keywords.length + 2) <= maxLength) {
    description += `. ${keywords}`
  }
  
  // Truncate if too long
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + '...'
  }
  
  return description
}

// Generate canonical URL
export function generateCanonical(path: string): string {
  return `https://${BRAND_INFO.domain}${path}`
}

// Generate structured data for organization
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": BRAND_INFO.name,
    "url": `https://${BRAND_INFO.domain}`,
    "logo": `https://${BRAND_INFO.domain}${BRAND_INFO.logo}`,
    "description": BRAND_INFO.description,
    "sameAs": [
      "https://www.facebook.com/people/Splendid-Casa/61564633534741/",
      "https://www.instagram.com/splendidcasauk/",
      "https://www.tiktok.com/@splendid.casa",
      "https://twitter.com/Splendidcasa"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": "GB",
      "availableLanguage": "English"
    }
  }
}

// Generate structured data for website
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": BRAND_INFO.name,
    "url": `https://${BRAND_INFO.domain}`,
    "description": BRAND_INFO.description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://${BRAND_INFO.domain}/?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }
}

// Generate structured data for products
export function generateProductSchema(product: ProductSEO, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand || BRAND_INFO.name
    },
    "category": product.category,
    "sku": product.sku,
    "image": product.image ? `https://${BRAND_INFO.domain}${product.image}` : undefined,
    "url": `https://${BRAND_INFO.domain}${url}`,
    "offers": {
      "@type": "Offer",
      "price": product.price.toString(),
      "priceCurrency": "GBP",
      "availability": `https://schema.org/${product.availability}`,
      "itemCondition": `https://schema.org/${product.condition}`,
      "seller": {
        "@type": "Organization",
        "name": BRAND_INFO.name
      }
    }
  }
}

// Generate breadcrumb structured data
export function generateBreadcrumbSchema(breadcrumbs: Array<{name: string, url: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://${BRAND_INFO.domain}${item.url}`
    }))
  }
}

// Generate local business schema (if applicable)
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": BRAND_INFO.name,
    "description": BRAND_INFO.description,
    "url": `https://${BRAND_INFO.domain}`,
    "logo": `https://${BRAND_INFO.domain}${BRAND_INFO.logo}`,
    "image": `https://${BRAND_INFO.domain}${BRAND_INFO.ogImage}`,
    "priceRange": "£",
    "currenciesAccepted": "GBP",
    "paymentAccepted": "Credit Card, Debit Card, PayPal",
    "openingHours": "Mo-Fr 09:00-17:00",
    "areaServed": {
      "@type": "Country",
      "name": "United Kingdom"
    }
  }
}

// SEO configurations for different page types
export const SEO_CONFIGS = {
  homepage: {
    title: "Building Materials & Construction Supplies | Splendid Supplies",
    description: "Quality building materials, construction tools, workwear & cleaning supplies. Shop online for lumber, safety equipment, power tools & more at competitive prices.",
    keywords: `${PRIMARY_KEYWORDS.general}, ${LONG_TAIL_KEYWORDS.online_shopping}`,
    structuredData: [generateOrganizationSchema(), generateWebsiteSchema(), generateLocalBusinessSchema()]
  },
  
  products: {
    title: "Professional Tools & Building Supplies",
    description: "Browse our complete range of construction supplies, work tools, safety equipment and cleaning supplies for professionals and DIY projects.",
    keywords: `${PRIMARY_KEYWORDS.general}, professional construction tools`,
    structuredData: [generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Products", url: "/products" }
    ])]
  },
  
  categories: {
    'Tools & Workwear': {
      title: "Work Tools & Safety Equipment",
      description: "Professional work tools, power tools, hand tools, safety boots, work gloves and workwear for construction and industrial use.",
      keywords: `${PRIMARY_KEYWORDS.work_tools}, ${PRIMARY_KEYWORDS.safety_equipment}`
    },
    'Building Supplies': {
      title: "Building Materials & Construction Supplies",
      description: "Quality building materials including lumber, concrete supplies, construction materials for professional builders and DIY projects.",
      keywords: `${PRIMARY_KEYWORDS.building_materials}, ${LONG_TAIL_KEYWORDS.professional}`
    },
    'Roofing Supplies': {
      title: "Roofing Materials & Supplies",
      description: "Professional roofing supplies, materials and tools for residential and commercial roofing projects.",
      keywords: "roofing supplies, roofing materials, construction supplies"
    },
    'Cleaning Supplies': {
      title: "Industrial & Janitorial Cleaning Supplies",
      description: "Industrial cleaning supplies, janitorial products and professional cleaning equipment for commercial and industrial use.",
      keywords: `${PRIMARY_KEYWORDS.cleaning_supplies}, ${LONG_TAIL_KEYWORDS.professional}`
    }
  },
  
  contact: {
    title: "Contact Us | Splendid Supplies",
    description: "Get in touch with Splendid Supplies for building materials, construction supplies and work tools. Professional customer service and expert advice.",
    keywords: "contact, customer service, building supplies help"
  },
  
  about: {
    title: "About Us | Splendid Supplies",
    description: "Learn about Splendid Supplies - your trusted partner for quality building materials, construction tools and professional supplies.",
    keywords: "about, company information, building supplies specialist"
  }
}

// Generate complete SEO metadata for a page
export function generateSEOMetadata(config: SEOConfig, path: string) {
  const canonical = config.canonical || generateCanonical(path)
  const ogImage = config.ogImage || `https://${BRAND_INFO.domain}${BRAND_INFO.ogImage}`
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    canonical,
    ogImage,
    robots: config.noIndex ? 'noindex, nofollow' : 'index, follow',
    structuredData: config.structuredData
  }
} 