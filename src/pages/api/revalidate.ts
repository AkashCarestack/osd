import siteConfig from 'config/siteConfig'
import type { NextApiRequest, NextApiResponse } from 'next'

interface WebhookBody {
  _type: string
  slug?: { current: string }
  language?: string
  _id?: string
  _rev?: string
  _createdAt?: string
  _updatedAt?: string
  _publishedAt?: string
  contentType?: string
}

// Helper function to revalidate paths for all locales
async function revalidatePaths(res: NextApiResponse, paths: string[]) {
  const revalidatedPaths: string[] = []
  const failedPaths: string[] = []

  for (const path of paths) {
    try {
      await res.revalidate(path)
      revalidatedPaths.push(path)
      console.log(`✅ Revalidated: ${path}`)
    } catch (error) {
      console.error(`❌ Failed to revalidate ${path}:`, error)
      failedPaths.push(path)
    }
  }

  return { revalidatedPaths, failedPaths }
}

// Generate paths for different content types and locales
function generateRevalidationPaths(contentType: string, slug: string, language?: string) {
  const paths: string[] = []
  const locales = siteConfig.locales

  // Helper to add paths for all locales
  const addLocalePaths = (basePath: string) => {
    // Add root path (default locale)
    paths.push(basePath)
    
    // Add locale-specific paths
    locales.forEach(locale => {
      if (locale !== 'en') {
        paths.push(`/${locale}${basePath}`)
      }
    })
  }

  // Helper to add pagination paths
  const addPaginationPaths = (basePath: string) => {
    addLocalePaths(basePath)
    // Add pagination pages (first few pages)
    for (let page = 2; page <= 3; page++) {
      addLocalePaths(`${basePath}/page/${page}`)
    }
  }

  switch (contentType) {
    case 'article':
      // Individual article page
      addLocalePaths(`/article/${slug}`)
      // Article listing pages
      addPaginationPaths('/article')
      break

    case 'podcast':
      // Individual podcast page
      addLocalePaths(`/podcast/${slug}`)
      // Podcast listing pages
      addPaginationPaths('/podcast')
      break

    case 'webinar':
      // Individual webinar page
      addLocalePaths(`/webinar/${slug}`)
      // Webinar listing pages
      addPaginationPaths('/webinar')
      break

    case 'ebook':
      // Individual ebook page
      addLocalePaths(`/ebook/${slug}`)
      // Ebook listing pages
      addPaginationPaths('/ebook')
      break

    case 'case-study':
      // Individual case study page
      addLocalePaths(`/case-study/${slug}`)
      // Case study listing pages
      addPaginationPaths('/case-study')
      break

    case 'press-release':
      // Individual press release page
      addLocalePaths(`/press-release/${slug}`)
      // Press release listing pages
      addPaginationPaths('/press-release')
      break

    case 'testimonial':
      // Individual testimonial page
      addLocalePaths(`/testimonial/${slug}`)
      // Testimonial listing pages
      addPaginationPaths('/testimonial')
      break

    default:
      // Generic post handling
      addLocalePaths(`/${contentType}/${slug}`)
      addPaginationPaths(`/${contentType}`)
  }

  // Always revalidate home pages and main listing pages
  addLocalePaths('/')
  addPaginationPaths('/browse')
  addPaginationPaths('/topic')

  return paths
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Parse the body directly without signature validation
    const body = req.body as WebhookBody
    
    if (!body) {
      const message = 'No body'
      console.log(message)
      return res.status(400).json({ message })
    }

    // Handle the webhook
    const { _type, slug, language, _publishedAt, contentType } = body
    
    // Only trigger revalidation when content is published (has _publishedAt)
    if (!_publishedAt) {
      console.log('Content not published yet, skipping revalidation')
      return res.status(200).json({ message: 'Content not published' })
    }

    // Check if this is a draft/preview request
    const userAgent = req.headers['user-agent'] || ''
    const referer = req.headers['referer'] || ''
    
    if (userAgent.includes('sanity') || referer.includes('preview') || referer.includes('draft')) {
      console.log('Draft/preview request detected, skipping revalidation')
      return res.status(200).json({ message: 'Draft mode - skipping revalidation' })
    }

    console.log(`🔄 Revalidation requested for ${_type} (${contentType}): ${slug?.current}`)
    console.log(`🌍 Language: ${language}`)

    let revalidationPaths: string[] = []
    let revalidationType = ''

    if (_type === 'post') {
      // Handle different content types
      const actualContentType = contentType || 'post'
      revalidationPaths = generateRevalidationPaths(actualContentType, slug?.current || '', language)
      revalidationType = `content (${actualContentType})`
      
    } else if (_type === 'author') {
      // Revalidate author pages and related content
      revalidationPaths = generateRevalidationPaths('author', slug?.current || '', language)
      revalidationType = 'author'
      
    } else if (_type === 'tag') {
      // Revalidate tag pages and related content
      revalidationPaths = generateRevalidationPaths('tag', slug?.current || '', language)
      revalidationType = 'tag'
      
    } else if (_type === 'category') {
      // Revalidate category pages and related content
      revalidationPaths = generateRevalidationPaths('category', slug?.current || '', language)
      revalidationType = 'category'
      
    } else {
      // Generic content type handling
      revalidationPaths = generateRevalidationPaths(_type, slug?.current || '', language)
      revalidationType = _type
    }

    // Remove duplicates and filter out empty paths
    revalidationPaths = [...new Set(revalidationPaths)].filter(path => path && path !== '')

    console.log(`📋 Revalidating ${revalidationPaths.length} paths for ${revalidationType}`)
    console.log('Paths to revalidate:', revalidationPaths)

    // Perform revalidation
    const { revalidatedPaths, failedPaths } = await revalidatePaths(res, revalidationPaths)

    const result = {
      message: 'Revalidation completed',
      type: revalidationType,
      slug: slug?.current,
      language,
      totalPaths: revalidationPaths.length,
      revalidatedPaths,
      failedPaths,
      success: failedPaths.length === 0
    }

    console.log('✅ Revalidation result:', result)

    return res.status(200).json(result)

  } catch (err: any) {
    console.error('❌ Revalidation error:', err?.message)
    return res.status(500).json({ 
      message: 'Error revalidating',
      error: err?.message 
    })
  }
} 