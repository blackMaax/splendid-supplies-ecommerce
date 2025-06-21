import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// Admin user configuration - move to environment variables in production
const ADMIN_USER = {
  id: '1',
  username: process.env.ADMIN_USERNAME || 'blackMax',
  password: process.env.ADMIN_PASSWORD_HASH || '$2b$12$N5.Ehbtacm6HQ28LEQ0J3O3LJsT230.Z4YYOE2MSi.yZsWPqn.NYa',
  name: 'Admin User',
  role: 'admin'
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // Check if username matches admin user
        if (credentials.username !== ADMIN_USER.username) {
          return null
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          ADMIN_USER.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: ADMIN_USER.id,
          email: ADMIN_USER.username + '@splendidsupplies.com',
          name: ADMIN_USER.name,
          role: ADMIN_USER.role
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub || ''
        session.user.role = token.role
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Middleware to check if user is authenticated admin
export async function requireAdmin(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || session.user.role !== 'admin') {
      return {
        isAuthorized: false,
        error: 'Unauthorized: Admin access required'
      }
    }
    
    return {
      isAuthorized: true,
      user: session.user
    }
  } catch (error) {
    console.error('Auth check error:', error)
    return {
      isAuthorized: false,
      error: 'Authentication error'
    }
  }
}

// Rate limiting helper
const rateLimitMap = new Map()

export function rateLimit(identifier: string, limit: number = 10, window: number = 60000) {
  const now = Date.now()
  const windowStart = now - window
  
  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, [])
  }
  
  const requests = rateLimitMap.get(identifier)
  const validRequests = requests.filter((time: number) => time > windowStart)
  
  if (validRequests.length >= limit) {
    return false
  }
  
  validRequests.push(now)
  rateLimitMap.set(identifier, validRequests)
  
  return true
}

// IP extraction helper
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
} 