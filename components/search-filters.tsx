'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface SearchFiltersProps {
  skill: string
  minExperience: string
  location: string
  onSkillChange: (value: string) => void
  onExperienceChange: (value: string) => void
  onLocationChange: (value: string) => void
  onSearch: () => void
  isLoading?: boolean
}

export function SearchFilters({
  skill,
  minExperience,
  location,
  onSkillChange,
  onExperienceChange,
  onLocationChange,
  onSearch,
  isLoading = false,
}: SearchFiltersProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Candidates</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Skill Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skill (e.g., React, Python)
          </label>
          <input
            type="text"
            value={skill}
            onChange={(e) => onSkillChange(e.target.value)}
            placeholder="Search skill..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Experience Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Years
          </label>
          <select
            value={minExperience}
            onChange={(e) => onExperienceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any</option>
            <option value="1">1+ years</option>
            <option value="3">3+ years</option>
            <option value="5">5+ years</option>
            <option value="10">10+ years</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Search location..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <Button
        onClick={onSearch}
        disabled={isLoading}
        className="w-full md:w-auto"
      >
        <Search className="w-4 h-4 mr-2" />
        {isLoading ? 'Searching...' : 'Search'}
      </Button>
    </div>
  )
}
