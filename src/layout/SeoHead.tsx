import Head from 'next/head'
import Script from 'next/script'

import { slugToCapitalized } from '~/utils/common'

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
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="og:title" />
        <meta property="twitter:title" content={title} key="twitter:title" />
        <meta name="description" content={description} key="description" />
        <meta property="og:description" content={description} key="og:description" />
        <meta property="twitter:description" content={description} key="twitter:description" />
        <meta name="keywords" content={keywords} key="keywords" />
        <meta name="robots" content={robots} key="robots" />
        <link rel="canonical" href={canonical} key="canonical" />
        <meta property="og:url" content={canonical} key="og:url" />
        <meta property="twitter:url" content={canonical} key="twitter:url" />
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
      </Head>
    </>
  )
}
