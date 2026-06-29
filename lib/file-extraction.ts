// Server-side file extraction utilities
// Note: pdf-parse has been moved to the server-side API routes to avoid bundling Node.js code in the browser

import * as mammoth from 'mammoth'

/**
 * Extract text from Word document (.docx)
 */
export async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  } catch (error) {
    throw new Error(
      `Failed to extract text from DOCX: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}
