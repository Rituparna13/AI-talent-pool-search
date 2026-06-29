'use client'

import React, { useRef, useState } from 'react'
import { Upload } from 'lucide-react'

// Supported file types (duplicate here to avoid importing server-side utilities on client)
const SUPPORTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

function isSupportedResumeFile(file: File): boolean {
  return SUPPORTED_TYPES.includes(file.type)
}

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

export function UploadArea({ onFilesSelected, disabled = false }: UploadAreaProps) {
  const [isDragActive, setIsDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragActive(e.type === 'dragenter' || e.type === 'dragover')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    const supportedFiles = files.filter(isSupportedResumeFile)

    if (supportedFiles.length > 0) {
      onFilesSelected(supportedFiles)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || [])
    const supportedFiles = files.filter(isSupportedResumeFile)

    if (supportedFiles.length > 0) {
      onFilesSelected(supportedFiles)
    }
  }

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-gray-50 hover:border-gray-400'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.docx"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />

      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Drop your resumes here
      </h3>

      <p className="text-gray-600 mb-2">
        or click to browse. Support PDF and Word (.docx) files
      </p>

      <p className="text-sm text-gray-500">
        You can upload multiple files at once
      </p>
    </div>
  )
}
