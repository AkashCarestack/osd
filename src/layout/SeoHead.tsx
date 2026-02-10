import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'

import { useAlternatePaths, type AlternatePath } from '~/components/utils/alternatePaths'
import { slugToCapitalized, sanitizeUrl } from '~/utils/common'

interface SEOHeadProps {
  title: string
  description: string
  keywords: string
  robots: string
  canonical: string
  jsonLD: string
  contentType?: any
  ogImage?: any
  props?: {
    contentType: string
  }
}

export default function SEOHead({
  title,
  description,
  keywords,
  robots,
  canonical,
  jsonLD,
  props,
  ogImage,
}: SEOHeadProps) {
  const { alternatePaths, defaultUrl } = useAlternatePaths()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://resources.voicestack.com'
  const locale = useRouter().query.locale as string
  const slug = useRouter().query.slug as string
  const defaultUrlx = locale === 'en' ? baseUrl : `${baseUrl}/${locale}/${slug}`

  // Default values
  const defaultTitle = title || 'Resources | On-Demand Learning Resources | VoiceStack®'
  const defaultDescription = description || 'Whether you\'re looking for e-Books, webinars, podcasts, or articles, VoiceStack® Resources are full of helpful & informative topics to improve your practice.'
  const defaultKeywords = keywords || 'voicestack resources, voicestack articles, voicestack webinars, voicestack blogs'
  const defaultRobots = robots || 'index, follow, archive'
  const defaultAuthor = 'VoiceStack®'
  const sanitizedCanonical = sanitizeUrl(canonical)

  return (
    <>
      <Head>
        <title>{defaultTitle}</title>
        <meta property="og:title" content={defaultTitle} key="og:title" />
        <meta property="twitter:title" content={defaultTitle} key="twitter:title" />
        <meta name="description" content={defaultDescription} key="description" />
        <meta property="og:description" content={defaultDescription} key="og:description" />
        <meta property="twitter:description" content={defaultDescription} key="twitter:description" />
        <meta name="keywords" content={defaultKeywords} key="keywords" />
        <meta name="robots" content={defaultRobots} key="robots" />
        <meta name="author" content={defaultAuthor} key="author" />
        <link rel="canonical" href={sanitizedCanonical} key="canonical" />
        <meta property="og:url" content={sanitizedCanonical} key="og:url" />
        <meta property="twitter:url" content={sanitizedCanonical} key="twitter:url" />
        <meta property="og:type" content="website" key="og:type" />
        <meta property="twitter:card" content="summary_large_image" key="twitter:card" />
        {jsonLD && (
          <script
            type="application/ld+json"
            id={`${props?.contentType ? props.contentType : 'blog'}-jsonLd`}
            dangerouslySetInnerHTML={{ __html: jsonLD }}
          />
        )}
        <meta
          id="ogImage"
          property="og:image"
          content={ogImage || "https://cdn.sanity.io/images/bbmnn1wc/production/b5665765dd8b070505dbabeb87f1fc95536b1a83-1200x1200.jpg"}
          key="ogImage"
        />
        {defaultUrlx && (
          <link rel="alternate" hrefLang="x-default" href={defaultUrlx} key="hreflang-x-default" />
        )}
        {alternatePaths.map((alt: AlternatePath) => (
          <link
            rel="alternate"
            hrefLang={alt.hrefLang}
            href={alt.href}
            key={`hreflang-${alt.hrefLang}`}
          />
        ))}
      </Head>
    </>
  )
}
