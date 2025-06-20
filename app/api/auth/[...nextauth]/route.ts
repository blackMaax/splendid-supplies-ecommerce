import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// Simple in-memory admin user - in production, use a database
const ADMIN_USER = {
  id: '1',
  email: 'admin@splendidsupplies.com',
  // Password: "admin123" - hash generated with bcrypt
  password: '$2b$12$T2L2.w4/oURz/qgm8r53fOodcv1SVlv0yCGHk5rRKKNRPNiZC5I2u',
  name: 'Admin User',
  role: 'admin'
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Check if email matches admin user
        if (credentials.email !== ADMIN_USER.email) {
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
          email: ADMIN_USER.email,
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
})

export { handler as GET, handler as POST } 