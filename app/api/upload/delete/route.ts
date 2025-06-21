import { NextRequest, NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import { unlink } from 'fs/promises'
import path from 'path'
import { requireAdmin, getClientIP, rateLimit } from '../../../../lib/auth'

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication for admin operations
    const authCheck = await requireAdmin(request)
    if (!authCheck.isAuthorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 })
    }

    // Rate limiting for file deletions
    const clientIP = getClientIP(request)
    if (!rateLimit(`admin-delete-file-${clientIP}`, 10, 60000)) {
      return NextResponse.json({ error: 'Too many delete requests' }, { status: 429 })
    }

    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    // Validate URL format to prevent path traversal
    if (imageUrl.includes('..') || imageUrl.includes('<') || imageUrl.includes('>')) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    const isProduction = process.env.NODE_ENV === 'production'

    if (isProduction) {
      // Delete from Vercel Blob
      if (imageUrl.includes('vercel-storage.com') || imageUrl.includes('blob.vercel-storage.com')) {
        await del(imageUrl)
      } else {
        // If it's not a Vercel Blob URL, we can't delete it (might be external URL)
        return NextResponse.json({ 
          error: 'Cannot delete external images. Only Vercel Blob images can be deleted.' 
        }, { status: 400 })
      }
    } else {
      // Delete from local storage
      if (imageUrl.startsWith('/uploads/')) {
        const filename = imageUrl.replace('/uploads/', '')
        const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
        try {
          await unlink(filepath)
        } catch (error) {
          console.log('File deletion note:', error)
          // File might not exist, which is fine
        }
      } else {
        // If it's not a local upload, we can't delete it
        return NextResponse.json({ 
          error: 'Cannot delete external images. Only uploaded images can be deleted.' 
        }, { status: 400 })
      }
    }

    return NextResponse.json({ 
      message: 'Image deleted successfully' 
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete image', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 