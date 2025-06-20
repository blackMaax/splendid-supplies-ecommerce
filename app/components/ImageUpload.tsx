"use client"

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Link } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  onUpload: (imageUrls: string[]) => void
  currentImages?: string[]
  multiple?: boolean
  maxFiles?: number
  className?: string
}

export default function ImageUpload({ 
  onUpload, 
  currentImages = [], 
  multiple = false, 
  maxFiles = 5,
  className = ""
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    setError(null)
    
    // Validate file count
    const fileArray = Array.from(files)
    if (!multiple && fileArray.length > 1) {
      setError('Only one file allowed')
      return
    }
    
    if (fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const invalidFiles = fileArray.filter(file => !validTypes.includes(file.type))
    if (invalidFiles.length > 0) {
      setError('Only JPEG, PNG, GIF, and WebP images are allowed')
      return
    }

    // Validate file sizes (max 5MB per file)
    const maxSize = 5 * 1024 * 1024 // 5MB
    const oversizedFiles = fileArray.filter(file => file.size > maxSize)
    if (oversizedFiles.length > 0) {
      setError('Files must be smaller than 5MB')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      fileArray.forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        // Show helpful message for production environment
        if (errorData.suggestion) {
          setError(`${errorData.error}\n\n${errorData.suggestion}`)
        } else {
          throw new Error(errorData.error || 'Upload failed')
        }
        return
      }

      const result = await response.json()
      
      // If multiple uploads, combine with existing images
      if (multiple) {
        const newImages = [...currentImages, ...result.files]
        onUpload(newImages)
      } else {
        onUpload(result.files)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const removeImage = (indexToRemove: number) => {
    const updatedImages = currentImages.filter((_, index) => index !== indexToRemove)
    onUpload(updatedImages)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleUrlAdd = () => {
    if (!urlInput.trim()) {
      setError('Please enter a valid URL')
      return
    }

    // Basic URL validation
    try {
      new URL(urlInput)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    setError(null)
    
    if (multiple) {
      const newImages = [...currentImages, urlInput.trim()]
      onUpload(newImages)
    } else {
      onUpload([urlInput.trim()])
    }
    
    setUrlInput('')
    setShowUrlInput(false)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        
        <div className="space-y-2">
          {uploading ? (
            <>
              <div className="animate-spin mx-auto w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="mx-auto w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                {dragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500">
                {multiple ? `Up to ${maxFiles} images` : '1 image'} • JPEG, PNG, GIF, WebP • Max 5MB each
              </p>
            </>
          )}
        </div>
      </div>

      {/* Manual URL Input */}
      <div className="space-y-2">
        {!showUrlInput ? (
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <Link className="w-4 h-4" />
            Add image URL manually
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter image URL (https://...)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleUrlAdd()
                }
              }}
            />
            <button
              type="button"
              onClick={handleUrlAdd}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowUrlInput(false)
                setUrlInput('')
                setError(null)
              }}
              className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600 whitespace-pre-line">{error}</p>
        </div>
      )}

      {/* Image Previews */}
      {currentImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            {multiple ? 'Uploaded Images' : 'Current Image'}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {currentImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                  <Image
                    src={imageUrl}
                    alt={`Upload ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback for broken images
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder.svg'
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage(index)
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 