import { NextResponse } from 'next/server'
import { migrateToKV } from '../../../lib/database'

export async function POST() {
  try {
    const success = await migrateToKV()
    
    if (success) {
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