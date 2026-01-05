import { NextApiRequest, NextApiResponse } from 'next'
import groq from 'groq'

import { getClient } from '~/lib/sanity.client'
import { getSiteSettings } from '~/lib/sanity.queries'

// Image fragment for consistent image handling
const imageFragment = `
  "mainImage": mainImage.asset-> {
    _id,
    metadata {
      dimensions
    },
    altText,
    title,
    url
  }
`

// Author image fragment
const authorImageFragment = `
  "picture": picture.asset-> {
    _id,
    metadata {
      dimensions
    },
    altText,
    title,
    url
  }
`

// Body fragment for content
const bodyFragment = `
  body[] {
    ...,
    _type == "videoReference" => {
      ...,
      "video": @->{
        _id,
        title,
        platform,
        videoId,
      }
    },
    _type == "image" => {
      ...,
      asset->,
    },
    _type == "dynamicComponent" => {
      ...,
      testimonialCard {
        testimonial-> {
          testimonialName,
          excerpt,
          "customerDetails": customer->{
            name,
            slug,
            role,
            bio,
            "picture": picture.asset-> {
              _id,
              metadata {
                dimensions
              },
              altText,
              title
            },
          },
          image {
            asset->{
              url,
              metadata
            }
          },
          rating,
          date
        }
      },
      bannerBlock,
      asideBannerBlock,
    }
  }
`

// Base query fields - Only essential fields for API response
const contentFields = `
  _id,
  contentType,
  title,
  slug,
  ${imageFragment},
  "category": category-> {
    categoryName
  }
`

