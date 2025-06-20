import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// Simple in-memory admin user - in production, use a database
const ADMIN_USER = {
  id: '1',
  username: 'blackMax',
  // Password: "mayer2credits8FANCIES" - hash generated with bcrypt
  password: '$2b$12$N5.Ehbtacm6HQ28LEQ0J3O3LJsT230.Z4YYOE2MSi.yZsWPqn.NYa',
  name: 'Admin User',
  role: 'admin'
}

const handler = NextAuth({
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
          email: ADMIN_USER.username + '@splendidsupplies.com', // For NextAuth compatibility
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