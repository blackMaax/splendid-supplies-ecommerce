import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const files: File[] = data.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files received' }, { status: 400 })
    }

    const uploadedFiles: string[] = []

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist, which is fine
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split('.').pop()
      const filename = `${timestamp}-${randomString}.${extension}`

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Save file
      const filepath = path.join(uploadDir, filename)
      await writeFile(filepath, buffer)

      // Return relative path for use in the app
      uploadedFiles.push(`/uploads/${filename}`)
    }

    return NextResponse.json({ 
      message: 'Files uploaded successfully',
      files: uploadedFiles
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 })
  }
} 