// Base query for all published posts
const baseQuery = groq`
  *[_type == "post" && defined(slug.current) && defined(date)] | order(date desc) {
    ${contentFields}
  }
`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get query parameters
    const contentType = req.query.contentType as string | undefined
    const region = req.query.region as string | undefined
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined
    const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : undefined
    const slug = req.query.slug as string | undefined
    const useSiteConfig = req.query.useSiteConfig !== 'false' // Default to true, set to 'false' to get all posts with exposeToAPI

    // Get Sanity client (only published content)
    const client = getClient()
    
    // Always use site config by default (unless explicitly disabled)
    let selectedBlogIds: string[] = []
    if (useSiteConfig) {
      // Fetch site settings with selectedBlogs references
      const siteSettingsQuery = groq`*[_type == "siteSetting"][0] {
        selectedBlogs[]-> {
          _id
        }
      }`
      const siteSetting = await client.fetch(siteSettingsQuery)
      
      if (siteSetting?.selectedBlogs && Array.isArray(siteSetting.selectedBlogs)) {
        selectedBlogIds = siteSetting.selectedBlogs
          .map((blog: any) => blog?._id)
          .filter(Boolean)
      }
    }

    // If slug is provided, fetch single post (only if exposed to API)
    if (slug) {
      const query = groq`
        *[_type == "post" && slug.current == $slug && exposeToAPI == true][0] {
          ${contentFields}
        }
      `

      const post = await client.fetch(query, { slug })

      if (!post) {
        return res.status(404).json({ error: 'Post not found or not exposed to API' })
      }

      // Format single post response - only essential fields
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://resources.voicestack.com'
      const formattedPost = {
        _id: post._id,
        contentType: post.contentType,
        title: post.title,
        categoryName: post.category?.categoryName || null,
        mainImage: post.mainImage ? {
          url: post.mainImage.url,
          altText: post.mainImage.altText,
          title: post.mainImage.title,
        } : null,
        url: post.slug?.current ? `${baseUrl}/${post.contentType}/${post.slug.current}` : null,
        slug: post.slug?.current || null,
      }

      return res.status(200).json({
        success: true,
        data: formattedPost,
      })
    }

    // If useSiteConfig is true but no blogs are selected, return empty with helpful message
    if (useSiteConfig && selectedBlogIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: {
          total: 0,
          limit: limit || 0,
          skip: skip || 0,
          hasMore: false,
        },
        filters: {
          contentType: contentType || 'all',
          region: region || 'all',
          useSiteConfig: true,
        },
        message: 'No blogs selected in site configuration. Please select blogs in Site Settings > Selected Blogs.',
      })
    }

    // Build query parameters
    const params: any = {}
    if (useSiteConfig && selectedBlogIds.length > 0) {
      params.selectedBlogIds = selectedBlogIds
    }
    if (contentType && contentType !== 'all') {
      params.contentType = contentType
    }
    if (region && region !== 'all') {
      params.region = region
    }

    // Build the query based on filters and pagination
    // Helper to build base filter condition
    const getBaseFilter = () => {
      let base = `_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true`
      if (useSiteConfig && selectedBlogIds.length > 0) {
        base += ` && _id in $selectedBlogIds`
      }
      if (contentType && contentType !== 'all') {
        base += ` && contentType == $contentType`
      }
      if (region && region !== 'all') {
        base += ` && language == $region`
      }
      return base
    }
    
    // Build query with proper groq template literals
    // We need to handle all combinations of filters and pagination
    const hasSiteConfigFilter = useSiteConfig && selectedBlogIds.length > 0
    let query
    
    // Build pagination conditions
    if (skip !== undefined && limit !== undefined) {
      if (hasSiteConfigFilter && contentType && contentType !== 'all' && region && region !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds && contentType == $contentType && language == $region] | order(date desc) [${skip}...${skip + limit}] {${contentFields}}`
      } else if (hasSiteConfigFilter && contentType && contentType !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds && contentType == $contentType] | order(date desc) [${skip}...${skip + limit}] {${contentFields}}`
      } else if (hasSiteConfigFilter && region && region !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds && language == $region] | order(date desc) [${skip}...${skip + limit}] {${contentFields}}`
      } else if (hasSiteConfigFilter) {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds] | order(date desc) [${skip}...${skip + limit}] {${contentFields}}`
      } else if (contentType && contentType !== 'all' && region && region !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true && contentType == $contentType && language == $region] | order(date desc) [${skip}...${skip + limit}] {${contentFields}}`
      } else if (contentType && contentType !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true && contentType == $contentType] | order(date desc) [${skip}...${skip + limit}] {${contentFields}}`
      } else if (region && region !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true && language == $region] | order(date desc) [${skip}...${skip + limit}] {${contentFields}}`
      } else {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true] | order(date desc) [${skip}...${skip + limit}] {${contentFields}}`
      }
    } else if (limit !== undefined) {
      if (hasSiteConfigFilter && contentType && contentType !== 'all' && region && region !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds && contentType == $contentType && language == $region] | order(date desc) [0...${limit}] {${contentFields}}`
      } else if (hasSiteConfigFilter && contentType && contentType !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds && contentType == $contentType] | order(date desc) [0...${limit}] {${contentFields}}`
      } else if (hasSiteConfigFilter && region && region !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds && language == $region] | order(date desc) [0...${limit}] {${contentFields}}`
      } else if (hasSiteConfigFilter) {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds] | order(date desc) [0...${limit}] {${contentFields}}`
      } else if (contentType && contentType !== 'all' && region && region !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true && contentType == $contentType && language == $region] | order(date desc) [0...${limit}] {${contentFields}}`
      } else if (contentType && contentType !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true && contentType == $contentType] | order(date desc) [0...${limit}] {${contentFields}}`
      } else if (region && region !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true && language == $region] | order(date desc) [0...${limit}] {${contentFields}}`
      } else {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true] | order(date desc) [0...${limit}] {${contentFields}}`
      }
    } else if (skip !== undefined) {
      if (hasSiteConfigFilter && contentType && contentType !== 'all' && region && region !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds && contentType == $contentType && language == $region] | order(date desc) [${skip}...] {${contentFields}}`
      } else if (hasSiteConfigFilter && contentType && contentType !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds && contentType == $contentType] | order(date desc) [${skip}...] {${contentFields}}`
      } else if (hasSiteConfigFilter && region && region !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds && language == $region] | order(date desc) [${skip}...] {${contentFields}}`
      } else if (hasSiteConfigFilter) {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds] | order(date desc) [${skip}...] {${contentFields}}`
      } else if (contentType && contentType !== 'all' && region && region !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true && contentType == $contentType && language == $region] | order(date desc) [${skip}...] {${contentFields}}`
      } else if (contentType && contentType !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true && contentType == $contentType] | order(date desc) [${skip}...] {${contentFields}}`
      } else if (region && region !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true && language == $region] | order(date desc) [${skip}...] {${contentFields}}`
      } else {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true] | order(date desc) [${skip}...] {${contentFields}}`
      }
    } else {
      // When using site config, don't require exposeToAPI (selection is permission enough)
      if (hasSiteConfigFilter && contentType && contentType !== 'all' && region && region !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds && contentType == $contentType && language == $region] | order(date desc) {${contentFields}}`
      } else if (hasSiteConfigFilter && contentType && contentType !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds && contentType == $contentType] | order(date desc) {${contentFields}}`
      } else if (hasSiteConfigFilter && region && region !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds && language == $region] | order(date desc) {${contentFields}}`
      } else if (hasSiteConfigFilter) {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds] | order(date desc) {${contentFields}}`
      } else if (contentType && contentType !== 'all' && region && region !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true && contentType == $contentType && language == $region] | order(date desc) {${contentFields}}`
      } else if (contentType && contentType !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true && contentType == $contentType] | order(date desc) {${contentFields}}`
      } else if (region && region !== 'all') {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true && language == $region] | order(date desc) {${contentFields}}`
      } else {
        query = groq`*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true] | order(date desc) {${contentFields}}`
      }
    }

    // Fetch data from Sanity
    const data = await client.fetch(query, params)
    
    // Format the response - add URL and simplify structure
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://resources.voicestack.com'
    const formattedData = (data || []).map((post: any) => ({
      _id: post._id,
      contentType: post.contentType,
      title: post.title,
      categoryName: post.category?.categoryName || null,
      mainImage: post.mainImage ? {
        url: post.mainImage.url,
        altText: post.mainImage.altText,
        title: post.mainImage.title,
      } : null,
      url: post.slug?.current ? `${baseUrl}/${post.contentType}/${post.slug.current}` : null,
      slug: post.slug?.current || null,
    }))

    // Get total count for pagination info
    let countQuery
    if (hasSiteConfigFilter && contentType && contentType !== 'all' && region && region !== 'all') {
      countQuery = groq`count(*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds && contentType == $contentType && language == $region])`
    } else if (hasSiteConfigFilter && contentType && contentType !== 'all') {
      countQuery = groq`count(*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds && contentType == $contentType])`
    } else if (hasSiteConfigFilter && region && region !== 'all') {
      countQuery = groq`count(*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds && language == $region])`
    } else if (hasSiteConfigFilter) {
      countQuery = groq`count(*[_type == "post" && defined(slug.current) && defined(date) && _id in $selectedBlogIds])`
    } else if (contentType && contentType !== 'all' && region && region !== 'all') {
      countQuery = groq`count(*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true && contentType == $contentType && language == $region])`
    } else if (contentType && contentType !== 'all') {
      countQuery = groq`count(*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true && contentType == $contentType])`
    } else if (region && region !== 'all') {
      countQuery = groq`count(*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true && language == $region])`
    } else {
      countQuery = groq`count(*[_type == "post" && defined(slug.current) && defined(date) && exposeToAPI == true])`
    }
    
    const total = await client.fetch(countQuery, params)

    // Set CORS headers to allow external access
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Content-Type', 'application/json')

    // Return response
    return res.status(200).json({
      success: true,
      data: formattedData,
      pagination: {
        total,
        limit: limit || total,
        skip: skip || 0,
        hasMore: skip !== undefined && limit !== undefined ? skip + limit < total : false,
      },
      filters: {
        contentType: contentType || 'all',
        region: region || 'all',
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
