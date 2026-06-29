'use client'

import React from 'react'
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'

interface UploadItem {
  fileName: string
  name: string
  status: 'uploading' | 'processing' | 'completed' | 'error'
  error?: string
}

interface UploadProgressProps {
  items: UploadItem[]
}

export function UploadProgress({ items }: UploadProgressProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.fileName}
          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex-shrink-0 mt-0.5">
            {item.status === 'completed' && (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
            {item.status === 'error' && (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            {(item.status === 'uploading' || item.status === 'processing') && (
              <Clock className="w-5 h-5 text-blue-500 animate-spin" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{item.name}</p>
            <p className="text-sm text-gray-600 truncate">{item.fileName}</p>

            {item.status === 'uploading' && (
              <p className="text-xs text-blue-600 mt-1">Uploading...</p>
            )}
            {item.status === 'processing' && (
              <p className="text-xs text-blue-600 mt-1">Processing with AI...</p>
            )}
            {item.status === 'completed' && (
              <p className="text-xs text-green-600 mt-1">✓ Complete</p>
            )}
            {item.status === 'error' && item.error && (
              <p className="text-xs text-red-600 mt-1">{item.error}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
