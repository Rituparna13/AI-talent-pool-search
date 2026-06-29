'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SearchFilters } from '@/components/search-filters'
import { CandidateCard } from '@/components/candidate-card'
import { Button } from '@/components/ui/button'
import { Upload, ChevronLeft } from 'lucide-react'

interface Candidate {
  id: string
  name: string
  email?: string
  phone?: string
  linkedin_url?: string
  github_url?: string
  skills: string[]
  years_of_experience?: number
  current_job_title?: string
  location?: string
}

interface DetailModalProps {
  candidate: Candidate | null
  isOpen: boolean
  onClose: () => void
}

function DetailModal({ candidate, isOpen, onClose }: DetailModalProps) {
  if (!isOpen || !candidate) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-2 text-sm">
              {candidate.email && (
                <div>
                  <span className="text-gray-600">Email:</span>{' '}
                  <a
                    href={`mailto:${candidate.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {candidate.email}
                  </a>
                </div>
              )}
              {candidate.phone && (
                <div>
                  <span className="text-gray-600">Phone:</span>{' '}
                  <a
                    href={`tel:${candidate.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {candidate.phone}
                  </a>
                </div>
              )}
              {candidate.linkedin_url && (
                <div>
                  <span className="text-gray-600">LinkedIn:</span>{' '}
                  <a
                    href={candidate.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {candidate.linkedin_url}
                  </a>
                </div>
              )}
              {candidate.github_url && (
                <div>
                  <span className="text-gray-600">GitHub:</span>{' '}
                  <a
                    href={candidate.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {candidate.github_url}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Professional Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Professional Info</h3>
            <div className="space-y-2 text-sm">
              {candidate.current_job_title && (
                <div>
                  <span className="text-gray-600">Current Title:</span>{' '}
                  <span className="font-medium">{candidate.current_job_title}</span>
                </div>
              )}
              {candidate.years_of_experience !== undefined &&
                candidate.years_of_experience !== null && (
                  <div>
                    <span className="text-gray-600">Experience:</span>{' '}
                    <span className="font-medium">
                      {candidate.years_of_experience} years
                    </span>
                  </div>
                )}
              {candidate.location && (
                <div>
                  <span className="text-gray-600">Location:</span>{' '}
                  <span className="font-medium">{candidate.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  const router = useRouter()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  )

  // Filter states
  const [skill, setSkill] = useState('')
  const [minExperience, setMinExperience] = useState('')
  const [location, setLocation] = useState('')

  // Load candidates on mount
  useEffect(() => {
    loadCandidates()
  }, [])

  const loadCandidates = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/candidates')
      const data = await response.json()

      if (response.ok) {
        setCandidates(data.candidates || [])
        setFilteredCandidates(data.candidates || [])
      }
    } catch (error) {
      console.error('[v0] Error loading candidates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    setIsSearching(true)
    try {
      const params = new URLSearchParams()

      if (skill.trim()) params.append('skill', skill.trim())
      if (minExperience) params.append('minExperience', minExperience)
      if (location.trim()) params.append('location', location.trim())

      const response = await fetch(`/api/candidates?${params}`)
      const data = await response.json()

      if (response.ok) {
        setFilteredCandidates(data.candidates || [])
      }
    } catch (error) {
      console.error('[v0] Error searching candidates:', error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header with Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => router.push('/')}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h1 className="text-4xl font-bold text-gray-900">
                Search Candidates
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              {filteredCandidates.length} candidate
              {filteredCandidates.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload More
          </Button>
        </div>

        {/* Search Filters */}
        <SearchFilters
          skill={skill}
          minExperience={minExperience}
          location={location}
          onSkillChange={setSkill}
          onExperienceChange={setMinExperience}
          onLocationChange={setLocation}
          onSearch={handleSearch}
          isLoading={isSearching}
        />

        {/* Results */}
        <div className="mt-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <svg
                  className="w-8 h-8 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mt-4">Loading candidates...</p>
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 text-lg">
                No candidates found matching your criteria.
              </p>
              <p className="text-gray-500 mt-2">
                Try adjusting your filters or upload more resumes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  {...candidate}
                  yearsOfExperience={candidate.years_of_experience}
                  currentJobTitle={candidate.current_job_title}
                  linkedinUrl={candidate.linkedin_url}
                  githubUrl={candidate.github_url}
                  onClick={() => setSelectedCandidate(candidate)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <DetailModal
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </main>
  )
}
