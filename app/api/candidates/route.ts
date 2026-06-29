import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase/server'

/**
 * GET /api/candidates
 * Fetch all candidates with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const skill = searchParams.get('skill')
    const minExperience = searchParams.get('minExperience')
    const location = searchParams.get('location')

    const supabase = await getServerSupabaseClient()

    let query = supabase
      .from('candidates')
      .select(
        'id, name, email, phone, linkedin_url, github_url, skills, years_of_experience, current_job_title, location, processing_status, created_at'
      )
      .eq('processing_status', 'completed')
      .order('created_at', { ascending: false })

    // Filter by skill (case-insensitive, partial match)
    if (skill && skill.trim()) {
      query = query.filter('skills', 'cs', `{${skill.toLowerCase()}}`)
    }

    // Filter by minimum experience
    if (minExperience) {
      const minExp = parseInt(minExperience, 10)
      if (!isNaN(minExp)) {
        query = query.gte('years_of_experience', minExp)
      }
    }

    // Filter by location
    if (location && location.trim()) {
      query = query.ilike('location', `%${location}%`)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      candidates: data || [],
    })
  } catch (error) {
    console.error('[v0] Candidates fetch error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to fetch candidates',
      },
      { status: 500 }
    )
  }
}
