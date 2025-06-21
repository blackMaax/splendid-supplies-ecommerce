import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { requireAdmin, getClientIP, rateLimit } from '../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Check authentication for admin operations
    const authCheck = await requireAdmin(request)
    if (!authCheck.isAuthorized) {
      return NextResponse.json({ error: authCheck.error }, { status: 401 })
    }

    // Rate limiting for file uploads
    const clientIP = getClientIP(request)
    if (!rateLimit(`admin-upload-${clientIP}`, 5, 60000)) {
      return NextResponse.json({ error: 'Too many upload requests' }, { status: 429 })
    }

    const data = await request.formData()
    const files: File[] = data.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files received' }, { status: 400 })
    }

    // Limit number of files per request
    if (files.length > 10) {
      return NextResponse.json({ error: 'Too many files. Maximum 10 files per upload.' }, { status: 400 })
    }

    const uploadedFiles: string[] = []
    const isProduction = process.env.NODE_ENV === 'production'

    console.log('Upload environment:', { 
      isProduction, 
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      nodeEnv: process.env.NODE_ENV
    })

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
      }

      // Enhanced file type validation
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        return NextResponse.json({ error: `File type ${file.type} is not allowed. Only JPEG, PNG, WebP, and GIF are allowed.` }, { status: 400 })
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
      }

      // Validate filename
      if (file.name.length > 100) {
        return NextResponse.json({ error: 'Filename too long' }, { status: 400 })
      }

      // Generate unique filename with better randomness
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split('.').pop()?.toLowerCase()
      
      // Validate extension
      if (!extension || !['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) {
        return NextResponse.json({ error: 'Invalid file extension' }, { status: 400 })
      }
      
      const filename = `${timestamp}-${randomString}.${extension}`

      if (isProduction) {
        // Check if Blob token is available
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          return NextResponse.json({ 
            error: 'Vercel Blob is not configured. Please create a Blob store in your Vercel dashboard.',
            suggestion: 'Go to your Vercel project → Storage tab → Create Blob store'
          }, { status: 500 })
        }

        try {
          // Use Vercel Blob in production
          console.log('Uploading to Vercel Blob:', filename)
          const blob = await put(filename, file, {
            access: 'public',
          })
          console.log('Blob upload successful:', blob.url)
          uploadedFiles.push(blob.url)
        } catch (blobError) {
          console.error('Vercel Blob upload error:', blobError)
          return NextResponse.json({ 
            error: 'Failed to upload to Vercel Blob',
            details: blobError instanceof Error ? blobError.message : 'Unknown blob error'
          }, { status: 500 })
        }
      } else {
        // Use local file storage in development
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        try {
          await mkdir(uploadDir, { recursive: true })
        } catch (error) {
          // Directory might already exist, which is fine
          console.log('Upload directory creation note:', error)
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const filepath = path.join(uploadDir, filename)
        await writeFile(filepath, buffer)
        uploadedFiles.push(`/uploads/${filename}`)
      }
    }

    return NextResponse.json({ 
      message: 'Files uploaded successfully',
      files: uploadedFiles
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to upload files', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 