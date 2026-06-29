// Regex patterns for PII extraction
const PII_PATTERNS = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
  linkedin: /https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-]+\/?/gi,
  github: /https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9\-]+\/?/gi,
  name: /^(?:[A-Z][a-z]+ ?)+/m, // Basic name extraction from first line
}

export interface ExtractedPII {
  name: string | null
  email: string | null
  phone: string | null
  linkedin_url: string | null
  github_url: string | null
}

export interface ScrubbedResult {
  pii: ExtractedPII
  scrubbed_text: string
}

/**
 * Extract PII from resume text before scrubbing
 */
export function extractPII(text: string): ExtractedPII {
  const emailMatch = text.match(PII_PATTERNS.email)
  const phoneMatch = text.match(PII_PATTERNS.phone)
  const linkedinMatch = text.match(PII_PATTERNS.linkedin)
  const githubMatch = text.match(PII_PATTERNS.github)

  // Extract name from first meaningful line (usually in first 100 chars)
  const nameMatch = text.substring(0, 200).match(PII_PATTERNS.name)

  return {
    name: nameMatch ? nameMatch[0].trim() : null,
    email: emailMatch ? emailMatch[0] : null,
    phone: phoneMatch ? phoneMatch[0] : null,
    linkedin_url: linkedinMatch ? linkedinMatch[0] : null,
    github_url: githubMatch ? githubMatch[0] : null,
  }
}

/**
 * Scrub PII from resume text, replacing with placeholders
 */
export function scrubbText(text: string): string {
  let scrubbed = text

  // Replace email addresses
  scrubbed = scrubbed.replace(PII_PATTERNS.email, '[EMAIL]')

  // Replace phone numbers
  scrubbed = scrubbed.replace(PII_PATTERNS.phone, '[PHONE]')

  // Replace LinkedIn URLs
  scrubbed = scrubbed.replace(PII_PATTERNS.linkedin, '[LINKEDIN]')

  // Replace GitHub URLs
  scrubbed = scrubbed.replace(PII_PATTERNS.github, '[GITHUB]')

  // Remove common PII patterns (SSN, etc.)
  scrubbed = scrubbed.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')

  return scrubbed
}

/**
 * Extract PII and scrub text in one pass
 */
export function extractAndScrub(text: string): ScrubbedResult {
  const pii = extractPII(text)
  const scrubbed_text = scrubbText(text)

  return {
    pii,
    scrubbed_text,
  }
}
