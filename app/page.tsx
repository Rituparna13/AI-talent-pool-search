'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadArea } from '@/components/upload-area'
import { UploadProgress } from '@/components/upload-progress'
import { Button } from '@/components/ui/button'

interface UploadItem {
  fileName: string
  name: string
  status: 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
}

export default function UploadPage() {
  const router = useRouter()
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFilesSelected = async (files: File[]) => {
    setIsUploading(true)
    const newItems: UploadItem[] = files.map((file) => ({
      fileName: file.name,
      name: file.name.replace(/\.[^/.]+$/, ''),
      status: 'uploading',
    }))

    setUploadItems(newItems)

    try {
      // Upload files to server
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })

      const uploadResponse = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadResponse.json()

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Upload failed')
      }

      // Update status to processing for uploaded files
      const processingItems: UploadItem[] = []
      uploadData.uploadedCandidates.forEach(
        (candidate: { id: string; fileName: string; name: string }) => {
          processingItems.push({
            fileName: candidate.fileName,
            name: candidate.name,
            status: 'processing',
          })

          // Trigger AI processing
          processCandidate(candidate.id, candidate.fileName)
        }
      )

      // Add errors
      if (uploadData.errors && uploadData.errors.length > 0) {
        uploadData.errors.forEach((error: string) => {
          processingItems.push({
            fileName: error.split(':')[0],
            name: error.split(':')[0],
            status: 'error',
            error: error,
          })
        })
      }

      setUploadItems(processingItems)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed'
      setUploadItems(
        newItems.map((item) => ({
          ...item,
          status: 'error',
          error: errorMessage,
        }))
      )
    } finally {
      setIsUploading(false)
    }
  }

  const processCandidate = async (
    candidateId: string,
    fileName: string
  ) => {
    try {
      // Fetch the scrubbed text from the database
      const candidateResponse = await fetch(`/api/candidates/${candidateId}`)
      const candidateData = await candidateResponse.json()

      if (!candidateResponse.ok || !candidateData.candidate) {
        throw new Error('Failed to fetch candidate data')
      }

      // Call the processing endpoint
      const processResponse = await fetch('/api/process-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId,
          scrubbedText: candidateData.candidate.scrubbed_text,
        }),
      })

      if (!processResponse.ok) {
        throw new Error('Processing failed')
      }

      // Update status to completed
      setUploadItems((items) =>
        items.map((item) =>
          item.fileName === fileName
            ? { ...item, status: 'completed' }
            : item
        )
      )
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Processing failed'
      setUploadItems((items) =>
        items.map((item) =>
          item.fileName === fileName
            ? { ...item, status: 'error', error: errorMessage }
            : item
        )
      )
    }
  }

  const hasAllCompleted = uploadItems.length > 0 && 
    uploadItems.every((item) => item.status === 'completed' || item.status === 'error')

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Talent Pool Search
          </h1>
          <p className="text-lg text-gray-600">
            Upload resumes and search by skills, experience, and location
          </p>
        </div>

        {/* Main Content */}
        {uploadItems.length === 0 ? (
          <div>
            <div className="mb-8">
              <UploadArea onFilesSelected={handleFilesSelected} disabled={isUploading} />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-blue-600 mb-1">PDF & DOCX</div>
                <p className="text-sm text-gray-600">Supported formats</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-blue-600 mb-1">Multiple Files</div>
                <p className="text-sm text-gray-600">Upload at once</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-blue-600 mb-1">AI Powered</div>
                <p className="text-sm text-gray-600">Automatic extraction</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Upload Progress
              </h2>
              <p className="text-sm text-gray-600">
                {uploadItems.filter((i) => i.status === 'completed').length} /{' '}
                {uploadItems.length} completed
              </p>
            </div>

            <UploadProgress items={uploadItems} />

            {hasAllCompleted && (
              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => {
                    setUploadItems([])
                  }}
                  variant="outline"
                >
                  Upload More
                </Button>
                <Button
                  onClick={() => {
                    router.push('/search')
                  }}
                >
                  View All Candidates
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
