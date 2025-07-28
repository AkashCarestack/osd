# Sanity Webhook Setup for ISR (Incremental Static Regeneration)

This document explains how to set up the webhook in Sanity Studio to trigger ISR revalidation when content is published.

## Prerequisites

1. Your Next.js app is deployed (e.g., on Vercel, Netlify, etc.)
2. You have access to Sanity Studio
3. No additional environment variables needed!

## How it Works

1. **Content Publishing:** When you publish content in Sanity Studio (click "Publish" button)
2. **Webhook Trigger:** Sanity sends a POST request to your `/api/revalidate` endpoint
3. **Comprehensive Revalidation:** The webhook revalidates all relevant pages across all locales
4. **ISR Update:** Next.js regenerates the static pages with the new content

## Setting up the Webhook in Sanity Studio

1. **Go to Sanity Studio API Settings:**
   - Navigate to your Sanity project
   - Go to "API" section
   - Click on "Webhooks" in the left sidebar

2. **Create a New Webhook:**
   - Click "Create webhook"
   - Set the following values:
     - **Name:** `isr-revalidation`
     - **URL:** `https://your-domain.com/api/revalidate`
     - **Dataset:** Select your dataset
     - **Filter:** Leave empty (to trigger on all content types)
     - **HTTP Method:** `POST`

3. **Configure the Webhook:**
   - **Status:** Enabled
   - **Secret:** Leave empty (no secret required)

## What Gets Revalidated

The system automatically revalidates:

### For Each Content Type:
- **Individual content pages** for all locales
- **Listing pages** for all locales  
- **Pagination pages** (first 3 pages) for all locales

### Content Types Supported:
- **Articles** (`contentType: 'article'`)
- **Podcasts** (`contentType: 'podcast'`)
- **Webinars** (`contentType: 'webinar'`)
- **Ebooks** (`contentType: 'ebook'`)
- **Case Studies** (`contentType: 'case-study'`)
- **Press Releases** (`contentType: 'press-release'`)
- **Testimonials** (`contentType: 'testimonial'`)
- **Authors** (`_type: 'author'`)
- **Tags** (`_type: 'tag'`)
- **Categories** (`_type: 'category'`)

### Locales Supported:
- **English (US)** - `en` (default)
- **English (UK)** - `en-GB`
- **English (Australia)** - `en-AU`

### Example Revalidation Paths:
When an article is published, these paths get revalidated:
- `/article/my-article`
- `/en-GB/article/my-article`
- `/en-AU/article/my-article`
- `/article` (listing page)
- `/en-GB/article`
- `/en-AU/article`
- `/article/page/2`
- `/en-GB/article/page/2`
- `/en-AU/article/page/2`
- `/` (home page for all locales)
- `/browse` (browse page for all locales)
- `/topic` (topic page for all locales)

## Testing the Webhook

### 1. Test the endpoint:
```
GET https://your-domain.com/api/test-webhook
```

### 2. Test with the test component:
- Add `<TestRevalidation />` to any page
- Use the test buttons to verify revalidation

### 3. Publish content in Sanity Studio:
- Create or edit content
- Click "Publish" button
- Check your deployment logs to see revalidation results

## Monitoring Revalidation

### Console Logs
The system provides detailed logging:
```
🔄 Revalidation requested for post (article): my-article
🌍 Language: en
📋 Revalidating 15 paths for content (article)
✅ Revalidated: /article/my-article
✅ Revalidated: /en-GB/article/my-article
✅ Revalidated: /en-AU/article/my-article
```

### Response Details
Each webhook returns detailed information:
```json
{
  "message": "Revalidation completed",
  "type": "content (article)",
  "slug": "my-article",
  "language": "en",
  "totalPaths": 15,
  "revalidatedPaths": ["/article/my-article", "/en-GB/article/my-article", ...],
  "failedPaths": [],
  "success": true
}
```

## Troubleshooting

### Webhook not triggering:
- Check if the webhook is enabled in Sanity Studio
- Verify the URL is correct and accessible
- Check deployment logs for any errors

### Revalidation not working:
- Check deployment logs for webhook errors
- Verify the content has `_publishedAt` field (only published content triggers revalidation)
- Check if the paths being revalidated are correct

### Partial revalidation:
- Check for failed paths in the response
- Verify all locales are configured correctly
- Ensure content types match expected values

### Testing:
- Use the test endpoint: `GET https://your-domain.com/api/test-webhook`
- Check deployment logs when publishing content
- Use the test component for comprehensive testing

## Security

- Only published content triggers revalidation (drafts are ignored)
- The webhook accepts requests from Sanity Studio
- No additional security measures required for this setup
- Failed revalidations are logged but don't prevent others from succeeding

## Performance

- Multiple paths are revalidated in parallel
- Duplicate paths are automatically removed
- Only relevant paths are revalidated for each content type
- Failed paths don't prevent others from revalidating

## Local Development

For local testing with ngrok:

1. **Install ngrok:**
   ```bash
   brew install ngrok  # macOS
   # or download from https://ngrok.com/download
   ```

2. **Start your development server:**
   ```bash
   npm run dev
   ```

3. **Start ngrok:**
   ```bash
   ngrok http 3000
   ```

4. **Update Sanity webhook URL:**
   - Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
   - Update webhook URL to: `https://abc123.ngrok.io/api/revalidate`

5. **Test by publishing content in Sanity Studio**

## Production Deployment

1. **Deploy your application** to your hosting platform
2. **Update the webhook URL** in Sanity Studio to your production domain
3. **Test the webhook** by publishing content
4. **Monitor logs** to ensure revalidation is working correctly

The system is now ready to automatically update your entire application when content is published! 