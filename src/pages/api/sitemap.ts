import siteConfig from 'config/siteConfig'
import { NextApiRequest, NextApiResponse } from 'next'

import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { getPartnersSlugs, getSitemapData } from '~/lib/sanity.queries'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

function cleanUrl(url: string): string {
  return url.split(' ')[0].trim()
}

function generateSiteMap(posts: any[], partners: { slug: string }[]): string {
  const urlSet = new Set<string>()

  // Root home
  if (BASE_URL) {
    urlSet.add(cleanUrl(BASE_URL))
  }

  // Partner index and section index pages (no locale)
  const sectionPaths = [
    siteConfig.pageURLs.topic,
    siteConfig.paginationBaseUrls.base,
    siteConfig.pageURLs.article,
    siteConfig.pageURLs.podcast,
    siteConfig.pageURLs.ebook,
    siteConfig.pageURLs.webinar,
    siteConfig.pageURLs.pressRelease,
    siteConfig.pageURLs.releaseNotes,
    siteConfig.pageURLs.caseStudy,
    'faq',
  ]

  partners.forEach(({ slug: partnerSlug }) => {
    urlSet.add(cleanUrl(`${BASE_URL}/${partnerSlug}`))
    sectionPaths.forEach((path) => {
      urlSet.add(cleanUrl(`${BASE_URL}/${partnerSlug}/${path}`))
    })
  })

  // Content URLs under each partner (no locale variants)
  posts?.forEach((post) => {
    const contentType = post?.contentType
    const url = post?.url

    if (!url) return

    if (contentType === 'author') {
      partners.forEach(({ slug: partnerSlug }) => {
        urlSet.add(cleanUrl(`${BASE_URL}/${partnerSlug}/author/${url}`))
      })
      return
    }

    if (contentType === 'browse') {
      partners.forEach(({ slug: partnerSlug }) => {
        urlSet.add(cleanUrl(`${BASE_URL}/${partnerSlug}/browse/${url}`))
      })
      return
    }

    // article, podcast, ebook, webinar, press-release, case-study, release-notes, etc.
    const path = `${contentType}/${url}`
    partners.forEach(({ slug: partnerSlug }) => {
      urlSet.add(cleanUrl(`${BASE_URL}/${partnerSlug}/${path}`))
    })
  })

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  urlSet.forEach((url) => {
    if (!url) return
    xml += '  <url>\n'
    xml += `    <loc>${url}</loc>\n`
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`
    xml += '  </url>\n'
  })

  xml += '</urlset>'
  return xml
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const client = getClient(req?.preview ? { token: readToken } : undefined)
    const [data, partners] = await Promise.all([
      getSitemapData(client),
      getPartnersSlugs(client),
    ])
    const partnerList = Array.isArray(partners) ? partners : []
    const sitemap = generateSiteMap(data, partnerList)

    res.setHeader('Content-Type', 'application/xml; charset=utf-8')
    res.write(sitemap)
    res.end()
  } catch (error) {
    console.error('Sitemap generation error:', error)
    res.status(500).json({ error: 'Failed to generate sitemap' })
  }
}
