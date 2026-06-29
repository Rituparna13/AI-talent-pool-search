import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { getServerSupabaseClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

interface ResumeData {
  skills: string[]
  years_of_experience: number | null
  current_job_title: string | null
  location: string | null
}

/**
 * Process a scrubbed resume with Gemini to extract structured data
 */
async function processWithGemini(scrubbedText: string): Promise<ResumeData> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `You are a professional resume analyzer. Extract the following information from the resume text below.

Resume Text:
${scrubbedText}

Please provide a JSON response with exactly these fields:
{
  "skills": [array of technical and professional skills],
  "years_of_experience": number or null if not determinable,
  "current_job_title": "most recent job title" or null,
  "location": "location/city" or null
}

Respond ONLY with valid JSON, no markdown or extra text.`

  try {
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    return {
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      years_of_experience:
        typeof parsed.years_of_experience === 'number'
          ? parsed.years_of_experience
          : null,
      current_job_title:
        typeof parsed.current_job_title === 'string'
          ? parsed.current_job_title
          : null,
      location: typeof parsed.location === 'string' ? parsed.location : null,
    }
  } catch (error) {
    console.error('[v0] Gemini processing error:', error)
    throw new Error(
      `Failed to process resume with Gemini: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

/**
 * POST /api/process-resume
 * Process a single resume that has already been uploaded
 */
export async function POST(request: NextRequest) {
  try {
    const { candidateId, scrubbedText } = await request.json()

    if (!candidateId || !scrubbedText) {
      return NextResponse.json(
        { error: 'Missing required fields: candidateId, scrubbedText' },
        { status: 400 }
      )
    }

    // Process with Gemini
    const extractedData = await processWithGemini(scrubbedText)

    // Update candidate record in Supabase
    const supabase = await getServerSupabaseClient()

    const { error: updateError } = await supabase
      .from('candidates')
      .update({
        skills: extractedData.skills,
        years_of_experience: extractedData.years_of_experience,
        current_job_title: extractedData.current_job_title,
        location: extractedData.location,
        processing_status: 'completed',
      })
      .eq('id', candidateId)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
    })
  } catch (error) {
    console.error('[v0] Resume processing error:', error)

    // Try to update the record with error status
    try {
      const { candidateId } = await request.json()
      const supabase = await getServerSupabaseClient()
      await supabase
        .from('candidates')
        .update({
          processing_status: 'failed',
          processing_error:
            error instanceof Error ? error.message : 'Unknown error',
        })
        .eq('id', candidateId)
    } catch {
      // Ignore error in error handler
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to process resume',
      },
      { status: 500 }
    )
  }
}
