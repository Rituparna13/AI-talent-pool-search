# Deployment Guide - AWS Amplify

## Quick Start

### Option 1: Deploy via AWS Amplify Console (Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Talent Pool Search app"
   git remote add origin https://github.com/YOUR_USERNAME/talent-pool-search.git
   git push -u origin main
   ```

2. **Create Amplify App**
   - Go to https://console.aws.amazon.com/amplify/
   - Click "New app" → "Host web app"
   - Connect to your GitHub repository
   - Select `main` branch
   - Click "Next" (use default build settings)

3. **Set Environment Variables**
   - Go to App Settings → Environment Variables
   - Add the following:
     ```
     NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
     NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
     SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
     GOOGLE_GENERATIVE_AI_API_KEY=<your_gemini_api_key>
     NODE_ENV=production
     ```

4. **Click "Deploy"**
   - Amplify will build and deploy automatically
   - Wait 5-10 minutes for initial deployment
   - Your URL: `https://<hash>.amplifyapp.com`

### Option 2: Deploy via Amplify CLI

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure (first time only)
amplify configure

# Initialize Amplify project
amplify init

# Deploy
amplify publish
```

## Environment Variables Required

All of these must be set in Amplify Console before deployment:

| Variable | Where to Get | Type |
|----------|-------------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project Settings | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase API Keys | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase API Keys | Secret |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI Studio (aistudio.google.com) | Secret |

### Getting Supabase Keys

1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy `URL` and `anon key` (public)
5. Copy `service_role` key (secret)

### Getting Google Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Select your project
4. Copy the key

## Post-Deployment Checklist

- [ ] Verify environment variables are set in Amplify Console
- [ ] Test upload page at `https://<your-url>.amplifyapp.com/`
- [ ] Test upload with a sample PDF
- [ ] Check Supabase to see candidate was created
- [ ] Test search page at `https://<your-url>.amplifyapp.com/search`
- [ ] Monitor Gemini API usage in Google Cloud Console

## Troubleshooting

### Build Failed: "Cannot find module 'pdf-parse'"
- This means dependencies weren't installed
- In Amplify Console, go to Deployments and redeploy
- Check that `amplify.yml` is in the root directory

### Build Failed: "NEXT_PUBLIC_SUPABASE_URL is not set"
- Go to Amplify Console → App Settings → Environment variables
- Make sure all 4 env vars are set
- Redeploy the app

### App Shows "Loading..." forever
- Check browser console for errors (F12 → Console)
- Go to Amplify Console and check build/deployment logs
- Common issue: API key is invalid or expired

### Uploads not working
- Verify Supabase connection (test in Supabase admin panel)
- Check `GOOGLE_GENERATIVE_AI_API_KEY` is correct
- Look at Amplify logs for errors

### Search page returns "0 candidates"
- Upload a resume first (go to `/`)
- Wait for processing to complete (check server logs)
- Refresh the search page
- Check Supabase table directly to see if data was inserted

## Monitoring

### View Logs
- Amplify Console → Deployments → click deployment → Logs
- Look for errors during build or runtime

### Check Supabase
- Go to https://app.supabase.com
- Select your project → Database
- Table: `public.candidates`
- Check if resumes are being stored

### Monitor Gemini API
- Go to https://console.cloud.google.com
- Check API quota usage in your project

## Scaling Considerations

This deployment handles up to ~500 concurrent users with free tiers:
- **Amplify**: Auto-scales, free tier includes generous bandwidth
- **Supabase**: Free tier includes 50K monthly active users
- **Gemini API**: 60 requests/minute free tier

If you exceed limits:
1. Amplify: No cost until you use paid features
2. Supabase: Upgrade to Pro ($25/month) for more queries
3. Gemini: Upgrade to paid API for higher rates

## Custom Domain (Optional)

1. In Amplify Console → App Settings → Domain management
2. Click "Add domain"
3. Enter your domain (e.g., recruit.example.com)
4. Update DNS records as instructed
5. DNS propagates in 5-30 minutes

## SSL/TLS

Amplify automatically provides free SSL/TLS certificates. Your app is HTTPS by default.

## Rollback

If a deployment breaks:
1. Go to Amplify Console → Deployments
2. Find the previous working deployment
3. Click "Redeploy this version"
4. Takes 5-10 minutes

## Performance

Expected page load times:
- Upload page: ~1-2s (first load), <500ms (cached)
- Search page: ~2-3s (first load), <1s (cached)
- Upload processing: 30-60s per resume (depends on Gemini)
- Search queries: <100ms (database indexed)

## Cost Estimate (Monthly)

| Service | Free Tier | Paid |
|---------|-----------|------|
| AWS Amplify | Included (100GB) | $0.15/GB after |
| Supabase | $0 (500MB) | $25/month (10GB) |
| Google Gemini | $0 (60 req/min) | $5 per 1M tokens |
| **Total** | **$0** | ~$30-50 |

## Support

- AWS Amplify Docs: https://docs.amplify.aws
- Supabase Docs: https://supabase.com/docs
- Google AI Studio: https://aistudio.google.com
- This Project README: See README.md in root

---

**Deployment should take ~10 minutes from start to live URL.**
