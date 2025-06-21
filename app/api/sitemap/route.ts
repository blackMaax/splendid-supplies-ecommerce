import { NextResponse } from 'next/server'
import { generateSitemap, generateSitemapXML } from '../../../lib/sitemap'

export async function GET() {
  try {
    const sitemapEntries = await generateSitemap()
    const sitemapXML = generateSitemapXML(sitemapEntries)
    
    return new NextResponse(sitemapXML, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
      }
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
} 