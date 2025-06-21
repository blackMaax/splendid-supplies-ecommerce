import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rate limiting for API endpoints
  const rateLimitMap = new Map()
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const clientIP = forwarded ? forwarded.split(',')[0].trim() : realIP || 'unknown'
  
  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const key = `api-${clientIP}`
    const now = Date.now()
    const windowStart = now - 60000 // 1 minute window
    
    if (!rateLimitMap.has(key)) {
      rateLimitMap.set(key, [])
    }
    
    const requests = rateLimitMap.get(key)
    const validRequests = requests.filter((time: number) => time > windowStart)
    
    // 60 requests per minute for API endpoints
    if (validRequests.length >= 60) {
      return new NextResponse('Rate limit exceeded', { status: 429 })
    }
    
    validRequests.push(now)
    rateLimitMap.set(key, validRequests)
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    
    // Allow access to login page
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }
    
    // Check if user is authenticated and has admin role
    if (!token || token.role !== 'admin') {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Protect sensitive API endpoints
  const protectedApiRoutes = [
    '/api/products',
    '/api/upload',
    '/api/migrate'
  ]

  if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
    // For POST, PUT, DELETE operations, additional checks are done in the route handlers
    if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
      // Add security headers
      const response = NextResponse.next()
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('X-Frame-Options', 'DENY')
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
      return response
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-DNS-Prefetch-Control', 'off')
  response.headers.set('X-Download-Options', 'noopen')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  
  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ]
} 