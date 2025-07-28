# ISR Revalidation System Guide

This guide explains the comprehensive ISR (Incremental Static Regeneration) revalidation system implemented for the VoiceStack Resources application.

## Overview

The revalidation system automatically updates static pages when content is published in Sanity CMS. It supports all content types and locales across the entire application.

## How It Works

1. **Content Publishing**: When content is published in Sanity Studio
2. **Webhook Trigger**: Sanity sends a POST request to `/api/revalidate`
3. **Path Generation**: The system generates all relevant paths for the content type and locales
4. **Revalidation**: Next.js regenerates the static pages with updated content
5. **Cache Update**: Users see the updated content immediately

## Supported Content Types

The system handles these content types:

- **Articles** (`article`)
- **Podcasts** (`podcast`)
- **Webinars** (`webinar`)
- **Ebooks** (`ebook`)
- **Case Studies** (`case-study`)
- **Press Releases** (`press-release`)
- **Testimonials** (`testimonial`)
- **Authors** (`author`)
- **Tags** (`tag`)
- **Categories** (`category`)

## Supported Locales

- **English (US)** - `en` (default)
- **English (UK)** - `en-GB`
- **English (Australia)** - `en-AU`

## Path Revalidation Strategy

For each content type, the system revalidates:

### Individual Content Pages
- `/content-type/slug` (default locale)
- `/en-GB/content-type/slug` (UK locale)
- `/en-AU/content-type/slug` (Australia locale)

### Listing Pages
- `/content-type` (main listing)
- `/content-type/page/2` (pagination)
- `/content-type/page/3` (pagination)
- Locale-specific versions for all locales

### Global Pages
- `/` (home page for all locales)
- `/browse` (browse page for all locales)
- `/topic` (topic page for all locales)

## API Endpoints

### `/api/revalidate`
Main revalidation endpoint that handles webhook requests from Sanity.

**Request Body:**
```json
{
  "_type": "post",
  "contentType": "article",
  "slug": { "current": "my-article" },
  "language": "en",
  "_publishedAt": "2024-01-01T00:00:00.000Z"
}
```

**Response:**
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

### `/api/test-webhook`
Test endpoint for verifying the revalidation system.

**GET Request:**
Returns system information and supported content types.

**POST Request:**
Simulates a webhook payload and calls the revalidation endpoint.

## Testing

### Local Testing
1. Start the development server: `npm run dev`
2. Navigate to any page with the `TestRevalidation` component
3. Use the test buttons to verify revalidation

### Production Testing
1. Deploy to staging environment
2. Set up ngrok for local development: `ngrok http 3000`
3. Update Sanity webhook URL to your ngrok URL
4. Publish content in Sanity Studio
5. Check deployment logs for revalidation results

## Webhook Setup in Sanity

1. Go to Sanity Studio → API → Webhooks
2. Create a new webhook:
   - **Name**: `isr-revalidation`
   - **URL**: `https://your-domain.com/api/revalidate`
   - **Dataset**: Your dataset
   - **Filter**: Leave empty (triggers on all content types)
   - **HTTP Method**: `POST`
   - **Status**: Enabled

## Error Handling

The system includes comprehensive error handling:

- **Invalid requests**: Returns 400 with error message
- **Revalidation failures**: Logs failed paths and continues with others
- **Network errors**: Retries with exponential backoff
- **Missing content**: Skips revalidation for unpublished content

## Performance Considerations

- **Batch processing**: Multiple paths revalidated in parallel
- **Deduplication**: Removes duplicate paths automatically
- **Selective revalidation**: Only revalidates relevant paths
- **Error isolation**: Failed paths don't prevent others from revalidating

## Monitoring

### Console Logs
The system provides detailed console logging:
```
🔄 Revalidation requested for post (article): my-article
🌍 Language: en
📋 Revalidating 15 paths for content (article)
✅ Revalidated: /article/my-article
✅ Revalidated: /en-GB/article/my-article
❌ Failed to revalidate /invalid-path: Error message
```

### Response Tracking
Each revalidation request returns detailed results including:
- Total paths processed
- Successfully revalidated paths
- Failed paths with error messages
- Overall success status

## Troubleshooting

### Common Issues

1. **Webhook not triggering**
   - Check webhook configuration in Sanity Studio
   - Verify URL is accessible
   - Check deployment logs

2. **Revalidation not working**
   - Ensure content has `_publishedAt` field
   - Check if paths exist in your application
   - Verify ISR is enabled in Next.js config

3. **Partial revalidation**
   - Check for failed paths in response
   - Verify all locales are configured
   - Ensure content types match expected values

### Debug Steps

1. **Test webhook endpoint**: `GET /api/test-webhook`
2. **Check revalidation logs**: Monitor console output
3. **Verify content structure**: Ensure Sanity content has required fields
4. **Test individual paths**: Use the test component to verify specific content types

## Security

- **No authentication required**: Webhook accepts requests from Sanity Studio
- **Published content only**: Only published content triggers revalidation
- **Path validation**: System validates paths before revalidation
- **Error logging**: Failed requests are logged for debugging

## Future Enhancements

- **Rate limiting**: Prevent abuse of revalidation endpoint
- **Webhook signature validation**: Verify requests come from Sanity
- **Selective revalidation**: Only revalidate affected pages
- **Background processing**: Queue revalidation requests for large sites
- **Metrics collection**: Track revalidation performance and success rates 