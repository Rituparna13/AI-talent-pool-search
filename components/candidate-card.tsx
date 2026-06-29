'use client'

import React from 'react'
import { MapPin, Briefcase, Award, Mail, Phone, ExternalLink } from 'lucide-react'

interface CandidateCardProps {
  id: string
  name: string
  email?: string
  phone?: string
  linkedinUrl?: string
  githubUrl?: string
  skills: string[]
  yearsOfExperience?: number
  currentJobTitle?: string
  location?: string
  onClick?: () => void
}

export function CandidateCard({
  id,
  name,
  email,
  phone,
  linkedinUrl,
  githubUrl,
  skills,
  yearsOfExperience,
  currentJobTitle,
  location,
  onClick,
}: CandidateCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>

        {currentJobTitle && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <Briefcase className="w-4 h-4" />
            <span>{currentJobTitle}</span>
          </div>
        )}

        {location && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        )}

        {yearsOfExperience !== undefined && yearsOfExperience !== null && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <Award className="w-4 h-4" />
            <span>{yearsOfExperience} years of experience</span>
          </div>
        )}
      </div>

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">Skills</p>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 5).map((skill, i) => (
              <span
                key={i}
                className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
              >
                {skill}
              </span>
            ))}
            {skills.length > 5 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{skills.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Contact Info */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
        {email && (
          <a
            href={`mailto:${email}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </a>
        )}

        {phone && (
          <a
            href={`tel:${phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </a>
        )}

        {linkedinUrl && (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>
        )}

        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        )}
      </div>
    </div>
  )
}
