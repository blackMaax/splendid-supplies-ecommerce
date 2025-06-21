import Head from 'next/head'
import { BRAND_INFO } from '../../lib/seo'

interface SEOHeadProps {
  title: string
  description: string
  keywords?: string
  canonical?: string
  ogImage?: string
  robots?: string
  structuredData?: any[]
  noIndex?: boolean
}

export default function SEOHead({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  robots = 'index, follow',
  structuredData = [],
  noIndex = false
}: SEOHeadProps) {
  const finalCanonical = canonical || `https://${BRAND_INFO.domain}`
  const finalOgImage = ogImage || `https://${BRAND_INFO.domain}${BRAND_INFO.ogImage}`
  const finalRobots = noIndex ? 'noindex, nofollow' : robots

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={finalRobots} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={finalCanonical} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content={BRAND_INFO.name} />
      <meta name="copyright" content={`© ${new Date().getFullYear()} ${BRAND_INFO.name}`} />
      <meta name="rating" content="General" />
      <meta name="distribution" content="Global" />
      <meta name="theme-color" content={BRAND_INFO.themeColor} />
      <meta name="msapplication-TileColor" content={BRAND_INFO.themeColor} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:site_name" content={BRAND_INFO.name} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalOgImage} />
      <meta name="twitter:site" content="@Splendidcasa" />
      <meta name="twitter:creator" content="@Splendidcasa" />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch for External Resources */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      
      {/* Structured Data */}
      {structuredData && structuredData.length > 0 && (
        <>
          {structuredData.map((schema, index) => (
            <script
              key={index}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema)
              }}
            />
          ))}
        </>
      )}
      
      {/* Google Analytics 4 */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `
        }}
      />
      
      {/* Google Search Console Verification */}
      <meta name="google-site-verification" content="GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE" />
      
      {/* Microsoft Bing Verification */}
      <meta name="msvalidate.01" content="BING_VERIFICATION_CODE" />
    </Head>
  )
} 