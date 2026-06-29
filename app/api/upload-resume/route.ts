import { NextRequest, NextResponse } from 'next/server'
import { getServerSupabaseClient } from '@/lib/supabase/server'
import { extractAndScrub } from '@/lib/resume-utils'
import { PDFParse } from 'pdf-parse'
import * as mammoth from 'mammoth'

const SUPPORTED_TYPES = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'DOCX',
}

/**
 * Extract text from PDF file
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = new PDFParse()
    const data = await pdfParse.parse(buffer)
    return data.text || ''
  } catch (error) {
    throw new Error(
      `Failed to extract text from PDF: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

/**
 * Extract text from Word document (.docx)
 */
async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  } catch (error) {
    throw new Error(
      `Failed to extract text from DOCX: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

/**
 * POST /api/upload-resume
 * Handle resume file uploads and extraction
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    const supabase = await getServerSupabaseClient()
    const uploadedCandidates = []
    const errors = []

    for (const file of files) {
      try {
        // Validate file type
        if (!(file.type in SUPPORTED_TYPES)) {
          errors.push(`${file.name}: Unsupported file type. Use PDF or DOCX.`)
          continue
        }

        // Read file buffer
        const buffer = Buffer.from(await file.arrayBuffer())

        // Extract text from file
        let rawText: string
        try {
          if (file.type === 'application/pdf') {
            rawText = await extractTextFromPDF(buffer)
          } else if (
            file.type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          ) {
            rawText = await extractTextFromDocx(buffer)
          } else {
            throw new Error(`Unsupported file type: ${file.type}`)
          }
        } catch (extractError) {
          errors.push(
            `${file.name}: ${extractError instanceof Error ? extractError.message : 'Failed to extract text'}`
          )
          continue
        }

        // Extract PII and scrub text
        const { pii, scrubbed_text } = extractAndScrub(rawText)

        // Insert into Supabase
        const { data, error: insertError } = await supabase
          .from('candidates')
          .insert({
            name: pii.name,
            email: pii.email,
            phone: pii.phone,
            linkedin_url: pii.linkedin_url,
            github_url: pii.github_url,
            raw_text: rawText,
            scrubbed_text: scrubbed_text,
            file_name: file.name,
            file_type: file.type,
            processing_status: 'pending',
          })
          .select()
          .single()

        if (insertError) {
          errors.push(`${file.name}: Database error - ${insertError.message}`)
          continue
        }

        uploadedCandidates.push({
          id: data.id,
          fileName: file.name,
          name: pii.name || 'Unknown',
        })
      } catch (error) {
        errors.push(
          `${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      }
    }

    return NextResponse.json({
      success: uploadedCandidates.length > 0,
      uploadedCandidates,
      errors,
    })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to process upload',
      },
      { status: 500 }
    )
  }
}
