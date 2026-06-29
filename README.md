# Talent Pool Search

A web application for recruiters to upload, organize, and search through candidate resumes. Uses AI-powered extraction to identify skills, experience, and location data.

## Features

✅ **Multi-file Resume Upload** - Drag-and-drop or click to upload PDF and Word documents  
✅ **PII Protection** - Extracts contact details separately; scrubs email, phone, and social URLs before AI processing  
✅ **AI-Powered Extraction** - Uses Google Gemini to extract skills, experience level, job titles, and locations  
✅ **Search & Filter** - Find candidates by skill keyword, minimum years of experience, and location  
✅ **Candidate Details** - Click any candidate to view full profile including contact information and skills  
✅ **Progress Tracking** - Real-time upload and processing status indicators  
✅ **No Authentication Required** - Public access for uploading and searching (as per requirements)

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + Tailwind CSS
- **Backend**: Next.js API Routes (Node.js)
- **Database**: Supabase PostgreSQL
- **AI**: Google Generative AI (Gemini)
- **File Processing**: pdf-parse (PDF), mammoth (Word documents)
- **Deployment**: AWS Amplify (ready for deployment)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account (free tier available)
- Google Generative AI API key (free from aistudio.google.com)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd talent-pool-search

# Install dependencies
pnpm install

# Set up environment variables
# Create .env.local with:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

### Running Locally

```bash
pnpm dev
```

Visit http://localhost:3000

### Database Setup

The database schema is automatically created when you connect Supabase. It includes:
- `candidates` table with fields for contact details, resume text, extracted skills, and processing status

To manually run migrations:
```bash
# Run the SQL from app/api/setup/schema.sql in your Supabase SQL editor
```

## Architecture

### Upload Flow
1. User selects PDF or Word files
2. Server extracts raw text from files
3. Contact details extracted via regex: name, email, phone, LinkedIn, GitHub
4. Resume text is scrubbed (replaces PII with placeholders like [EMAIL], [PHONE])
5. Scrubbed text sent to Gemini for extraction (skills, experience, job title, location)
6. All data stored in Supabase

### Search Flow
1. User filters by skill, experience, or location
2. API queries Supabase with filters
3. Results shown as candidate cards
4. Click card to view full profile including contact details

### PII Handling
- **Contact Details**: Extracted with regex BEFORE scrubbing
  - Name, Email, Phone, LinkedIn URL, GitHub URL
- **Scrubbed Text**: All PII replaced with placeholders
  - `[EMAIL]` replaces emails
  - `[PHONE]` replaces phone numbers
  - `[LINKEDIN]` replaces LinkedIn URLs
  - `[GITHUB]` replaces GitHub URLs
- **AI Processing**: Gemini only sees scrubbed text with skills and experience

## API Endpoints

### POST /api/upload-resume
Upload resume files
```bash
curl -X POST -F "files=@resume.pdf" http://localhost:3000/api/upload-resume
```

### POST /api/process-resume
Extract data using Gemini (called automatically after upload)

### GET /api/candidates
Search candidates with filters
```bash
curl "http://localhost:3000/api/candidates?skill=React&minYears=3&location=San Francisco"
```

### GET /api/candidates/[id]
Get full candidate details including contact information

## Test Data

Generate 25-30 realistic test resumes:
```bash
node scripts/generate-test-data.mjs
```

This creates varied resume examples with:
- Different roles (Software Engineer, Designer, PM, Sales, Operations)
- Experience levels (Junior 0-2 yrs, Mid 3-7 yrs, Senior 8+ yrs)
- Various skills and locations
- Career gaps and overlapping expertise

## Deployment

### AWS Amplify
```bash
# Connect your GitHub repo to Amplify
# Set environment variables in Amplify console
# Deploy will automatically run pnpm install && pnpm build
```

### Vercel (Alternative)
```bash
vercel
```

## Project Structure

```
app/
  layout.tsx           # Root layout with metadata
  page.tsx             # Upload page
  search/
    page.tsx           # Search & browse page
  api/
    upload-resume/     # File upload handler
    process-resume/    # Gemini extraction
    candidates/        # Search & detail endpoints

components/
  upload-area.tsx      # Drag-drop upload UI
  upload-progress.tsx  # Progress indicators
  search-filters.tsx   # Filter controls
  candidate-card.tsx   # Candidate display

lib/
  file-extraction.ts   # PDF/Word text extraction
  resume-utils.ts      # PII scrubbing & regex extraction
  supabase/
    client.ts          # Supabase client (browser)
    server.ts          # Supabase client (server)

scripts/
  generate-test-data.mjs  # Generate fake resumes
```

## Design Decisions

### Why Gemini?
- Free tier with generous limits (60 requests per minute)
- Excellent for structured data extraction from text
- Fast responses suitable for batch processing
- Reliable quality for identifying technical skills

### Why Supabase?
- PostgreSQL reliability and query power
- Free tier includes 500MB storage + 50,000 monthly active users
- Built-in authentication (not used here per requirements)
- Simple admin interface for viewing data

### Why Server-Side Text Extraction?
- More reliable than browser-based extraction
- Better error handling and retry logic
- Validates file types securely
- Prevents malformed data reaching Gemini

### PII Handling Approach
- Contact details extracted separately with regex before scrubbing
- AI only sees technical content (skills, experience, titles)
- Prevents accidental exposure of PII to third parties
- Meets data privacy best practices

## Future Enhancements

1. **Bulk Export** - Download filtered candidate list as CSV
2. **Tagging System** - Tag candidates as "interested", "rejected", "backlog"
3. **Notes** - Add private notes on each candidate
4. **Duplicate Detection** - Identify similar resumes
5. **Skills Normalization** - Map variations (React → ReactJS, etc.)
6. **Advanced Filters** - Date range, skill combinations, experience bands
7. **Email Integration** - Pull resumes from Gmail/Outlook inbox
8. **API Access** - Allow external tools to query candidates
9. **Webhooks** - Notify when new candidates match filters
10. **Custom Extraction** - Allow users to define custom fields to extract

## Troubleshooting

### "Export default doesn't exist" errors
- All dependencies are installed and imports fixed
- Run `pnpm install` to ensure all packages are present

### Database connection issues
- Verify Supabase URL and keys in `.env.local`
- Check that the `candidates` table exists (should be auto-created)
- Ensure `Row Level Security` policies allow public read/insert

### No candidates showing in search
- Confirm resumes have been uploaded and processing completed
- Check database directly in Supabase admin
- Review server logs for extraction errors

### Gemini API errors
- Verify `GOOGLE_GENERATIVE_AI_API_KEY` is set correctly
- Check API quota hasn't been exceeded
- Ensure request payload is valid JSON

## License

MIT

## Support

For issues or questions, open a GitHub issue or contact the development team.
