import { NextRequest, NextResponse } from 'next/server'
import { migrateToKV } from '../../../lib/database'
import { requireAdmin, getClientIP, rateLimit } from '../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Check authentication for admin operations
    const authCheck = await requireAdmin(request)
    if (!authCheck.isAuthorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 })
    }

    // Rate limiting for migration operations
    const clientIP = getClientIP(request)
    if (!rateLimit(`admin-migrate-${clientIP}`, 1, 3600000)) { // 1 per hour
      return NextResponse.json({ error: 'Migration rate limit exceeded' }, { status: 429 })
    }

    const success = await migrateToKV()
    
    if (success) {
      console.log(`Database migration completed by admin from IP: ${clientIP}`)
      return NextResponse.json({ 
        message: 'Migration completed successfully',
        success: true 
      })
    } else {
      return NextResponse.json({ 
        message: 'Migration not needed or failed',
        success: false 
      })
    }
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 